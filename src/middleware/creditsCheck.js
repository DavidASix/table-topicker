
const creditsCheck = async (req, res, next) => {
  console.log('Credits Middleware')
  const user = req.user;
  try {
    if (!user) {
      return res.status(402).json({ message: "Sign in to evaluate credits" });
    }
    if (!user.credits) {
      return res.status(402).json({message: 'More credits required'})
    }
  } catch (err) {
    console.log(`Auth Err: ${err.message}`);
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }
};

export default creditsCheck;
