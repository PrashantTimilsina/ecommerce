"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "./NewArrival";
import { Product } from "@/types/product";
import Link from "next/link";

function TopSelling({ products: defaultProduct }: { products: Product[] }) {
  const products = defaultProduct.slice(2, 14);
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide mb-6 sm:mb-8 md:mb-10">
          TOP SELLING
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:mt-10">
          <Link href="/filter">
            <Button
              variant="outline"
              className="rounded-full px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base cursor-pointer"
            >
              View All
            </Button>
          </Link>
        </div>

        <hr className="mt-8 sm:mt-10 border-border" />
      </div>
    </section>
  );
}

export default TopSelling;
