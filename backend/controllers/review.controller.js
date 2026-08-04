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
    "name _id",
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

  try {
    const review = await Review.create({ product, user, rating, comment });
    return res.status(201).json({
      status: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: false,
        message: "You've already reviewed this product",
      });
    }
    throw err;
  }
});
export const updateReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const user = req.user.id;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ status: false, message: "Review not found" });
  }
  if (review.user._id.toString() !== user) {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to update this review",
    });
  }
  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  await review.save();
  res
    .status(200)
    .json({ status: true, message: "Review updated successfully" });
});
export const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user.id;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    return res.status(404).json({ status: false, message: "Review not found" });
  }
  if (review.user._id.toString() !== user) {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to delete this review",
    });
  }
  await Review.deleteOne({ _id: id });
  res
    .status(200)
    .json({ status: true, message: "Review deleted successfully" });
});
