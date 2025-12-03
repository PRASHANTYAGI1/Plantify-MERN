import User from "../models/User.js";

export const mlQuotaCheck = async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) return res.status(404).json({ message: "User not found" });

  const today = new Date().toDateString();
  const lastUsed = user.mlLastUsedAt ? user.mlLastUsedAt.toDateString() : null;

  // Reset daily usage at the start of a new day
  if (today !== lastUsed) {
    user.mlDailyUsage = 0;
    await user.save();
  }

  // If user is Pro → unlimited scans
  if (user.subscriptionPlan === "pro" && user.subscriptionActive === true) {
    return next();
  }

  // FREE PLAN → Max 5 scans/day for BOTH models combined
  const DAILY_LIMIT = 5;
  if (user.mlDailyUsage >= DAILY_LIMIT) {
    return res.status(403).json({
      message: `Daily ML usage limit reached. Free users get ${DAILY_LIMIT} scans/day. Upgrade to Pro for unlimited usage.`,
    });
  }

  // Allow the scan & increment usage
  user.mlDailyUsage += 1;
  user.mlLastUsedAt = new Date();
  await user.save();

  next();
};
