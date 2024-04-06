import { validateJWT } from "@/utils/jwt";

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
      req.user = await validateJWT(token);
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
