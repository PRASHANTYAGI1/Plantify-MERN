import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import uploadDisk from "../middlewares/upload/multerDisk.js";


import {
  addProduct,
  updateProduct, 
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  remindOutdatedProducts
} from "../controllers/productController.js";

const router = express.Router();

// Add product
router.post(
  "/add",
  protect,
  uploadDisk.array("productImages", 5),
  addProduct
);

// Update product
router.put(
  "/update/:id",
  protect,
  uploadDisk.array("productImages", 5),
  updateProduct
);

// Delete product
router.delete("/:id", protect, deleteProduct);

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// CRON route (if you want)
router.get("/cron/outdated-check", remindOutdatedProducts);

export default router;
