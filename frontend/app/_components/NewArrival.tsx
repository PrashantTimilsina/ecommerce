"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <Link href={`/product-detail/${product.slug}`} className="group">
      <div className="flex flex-col gap-3">
        <div className="relative bg-muted rounded-2xl aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        <h3 className="font-semibold text-base truncate">{product.title}</h3>

        <StarRating rating={product.rating} />

        <div className="flex items-center gap-2">
          {" "}
          {product.discount > 0 && (
            <span className="text-muted-foreground  text-lg">
            ${parseInt((product.price - (product.price * product.discount) / 100).toFixed(2))}
            </span>
          )}
          <span
            className={`font-bold text-lg ${product.discount > 0 ? "line-through text-muted-foreground" : ""}`}
          >
            ${product.price}
          </span>
          {product.discount > 0 && (
            <span className="text-xs font-medium text-red-600 bg-red-100 rounded-full px-2 py-0.5">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function NewArrival({ products: defaultProducts }: { products: Product[] }) {
  const products = defaultProducts.slice(0, 8);

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-extrabold text-3xl sm:text-4xl tracking-wide mb-10  ">
          NEW ARRIVALS
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
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

export default NewArrival;
