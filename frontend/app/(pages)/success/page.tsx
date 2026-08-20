"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get("method");
  const data = searchParams.get("data");

  const [state, setState] = useState<{
    loading: boolean;
    status?: string;
    refId?: string;
    error?: string;
  }>({ loading: true });

  useEffect(() => {
    async function verify() {
      if (method !== "esewa" || !data) {
        setState({ loading: false, error: "Invalid payment callback" });
        return;
      }

      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method, data }),
        });
        const result = await res.json();

        if (!res.ok || !result.valid) {
          setState({
            loading: false,
            error: result.error ?? "Verification failed",
          });
          return;
        }

        setState({
          loading: false,
          status: result.status,
          refId: result.refId,
        });
      } catch {
        setState({ loading: false, error: "Network error verifying payment." });
      }
    }

    verify();
  }, [method, data]);

  const success = state.status === "COMPLETE";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-200 overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          {state.loading ? (
            <>
              <Loader2 className="h-12 w-12 text-black animate-spin" />
              <h1 className="text-xl font-bold text-black mt-4">
                Verifying payment...
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Please wait while we confirm your transaction.
              </p>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <h1 className="text-xl font-bold text-black mt-4">
                Payment Successful
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Your payment has been confirmed by eSewa.
              </p>
              {state.refId && (
                <p className="text-xs text-gray-400 mt-3 font-mono">
                  Reference ID: {state.refId}
                </p>
              )}
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <h1 className="text-xl font-bold text-black mt-4">
                Payment {state.status ? "Pending" : "Unverified"}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {state.error ??
                  "Your payment could not be confirmed. Please try again or contact support."}
              </p>
            </>
          )}

          <Link
            href="/"
            className="mt-6 w-full cursor-pointer bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
