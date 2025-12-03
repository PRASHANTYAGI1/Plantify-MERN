import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },

    stock: { type: Number, required: true, min: 1 },

    category: {
      type: String,
      enum: [
        "seeds",
        "fertilizers",
        "pesticides",
        "tools",
        "machinery",
        "equipments",
        "grains",
        "vegetables",
        "fruits",
        "other",
      ],
      default: "other",
    },

    productImages: { type: [String], default: [] },

    rentalAvailable: { type: Boolean, default: false },
    rentalPricePerDay: { type: Number, default: 0 },
    rentalDeposit: { type: Number, default: 0 },

    location: { type: String, required: true },

    // Commission for orderController
    adminCommissionPercent: { type: Number, default: 20 },

    // Real world listing control
    isActive: { type: Boolean, default: true },
    isOutdated: { type: Boolean, default: false },   // seller forgot to update old listing
    lastUpdated: { type: Date, default: Date.now() },

    // Stats
    views: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    commissionEarned: { type: Number, default: 0 },

    // Tracking month-wise limits for subscribed users
    monthListedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
