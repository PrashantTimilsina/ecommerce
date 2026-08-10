import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";

export type ApiCartItem = {
  product: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
};

export type GetUserData = {
  user: {
    name: string;
    email: string;
    role: string;
    cartItems: ApiCartItem[];
  };
};

export const getUser = async () => {
  const token = await getToken();
  return await myFetch<GetUserData>(`${END_POINTS.ME}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateUserProfile = async (name: string) => {
  const token = await getToken();
  return await myFetch(`${END_POINTS.ME}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
};
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
) => {
  const token = await getToken();
  return await myFetch(`${END_POINTS.CHANGE_PASSWORD}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  });
};
export const forgotPassword = async (email: string) => {
  return await myFetch(`${END_POINTS.FORGOT_PASSWORD}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email }),
  });
};
export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmNewPassword: string,
) => {
  return await myFetch(`${END_POINTS.RESET_PASSWORD}${token}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ newPassword, confirmNewPassword }),
  });
};
