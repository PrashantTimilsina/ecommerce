import END_POINTS from "@/constants/endpoints";
import { myFetch } from "@/lib/api";

export const getReviews = async (productId: string) => {
  const response = await myFetch(`${END_POINTS.REVIEWS}${productId}`);
  return response;
};
export const postReview = async ({
  productId,
  rating,
  comment,
}: {
  productId: string;
  rating: number;
  comment: string;
}) => {
  const response = await myFetch(`${END_POINTS.REVIEWS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, rating, comment }),
  });
  return response;
};
