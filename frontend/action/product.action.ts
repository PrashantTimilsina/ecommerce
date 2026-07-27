"use server";

import { postReview } from "@/api/review.api";

export const postReviewAction = async ({
  productId,
  rating,
  comment,
}: {
  productId: string;
  rating: number;
  comment: string;
}) => {
  return await postReview({ productId, rating, comment });
};
