"use client";

import { useState } from "react";
import { Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OrderSummaryProps {
  subtotal: number;
  discountPercent: number;
  deliveryFee: number;
  onCheckout?: () => void;
  onApplyPromo?: (code: string) => void;
}

function OrderSummary({
  subtotal,
  discountPercent,
  deliveryFee,
  onCheckout,
  onApplyPromo,
}: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState("");

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount + deliveryFee;

  return (
    <div className="w-full lg:w-80 shrink-0 border border-border rounded-2xl p-5 flex flex-col gap-5">
      <h2 className="font-bold text-lg">Order Summary</h2>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">${subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Discount (-{discountPercent}%)
          </span>
          <span className="font-semibold text-red-500">-${discountAmount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-semibold">${deliveryFee}</span>
        </div>
      </div>

      <hr className="border-border" />

      <div className="flex items-center justify-between">
        <span className="font-medium">Total</span>
        <span className="font-bold text-xl">${total}</span>
      </div>

      {/* Promo code */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Add promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="bg-muted pl-9 rounded-full h-10 border-0"
          />
        </div>
        <Button
          onClick={() => onApplyPromo?.(promoCode)}
          className="rounded-full h-10 px-5 cursor-pointer shrink-0"
        >
          Apply
        </Button>
      </div>

      <Button
        onClick={onCheckout}
        className="rounded-full h-12 text-base cursor-pointer flex items-center justify-center gap-2"
      >
        Go to Checkout
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default OrderSummary;
