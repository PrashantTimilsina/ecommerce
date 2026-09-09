"use client";

import { useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { logoutAction } from "@/action/auth.action";
import { logoutAdmin } from "./auth";

export type AdminViewId =
  | "dashboard"
  | "users-all"
  | "users-add"
  | "products-all"
  | "products-add";

export const adminViewPaths: Record<AdminViewId, string> = {
  dashboard: "/admin/dashboard",
  "users-all": "/admin/users",
  "users-add": "/admin/users/add",
  "products-all": "/admin/products",
  "products-add": "/admin/products/add",
};

type NavItem = {
  id: AdminViewId;
  label: string;
  icon: React.ReactNode;
};

type NavGroup = {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Users",
    icon: <Users className="size-4" />,
    items: [
      {
        id: "users-all",
        label: "All Users",
        icon: <Search className="size-4" />,
      },
      { id: "users-add", label: "Add User", icon: <Plus className="size-4" /> },
    ],
  },
  {
    label: "Products",
    icon: <Package className="size-4" />,
    items: [
      {
        id: "products-all",
        label: "All Products",
        icon: <Search className="size-4" />,
      },
      {
        id: "products-add",
        label: "Add Product",
        icon: <Plus className="size-4" />,
      },
    ],
  },
];

function getItemLabel(id: AdminViewId): string {
  if (id === "dashboard") return "Dashboard";
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.id === id) return item.label;
    }
  }
  return id;
}

type AdminSidebarProps = {
  activeView: AdminViewId;
};

type SidebarContentProps = {
  activeView: AdminViewId;
  onNavigate?: () => void;
};

function SidebarContent({
  activeView,
  onNavigate,
}: SidebarContentProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Users: true,
    Products: true,
  });

  function toggleGroup(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function handleLogout() {
    logoutAction();
    logoutAdmin();
    toast.add({ title: "Logged out", type: "success" });
    router.replace("/admin");
  }

  function handleViewChange(view: AdminViewId) {
    router.push(adminViewPaths[view]);
    onNavigate?.();
  }

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <LayoutDashboard className="size-4" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground">Shop.co</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <button
          type="button"
          onClick={() => handleViewChange("dashboard")}
          className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
            activeView === "dashboard"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </button>

        {navGroups.map((group) => {
          const isOpen = expanded[group.label];
          const groupHasActive = group.items.some(
            (item) => item.id === activeView,
          );
          return (
            <div key={group.label} className="pt-1">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                  groupHasActive
                    ? "bg-accent/60 text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {group.icon}
                {group.label}
                <ChevronDown
                  className={`ml-auto size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleViewChange(item.id)}
                      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                        activeView === item.id
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 px-2.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            A
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-foreground">
              {getItemLabel(activeView)}
            </p>
            <p className="text-xs text-muted-foreground">admin@shop.co</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({ activeView }: AdminSidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card">
      <SidebarContent activeView={activeView} />
    </aside>
  );
}

export function AdminMobileSidebar({ activeView }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open admin menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 bg-card p-0">
        <SheetTitle className="sr-only">Admin Menu</SheetTitle>
        <SidebarContent
          activeView={activeView}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
