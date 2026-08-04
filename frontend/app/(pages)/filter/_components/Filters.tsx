"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { resolveSwatchColor, isLightColor } from "./FilterOptions";
import { FilterState } from "@/types/product";


interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  /** Options derived from the actual product list — see getFilterOptions() */
  options: {
    categories: string[];
    colors: string[];
    sizes: string[];
    maxPrice: number;
  };
  defaultFilters: FilterState;
  /** Called when the user taps "Apply Filter" — useful for closing a mobile drawer */
  onApply?: () => void;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 py-5 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-semibold"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Filters({
  filters,
  onChange,
  options,
  defaultFilters,
  onApply,
}: FiltersProps) {
  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const setCategory = (value: string) =>
    onChange({ ...filters, categories: toggleInList(filters.categories, value) });

  const setColor = (value: string) =>
    onChange({ ...filters, colors: toggleInList(filters.colors, value) });

  const setSize = (value: string) =>
    onChange({ ...filters, sizes: toggleInList(filters.sizes, value) });

  const setMaxPrice = (value: number) =>
    onChange({ ...filters, maxPrice: value });

  const reset = () => onChange(defaultFilters);

  const activeCount =
    filters.categories.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.maxPrice !== defaultFilters.maxPrice ? 1 : 0);

  return (
    <aside className="w-full max-w-xs rounded-2xl border border-border/60 bg-background p-5">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-bold">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Category */}
      <Section title="Category">
        <ul className="flex flex-col gap-2.5">
          {options.categories.map((category) => {
            const checked = filters.categories.includes(category);
            return (
              <li key={category}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      checked
                        ? "border-black bg-black text-white"
                        : "border-border"
                    }`}
                  >
                    {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => setCategory(category)}
                  />
                  <span className={checked ? "text-foreground" : ""}>
                    {category}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Price */}
      <Section title="Price">
        <div className="flex flex-col gap-3">
          <input
            type="range"
            min={0}
            max={options.maxPrice}
            step={5}
            value={filters.maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-black"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span className="font-semibold text-foreground">
              Up to ${filters.maxPrice}
            </span>
          </div>
        </div>
      </Section>

      {/* Colors */}
      <Section title="Colors">
        <div className="flex flex-wrap gap-3">
          {options.colors.map((color) => {
            const checked = filters.colors.includes(color);
            const swatch = resolveSwatchColor(color);
            return (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => setColor(color)}
                className={`relative h-8 w-8 rounded-full ring-1 ring-border/70 transition-transform ${
                  checked ? "scale-110 ring-2 ring-black" : "hover:scale-105"
                }`}
                style={{ backgroundColor: swatch }}
              >
                {checked && (
                  <Check
                    className={`absolute inset-0 m-auto h-4 w-4 ${
                      isLightColor(color) ? "text-black" : "text-white"
                    }`}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Size */}
      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {options.sizes.map((size) => {
            const checked = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSize(size)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  checked
                    ? "border-black bg-black text-white"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </Section>

      <button
        type="button"
        onClick={onApply}
        className="mt-5 w-full rounded-full bg-black py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Apply Filter
      </button>
    </aside>
  );
}