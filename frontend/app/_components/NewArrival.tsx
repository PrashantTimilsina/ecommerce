"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          // how "full" this particular star should be, from 0 to 1
          const fillPercent = Math.min(Math.max(rating - i, 0), 1) * 100;

          return (
            <div key={i} className="relative h-4 w-4">
              {/* background (empty) star */}
              <Star className="absolute inset-0 h-4 w-4 fill-muted text-muted" />

              {/* foreground (filled) star, clipped to fillPercent width */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground ml-1">{rating}/5</span>
    </div>
  );
}


export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product-detail/${product.slug}`} className="group">
      <div className="flex flex-col gap-3">
        <div className="relative bg-muted rounded-2xl aspect-square overflow-hidden ring-1 ring-border/50 transition-shadow duration-300 group-hover:shadow-lg">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {product.discount > 0 && (
            <span className="absolute top-3 left-3 text-xs font-medium text-white bg-red-500 rounded-full px-2.5 py-1 shadow-sm">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="font-semibold text-base truncate transition-colors duration-200 group-hover:text-primary">
            {product.title}
          </h3>

          <StarRating rating={product.rating} />

          <div className="flex items-center gap-2 mt-0.5">
            {product.discount > 0 && (
              <span className="text-lg font-bold tracking-tight">
                $
                {parseInt(
                  (
                    product.price -
                    (product.price * product.discount) / 100
                  ).toFixed(2)
                )}
              </span>
            )}
            <span
              className={`font-bold text-lg tracking-tight ${
                product.discount > 0
                  ? "line-through text-muted-foreground text-sm font-medium"
                  : ""
              }`}
            >
              ${product.price}
            </span>
          </div>
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
          <Link href="/filter"><Button
            variant="outline"
            className="rounded-full px-10 py-5 cursor-pointer"
          >
            Show All
          </Button></Link>
        </div>

        <hr className="mt-10 border-border" />
      </div>
    </section>
  );
}

export default NewArrival;