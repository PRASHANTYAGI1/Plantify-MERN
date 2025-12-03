import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// =============================
// 🟦 BUYER DASHBOARD
// =============================
export const getUserDashboard = async (req, res) => {
  try {
    const buyerId = req.user.id;

    const orders = await Order.find({ buyer: buyerId })
      .populate("product seller");

    const totalPurchases = orders.length;
    const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);

    // Repeat Purchase Rate
    const sellersOrderedFrom = new Set();
    orders.forEach((o) => sellersOrderedFrom.add(o.seller._id.toString()));
    const uniqueSellers = sellersOrderedFrom.size;
    const repeatSellerRate =
      totalPurchases > 0
        ? (((totalPurchases - uniqueSellers) / totalPurchases) * 100).toFixed(1)
        : 0;

    let monthlySpend = {};
    let categoryStats = {};
    let dailySpend = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString("en", { month: "short" });
      const day = date.toLocaleDateString();

      // Monthly spend
      monthlySpend[month] = (monthlySpend[month] || 0) + order.totalAmount;

      // Daily spend
      dailySpend[day] = (dailySpend[day] || 0) + order.totalAmount;

      // Categories
      const cat = order.product.category || "Other";
      categoryStats[cat] = (categoryStats[cat] || 0) + 1;
    });

    // Most Frequent Category
    const favCategory =
      Object.keys(categoryStats).length > 0
        ? Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0][0]
        : "None";

    return res.json({
      success: true,
      dashboard: {
        summary: {
          totalPurchases,
          totalSpent,
          repeatSellerRate,
          favoriteCategory: favCategory,
        },
        charts: {
          monthlySpend,
          dailySpend,
          categoryStats,
        },
        recentOrders: orders.slice(-6).reverse(),
      },
    });
  } catch (err) {
    console.log("Buyer Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// 🟧 SELLER DASHBOARD 
// =============================
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const products = await Product.find({ seller: sellerId });
    const deliveredOrders = await Order.find({
      seller: sellerId,
      orderStatus: { $in: ["delivered", "in-use"] },
    }).populate("product buyer");

    const walletBalance = (await User.findById(sellerId)).walletBalance;

    const totalProducts = products.length;
    const totalOrders = deliveredOrders.length;
    const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0);

    // Average Order Value
    const avgOrderValue =
      deliveredOrders.length > 0
        ? (totalRevenue / deliveredOrders.length).toFixed(2)
        : 0;

    let monthlySales = {};
    let dailySales = {};
    let topProducts = {};
    let buyerStats = {};

    deliveredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString("en", { month: "short" });
      const day = date.toLocaleDateString();

      // Monthly sales
      monthlySales[month] = (monthlySales[month] || 0) + order.totalAmount;

      // Daily sales
      dailySales[day] = (dailySales[day] || 0) + order.totalAmount;

      // Top products
      topProducts[order.product.title] =
        (topProducts[order.product.title] || 0) + order.quantity;

      // Unique vs repeat buyers
      const buyerId = order.buyer._id.toString();
      buyerStats[buyerId] = (buyerStats[buyerId] || 0) + 1;
    });

    const repeatBuyers = Object.values(buyerStats).filter((count) => count > 1)
      .length;

    return res.json({
      success: true,
      dashboard: {
        summary: {
          totalProducts,
          totalOrders,
          totalRevenue,
          avgOrderValue,
          walletBalance,
          repeatBuyers,
        },

        charts: {
          monthlySales,
          dailySales,
          topProducts: Object.entries(topProducts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5),
        },

        inventoryStatus: {
          lowStock: products.filter((p) => p.stock <= 3),
          outOfStock: products.filter((p) => p.stock === 0),
          outdated: products.filter((p) => p.isOutdated === true),
        },

        recentOrders: deliveredOrders.slice(-10).reverse(),
      },
    });
  } catch (err) {
    console.log("Seller Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// 🟥 ADMIN DASHBOARD 
// =============================
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalSellers = await User.countDocuments({ role: "seller" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const deliveredOrders = await Order.find({
      orderStatus: { $in: ["delivered", "in-use"] },
    }).populate("product seller buyer");

    let totalRevenue = 0;
    let monthlyRevenue = {};
    let dailyRevenue = {};
    let categoryStats = {};
    let sellerPerformance = {};

    deliveredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString("en", { month: "short" });
      const day = date.toLocaleDateString();

      // Commission revenue
      const adminCut =
        (order.totalAmount * order.product.adminCommissionPercent) / 100;
      totalRevenue += adminCut;

      // Monthly revenue
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + adminCut;

      // Daily revenue
      dailyRevenue[day] = (dailyRevenue[day] || 0) + adminCut;

      // Category distribution
      const category = order.product.category || "Other";
      categoryStats[category] = (categoryStats[category] || 0) + 1;

      // Track seller earnings
      const sellerId = order.seller._id.toString();
      sellerPerformance[sellerId] =
        (sellerPerformance[sellerId] || 0) + order.totalAmount;
    });

    // Top 5 sellers
    const topSellers = await Promise.all(
      Object.entries(sellerPerformance)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(async ([sellerId, amount]) => {
          const seller = await User.findById(sellerId);
          return {
            seller: seller.name,
            totalSales: amount,
          };
        })
    );

    const bestPerformingProducts = await Product.find()
      .sort({ ordersCount: -1 })
      .limit(10);

    return res.json({
      success: true,
      dashboard: {
        summary: {
          totalUsers,
          totalSellers,
          totalAdmins,
          totalProducts,
          totalOrders,
          totalRevenue,
        },

        charts: {
          monthlyRevenue,
          dailyRevenue,
          categoryStats,
        },

        insights: {
          topSellers,
          bestProducts: bestPerformingProducts,
        },

        recentOrders: deliveredOrders.slice(-12).reverse(),
      },
    });
  } catch (err) {
    console.log("Admin Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
