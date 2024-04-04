import { invalidateJWT } from "@/utils/jwt";

/**
 * Invalidates a JWT token to log out the user.
 *
 * Request:
 * - method: GET
 * - cookies:
 *   - jwt (string): The JWT token to invalidate
 *
 * Response:
 * - Redirect to /protected
 */

export default async function handler(req, res) {
	if (req.method !== 'GET') {
	  return res.status(405).json({ error: 'Method not allowed' });
	}
  
    const {jwt} = req.cookies
	if (!jwt) {
	  return res.status(400).json({ error: 'Missing magic link UUID' });
	}
  
	try {
        invalidateJWT(jwt)
	  // Redirect the user to the home page 
	  res.redirect(302, '/protected').end();
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  }