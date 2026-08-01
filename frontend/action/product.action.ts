"use server";

import { postReview } from "@/api/review.api";

export const postReviewAction = async ({
  product,
  rating,
  slug,
  comment,
}: {
  product: string;
  rating: number;
  comment: string;
  slug: string;
}) => {
  return await postReview({ product, rating, comment, slug });
};
