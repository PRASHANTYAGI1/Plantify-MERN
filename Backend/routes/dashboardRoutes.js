import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getUserDashboard, getSellerDashboard, getAdminDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/user", protect, getUserDashboard);
router.get("/seller", protect, getSellerDashboard);
router.get("/admin", protect, getAdminDashboard);

export default router;
