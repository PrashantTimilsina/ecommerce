import { randomUUID } from "node:crypto";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { productPrice } from "../utils/productPrice.js";
import { clearPurchasedCart } from "../utils/clearPurchasedCart.js";

export async function createCheckout(req, res) {
  const user = await User.findById(req.user.id);
  if (!user?.cartItems.length) return res.status(400).json({ message: "Your cart is empty." });
  const productCode = process.env.ESEWA_MERCHANT_CODE;
  if (!productCode) return res.status(503).json({ message: "Set ESEWA_MERCHANT_CODE in the backend environment." });
  const items = [];
  const quantities = new Map();
  for (const item of user.cartItems) {
    const product = await Product.findOne({ title: item.product });
    if (!product || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      return res.status(400).json({ message: "Your cart contains an unavailable product or invalid quantity." });
    }
    const quantity = (quantities.get(String(product.id)) || 0) + item.quantity;
    quantities.set(String(product.id), quantity);
    if (quantity > product.stock) return res.status(400).json({ message: `Insufficient stock for ${product.title}.` });
    items.push({ product: product.id, title: product.title, quantity: item.quantity,
      price: productPrice(product),
      size: item.size, color: item.color, image: product.images[0] });
  }
  // Match the existing cart's 20% discount and Rs. 15 delivery charge.
  const subtotal = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  const totalAmount = Math.round((subtotal - Math.round(subtotal * 0.2 / 100) * 100 + 1500) / 100);
  if (!Number.isSafeInteger(subtotal) || totalAmount <= 0) return res.status(400).json({ message: "Invalid cart total." });
  const requestedAmount = Number(req.body?.amount);
  if (!Number.isFinite(requestedAmount) || Math.round(requestedAmount * 100) !== Math.round(totalAmount * 100)) return res.status(409).json({ message: "Your cart total has changed. Reload your cart before paying." });
  const checkout = await Order.create({ user: user.id, items, totalAmount, productCode, transactionUuid: randomUUID() });
  res.status(201).json({ transactionUuid: checkout.transactionUuid, totalAmount, productCode });
}

export async function confirmOrder(req, res) {
  const { transactionUuid } = req.body ?? {};
  if (typeof transactionUuid !== "string") return res.status(400).json({ message: "Missing transaction UUID." });
  let order = await Order.findOne({ transactionUuid, user: req.user.id });
  if (!order) return res.status(404).json({ message: "Order not found." });
  const checkout = order;
  if (order.paymentStatus !== "paid") {
    const base = process.env.ESEWA_ENV === "production" ? "https://esewa.com.np" : "https://rc.esewa.com.np";
    const query = new URLSearchParams({ product_code: checkout.productCode,
      transaction_uuid: transactionUuid, total_amount: String(checkout.totalAmount) });
    let payment;
    try {
      const response = await fetch(`${base}/api/epay/transaction/status/?${query}`, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error("Status unavailable");
      payment = await response.json();
    } catch {
      return res.status(503).json({ message: "Payment verification is unavailable. Refresh this page to retry; do not pay again." });
    }
    if (payment.status !== "COMPLETE" || payment.product_code !== checkout.productCode ||
        payment.transaction_uuid !== transactionUuid || Number(payment.total_amount) !== checkout.totalAmount ||
        typeof payment.ref_id !== "string" || !payment.ref_id) {
      return res.status(409).json({ message: "Payment has not been confirmed. Your cart is unchanged." });
    }
    // Only the first successful callback can finalize the pending record.
    order = await Order.findOneAndUpdate({ _id: checkout._id, paymentStatus: "pending" }, { $set: {
        paymentReference: payment.ref_id,
        paymentMethod: "esewa", paymentStatus: "paid", paidAt: new Date(),
      } }, { new: true, runValidators: true });
    if (!order) {
      order = await Order.findById(checkout._id);
      if (!order || order.paymentStatus !== "paid") throw new Error("Unable to finalize order. Refresh to retry.");
    }
  }
  await clearPurchasedCart(checkout.user, order.id, checkout.items);
  res.json({ valid: true, confirmed: true, status: "COMPLETE", orderId: order.id,
    refId: order.paymentReference, transactionUuid, totalAmount: order.totalAmount });
}
