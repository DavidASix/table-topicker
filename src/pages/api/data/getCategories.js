import { connectToDatabase } from "@/database";

/**
 * Retrieves a list of distinct categories from the questions collection.
 * 
 * Request:
 * - method: GET
 * 
 * Response:
 * - A JSON array of distinct categories
 * 
 * Example Response:
 * ["Category 1", "Category 2", "Category 3"]
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
  const { db } = await connectToDatabase('data');
    const collection = db.collection("questions");
    const categories = await collection.distinct("category");

    if (!categories) {
      return res
        .status(404)
        .json({ message: "No categories found" });
    }

    if (!categories.length) {
      return res
        .status(404)
        .json({ message: "No categories found" });
    }

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({message: `Server Error: ${err.message}`})
  }
}