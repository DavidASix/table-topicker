import { connectToDatabase } from "@/database";

/**
 * Retrieves a list of questions for a specific category.
 * 
 * Request:
 * - method: POST
 * - body:
 *   - category (string): The category for which to fetch questions
 * 
 * Response:
 * - A JSON array of questions
 * 
 * Example Response:
 * [
 * {question: 'question text', category: 'category text', id: 'mongoid'},
 * {question: 'question text', category: 'category text', id: 'mongoid'},
 * ]
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase("data");
    const { category } = req.body;

    if (typeof category !== "string" || category.trim() === "") {
      return res.status(400).json({ message: "Category Required" });
    }

    const coll = db.collection("questions");
    const questions = await coll.find({ category: category }).toArray();

    if (!questions) {
      return res
        .status(404)
        .json({ message: "No questions found for this category" });
    }

    if (!questions.length) {
      return res
        .status(404)
        .json({ message: "No questions found for this category" });
    }

    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
}
