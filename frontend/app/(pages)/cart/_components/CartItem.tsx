"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";

export interface CartItemData {
  id: number;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange?: (id: number, quantity: number) => void;
  onRemove?: (id: number) => void;
}

function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const updateQuantity = (next: number) => {
    const clamped = Math.max(1, next);
    setQuantity(clamped);
    onQuantityChange?.(item.id, clamped);
  };

  return (
    <div className="flex items-center gap-4 border border-border rounded-2xl p-4">
      {/* Image */}
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between h-20 sm:h-24">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Size: <span className="text-foreground">{item.size}</span>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Color: <span className="text-foreground">{item.color}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove?.(item.id)}
            aria-label={`Remove ${item.name}`}
            className="text-red-500 hover:text-red-600 cursor-pointer shrink-0"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-base sm:text-lg">${item.price}</span>

          <div className="flex items-center bg-muted rounded-full px-3 py-1.5 gap-3">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              aria-label="Decrease quantity"
              className="cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-sm font-medium w-4 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className="cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
