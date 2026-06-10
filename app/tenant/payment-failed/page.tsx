"use client";

import { Suspense, useMemo } from "react";
import { XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentFailedContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorMessage = useMemo(
    () => searchParams.get("message") || searchParams.get("error") || "Your payment was not completed.",
    [searchParams],
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80 ring-1 ring-slate-200">
        <div className="flex items-center gap-4 rounded-3xl bg-rose-50 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-600 text-white">
            <XCircle size={36} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-rose-700">
              Payment failed
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Rent payment unsuccessful
            </h1>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-base leading-7 text-slate-700">
            {errorMessage}
          </p>
          <p className="text-sm text-slate-500">
            Your rent booking was not completed. You can try again or return to the property listing.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Go back
          </button>

          <button
            type="button"
            onClick={() => router.push("/tenant/my-bookings")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <RotateCcw size={18} />
            Retry payment
          </button>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-sm font-semibold">Need support?</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            If you need help, open the tenant dashboard and contact support so we can review your payment.
          </p>
        </div>
      </div>
    </div>
  );
};


export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
