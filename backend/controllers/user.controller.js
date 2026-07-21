import Product from "../models/product.js";
import User from "../models/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import { cookieOptions } from "./auth.controller.js";
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ status: true, data: users });
});
export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  return res
    .status(200)
    .json({ status: true, message: "User fetched successfully", user });
});
export const updateUserProfile = catchAsync(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ status: false, message: "Name is required" });
  }
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true },
  );
  return res
    .status(200)
    .json({ status: true, message: "Profile updated successfully", user });
});
export const deleteUserProfile = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  res.clearCookie("token", cookieOptions);
  return res
    .status(200)
    .json({ status: true, message: "User deleted successfully" });
});
export const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const numberQuantity = Number(quantity);
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ status: false, message: "Product ID and quantity are required" });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  const product = await Product.findById(productId);
  if (numberQuantity > product.stock) {
    return res.status(400).json({
      status: false,
      message: "Insufficient stock",
    });
  }
  if (!product) {
    return res
      .status(404)
      .json({ status: false, message: "Product not found" });
  }
  const existingCartItem = user.cartItems.find(
    (item) => item.product.toString() === productId,
  );
  if (existingCartItem) {
    existingCartItem.quantity += numberQuantity;
  } else {
    user.cartItems.push({ product: productId, quantity: numberQuantity });
  }
  await user.save();
  return res
    .status(200)
    .json({ status: true, message: "Product added to cart successfully" });
});
