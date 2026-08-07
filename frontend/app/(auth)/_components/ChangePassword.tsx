"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSubmit?: (data: ChangePasswordFormValues) => void;
  onCancel?: () => void;
}

function ChangePasswordForm({ onSubmit, onCancel }: ChangePasswordFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onFormSubmit(data: ChangePasswordFormValues) {
    console.log(data);
    onSubmit?.(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      className="w-full max-w-md mx-auto border border-border rounded-2xl p-6 flex flex-col gap-5"
    >
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5" />
        <h2 className="font-bold text-lg">Change Password</h2>
      </div>

      {/* Current password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            {...register("currentPassword")}
            className="rounded-xl h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((prev) => !prev)}
            aria-label={showCurrent ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showCurrent ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-xs text-red-600">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* New password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            {...register("newPassword")}
            className="rounded-xl h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew((prev) => !prev)}
            aria-label={showNew ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showNew ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.newPassword ? (
          <p className="text-xs text-red-600">{errors.newPassword.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters.
          </p>
        )}
      </div>

      {/* Confirm new password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmNewPassword"
            type={showConfirm ? "text" : "password"}
            {...register("confirmNewPassword")}
            className="rounded-xl h-11 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmNewPassword && (
          <p className="text-xs text-red-600">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 justify-end mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full px-6 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full px-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
