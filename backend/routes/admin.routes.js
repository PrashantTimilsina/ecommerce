import express from "express";
import * as adminController from "./../controllers/admin.controller.js";
import * as productController from "./../controllers/product.controller.js";
import restrictTo from "../middlewares/adminMiddleware.js";
import { protect } from "./../middlewares/authMiddleware.js";
const router = express.Router();
router.use(protect, restrictTo("admin"));
router.get("/users", adminController.getAllUsers);
router.get(
  "/users/:id",

  adminController.getUserById,
);
router.post("/users", adminController.updateUser);
router.delete("/users", adminController.deleteUser);
router.get(
  "/products",

  productController.getAllProducts,
);
router.post("/users/add", adminController.createUser);
router.post(
  "/products",

  adminController.createProduct,
);
router.patch("/product/:id", adminController.updateProduct);
router.delete("/product/:id", adminController.deleteProduct);
export default router;
