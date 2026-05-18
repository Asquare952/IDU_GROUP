import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { Download, Calendar, ChevronDown, FileText } from "lucide-react";
import {
  reportTypes,
  recentReports,
  scheduledReports,
} from "@/app/super-admin/reports/data/reports";
import { div } from "framer-motion/client";

const page = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Reports
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Report generation with quick generators, custom builder, and
              scheduled reports
            </p>
          </div>
          <button className="bg-[#43A047] hover:bg-green-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-medium transition-colors cursor-pointer text-sm md:text-base w-full sm:w-auto">
            Generate New Report
          </button>
        </div>

        {/* Report Type Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.title}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div
                className={`p-2 rounded-lg md:rounded-xl ${report.iconBg} w-fit mb-3`}
              >
                <report.icon size={20} className={report.iconColor} />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-gray-900">
                {report.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {report.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Custom Report Builder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 rounded-lg md:rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047] appearance-none bg-white">
                  <option>Financial</option>
                  <option>User Analytics</option>
                  <option>Properties</option>
                  <option>Performance</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select date range"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg md:rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                />
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-[#43A047] hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Recent Reports
          </h2>
          <div className="space-y-3 md:space-y-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <FileText size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-medium text-gray-900">
                      {report.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] md:text-xs text-gray-400">
                      <span>{report.date}</span>
                      <span>{report.type}</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#43A047] hover:bg-green-600 text-white rounded-lg text-xs md:text-sm font-medium transition-colors w-full sm:w-auto justify-center cursor-pointer">
                  <Download size={14} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semi-bold text-gray-900">
              Scheduled Reports
            </h2>
            <button className="text-[#43A047] hover:text-green-600 text-sm font-medium treansition-colors">Add Schedule</button>
          </div>
          <div className="space-y-3">
            { scheduledReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-medium text-gray-900">
                    {report.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                    {report.schedule}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${report.status === "Active" ? "bg-green-100 text-green-700 cursor-pointer" : report.status === "Paused" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`} >
                  {report.status}
                  
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
