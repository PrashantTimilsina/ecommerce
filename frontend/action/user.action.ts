"use server";
import { getUser, updateUserProfile } from "@/api/user.api";

export const getUserAction = async () => {
  return await getUser();
};
export const updateUserProfileAction = async (name: string) => {
  return await updateUserProfile(name);
};
