"use client";

import React, { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from "lucide-react";
import {
  useAdminReports,
  useUpdateAdminReportStatus,
} from "@/app/api/features/admin";
import { toast } from "react-toastify";

const filterTabs = [
  "All Reports",
  "Pending",
  "Resolved",
  "Rejected",
  "Critical",
] as const;

const normalizeStatus = (value: string) => value.trim().toLowerCase();

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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "bg-red-100 text-red-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status: string) => {
  switch (normalizeStatus(status)) {
    case "pending":
      return "bg-orange-100 text-orange-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDateTime = (value: string) => {
  if (!value) {
    return "N/A";
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

const Page = () => {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filterTabs)[number]>("All Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: reports = [], isLoading, isError, error } = useAdminReports();
  const { mutate: updateReportStatus, isPending: isUpdatingStatus } =
    useUpdateAdminReportStatus();

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const severity = getSeverity(report.report_type);
      const status = normalizeStatus(report.status);
      const matchesSearch =
        !query ||
        report.report_message.toLowerCase().includes(query) ||
        report.report_type.toLowerCase().includes(query) ||
        report.reporterName.toLowerCase().includes(query) ||
        (report.targetName ?? "").toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      switch (activeFilter) {
        case "Pending":
          return status === "pending";
        case "Resolved":
          return status === "resolved";
        case "Rejected":
          return status === "rejected";
        case "Critical":
          return severity === "Critical";
        default:
          return true;
      }
    });
  }, [activeFilter, reports, searchQuery]);

  const stats = useMemo(() => {
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

    return { pending, resolved, rejected, critical };
  }, [reports]);

  const criticalReports = useMemo(
    () =>
      reports
        .filter((report) => getSeverity(report.report_type) === "Critical")
        .slice(0, 3),
    [reports],
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Safety & Reports
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Monitor and manage safety reports
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              title: "Pending Reports",
              value: stats.pending,
              icon: AlertTriangle,
              iconBg: "bg-orange-50",
              iconColor: "text-orange-500",
            },
            {
              title: "Resolved",
              value: stats.resolved,
              icon: CheckCircle,
              iconBg: "bg-green-50",
              iconColor: "text-green-500",
            },
            {
              title: "Rejected",
              value: stats.rejected,
              icon: Clock,
              iconBg: "bg-blue-50",
              iconColor: "text-blue-500",
            },
            {
              title: "Critical Issues",
              value: stats.critical,
              icon: ShieldAlert,
              iconBg: "bg-red-50",
              iconColor: "text-red-500",
            },
          ].map((stat) => (
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
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search reports..."
                className="w-full pl-9 pr-3 py-2 rounded-lg md:rounded-xl border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

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

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading reports...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              {error.message || "Unable to load reports."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                      Report ID
                    </th>
                    <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                      Date & Time
                    </th>
                    <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                      Reporter
                    </th>
                    <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                      Category
                    </th>
                    <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                      Severity
                    </th>
                    <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-3 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReports.map((report) => {
                    const severity = getSeverity(report.report_type);

                    return (
                      <tr key={report.id} className="hover:bg-gray-50/50">
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span className="text-xs md:text-sm font-medium text-blue-600">
                            {report.id}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">
                          {formatDateTime(report.createdAt)}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div>
                            <p className="text-xs md:text-sm font-medium text-gray-900">
                              {report.reporterName}
                            </p>
                            <p className="text-[10px] md:text-xs text-gray-500">
                              {report.targetName || report.searchName || "No target"}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 capitalize">
                          {report.report_type}
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${getSeverityColor(
                              severity,
                            )}`}
                          >
                            {severity}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium capitalize ${getStatusColor(
                              report.status,
                            )}`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                              disabled={isUpdatingStatus}
                              onClick={() =>
                                updateReportStatus(
                                  { id: report.id, status: "resolved" },
                                  {
                                    onSuccess: () =>
                                      toast.success("Report marked as resolved."),
                                    onError: (mutationError) =>
                                      toast.error(
                                        mutationError.message ||
                                          "Unable to update this report.",
                                      ),
                                  },
                                )
                              }
                            >
                              Resolve
                            </button>
                            <button
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                              disabled={isUpdatingStatus}
                              onClick={() =>
                                updateReportStatus(
                                  { id: report.id, status: "rejected" },
                                  {
                                    onSuccess: () =>
                                      toast.success("Report marked as rejected."),
                                    onError: (mutationError) =>
                                      toast.error(
                                        mutationError.message ||
                                          "Unable to update this report.",
                                      ),
                                  },
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Critical Reports
          </h2>
          <div className="space-y-4">
            {criticalReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start justify-between p-4 rounded-xl bg-red-50/50 border border-red-100"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700 capitalize">
                      {report.report_type}
                    </p>
                    <p className="text-sm text-red-600 mt-0.5">
                      {report.report_message}
                    </p>
                    <p className="text-xs text-red-400 mt-2">
                      Reported by: {report.reporterName}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-500">
                    {formatDateTime(report.createdAt)}
                  </span>
                  <button
                    className="px-4 py-1.5 bg-red-500 cursor-pointer hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                    disabled={isUpdatingStatus}
                    onClick={() =>
                      updateReportStatus(
                        { id: report.id, status: "resolved" },
                        {
                          onSuccess: () =>
                            toast.success("Critical report marked as resolved."),
                          onError: (mutationError) =>
                            toast.error(
                              mutationError.message ||
                                "Unable to update this critical report.",
                            ),
                        },
                      )
                    }
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
