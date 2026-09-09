"use client";

import { useEffect, useState } from "react";

import CartItem, { type CartItemData } from "./_components/CartItem";
import OrderSummary from "./_components/OrderSummary";
import { getUserAction } from "@/action/user.action";

function CartPage() {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        window.scrollTo(0, 0);
        const response = await getUserAction();

        // response.data is now GetUserData — fully typed, no casts
        const apiItems = response.data.user?.cartItems ?? [];

        const mapped: CartItemData[] = apiItems.map((item) => ({
          name: item.product,
          image: item.image,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
        }));

        const grouped = new Map<string, CartItemData>();
        for (const item of mapped) {
          const key = JSON.stringify([item.name, item.size, item.color]);
          const existing = grouped.get(key);
          if (existing) existing.quantity += item.quantity;
          else grouped.set(key, { ...item });
        }
        setItems([...grouped.values()]);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCartItems();
  }, []);

  const sameItem = (a: CartItemData, b: CartItemData) => a.name === b.name && a.size === b.size && a.color === b.color;
  const handleQuantityChange = (changed: CartItemData, quantity: number, price: number) => {
    setItems((prev) =>
      prev.map((item) => sameItem(item, changed) ? { ...item, quantity, price } : item),
    );
  };

  const handleRemove = (removed: CartItemData) => {
    setItems((prev) => prev.filter((item) => !sameItem(item, removed)));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  ) / 100;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-extrabold text-3xl sm:text-3xl mb-6">YOUR CART</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Cart items */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {loading ? (
            <p className="text-muted-foreground text-sm">
              Loading your cart...
            </p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <CartItem
                key={JSON.stringify([item.name, item.size, item.color])}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                busy={updating}
                onBusyChange={setUpdating}
              />
            ))
          )}
        </div>

        {/* Order summary */}
        {items.length > 0 && (
          <OrderSummary
            subtotal={subtotal}
            discountPercent={20}
            deliveryFee={15}
            disabled={updating}
          />
        )}
      </div>
    </div>
  );
}

export default CartPage;
