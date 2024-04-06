import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import auth from "@/middleware/auth";
import creditsCheck from "@/middleware/creditsCheck";
import axios from "axios";

const instructions = `You are the table topics master at a Toastmasters meeting. 
You will receive a message like this: "MEETING THEME ~ DIFFICULTY RATING" and you will respond with an OPEN ENDED Table Topic question. 
Each question should be unique, DO NOT repeat or rephrase previous questions.
Questions MUST be centered around the meeting theme, and should be between 15 - 75 characters. They MUST end in a question mark.
Avoid using less common words, use plain English.
The difficulty rating identifies how challenging the question should be.
The possible levels are: Easy, Medium, Hard
EASY EXAMPLE: "What is your favorite book?"
HARD EXAMPLE: "What's the biggest lesson failure taught you?"
`;

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
      "question.category": category,
    })
    .toArray();

  // Generate table topic question
  try {
    // Previous prompts on this topic with this user are included
    // in the chat history to avoid repeating topics.

    const userPrompt = {
      role: "user",
      content: `${category} ~ Difficulty: ${difficulty}`,
    };
    const userQuestionHistory = questionsFromCategory.flatMap((q) => [
      userPrompt,
      {
        role: "assistant",
        content: q.question.question,
      },
    ]);

    let messages = [
      {
        role: "system",
        content: instructions,
      },
      ...userQuestionHistory,
    ];

    let topicOptions = [];
    //While loop is used instead of Nvalue > 1 to add the new response as
    // a temporary vaue in messages array to avoid it being repeated
    while (topicOptions.filter((v) => v.role === "assistant").length !== 2) {
      // Request data from Open AI
      let { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          max_tokens: 36,
          temperature: 1.5,
          n: 1,
          messages: [...messages, userPrompt, ...topicOptions],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
          },
        }
      );

      topicOptions.push(data.choices[0].message);
      topicOptions.push(userPrompt);
    }

    const topics = topicOptions
      .filter((v) => v.role === "assistant")
      .map((m) => m.content);
      
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
    await disconnectFromDatabase(userDb.conn);
    res.status(200).json({ topics: topics });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}
