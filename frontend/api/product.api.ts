import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";
import { AddToCartPayload, Product } from "@/types/product";
type Params = {
  category?: string;
  sizes?: string;
  colors?: string;
  search?: string;
};
export const getAllProducts = async (params: Params) => {
  const query = new URLSearchParams();
  if (params?.category) {
    query.append("category", params.category);
  }
  if (params?.sizes) {
    query.append("sizes", params.sizes);
  }
  if (params?.colors) {
    query.append("colors", params.colors);
  }
  if (params?.search) {
    query.append("search", params.search);
  }

  const response = await myFetch<Product[]>(
    `${END_POINTS.PRODUCTS}?${query.toString()}`,
  );
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
