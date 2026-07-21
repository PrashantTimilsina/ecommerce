import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    category: {
      type: String,
      enum: ["Casual", "Formal", "Party", "Gym"],
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    colors: [String],
    sizes: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });

  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
