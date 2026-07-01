"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { CheckCircle, Home, List, Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  useVerifyLockPayment,
  useVerifyRentPayment,
} from "@/app/api/features/progress/progress.queries";
import { hasAccessToken } from "@/app/lib/auth";
import {
  clearPendingLockPayment,
  getPendingLockPaymentReference,
} from "@/app/lib/lock-payment";
import {
  clearPendingRentPayment,
  getPendingRentPaymentReference,
} from "@/app/lib/rent-payment";

type PaymentType = "rent" | "lock";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifiedReference, setVerifiedReference] = useState<string | null>(
    null,
  );

  const getPaymentReference = () =>
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("transaction_reference") ||
    getPendingRentPaymentReference() ||
    getPendingLockPaymentReference();

  const getPaymentType = (reference: string | null): PaymentType => {
    const type = searchParams.get("type") || searchParams.get("payment_type");

    if (type === "lock" || type === "rent") {
      return type;
    }

    if (reference && reference === getPendingLockPaymentReference()) {
      return "lock";
    }

    return "rent";
  };

  const { mutate: verifyRentPayment, isPending: isVerifyingPayment } =
    useVerifyRentPayment();
  const { mutate: verifyLockPayment, isPending: isVerifyingLockPayment } =
    useVerifyLockPayment();

  const reference = useMemo(
    () =>
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      searchParams.get("transaction_reference") ||
      getPendingRentPaymentReference() ||
      getPendingLockPaymentReference() ||
      null,
    [searchParams],
  );
  const paymentType = getPaymentType(reference);
  const isLockPayment = paymentType === "lock";
  const isVerifying = isVerifyingPayment || isVerifyingLockPayment;

  useEffect(() => {
    const reference = getPaymentReference();
    const paymentType = getPaymentType(reference);
    const verificationKey = reference ? `${paymentType}:${reference}` : null;

    if (
      !reference ||
      verificationKey === verifiedReference ||
      !hasAccessToken()
    ) {
      return;
    }

    setVerifiedReference(verificationKey);

    const handleVerificationSuccess = (data: { message?: string }) => {
      if (paymentType === "lock") {
        clearPendingLockPayment();
      } else {
        clearPendingRentPayment();
      }

      toast.success(data.message || "Payment verified successfully.");
    };
    const handleVerificationError = (error: Error) => {
      toast.error(error.message || "Payment verification failed.");
      router.push(
        `/tenant/payment-failed?error=${encodeURIComponent(
          error.message || "Verification failed",
        )}`,
      );
    };

    if (paymentType === "lock") {
      verifyLockPayment(reference, {
        onSuccess: handleVerificationSuccess,
        onError: handleVerificationError,
      });
    } else {
      verifyRentPayment(reference, {
        onSuccess: handleVerificationSuccess,
        onError: handleVerificationError,
      });
    }
  }, [
    router,
    searchParams,
    verifiedReference,
    verifyLockPayment,
    verifyRentPayment,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80 ring-1 ring-slate-200">
        {isVerifying && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <Loader2 size={18} className="animate-spin" />
            Verifying your payment...
          </div>
        )}
        <div className="flex items-center gap-4 rounded-3xl bg-emerald-50 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white">
            <CheckCircle size={36} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">
              Payment completed
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {isLockPayment
                ? "House lock payment successful"
                : "Rent payment successful"}
            </h1>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-base leading-7 text-slate-700">
            Your payment was processed successfully. You can now continue to
            your tenant dashboard or view your bookings.
          </p>
          {reference ? (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Transaction reference
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {reference}
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              router.push(
                isLockPayment ? "/tenant/locked-house" : "/tenant/my-bookings",
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {isLockPayment ? <Lock size={18} /> : <List size={18} />}
            {isLockPayment ? "View locked house" : "View my bookings"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/tenant/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <Home size={18} />
            Go to dashboard
          </button>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-sm font-semibold">Need help?</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            If you have any question about your payment or booking, contact
            support through the tenant dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
