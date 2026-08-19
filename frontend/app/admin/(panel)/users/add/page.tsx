"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

import { AddUserView } from "../../../_components/views/users-views";
import type { AdminUser } from "../../../_components/data";

export default function AdminAddUserPage() {
  const router = useRouter();

  function handleAddUser(user: AdminUser) {
    console.log("[Admin] Add User payload:", user);
    toast.add({
      title: "User added",
      description: `${user.name} was created.`,
      type: "success",
    });
    router.push("/admin/users");
  }

  return <AddUserView onAddUser={handleAddUser} />;
}