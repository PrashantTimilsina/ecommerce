import mongoose from "mongoose";

export const purchaseFields = {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [{
    _id: false,
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, validate: Number.isInteger },
    price: { type: Number, required: true, min: 0 },
    size: String,
    color: String,
    image: String,
  }], required: true, validate: (items) => items.length > 0 },
  totalAmount: { type: Number, required: true, min: 0.01 },
  transactionUuid: { type: String, required: true, unique: true },
  productCode: { type: String, required: true },
};

const orderSchema = new mongoose.Schema({
  ...purchaseFields,
  paymentMethod: { type: String, enum: ["esewa"], default: "esewa" },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  paymentReference: { type: String, required: function () { return this.paymentStatus === "paid"; } },
  paidAt: { type: Date, required: function () { return this.paymentStatus === "paid"; } },
}, { timestamps: true, autoIndex: false });

orderSchema.index({ paymentReference: 1 }, { unique: true, partialFilterExpression: { paymentReference: { $type: "string" } } });

export default mongoose.model("Order", orderSchema);
