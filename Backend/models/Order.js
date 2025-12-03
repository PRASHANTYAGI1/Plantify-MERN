import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    quantity: { type: Number, default: 1 },

    // purchase | rental
    orderType: {
      type: String,
      enum: ["purchase", "rental"],
      default: "purchase",
    },

    // for rentals
    rentDays: { type: Number, default: 0 },
    rentalStart: { type: Date },
    rentalEnd: { type: Date },
    deposit: { type: Number, default: 0 }, // refundable deposit for rentals

    totalAmount: { type: Number, required: true }, // includes rent + deposit for rental, or purchase price

    // lifecycle
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "shipped",
        "in-use",         // rented and in use
        "delivered",      // delivered for purchase OR delivered and payment recorded
        "return-requested", // buyer asked return (rental or purchase)
        "returned",       // returned & deposit processed
        "cancelled"
      ],
      default: "pending",
    },

    shippedAt: { type: Date },
    deliveredAt: { type: Date },

    // OTP for delivery verification
    deliveryOtp: { type: String },

    // Payment
    paymentStatus: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
    paymentTransactionId: { type: String }, // virtual payment id

    // admin + seller settlement
    adminCommission: { type: Number, default: 0 },
    sellerEarnings: { type: Number, default: 0 },

    // return workflow
    returnRequestedAt: { type: Date },
    returnRequestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    returnConfirmedAt: { type: Date },

    // UI flag for seller popup
    sellerViewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// helpful indexes
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ orderStatus: 1 });

export default mongoose.model("Order", orderSchema);
