"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useAdminReports } from "@/app/api/features/admin";

const normalizeStatus = (value: string) => value.trim().toLowerCase();

const formatDateTime = (value: string) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const toTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const formatReportType = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase()) || "Other";

const getSeverity = (reportType: string) => {
  const normalizedType = reportType.toLowerCase();

  if (
    normalizedType.includes("fraud") ||
    normalizedType.includes("harass") ||
    normalizedType.includes("threat")
  ) {
    return "Critical";
  }

  if (
    normalizedType.includes("safety") ||
    normalizedType.includes("security") ||
    normalizedType.includes("scam")
  ) {
    return "High";
  }

  if (normalizedType.includes("spam") || normalizedType.includes("abuse")) {
    return "Medium";
  }

  return "Low";
};

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
};

const getStatusStyles = (status: string) => {
  switch (normalizeStatus(status)) {
    case "resolved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "pending":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: reports = [], isLoading, isError, error } = useAdminReports();

  const reportInsights = useMemo(() => {
    const sortedReports = [...reports].sort(
      (left, right) => toTimestamp(right.createdAt) - toTimestamp(left.createdAt),
    );
    const pending = reports.filter(
      (report) => normalizeStatus(report.status) === "pending",
    ).length;
    const resolved = reports.filter(
      (report) => normalizeStatus(report.status) === "resolved",
    ).length;
    const rejected = reports.filter(
      (report) => normalizeStatus(report.status) === "rejected",
    ).length;
    const critical = reports.filter(
      (report) => getSeverity(report.report_type) === "Critical",
    ).length;

    const categoriesMap = reports.reduce<Map<string, number>>((map, report) => {
      const formattedType = formatReportType(report.report_type);
      map.set(formattedType, (map.get(formattedType) ?? 0) + 1);
      return map;
    }, new Map());

    const topCategories = [...categoriesMap.entries()]
      .map(([type, count]) => ({
        type,
        count,
        severity: getSeverity(type),
      }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 4);

    return {
      pending,
      resolved,
      rejected,
      critical,
      topCategories,
      recentReports: sortedReports.slice(0, 6),
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reportInsights.recentReports.filter((report) => {
      if (!query) {
        return true;
      }

      return (
        report.report_message.toLowerCase().includes(query) ||
        report.report_type.toLowerCase().includes(query) ||
        report.reporterName.toLowerCase().includes(query) ||
        (report.targetName ?? "").toLowerCase().includes(query)
      );
    });
  }, [reportInsights.recentReports, searchQuery]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Reports Overview
            </h1>
            <p className="mt-1 text-sm md:text-base text-gray-500">
              Live moderation insights powered by the super-admin reports endpoint
            </p>
          </div>
          <Link
            href="/super-admin/safety-and-reports"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#43A047] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
          >
            Open Safety Desk
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {[
            {
              title: "Total Reports",
              value: reports.length,
              icon: FileText,
              iconBg: "bg-blue-50",
              iconColor: "text-blue-500",
            },
            {
              title: "Pending Review",
              value: reportInsights.pending,
              icon: Clock3,
              iconBg: "bg-orange-50",
              iconColor: "text-orange-500",
            },
            {
              title: "Resolved",
              value: reportInsights.resolved,
              icon: CheckCircle2,
              iconBg: "bg-green-50",
              iconColor: "text-green-500",
            },
            {
              title: "Critical Cases",
              value: reportInsights.critical,
              icon: ShieldAlert,
              iconBg: "bg-red-50",
              iconColor: "text-red-500",
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-2xl md:p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2 ${stat.iconBg}`}>
                  <stat.icon size={18} className={stat.iconColor} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 md:text-2xl">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 md:text-sm">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-2xl md:p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                  Top Report Categories
                </h2>
                <p className="mt-1 text-xs text-gray-500 md:text-sm">
                  Most reported issues
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                Loading report categories...
              </div>
            ) : isError ? (
              <div className="rounded-xl bg-red-50 px-4 py-8 text-center text-sm text-red-500">
                {error.message || "Unable to load report insights."}
              </div>
            ) : reportInsights.topCategories.length === 0 ? (
              <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No report categories available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {reportInsights.topCategories.map((category) => (
                  <div
                    key={category.type}
                    className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {category.type}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {category.count.toLocaleString()} report(s)
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium md:text-xs ${getSeverityStyles(
                          category.severity,
                        )}`}
                      >
                        {category.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-2xl md:p-6">
            <h2 className="text-base font-semibold text-gray-900 md:text-lg">
              Status Breakdown
            </h2>
            <div className="mt-4 space-y-3">
              {[
                {
                  label: "Pending",
                  value: reportInsights.pending,
                  className: "bg-orange-500",
                },
                {
                  label: "Resolved",
                  value: reportInsights.resolved,
                  className: "bg-green-500",
                },
                {
                  label: "Rejected",
                  value: reportInsights.rejected,
                  className: "bg-red-500",
                },
              ].map((item) => {
                const percentage = reports.length
                  ? Math.round((item.value / reports.length) * 100)
                  : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {item.value.toLocaleString()} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${item.className}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Critical report watch
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-red-600">
                    {reportInsights.critical.toLocaleString()} critical case(s)
                    need close monitoring from the safety desk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:rounded-2xl md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 md:text-lg">
                Recent Reports
              </h2>
              <p className="mt-1 text-xs text-gray-500 md:text-sm">
                Latest incoming report activity
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search recent reports..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {isLoading ? (
              <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                Loading recent reports...
              </div>
            ) : isError ? (
              <div className="rounded-xl bg-red-50 px-4 py-8 text-center text-sm text-red-500">
                {error.message || "Unable to load recent reports."}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No reports matched your search.
              </div>
            ) : (
              filteredReports.map((report) => {
                const severity = getSeverity(report.report_type);

                return (
                  <div
                    key={report.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatReportType(report.report_type)}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-medium md:text-xs ${getStatusStyles(
                              report.status,
                            )}`}
                          >
                            {report.status}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-medium md:text-xs ${getSeverityStyles(
                              severity,
                            )}`}
                          >
                            {severity}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {report.report_message || "No report message supplied."}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Reporter: {report.reporterName}</span>
                          <span>
                            Target: {report.targetName || report.searchName || "N/A"}
                          </span>
                          <span>{formatDateTime(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
