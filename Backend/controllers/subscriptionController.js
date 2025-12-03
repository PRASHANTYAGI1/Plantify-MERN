import User from "../models/User.js";
import { sendMessage } from "../utils/sendSMS.js";

// Virtual Payment Transaction ID
const generatePaymentId = () =>
  "SUB-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);

export const upgradeToPro = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { planType, amount } = req.body;

    if (!planType || !["monthly", "yearly"].includes(planType)) {
      return res
        .status(400)
        .json({ message: "planType must be 'monthly' or 'yearly'" });
    }

    const monthlyPrice = 199;
    const yearlyPrice = 1999;

    if (planType === "monthly" && amount < monthlyPrice) {
      return res.status(400).json({ message: "Monthly plan requires ₹199." });
    }

    if (planType === "yearly" && amount < yearlyPrice) {
      return res.status(400).json({ message: "Yearly plan requires ₹1999." });
    }

    // Prevent overlapping subscriptions
    if (user.subscriptionActive && user.subscriptionExpiresAt > new Date()) {
      return res.json({
        success: false,
        message: "You already have an active subscription.",
        expiresAt: user.subscriptionExpiresAt,
      });
    }

    // Set subscription expiry
    let expiry = new Date();
    if (planType === "monthly") expiry.setMonth(expiry.getMonth() + 1);
    if (planType === "yearly") expiry.setFullYear(expiry.getFullYear() + 1);

    const txnId = generatePaymentId();

    // Apply subscription rules
    user.subscriptionPlan = "pro";
    user.subscriptionActive = true;
    user.subscriptionExpiresAt = expiry;
    user.mlAccessLevel = "premium";

    // Marketplace rule: Pro sellers can list 10 products per month
    user.productLimit = 10;

    // Reset monthly counters
    user.productsListedThisMonth = 0;

    // Save subscription transaction
    user.subscriptionHistory.push({
      planType,
      amount,
      paymentId: txnId,
      purchasedAt: new Date(),
      expiryDate: expiry,
    });

    await user.save();

    // Add revenue to admin subscription income
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      admin.adminStats = admin.adminStats || {};
      admin.adminStats.subscriptionRevenue =
        (admin.adminStats.subscriptionRevenue || 0) + amount;
      await admin.save();
    }

    // Send WhatsApp confirmation
    if (user.mobile) {
      sendMessage(
        user.mobile,
        `🎉 *Subscription Activated!*\n\nYou are now a *Pro Seller*.\n\nPlan: ${planType.toUpperCase()}\nExpiry: ${expiry.toDateString()}\nPayment ID: ${txnId}\n\nYou can list up to *10 products per month*.`
      );
    }

    return res.json({
      success: true,
      message: "Subscription upgraded successfully!",
      plan: user.subscriptionPlan,
      expiresOn: expiry,
      paymentId: txnId,
    });
  } catch (err) {
    console.log("Upgrade Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
