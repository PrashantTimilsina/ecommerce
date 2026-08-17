"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ProductFormValues,
  productFormDefaults,
  productFormResolver,
} from "../forms/schema";
import { FormField, FormSelect } from "../forms/form-fields";
import type { AdminProduct } from "../data";

function generateId() {
  return `p_${Math.random().toString(36).slice(2, 10)}`;
}

type ProductsViewProps = {
  products: AdminProduct[];
  onAddProduct: (product: AdminProduct) => void;
  onUpdateProduct: (product: AdminProduct) => void;
  onDeleteProduct: (id: string) => void;
};

export function AllProductsView({ products }: { products: AdminProduct[] }) {
  const [searchId, setSearchId] = useState("");
  const [selected, setSelected] = useState<AdminProduct | null>(null);

  const filtered = useMemo(() => {
    const id = searchId.trim().toLowerCase();
    if (!id) return products;
    return products.filter(
      (p) =>
        p._id.toLowerCase().includes(id) || p.title.toLowerCase().includes(id),
    );
  }, [products, searchId]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search products by ID or title and view the full catalog
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by product ID or title..."
          className="h-10 rounded-lg px-4 shadow-sm sm:max-w-sm"
        />
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow
                  key={product._id}
                  onClick={() => setSelected(product)}
                  className={
                    selected?._id === product._id
                      ? "bg-muted/60"
                      : "cursor-pointer"
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={36}
                        height={36}
                        className="size-9 shrink-0 rounded-md object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.title}</p>
                        <p className="truncate font-mono text-xs text-muted-foreground">
                          {product._id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-right">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.discount > 0 ? (
                      <Badge variant="secondary">{product.discount}%</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        product.stock === 0
                          ? "font-medium text-destructive"
                          : undefined
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    ★ {product.rating}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active"
                          ? "default"
                          : product.status === "draft"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
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

  function onSubmit(values: ProductFormValues) {
    console.log("[Admin] Add Product form values:", values);
    onAddProduct({
      _id: generateId(),
      ...values,
      numReviews: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      image: `https://picsum.photos/seed/${Math.random().toString(36).slice(2, 8)}/100/100`,
    });
    reset(productFormDefaults);
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
              />
              <FormField
                control={control}
                name="category"
                label="Category"
                placeholder="e.g. T-Shirts"
                className="sm:col-span-2"
              />
              <FormField
                control={control}
                name="price"
                label="Price ($)"
                type="number"
                step="0.01"
              />
              <FormField
                control={control}
                name="discount"
                label="Discount (%)"
                type="number"
                step="1"
              />
              <FormField
                control={control}
                name="stock"
                label="Stock"
                type="number"
              />
              <FormField
                control={control}
                name="rating"
                label="Rating"
                type="number"
                step="0.1"
              />
              <FormSelect
                control={control}
                name="status"
                label="Status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft" },
                  { value: "archived", label: "Archived" },
                ]}
                className="sm:col-span-2"
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

export function UpdateProductView({
  products,
  onUpdateProduct,
}: Pick<ProductsViewProps, "products" | "onUpdateProduct">) {
  const [searchId, setSearchId] = useState("");
  const [target, setTarget] = useState<AdminProduct | null>(null);
  const [notFound, setNotFound] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: productFormResolver,
    defaultValues: productFormDefaults,
  });

  function findProduct() {
    const found = products.find(
      (p) => p._id.toLowerCase() === searchId.trim().toLowerCase(),
    );
    if (found) {
      setTarget(found);
      setNotFound(false);
      reset({
        title: found.title,
        category: found.category,
        price: found.price,
        discount: found.discount,
        stock: found.stock,
        rating: found.rating,
        status: found.status,
      });
    } else {
      setTarget(null);
      setNotFound(true);
    }
  }

  function onSubmit(values: ProductFormValues) {
    if (!target) return;
    console.log(
      "[Admin] Update Product form values:",
      values,
      "product id:",
      target._id,
    );
    onUpdateProduct({
      ...target,
      ...values,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Update Product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find a product by ID, edit its details and save
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find product</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter product ID (e.g. p_aaa111bbb)"
            className="h-10 rounded-lg px-4 shadow-sm sm:max-w-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") findProduct();
            }}
          />
          <Button
            onClick={findProduct}
            className="h-10 cursor-pointer rounded-lg bg-primary px-6 shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
          >
            Search
          </Button>
          {target && <Badge variant="outline">{target.title}</Badge>}
          {notFound && (
            <p className="text-sm font-medium text-destructive">
              No product found with that ID.
            </p>
          )}
        </CardContent>
      </Card>

      {target && (
        <Card>
          <CardHeader>
            <CardTitle>Edit “{target.title}”</CardTitle>
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
                  className="sm:col-span-2"
                />
                <FormField
                  control={control}
                  name="category"
                  label="Category"
                  className="sm:col-span-2"
                />
                <FormField
                  control={control}
                  name="price"
                  label="Price ($)"
                  type="number"
                  step="0.01"
                />
                <FormField
                  control={control}
                  name="discount"
                  label="Discount (%)"
                  type="number"
                />
                <FormField
                  control={control}
                  name="stock"
                  label="Stock"
                  type="number"
                />
                <FormField
                  control={control}
                  name="rating"
                  label="Rating"
                  type="number"
                  step="0.1"
                />
                <FormSelect
                  control={control}
                  name="status"
                  label="Status"
                  options={[
                    { value: "active", label: "Active" },
                    { value: "draft", label: "Draft" },
                    { value: "archived", label: "Archived" },
                  ]}
                  className="sm:col-span-2"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-10 w-full cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 sm:w-auto sm:px-8"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function DeleteProductView({
  products,
  onDeleteProduct,
}: Pick<ProductsViewProps, "products" | "onDeleteProduct">) {
  const [searchId, setSearchId] = useState("");
  const [target, setTarget] = useState<AdminProduct | null>(null);
  const [notFound, setNotFound] = useState(false);

  function findProduct() {
    const found = products.find(
      (p) => p._id.toLowerCase() === searchId.trim().toLowerCase(),
    );
    if (found) {
      setTarget(found);
      setNotFound(false);
    } else {
      setTarget(null);
      setNotFound(true);
    }
  }

  function handleDelete() {
    if (!target) return;
    console.log("[Admin] Delete Product payload:", {
      id: target._id,
      title: target.title,
    });
    onDeleteProduct(target._id);
    setTarget(null);
    setSearchId("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Delete Product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find a product by ID and remove it from the catalog
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find product</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter product ID (e.g. p_aaa111bbb)"
            className="h-10 rounded-lg px-4 shadow-sm sm:max-w-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") findProduct();
            }}
          />
          <Button
            onClick={findProduct}
            className="h-10 cursor-pointer rounded-lg bg-primary px-6 shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
          >
            Search
          </Button>
          {notFound && (
            <p className="text-sm font-medium text-destructive">
              No product found with that ID.
            </p>
          )}
        </CardContent>
      </Card>

      {target && (
        <Card>
          <CardHeader>
            <CardTitle>Delete “{target.title}”?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={target.image}
                alt={target.title}
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-md object-cover"
              />
              <p className="text-sm text-muted-foreground">
                This will permanently remove{" "}
                <span className="font-medium text-foreground">
                  {target.title}
                </span>{" "}
                from the catalog. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="h-10 w-full cursor-pointer bg-gradient-to-r from-destructive to-destructive/80 text-sm font-semibold shadow-md shadow-destructive/25 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:w-auto sm:px-8"
            >
              Delete product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
