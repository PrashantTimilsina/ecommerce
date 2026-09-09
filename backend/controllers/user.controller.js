import Product from "../models/product.js";
import User from "../models/user.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";
import { deleteImage, uploadImage } from "../config/cloudinary.js";
import { productPrice } from "../utils/productPrice.js";
// import { cookieOptions } from "./auth.controller.js";

export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  // Old carts may contain truncated or stale browser-supplied prices.
  const products = await Product.find({ title: { $in: user.cartItems.map((item) => item.product) } });
  const prices = new Map(products.map((product) => [product.title, productPrice(product)]));
  for (const item of user.cartItems) {
    if (prices.has(item.product)) item.price = prices.get(item.product);
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
  if (!Number.isSafeInteger(numberQuantity) || numberQuantity < 1) {
    return res.status(400).json({ status: false, message: "Quantity must be a positive integer." });
  }
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
  if (!productItem) {
    return res
      .status(404)
      .json({ status: false, message: "Product not found" });
  }
  const currentQuantity = user.cartItems.filter((item) => item.product === productItem.title)
    .reduce((sum, item) => sum + item.quantity, 0);
  if (currentQuantity + numberQuantity > productItem.stock) {
    return res.status(400).json({
      status: false,
      message: "Insufficient stock",
    });
  }
  const existingCartItem = user.cartItems.find(
    (item) =>
      item.product === productItem.title &&
      item.size === size &&
      item.color === color,
  );
  if (existingCartItem) {
    existingCartItem.quantity += numberQuantity;
    existingCartItem.price = productPrice(productItem);
  } else {
    user.cartItems.push({
      product,
      quantity: numberQuantity,
      size,
      color,
      image,
      price: productPrice(productItem),
    });
  }
  await user.save();
  return res
    .status(200)
    .json({ status: true, message: "Product added to cart successfully" });
});
export const updateCartQuantity = catchAsync(async (req, res) => {
  const { product, size, color, quantity } = req.body;
  if (typeof product !== "string" || typeof size !== "string" || typeof color !== "string" ||
      !Number.isSafeInteger(quantity) || quantity < 1) {
    return res.status(400).json({ status: false, message: "Provide a cart item and a positive integer quantity." });
  }
  const user = await User.findById(req.user.id);
  const matches = (item) => item.product === product && item.size === size && item.color === color;
  const item = user?.cartItems.find(matches);
  if (!item) return res.status(404).json({ status: false, message: "Cart item not found." });
  const catalogProduct = await Product.findOne({ title: product });
  const otherQuantity = user.cartItems.filter((entry) => entry.product === product && !matches(entry))
    .reduce((sum, entry) => sum + entry.quantity, 0);
  if (!catalogProduct || quantity + otherQuantity > catalogProduct.stock) {
    return res.status(400).json({ status: false, message: "Insufficient stock." });
  }
  // Collapse duplicate rows left by the old add-to-cart implementation.
  user.cartItems = user.cartItems.filter((entry) => !matches(entry));
  user.cartItems.push({ product, size, color, quantity, image: item.image, price: productPrice(catalogProduct) });
  await user.save();
  res.json({ status: true, message: "Cart updated.", data: { quantity, price: productPrice(catalogProduct) } });
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
