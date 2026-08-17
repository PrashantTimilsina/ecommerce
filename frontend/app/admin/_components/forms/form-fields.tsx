"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  step?: string;
  className?: string;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  step,
  className,
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
            className={fieldState.error ? "border-destructive" : undefined}
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
};

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  className,
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
            className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
