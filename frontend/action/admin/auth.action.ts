"use server";
import { getAllUsers, login } from "@/api/admin/auth.api";
import { cookies } from "next/headers";

export const loginAction = async (email: string, password: string) => {
  const response = await login(email, password);
  if (response.status) {
    const cookieStore = await cookies();
    cookieStore.set("token", response.data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set(
      "user",
      JSON.stringify({
        userId: response.data.user._id,
        role: response.data.user.role,
      }),
      {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      },
    );
  }
  return response;
};
export const getAllUsersAction = async () => {
  return await getAllUsers();
};
