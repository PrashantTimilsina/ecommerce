"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { removeFromCartAction, updateCartQuantityAction } from "@/action/product.action";

export interface CartItemData {
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface CartItemProps {
  item: CartItemData;
  onQuantityChange?: (item: CartItemData, quantity: number, price: number) => void;
  onRemove?: (item: CartItemData) => void;
  busy?: boolean;
  onBusyChange?: (busy: boolean) => void;
}

function CartItem({ item, onQuantityChange, onRemove, busy, onBusyChange }: CartItemProps) {
  const quantity = item.quantity;
  const [error, setError] = useState("");

  const updateQuantity = async (next: number) => {
    if (busy) return;
    const clamped = Math.max(1, next);
    setError("");
    onBusyChange?.(true);
    try {
      const response = await updateCartQuantityAction({ product: item.name, size: item.size, color: item.color, quantity: clamped });
      if (response.status) onQuantityChange?.(item, response.data.quantity, response.data.price);
      else setError(response.message);
    } catch {
      setError("Could not update quantity. Please try again.");
    } finally { onBusyChange?.(false); }
  };
  async function handleRemove() {
    if (busy) return;
    onBusyChange?.(true);
    setError("");
    try {
    const response = await removeFromCartAction({
      product: item.name,
      size: item.size,
      color: item.color,
    });
    if (response.status) {
      onRemove?.(item);
    } else {
      setError(response.message);
    }
    } catch { setError("Could not remove item. Please try again."); }
    finally { onBusyChange?.(false); }
  }

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
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
              Color:
              <span
                className="inline-block h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: item.color }}
                aria-label={item.color}
                title={item.color}
              />
            </p>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            aria-label={`Remove ${item.name}`}
            className="text-red-500 hover:text-red-600 cursor-pointer shrink-0"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-base sm:text-lg">
            Rs {item.price}
          </span>

          <div className="flex items-center bg-muted rounded-full px-3 py-1.5 gap-3">
            <button
              type="button"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={busy || quantity <= 1}
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
              disabled={busy}
              aria-label="Increase quantity"
              className="cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default CartItem;
