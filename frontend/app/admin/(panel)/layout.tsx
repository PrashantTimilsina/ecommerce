import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
