"use client";

import Image from "next/image";
import { LogOut, Mail, Phone, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface UserCardProps {
  user: UserProfile;
  onLogout?: () => void;
  onChangePassword?: () => void;
}

function UserCard({ user, onLogout, onChangePassword }: UserCardProps) {
  return (
    <div className="w-full max-w-md mx-auto border border-border rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
      {/* Avatar */}
      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full font-bold text-2xl text-muted-foreground">
            {user.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <h2 className="font-bold text-xl">{user.name}</h2>

      <hr className="w-full border-border" />

      {/* Info */}
      <div className="flex flex-col gap-3 w-full text-left">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">{user.phone}</span>
        </div>
      </div>

      <hr className="w-full border-border" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button
          onClick={onChangePassword}
          variant="outline"
          className="flex-1 rounded-full gap-2 cursor-pointer"
        >
          <KeyRound className="h-4 w-4" />
          Change Password
        </Button>

        <Button
          onClick={onLogout}
          className="flex-1 rounded-full gap-2 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default UserCard;
