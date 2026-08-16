"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  LogOut,
  KeyRound,
  Loader2,
  Pencil,
  Check,
  X,
  Mail,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { updateUserProfileAction } from "@/action/user.action";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteAccountAction, logoutAction } from "@/action/auth.action";
import ChangePasswordForm from "@/app/(auth)/_components/ChangePassword";

export type User = {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  image?: string;
};

type UpdateProfileResponse = {
  status: boolean;
  message: string;
  data?: { user: User };
};

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23f3f4f6'/%3e%3ctext x='50%25' y='50%25' font-size='45' text-anchor='middle' dy='.3em' fill='%239ca3af'%3e👤%3c/text%3e%3c/svg%3e";

function AccountPage({ user }: { user: User }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [name, setName] = useState(user.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user.name);
  const [avatarPreview, setAvatarPreview] = useState(
    user.image ?? DEFAULT_AVATAR,
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setIsUploadingAvatar(true);

    const response = (await updateUserProfileAction(
      name,
      file,
    )) as UpdateProfileResponse;
    if (response.status) {
      // Backend returns user in data.user format
      const updatedUser = response.data?.user;
      if (updatedUser?.image) {
        setAvatarPreview(updatedUser.image);
      }
      toast.add({
        title: "Profile image updated successfully",
        type: "success",
      });
    } else {
      setAvatarPreview(user.image ?? DEFAULT_AVATAR);
      toast.add({ title: response.message, type: "error" });
    }

    setIsUploadingAvatar(false);
    e.target.value = "";
  };

  const startEditingName = () => {
    setNameDraft(name);
    setIsEditingName(true);
    requestAnimationFrame(() => nameInputRef.current?.focus());
  };

  const confirmNameEdit = async () => {
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === name) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    console.log("Updating name:", { name: trimmed });

    const response = (await updateUserProfileAction(
      trimmed,
    )) as UpdateProfileResponse;
    if (response.status) {
      toast.add({ title: "Name updated successfully", type: "success" });
      setName(trimmed);
    } else {
      toast.add({ title: response.message, type: "error" });
    }
    setIsSavingName(false);
    setIsEditingName(false);
  };

  const cancelNameEdit = () => {
    setNameDraft(name);
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") confirmNameEdit();
    if (e.key === "Escape") cancelNameEdit();
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (isDeleting) return;
    setShowDeleteConfirm(open);
    if (!open) setDeleteConfirmText("");
  };
  async function handleLogout() {
    return await logoutAction();
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    const response = await deleteAccountAction(deleteConfirmText);

    if (response.errors) {
      toast.add({ title: response.message, type: "error" });
    }
    if (response.status) {
      toast.add({ title: "Account deleted", type: "success" });
    }

    await new Promise((res) => setTimeout(res, 700));
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
  };

  const isDeleteConfirmed = deleteConfirmText.trim().toLowerCase() === "delete";

  if (showPasswordForm) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <ChangePasswordForm
          onSubmit={(data) => {
            console.log("Submitting password change:", data);
            setShowPasswordForm(false);
          }}
          onCancel={() => setShowPasswordForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        {/* Gradient banner */}
        <div className="h-28 bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900" />

        {/* Avatar overlapping the banner */}
        <div className="flex flex-col items-center px-8 -mt-14">
          <div className="relative group">
            <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-white bg-neutral-100 shadow-md">
              <Image
                src={avatarPreview}
                alt={name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md ring-2 ring-white transition hover:bg-neutral-700 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900"
              aria-label="Change profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div className="mt-4 min-h-[2.25rem] flex items-center justify-center">
            {isEditingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  ref={nameInputRef}
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  disabled={isSavingName}
                  className="w-44 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-center text-base font-medium text-neutral-900 shadow-sm transition focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:opacity-50"
                  placeholder="Your name"
                />
                <button
                  type="button"
                  onClick={confirmNameEdit}
                  disabled={isSavingName}
                  aria-label="Confirm name"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
                >
                  {isSavingName ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelNameEdit}
                  disabled={isSavingName}
                  aria-label="Cancel name edit"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/name">
                <h2 className="text-xl font-semibold text-neutral-900">
                  {name}
                </h2>
                <button
                  type="button"
                  onClick={startEditingName}
                  aria-label="Edit name"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 opacity-0 transition group-hover/name:opacity-100 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-2.5 border-t border-neutral-100 px-8 py-6">
          <button
            type="button"
            onClick={() => setShowPasswordForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 cursor-pointer"
          >
            <KeyRound className="h-4 w-4" />
            Change password
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>

          <div className="my-1 border-t border-neutral-100" />

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete account
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog (shadcn) */}
      <Dialog open={showDeleteConfirm} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="mt-4">Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <label
              htmlFor="delete-confirm-input"
              className="block text-sm font-medium text-neutral-700"
            >
              Type{" "}
              <span className="font-semibold text-neutral-900">delete</span> to
              confirm
            </label>
            <Input
              id="delete-confirm-input"
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              disabled={isDeleting}
              autoFocus
              placeholder="delete"
              className="mt-1.5"
            />
          </div>

          <DialogFooter className="mt-4 gap-2.5 sm:gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDeleteDialogChange(false)}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteAccount}
              disabled={!isDeleteConfirmed || isDeleting}
              className="flex-1 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AccountPage;
