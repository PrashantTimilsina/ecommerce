"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPasswordAction } from "@/action/user.action";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  async function onSubmit(data: ForgotPasswordFormValues) {
    console.log(data);
    const response = await forgotPasswordAction(data.email);
    if (!response.status) {
      toast.add({
        title: response.message,
        type: "error",
      });
    }
    if (response.status) {
      toast.add({
        title: "Reset link sent to your email",
        type: "success",
      });
      router.push("/login");
      reset();
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg shadow-gray-100">
        <h1 className=" text-2xl font-semibold text-center text-gray-900 mb-1.5 tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and we&apos;ll send you a reset link
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MailIcon />
              </span>
              <input
                id="email"
                type="email"
                placeholder="prashant@gmail.com"
                {...register("email")}
                className={`w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-gray-400 focus:ring-gray-100"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-1 rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 hover:bg-gray-800 active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm cursor-pointer"
          >
            {isSubmitting ? "Sending link..." : "Send reset link"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Remembered your password?{" "}
          <a
            href="/login"
            className="font-medium text-gray-900 hover:text-gray-700"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
