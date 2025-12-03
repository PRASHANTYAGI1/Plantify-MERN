// src/api/dashboardApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
};

const dummyUserDashboard = () => ({
  summary: {
    totalPurchases: 4,
    totalSpent: 1240,
    repeatSellerRate: 25,
    favoriteCategory: "vegetables",
  },
  charts: {
    monthlySpend: { Jan: 300, Feb: 200, Mar: 400, Apr: 340 },
    dailySpend: {
      "2025-11-01": 120,
      "2025-11-02": 80,
      "2025-11-03": 40,
      "2025-11-04": 100,
    },
    categoryStats: { vegetables: 3, seeds: 1, tools: 0 },
  },
  recentOrders: [],
});

const dummySellerDashboard = () => ({
  summary: {
    totalProducts: 12,
    totalOrders: 34,
    totalRevenue: 15240,
    avgOrderValue: 448,
    walletBalance: 3200,
    repeatBuyers: 6,
  },
  charts: {
    monthlySales: { Jan: 3400, Feb: 2100, Mar: 4200, Apr: 5940 },
    dailySales: { "2025-11-01": 300, "2025-11-02": 400 },
    topProducts: [["Wheat Seeds", 12], ["Fertilizer X", 9], ["Hand Hoe", 5]],
  },
  inventoryStatus: {
    lowStock: [],
    outOfStock: [],
    outdated: [],
  },
  recentOrders: [],
});

const dummyAdminDashboard = () => ({
  summary: {
    totalUsers: 1200,
    totalSellers: 210,
    totalAdmins: 3,
    totalProducts: 3500,
    totalOrders: 9800,
    totalRevenue: 432000,
  },
  charts: {
    monthlyRevenue: { Jan: 12000, Feb: 15000, Mar: 20000 },
    dailyRevenue: {},
    categoryStats: { seeds: 120, tools: 80, fertilizers: 220 },
  },
  insights: {
    topSellers: [{ seller: "Ramesh", totalSales: 25000 }],
    bestProducts: [],
  },
  recentOrders: [],
});

export const getUserDashboard = async () => {
  try {
    const res = await axios.get(`${API_URL}/user`, authHeader());
    return res.data.dashboard || dummyUserDashboard();
  } catch (err) {
    console.warn("getUserDashboard failed, using dummy:", err?.message || err);
    return dummyUserDashboard();
  }
};

export const getSellerDashboard = async () => {
  try {
    const res = await axios.get(`${API_URL}/seller`, authHeader());
    return res.data.dashboard || dummySellerDashboard();
  } catch (err) {
    console.warn("getSellerDashboard failed, using dummy:", err?.message || err);
    return dummySellerDashboard();
  }
};

export const getAdminDashboard = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin`, authHeader());
    return res.data.dashboard || dummyAdminDashboard();
  } catch (err) {
    console.warn("getAdminDashboard failed, using dummy:", err?.message || err);
    return dummyAdminDashboard();
  }
};
