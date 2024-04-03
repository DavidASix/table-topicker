import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";

/**
 * Retrieves a random question from the database.
 * 
 * Request:
 * - method: GET
 * 
 * Response:
 * - A JSON object representing a random question
 * {question: 'question text', category: 'category text', id: 'mongoid'}
 * 
 */

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { conn, db } = await connectToDatabase("data");
    const coll = db.collection("questions");

    const randomQuestion = await coll
      .aggregate([{ $sample: { size: 1 } }])
      .next();

    if (!randomQuestion) {
      return res.status(404).json({ message: "No questions found" });
    }

	  await disconnectFromDatabase(conn);
    res.status(200).json(randomQuestion);
  } catch (err) {
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
}
