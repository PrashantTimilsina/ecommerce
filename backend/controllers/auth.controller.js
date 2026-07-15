import jwt from "jsonwebtoken";
import User from "../models/user.js";

const signToken = (id) => {
  return jwt.sign({ id }, "prashanttimilsina", { expiresIn: "1d" });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, confirmPassword });
    user.password = undefined;

    const token = signToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ⬅️ ensures cookie is only sent over HTTPS
      sameSite: "None", // ⬅️ required for cross-origin cookie usage
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return res.status(201).json({
      status: true,
      message: "User created successfully",

      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
