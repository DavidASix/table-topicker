import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import auth from "@/middleware/auth";
import axios from "axios";

const instructions = `You are the table topics master at a Toastmasters meeting. 
You will receive the meetings theme, and you will respond with an interesting Table Topic prompt in the form of a question. 
Your question should be between 15 to 75 characters, and end in a question mark.
You should avoid using less common words, they words you use should be plain English.
You will also receive a difficulty rating. This identifies how challenging of a question you should ask. 
Any example of an easy question is "What is your favorite book?"
An example of a hard question is "What does love mean to you?"
The possible levels are:
Easy, Medium, Hard, Very Hard`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Apply authentication middleware
  try {
    await auth(req, res);
    if (!req.user || !req.authenticated) {
      const err = new Error("Unauthorized");
      throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
    }
  } catch (error) {
    // Handle errors from middleware (e.g., unauthorized access)
    return res.status(error.statusCode || 500).json({ message: error.message });
  }

  // TODO: Check if user has credits in account

  // Get Body:
  const { category, difficulty } = req.body;

  if (typeof category !== "string" || category.trim() === "") {
    return res.status(400).json({ message: "Category Required" });
  }

  if (!["Easy", "Medium", "Hard", "Very Hard"].includes(difficulty)) {
    return res.status(400).json({ message: "Difficulty Required" });
  }

  // Get previous questions user has seen from this category
  const userDb = await connectToDatabase("users");
  const questionHistoryColl = userDb.db.collection("question-history");
  console.log("Attempting to find history ");
  const questionsFromCategory = await questionHistoryColl
    .find({
      "question.category": category,
      userId: req.user._id,
    })
    .toArray();

  // Generate table topic question
  try {
    // Previous prompts on this topic with this user are included
    // in the chat history to avoid repeating topics.
    const messages = [
      {
        role: "system",
        content: instructions,
      },
      {
        role: "user",
        content: `${category} ~ Difficulty: ${difficulty}`,
      },
      ...questionsFromCategory.map((q) => ({
        role: "assistant",
        content: q.question.question,
      })),
    ]
    // Request data from Open AI
    let { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        max_tokens: 18,
        temperature: 1.15,
        n: 3,
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        },
      }
    );

    console.log(data.usage);
    const topics = data.choices.map((c) => c.message.content);

    if (!topics.length) {
      return res.status(500).json({
        message: "Could not generate topic. You have not been charged.",
      });
    }

    // TODO: reduce credit count
    res.status(200).json({ topics: topics });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}
