import END_POINTS from "@/constants/endpoints";
import { myFetch } from "@/lib/api";

export const getReviews = async (productId: string) => {
  const response = await myFetch(`${END_POINTS.REVIEWS}${productId}`);
  return response;
};
