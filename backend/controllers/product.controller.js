import Product from "../models/product.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllProducts = catchAsync(async (req, res) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .search(["title", "category", "sizes", "colors"])
    .select()
    .sort()
    .paginate();
  const products = await features.query;

  res.status(200).json({ status: true, data: products });
});
export const getProductBySlug = catchAsync(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    return res
      .status(404)
      .json({ status: false, message: "Product not found" });
  }
  res.status(200).json({ status: true, data: product });
});
