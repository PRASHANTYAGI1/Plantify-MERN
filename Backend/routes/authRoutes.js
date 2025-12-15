import express from "express";
import {
  registerUser,
  loginUser,
  getMe, 
  updateUserProfile,
  requestAccountDeletion,
  blockUser,
  unblockUser,
} from "../controllers/authController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import uploadDisk from "../middlewares/upload/multerDisk.js"; // ✅ FIXED

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// SELF PROFILE
router.get("/me", protect, getMe);
router.put(
  "/update",
  protect,
  uploadDisk.single("profileImage"),
  updateUserProfile
);

// USER ACCOUNT DELETION
router.delete("/delete-request", protect, requestAccountDeletion);

// ADMIN CONTROLS
router.put("/block", protect, adminOnly, blockUser);
router.put("/unblock", protect, adminOnly, unblockUser);

export default router;
