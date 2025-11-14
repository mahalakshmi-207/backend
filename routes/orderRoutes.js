import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post("/", protect, createOrder);

/**
 * @route   GET /api/orders/myorders
 * @desc    Get logged-in user's orders
 * @access  Private
 */
router.get("/myorders", protect, getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private (owner or admin)
 */
router.get("/:id", protect, getOrderById);

export default router;