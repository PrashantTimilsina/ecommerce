"use server";

import { login, signup } from "@/api/auth.api";
import { cookies } from "next/headers";

export const loginAction = async (email: string, password: string) => {
  const response = await login(email, password);
  if (response.status) {
    const cookieStore = await cookies();
    cookieStore.set("token", response.data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return response;
};
export const signupAction = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  const response = await signup(name, email, password, confirmPassword);
  if (response.status) {
    const cookieStore = await cookies();
    cookieStore.set("token", response.data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return response;
};
