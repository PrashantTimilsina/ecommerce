import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";
import { LoginResponse } from "../auth.api";

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
export const getAllUsers = async (search?: string) => {
  const token = await getToken();
  const url = search
    ? `${END_POINTS.ADMIN.USERS}?search=${encodeURIComponent(search)}`
    : END_POINTS.ADMIN.USERS;
  const response = await myFetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const getAllProducts = async (search?: string) => {
  const token = await getToken();
  const url = search
    ? `${END_POINTS.ADMIN.PRODUCTS}?search=${encodeURIComponent(search)}`
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
