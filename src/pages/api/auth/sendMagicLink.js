import { connectToDatabase, disconnectFromDatabase } from "@/utils/database";
import createMagicLinkEmail from "@/utils/createMagicLinkEmail";

import axios from "axios";
import { v4 as uuid } from "uuid";
const { DOMAIN, MG_API_KEY, MG_URL, MG_DOMAIN } = process.env;

/**
 * Sends a magic link for login to the user's email.
 *
 * Request:
 * - method: POST
 * - body:
 *   - email (string): The email address of the user
 *
 * Response:
 * - A JSON object with success status, message, and the inserted data
 *
 * Example Response:
 * {
 *   success: true,
 *   message: 'Email Sent',
 *   insertData: {
 *     userId: 'user-id'
 *     magicLink: 'magic-link-uuid',
 *     valid: true,
 *     expireAt: 'expire-date',
 *   }
 * }
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { conn, db } = await connectToDatabase("users");
    const magicLinkCol = db.collection("magic-links");
    const userCol = db.collection("users");

    // Validate the input data
    const { email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (typeof email !== "string" || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Valid Email Required" });
    }

    // Create a user if one doesn't exist for this email
    const existingUser = await userCol.findOne({ email });
    let userId = existingUser?._id;

    // If email is not in use, create a new user
    if (!existingUser) {
      const newUserInsert = {
        email,
        accountCreationDate: new Date(),
        firstLogin: true,
      };
      const newUser = await userCol.insertOne(newUserInsert);
      userId = newUser.insertedId;
    }

    // Generate random hex string for the magic link url
    const magicLinkUuid = uuid();
    const magicUrl = `${DOMAIN}/api/auth/magic/${magicLinkUuid}`;

    // Insert magic link and user info into the collection
    const insertData = {
      userId,
      magicLink: magicLinkUuid,
      valid: true,
      expireAt: new Date(Date.now() + 1000 * 60 * 60),
    };
    await magicLinkCol.insertOne(insertData);

    // Create email paramters for MailGun
    const credentials = btoa(`api:${MG_API_KEY}`);
    const mg_config = {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const content = {
      from: `Table Topicker <no-reply@${MG_DOMAIN}>`,
      to: email,
      subject: "Table Topicker Magic Link",
      text: `Welcome to Table Topicker! \nPlease click this link to log in: \n\n${magicUrl}`,
      html: createMagicLinkEmail(magicUrl),
    };

    try {
      // Email the user the new code
      await axios.post(`${MG_URL}/messages`, content, mg_config);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Error sending email" });
    }

    // Disconnect from DB and send final response
    await disconnectFromDatabase(conn);
    return res.status(200).json({ success: true, message: "Email Sent" });
  } catch (err) {
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
}
