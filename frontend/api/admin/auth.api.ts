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
export const getAllUsers = async () => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ADMIN.USERS}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const getAllProducts = async () => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ADMIN.PRODUCTS}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
