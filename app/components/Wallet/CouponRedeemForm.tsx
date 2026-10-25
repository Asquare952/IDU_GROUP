"use client";

import { useState, type FormEvent } from "react";
import { Gift, Loader2 } from "lucide-react";
import { useRedeemWalletCoupon } from "@/app/api/features/wallet/wallet.queries";

const CODE_PATTERN = /^[A-Z0-9_-]{3,32}$/;

const getErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Unable to redeem this coupon. Please try again.";
};

export default function CouponRedeemForm() {
  const [code, setCode] = useState("");
  const redeemCoupon = useRedeemWalletCoupon();
  const normalizedCode = code.trim().toUpperCase();
  const isValidCode = CODE_PATTERN.test(normalizedCode);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidCode || redeemCoupon.isPending) return;

    redeemCoupon.mutate(
      { code: normalizedCode },
      { onSuccess: () => setCode("") },
    );
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#43A047]">
          <Gift className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">Redeem a coupon</h2>
          <p className="text-sm text-slate-500">
            Apply a code to credit your wallet.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="wallet-coupon-code">
          Coupon code
        </label>
        <input
          id="wallet-coupon-code"
          value={code}
          onChange={(event) => {
            setCode(event.target.value.toUpperCase());
            if (redeemCoupon.isError || redeemCoupon.isSuccess) {
              redeemCoupon.reset();
            }
          }}
          maxLength={32}
          autoComplete="off"
          placeholder="Enter coupon code"
          aria-invalid={Boolean(code) && !isValidCode}
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-[#43A047] focus:ring-2 focus:ring-[#43A047]/20"
        />
        <button
          type="submit"
          disabled={!isValidCode || redeemCoupon.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#43A047] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#388e3c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {redeemCoupon.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying
            </>
          ) : (
            "Apply code"
          )}
        </button>
      </form>

      {code && !isValidCode && (
        <p className="mt-2 text-sm text-amber-700" role="status">
          Use 3-32 letters, numbers, hyphens, or underscores.
        </p>
      )}
      {redeemCoupon.isError && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {getErrorMessage(redeemCoupon.error)}
        </p>
      )}
      {redeemCoupon.isSuccess && (
        <p className="mt-3 text-sm font-medium text-green-700" role="status">
          {redeemCoupon.data.message}
        </p>
      )}
    </section>
  );
}
