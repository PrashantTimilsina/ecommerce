import React from "react";
import AccountPage from "./_components/AccountPage";
import { getUser } from "@/api/user.api";

async function Profile() {
  const response = await getUser();
  const user = response.data.user;

  return (
    <div>
      <AccountPage user={user} />
    </div>
  );
}

export default Profile;
