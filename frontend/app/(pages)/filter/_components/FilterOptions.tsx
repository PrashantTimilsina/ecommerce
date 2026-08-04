import { Product } from "@/types/product";


/**
 * Derives the available filter options straight from the product list,
 * so the sidebar always reflects real inventory instead of a hardcoded
 * list that can drift out of sync with your catalog.
 */
export function getFilterOptions(products: Product[]) {
  const categories = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<string>();
  let maxPrice = 0;

  for (const product of products) {
    categories.add(product.category);
    product.colors?.forEach((c) => colors.add(c));
    product.sizes?.forEach((s) => sizes.add(s));
    maxPrice = Math.max(maxPrice, product.price);
  }

  return {
    categories: Array.from(categories).sort(),
    colors: Array.from(colors),
    sizes: Array.from(sizes).sort(
      (a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)
    ),
    maxPrice: maxPrice || 500,
  };
}

// Used only to sort sizes in a sensible order — unrecognized sizes fall
// back to the end via -1 handling in the sort comparator above.
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/**
 * A color string might be a hex code ("#111111") or a plain name ("Black").
 * This resolves it to something usable as a CSS background-color, and
 * falls back to a light grey swatch with the name shown on hover for
 * anything it can't resolve.
 */
export function resolveSwatchColor(value: string): string {
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return value;
  // Let the browser's CSS color parser take a shot at named colors
  // (e.g. "red", "navy"); unresolvable values fall back to a neutral grey.
  return value;
}

export function isLightColor(value: string): boolean {
  const light = ["white", "#fff", "#ffffff", "beige", "cream", "yellow"];
  return light.some((l) => value.toLowerCase().includes(l));
}