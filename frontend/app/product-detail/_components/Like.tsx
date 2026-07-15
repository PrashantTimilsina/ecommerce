"use client";

import { type Product, ProductCard } from "@/app/_components/NewArrival";

const products: Product[] = [
  {
    id: 1,
    name: "Polo with Contrast Trims",
    image: "/products/polo-teal.png",
    rating: 4.0,
    price: 212,
    originalPrice: 242,
    discountPercent: 20,
  },
  {
    id: 2,
    name: "Gradient Graphic T-shirt",
    image: "/products/gradient-graphic-tshirt.png",
    rating: 3.5,
    price: 145,
  },
  {
    id: 3,
    name: "Polo with Tipping Details",
    image: "/products/polo-tipping.png",
    rating: 4.5,
    price: 180,
  },
  {
    id: 4,
    name: "Black Striped T-shirt",
    image: "/products/black-striped-tshirt.png",
    rating: 5.0,
    price: 120,
    originalPrice: 150,
    discountPercent: 30,
  },
];

function YouMightAlsoLike() {
  return (
    <section className="w-full py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide mb-6 sm:mb-8 md:mb-10">
          YOU MIGHT ALSO LIKE
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default YouMightAlsoLike;
