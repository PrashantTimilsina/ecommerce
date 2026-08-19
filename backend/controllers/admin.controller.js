import Product from "../models/product.js";
import User from "../models/user.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query).search([
    "name",
    "email",
  ]);
  const users = await features.query;
  res.status(200).json({ status: true, data: users });
});
export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, message: "User ID is required" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  return res.status(200).json({ status: true, data: user });
});
export const createUser = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (!name || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({
      status: false,
      message:
        "Name, email, password,role and password confirmation are required",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: false,
      message: "Passwords do not match",
    });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ status: false, message: "User with this email already exists" });
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    confirmPassword,
  });
  return res.status(201).json({ status: true, data: user });
});
export const updateUser = catchAsync(async (req, res) => {
  const { userId, name, email, role } = req.body;
  if (!userId || !name || !email || !role) {
    return res.status(400).json({
      status: false,
      message: "User ID, name, email, and role are required",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  user.name = name;
  user.email = email;
  user.role = role;
  await user.save();
  return res.status(200).json({ status: true, data: user });
});
export const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res
      .status(400)
      .json({ status: false, message: "User ID is required" });
  }
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  return res
    .status(200)
    .json({ status: true, message: "User deleted successfully" });
});
export const createProduct = catchAsync(async (req, res) => {
  const { title, description, price, stock, category, images, colors, sizes } =
    req.body;
  if (
    !title ||
    !description ||
    !price ||
    !stock ||
    !category ||
    !images ||
    !colors ||
    !sizes
  ) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }
  const product = await Product.create({
    title,
    description,
    price,
    stock,
    category,
    images,
    colors,
    sizes,
  });
  return res.status(201).json({ status: true, data: product });
});
export const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, message: "Product ID is required" });
  }
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res
      .status(404)
      .json({ status: false, message: "Product not found" });
  }
  return res
    .status(200)
    .json({ status: true, message: "Product deleted successfully" });
});
export const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: false, message: "Product ID is required" });
  }
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return res
      .status(404)
      .json({ status: false, message: "Product not found" });
  }
  return res.status(200).json({
    status: true,
    message: "Product updated successfully",
    data: product,
  });
});
