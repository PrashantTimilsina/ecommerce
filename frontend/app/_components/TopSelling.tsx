"use client";

import { Button } from "@/components/ui/button";
import { type Product, ProductCard } from "./NewArrival";

const products: Product[] = [
  {
    id: 1,
    name: "Vertical Striped Shirt",
    image: "/products/vertical-striped-shirt.png",
    rating: 5,
    price: 212,
    originalPrice: 232,
    discountPercent: 20,
  },
  {
    id: 2,
    name: "Courage Graphic T-shirt",
    image: "/products/courage-tshirt.png",
    rating: 4,
    price: 145,
  },
  {
    id: 3,
    name: "Loose Fit Bermuda Shorts",
    image: "/products/bermuda-shorts.png",
    rating: 3,
    price: 80,
  },
  {
    id: 4,
    name: "Faded Skinny Jeans",
    image: "/products/faded-skinny-jeans.png",
    rating: 4.5,
    price: 210,
  },
];

function TopSelling() {
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide mb-6 sm:mb-8 md:mb-10">
          TOP SELLING
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:mt-10">
          <Button
            variant="outline"
            className="rounded-full px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base cursor-pointer"
          >
            View All
          </Button>
        </div>

        <hr className="mt-8 sm:mt-10 border-border" />
      </div>
    </section>
  );
}

export default TopSelling;
