import User from "../models/User.js";

export const incrementMLUsage = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  user.mlDailyUsage += 1;
  user.mlLastUsedAt = new Date();

  await user.save();
};
