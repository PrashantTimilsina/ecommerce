"use client";

import { LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  AdminMobileSidebar,
  AdminSidebar,
  type AdminViewId,
} from "../_components/sidebar";

export function getAdminViewFromPath(pathname: string): AdminViewId {
  if (pathname.endsWith("/users/add")) return "users-add";
  if (pathname.endsWith("/users")) return "users-all";
  if (pathname.endsWith("/products/add")) return "products-add";
  if (pathname.endsWith("/products")) return "products-all";
  return "dashboard";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeView = getAdminViewFromPath(pathname);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-30">
          <AdminSidebar activeView={activeView} />
        </div>
      </div>

      <main className="min-w-0 flex-1 lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-backdrop-filter:backdrop-blur-xs lg:hidden">
          <AdminMobileSidebar activeView={activeView} />
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="size-4" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Shop.co</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}