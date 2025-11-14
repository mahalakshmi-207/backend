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

router.get("/", getProducts);
router.get("/myproducts", protect, getMyProducts);
router.post("/", protect, createProduct);
router.post("/:id/reviews", protect, addReview);
router.get("/:id", getProductById);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.get("/export", protect, exportProducts);

export default router;