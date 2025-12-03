import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

// controllers
import {
  placeOrder,
  sellerConfirmShipment,
  confirmDelivery,
  buyerRequestReturn,
  sellerConfirmReturn,
  extendRental,
  getMyOrders,
  getSellerOrders,
  markSellerViewed,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// Buyer places order
router.post("/place", protect, placeOrder);

// Seller confirms shipment
router.post("/confirm-shipment", protect, sellerConfirmShipment);

// Buyer confirms delivery (with virtual payment id)
router.post("/confirm-delivery", protect, confirmDelivery);

// Buyer requests return
router.post("/request-return", protect, buyerRequestReturn);

// Seller confirms return (received item)
router.post("/confirm-return", protect, sellerConfirmReturn);

// Extend rental (buyer)
router.post("/extend-rental", protect, extendRental);

// Cancel order (buyer)
router.post("/cancel", protect, cancelOrder);

// Buyer list
router.get("/my-orders", protect, getMyOrders);

// Seller list (for popup)
router.get("/seller-orders", protect, getSellerOrders);

// Seller dismiss popup
router.post("/seller-viewed", protect, markSellerViewed);

export default router;
