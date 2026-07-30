"use client";

import { useState } from "react";

import UserCard from "./_components/UserCard";
import ChangePasswordForm from "@/app/(auth)/change-password/page";

const currentUser = {
  name: "Samantha D.",
  email: "samantha.d@example.com",
  phone: "+1 234 567 8901",
  avatar: "/users/samantha.png",
};

function AccountPage() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-6">
      {showPasswordForm ? (
        <ChangePasswordForm
          onSubmit={(data) => {
            console.log("Submitting password change:", data);
            setShowPasswordForm(false);
          }}
          onCancel={() => setShowPasswordForm(false)}
        />
      ) : (
        <UserCard
          user={currentUser}
          onLogout={() => console.log("Logging out")}
          onChangePassword={() => setShowPasswordForm(true)}
        />
      )}
    </div>
  );
}

export default AccountPage;
