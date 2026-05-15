import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import {
  safetyStats,
  filterTabs,
  reports,
  criticalReports,
} from "@/app/super-admin/safety-and-reports/data/safety";

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
  switch (status) {
    case "Pending":
      return "bg-orange-100 text-orange-700";
    case "Under Review":
      return "bg-blue-100 text-blue-700";
    case "Resolved":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const page = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Safety & Reports
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Monitor and manage safety reports
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {safetyStats.map((stat) => (
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
                placeholder="Search reports..."
                className="w-full pl-9 pr-3 py-2 rounded-lg md:rounded-xl border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg md:rounded-xl text-xs md:text-sm text-gray-600 hover:bg-gray-50">
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filter Tabs - Horizontal scroll on mobile */}
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
            <table className="w-full min-w-[640px]">
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
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50">
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className="text-xs md:text-sm font-medium text-blue-600">
                        {report.id}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="text-xs md:text-sm text-gray-900 whitespace-pre-line">
                        {report.dateTime}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div>
                        <p className="text-xs md:text-sm font-medium text-gray-900">
                          {report.reporter}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-500">
                          {report.reporterDetail}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                      {report.category}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${getSeverityColor(report.severity)}`}
                      >
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-1 md:gap-2">
                        <button
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1 text-green-500 hover:bg-green-50 rounded"
                          title="Message"
                        >
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Critical Reports */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Critical Reports
          </h2>
          <div className="space-y-4">
            {criticalReports.map((report, i) => (
              <div
                key={i}
                className="flex items-start justify-between p-4 rounded-xl bg-red-50/50 border border-red-100"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700">{report.type}</p>
                    <p className="text-sm text-red-600 mt-0.5">
                      {report.description}
                    </p>
                    <p className="text-xs text-red-400 mt-2">
                      Reported by: {report.reporter}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-500">{report.date}</span>
                  <button className="px-4 py-1.5 bg-red-500 cursor-pointer hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors">
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

export default page;
