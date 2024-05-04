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
    const { page, topicsPerPage } = req.body;
    await validateInput([
      { name: "page", value: page, type: "number" },
      { name: "topicsPerPage", value: topicsPerPage, type: "number" },
    ]);
    try {
      const { db } = await connectToDatabase("users");
      const questionHistoryCol = db.collection("question-history");
      
      const userQuestionHistory = await questionHistoryCol
        .find({ userId: req.user._id })
        .sort({ date: 1 })
        .skip((page - 1) * topicsPerPage)
        .limit(topicsPerPage)
        .toArray();
      res.status(200).json(userQuestionHistory);
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
