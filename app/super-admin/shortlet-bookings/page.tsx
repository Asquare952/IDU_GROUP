"use client";

import { useMemo, useState, type ReactNode } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import {
  useAdminShortletBookings,
  type AdminShortletBooking,
  type AdminShortletBookingFilters,
  type AdminShortletBookingStatus,
  type AdminShortletDepositStatus,
} from "@/app/api/features/admin";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import BookingDetails from "./BookingDetails";

const PAGE_SIZE = 50;

const bookingStatuses: {
  label: string;
  value: "all" | AdminShortletBookingStatus;
}[] = [
  { label: "All bookings", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const depositStatuses: {
  label: string;
  value: "all" | AdminShortletDepositStatus;
}[] = [
  { label: "All deposits", value: "all" },
  { label: "None", value: "none" },
  { label: "Held", value: "held" },
  { label: "Claimed", value: "claimed" },
  { label: "Refunded", value: "refunded" },
  { label: "Settled", value: "settled" },
];

const formatMoney = (value: string | number | null | undefined) => {
  if (value == null || (typeof value === "string" && !value.trim())) return "—";
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount)
    ? `₦${amount.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : String(value);
};

const serializeSummary = (value: unknown) => {
  if (value == null) return "—";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return "Details available";
  }
};

const Page = () => {
  const {
    isLoading: isAuthLoading,
    isAuthenticated,
    isSuperAdmin,
  } = useProtectedRoute();
  const [bookingStatus, setBookingStatus] = useState<
    "all" | AdminShortletBookingStatus
  >("all");
  const [depositStatus, setDepositStatus] = useState<
    "all" | AdminShortletDepositStatus
  >("all");
  const [offset, setOffset] = useState(0);

  const filters = useMemo<AdminShortletBookingFilters>(
    () => ({
      ...(bookingStatus === "all" ? {} : { status: bookingStatus }),
      ...(depositStatus === "all" ? {} : { deposit_status: depositStatus }),
      limit: PAGE_SIZE,
      offset,
    }),
    [bookingStatus, depositStatus, offset],
  );
  const { data, isLoading, isError, error } = useAdminShortletBookings(filters);
  const bookings = Array.isArray(data?.data) ? data.data : [];
  const total = data && Number.isFinite(data.total) ? data.total : undefined;
  const count =
    data && Number.isFinite(data.count) ? data.count : bookings.length;
  const platformFeeCents = bookings.reduce((sum, booking) => {
    const fee =
      booking.platform_fee == null ||
      (typeof booking.platform_fee === "string" && !booking.platform_fee.trim())
        ? Number.NaN
        : Number(booking.platform_fee);
    if (!Number.isFinite(fee) || fee < 0) return sum;
    const cents = Math.round((fee + Number.EPSILON) * 100);
    return Number.isSafeInteger(sum + cents) ? sum + cents : sum;
  }, 0);

  if (isAuthLoading || !isAuthenticated || !isSuperAdmin) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-sm text-gray-500" role="status">
          Checking Super Admin access...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 md:space-y-6 md:p-6">
        <header>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            Shortlet Bookings
          </h1>
          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Review shortlet booking status, deposits, parties and platform fees.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-3 md:gap-4">
          <StatCard
            label="Bookings on this page"
            value={isLoading ? "—" : count.toLocaleString()}
            icon={<CalendarDays size={18} />}
          />
          <StatCard
            label="Matching bookings"
            value={
              isLoading || total === undefined ? "—" : total.toLocaleString()
            }
            icon={<CalendarDays size={18} />}
          />
          <StatCard
            label="Platform fee on this page"
            value={
              isLoading
                ? "—"
                : `₦${(platformFeeCents / 100).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
            }
            icon={<CalendarDays size={18} />}
          />
        </div>

        <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:rounded-2xl md:p-4">
          <FilterGroup
            label="Booking status"
            value={bookingStatus}
            options={bookingStatuses}
            onChange={(value) => {
              setBookingStatus(value as "all" | AdminShortletBookingStatus);
              setOffset(0);
            }}
          />
          <FilterGroup
            label="Deposit status"
            value={depositStatus}
            options={depositStatuses}
            onChange={(value) => {
              setDepositStatus(value as "all" | AdminShortletDepositStatus);
              setOffset(0);
            }}
          />

          {isLoading ? (
            <div
              className="p-10 text-center text-sm text-gray-500"
              role="status"
            >
              Loading Shortlet bookings...
            </div>
          ) : isError ? (
            <div
              className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-700"
              role="alert"
            >
              {error.message ||
                "Unable to load Shortlet bookings. Please try again."}
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              No Shortlet bookings match these filters.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {[
                        "Booking",
                        "Shortlet",
                        "Guest",
                        "Host",
                        "Status",
                        "Deposit",
                        "Platform fee",
                        "Details",
                      ].map((heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-gray-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking, index) => (
                      <BookingRow
                        key={
                          booking.id ||
                          booking.booking_id ||
                          `${offset}-${index}`
                        }
                        booking={booking}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500 md:text-sm">
                  Showing {offset + 1}–{offset + count} of{" "}
                  {total?.toLocaleString() ?? "—"} matching bookings
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setOffset((current) => Math.max(0, current - PAGE_SIZE))
                    }
                    disabled={offset === 0 || isLoading}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setOffset((current) => current + PAGE_SIZE)}
                    disabled={
                      isLoading ||
                      count < PAGE_SIZE ||
                      (total !== undefined && offset + count >= total)
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

function BookingRow({ booking }: { booking: AdminShortletBooking }) {
  const [expanded, setExpanded] = useState(false);
  const bookingId = booking.id || booking.booking_id;
  const bookingStatus = booking.status || "—";
  const depositStatus = booking.deposit_status || "—";

  return (
    <>
      <tr className="align-top hover:bg-gray-50/60">
        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
          {bookingId || "ID unavailable"}
        </td>
        <EntityCell value={booking.shortlet} />
        <EntityCell value={booking.guest} />
        <EntityCell value={booking.host} />
        <td className="whitespace-nowrap px-4 py-4 text-sm capitalize text-gray-700">
          {bookingStatus}
        </td>
        <td className="whitespace-nowrap px-4 py-4 text-sm capitalize text-gray-700">
          {depositStatus}
        </td>
        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
          {formatMoney(booking.platform_fee)}
        </td>
        <td className="px-4 py-4">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            disabled={!bookingId}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium text-[#2E7D32] hover:bg-green-50 disabled:opacity-50"
          >
            {expanded ? "Hide" : "View"}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
      </tr>
      {expanded && bookingId ? (
        <tr className="bg-gray-50">
          <td colSpan={8} className="p-0">
            <BookingDetails bookingId={bookingId} />
          </td>
        </tr>
      ) : null}
    </>
  );
}

function EntityCell({ value }: { value: unknown }) {
  const summary = serializeSummary(value);
  return (
    <td className="max-w-[220px] px-4 py-4 text-xs text-gray-700">
      <span className="line-clamp-2 break-all">{summary}</span>
    </td>
  );
}

function FilterGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-gray-500">{label}</p>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors md:text-sm ${
              value === option.value
                ? "bg-[#43A047] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-2xl md:p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-green-50 p-2 text-[#2E7D32]">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 md:text-sm">{label}</p>
          <p className="mt-1 break-words text-base font-bold text-gray-900 md:text-xl">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
