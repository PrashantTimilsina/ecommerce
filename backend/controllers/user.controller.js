import User from "../models/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import { cookieOptions } from "./auth.controller.js";

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
