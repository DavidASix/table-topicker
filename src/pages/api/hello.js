// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectToDatabase } from "@/database";


export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  console.log('got database')
  const questionsCollection = db.collection("questions");
  console.log('got collection')
  const allQuestions = await questionsCollection.find({}).toArray();
  console.log('got all qs')
  res.status(200).json(allQuestions);
}
