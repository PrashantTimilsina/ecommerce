import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (val) {
          if (!this.isNew) return true;
          return val === this.password;
        },
      },
      required: function () {
        return this.isNew;
      },
    },
    image: {
      type: String,
      default: null,
    },
    cloudinaryId: {
      type: String,
      default: null,
    },
    cartItems: [
      {
        _id: false,
        product: { type: String, required: true },
        quantity: { type: Number, default: 1, min: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    clearedCartOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    resetToken: String,
    resetTokenExpiry: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
const User = mongoose.model("User", userSchema);
export default User;
