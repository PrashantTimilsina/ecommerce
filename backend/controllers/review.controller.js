import Review from "../models/review.js";
import { catchAsync } from "../utils/catchAsync.js";

export const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find().populate("user").populate("product");
  if (!reviews) {
    return res.status(404).json({ status: false, message: "No reviews found" });
  }
  res.status(200).json({ status: true, data: reviews });
});
