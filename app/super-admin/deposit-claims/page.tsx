"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  useAdminDepositClaims,
  type AdminDepositClaim,
} from "@/app/api/features/admin";
import { useProtectedRoute } from "@/app/hooks/useProtectedRoute";
import BookingDetails from "@/app/super-admin/shortlet-bookings/BookingDetails";

const claimFilters = [
  { label: "Open", value: "open" },
  { label: "Resolved", value: "resolved" },
  { label: "All", value: "all" },
] as const;

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

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      });
};

const isResolvedClaim = (claim: AdminDepositClaim) =>
  Boolean(claim.deposit_claim_decision);

const Page = () => {
  const {
    isLoading: isAuthLoading,
    isAuthenticated,
    isSuperAdmin,
  } = useProtectedRoute();
  const [activeStatus, setActiveStatus] =
    useState<(typeof claimFilters)[number]["value"]>("open");
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    null,
  );
  const { data, isLoading, isError, error } =
    useAdminDepositClaims(activeStatus);
  const claims = Array.isArray(data?.data) ? data.data : [];

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
            Deposit Claims
          </h1>
          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Review Shortlet security deposit claims. The backend processes
            approved payments and guest refunds.
          </p>
        </header>

        <section className="space-y-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:rounded-2xl md:p-4">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Filter deposit claims by status"
          >
            {claimFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={activeStatus === filter.value}
                onClick={() => {
                  setActiveStatus(filter.value);
                  setExpandedBookingId(null);
                }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeStatus === filter.value
                    ? "bg-[#43A047] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
            <span className="ml-auto whitespace-nowrap text-xs text-gray-500">
              {isLoading ? "Loading..." : `${claims.length} records`}
            </span>
          </div>

          {isLoading ? (
            <div
              className="p-10 text-center text-sm text-gray-500"
              role="status"
            >
              Loading deposit claims...
            </div>
          ) : isError ? (
            <div
              className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-700"
              role="alert"
            >
              {error.message ||
                "Unable to load deposit claims. Please try again."}
            </div>
          ) : claims.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              No {activeStatus === "all" ? "" : `${activeStatus} `}deposit
              claims found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Booking",
                      "Claim amount",
                      "Security deposit",
                      "Reason",
                      "Claimed at",
                      "Decision",
                      "Details / action",
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
                  {claims.map((claim, index) => {
                    const bookingId = claim.booking_id;
                    const key = bookingId || `claim-${index}`;
                    const isExpanded = Boolean(
                      bookingId && expandedBookingId === bookingId,
                    );
                    const resolved = isResolvedClaim(claim);

                    return (
                      <Fragment key={key}>
                        <tr className="align-top hover:bg-gray-50/60">
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {bookingId || "Booking ID unavailable"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                            {formatMoney(claim.deposit_claim_amount)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {formatMoney(claim.security_deposit)}
                          </td>
                          <td className="max-w-xs px-4 py-4 text-sm text-gray-600">
                            <span className="line-clamp-2">
                              {claim.deposit_claim_reason || "—"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                            {formatDate(claim.deposit_claimed_at)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                resolved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {resolved ? claim.deposit_claim_decision : "Open"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              disabled={!bookingId}
                              aria-expanded={isExpanded}
                              onClick={() =>
                                setExpandedBookingId(
                                  isExpanded ? null : (bookingId ?? null),
                                )
                              }
                              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium text-[#2E7D32] hover:bg-green-50 disabled:opacity-50"
                            >
                              {isExpanded ? "Hide details" : "Review"}
                              {isExpanded ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && bookingId ? (
                          <tr className="bg-gray-50">
                            <td colSpan={7} className="p-0">
                              <div className="space-y-3 p-4">
                                <ClaimSnapshot claim={claim} />
                                <BookingDetails
                                  bookingId={bookingId}
                                  allowResolution
                                  claimRecord={claim}
                                />
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

function ClaimSnapshot({ claim }: { claim: AdminDepositClaim }) {
  return (
    <div className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className="text-xs font-medium text-gray-500">Claim reason</p>
        <p className="mt-1 break-words text-gray-900">
          {claim.deposit_claim_reason || "—"}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">Decision note</p>
        <p className="mt-1 break-words text-gray-900">
          {claim.deposit_claim_note || "—"}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">Paid to host</p>
        <p className="mt-1 text-gray-900">
          {formatMoney(claim.deposit_paid_to_host)}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">Deposit claimed at</p>
        <p className="mt-1 text-gray-900">
          {formatDate(claim.deposit_claimed_at)}
        </p>
      </div>
    </div>
  );
}

export default Page;
