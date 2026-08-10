"use server";
import {
  changePassword,
  forgotPassword,
  getUser,
  resetPassword,
  updateUserProfile,
} from "@/api/user.api";

export const getUserAction = async () => {
  return await getUser();
};
export const updateUserProfileAction = async (name: string) => {
  return await updateUserProfile(name);
};
export const changePasswordAction = async (
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
) => {
  return await changePassword(currentPassword, newPassword, confirmNewPassword);
};

export const forgotPasswordAction = async (email: string) => {
  return await forgotPassword(email);
};
export const resetPasswordAction = async (
  token: string,
  newPassword: string,
  confirmNewPassword: string,
) => {
  return await resetPassword(token, newPassword, confirmNewPassword);
};
