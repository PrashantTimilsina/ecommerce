"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import { Star, Minus, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "@/components/ui/toast";
import { addToCartAction } from "@/action/product.action";

function StarRating({ rating }: { rating: number }) {
  return (
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
  );
}

function ProductHero({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const finalPrice =
    product.discount > 0
      ? parseInt(
          (product.price - (product.price * product.discount) / 100).toFixed(2),
        )
      : product.price;

  async function handleAddToCart() {
    if (!selectedColor || !selectedSize) {
      toast.add({ title: "Please select color and size", type: "error" });
      return;
    }
    const payload = {
      product: product.title,
      image: product.images[selectedImage],
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: finalPrice,
    };
    const response = await addToCartAction(payload);

    if (response.status) {
      toast.add({
        title: "Product added to cart successfully",
        type: "success",
      });
    }
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3">
              {product.images.map((thumb, i) => (
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
                src={product.images[selectedImage]}
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
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">
                {product.rating}/5
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              {" "}
              {product.discount > 0 && (
                <span className="text-muted-foreground  text-lg font-bold">
                  Rs {finalPrice}
                </span>
              )}
              <span
                className={`font-semibold text-lg ${product.discount > 0 ? "line-through text-muted-foreground" : ""}`}
              >
                Rs {product.price}
              </span>
              {product.discount > 0 && (
                <span className="text-xs font-medium text-red-600 bg-red-100 rounded-full px-2 py-0.5">
                  -{product.discount}%
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <hr className="border-border" />

            {/* Color selector */}
            <div className="flex flex-col gap-3">
              <span className="text-sm text-muted-foreground">
                Select Colors
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((color, i) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    className={`h-8 w-8 cursor-pointer rounded-full flex items-center justify-center ring-offset-2 transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-foreground"
                        : "ring-0"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Size selector */}
            <div className="flex flex-col gap-3">
              <span className="text-sm text-muted-foreground">Choose Size</span>
              <div className="flex flex-wrap items-center gap-3">
                {product.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 sm:px-5 py-2.5 cursor-pointer rounded-full text-sm transition-colors ${
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
                className="flex-1 rounded-full h-12 text-base cursor-pointer bg-black text-white"
                onClick={handleAddToCart}
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
