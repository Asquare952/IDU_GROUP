"use client";

import { isAxiosError } from "axios";
import Link from "next/link";
import { CalendarDays, Home, MapPin, UserRound } from "lucide-react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { useGetRentedProperties } from "@/app/api/features/rental";
import { useHostShortletBookings } from "@/app/api/features/shortlet";

const formatMoney = (value: string | number) =>
  `₦${Number(value).toLocaleString("en-NG")}`;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

export default function RentedPropertiesPage() {
  const { data, isLoading, isError, error } = useGetRentedProperties();
  const {
    data: shortletBookings = [],
    isLoading: isLoadingShortlets,
    isError: isShortletError,
    error: shortletError,
  } = useHostShortletBookings("confirmed");
  const properties = data?.data ?? [];
  const errorMessage = isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || error.message
    : error?.message;
  const shortletErrorMessage = isAxiosError<{ message?: string }>(shortletError)
    ? shortletError.response?.data?.message || shortletError.message
    : shortletError?.message;
  const isLoadingPage = isLoading || isLoadingShortlets;
  const hasAnyBookings = properties.length > 0 || shortletBookings.length > 0;

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#FBFBFC] p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#162B4C] md:text-3xl">
            Rented properties
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View your rented listings and confirmed shortlet reservations.
          </p>
        </header>

        {isLoadingPage && (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            Loading your rented properties…
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            {errorMessage || "Unable to load your rented properties."}
          </div>
        )}

        {isShortletError && (
          <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
            {shortletErrorMessage ||
              "Unable to load your confirmed shortlet bookings."}
          </div>
        )}

        {!isLoadingPage && !isError && !isShortletError && !hasAnyBookings && (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <Home className="mx-auto text-gray-300" size={40} />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No rented properties yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Properties will appear here after a tenant rents one of your
              listings.
            </p>
            <Link
              href="/landlord/my-listings"
              className="mt-5 inline-flex rounded-xl bg-[#43A047] px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              View my listings
            </Link>
          </div>
        )}

        {!isLoadingPage && !isError && properties.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-[#162B4C]">
              Long-term tenancies
            </h2>
            <div className="grid gap-5 xl:grid-cols-2">
              {properties.map(({ property, tenant, tenancy }) => (
                <article
                  key={property.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="grid sm:grid-cols-[200px_1fr]">
                    {property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-52 w-full object-cover sm:h-full"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400 sm:h-full">
                        <Home size={36} />
                      </div>
                    )}
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            {property.title}
                          </h2>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                            <MapPin size={15} className="shrink-0" />
                            {property.location}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                          {tenancy.status}
                        </span>
                      </div>

                      <p className="font-bold text-[#43A047]">
                        {formatMoney(property.price)}{" "}
                        <span className="text-sm font-medium text-gray-500">
                          / {property.priceType}
                        </span>
                      </p>

                      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                        {tenant?.image ? (
                          <img
                            src={tenant.image}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                            <UserRound size={20} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {tenant?.fullName || "Tenant details unavailable"}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                            <CalendarDays size={13} />
                            Started {formatDate(tenancy.startDate)}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/landlord/rented-properties/${encodeURIComponent(property.id)}`}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-[#43A047] px-4 py-2.5 text-sm font-semibold text-[#43A047] transition hover:bg-green-50"
                      >
                        View tenancy details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!isLoadingPage && !isShortletError && shortletBookings.length > 0 && (
          <section className={properties.length > 0 ? "mt-10" : ""}>
            <h2 className="mb-4 text-xl font-bold text-[#162B4C]">
              Confirmed shortlet bookings
            </h2>
            <div className="grid gap-5 xl:grid-cols-2">
              {shortletBookings.map((booking) => {
                const shortlet = booking.shortlet;
                const address = [
                  shortlet?.area,
                  shortlet?.city,
                  shortlet?.address,
                ]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <article
                    key={booking.id}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="grid sm:grid-cols-[200px_1fr]">
                      {shortlet?.images?.[0] ? (
                        <img
                          src={shortlet.images[0]}
                          alt={shortlet.title || "Shortlet"}
                          className="h-52 w-full object-cover sm:h-full"
                        />
                      ) : (
                        <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400 sm:h-full">
                          <Home size={36} />
                        </div>
                      )}
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {shortlet?.title || "Shortlet booking"}
                            </h3>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                              <MapPin size={15} className="shrink-0" />
                              {address || "Location unavailable"}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                            {booking.status}
                          </span>
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <CalendarDays size={15} />
                            {formatDate(booking.checkIn)} –{" "}
                            {formatDate(booking.checkOut)}
                          </p>
                          <p className="flex items-center gap-2">
                            <UserRound size={15} />
                            {booking.guest?.fullName ||
                              "Guest details unavailable"}
                            {booking.guest?.phone
                              ? ` · ${booking.guest.phone}`
                              : ""}
                          </p>
                          <p>
                            {booking.guests}{" "}
                            {booking.guests === 1 ? "guest" : "guests"}
                          </p>
                          {booking.total !== undefined && (
                            <p className="font-semibold text-gray-900">
                              Booking total: {formatMoney(booking.total)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </DashboardLayout>
  );
}
