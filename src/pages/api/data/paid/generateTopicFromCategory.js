import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import auth from "@/middleware/auth";
import creditsCheck from "@/middleware/creditsCheck";
import axios from "axios";

const instructions = `You are the table topics master at a Toastmasters meeting. 
You will receive the meetings theme, and you will respond with an interesting Table Topic prompt in the form of a question. 
Each topic you send should be unique, DO NOT repeat topics from the conversation and DO NOT rephrase old questions.
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
    await creditsCheck(req, res);
  } catch (error) {
    // Handle errors from middleware (e.g., unauthorized access)
    return res.status(error.statusCode || 500).json({ message: error.message });
  }

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
      userId: req.user._id,
      'question.category': category
    })
    .toArray();
    
  // Generate table topic question
  try {
    // Previous prompts on this topic with this user are included
    // in the chat history to avoid repeating topics.
    const questions = questionsFromCategory.map((q) => ({
      role: "assistant",
      content: q.question.question,
    }));

    const messages = [
      {
        role: "system",
        content: instructions,
      },
      ...questions,
      {
        role: "user",
        content: `${category} ~ Difficulty: ${difficulty}`,
      },
    ];

    console.log(messages)

    // TODO: Switch the n value to a while loop, adding the new response as
    // a temporary vaue in messages array to avoid it being repeated
    // Request data from Open AI
    let { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        max_tokens: 36,
        temperature: 1.5,
        n: 2,
        messages,
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

    // Reduce credit count for user
    const userColl = userDb.db.collection("users");
    const reduce = await userColl.updateOne(
      { _id: req.user._id },
      { $inc: { credits: -1 } }
    );
    // If modified count is not 1, then a different number of accounts were updated
    // https://mongodb.github.io/node-mongodb-native/6.5/interfaces/UpdateResult.html
    if (reduce.modifiedCount !== 1) {
      throw Object.assign(
        new Error(
          `Updated ${reduce.modifiedCount} user credit counts instead of 1`
        ),
        { statusCode: 500 }
      );
    }
    await disconnectFromDatabase(userDb.conn)
    res.status(200).json({ topics: topics });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}
