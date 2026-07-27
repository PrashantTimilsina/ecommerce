"use server";

import { login, signup } from "@/api/auth.api";

export const loginAction = async (email: string, password: string) => {
  return await login(email, password);
};
export const signupAction = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  return await signup(name, email, password, confirmPassword);
};
