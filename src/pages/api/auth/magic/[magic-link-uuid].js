import { connectToDatabase } from "@/database";

/**
 * Validates a magic link and redirects the user to the home page if it's valid.
 * 
 * Request:
 * - method: GET
 * - query:
 *   - magic-link-uuid (string): The UUID of the magic link
 * 
 * Response:
 * - Redirects to the home page if the magic link is valid
 * - A JSON object with an error message if the magic link is invalid or has expired
 * 
 * Error Responses:
 * - 400: Missing magic link UUID
 * - 404: Magic link not found
 * - 401: Link has expired
 * - 500: Server error
 */

export default async function handler(req, res) {
	if (req.method !== 'GET') {
	  return res.status(405).json({ error: 'Method not allowed' });
	}
  
	const magicLinkUuid = req.query['magic-link-uuid'];
  
	if (!magicLinkUuid) {
	  return res.status(400).json({ error: 'Missing magic link UUID' });
	}
  
	try {
	  const { db } = await connectToDatabase("users");
	  const collection = db.collection("magic-links");
  
	  // Find magic link document
	  const magicLinkDoc = await collection.findOne({ magicLink: magicLinkUuid });
  
	  if (!magicLinkDoc) {
		return res.status(404).json({ error: 'Magic link not found' });
	  }
  
	  // Check if the link has expired
	  const currentTime = new Date().getTime() / 1000;
	  if (magicLinkDoc.expireAt < currentTime) {
		return res.status(401).json({ error: 'Link has expired' });
	  }
  
	  // Update document to set valid to false
	  await collection.updateOne({ _id: magicLinkDoc._id }, { $set: { valid: false } });
  
	  // Redirect the user to the home page
	  res.writeHead(302, {
		Location: '/'
	  });
	  res.end();
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  }