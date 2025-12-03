import jwt from "jsonwebtoken";
import User from "../models/User.js";

// PROTECT ROUTES

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user
    req.user = await User.findById(decoded.id).select("_id role canSell");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.log("Auth Error:", err);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};


// ADMIN ONLY
export const adminOnly = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });

  next();
};
