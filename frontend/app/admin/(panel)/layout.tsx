import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "./admin-shell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  let role: string | undefined;
  const userCookie = cookieStore.get("user");
  if (userCookie) {
    try {
      role = JSON.parse(userCookie.value).role;
    } catch {
      role = undefined;
    }
  }

  if (!token || role !== "admin") {
    redirect("/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}