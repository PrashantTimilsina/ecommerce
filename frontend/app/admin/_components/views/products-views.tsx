"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type ProductFormValues,
  productCategories,
  productFormDefaults,
  productFormResolver,
  productFormToPayload,
  toCommaString,
} from "../forms/schema";
import { FormField, FormSelect, FormTextarea } from "../forms/form-fields";
import { DataTable } from "../data-table/data-table";
import { createProductColumns } from "../data-table/products-columns";
import {
  addProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/action/admin/auth.action";
import type { AdminProduct } from "../data";

type ProductsViewProps = {
  products: AdminProduct[];
  onAddProduct: (product: AdminProduct) => void;
  onUpdateProduct: (product: AdminProduct) => void;
  onDeleteProduct: (id: string) => void;
};

export function AllProductsView({
  products,
  onUpdateProduct,
  onDeleteProduct,
}: Pick<
  ProductsViewProps,
  "products" | "onUpdateProduct" | "onDeleteProduct"
>) {
  const [selected, setSelected] = useState<AdminProduct | null>(null);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<AdminProduct | null>(null);

  const columns = useMemo(
    () =>
      createProductColumns({
        onEdit: (product) => setEditProduct(product),
        onDelete: (product) => setDeleteProduct(product),
      }),
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search products by ID or title and manage the catalog
        </p>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="product"
        searchPlaceholder="Search products by title or category..."
        resultCountLabel="products"
        getRowId={(product) => product._id ?? ""}
        selectedId={selected?._id}
        onRowClick={setSelected}
      />

      <EditProductDialog
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(open) => {
          if (!open) setEditProduct(null);
        }}
        onSave={onUpdateProduct}
      />

      <DeleteProductDialog
        product={deleteProduct}
        open={!!deleteProduct}
        onOpenChange={(open) => {
          if (!open) setDeleteProduct(null);
        }}
        onConfirm={() => {
          if (deleteProduct) onDeleteProduct(deleteProduct._id ?? "");
        }}
      />
    </div>
  );
}

function EditProductDialog({
  product,
  open,
  onOpenChange,
  onSave,
}: {
  product: AdminProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: AdminProduct) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: productFormResolver,
    defaultValues: productFormDefaults,
  });

  useEffect(() => {
    if (open && product) {
      reset({
        title: product.title,
        category: product.category as ProductFormValues["category"],
        description: product.description ?? "",
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        colors: toCommaString(product.colors),
        sizes: toCommaString(product.sizes),
        images: toCommaString(product.images),
      });
    }
  }, [open, product, reset]);

  async function onSubmit(values: ProductFormValues) {
    if (!product?._id) return;
    try {
      const response = await updateProductAction(
        product._id,
        productFormToPayload(values),
      );
      console.log(response);
      if (response?.status) {
        onSave({ ...product, ...productFormToPayload(values) });
        onOpenChange(false);
      } else {
        toast.add({
          title: "Update failed",
          description: response?.message ?? "Could not update product.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("[Admin] Failed to update product:", error);
      toast.add({
        title: "Update failed",
        description: "Could not update product.",
        type: "error",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update the details for {product?.title}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={control}
              name="title"
              label="Title"
              className="sm:col-span-2"
              inputClassName="h-10"
            />
            <FormTextarea
              control={control}
              name="description"
              label="Description"
              placeholder="Product description"
              className="sm:col-span-2"
            />
            <FormSelect
              control={control}
              name="category"
              label="Category"
              options={productCategories.map((category) => ({
                value: category,
                label: category,
              }))}
              inputClassName="h-10"
            />
            <FormField
              control={control}
              name="price"
              label="Price (Rs)"
              type="number"
              step="0.01"
              inputClassName="h-10"
            />
            <FormField
              control={control}
              name="discount"
              label="Discount (%)"
              type="number"
              inputClassName="h-10"
            />
            <FormField
              control={control}
              name="stock"
              label="Stock"
              type="number"
              inputClassName="h-10"
            />
            <FormField
              control={control}
              name="colors"
              label="Colors (comma separated)"
              placeholder="e.g. Black, White, Blue"
              className="sm:col-span-2"
              inputClassName="h-10"
            />
            <FormField
              control={control}
              name="sizes"
              label="Sizes (comma separated)"
              placeholder="e.g. S, M, L, XL"
              className="sm:col-span-2"
              inputClassName="h-10"
            />
            <FormField
              control={control}
              name="images"
              label="Image URLs (comma separated)"
              placeholder="https://example.com/image.jpg"
              className="sm:col-span-2"
              inputClassName="h-10"
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 cursor-pointer rounded-lg bg-primary px-6 shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteProductDialog({
  product,
  open,
  onOpenChange,
  onConfirm,
}: {
  product: AdminProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!product?._id) return;
    setIsDeleting(true);
    try {
      const response = await deleteProductAction(product._id);
      if (response?.status) {
        onConfirm();
        onOpenChange(false);
      } else {
        toast.add({
          title: "Delete failed",
          description: response?.message ?? "Could not delete product.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("[Admin] Failed to delete product:", error);
      toast.add({
        title: "Delete failed",
        description: "Could not delete product.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product?</DialogTitle>
          <DialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">
              {product?.title}
            </span>{" "}
            from the catalog. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddProductView({
  onAddProduct,
}: Pick<ProductsViewProps, "onAddProduct">) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: productFormResolver,
    defaultValues: productFormDefaults,
  });

  async function onSubmit(values: ProductFormValues) {
    try {
      const response = await addProductAction(productFormToPayload(values));
      if (response?.status) {
        onAddProduct(response.data as AdminProduct);
        reset(productFormDefaults);
      } else {
        toast.add({
          title: "Add failed",
          description: response?.message ?? "Could not add product.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("[Admin] Failed to add product:", error);
      toast.add({
        title: "Add failed",
        description: "Could not add product.",
        type: "error",
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new product in the catalog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="title"
                label="Title"
                placeholder="Product title"
                className="sm:col-span-2"
                inputClassName="h-10"
              />
              <FormTextarea
                control={control}
                name="description"
                label="Description"
                placeholder="Product description"
                className="sm:col-span-2"
              />
              <FormSelect
                control={control}
                name="category"
                label="Category"
                options={productCategories.map((category) => ({
                  value: category,
                  label: category,
                }))}
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="price"
                label="Price (Rs)"
                type="number"
                step="0.01"
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="discount"
                label="Discount (%)"
                type="number"
                step="1"
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="stock"
                label="Stock"
                type="number"
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="colors"
                label="Colors (comma separated)"
                placeholder="e.g. Black, White, Blue"
                className="sm:col-span-2"
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="sizes"
                label="Sizes (comma separated)"
                placeholder="e.g. S, M, L, XL"
                className="sm:col-span-2"
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="images"
                label="Image URLs (comma separated)"
                placeholder="https://example.com/image.jpg"
                className="sm:col-span-2"
                inputClassName="h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-10 w-full cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 sm:w-auto sm:px-8"
            >
              {isSubmitting ? "Adding..." : "Add product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
