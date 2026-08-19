"use server";
import {
  addUser,
  deleteUser,
  getAllProducts,
  getAllUsers,
  login,
  updateUser,
} from "@/api/admin/auth.api";
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
export const getAllUsersAction = async (search?: string) => {
  return await getAllUsers(search);
};
export const getAllProductsAction = async (search?: string) => {
  return await getAllProducts(search);
};
export const updateUserAction = async (
  userId: string,
  email: string,
  role: string,
  name: string,
) => {
  return await updateUser(userId, email, role, name);
};
export const deleteUserAction = async (userId: string) => {
  return await deleteUser(userId);
};
export const addUserAction = async (
  name: string,
  email: string,
  password: string,
  role: string,
  confirmPassword: string,
) => {
  return await addUser(name, email, password, role, confirmPassword);
};
