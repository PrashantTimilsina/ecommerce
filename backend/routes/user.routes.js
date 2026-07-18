import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post(
  "/change-password",
  authMiddleware.protect,
  authController.changePassword,
);
export default router;
