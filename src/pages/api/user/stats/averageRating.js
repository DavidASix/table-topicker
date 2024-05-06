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
          {
            $project: {
              convertedRating: {
                $cond: [
                  { $ne: ["$rating", "none"] },
                  { $toInt: "$rating" },
                  null,
                ],
              },
              speaker: 1,
            },
          },
          { $match: { convertedRating: { $ne: null } } },
          {
            $group: {
              _id: "$speaker",
              averageRating: { $avg: "$convertedRating" },
              questions: { $sum: 1 },
            },
          },
        ])
        .toArray();
      // Calculate the total average across all speakers
      const totalQuestions = result.reduce(
        (acc, val) => acc + val.questions,
        0
      );
      const totalRating = result.reduce(
        (a, v) => a + v.averageRating * v.questions,
        0
      );
      const averages = [
        {
          speaker: "total",
          value: totalRating / totalQuestions,
        },
        ...result.map((v) => ({
          speaker: v._id,
          averageRating: v.averageRating,
        })),
      ];

      res.status(200).json(averages);
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
