import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";
import { AddToCartPayload, Product } from "@/types/product";

export const getAllProducts = async () => {
  const response = await myFetch<Product[]>(`${END_POINTS.PRODUCTS}`);
  return response;
};
export const getProductBySlug = async (slug: string) => {
  const response = await myFetch<Product>(`${END_POINTS.PRODUCTS}${slug}`);
  return response;
};
export const addToCart = async (payload: AddToCartPayload) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.CART}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response;
};
export type RemoveFromCartPayload = {
  product: string;
  size: string;
  color: string;
};
export const removeFromCart = async (payload: RemoveFromCartPayload) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.REMOVE_FROM_CART}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response;
};
