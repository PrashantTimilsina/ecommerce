"use server";
import { getUser } from "@/api/user.api";

export const getUserAction = async () => {
  return await getUser();
};
