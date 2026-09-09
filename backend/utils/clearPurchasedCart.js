import User from "../models/user.js";

const key = (item) => JSON.stringify([item.title ?? item.product, item.size, item.color]);

export function subtractPurchasedItems(cart, purchased) {
  const remaining = new Map();
  for (const item of purchased) remaining.set(key(item), (remaining.get(key(item)) || 0) + item.quantity);
  return cart.flatMap((item) => {
    const count = Math.min(item.quantity, remaining.get(key(item)) || 0);
    remaining.set(key(item), (remaining.get(key(item)) || 0) - count);
    return item.quantity > count ? [{ ...item, quantity: item.quantity - count }] : [];
  });
}

export async function clearPurchasedCart(userId, orderId, items) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const user = await User.findById(userId).lean();
    if (!user || user.clearedCartOrders?.some((id) => String(id) === String(orderId))) return;
    // Apply cleanup and its replay marker in one atomic user-document update.
    // Retry if another cart operation changed the snapshot we just read.
    const result = await User.updateOne({ _id: userId, cartItems: user.cartItems,
      clearedCartOrders: { $ne: orderId } }, {
      $set: { cartItems: subtractPurchasedItems(user.cartItems, items) },
      $addToSet: { clearedCartOrders: orderId },
    });
    if (result.matchedCount) return;
  }
  throw new Error("Your order is paid, but the cart is busy. Refresh to finish updating it; do not pay again.");
}
