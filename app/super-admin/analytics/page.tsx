"use client";

import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { Download } from "lucide-react";
import { useAdminAnalytics, useAdminRentals } from "@/app/api/features/admin";
import { toast } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticStats } from "@/app/super-admin/analytics/data/analysis";

const LOCATION_COLORS = [
  "bg-green-600",
  "bg-blue-600",
  "bg-orange-500",
  "bg-purple-600",
  "bg-rose-500",
];

const PLATFORM_ACTIVITY_STYLES = [
  { color: "text-green-600", bg: "bg-green-50" },
  { color: "text-blue-600", bg: "bg-blue-50" },
  { color: "text-purple-600", bg: "bg-purple-50" },
];

const page = () => {
  const { data: analytics, isLoading, isError } = useAdminAnalytics();
  const {
    data: rentals = [],
    isLoading: isLoadingRentals,
    isError: isRentalsError,
  } = useAdminRentals();
  const stats = analytics
    ? [
        {
          ...analyticStats[0],
          value: analytics.totalUsers.toLocaleString(),
          detail: `${analytics.activeUsers.toLocaleString()} active`,
        },
        {
          ...analyticStats[1],
          value: `₦${analytics.totalTransactionRevenue.toLocaleString()}`,
          detail: "Net platform revenue",
        },
        {
          ...analyticStats[2],
          value: analytics.totalRentals.toLocaleString(),
          detail: `${analytics.totalLocks.toLocaleString()} locks`,
        },
        {
          ...analyticStats[3],
          value: analytics.pendingReports.toLocaleString(),
          detail: `${analytics.resolvedReports.toLocaleString()} resolved`,
        },
      ]
    : [];
  const revenueBreakdown = analytics
    ? [
        {
          name: "Gross collected",
          value: analytics.grossPaymentsCollectedNGN,
          color: "#3B82F6",
        },
        {
          name: "Platform retained",
          value: analytics.totalTransactionRevenue,
          color: "#43A047",
        },
        {
          name: "Landlord payouts",
          value: analytics.landlordPayoutsNGN,
          color: "#F97316",
        },
      ]
    : [];
  const usersByRole = analytics
    ? [
        {
          name: "Tenants",
          value: analytics.usersByRole.tenants,
          color: "#3B82F6",
        },
        {
          name: "Landlords",
          value: analytics.usersByRole.landlords,
          color: "#43A047",
        },
        {
          name: "Admins",
          value: analytics.usersByRole.admins,
          color: "#A855F7",
        },
      ]
    : [];
  const topLocations = Array.from(
    rentals.reduce((counts, rental) => {
      const location = rental.location.trim() || "Unspecified";
      const normalized = location.toLowerCase();
      const current = counts.get(normalized);
      counts.set(normalized, {
        name: current?.name ?? location,
        value: (current?.value ?? 0) + 1,
      });
      return counts;
    }, new Map<string, { name: string; value: number }>()),
    ([, location]) => location,
  )
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);
  const maxLocationCount = topLocations[0]?.value ?? 1;
  const propertyTypes = Array.from(
    rentals.reduce((counts, rental) => {
      const propertyType = rental.propertyType.trim() || "Unspecified";
      const normalized = propertyType.toLowerCase();
      const current = counts.get(normalized);
      counts.set(normalized, {
        name: current?.name ?? propertyType,
        value: (current?.value ?? 0) + 1,
      });
      return counts;
    }, new Map<string, { name: string; value: number }>()),
    ([, propertyType]) => propertyType,
  ).sort((left, right) => right.value - left.value);
  const successfulPaymentsCount = analytics
    ? analytics.successfulLockPaymentsCount +
      analytics.successfulRentPaymentsCount +
      analytics.successfulInspectionPaymentsCount
    : 0;
  const platformActivity = analytics
    ? [
        {
          label: "Property Listings",
          value: analytics.totalRentals,
          sublabel: "Platform total",
        },
        {
          label: "Registered Users",
          value: analytics.totalUsers,
          sublabel: "Platform total",
        },
        {
          label: "Successful Payments",
          value: successfulPaymentsCount,
          sublabel: "Lock, rent and inspection",
        },
      ]
    : [];

  const handleExportReport = () => {
    if (!analytics) {
      toast.error("Analytics are still loading.");
      return;
    }

    const reportText = [
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Total Users: ${analytics.totalUsers.toLocaleString()}`,
      `Active Users: ${analytics.activeUsers.toLocaleString()}`,
      `Suspended Users: ${analytics.suspendedUsers.toLocaleString()}`,
      `Landlords: ${analytics.usersByRole.landlords.toLocaleString()}`,
      `Tenants: ${analytics.usersByRole.tenants.toLocaleString()}`,
      `Admins: ${analytics.usersByRole.admins.toLocaleString()}`,
      `Total Rentals: ${analytics.totalRentals.toLocaleString()}`,
      `Total Likes: ${analytics.totalLikes.toLocaleString()}`,
      `Total Locks: ${analytics.totalLocks.toLocaleString()}`,
      `Total Bookings: ${analytics.totalBookings.toLocaleString()}`,
      `Pending Reports: ${analytics.pendingReports.toLocaleString()}`,
      `Resolved Reports: ${analytics.resolvedReports.toLocaleString()}`,
      `Platform Revenue (NGN): ${analytics.totalTransactionRevenue.toLocaleString()}`,
      `Gross Payments Collected (NGN): ${analytics.grossPaymentsCollectedNGN.toLocaleString()}`,
      `Landlord Payouts (NGN): ${analytics.landlordPayoutsNGN.toLocaleString()}`,
      `Successful Lock Payments: ${analytics.successfulLockPaymentsCount.toLocaleString()}`,
      `Successful Rent Payments: ${analytics.successfulRentPaymentsCount.toLocaleString()}`,
      `Successful Inspection Payments: ${analytics.successfulInspectionPaymentsCount.toLocaleString()}`,
    ].join("\n");
    const printWindow = window.open("", "_blank", "width=800,height=900");

    if (!printWindow) {
      toast.error("Please allow pop-ups to export the PDF report.");
      return;
    }

    const escapedReport = reportText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>RentULO Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #162b4c; padding: 48px; line-height: 1.8; }
            h1 { color: #43a047; margin-bottom: 28px; }
            .report { border-top: 3px solid #43a047; padding-top: 24px; }
          </style>
        </head>
        <body><h1>RentULO Analytics Report</h1><div class="report">${escapedReport}</div></body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => printWindow.print(), 250);
  };

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
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center justify-center gap-2 bg-[#43A047] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm w-full sm:w-auto cursor-pointer"
          >
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
                  <div className="text-right text-xs font-medium text-gray-500">
                    {stat.detail}
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
              Revenue Breakdown
            </h2>
            <div className="h-48 md:h-64">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Loading financials...
                </div>
              ) : isError ? (
                <div className="flex h-full items-center justify-center text-sm text-red-500">
                  Unable to load financials.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueBreakdown}
                    margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis
                      width={72}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value: number) =>
                        `₦${new Intl.NumberFormat("en", { notation: "compact" }).format(value)}`
                      }
                    />
                    <Tooltip
                      formatter={(value) => [
                        `₦${Number(value ?? 0).toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {revenueBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Users by Role
            </h2>
            <div className="h-48 md:h-64">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Loading users...
                </div>
              ) : isError ? (
                <div className="flex h-full items-center justify-center text-sm text-red-500">
                  Unable to load user metrics.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usersByRole}
                    margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {usersByRole.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Top Locations
            </h2>
            <div className="space-y-3 md:space-y-4">
              {isLoadingRentals ? (
                <p className="text-sm text-gray-500">Loading locations...</p>
              ) : isRentalsError ? (
                <p className="text-sm text-red-500">
                  Unable to load locations.
                </p>
              ) : topLocations.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No property locations available.
                </p>
              ) : (
                topLocations.map((loc) => (
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
                        style={{
                          width: `${(loc.value / maxLocationCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Property Types
            </h2>
            <div className="space-y-3 md:space-y-4">
              {isLoadingRentals ? (
                <p className="text-sm text-gray-500">
                  Loading property types...
                </p>
              ) : isRentalsError ? (
                <p className="text-sm text-red-500">
                  Unable to load property types.
                </p>
              ) : propertyTypes.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No property type data available.
                </p>
              ) : (
                propertyTypes.map((type, index) => (
                  <div
                    key={type.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${LOCATION_COLORS[index % LOCATION_COLORS.length]}`}
                      />
                      <span className="text-xs md:text-sm text-gray-700">
                        {type.name}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-900">
                      {type.value}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
              Platform Activity
            </h2>
            <div className="space-y-3 md:space-y-4">
              {platformActivity.map((activity, index) => (
                <div
                  key={activity.label}
                  className={`flex items-center justify-between p-3 rounded-lg ${PLATFORM_ACTIVITY_STYLES[index].bg}`}
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
                    className={`text-lg md:text-xl font-bold ${PLATFORM_ACTIVITY_STYLES[index].color}`}
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
