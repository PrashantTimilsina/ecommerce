import END_POINTS from "@/constants/endpoints";
import { getToken, myFetch } from "@/lib/api";
type LoginResponse = {
  token: string;
  user: {
    _id: string;

    role: string;
  };
};
export const login = async (email: string, password: string) => {
  const response = await myFetch<LoginResponse>(`${END_POINTS.LOGIN}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response;
};
export const signup = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const response = await myFetch<LoginResponse>(`${END_POINTS.SIGNUP}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
  return response;
};
export const deleteAccount = async (deleteConfirm: string) => {
  const token = await getToken();
  const response = await myFetch(`${END_POINTS.ME}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ deleteConfirm }),
    method: "DELETE",
  });
  console.log(response);
  return response;
};
