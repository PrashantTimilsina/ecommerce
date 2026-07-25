"use client";

import {  ProductCard } from "@/app/_components/NewArrival";
import { Product } from "@/types/product";



function YouMightAlsoLike({products}: { products: Product[] }) {
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide mb-6 sm:mb-8 md:mb-10">
          YOU MIGHT ALSO LIKE
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default YouMightAlsoLike;
