"use client";

import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { useHostShortletBookings } from "@/app/api/features/shortlet";
import { CalendarDays, Loader2, MapPin, RotateCcw } from "lucide-react";
import Image from "next/image";

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const formatAmount = (value?: string | number) => {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `₦${amount.toLocaleString()}`
    : String(value);
};

export default function ShortletCancellationsPage() {
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useHostShortletBookings("cancelled");

  return (
    <DashboardLayout>
      <section className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-[#162B4C] md:text-3xl">
            Cancelled shortlet bookings
          </h1>
          <p className="mt-1 text-gray-600">
            Review guest cancellations for your shortlet properties.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-16" role="status">
            <Loader2 className="animate-spin text-[#43A047]" size={32} />
            <span className="sr-only">Loading cancelled bookings</span>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            <p>
              {error instanceof Error
                ? error.message
                : "Unable to load cancelled shortlet bookings."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="mt-3 inline-flex items-center gap-2 font-semibold underline disabled:opacity-50"
            >
              <RotateCcw size={14} />
              {isFetching ? "Retrying…" : "Try again"}
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#162B4C]">
              No cancelled bookings
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Guest cancellations for your shortlet listings will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => {
              const shortlet = booking.shortlet;
              const address = [
                shortlet?.area,
                shortlet?.city,
                shortlet?.address,
              ]
                .filter(Boolean)
                .join(", ");
              const image = shortlet?.images?.[0];

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="relative h-48 bg-gray-100">
                    {image ? (
                      <Image
                        src={image}
                        alt={shortlet?.title || "Shortlet"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image available
                      </span>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold capitalize text-red-700">
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <h2 className="font-semibold text-[#162B4C]">
                        {shortlet?.title || "Shortlet booking"}
                      </h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={15} aria-hidden="true" />
                        {address || "Location unavailable"}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} aria-hidden="true" />
                        {formatDate(booking.checkIn)} –{" "}
                        {formatDate(booking.checkOut)}
                      </p>
                      <p>
                        Guest:{" "}
                        {booking.guest?.fullName || "Guest details unavailable"}
                      </p>
                      {booking.guest?.phone && (
                        <p>Phone: {booking.guest.phone}</p>
                      )}
                      <p>
                        Cancelled by:{" "}
                        <span className="capitalize">
                          {booking.cancelledBy || "Not specified"}
                        </span>
                      </p>
                      {booking.cancelledAt && (
                        <p>Cancelled on: {formatDate(booking.cancelledAt)}</p>
                      )}
                      {booking.cancellationReason && (
                        <p>
                          Reason:{" "}
                          <span className="text-gray-800">
                            {booking.cancellationReason}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-3 text-sm">
                      <p>
                        Booking total:{" "}
                        <span className="font-semibold text-gray-900">
                          {formatAmount(booking.total)}
                        </span>
                      </p>
                      {booking.refundedAmount !== undefined && (
                        <p className="mt-1">
                          Guest refund:{" "}
                          <span className="font-semibold text-gray-900">
                            {formatAmount(booking.refundedAmount)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
