import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
//import limiter from "@/middleware/rateLimiter";
import auth from "@/middleware/auth";
import reqType from "@/middleware/reqType";
import validateInput from "@/middleware/validateInput";

export default async function handler(req, res) {
  try {
    //await limiter(req);
    await reqType(req, "POST");
    await auth(req, res);
    const { date, duration, rating, speaker, topic } = req.body;
    console.log(typeof date)
    await validateInput([
      { name: "date", value: date, type: "string" },
      { name: "minute", value: duration?.m, type: "number" },
      { name: "second", value: duration?.s, type: "number" },
      { name: "rating", value: rating, type: "string" },
      { name: "speaker", value: speaker, type: "string" },
      { name: "topic", value: topic, type: "object" },
    ]);
    try {
      const { db } = await connectToDatabase("users");
      const questionHistoryCol = db.collection("question-history");
      const insertData = {
        userId: req.user._id,
        date,
        duration,
        topic,
        speaker,
        rating,
      };
      await questionHistoryCol.insertOne(insertData);
      console.log('Inserted new data:')
      console.log(insertData)
      res.status(200).send(true);
    } catch (err) {
      console.error(err);
      throw { message: "Error inserting data", code: 500 };
    }
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.message);
    return;
  }
}
