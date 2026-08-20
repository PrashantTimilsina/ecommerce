import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";
import type { AdminProduct } from "@/app/admin/_components/data";
import { LoginResponse } from "../auth.api";
import { revalidatePath } from "next/cache";

export const login = async (email: string, password: string) => {
  const response = await myFetch<LoginResponse>(`${END_POINTS.ADMIN.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response;
};
export const getAllUsers = async (search?: string, limit?: number) => {
  const token = await getToken();
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (limit) params.set("limit", String(limit));
  const queryString = params.toString();
  const url = queryString
    ? `${END_POINTS.ADMIN.USERS}?${queryString}`
    : END_POINTS.ADMIN.USERS;
  const response = await myFetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const getAllProducts = async (search?: string, limit?: number) => {
  const token = await getToken();
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (limit) params.set("limit", String(limit));
  const queryString = params.toString();
  const url = queryString
    ? `${END_POINTS.ADMIN.PRODUCTS}?${queryString}`
    : END_POINTS.ADMIN.PRODUCTS;
  const response = await myFetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const updateUser = async (
  userId: string,
  email: string,
  role: string,
  name: string,
) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ADMIN.USERS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, email, role, name }),
  });
  return response;
};
export const deleteUser = async (userId: string) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ADMIN.USERS}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });
  return response;
};
export const addUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  confirmPassword: string,
) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ADMIN.USERS}add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, password, role, confirmPassword }),
  });
  return response;
};
export const addProduct = async (product: AdminProduct) => {
  const token = await getToken();
  const response = await myFetch(END_POINTS.ADMIN.PRODUCTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return response;
};
export const updateProduct = async (
  id: string,
  product: Partial<AdminProduct>,
) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ADMIN.PRODUCT}${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (response.status) {
    revalidatePath("/admin/products");
  }
  return response;
};
export const deleteProduct = async (id: string) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ADMIN.PRODUCT}${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
