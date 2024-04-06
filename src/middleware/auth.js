import { validateJWT } from "@/utils/jwt";
import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import { ObjectId } from 'mongodb';
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
  const token = req.cookies.jwt;
  console.log("Auth Middleware");
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const jwtUser = await validateJWT(token);
      // Get the updated user document from the DB
      const { conn, db } = await connectToDatabase("users");
      const userCol = db.collection("users");
      const id = new ObjectId(jwtUser._id)
      req.user = await userCol.findOne({ _id: id})
      
      await disconnectFromDatabase(conn);
      
      req.authenticated = true
    } catch (error) {
      console.log("User Failed Authentication!");
      req.user = null;
      req.authenticated = null;
    }
  } catch (err) {
    console.log(`Auth Err: ${err.message}`);
  }
};

export default auth;
