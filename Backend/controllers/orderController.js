import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { sendMessage } from "../utils/sendSMS.js";
import { generateOtp } from "../utils/generateOtp.js";

// Anti-spam simple tracker
let lastOrderTimestamp = {};

const toNumber = (v) => Number(parseFloat(v) || 0);

const generatePaymentId = () => `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

/**
 * Helper: compute rental period dates
 */
const computeRentalDates = (rentDays) => {
  const start = new Date();
  const end = new Date(start.getTime() + rentDays * 24 * 60 * 60 * 1000);
  return { start, end };
};

/**
 * PLACE ORDER
 * - Handles purchase & rental
 * - For purchase: reserve stock immediately
 * - For rental: accept rentDays, calculate deposit if provided by product
 * - Creates OTP, order with paymentStatus=PENDING
 */
export const placeOrder = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { productId, quantity = 1, orderType = "purchase", rentDays = 0 } = req.body;

    // anti-spam: 10s gap
    const now = Date.now();
    if (lastOrderTimestamp[buyerId] && now - lastOrderTimestamp[buyerId] < 10000) {
      return res.status(429).json({ message: "Please wait 10 seconds before placing another order." });
    }
    lastOrderTimestamp[buyerId] = now;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() === buyerId)
      return res.status(403).json({ message: "You cannot purchase your own product" });

    // prevent duplicate active orders for same product
    const active = await Order.findOne({
      buyer: buyerId,
      product: productId,
      orderStatus: { $in: ["pending", "shipped", "in-use"] },
    });
    if (active) return res.status(400).json({ message: "You already have an active order for this product" });

    const seller = await User.findById(product.seller);
    const buyer = await User.findById(buyerId);
    if (!seller || !buyer) return res.status(400).json({ message: "Buyer or seller not found" });

    let totalAmount = 0;
    let deposit = 0;
    let rentalStart = null;
    let rentalEnd = null;

    if (orderType === "purchase") {
      if (product.stock < quantity) return res.status(400).json({ message: "Not enough stock" });
      totalAmount = toNumber(product.price) * toNumber(quantity);
      product.stock -= quantity; // reserve
      await product.save();
    } else if (orderType === "rental") {
      if (!product.rentalAvailable) return res.status(400).json({ message: "Product not available for rent" });
      if (!rentDays || rentDays <= 0) return res.status(400).json({ message: "Invalid rentDays" });

      const rentCost = toNumber(product.rentalPricePerDay) * toNumber(rentDays);
      // product may define a deposit amount (optional). Default 0.
      deposit = toNumber(product.rentalDeposit || 0);
      totalAmount = rentCost + deposit;

      // compute rental dates
      const { start, end } = computeRentalDates(rentDays);
      rentalStart = start;
      rentalEnd = end;
    } else {
      return res.status(400).json({ message: "Invalid orderType" });
    }

    const otp = generateOtp();

    const order = await Order.create({
      buyer: buyerId,
      seller: product.seller,
      product: productId,
      quantity,
      orderType,
      rentDays: orderType === "rental" ? rentDays : 0,
      rentalStart,
      rentalEnd,
      deposit,
      totalAmount,
      deliveryOtp: otp,
      paymentStatus: "PENDING",
      orderStatus: "pending",
      sellerViewed: false,
    });

    // notify buyer & seller
    sendMessage(
      buyer.mobile,
      `🛒 Order Placed: ${product.title}\nQty: ${quantity}\nAmount: ₹${totalAmount}\nDelivery OTP: ${otp}`
    );

    sendMessage(
      seller.mobile,
      `📦 New Order Received: ${product.title}\nQty: ${quantity}\nAmount: ₹${totalAmount}\nPlease prepare shipment.`
    );

    // low stock alert for purchase
    if (orderType === "purchase" && product.stock <= 5) {
      sendMessage(seller.mobile, `⚠️ Low Stock: '${product.title}' only ${product.stock} left.`);
    }

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("placeOrder:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * sellerConfirmShipment
 * - seller marks as shipped
 */
export const sellerConfirmShipment = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.seller.toString() !== sellerId) return res.status(403).json({ message: "Not authorized" });

    if (order.orderStatus !== "pending") return res.status(400).json({ message: "Only pending orders can be shipped" });

    order.orderStatus = order.orderType === "rental" ? "shipped" : "shipped";
    order.shippedAt = new Date();
    await order.save();

    const buyer = await User.findById(order.buyer);
    sendMessage(buyer.mobile, `📦 Your order '${order.product.title}' has been shipped. OTP: ${order.deliveryOtp}`);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("sellerConfirmShipment:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * confirmDelivery
 * - buyer confirms with OTP and provides virtual paymentTransactionId
 * - for purchase: credits seller (after admin cut)
 * - for rental: credits seller only rent portion; deposit is held by platform (admin) until return
 *
 * Request body: { orderId, otp, paymentTransactionId }
 */
export const confirmDelivery = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { orderId, otp, paymentTransactionId } = req.body;

    if (!paymentTransactionId) return res.status(400).json({ message: "paymentTransactionId required" });

    const order = await Order.findById(orderId).populate("product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.buyer.toString() !== buyerId) return res.status(403).json({ message: "Not authorized" });

    if (!["pending", "shipped"].includes(order.orderStatus))
      return res.status(400).json({ message: "Order not in confirmable state" });

    if (order.deliveryOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    // mark delivered
    order.orderStatus = order.orderType === "rental" ? "in-use" : "delivered";
    order.deliveredAt = new Date();
    order.deliveryOtp = null;
    order.paymentStatus = "PAID";
    order.paymentTransactionId = paymentTransactionId;

    // compute settlement
    const product = await Product.findById(order.product._id);
    const seller = await User.findById(order.seller);
    const admin = await User.findOne({ role: "admin" });

    const totalAmount = toNumber(order.totalAmount); // includes deposit for rentals
    const adminCutPercent = toNumber(product.adminCommissionPercent || 5);
    // Admin cut applies only to the earned amount; for rental, apply cut on rent (not deposit)
    let adminCut = 0;
    let sellerEarning = 0;

    if (order.orderType === "purchase") {
      adminCut = (totalAmount * adminCutPercent) / 100;
      sellerEarning = totalAmount - adminCut;
      // credit seller immediately
      seller.walletBalance = toNumber(seller.walletBalance) + sellerEarning;
    } else {
      // rental: assume totalAmount = rent + deposit
      const deposit = toNumber(order.deposit || 0);
      const rentPart = totalAmount - deposit;
      adminCut = (rentPart * adminCutPercent) / 100;
      sellerEarning = rentPart - adminCut;
      // credit seller the rent portion now; deposit kept by platform (admin) as escrow
      seller.walletBalance = toNumber(seller.walletBalance) + sellerEarning;
      // admin collects commission + holds deposit in adminStats. We'll record deposit in adminStats as 'heldDeposit'
      if (admin) {
        admin.adminStats = admin.adminStats || {};
        admin.adminStats.heldDeposit = toNumber(admin.adminStats.heldDeposit || 0) + deposit;
      }
    }

    // persist seller/admin updates
    seller.sellerStats = seller.sellerStats || {};
    seller.sellerStats.totalSales = toNumber(seller.sellerStats.totalSales) + totalAmount;
    seller.sellerStats.totalCommissionPaid = toNumber(seller.sellerStats.totalCommissionPaid) + adminCut;
    await seller.save();

    if (admin) {
      admin.adminStats = admin.adminStats || {};
      admin.adminStats.totalRevenueCollected = toNumber(admin.adminStats.totalRevenueCollected || 0) + adminCut;
      await admin.save();
    }

    order.adminCommission = adminCut;
    order.sellerEarnings = sellerEarning;
    order.sellerViewed = false; // show popup to seller
    await order.save();

    // notifications
    const buyer = await User.findById(order.buyer);
    sendMessage(buyer.mobile, `🎉 Delivered & Payment recorded. Transaction: ${paymentTransactionId}`);
    sendMessage(seller.mobile, `💰 Payment recorded. Earning: ₹${sellerEarning}. Transaction: ${paymentTransactionId}`);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("confirmDelivery:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * buyerRequestReturn
 * - Buyer requests return (rental end or purchase return)
 */
export const buyerRequestReturn = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId).populate("product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.buyer.toString() !== buyerId) return res.status(403).json({ message: "Not authorized" });

    // allow return for rentals in-use, or purchases delivered
    const allowed =
      (order.orderType === "rental" && order.orderStatus === "in-use") ||
      (order.orderType === "purchase" && order.orderStatus === "delivered");

    if (!allowed) return res.status(400).json({ message: "Return not allowed at this stage" });

    order.orderStatus = "return-requested";
    order.returnRequestedAt = new Date();
    order.returnRequestedBy = buyerId;
    await order.save();

    // notify seller
    const seller = await User.findById(order.seller);
    sendMessage(seller.mobile, `⚠️ Return requested for order ${order._id} - Product: ${order.product.title}`);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("buyerRequestReturn:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * sellerConfirmReturn
 * - Seller confirms they received the returned item
 * - For rental: platform returns deposit to buyer (refund simulation)
 * - For purchase: you may implement refund rules (here we simply set returned)
 */
export const sellerConfirmReturn = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.seller.toString() !== sellerId) return res.status(403).json({ message: "Not authorized" });

    if (order.orderStatus !== "return-requested") return res.status(400).json({ message: "Return not requested" });

    order.orderStatus = "returned";
    order.returnConfirmedAt = new Date();

    // handle deposit refund for rental
    if (order.orderType === "rental") {
      const deposit = toNumber(order.deposit || 0);
      // refund simulation: we will decrement adminStats.heldDeposit and (optionally) mark refunded to buyer via a simulated field
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        admin.adminStats = admin.adminStats || {};
        admin.adminStats.heldDeposit = toNumber(admin.adminStats.heldDeposit || 0) - deposit;
        admin.adminStats.totalDepositsReturned = toNumber(admin.adminStats.totalDepositsReturned || 0) + deposit;
        await admin.save();
      }

      // Optionally: mark buyer wallet credited with deposit refund (since virtual no real money)
      const buyer = await User.findById(order.buyer);
      if (buyer) {
        buyer.walletBalance = toNumber(buyer.walletBalance) + deposit;
        await buyer.save();
      }
    }

    // For purchase returns you can implement refund to buyer and debit seller; skipping automatic money reversal here (business decision).
    await order.save();

    // notify buyer & seller
    const buyer = await User.findById(order.buyer);
    sendMessage(buyer.mobile, `↩️ Your return for ${order.product.title} has been accepted. Order: ${order._id}`);
    sendMessage(order.seller.mobile, `✅ You confirmed return for order ${order._id}`);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("sellerConfirmReturn:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * extendRental
 * - Buyer requests rental extension for in-use rental items
 */
export const extendRental = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { orderId, extraDays } = req.body;
    if (!extraDays || extraDays <= 0) return res.status(400).json({ message: "Invalid extraDays" });

    const order = await Order.findById(orderId).populate("product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.buyer.toString() !== buyerId) return res.status(403).json({ message: "Not authorized" });

    if (order.orderType !== "rental" || order.orderStatus !== "in-use")
      return res.status(400).json({ message: "Only active rentals can be extended" });

    const product = order.product;
    const extraCost = toNumber(product.rentalPricePerDay) * toNumber(extraDays);
    const newRentDays = toNumber(order.rentDays) + toNumber(extraDays);
    const newEnd = new Date(new Date(order.rentalEnd).getTime() + extraDays * 24 * 60 * 60 * 1000);

    // For simplicity we expect buyer to pay externally and provide a paymentTransactionId in a follow-up confirmDelivery-like call.
    // Here we just update the order with new dates and increased totalAmount (deposit unchanged)
    order.rentDays = newRentDays;
    order.rentalEnd = newEnd;
    order.totalAmount = toNumber(order.totalAmount) + extraCost; // deposit is included already if any
    await order.save();

    // notify seller/admin/ buyer
    const buyer = await User.findById(buyerId);
    sendMessage(buyer.mobile, `🔁 Rental extended by ${extraDays} days. Extra charge: ₹${extraCost}.`);
    const seller = await User.findById(order.seller);
    sendMessage(seller.mobile, `🔁 Rental for order ${order._id} extended by ${extraDays} days.`);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("extendRental:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * getMyOrders - buyer
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("product seller", "title price productImages name mobile");
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("getMyOrders:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * getSellerOrders - seller dashboard (to show popup when sellerViewed=false and orderStatus delivered/in-use)
 */
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const orders = await Order.find({ seller: sellerId }).populate("product buyer", "title price name mobile");
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error("getSellerOrders:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * markSellerViewed - seller dismisses popup
 */
export const markSellerViewed = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.seller.toString() !== sellerId) return res.status(403).json({ message: "Not authorized" });

    order.sellerViewed = true;
    await order.save();
    return res.json({ success: true, order });
  } catch (err) {
    console.error("markSellerViewed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * cancelOrder - buyer cancels when pending
 */
export const cancelOrder = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.buyer.toString() !== buyerId) return res.status(403).json({ message: "Not authorized" });
    if (order.orderStatus !== "pending") return res.status(400).json({ message: "Only pending orders can be cancelled" });

    // restore stock if purchase
    if (order.orderType === "purchase") {
      const product = await Product.findById(order.product._id);
      product.stock = toNumber(product.stock) + toNumber(order.quantity);
      await product.save();
    }

    order.orderStatus = "cancelled";
    await order.save();

    const seller = await User.findById(order.seller);
    const buyer = await User.findById(order.buyer);
    sendMessage(buyer.mobile, `❌ Your order ${order._id} has been cancelled.`);
    sendMessage(seller.mobile, `⚠️ Order ${order._id} has been cancelled by buyer.`);

    return res.json({ success: true, order });
  } catch (err) {
    console.error("cancelOrder:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
