"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "../data";
import type { DataTableFeatures } from "./data-table-features";

export function createUserColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  const helper = createColumnHelper<DataTableFeatures, AdminUser>();

  return helper.columns([
    helper.accessor("_id", {
      header: "ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {getValue()}
        </span>
      ),
    }),
    helper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    helper.accessor("email", {
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    helper.accessor("role", {
      header: "Role",
      cell: ({ getValue }) => (
        <Badge variant={getValue() === "admin" ? "default" : "secondary"}>
          {getValue()}
        </Badge>
      ),
    }),
    helper.accessor("createdAt", {
      header: "Created",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
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
            aria-label="Edit user"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(row.original)}
            aria-label="Delete user"
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
