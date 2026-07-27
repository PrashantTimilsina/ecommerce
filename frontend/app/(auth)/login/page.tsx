"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  keepSignedIn: z.boolean().optional(),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    console.log(data);
  }

  function handleGoogleLogin() {
    window.location.href = "/api/auth/google";
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h1 className="text-xl font-medium text-center text-gray-900 mb-1">
        Sign in
      </h1>
      <p className="text-sm text-gray-500 text-center mb-5">
        Welcome back to your account
      </p>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-5"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or use email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3"
      >
        <div>
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            {...register("email")}
            className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-600 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-300 focus:ring-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <input
            type="checkbox"
            {...register("keepSignedIn")}
            className="rounded border-gray-300"
          />
          Keep me signed in
        </label>

      

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 rounded-md bg-gray-900 text-white text-sm font-medium py-2 hover:bg-gray-800 transition disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="text-center mt-5 text-sm text-gray-600">
        New here?{" "}
        <a href="/signup" className="font-medium text-gray-900 underline">
          Create an account
        </a>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.5-.2-3-.9-4.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.5 29.6 4.5 24 4.5c-7.9 0-14.6 4.5-18 11.2z"
      />
      <path
        fill="#4CAF50"
        d="M24 45.5c5.5 0 10.5-1.9 14.3-5.1l-6.6-5.6C29.6 36.7 26.9 37.5 24 37.5c-5.3 0-9.7-3.1-11.3-7.5l-6.6 5.1C9.4 41 16.1 45.5 24 45.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.4 36 44.5 31 44.5 25c0-1.5-.2-3-.9-4.5z"
      />
    </svg>
  );
}
