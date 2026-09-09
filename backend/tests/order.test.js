import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";
import Order from "../models/order.js";
import { confirmOrder, createCheckout } from "../controllers/order.controller.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import { productPrice } from "../utils/productPrice.js";

afterEach(() => mock.restoreAll());
const checkout = { _id: "507f1f77bcf86cd799439011", user: "507f1f77bcf86cd799439012",
  transactionUuid: "test-uuid", totalAmount: 95, productCode: "EPAYTEST", items: [] };
function setup(payment) {
  mock.method(Order, "findOne", async () => ({ ...checkout, paymentStatus: "pending" }));
  mock.method(User, "findById", () => ({ lean: async () => ({ cartItems: [], clearedCartOrders: [checkout._id] }) }));
  const save = mock.method(Order, "findOneAndUpdate", async (_filter, update) => ({ ...checkout, id: checkout._id, ...update.$set }));
  mock.method(globalThis, "fetch", async () => ({ ok: true, json: async () => payment }));
  const res = { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  return { save, res, req: { user: { id: checkout.user }, body: { transactionUuid: checkout.transactionUuid } } };
}
const paid = { status: "COMPLETE", product_code: "EPAYTEST", transaction_uuid: "test-uuid", total_amount: 95, ref_id: "ref-1" };

test("discounted prices retain paisa", () => {
  assert.equal(productPrice({ price: 199.99, discount: 15 }), 169.99);
});

test("checkout rounds the final amount to whole rupees", async () => {
  const previous = process.env.ESEWA_MERCHANT_CODE;
  process.env.ESEWA_MERCHANT_CODE = "EPAYTEST";
  try {
    mock.method(User, "findById", async () => ({ id: checkout.user, cartItems: [
      { product: "Shirt", quantity: 3, price: 169, size: "M", color: "black" },
    ] }));
    mock.method(Product, "findOne", async () => ({ id: checkout._id, title: "Shirt", price: 199.99, discount: 15, stock: 10, images: [] }));
    const save = mock.method(Order, "create", async (data) => data);
    const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
    await createCheckout({ user: { id: checkout.user }, body: { amount: 423 } }, res);
    assert.equal(res.code, 201);
    assert.equal(res.body.totalAmount, 423);
    assert.equal(save.mock.calls[0].arguments[0].items[0].price, 169.99);
    await createCheckout({ user: { id: checkout.user }, body: { amount: 1 } }, res);
    assert.equal(res.code, 409);
    assert.equal(save.mock.callCount(), 1);
  } finally {
    if (previous === undefined) delete process.env.ESEWA_MERCHANT_CODE;
    else process.env.ESEWA_MERCHANT_CODE = previous;
  }
});

test("confirmed payment saves the frozen checkout and returns its order ID", async () => {
  const { req, res, save } = setup(paid);
  await confirmOrder(req, res);
  assert.equal(res.body.orderId, checkout._id);
  assert.equal(res.body.confirmed, true);
  assert.equal(save.mock.calls[0].arguments[0]._id, checkout._id);
  assert.equal(save.mock.calls[0].arguments[1].$set.paymentStatus, "paid");
  assert.equal(save.mock.calls[0].arguments[0].paymentStatus, "pending");
});
for (const payment of [{ ...paid, status: "PENDING" }, { ...paid, status: "CANCELED" }, { ...paid, total_amount: 1 }, { ...paid, product_code: "OTHER" }, { ...paid, transaction_uuid: "other" }, { ...paid, ref_id: null }]) {
  test(`does not save unconfirmed or mismatched payment: ${JSON.stringify(payment)}`, async () => {
    const { req, res, save } = setup(payment);
    await confirmOrder(req, res);
    assert.equal(res.code, 409);
    assert.equal(save.mock.callCount(), 0);
  });
}
test("provider outage does not create an order", async () => {
  const { req, res, save } = setup(paid);
  mock.method(globalThis, "fetch", async () => { throw new Error("offline"); });
  await confirmOrder(req, res);
  assert.equal(res.code, 503);
  assert.equal(save.mock.callCount(), 0);
});
test("replayed callback returns the existing order without charging or writing", async () => {
  const { req, res, save } = setup(paid);
  mock.method(Order, "findOne", async () => ({ ...checkout, id: checkout._id, paymentStatus: "paid", paymentReference: "ref-1" }));
  await confirmOrder(req, res);
  assert.equal(res.body.orderId, checkout._id);
  assert.equal(save.mock.callCount(), 0);
  assert.equal(globalThis.fetch.mock.callCount(), 0);
});
test("another user's checkout cannot be confirmed", async () => {
  const { req, res, save } = setup(paid);
  mock.method(Order, "findOne", async (filter) => {
    assert.equal(filter.user, req.user.id);
    return null;
  });
  await confirmOrder(req, res);
  assert.equal(res.code, 404);
  assert.equal(save.mock.callCount(), 0);
});
