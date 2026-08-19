"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  step?: string;
  className?: string;
  inputClassName?: string;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  step,
  className,
  inputClassName,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Label htmlFor={name} className="mb-1.5 block text-sm font-medium">
            {label}
          </Label>
          <Input
            id={name}
            type={type}
            step={step}
            placeholder={placeholder}
            {...field}
            className={cn(
              fieldState.error ? "border-destructive" : undefined,
              inputClassName,
            )}
          />
          {fieldState.error && (
            <p className="mt-1 text-xs font-medium text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

type FormTextareaProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  inputClassName,
}: FormTextareaProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Label htmlFor={name} className="mb-1.5 block text-sm font-medium">
            {label}
          </Label>
          <Textarea
            id={name}
            placeholder={placeholder}
            {...field}
            className={cn(
              fieldState.error ? "border-destructive" : undefined,
              inputClassName,
            )}
          />
          {fieldState.error && (
            <p className="mt-1 text-xs font-medium text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  inputClassName?: string;
};

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  className,
  inputClassName,
}: FormSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Label htmlFor={name} className="mb-1.5 block text-sm font-medium">
            {label}
          </Label>
          <select
            id={name}
            value={field.value as string}
            onChange={(e) => field.onChange(e.target.value)}
            className={cn(
              "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              fieldState.error ? "border-destructive" : undefined,
              inputClassName,
            )}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldState.error && (
            <p className="mt-1 text-xs font-medium text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
