"use client";

import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { Download, ArrowUp, ArrowDown } from "lucide-react";
import { useAdminAnalytics } from "@/app/api/features/admin";
import {
  analyticStats,
  months,
  topLocations,
  propertyTypes,
  platformActivity,
} from "@/app/super-admin/analytics/data/analysis";

const page = () => {
  const { data: analytics, isLoading, isError } = useAdminAnalytics();
  const stats = analytics
    ? analyticStats.map((stat, index) => ({
        ...stat,
        value: [
          analytics.totalUsers.toLocaleString(),
          `N${analytics.totalTransactionRevenue.toLocaleString()}`,
          analytics.totalRentals.toLocaleString(),
          `${analytics.pendingReports.toLocaleString()} pending`,
        ][index],
        change: [
          `${analytics.activeUsers.toLocaleString()} active`,
          "Platform revenue",
          `${analytics.totalLocks.toLocaleString()} locked`,
          `${analytics.resolvedReports.toLocaleString()} resolved`,
        ][index],
      }))
    : [];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Analytics
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Platform performance and insights
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#43A047] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm w-full sm:w-auto">
            <Download size={16} />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500">
              Loading analytics...
            </div>
          ) : isError ? (
            <div className="col-span-full text-center text-red-500">
              Unable to load analytics.
            </div>
          ) : (
            stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div
                    className={`p-2 rounded-lg md:rounded-xl ${stat.iconBg}`}
                  >
                    <stat.icon size={16} className={stat.iconColor} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${stat.changeType === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {stat.changeType === "up" ? (
                      <ArrowUp size={12} />
                    ) : (
                      <ArrowDown size={12} />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {stat.title}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Revenue Trend
            </h2>
            <div className="h-48 md:h-64 flex items-end justify-between gap-1 md:gap-2">
              {months.map((month, i) => (
                <div
                  key={month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-[#43A047] rounded-t-sm md:rounded-t opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                  <span className="text-[10px] md:text-xs text-gray-500">
                    {month}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              User Growth
            </h2>
            <div className="h-48 md:h-64 flex items-end justify-between gap-1 md:gap-2">
              {months.map((month, i) => (
                <div
                  key={month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-blue-500 rounded-t-sm md:rounded-t opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                  <span className="text-[10px] md:text-xs text-gray-500">
                    {month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Top Locations
            </h2>
            <div className="space-y-3 md:space-y-4">
              {topLocations.map((loc) => (
                <div key={loc.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs md:text-sm text-gray-700">
                      {loc.name}
                    </span>
                    <span className="text-xs md:text-sm font-medium text-gray-900">
                      {loc.value}
                    </span>
                  </div>
                  <div className="w-full h-1.5 md:h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#43A047] rounded-full"
                      style={{ width: `${loc.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Property Types
            </h2>
            <div className="space-y-3 md:space-y-4">
              {propertyTypes.map((type) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${type.color}`} />
                    <span className="text-xs md:text-sm text-gray-700">
                      {type.name}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-900">
                    {type.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Platform Activity
            </h2>
            <div className="space-y-3 md:space-y-4">
              {platformActivity.map((activity) => (
                <div
                  key={activity.label}
                  className={`flex items-center justify-between p-3 rounded-lg ${activity.bg}`}
                >
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">
                      {activity.label}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {activity.sublabel}
                    </p>
                  </div>
                  <span
                    className={`text-lg md:text-xl font-bold ${activity.color}`}
                  >
                    {activity.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
