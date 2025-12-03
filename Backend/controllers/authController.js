import User from "../models/User.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryUpload.js";

// -----------------------------------------------------
// JWT Helper
// -----------------------------------------------------
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// -----------------------------------------------------
// PROFILE COMPLETION CHECKER
// -----------------------------------------------------
const checkProfileCompletion = (user) => {
  const u = user;

  if (
    u.mobile &&
    u.location &&
    u.profileImage &&
    u.profileImage !== "https://cdn-icons-png.flaticon.com/512/149/149071.png" &&
    u.agricultureProfile.farmingType &&
    u.agricultureProfile.landArea > 0
  ) {
    return "complete";
  }

  return "incomplete";
};

// -----------------------------------------------------
// REGISTER USER (clean signup)
// -----------------------------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email & password required" });
    }

    // Optional: Validate role if provided
    if (role && role !== "user" && role !== "admin") {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user.toSafeObject(),
      token: generateToken(user),
    });

  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// -----------------------------------------------------
// LOGIN USER
// -----------------------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Both fields required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.isBlocked)
      return res.status(403).json({
        message: `Your account is blocked. Reason: ${user.blockReason}`,
      });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: user.toSafeObject(),
      token: generateToken(user),
    });

  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// UPDATE PROFILE 
// -----------------------------------------------------
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let updates = req.body;

    // -----------------------------
    // HANDLE PROFILE IMAGE UPLOAD
    // -----------------------------
    if (req.file) {
      const newUrl = await uploadFileToCloudinary(
        req.file.path,
        "farm-users"
      );

      updates.profileImage = newUrl;

      // Delete old image if NOT default
      if (user.profileImage && !user.profileImage.includes("149071")) {
        try {
          const publicId = user.profileImage.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`farm-users/${publicId}`);
        } catch {}
      }
    }

    // -----------------------------
    // HANDLE AGRICULTURE PROFILE
    // -----------------------------
    if (updates.agricultureProfile) {
      user.agricultureProfile = {
        ...user.agricultureProfile,
        ...updates.agricultureProfile,
      };
      delete updates.agricultureProfile;
    }

    // -----------------------------
    // NORMAL FIELD UPDATES
    // -----------------------------
    Object.assign(user, updates);

    // -----------------------------
    // RECHECK PROFILE COMPLETION
    // -----------------------------
    user.profileStatus = checkProfileCompletion(user);

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated",
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.log("Update Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// -----------------------------------------------------
// GET ME (current logged in user)
// -----------------------------------------------------
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileStatus = checkProfileCompletion(user);
    await user.save();

    let extraData = {};

    if (user.role === "admin") {
      const totalUsers = await User.countDocuments();
      const totalAdmins = await User.countDocuments({ role: "admin" });
      const farmers = await User.countDocuments({ role: "user" });

      extraData = {
        adminStats: {
          totalUsersManaged: totalUsers,
          totalAdmins,
          totalFarmers: farmers,
          totalRevenueCollected: user.adminStats.totalRevenueCollected,
        },
      };
    }

    return res.json({
      success: true,
      user: { ...user.toSafeObject(), profileStatus: user.profileStatus, ...extraData },
    });

  } catch (err) {
    console.log("GetMe Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// USER → REQUEST ACCOUNT DELETION (auto delete after 30 days)
// -----------------------------------------------------
export const requestAccountDeletion = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.deleteRequested = true;
    user.deleteAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await user.save();

    res.json({
      success: true,
      message: "Your account is now scheduled for deletion within 30 days.",
    });

  } catch (err) {
    console.log("Delete Request Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// ADMIN → BLOCK USER
// -----------------------------------------------------
export const blockUser = async (req, res) => {
  try {
    const { userId, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = true;
    user.blockReason = reason || "Policy violation";

    await user.save();

    res.json({ success: true, message: "User has been blocked." });

  } catch (err) {
    console.log("Block Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// ADMIN → UNBLOCK USER
// -----------------------------------------------------
export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    user.blockReason = "";

    await user.save();

    res.json({ success: true, message: "User has been unblocked." });

  } catch (err) {
    console.log("Unblock Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
