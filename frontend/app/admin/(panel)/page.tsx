"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { toast } from "@/components/ui/toast";

import {
  AdminMobileSidebar,
  AdminSidebar,
  type AdminViewId,
} from "../_components/sidebar";
import { DashboardView } from "../_components/views/dashboard-view";
import { AddUserView, AllUsersView } from "../_components/views/users-views";
import {
  AddProductView,
  AllProductsView,
} from "../_components/views/products-views";
import type { AdminProduct, AdminUser } from "../_components/data";
import {
  getAllProductsAction,
  getAllUsersAction,
} from "@/action/admin/auth.action";

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [activeView, setActiveView] = useState<AdminViewId>("dashboard");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  useEffect(() => {
    async function fetchData() {
      const [usersResult, productsResult] = await Promise.allSettled([
        getAllUsersAction(search),
        getAllProductsAction(search),
      ]);

      if (usersResult.status === "fulfilled") {
        setUsers(usersResult.value.data as AdminUser[]);
      } else {
        console.error("Failed to fetch users:", usersResult.reason);
      }

      if (productsResult.status === "fulfilled") {
        setProducts(productsResult.value.data as AdminProduct[]);
      } else {
        console.error("Failed to fetch products:", productsResult.reason);
      }
    }

    fetchData();
  }, [search]);

  function handleAddUser(user: AdminUser) {
    console.log("[Admin] Add User payload:", user);
    setUsers((prev) => [user, ...prev]);
    toast.add({
      title: "User added",
      description: `${user.name} was created.`,
      type: "success",
    });
  }

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

  function handleAddProduct(product: AdminProduct) {
    console.log("[Admin] Add Product payload:", product);
    setProducts((prev) => [product, ...prev]);
    toast.add({
      title: "Product added",
      description: `${product.title} was created.`,
      type: "success",
    });
  }

  function handleUpdateProduct(product: AdminProduct) {
    console.log("[Admin] Update Product payload:", product);
    // setProducts((prev) =>
    //   prev.map((p) => (p._id === product._id ? product : p)),
    // );
    toast.add({
      title: "Product updated",
      description: `${product.title} was updated.`,
      type: "success",
    });
  }

  function handleDeleteProduct(id: string) {
    console.log("[Admin] Delete Product payload:", { id });
    // setProducts((prev) => prev.filter((p) => p._id !== id));
    toast.add({
      title: "Product deleted",
      description: "The product was removed.",
      type: "success",
    });
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-30">
          <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        </div>
      </div>

      <main className="min-w-0 flex-1 lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-backdrop-filter:backdrop-blur-xs lg:hidden">
          <AdminMobileSidebar
            activeView={activeView}
            onViewChange={setActiveView}
          />
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
          {activeView === "dashboard" && <DashboardView />}

          {activeView === "users-all" && (
            <AllUsersView
              users={users}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
          {activeView === "users-add" && (
            <AddUserView onAddUser={handleAddUser} />
          )}

          {activeView === "products-all" && (
            <AllProductsView
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          {activeView === "products-add" && (
            <AddProductView onAddProduct={handleAddProduct} />
          )}
        </div>
      </main>
    </div>
  );
}
