import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import reqType from "@/middleware/reqType";

export default async function handler(req, res) {
  try {
    await reqType(req, "GET");

    const { conn, db } = await connectToDatabase("data");
    const collection = db.collection("questions");
    const categories = await collection.distinct("category",
    { premium: { $ne: true } });

    // Randomly select a category
    const randomIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomIndex];

    await disconnectFromDatabase(conn);
    res.status(200).json({ category: randomCategory });

  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(err.code).send(err.message);
  }
}