import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { Search, Filter } from "lucide-react";
import {
  transactionStats,
  filterTabs,
  transactions,
} from "@/app/super-admin/transactions/data/transaction";

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

const page = () => {
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {transactionStats.map((stat) => (
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab, i) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  i === 0
                    ? "bg-[#43A047] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

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
                {transactions.map((txn) => (
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
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-4 border-t border-gray-100 gap-3">
            <p className="text-xs md:text-sm text-gray-500">
              Showing 1-5 of 1,343 transactions
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
