import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
//import limiter from "@/middleware/rateLimiter";
import auth from "@/middleware/auth";
import reqType from "@/middleware/reqType";

export default async function handler(req, res) {
  try {
    //await limiter(req);
    await reqType(req, "GET");
    await auth(req, res);
    try {
      const { conn, db } = await connectToDatabase("users");
      const questionHistoryCol = db.collection("question-history");

      const result = await questionHistoryCol
        .aggregate([
          { $match: { userId: req.user._id } },
          { $group: { _id: "$speaker", questions: { $sum: 1 } } },
        ])
        .toArray();
      // Result returns :
      // [ { _id: 'guest', questions: 4 }, { _id: 'user', questions: 10 } ]
      const total = result.reduce((total, c) => total + c.questions, 0);
      const totals = {
          total,
          // Initialize zero values for user and guest
          user: 0,
          guest: 0,
          // Iterate over whatever was retrieved from db
          // destructure the reduced object, whether empty or containing 
          // overwrite data for user and guest
          ...result.reduce((acc, v, i) => ({...acc, [v._id]: v.questions}), {})
        };
      await disconnectFromDatabase(conn);
      res.status(200).json(totals);
    } catch (err) {
      console.error(err);
      throw { message: "Error getting data", code: 500 };
    }
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.message);
    return;
  }
}
