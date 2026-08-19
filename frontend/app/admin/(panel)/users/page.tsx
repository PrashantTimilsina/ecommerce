"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";

import { AllUsersView } from "../../_components/views/users-views";
import type { AdminUser } from "../../_components/data";
import { getAllUsersAction } from "@/action/admin/auth.action";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    let cancelled = false;
    getAllUsersAction(search)
      .then((result) => {
        if (!cancelled && result?.status) {
          setUsers(result.data as AdminUser[]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
    return () => {
      cancelled = true;
    };
  }, [search]);

  function handleUpdateUser(user: AdminUser) {
    console.log("[Admin] Update User payload:", user);
    setUsers((prev) => prev.map((u) => (u._id === user._id ? user : u)));
    toast.add({
      title: "User updated",
      description: `${user.name} was updated.`,
      type: "success",
    });
  }

  function handleDeleteUser(id: string) {
    console.log("[Admin] Delete User payload:", { id });
    setUsers((prev) => prev.filter((u) => u._id !== id));
    toast.add({
      title: "User deleted",
      description: "The user was removed.",
      type: "success",
    });
  }

  return (
    <AllUsersView
      users={users}
      onUpdateUser={handleUpdateUser}
      onDeleteUser={handleDeleteUser}
    />
  );
}