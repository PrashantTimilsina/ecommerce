"use client";

import { useEffect, useState } from "react";

import CartItem, { type CartItemData } from "./_components/CartItem";
import OrderSummary from "./_components/OrderSummary";
import { getUserAction } from "@/action/user.action";

function CartPage() {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);

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

        setItems(mapped);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCartItems();
  }, []);

  const handleQuantityChange = (name: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.name === name ? { ...item, quantity } : item)),
    );
  };

  const handleRemove = (name: string) => {
    setItems((prev) => prev.filter((item) => item.name !== name));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
            items.map((item, i) => (
              <CartItem
                key={i}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
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
          />
        )}
      </div>
    </div>
  );
}

export default CartPage;
