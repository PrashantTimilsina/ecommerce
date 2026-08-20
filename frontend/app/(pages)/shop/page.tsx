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

import FilterSidebar from "@/app/_components/FilterSidebar";
import { ProductCard } from "@/app/_components/NewArrival";
import { Product } from "@/types/product";

const products: Product[] = [
  {
    _id: "1",
    title: "Gradient Graphic T-shirt",
    description: "",
    price: 145,
    discount: 0,
    category: "T-Shirts",
    images: ["/products/gradient-graphic-tshirt.png"],
    colors: [],
    sizes: [],
    rating: 3.5,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "gradient-graphic-t-shirt",
  },
  {
    _id: "2",
    title: "Polo with Tipping Details",
    description: "",
    price: 180,
    discount: 0,
    category: "T-Shirts",
    images: ["/products/polo-tipping.png"],
    colors: [],
    sizes: [],
    rating: 4.5,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "polo-with-tipping-details",
  },
  {
    _id: "3",
    title: "Black Striped T-shirt",
    description: "",
    price: 150,
    discount: 30,
    category: "T-Shirts",
    images: ["/products/black-striped-tshirt.png"],
    colors: [],
    sizes: [],
    rating: 5.0,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "black-striped-t-shirt",
  },
  {
    _id: "4",
    title: "Skinny Fit Jeans",
    description: "",
    price: 260,
    discount: 20,
    category: "Jeans",
    images: ["/products/jeans.png"],
    colors: [],
    sizes: [],
    rating: 3.5,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "skinny-fit-jeans",
  },
  {
    _id: "5",
    title: "Checkered Shirt",
    description: "",
    price: 180,
    discount: 0,
    category: "Shirts",
    images: ["/products/checkered-shirt.png"],
    colors: [],
    sizes: [],
    rating: 4.5,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "checkered-shirt",
  },
  {
    _id: "6",
    title: "Sleeve Striped T-shirt",
    description: "",
    price: 160,
    discount: 30,
    category: "T-Shirts",
    images: ["/products/striped-tshirt.png"],
    colors: [],
    sizes: [],
    rating: 4.5,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "sleeve-striped-t-shirt",
  },
  {
    _id: "7",
    title: "Vertical Striped Shirt",
    description: "",
    price: 232,
    discount: 20,
    category: "Shirts",
    images: ["/products/vertical-striped-shirt.png"],
    colors: [],
    sizes: [],
    rating: 5.0,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "vertical-striped-shirt",
  },
  {
    _id: "8",
    title: "Courage Graphic T-shirt",
    description: "",
    price: 145,
    discount: 0,
    category: "T-Shirts",
    images: ["/products/courage-tshirt.png"],
    colors: [],
    sizes: [],
    rating: 4.0,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "courage-graphic-t-shirt",
  },
  {
    _id: "9",
    title: "Loose Fit Bermuda Shorts",
    description: "",
    price: 80,
    discount: 0,
    category: "Shorts",
    images: ["/products/bermuda-shorts.png"],
    colors: [],
    sizes: [],
    rating: 3.0,
    numReviews: 0,
    stock: 10,
    createdAt: "",
    updatedAt: "",
    slug: "loose-fit-bermuda-shorts",
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
              <ProductCard key={product._id} product={product} />
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
