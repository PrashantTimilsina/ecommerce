import mongoose from "mongoose";
import Order from "../models/order.js";

export async function migrateOrders() {
  const collection = mongoose.connection.collection("orders");
  let indexes = [];
  try { indexes = await collection.indexes(); }
  catch (error) { if (error.code !== 26) throw error; }
  // The old unique index allowed only one record without a reference.
  const oldIndex = indexes.find((index) => index.key.paymentReference === 1 && !index.partialFilterExpression);
  if (oldIndex) await collection.dropIndex(oldIndex.name);
  await Order.createIndexes();
  // Preserve old in-flight payments without overwriting paid orders.
  // Leave the legacy collection untouched as a backup.
  for await (const checkout of mongoose.connection.collection("checkouts").find({})) {
    const { _id, __v, ...snapshot } = checkout;
    await collection.updateOne({ transactionUuid: checkout.transactionUuid }, {
      $setOnInsert: { _id, ...snapshot, paymentMethod: "esewa", paymentStatus: "pending" },
    }, { upsert: true });
  }
}
