"use client";

import { useRef, useState } from "react";
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
} from "lucide-react";

import ChangePasswordForm from "@/app/(auth)/change-password/page";
import { updateUserProfileAction } from "@/action/user.action";
import { toast } from "@/components/ui/toast";

export type User = {
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

const DEFAULT_AVATAR = "/users/default-avatar.png";

function AccountPage({ user }: { user: User }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [name, setName] = useState(user.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user.name);
  const [avatarPreview, setAvatarPreview] = useState(
    user.avatar ?? DEFAULT_AVATAR,
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setIsUploadingAvatar(true);

    const payload = { avatarFile: file }; // send as FormData to your API
    console.log("Uploading avatar:", payload);
    // TODO: call your API here, e.g.
    // const formData = new FormData();
    // formData.append("avatar", file);
    // const res = await fetch("/api/account/avatar", { method: "PATCH", body: formData });
    // const { avatarUrl } = await res.json();
    // setAvatarPreview(avatarUrl);

    await new Promise((res) => setTimeout(res, 600));
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
    const payload = { name: trimmed };
    console.log("Updating name:", payload);
    // TODO: call your API here, e.g.
    // await fetch("/api/account", {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    const response = await updateUserProfileAction(trimmed);
    if (response.status) {
      toast.add({ title: "Name updated successfully", type: "success" });
    }
    await new Promise((res) => setTimeout(res, 400));
    setName(trimmed);
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
            onClick={() => console.log("Logging out")}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
