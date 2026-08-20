"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, ShieldCheck, Wallet } from "lucide-react";

export default function EsewaPayment() {
  const searchParams = useSearchParams();
  const total = searchParams.get("total") as string;

  const [amount, setAmount] = useState(total);
  const [productName, setProductName] = useState("Test Product");
  const [transactionId, setTransactionId] = useState("txn-123");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    try {
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "esewa",
          amount,
          productName,
          transactionId,
        }),
      });
      const data = await res.json();

      if (data.esewaConfig) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `${process.env.NEXT_PUBLIC_ESEWA_PAYMENT_URL ?? "https://rc-epay.esewa.com.np/api/epay/main/v2/form"}`;
        Object.entries(data.esewaConfig).forEach(([k, v]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = String(v);
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        setError("Something went wrong initiating payment. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center shadow-lg shadow-black/20 mb-3">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-black">
            Complete your payment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Securely powered by eSewa
          </p>
        </div>

        <form
          onSubmit={handlePayment}
          className="bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-200 overflow-hidden"
        >
          {/* Amount highlight */}
          <div className="bg-black px-6 py-6 text-center">
            <p className="text-gray-400 text-sm font-medium">Total Amount</p>
            <p className="text-white text-4xl font-extrabold mt-1">
              Rs. {amount || "0.00"}
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Amount
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                className="mt-1 border border-gray-200 bg-gray-50 rounded-lg p-3 w-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Product / Order
              </label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-1 border border-gray-200 bg-gray-50 rounded-lg p-3 w-full text-sm text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="Product name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Transaction ID
              </label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="mt-1 border border-gray-200 bg-gray-50 rounded-lg p-3 w-full text-sm font-mono text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="txn-123"
              />
            </div>

            {error && (
              <p className="text-sm text-black bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full cursor-pointer bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md shadow-black/10"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to eSewa...
                </>
              ) : (
                "Pay with eSewa"
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Your payment is encrypted and secure
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
