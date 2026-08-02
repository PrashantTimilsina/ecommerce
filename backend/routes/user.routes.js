import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as userController from "./../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", authController.signup);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful,user object
 */
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:resetToken", authController.resetPassword);
router.post(
  "/change-password",
  authMiddleware.protect,
  authController.changePassword,
);
router.post("/logout", authMiddleware.protect, authController.logout);
router.get("/me", authMiddleware.protect, userController.getCurrentUser);

router.patch(
  "/update-me",
  authMiddleware.protect,
  userController.updateUserProfile,
);
router.delete(
  "/delete-me",
  authMiddleware.protect,
  userController.deleteUserProfile,
);
router.post("/add-to-cart", authMiddleware.protect, userController.addToCart);
router.post(
  "/remove-from-cart",
  authMiddleware.protect,
  userController.removeFromCart,
);
export default router;
