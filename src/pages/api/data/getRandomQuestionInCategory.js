import { connectToDatabase } from "@/database";

/**
 * Retrieves a random question for a specific category.
 * 
 * Request:
 * - method: POST
 * - body:
 *   - category (string): The category for which to fetch a random question
 * 
 * Response:
 * - A JSON object representing a random question
 * 
 * Example Response:
 * {question: 'question text', category: 'category text', id: 'mongoid'}
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase("data");
    const { category } = req.body;

    if (typeof category !== "string" || category.trim() === "") {
      return res
        .status(400)
        .json({ message: "Category must be a non-empty string" });
    }

    const coll = db.collection("questions");
    const randomQuestion = await coll
      .aggregate([{ $match: { category: category } }, { $sample: { size: 1 } }])
      .next();

    if (!randomQuestion) {
      return res
        .status(404)
        .json({ message: "No questions found for this category" });
    }
    res.status(200).json(randomQuestion);
    
  } catch (err) {
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
}
