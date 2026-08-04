"use server";

import { login, signup } from "@/api/auth.api";
import { deleteReview, updateReview } from "@/api/review.api";
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
export const updateReviewAction = async ({
  id,
  rating,
  comment,
  slug,
}: {
  id: string;
  rating: number;
  comment: string;
  slug: string;
}) => {
  const response = await updateReview({ id, rating, comment, slug });
  return response;
};
export const deleteReviewAction = async (id: string, slug: string) => {
  return await deleteReview(id, slug);
};
