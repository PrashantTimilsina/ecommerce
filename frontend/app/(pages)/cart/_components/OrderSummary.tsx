"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface OrderSummaryProps {
  subtotal: number;
  discountPercent: number;
  deliveryFee: number;
  disabled?: boolean;
}

function OrderSummary({
  subtotal,
  discountPercent,
  deliveryFee,
  disabled,
}: OrderSummaryProps) {
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.round(subtotal - discountAmount + deliveryFee);
  const router = useRouter();
  function handleCheckout() {
    router.push(`/esewa?total=${total}`);
  }

  return (
    <div className="w-full lg:w-80 shrink-0 border border-border rounded-2xl p-5 flex flex-col gap-5">
      <h2 className="font-bold text-lg">Order Summary</h2>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">Rs {subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Discount (-{discountPercent}%)
          </span>
          <span className="font-semibold text-red-500">
            -Rs {discountAmount}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-semibold">Rs {deliveryFee}</span>
        </div>
      </div>

      <hr className="border-border" />

      <div className="flex items-center justify-between">
        <span className="font-medium">Total</span>
        <span className="font-bold text-xl">Rs {total}</span>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={disabled}
        className="rounded-full h-12 text-base cursor-pointer flex items-center justify-center gap-2"
      >
        Go to Checkout
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default OrderSummary;
