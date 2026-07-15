"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import FilterSidebar from "../_components/FilterSidebar";
import { type Product, ProductCard } from "../_components/NewArrival";

const products: Product[] = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    image: "/products/gradient-graphic-tshirt.png",
    rating: 3.5,
    price: 145,
  },
  {
    id: 2,
    name: "Polo with Tipping Details",
    image: "/products/polo-tipping.png",
    rating: 4.5,
    price: 180,
  },
  {
    id: 3,
    name: "Black Striped T-shirt",
    image: "/products/black-striped-tshirt.png",
    rating: 5.0,
    price: 120,
    originalPrice: 150,
    discountPercent: 30,
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    image: "/products/jeans.png",
    rating: 3.5,
    price: 240,
    originalPrice: 260,
    discountPercent: 20,
  },
  {
    id: 5,
    name: "Checkered Shirt",
    image: "/products/checkered-shirt.png",
    rating: 4.5,
    price: 180,
  },
  {
    id: 6,
    name: "Sleeve Striped T-shirt",
    image: "/products/striped-tshirt.png",
    rating: 4.5,
    price: 130,
    originalPrice: 160,
    discountPercent: 30,
  },
  {
    id: 7,
    name: "Vertical Striped Shirt",
    image: "/products/vertical-striped-shirt.png",
    rating: 5.0,
    price: 212,
    originalPrice: 232,
    discountPercent: 20,
  },
  {
    id: 8,
    name: "Courage Graphic T-shirt",
    image: "/products/courage-tshirt.png",
    rating: 4.0,
    price: 145,
  },
  {
    id: 9,
    name: "Loose Fit Bermuda Shorts",
    image: "/products/bermuda-shorts.png",
    rating: 3.0,
    price: 80,
  },
];

function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <FilterSidebar
          onApply={(filters) => console.log("Applied filters:", filters)}
        />

        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-extrabold text-2xl sm:text-3xl">Casual</h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing 1-9 of 100 Products</span>
              <span className="hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-32 h-8 border-0 shadow-none font-medium text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <hr className="border-border" />

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="h-9 w-9 flex items-center justify-center rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 flex items-center justify-center rounded-full text-sm transition-colors cursor-pointer ${
                    currentPage === page
                      ? "bg-foreground text-background"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="h-9 w-9 flex items-center justify-center rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
