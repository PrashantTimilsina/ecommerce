import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import User from "../models/user.js";
import { subtractPurchasedItems, clearPurchasedCart } from "../utils/clearPurchasedCart.js";
afterEach(() => mock.restoreAll());
const item = { product: "Shirt", size: "M", color: "black", quantity: 2 };
const paid = [{ title: "Shirt", size: "M", color: "black", quantity: 2 }];
test("removes purchased quantities, preserves added quantities and other variants", () => {
  const other = { ...item, size: "L" };
  assert.deepEqual(subtractPurchasedItems([{ ...item, quantity: 3 }, other], paid), [{ ...item, quantity: 1 }, other]);
  assert.deepEqual(subtractPurchasedItems([item], paid), []);
});
test("subtracts once across legacy duplicate rows", () => {
  assert.deepEqual(subtractPurchasedItems([item, item], paid), [item]);
});
test("cleanup is atomic and replay does not remove items added afterwards", async () => {
  let user = { cartItems: [item], clearedCartOrders: [] };
  mock.method(User, "findById", () => ({ lean: async () => user }));
  const update = mock.method(User, "updateOne", async (filter, changes) => {
    assert.deepEqual(filter.cartItems, [item]);
    assert.deepEqual(filter.clearedCartOrders, { $ne: "order-1" });
    user = { cartItems: changes.$set.cartItems, clearedCartOrders: [changes.$addToSet.clearedCartOrders] };
    return { matchedCount: 1 };
  });
  await clearPurchasedCart("user-1", "order-1", paid);
  assert.deepEqual(user.cartItems, []);
  user.cartItems = [item];
  await clearPurchasedCart("user-1", "order-1", paid);
  assert.deepEqual(user.cartItems, [item]);
  assert.equal(update.mock.callCount(), 1);
});
