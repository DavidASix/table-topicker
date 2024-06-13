const { STRIPE_SECRET_KEY, DOMAIN } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY);
import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import auth from "@/middleware/auth";
//import limiter from "@/middleware/rateLimiter";
import reqType from "@/middleware/reqType";
import validateInput from "@/middleware/validateInput";

export default async function handler(req, res) {
  try {
    const { session_id, q, uid } = req.query;
    const quantity = q * 1;
    
    await reqType(req, "GET");
    await auth(req, res);
    await validateInput([
      { name: "quantity", value: quantity, type: "number" },
      { name: "session_id", value: session_id, type: "string" },
      { name: "uid", value: uid, type: "string" },
    ]);
    // Check that user that's logged in matches the user that just completed the purchase
    if (uid !== String(req.user._id)) {
      throw { code: 403, message: "User ID and request ID mismatch" };
    }

    // Verify stripe session is paid
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session || session?.status !== 'complete') {
        throw { code: 500, message: `Error processing order ${session.id}` };
    }

    const purchaseData = {
        user_id: req.user._id,
        stripe_session_id: session.id,
        amount_total: session.amount_total,
        created: session.created,
        status: session.status,
    }
    
    const userDb = await connectToDatabase("users");
    // Record purchase in db
    const purchaseColl = userDb.db.collection("purchases");
    await purchaseColl.insertOne(purchaseData);
    
    // Reduce credit count for user
    const userColl = userDb.db.collection("users");
    const reduce = await userColl.updateOne(
      { _id: req.user._id },
      { $inc: { credits: quantity } }
    );
    // If modified count is not 1, then a different number of accounts were updated
    // https://mongodb.github.io/node-mongodb-native/6.5/interfaces/UpdateResult.html
    if (reduce.modifiedCount !== 1) {
      throw Object.assign(
        new Error(
          `Updated ${reduce.modifiedCount} user credit counts instead of 1`
        ),
        { statusCode: 500 }
      );
    }
    await disconnectFromDatabase(userDb.conn);

    res.redirect(303, "/");
  } catch (err) {
    console.error(err);
    res.redirect(303, `/?error=${err.message || "An error occured, please contact support"}`);
    return;
  }
}
