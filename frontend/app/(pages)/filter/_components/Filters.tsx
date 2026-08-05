"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import {
  getFilterOptions,
  resolveSwatchColor,
  isLightColor,
} from "./FilterOptions";
import { MOCK_PRODUCTS } from "./MockProduct";

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-border/60 py-5 first:pt-0 last:border-b-0"
    >
      <summary className="flex w-full cursor-pointer select-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function Filters() {
  const options = getFilterOptions(MOCK_PRODUCTS);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      params.append(key, value.toString());
    }
    router.push(`/filter?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    formRef.current?.reset();
    router.push("/filter", { scroll: false });
  };

  return (
    <aside className="w-full max-w-xs rounded-2xl border border-border/60 bg-background p-5">
      <form ref={formRef} action="/filter" method="get" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-bold">Filters</h2>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Clear all
          </button>
        </div>

        {/* Category — single select */}
        <Section title="Category">
          <ul className="flex flex-col gap-2.5">
            {options.categories.map((category) => (
              <li key={category}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    className="h-4 w-4 accent-black"
                  />
                  <span>{category}</span>
                </label>
              </li>
            ))}
          </ul>
        </Section>

        {/* Colors — single select */}
        <Section title="Colors">
          <div className="flex flex-wrap gap-3">
            {options.colors.map((color) => (
              <label
                key={color}
                title={color}
                className="relative block h-8 w-8 cursor-pointer rounded-full"
              >
                <input
                  type="radio"
                  name="color"
                  value={color}
                  className="peer sr-only"
                />
                <span
                  className="absolute inset-0 rounded-full ring-1 ring-border/70 transition-transform peer-checked:scale-110 peer-checked:ring-2 peer-checked:ring-black"
                  style={{ backgroundColor: resolveSwatchColor(color) }}
                />
                <Check
                  className={`absolute inset-0 m-auto h-4 w-4 opacity-0 peer-checked:opacity-100 ${
                    isLightColor(color) ? "text-black" : "text-white"
                  }`}
                  strokeWidth={3}
                />
              </label>
            ))}
          </div>
        </Section>

        {/* Size — single select */}
        <Section title="Size">
          <div className="flex flex-wrap gap-2">
            {options.sizes.map((size) => (
              <label key={size} className="cursor-pointer rounded-full">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  className="peer sr-only"
                />
                <span className="block rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors peer-checked:border-black peer-checked:bg-black peer-checked:text-white">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </Section>

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-black py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Apply Filter
        </button>
      </form>
    </aside>
  );
}
