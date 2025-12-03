import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { upgradeToPro } from "../controllers/subscriptionController.js";

const router = express.Router();

// POST /api/subscription/upgrade
router.post("/upgrade", protect, upgradeToPro);

export default router;
