import Product from "../models/product.js";
import User from "../models/user.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import { deleteImage, uploadImage } from "../config/cloudinary.js";
// import { cookieOptions } from "./auth.controller.js";

export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  return res.status(200).json({
    status: true,
    message: "User fetched successfully",
    data: { user },
  });
});
export const updateUserProfile = catchAsync(async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!name && !file) {
    return res.status(400).json({ status: false, message: "Name is required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  const updates = {};
  if (name) updates.name = name;

  let oldCloudinaryId = null;
  if (file) {
    const result = await uploadImage(file);
    updates.image = result.secure_url;
    updates.cloudinaryId = result.public_id;
    oldCloudinaryId = user.cloudinaryId;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
  });

  if (oldCloudinaryId) {
    try {
      await deleteImage(oldCloudinaryId);
    } catch (err) {
      console.error("Failed to delete old profile image", err);
    }
  }

  return res
    .status(200)
    .json({ status: true, message: "Profile updated successfully", data: { user: updatedUser } });
});
export const deleteUserProfile = catchAsync(async (req, res) => {
  const { deleteConfirm } = req.body;
  if (!deleteConfirm) {
    return res.status(400).json({
      status: false,
      message: "Please provide deleteConfirm field",
    });
  }
  if (deleteConfirm !== "delete") {
    return res.status(400).json({
      status: false,
      message: "Delete text does not match, please type 'delete' to confirm",
    });
  }
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  return res
    .status(200)
    .json({ status: true, message: "User deleted successfully" });
});
export const addToCart = catchAsync(async (req, res) => {
  const { product, quantity, size, color, image, price } = req.body;
  const numberQuantity = Number(quantity);
  if (!product || !quantity || !size || !color || !image || !price) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  const productItem = await Product.findOne({ title: product });
  if (numberQuantity > productItem.stock) {
    return res.status(400).json({
      status: false,
      message: "Insufficient stock",
    });
  }
  if (!productItem) {
    return res
      .status(404)
      .json({ status: false, message: "Product not found" });
  }
  const existingCartItem = user.cartItems.find(
    (item) =>
      item.product.toString() === product &&
      item.size === size &&
      item.color === color,
  );
  if (existingCartItem) {
    existingCartItem.quantity += numberQuantity;
  } else {
    user.cartItems.push({
      product,
      quantity: numberQuantity,
      size,
      color,
      image,
      price,
    });
  }
  await user.save();
  return res
    .status(200)
    .json({ status: true, message: "Product added to cart successfully" });
});
export const removeFromCart = catchAsync(async (req, res) => {
  const { product, size, color } = req.body;
  if (!product || !size || !color) {
    return res.status(400).json({
      status: false,
      message: "Product, size, and color are required",
    });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  const matchesItem = (item) =>
    item.product === product && item.size === size && item.color === color;

  const cartItemExists = user.cartItems.some(matchesItem);
  if (!cartItemExists) {
    return res
      .status(404)
      .json({ status: false, message: "Cart item not found" });
  }

  user.cartItems = user.cartItems.filter((item) => !matchesItem(item));
  await user.save();

  return res
    .status(200)
    .json({ status: true, message: "Product removed from cart successfully" });
});
