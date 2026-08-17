"use client";

import Image from "next/image";
import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminProduct } from "../data";
import type { DataTableFeatures } from "./data-table-features";

export function createProductColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (product: AdminProduct) => void;
  onDelete: (product: AdminProduct) => void;
}) {
  const helper = createColumnHelper<DataTableFeatures, AdminProduct>();

  return helper.columns([
    helper.accessor((row) => `${row.title} ${row._id}`, {
      id: "product",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Image
            src={
              row.original.image ?? "https://picsum.photos/seed/product/100/100"
            }
            alt={row.original.title}
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.title}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {row.original._id ?? ""}
            </p>
          </div>
        </div>
      ),
    }),
    helper.accessor("category", {
      header: "Category",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    helper.accessor("price", {
      header: () => <div className="text-right">Price</div>,
      cell: ({ getValue }) => (
        <div className="text-right">${getValue().toFixed(2)}</div>
      ),
    }),
    helper.accessor("discount", {
      header: () => <div className="text-right">Discount</div>,
      cell: ({ getValue }) =>
        getValue() > 0 ? (
          <div className="text-right">
            <Badge variant="secondary">{getValue()}%</Badge>
          </div>
        ) : (
          <div className="text-right text-muted-foreground">—</div>
        ),
    }),
    helper.accessor("stock", {
      header: () => <div className="text-right">Stock</div>,
      cell: ({ getValue }) => (
        <div className="text-right">
          <span
            className={
              getValue() === 0 ? "font-medium text-destructive" : undefined
            }
          >
            {getValue()}
          </span>
        </div>
      ),
    }),
    helper.accessor("rating", {
      header: () => <div className="text-right">Rating</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{JSON.parse(getValue().toFixed(1))}⭐</div>
      ),
    }),
    helper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onEdit(row.original)}
            aria-label="Edit product"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(row.original)}
            aria-label="Delete product"
          >
            <Trash2 />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
  ]);
}
