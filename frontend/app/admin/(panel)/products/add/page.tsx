"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

import { AddProductView } from "../../../_components/views/products-views";
import type { AdminProduct } from "../../../_components/data";

export default function AdminAddProductPage() {
  const router = useRouter();

  function handleAddProduct(product: AdminProduct) {
    console.log("[Admin] Add Product payload:", product);
    toast.add({
      title: "Product added",
      description: `${product.title} was created.`,
      type: "success",
    });
    router.push("/admin/products");
  }

  return <AddProductView onAddProduct={handleAddProduct} />;
}