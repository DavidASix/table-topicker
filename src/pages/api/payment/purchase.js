const { STRIPE_SECRET_KEY, DOMAIN } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY);
import auth from "@/middleware/auth";
//import limiter from "@/middleware/rateLimiter";
import reqType from "@/middleware/reqType";
import validateInput from "@/middleware/validateInput";

export default async function handler(req, res) {
  try {
    const { q } = req.query;
    const quantity = q * 1;
    await reqType(req, "GET");
    await auth(req, res);
    // With provided quantity, you get the price as pricePerCreditByQuantity[quantity]
    const pricePerCreditByQuantity = {
      10: 25,
      25: 20,
      50: 15,
      100: 10,
      250: 8,
    };
    await validateInput([
      { name: "quantity", value: quantity, type: "number" },
      {
        name: "value",
        value: pricePerCreditByQuantity[quantity],
        type: "number",
      },
    ]);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: pricePerCreditByQuantity[quantity],
            product_data: {
              name: "AI Topic Credits",
              description: "Credits allowing you to access AI Topics",
            },
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${DOMAIN}/api/payment/addCredits?session_id={CHECKOUT_SESSION_ID}&q=${quantity}&uid=${req.user._id}`,
      cancel_url: `${DOMAIN}#profile`,
    });
    res.redirect(303, session.url);
  } catch (err) {
    console.log(err);
    res.status(err.code || 500).send(err.message || "Server error");
    return;
  }
}
