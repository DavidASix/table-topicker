//import limiter from "@/middleware/rateLimiter";
import auth from "@/middleware/auth";
import reqType from "@/middleware/reqType";

export default async function handler(req, res) {
    try {
      //await limiter(req);
    await reqType(req, "GET");
    await auth(req, res);
      res.status(200).send(true);
    } catch (err) {
      console.log(err)
      res.status(err.code).send(err.message);
      return;
    }
  }