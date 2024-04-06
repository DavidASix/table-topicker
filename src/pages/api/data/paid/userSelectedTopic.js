import auth from "@/middleware/auth";
import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";

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

  const { category, topic } = req.body;
  if (
    typeof category !== "string" ||
    category.trim() === "" ||
    typeof topic !== "string" ||
    topic.trim() === ""
  ) {
    return res.status(400).json({ message: "Category and Topic Required" });
  }

  try {
    const dataDb = await connectToDatabase("data");
    const questionColl = dataDb.db.collection("questions");
    // Check if the question exists
    // If it doesn't, insert the question into the question collection
    let question = await questionColl.findOne({
      category,
      question: topic,
    });
    if (!question) {
      question = {
        category: category,
        question: topic,
        premium: true,
      };
      const { insertedId } = await questionColl.insertOne(question);
      question._id = insertedId;
    }
    await disconnectFromDatabase(dataDb.conn);
    
    // Insert the question into the user question history
    const userDb = await connectToDatabase("users");
    const questionHistoryColl = userDb.db.collection("question-history");

    const date = new Date();
    await questionHistoryColl.insertOne({
      userId: req.user._id,
      date,
      question: question,
    });
    await disconnectFromDatabase(userDb.conn);

    res.status(200).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}
