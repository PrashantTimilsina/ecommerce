"use server";

import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  RemoveFromCartPayload,
} from "@/api/product.api";
import { postReview } from "@/api/review.api";
import { AddToCartPayload } from "@/types/product";

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
export const addToCartAction = async (payload: AddToCartPayload) => {
  return await addToCart(payload);
};
export const removeFromCartAction = async (payload: RemoveFromCartPayload) => {
  return await removeFromCart(payload);
};
export const updateCartQuantityAction = async (payload: RemoveFromCartPayload & { quantity: number }) => {
  return updateCartQuantity(payload);
};
