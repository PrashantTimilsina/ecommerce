import express from "express";
import * as productController from "./../controllers/product.controller.js";
const router = express.Router();
router.get("/", productController.getAllProducts);
router.get("/:slug", productController.getProductBySlug);
export default router;
