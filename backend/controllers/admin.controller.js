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
