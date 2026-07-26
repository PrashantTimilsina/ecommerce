import Review from "../models/review.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find().populate("user").populate("product");
  if (!reviews) {
    return res.status(404).json({ status: false, message: "No reviews found" });
  }
  res.status(200).json({ status: true, data: reviews });
});
export const getReviewBySlug = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const review = await Review.find({ product: productId }).populate(
    "user",
    "name -_id",
  );
  if (!review) {
    return res.status(404).json({ status: false, message: "No review found" });
  }
  res.status(200).json({ status: true, data: review });
});
export const createReview = catchAsync(async (req, res) => {
  const { product, rating, comment } = req.body;
  const user = req.user.id;

  if (!product || !user || !rating || !comment) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }
  const review = await Review.create({ product, user, rating, comment });
  res.status(201).json({
    status: true,
    message: "Review created successfully",
    data: review,
  });
});
