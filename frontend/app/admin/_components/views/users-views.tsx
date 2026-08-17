"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  type UserFormValues,
  userFormDefaults,
  userFormResolver,
} from "../forms/schema";
import { FormField, FormSelect } from "../forms/form-fields";
import { DataTable } from "../data-table/data-table";
import { createUserColumns } from "../data-table/users-columns";
import type { AdminUser } from "../data";

function generateId() {
  return `u_${Math.random().toString(36).slice(2, 10)}`;
}

type UsersViewProps = {
  users: AdminUser[];
  onAddUser: (user: AdminUser) => void;
  onUpdateUser: (user: AdminUser) => void;
  onDeleteUser: (id: string) => void;
};

export function AllUsersView({
  users,
  onUpdateUser,
  onDeleteUser,
}: Pick<UsersViewProps, "users" | "onUpdateUser" | "onDeleteUser">) {
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const columns = useMemo(
    () =>
      createUserColumns({
        onEdit: (user) => setEditUser(user),
        onDelete: (user) => setDeleteUser(user),
      }),
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search users, edit their details or remove their account
        </p>
      </div>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>Selected user</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="font-mono">
              {selected._id}
            </Badge>
            <span className="font-medium text-foreground">{selected.name}</span>
            <span>·</span>
            <span>{selected.email}</span>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={users}
        searchKey="_id"
        searchPlaceholder="Search by user ID..."
        resultCountLabel="users"
        getRowId={(user) => user._id}
        selectedId={selected?._id}
        onRowClick={setSelected}
      />

      <EditUserDialog
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => {
          if (!open) setEditUser(null);
        }}
        onSave={onUpdateUser}
      />

      <DeleteUserDialog
        user={deleteUser}
        open={!!deleteUser}
        onOpenChange={(open) => {
          if (!open) setDeleteUser(null);
        }}
        onConfirm={() => {
          if (deleteUser) onDeleteUser(deleteUser._id);
        }}
      />
    </div>
  );
}

function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: AdminUser) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormValues>({
    resolver: userFormResolver,
    defaultValues: userFormDefaults,
  });

  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    }
  }, [open, user, reset]);

  function onSubmit(values: UserFormValues) {
    if (!user) return;
    console.log("[Admin] Update User form values:", values, user._id);
    onSave({
      ...user,
      ...values,
      createdAt: values.createdAt || user.createdAt,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update the details for {user?.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={control}
            name="name"
            label="Full name"
            className="sm:col-span-2"
            inputClassName="h-10"
          />
          <FormField
            control={control}
            name="email"
            label="Email"
            type="email"
            className="sm:col-span-2"
            inputClassName="h-10"
          />
          <FormSelect
            control={control}
            name="role"
            label="Role"
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            className="sm:col-span-2"
            inputClassName="h-10"
          />
          <FormField
            control={control}
            name="createdAt"
            label="Creation date"
            type="date"
            className="sm:col-span-2"
            inputClassName="h-10"
          />
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

function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user?</DialogTitle>
          <DialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">{user?.email}</span>{" "}
            from the store. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddUserView({ onAddUser }: Pick<UsersViewProps, "onAddUser">) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormValues>({
    resolver: userFormResolver,
    defaultValues: userFormDefaults,
  });

  function onSubmit(values: UserFormValues) {
    console.log("[Admin] Add User form values:", values);
    onAddUser({
      _id: generateId(),
      ...values,
      createdAt: values.createdAt || new Date().toISOString(),
    });
    reset(userFormDefaults);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add User</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new user account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="name"
                label="Full name"
                placeholder="e.g. John Doe"
                className="sm:col-span-2"
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="email"
                label="Email"
                type="email"
                placeholder="user@example.com"
                className="sm:col-span-2"
                inputClassName="h-10"
              />
              <FormSelect
                control={control}
                name="role"
                label="Role"
                options={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
                className="sm:col-span-2"
                inputClassName="h-10"
              />
              <FormField
                control={control}
                name="createdAt"
                label="Creation date"
                type="date"
                className="sm:col-span-2"
                inputClassName="h-10"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-10 w-full cursor-pointer bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 sm:w-auto sm:px-8"
            >
              {isSubmitting ? "Adding..." : "Add user"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
