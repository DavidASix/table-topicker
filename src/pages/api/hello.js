// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from "@/database";

const runtime = 'experimental-edge';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const questionsCollection = db.collection("questions");
  const allQuestions = await questionsCollection.find({}).toArray();
  res.status(200).json(allQuestions);
}
