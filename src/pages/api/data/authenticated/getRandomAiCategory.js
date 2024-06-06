import axios from "axios";

import reqType from "@/middleware/reqType";
import auth from "@/middleware/auth";
import creditsCheck from "@/middleware/creditsCheck";

const instructions = `You are a ToastMasters assistant bot. 
Your job is to ouput a random ToastMasters meeting theme, for the Table Topics.
The theme should be truely random, but safe for work. It should be under 45 characters.
Only reply with the theme, nothing else. No special characters, no quotes.
`;

/**
 * Counterpart to /api/data/getRandomCategory
 * This function gets a random category from OpenAI, used when user doesn't want to 
 * come up with one.
 *
 * Request:
 *  GET
 *
 * Response:
 * Object containing category. Mirrors free counterpart
 * Example: { category: "Where the wild things are" }
 *
 */

export default async function handler(req, res) {
  try {
    await reqType(req, "GET");
    await auth(req, res);
    // This function does not cost a credit, but if users don't have credits then 
    // They have no reason for using this function, and are disallowed.
    await creditsCheck(req, res);

    let messages = [
      {
        role: "system",
        content: instructions,
      },
    ];

    // Request data from Open AI
    let { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        max_tokens: 36,
        temperature: 1.5,
        n: 1,
        messages: [...messages],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        },
      }
    );

    const category = data.choices[0].message.content;
    res.status(200).json({ category });

  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(err.code).send(err.message);
  }
}
