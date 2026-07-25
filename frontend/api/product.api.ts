import END_POINTS from "@/constants/endpoints";
import { myFetch } from "@/lib/api";
import { Product } from "@/types/product";

export const getAllProducts = async () => {
  const response = await myFetch<Product[]>(`${END_POINTS.PRODUCTS}`);
  return response;
};
export const getProductBySlug = async (slug: string) => {
  const response = await myFetch<Product>(`${END_POINTS.PRODUCTS}${slug}`);
  return response;
};
