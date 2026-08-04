import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";
import { revalidatePath } from "next/cache";

export const getReviews = async (productId: string) => {
  const response = await myFetch(`${END_POINTS.REVIEWS}${productId}`);
  return response;
};
export const postReview = async ({
  product,
  rating,
  comment,
  slug,
}: {
  product: string;
  rating: number;
  comment: string;
  slug: string;
}) => {
  const token = await getToken();
  const payload = {
    product,
    rating,
    comment,
  };
  const response = await myFetch(`${END_POINTS.REVIEWS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (response.status) {
    revalidatePath(`/product-detail/${slug}`);
  }
  return response;
};
export const updateReview = async ({
  id,
  rating,
  comment,
  slug,
}: {
  id: string;
  rating: number;
  comment: string;
  slug: string;
}) => {
  const token = await getToken();
  const payload = {
    rating,
    comment,
  };
  const response = await myFetch(`${END_POINTS.REVIEWS}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (response.status) {
    revalidatePath(`/product-detail/${slug}`);
  }
  return response;
};
export const deleteReview = async (id: string, slug: string) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.REVIEWS}${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status) {
    revalidatePath(`/product-detail/${slug}`);
  }
  return response;
};
