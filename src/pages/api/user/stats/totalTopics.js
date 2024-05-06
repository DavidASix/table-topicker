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
      const { db } = await connectToDatabase("users");
      const questionHistoryCol = db.collection("question-history");

      const result = await questionHistoryCol
        .aggregate([
          { $match: { userId: req.user._id } },
          { $group: { _id: "$speaker", questions: { $sum: 1 } } },
        ])
        .toArray();
      const totals = [
        {
          speaker: "total",
          value: result.reduce((p, c) => p.questions + c.questions),
        },
        ...result.map((t) => ({ speaker: t._id, value: t.questions })),
      ];
      
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
