"use client";

import { useMemo, useState } from "react";
import { getFilterOptions } from "./_components/FilterOptions";
import { MOCK_PRODUCTS } from "./_components/MockProduct";

import { Filters } from "./_components/Filters";

import { FilterState, getDefaultFilters } from "@/types/product";
import { ProductCard } from "@/app/_components/NewArrival";


export default function ProductsPage() {
  // Swap MOCK_PRODUCTS for real data (server fetch / API call) — the
  // filtering logic below works the same either way.
  const products = MOCK_PRODUCTS;

  const options = useMemo(() => getFilterOptions(products), [products]);
  const defaultFilters = useMemo(
    () => getDefaultFilters(products),
    [products]
  );

  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const matchesColor =
        filters.colors.length === 0 ||
        product.colors.some((c) => filters.colors.includes(c));

      const matchesSize =
        filters.sizes.length === 0 ||
        product.sizes.some((s) => filters.sizes.includes(s));

      const discountedPrice =
        product.price - (product.price * product.discount) / 100;
      const matchesPrice = discountedPrice <= filters.maxPrice;

      return matchesCategory && matchesColor && matchesSize && matchesPrice;
    });
  }, [products, filters]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-72 lg:shrink-0">
          <Filters
            filters={filters}
            onChange={setFilters}
            options={options}
            defaultFilters={defaultFilters}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-2xl font-bold">All Products</h1>
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
              <p className="font-semibold">No products match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try clearing a few filters to see more results.
              </p>
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="mt-4 rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}