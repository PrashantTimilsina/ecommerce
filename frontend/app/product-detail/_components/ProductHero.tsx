"use client";
import { useState } from "react";

import Image from "next/image";
import { Star, ChevronRight, Minus, Plus } from "lucide-react";

const thumbnails = [
  "/products/tshirt-1.png",
  "/products/tshirt-2.png",
  "/products/tshirt-3.png",
  "/products/tshirt-4.png",
];

const colors = [
  { name: "Olive", hex: "#3F3D2E" },
  { name: "Navy", hex: "#1E2A4A" },
  { name: "Green", hex: "#2A4A3E" },
];

const sizes = ["Small", "Medium", "Large", "X-Large"];
function ProductHero() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span className="cursor-pointer hover:text-foreground">Home</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="cursor-pointer hover:text-foreground">Shop</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="cursor-pointer hover:text-foreground">Men</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">T-shirts</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3">
              {thumbnails.map((thumb, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-muted border-2 transition-colors ${
                    selectedImage === i
                      ? "border-foreground"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={thumbnails[selectedImage]}
                alt="One Life Graphic T-shirt"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Product info */}
          <div className="flex flex-col gap-5">
            <h1 className="font-extrabold text-2xl sm:text-3xl tracking-wide">
              ONE LIFE GRAPHIC T-SHIRT
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.5/5</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-3xl">$260</span>
              <span className="text-muted-foreground line-through text-2xl">
                $300
              </span>
              <span className="text-xs font-medium text-red-600 bg-red-100 rounded-full px-2.5 py-1">
                -40%
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              This graphic t-shirt which is perfect for any occasion. Crafted
              from a soft and comfortable fabric, it offers superior comfort and
              style.
            </p>

            <hr className="border-border" />

            {/* Color selector */}
            <div className="flex flex-col gap-3">
              <span className="text-sm text-muted-foreground">
                Select Colors
              </span>
              <div className="flex items-center gap-3">
                {colors.map((color, i) => (
                  <button
                    type="button"
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    aria-label={color.name}
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-offset-2 transition-all ${
                      selectedColor === i ? "ring-2 ring-foreground" : "ring-0"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Size selector */}
            <div className="flex flex-col gap-3">
              <span className="text-sm text-muted-foreground">Choose Size</span>
              <div className="flex flex-wrap items-center gap-3">
                {sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-sm transition-colors ${
                      selectedSize === size
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-muted rounded-full px-4 py-2.5 gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-medium w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                className="flex-1 rounded-full h-12 text-base cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductHero;
