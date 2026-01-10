import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoriesWithProducts,
  getCategoryById,
  updateCategory,
  getMegaMenuCategories,
} from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// ================= PUBLIC =================
router.get("/mega", getMegaMenuCategories);
router.get("/with-products", getCategoriesWithProducts);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// ================= ADMIN =================
router.post("/", protect, adminOnly, upload.single("image"), createCategory);
router.put("/:id", protect, adminOnly, upload.single("image"), updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
