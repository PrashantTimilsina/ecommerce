"use client";

import { useMemo, useState } from "react";
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
  type UserFormValues,
  userFormDefaults,
  userFormResolver,
} from "../forms/schema";
import { FormField, FormSelect } from "../forms/form-fields";
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

export function AllUsersView({ users }: { users: AdminUser[] }) {
  const [searchId, setSearchId] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  console.log(users);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search users by ID and view all registered accounts
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-sm">
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by user ID..."
            className="h-10 rounded-lg px-4 pr-8 shadow-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {users.length} of {users.length} users
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  onClick={() => setSelected(user)}
                  className={
                    selected?._id === user._id
                      ? "bg-muted/60"
                      : "cursor-pointer"
                  }
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {user._id}
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.createdAt.split("T")[0]}
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No users found
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

export function AddUserView({
  onAddUser,
}: {
  onAddUser: (user: AdminUser) => void;
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
              />
              <FormField
                control={control}
                name="email"
                label="Email"
                type="email"
                placeholder="user@example.com"
                className="sm:col-span-2"
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
              />
              <FormField
                control={control}
                name="createdAt"
                label="Creation date"
                type="date"
                className="sm:col-span-2"
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

export function UpdateUserView({
  users,
  onUpdateUser,
}: Pick<UsersViewProps, "users" | "onUpdateUser">) {
  const [searchId, setSearchId] = useState("");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [notFound, setNotFound] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormValues>({
    resolver: userFormResolver,
    defaultValues: userFormDefaults,
  });

  function findUser() {
    const found = users.find(
      (u) => u._id.toLowerCase() === searchId.trim().toLowerCase(),
    );
    if (found) {
      setTarget(found);
      setNotFound(false);
      reset({
        name: found.name,
        email: found.email,
        role: found.role,
        createdAt: found.createdAt,
      });
    } else {
      setTarget(null);
      setNotFound(true);
    }
  }

  function onSubmit(values: UserFormValues) {
    if (!target) return;
    console.log(
      "[Admin] Update User form values:",
      values,
      "user id:",
      target._id,
    );
    onUpdateUser({
      ...target,
      ...values,
      createdAt: values.createdAt || target.createdAt,
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Update User</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find a user by ID, edit their details and save
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find user</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter user ID (e.g. u_1a2b3c4d)"
            className="h-10 rounded-lg px-4 shadow-sm sm:max-w-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") findUser();
            }}
          />
          <Button
            onClick={findUser}
            className="h-10 cursor-pointer rounded-lg bg-primary px-6 shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
          >
            Search
          </Button>
          {target && <Badge variant="outline">{target.name}</Badge>}
          {notFound && (
            <p className="text-sm font-medium text-destructive">
              No user found with that ID.
            </p>
          )}
        </CardContent>
      </Card>

      {target && (
        <Card>
          <CardHeader>
            <CardTitle>Edit “{target.name}”</CardTitle>
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
                  className="sm:col-span-2"
                />
                <FormField
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  className="sm:col-span-2"
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
                />
                <FormField
                  control={control}
                  name="createdAt"
                  label="Creation date"
                  type="date"
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

export function DeleteUserView({
  users,
  onDeleteUser,
}: Pick<UsersViewProps, "users" | "onDeleteUser">) {
  const [searchId, setSearchId] = useState("");
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [notFound, setNotFound] = useState(false);

  function findUser() {
    const found = users.find(
      (u) => u._id.toLowerCase() === searchId.trim().toLowerCase(),
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
    console.log("[Admin] Delete User payload:", {
      id: target._id,
      name: target.name,
    });
    onDeleteUser(target._id);
    setTarget(null);
    setSearchId("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Delete User</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find a user by ID and remove their account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find user</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter user ID (e.g. u_1a2b3c4d)"
            className="h-10 rounded-lg px-4 shadow-sm sm:max-w-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") findUser();
            }}
          />
          <Button
            onClick={findUser}
            className="h-10 cursor-pointer rounded-lg bg-primary px-6 shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
          >
            Search
          </Button>
          {notFound && (
            <p className="text-sm font-medium text-destructive">
              No user found with that ID.
            </p>
          )}
        </CardContent>
      </Card>

      {target && (
        <Card>
          <CardHeader>
            <CardTitle>Delete “{target.name}”?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {target.email}
              </span>{" "}
              from the store. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="h-10 w-full cursor-pointer bg-gradient-to-r from-destructive to-destructive/80 text-sm font-semibold shadow-md shadow-destructive/25 transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:w-auto sm:px-8"
            >
              Delete user
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
