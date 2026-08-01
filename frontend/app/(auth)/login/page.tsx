"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginAction } from "@/action/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

const loginSchema = z.object({
  email: z
    .string().trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(4, "Password must be at least 4 characters"),
  keepSignedIn: z.boolean().optional(),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router=useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      keepSignedIn: false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    console.log(data)
    const res=await loginAction(data.email, data.password);
    console.log(res)

    if(!res.status){
        toast.add({title:"Error",description:res.message,type:"error"})
    }
    if(res.status){
      toast.add({title: "Login successful",type:"success"})
      router.push("/")
      
    }
  }

  function handleGoogleLogin() {
    window.location.href = "/api/auth/google";
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-lg shadow-gray-100">
      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-1.5 tracking-tight">
        Sign in
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Welcome back to your account
      </p>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-[0.99] transition-all duration-150 mb-6"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          or use email
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

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
            <p className="text-xs text-red-600 mt-1.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LockIcon />
            </span>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={`w-full rounded-lg border pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.password
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:border-gray-400 focus:ring-gray-100"
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 mt-1 select-none cursor-pointer">
          <input
            type="checkbox"
            {...register("keepSignedIn")}
            className="rounded border-gray-300 text-gray-900 focus:ring-gray-300"
          />
          Keep me signed in
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 rounded-lg bg-gray-900 text-white text-sm font-medium py-2.5 hover:bg-gray-800 active:scale-[0.99] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm cursor-pointer"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-600">
        New here?{" "}
        <a
          href="/signup"
          className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700"
        >
          Create an account
        </a>
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

function LockIcon() {
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
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
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