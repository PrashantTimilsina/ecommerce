# eSewa orders

New payments use only the Order model. Initiation saves a pending order with customer, item snapshots, whole-rupee total and transaction UUID. Verification updates that same record to paid and adds the eSewa reference and paid timestamp. Only paid records represent successful purchases.

Failed, cancelled, pending or unverifiable payments leave the cart unchanged. Unsuccessful attempts remain pending so verification can safely be retried. After a paid order is saved, purchased quantities are removed using an atomic replay marker; extra quantities and other variants remain.

Restart the backend after upgrading. Startup adjusts the payment-reference index to allow pending records and imports legacy checkout snapshots without overwriting existing orders. The old checkouts collection remains untouched as a backup. Its model is removed and new payments do not write to it.

Backend ESEWA_MERCHANT_CODE and ESEWA_ENV must match the frontend eSewa configuration. Keep the signing secret in the frontend server environment. NEXT_PUBLIC_APIURL points to the Express /api URL. Both order endpoints require the signed-in user token.

Payment finalization runs on the return page. No background reconciliation worker, inventory reservation or shipping flow is included.
