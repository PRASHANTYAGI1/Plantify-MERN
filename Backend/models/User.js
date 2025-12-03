import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },

    mobile: { type: String, default: "" },
    location: { type: String, default: "" },
    profileImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // SELLER SYSTEM
    canSell: { type: Boolean, default: true },
    productLimit: { type: Number, default: 2 }, // free plan

    // SUBSCRIPTION
    subscriptionPlan: { type: String, enum: ["free", "pro"], default: "free" },
    subscriptionActive: { type: Boolean, default: false },
    subscriptionExpiresAt: { type: Date, default: null },
    mlAccessLevel: { type: String, enum: ["none", "demo", "premium"], default: "demo" },


    // ADD THIS FIELD
    subscriptionHistory: [
      {
        planType: String,
        amount: Number,
        paymentId: String,
        purchasedAt: Date,
        expiryDate: Date,
      },
    ],

    // FINANCIALS
    walletBalance: { type: Number, default: 0 },

    // PROFILE COMPLETION
    profileStatus: { type: String, enum: ["complete", "incomplete"], default: "incomplete" },

    // AGRICULTURE PROFILE
    agricultureProfile: {
      farmingType: { type: String, default: "" },
      landArea: { type: Number, default: 0 },
      landUnit: { type: String, default: "acre" },
      cropsGrown: { type: [String], default: [] },
      farmingExperience: { type: Number, default: 0 },
      irrigationType: { type: String, default: "rainfed" },
      farmingEquipmentOwned: { type: [String], default: [] },
      organicFarming: { type: Boolean, default: false },
      avgMonthlyProduction: { type: Number, default: 0 },
    },

    // SELLER STATS
    sellerStats: {
      totalSales: { type: Number, default: 0 },
      totalOrdersCompleted: { type: Number, default: 0 },
      totalProductsListed: { type: Number, default: 0 },
      totalCommissionPaid: { type: Number, default: 0 },
    },

    // BUYER STATS
    buyerStats: {
      totalPurchases: { type: Number, default: 0 },
      totalSpent: { type: Number, default: 0 },
    },

    // ADMIN DASHBOARD
    adminStats: {
      totalRevenueCollected: { type: Number, default: 0 },
      totalUsersManaged: { type: Number, default: 0 },
    },

    
// ML SYSTEM
    mlDailyUsage: {
      type: Number,
      default: 0
    },
    mlLastUsedAt: {
      type: Date,
      default: null
    },


    // ACCOUNT DELETION SYSTEM
    deleteRequested: { type: Boolean, default: false },
    deleteAt: { type: Date, default: null },

    // BLOCK SYSTEM
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Safe object
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
