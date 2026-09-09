import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createCheckout, confirmOrder } from "../controllers/order.controller.js";

const router = express.Router();
router.use(protect);
router.post("/checkout", createCheckout);
router.post("/confirm", confirmOrder);
export default router;
