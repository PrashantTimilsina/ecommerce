"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import CartItem, { type CartItemData } from "./_components/CartItem";
import OrderSummary from "./_components/OrderSummary";

const initialItems: CartItemData[] = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    image: "/products/gradient-graphic-tshirt.png",
    size: "Large",
    color: "White",
    price: 145,
    quantity: 1,
  },
  {
    id: 2,
    name: "Checkered Shirt",
    image: "/products/checkered-shirt.png",
    size: "Medium",
    color: "Red",
    price: 180,
    quantity: 1,
  },
  {
    id: 3,
    name: "Skinny Fit Jeans",
    image: "/products/jeans.png",
    size: "Large",
    color: "Blue",
    price: 240,
    quantity: 1,
  },
];

function CartPage() {
  const [items, setItems] = useState<CartItemData[]>(initialItems);

  const handleQuantityChange = (id: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span className="cursor-pointer hover:text-foreground">Home</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">Cart</span>
      </div>

      <h1 className="font-extrabold text-3xl sm:text-4xl mb-6">YOUR CART</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Cart items */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Order summary */}
        <OrderSummary
          subtotal={subtotal}
          discountPercent={20}
          deliveryFee={15}
          onCheckout={() => console.log("Proceeding to checkout")}
          onApplyPromo={(code) => console.log("Applying promo:", code)}
        />
      </div>
    </div>
  );
}

export default CartPage;
