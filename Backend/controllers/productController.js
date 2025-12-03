import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import cloudinary from "../config/cloudinary.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryUpload.js";
import { sendMessage } from "../utils/sendSMS.js";

// Reset monthly product usage for PRO sellers
const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// =====================================================================
// ADD PRODUCT
// =====================================================================

export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const seller = await User.findById(sellerId);

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    if (!seller.canSell)
      return res
        .status(403)
        .json({ message: "You are not allowed to sell products" });

    // Ensure sellerStats exists
    if (!seller.sellerStats) {
      seller.sellerStats = { totalProductsListed: 0 };
    }

    // FREE PLAN LIMIT
    if (seller.subscriptionPlan === "free") {
      const totalProducts = await Product.countDocuments({ seller: sellerId });
      if (totalProducts >= 2) {
        return res.status(403).json({
          message: "Free users can list only 2 products. Upgrade to Pro.",
        });
      }
    }

    // PRO PLAN LIMIT
    if (seller.subscriptionPlan === "pro") {
      const monthlyCount = await Product.countDocuments({
        seller: sellerId,
        createdAt: { $gte: getStartOfMonth() },
      });

      if (monthlyCount >= 10) {
        return res.status(403).json({
          message:
            "Monthly product limit reached (10). Upgrade for unlimited listing.",
        });
      }
    }

    // Extract details
    const {
      title,
      description,
      price,
      stock,
      category,
      rentalAvailable,
      rentalPricePerDay,
      rentalDeposit,
    } = req.body;

    if (!title || !description || !price || !stock)
      return res.status(400).json({
        message: "Title, description, price, and stock are required.",
      });

    // Upload images to cloudinary
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      try {
        for (const f of req.files) {
          const uploaded = await uploadFileToCloudinary(
            f.path,
            "farm-products"
          );
          imageUrls.push(uploaded);
        }
      } catch (err) {
        console.log("Cloudinary Upload Error:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // Create product
    const product = await Product.create({
      seller: sellerId,
      title,
      description,
      price,
      stock,
      category,
      rentalAvailable,
      rentalPricePerDay,
      rentalDeposit,
      productImages: imageUrls,
      location: seller.location,
      adminCommissionPercent: seller.subscriptionPlan === "free" ? 30 : 15,
      createdAt: new Date(),
    });

    seller.sellerStats.totalProductsListed += 1;
    await seller.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.log("Add Product Error:", err.message, err);
    return res.status(500).json({ message: "Server error. Check logs." });
  }
};

// =====================================================================
// UPDATE PRODUCT — FINAL FIXED VERSION
// =====================================================================
export const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only product owner can edit
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized — you can only edit your own product",
      });
    }

    const updates = req.body;

    // ---------------------------------------------------------
    // FIX rentalAvailable BUG (coming as ["false", "false"])
    // ---------------------------------------------------------
    if (updates.rentalAvailable !== undefined) {
      if (Array.isArray(updates.rentalAvailable)) {
        updates.rentalAvailable = updates.rentalAvailable[0];
      }
      updates.rentalAvailable =
        updates.rentalAvailable === "true" || updates.rentalAvailable === true;
    }

    // ---------------------------------------------------------
    // IMAGE UPDATE
    // ---------------------------------------------------------
    if (req.files && req.files.length > 0) {
      // delete old images
      for (const img of product.productImages) {
        try {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`farm-products/${publicId}`);
        } catch {}
      }

      // upload new
      const newUrls = [];
      for (const f of req.files) {
        const uploaded = await uploadFileToCloudinary(f.path, "farm-products");
        newUrls.push(uploaded);
      }
      updates.productImages = newUrls;
    }

    // Apply updates
    Object.assign(product, updates);

    product.isOutdated = false;
    product.lastUpdated = new Date();

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.log("Update Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================================================
// AUTO-OUTDATED PRODUCT REMINDER (run daily / cron)
// =====================================================================
export const remindOutdatedProducts = async (req, res) => {
  try {
    const outdatedProducts = await Product.find({
      lastUpdated: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      isOutdated: false,
    }).populate("seller");

    for (const product of outdatedProducts) {
      product.isOutdated = true;
      await product.save();

      sendMessage(
        product.seller.mobile,
        `⚠️ Your product "${product.title}" has not been updated for 30 days. Update it to stay relevant!`
      );
    }

    res.json({
      success: true,
      message: `${outdatedProducts.length} sellers notified.`,
    });
  } catch (err) {
    console.log("Outdated Notify Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================================================
// GET ALL PRODUCTS
// =====================================================================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate(
      "seller",
      "name location rating"
    );

    res.json({ success: true, products });
  } catch (err) {
    console.log("Get Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================================================
// GET SINGLE PRODUCT
// =====================================================================
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name mobile location rating reviewCount"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    console.log("Get Single Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================================================
// DELETE PRODUCT (only if no active orders)
// =====================================================================
export const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ------ FIXED AUTH CHECK ------
    const productSellerId =
      typeof product.seller === "object"
        ? product.seller._id.toString()
        : product.seller.toString();

    if (productSellerId !== sellerId.toString()) {
      return res.status(403).json({
        message: "Unauthorized: You can delete only your own products.",
      });
    }

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.log("Delete Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
