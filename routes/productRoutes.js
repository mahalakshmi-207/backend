import express from "express";
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
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createProduct).get(getProducts);
router.route("/myproducts").get(protect, getMyProducts);
router.route("/:id").get(getProductById).delete(protect, deleteProduct).put(protect, updateProduct);

// ✅ Add this line
router.route("/:id/reviews").post(protect, addReview);

router.route("/export/csv").get(exportProducts);

export default router;