"use client";

import type { ShortletQuote } from "@/app/api/features/shortlet";
import { useState } from "react";

interface ShortletReserveProps {
  pricePerNight: number;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  canBook: boolean;
  quote?: ShortletQuote;
  quoteLoading?: boolean;
  quoteError?: string;
  requireQuote?: boolean;
  bookingError?: string;
  insufficientBalance?: boolean;
  onReserve?: () => void;
}

export default function ShortletReserve({
  pricePerNight,
  checkIn,
  checkOut,
  guests,
  canBook,
  quote,
  quoteLoading = false,
  quoteError,
  requireQuote = false,
  bookingError,
  insufficientBalance = false,
  onReserve,
}: ShortletReserveProps) {
  const [showCancellationDetails, setShowCancellationDetails] = useState(false);
  const nights = quote?.nights ?? 0;
  const formatDate = (date: Date | null) =>
    date
      ? date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Select dates";

  return (
    <aside className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
      <div className="mb-5">
        <span className="text-2xl font-bold text-gray-900">
          ₦{pricePerNight.toLocaleString()}
        </span>
        <span className="text-gray-500"> / night</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-300">
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          <div className="min-w-0 p-3">
            <p className="text-xs font-semibold text-gray-700">CHECK-IN</p>
            <p className="mt-1 truncate text-sm text-gray-600">
              {formatDate(checkIn)}
            </p>
          </div>
          <div className="min-w-0 p-3">
            <p className="text-xs font-semibold text-gray-700">CHECK-OUT</p>
            <p className="mt-1 truncate text-sm text-gray-600">
              {formatDate(checkOut)}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-300 p-3">
          <p className="text-xs font-semibold text-gray-700">GUESTS</p>
          <p className="mt-1 text-sm text-gray-600">
            {guests} {guests === 1 ? "guest" : "guests"}
          </p>
        </div>
      </div>

      {nights > 0 && quote && (
        <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between gap-3 text-gray-600">
            <span>
              ₦{Number(quote.pricePerNight).toLocaleString()} × {quote.nights}{" "}
              {quote.nights === 1 ? "night" : "nights"}
            </span>
            <span>₦{Number(quote.subtotal).toLocaleString()}</span>
          </div>
          {Number(quote.cleaningFee) > 0 && (
            <div className="flex justify-between gap-3 text-gray-600">
              <span>Cleaning fee</span>
              <span>₦{Number(quote.cleaningFee).toLocaleString()}</span>
            </div>
          )}
          {Number(quote.securityDeposit) > 0 && (
            <div className="flex justify-between gap-3 text-gray-600">
              <span>Security deposit</span>
              <span>₦{Number(quote.securityDeposit).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between gap-3 border-t border-gray-200 pt-3 font-bold text-gray-900">
            <span>Total due now</span>
            <span>₦{Number(quote.total).toLocaleString()}</span>
          </div>
        </div>
      )}

      {quoteLoading && (
        <p className="mt-4 text-sm text-gray-500" role="status">
          Checking price and cancellation terms…
        </p>
      )}
      {quoteError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {quoteError}
        </p>
      )}
      {quote?.cancellationPolicy.summary && (
        <section className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <h3 className="font-semibold text-gray-900">
            {quote.cancellationPolicy.label}
          </h3>
          {showCancellationDetails &&
            quote.cancellationPolicy.freeCancellationUntil && (
              <p className="mt-1 font-medium">
                Free cancellation until{" "}
                {new Date(
                  quote.cancellationPolicy.freeCancellationUntil,
                ).toLocaleString("en-NG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Africa/Lagos",
                })}
              </p>
            )}
          <p className="mt-2 leading-6">{quote.cancellationPolicy.summary}</p>
          {showCancellationDetails &&
            quote.cancellationPolicy.windows.length > 0 && (
              <ul className="mt-3 space-y-1">
                {quote.cancellationPolicy.windows.map((window, index) => {
                  const refundDescription =
                    window.nightsRefundPercent === 100
                      ? "Full refund of nights"
                      : window.nightsRefundPercent === 0
                        ? "No refund of nights"
                        : `${window.nightsRefundPercent}% refund of nights`;
                  const cutoff = window.until
                    ? new Date(window.until).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Africa/Lagos",
                      })
                    : null;

                  return (
                    <li key={`${window.from ?? "start"}-${index}`}>
                      {refundDescription}
                      {cutoff ? ` until ${cutoff}` : ""}
                    </li>
                  );
                })}
              </ul>
            )}
          {showCancellationDetails && (
            <p className="mt-2 text-xs text-gray-500">
              Early check-out: {quote.cancellationPolicy.earlyCheckout.summary}
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowCancellationDetails((visible) => !visible)}
            aria-expanded={showCancellationDetails}
            className="mt-3 font-semibold text-[#43A047] underline underline-offset-2 hover:text-[#388E3C]"
          >
            Show {showCancellationDetails ? "less" : "more"}
          </button>
        </section>
      )}
      {bookingError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {bookingError}
        </p>
      )}
      {insufficientBalance && (
        <a
          href="/tenant/wallet/top-up"
          className="mt-3 inline-block text-sm font-semibold text-[#43A047] underline"
        >
          Top up your wallet
        </a>
      )}

      {canBook && (
        <button
          type="button"
          onClick={onReserve}
          disabled={
            !checkIn ||
            !checkOut ||
            checkOut <= checkIn ||
            quoteLoading ||
            Boolean(quoteError) ||
            (requireQuote && !quote)
          }
          className="mt-5 min-h-12 w-full rounded-full bg-[#43A047] py-3 font-semibold text-white transition hover:bg-[#388E3C] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Book now
        </button>
      )}
      <p className="mt-3 text-center text-xs text-gray-500">
        {!canBook
          ? "This property is not currently available to book."
          : requireQuote && !quote
            ? "Select available dates to see your full price and cancellation policy."
            : requireQuote
              ? "Enter your transaction PIN to confirm your booking."
              : "Sign in to confirm your booking."}
      </p>
    </aside>
  );
}
