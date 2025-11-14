import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getMyProducts,
  addReview,
  exportProducts,
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products (with optional filters)
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/myproducts
 * @desc    Get products created by logged-in user
 * @access  Private
 */
router.get("/myproducts", protect, getMyProducts);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private
 */
router.post("/", protect, createProduct);

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Add a review to a product
 * @access  Private
 */
router.post("/:id/reviews", protect, addReview); // ✅ Must come before :id

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get("/:id", getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private
 */
router.put("/:id", protect, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private
 */
router.delete("/:id", protect, deleteProduct);

export default router;