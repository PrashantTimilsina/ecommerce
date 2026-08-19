import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";

export const userFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.string().min(1, "Role is required"),
  createdAt: z.string().trim().min(1, "Creation date is required"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const userFormDefaults: UserFormValues = {
  name: "",
  email: "",
  role: "user",
  createdAt: "",
};

export const userFormResolver = zodResolver(
  userFormSchema,
) as Resolver<UserFormValues>;

export const addUserFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    role: z.string().min(1, "Role is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AddUserFormValues = z.infer<typeof addUserFormSchema>;

export const addUserFormDefaults: AddUserFormValues = {
  name: "",
  email: "",
  role: "user",
  password: "",
  confirmPassword: "",
};

export const addUserFormResolver = zodResolver(
  addUserFormSchema,
) as Resolver<AddUserFormValues>;

export const productCategories = [
  "Casual",
  "Formal",
  "Party",
  "Gym",
] as const;

export const productFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  category: z.enum(productCategories, { message: "Category is required" }),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  discount: z.coerce
    .number()
    .min(0, "Discount must be 0 or more")
    .max(100, "Discount must be 100 or less"),
  stock: z.coerce.number().min(0, "Stock must be 0 or more"),
  colors: z.string().trim().min(1, "Add at least one color"),
  sizes: z.string().trim().min(1, "Add at least one size"),
  images: z.string().trim().min(1, "Add at least one image URL"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormDefaults: ProductFormValues = {
  title: "",
  category: "Casual",
  description: "",
  price: 0,
  discount: 0,
  stock: 0,
  colors: "",
  sizes: "",
  images: "",
};

export const productFormResolver = zodResolver(
  productFormSchema,
) as Resolver<ProductFormValues>;

export const toCommaString = (values?: string[]) =>
  values && values.length > 0 ? values.join(", ") : "";

export const fromCommaString = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export function productFormToPayload(values: ProductFormValues) {
  return {
    title: values.title,
    description: values.description,
    category: values.category,
    price: values.price,
    discount: values.discount,
    stock: values.stock,
    colors: fromCommaString(values.colors),
    sizes: fromCommaString(values.sizes),
    images: fromCommaString(values.images),
  };
}
