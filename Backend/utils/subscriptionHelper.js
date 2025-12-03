export const checkAndUpdateSubscriptionStatus = async (user) => {
  if (
    user.subscriptionPlan === "pro" &&
    user.subscriptionExpiresAt &&
    new Date() > new Date(user.subscriptionExpiresAt)
  ) {
    // Subscription expired → downgrade
    user.subscriptionPlan = "free";
    user.subscriptionActive = false;
    user.productLimit = 2;
    user.mlAccessLevel = "demo";
    await user.save();
  }

  return user;
};
