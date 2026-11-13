"use client";

import { Fragment, useMemo, useState, type ReactNode } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Coins,
  HandCoins,
  Wallet,
} from "lucide-react";
import { useAdminHostDebts } from "@/app/api/features/admin";
import type { HostDebt, HostDebtStatus } from "@/app/api/features/admin";

const filters: { label: string; value: HostDebtStatus }[] = [
  { label: "Open", value: "open" },
  { label: "Settled", value: "settled" },
  { label: "All", value: "all" },
];

const parseAmountInCents = (value: string | number): number | null => {
  const amount =
    typeof value === "number"
      ? value
      : value.trim()
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(amount) || amount < 0) return null;

  const cents = Math.round((amount + Number.EPSILON) * 100);
  return Number.isSafeInteger(cents) ? cents : null;
};

const formatMoney = (cents: number | null) =>
  cents === null
    ? "—"
    : `₦${(cents / 100).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

const sumAmounts = (
  debts: HostDebt[],
  field: "amount" | "recovered_amount" | "outstanding",
) => {
  let total = 0;
  let hasInvalidAmount = false;

  debts.forEach((debt) => {
    const cents = parseAmountInCents(debt[field]);
    if (cents === null || !Number.isSafeInteger(total + cents)) {
      hasInvalidAmount = true;
      return;
    }

    total += cents;
  });

  return { total, hasInvalidAmount };
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-orange-100 text-orange-800";
    case "settled":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Page = () => {
  const [activeStatus, setActiveStatus] = useState<HostDebtStatus>("open");
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);
  const { data, isLoading, isError, error } = useAdminHostDebts(activeStatus);
  const debts = Array.isArray(data?.data) ? data.data : [];

  const totals = useMemo(
    () => ({
      original: sumAmounts(debts, "amount"),
      recovered: sumAmounts(debts, "recovered_amount"),
      outstanding: sumAmounts(debts, "outstanding"),
    }),
    [debts],
  );
  const hasInvalidAmounts =
    totals.original.hasInvalidAmount ||
    totals.recovered.hasInvalidAmount ||
    totals.outstanding.hasInvalidAmount;

  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 md:space-y-6 md:p-6">
        <header>
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            Host Debts
          </h1>
          <p className="mt-1 text-sm text-gray-500 md:text-base">
            Monitor amounts owed to the platform after guest refunds. Debt
            recovery is handled automatically.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
          <SummaryCard
            label="Debt records"
            value={isLoading ? "—" : debts.length.toLocaleString()}
            icon={<CircleAlert size={18} />}
          />
          <SummaryCard
            label="Original debt"
            value={isLoading ? "—" : formatMoney(totals.original.total)}
            icon={<Coins size={18} />}
          />
          <SummaryCard
            label="Recovered"
            value={isLoading ? "—" : formatMoney(totals.recovered.total)}
            icon={<HandCoins size={18} />}
          />
          <SummaryCard
            label="Outstanding"
            value={isLoading ? "—" : formatMoney(totals.outstanding.total)}
            icon={<Wallet size={18} />}
          />
        </div>

        <section className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:space-y-4 md:rounded-2xl md:p-4">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Filter host debts by status"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={activeStatus === filter.value}
                onClick={() => {
                  setActiveStatus(filter.value);
                  setExpandedDebtId(null);
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
          </div>

          {hasInvalidAmounts && !isLoading && !isError ? (
            <p
              className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
              role="status"
            >
              Some debt amounts are invalid or exceed the supported range and
              were excluded from the corresponding totals.
            </p>
          ) : null}

          {isLoading ? (
            <div
              className="p-10 text-center text-sm text-gray-500"
              role="status"
            >
              Loading host debts...
            </div>
          ) : isError ? (
            <div
              className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-700"
              role="alert"
            >
              {error.message || "Unable to load host debts. Please try again."}
            </div>
          ) : debts.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              No {activeStatus === "all" ? "" : `${activeStatus} `}host debts
              found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Host",
                      "Original debt",
                      "Recovered",
                      "Outstanding",
                      "Reason",
                      "Status",
                      "Created",
                      "Settled",
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
                  {debts.map((debt) => {
                    const isExpanded = expandedDebtId === debt.id;

                    return (
                      <Fragment key={debt.id}>
                        <tr className="align-top hover:bg-gray-50/60">
                          <td className="px-4 py-4">
                            <p className="whitespace-nowrap text-sm font-medium text-gray-900">
                              {debt.host?.full_name || "Unknown host"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {debt.host?.email || "No email"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {debt.host?.phone_no || "No phone"}
                            </p>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {formatMoney(parseAmountInCents(debt.amount))}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {formatMoney(
                              parseAmountInCents(debt.recovered_amount),
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-900">
                            {formatMoney(parseAmountInCents(debt.outstanding))}
                          </td>
                          <td className="max-w-xs px-4 py-4 text-sm text-gray-600">
                            <span className="line-clamp-2">
                              {debt.reason || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles(debt.status)}`}
                            >
                              {debt.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                            {formatDate(debt.createdAt)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                            {formatDate(debt.settled_at)}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              onClick={() =>
                                setExpandedDebtId(isExpanded ? null : debt.id)
                              }
                              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-medium text-[#2E7D32] hover:bg-green-50"
                            >
                              {isExpanded ? "Hide" : "View"}
                              {isExpanded ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                        {isExpanded ? (
                          <tr key={`${debt.id}-details`} className="bg-gray-50">
                            <td colSpan={9} className="px-4 py-4">
                              <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                <Detail label="Debt ID" value={debt.id} />
                                <Detail
                                  label="Host ID"
                                  value={debt.host_id || debt.host?.id || "—"}
                                />
                                <Detail
                                  label="Booking ID"
                                  value={debt.booking_id || "—"}
                                />
                                <Detail
                                  label="Reason"
                                  value={debt.reason || "—"}
                                />
                              </dl>
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

function SummaryCard({
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 break-all text-gray-900">{value}</dd>
    </div>
  );
}

export default Page;
