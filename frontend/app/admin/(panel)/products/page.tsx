"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";

import { AllProductsView } from "../../_components/views/products-views";
import type { AdminProduct } from "../../_components/data";
import { getAllProductsAction } from "@/action/admin/auth.action";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    getAllProductsAction(search)
      .then((result) => {
        if (!cancelled && result?.status) {
          setProducts(result.data as AdminProduct[]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
      });
    return () => {
      cancelled = true;
    };
  }, [search]);

  function handleUpdateProduct(product: AdminProduct) {
    console.log("[Admin] Update Product payload:", product);
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? product : p)),
    );
    toast.add({
      title: "Product updated",
      description: `${product.title} was updated.`,
      type: "success",
    });
  }

  function handleDeleteProduct(id: string) {
    console.log("[Admin] Delete Product payload:", { id });
    setProducts((prev) => prev.filter((p) => p._id !== id));
    toast.add({
      title: "Product deleted",
      description: "The product was removed.",
      type: "success",
    });
  }

  return (
    <AllProductsView
      products={products}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
    />
  );
}