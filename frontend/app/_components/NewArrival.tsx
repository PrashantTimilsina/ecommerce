"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Product {
  id: number;
  name: string;
  image: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "T-shirt with Tape Details",
    image: "/products/tshirt-black.png",
    rating: 4.5,
    price: 120,
  },
  {
    id: 2,
    name: "Skinny Fit Jeans",
    image: "/products/jeans.png",
    rating: 3.5,
    price: 240,
    originalPrice: 260,
    discountPercent: 20,
  },
  {
    id: 3,
    name: "Checkered Shirt",
    image: "/products/checkered-shirt.png",
    rating: 4.5,
    price: 180,
  },
  {
    id: 4,
    name: "Sleeve Striped T-shirt",
    image: "/products/striped-tshirt.png",
    rating: 4.5,
    price: 130,
    originalPrice: 160,
    discountPercent: 30,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className={`h-4 w-4 ${
              filled || half
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        );
      })}
      <span className="text-sm text-muted-foreground ml-1">{rating}/5</span>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product-detail`}>
      <div className="flex flex-col gap-3">
        <div className="relative bg-muted rounded-2xl aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <h3 className="font-semibold text-base truncate">{product.name}</h3>

        <StarRating rating={product.rating} />

        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">${product.price}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground line-through text-lg">
              ${product.originalPrice}
            </span>
          )}
          {product.discountPercent && (
            <span className="text-xs font-medium text-red-600 bg-red-100 rounded-full px-2 py-0.5">
              -{product.discountPercent}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function NewArrivals() {
  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-extrabold text-3xl sm:text-4xl tracking-wide mb-10  ">
          NEW ARRIVALS
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            className="rounded-full px-10 py-5 cursor-pointer"
          >
            Show All
          </Button>
        </div>

        <hr className="mt-10 border-border" />
      </div>
    </section>
  );
}

export default NewArrivals;
