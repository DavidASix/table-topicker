import { validateJWT } from "@/utils/jwt";
import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import { ObjectId } from "mongodb";
/**
 * Authentication middleware that validates a JWT token and sets the
 * req.user and req.authenticated properties.
 *
 * Request:
 * - cookies:
 *   - jwt (string): The JWT token to validate
 *
 * Response:
 * - 401 Unauthorized with a JSON object containing an error message if the JWT token is missing or invalid
 * - Sets req.user and req.authenticated  to the user object if the JWT token is valid, otherwise sets it to null
 *
 */

const auth = async (req, res, next) => {
  // The initial load of the magic link redirect will not have an accessible cookie
  // Though it will be attached in subsequent requests. To mitigate this, the cookie
  // is stored in a query parameter

  const params = new URLSearchParams(req.url.split("?")[1]);
  const token = req.cookies?.jwt || params.get("t");

  try {
    if (!token) {
      throw new Error("No token");
    }
    const jwtUser = await validateJWT(token);
    if (!jwtUser) {
      throw {message: "Token Expired, Please Log in Again"}
    } 
    // Get the updated user document from the DB
    const { conn, db } = await connectToDatabase("users");
    const userCol = db.collection("users");
    const id = new ObjectId(jwtUser._id);
    req.user = await userCol.findOne({ _id: id });
    await disconnectFromDatabase(conn);
    console.log('User logged in')
  } catch (error) {
    console.log("User Failed Authentication!");
    console.log(`Error: ${error.message}`);
    req.user = false;
    throw Object.assign(new Error(error.message || "Please log in"), { code: error.code || 401 });
  }
};

export default auth;
