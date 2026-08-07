import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { catchAsync } from "../utils/catchAsync.js";
import crypto from "crypto";
import sendEmail from "./../utils/sendEmail.js";
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// export const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "lax",
//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// };

export const signup = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ status: false, message: "Please fill all the fields" });
  }
  if (password.length < 4) {
    return res.status(400).json({
      status: false,
      message: "Password must be at least 4 characters long",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ status: false, message: "User already exists" });
  }

  const user = await User.create({ name, email, password, confirmPassword });
  user.password = undefined;

  const token = signToken(user._id);
  // res.cookie("token", token, cookieOptions);

  return res.status(201).json({
    status: true,
    message: "User created successfully",
    data: { token, user },
  });
});
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Please fill all the fields" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(400)
      .json({ status: false, message: "User does not exist" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid credentials" });
  }
  user.password = undefined;
  const token = signToken(user._id);
  // res.cookie("token", token, cookieOptions);

  return res
    .status(200)
    .json({ status: true, message: "Login successful", data: { token, user } });
});
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res
      .status(400)
      .json({ status: false, message: "Please fill all the fields" });
  }
  if (currentPassword === newPassword) {
    return res.status(400).json({
      status: false,
      message: "New password cannot be the same as the current password",
    });
  }
  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ status: false, message: "New passwords do not match" });
  }
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return res.status(400).json({ status: false, message: "User not found" });
  }
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );
  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ status: false, message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json({ status: true, message: "Password changed successfully" });
});
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ status: false, message: "Please provide your email" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
  await sendEmail(user.email, user.name, resetToken);
  return res.json({
    status: true,
    message: "Password reset email sent!",
    token: resetToken,
  });
});
export const resetPassword = catchAsync(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword, confirmNewPassword } = req.body;
  if (!newPassword || !confirmNewPassword) {
    return res
      .status(400)
      .json({ status: false, message: "Please fill all the fields" });
  }
  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ status: false, message: "Passwords do not match" });
  }
  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid or expired reset token" });
  }
  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  return res.json({ status: true, message: "Password reset successful!" });
});
