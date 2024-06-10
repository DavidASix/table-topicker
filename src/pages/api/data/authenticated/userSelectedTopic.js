import auth from "@/middleware/auth";
//import limiter from "@/middleware/rateLimiter";
import reqType from "@/middleware/reqType";
import validateInput from "@/middleware/validateInput";
import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";

export default async function handler(req, res) {
  const { category, question } = req.body;
  try {
    await reqType(req, "POST");
    await auth(req, res);
    if (!req.user) {
        throw { code: 405, message: "Incorrect request type" };
    }
    console.log({category, question})
    await validateInput([
      {name: 'category', value: category, type: 'string'},
      {name: 'question', value: question, type: 'string'},
    ])
  } catch (error) {
    // Handle errors from middleware (e.g., unauthorized access)
    return res.status(error.statusCode || 500).json({ message: error.message });
  }

  try {
    const dataDb = await connectToDatabase("data");
    const questionColl = dataDb.db.collection("questions");
    // Check if the question exists
    // If it doesn't, insert the question into the question collection
    let topic = await questionColl.findOne({
      category,
      question
    });
    if (!topic) {
      topic = {
        category,
        question,
        premium: true,
      };
      const { insertedId } = await questionColl.insertOne(topic);
      topic._id = insertedId;
    }
    await disconnectFromDatabase(dataDb.conn);
    /*
    // Insert the question into the user question history
    const userDb = await connectToDatabase("users");
    const questionHistoryColl = userDb.db.collection("question-history");

    const date = new Date();
    await questionHistoryColl.insertOne({
      userId: req.user._id,
      date,
      question: topic,
    });
    await disconnectFromDatabase(userDb.conn);
  */
    res.status(200).json({success: true});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
}
