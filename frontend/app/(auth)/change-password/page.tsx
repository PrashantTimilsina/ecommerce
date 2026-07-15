"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordFormProps {
  onSubmit?: (data: { currentPassword: string; newPassword: string }) => void;
  onCancel?: () => void;
}

function ChangePasswordForm({ onSubmit, onCancel }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    onSubmit?.({ currentPassword, newPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto border border-border rounded-2xl p-6 flex flex-col gap-5"
    >
      <div className="flex items-center gap-2">
        <KeyRound className="h-5 w-5" />
        <h2 className="font-bold text-lg">Change Password</h2>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Current password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
      </div>

      {/* New password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters.
        </p>
      </div>

      {/* Confirm new password */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        <Button type="submit" className="rounded-full px-6 cursor-pointer">
          Update Password
        </Button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
