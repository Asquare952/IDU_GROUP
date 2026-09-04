"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { Search, Filter } from "lucide-react";
import { filterTabs, transactionStats } from "@/app/super-admin/transactions/data/transaction";
import {
  useGetTransactionStats,
  useGetTransactions,
} from "@/app/api/features/transactions";
import type { Transaction } from "@/app/api/features/transactions/types";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-orange-100 text-orange-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatAmount = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

const formatDateTime = (date: string) => {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return date;

  return value.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const toDisplayTransaction = (transaction: Transaction) => ({
  id: transaction.reference || transaction.id,
  dateTime: formatDateTime(transaction.createdAt),
  tenant: transaction.User?.full_name || "Unknown tenant",
  tenantDetail: transaction.User?.email || "",
  property: transaction.payment_type,
  amount: formatAmount(transaction.amount),
  method: transaction.payment_type,
  status:
    transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1),
});

const page = () => {
  const [activeFilter, setActiveFilter] = useState("All Transactions");
  const { data: stats, isLoading: isLoadingStats } = useGetTransactionStats();
  const { data: transactionResponse, isLoading: isLoadingTransactions } =
    useGetTransactions();

  const displayStats = transactionStats.map((stat) => {
    const values = {
      "Total Today": stats?.totalToday,
      Completed: stats?.completed,
      Pending: stats?.pending,
      Failed: stats?.failed,
    };
    const value = values[stat.title as keyof typeof values];

    return {
      ...stat,
      value:
        isLoadingStats || value === undefined
          ? "—"
          : stat.title === "Total Today"
            ? formatAmount(value)
            : value.toLocaleString(),
    };
  });

  const displayedTransactions = useMemo(
    () => (transactionResponse?.data || []).map(toDisplayTransaction),
    [transactionResponse],
  );

  const filteredTransactions = displayedTransactions.filter((txn) => {
    if (activeFilter === "All Transactions") return true;
    return txn.status === activeFilter;
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Transactions
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Payment monitoring with daily stats and transaction history
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {displayStats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`p-2 rounded-lg md:rounded-xl ${stat.iconBg}`}>
                  <stat.icon size={16} className={stat.iconColor} />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-3 md:p-4 space-y-3 md:space-y-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by transaction ID, tenant, or property..."
                className="w-full pl-9 pr-3 py-2 rounded-lg md:rounded-xl border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === tab
                    ? "bg-[#43A047] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table with filtered data */}
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Transaction ID
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Date & Time
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Tenant
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Property
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Method
                  </th>
                  <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingTransactions ? (
                  <tr>
                    <td colSpan={7} className="px-3 md:px-6 py-8 text-center text-gray-500 text-sm">
                      Loading transactions...
                    </td>
                  </tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50/50">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <span className="text-xs md:text-sm font-medium text-blue-600">
                          {txn.id}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="text-xs md:text-sm text-gray-900 whitespace-pre-line">
                          {txn.dateTime}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div>
                          <p className="text-xs md:text-sm font-medium text-gray-900">
                            {txn.tenant}
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-500">
                            {txn.tenantDetail}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {txn.property}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900">
                        {txn.amount}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                        {txn.method}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${getStatusColor(txn.status)}`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 md:px-6 py-8 text-center text-gray-500 text-sm"
                    >
                      No {activeFilter.toLowerCase()} transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 gap-3">
            <p className="text-xs md:text-sm text-gray-500">
              Showing {filteredTransactions.length} of {displayedTransactions.length}{" "}
              transactions
            </p>
            <div className="flex items-center gap-1 md:gap-2">
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Previous
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm bg-[#43A047] text-white rounded-lg">
                1
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                2
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                3
              </button>
              <button className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
