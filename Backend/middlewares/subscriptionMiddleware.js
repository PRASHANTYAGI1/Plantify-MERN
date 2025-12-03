import User from "../models/User.js";

export const requireSubscription = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  // Check expiry
  if (
    user.subscriptionPlan === "pro" &&
    user.subscriptionExpiresAt &&
    new Date() > new Date(user.subscriptionExpiresAt)
  ) {
    // Auto downgrade
    user.subscriptionPlan = "free";
    user.subscriptionActive = false;
    user.productLimit = 2;
    user.mlAccessLevel = "demo";
    await user.save();

    return res.status(403).json({
      message: "Your Pro subscription expired. Please renew.",
      expired: true,
    });
  }

  if (user.subscriptionPlan !== "pro") {
    return res.status(403).json({
      message: "This feature requires a Pro subscription.",
      upgrade: true,
    });
  }

  next();
};
