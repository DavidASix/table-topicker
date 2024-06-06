
/**
 * 
 * Credits Check middleware to check that user has payment credits available
 * Should only be called after AUTH middleware
 *
 */

const creditsCheck = async (req, res, next) => {
  console.log('Credits Middleware')
  const user = req.user;
  try {
    if (!user) {
      throw { code: 403, message: "Sign in to evaluate credits" };
    }
    if (!user.credits) {
      throw { code: 403, message: "More credits required" };
    }
  } catch (err) {
    console.log(`Credits Err: ${err.message}`);
    throw Object.assign(new Error(err.message || "Unauthorized"), { code: err.code || 401 });
  }
};

export default creditsCheck;
