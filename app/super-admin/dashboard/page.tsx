// app/super-admin/dashboard/page.tsx

import React from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  stats,
  userStats,
  recentActivity,
  systemAlerts,
  quickStats,
} from "@/app/super-admin/dashboard/data/dashboard";

const page = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Super Admin</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <stat.icon size={20} className={stat.iconColor} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${stat.changeType === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.changeType === "up" ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-2">
                {stat.changeType === "up" ? "+" : ""}
                {stat.change.replace(/[+%-]/g, "")} this month
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              User Statistics
            </h2>
            <div className="space-y-4">
              {userStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                      <stat.icon size={20} className={stat.color} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stat.label}</p>
                      <p className="text-sm text-gray-500">{stat.sublabel}</p>
                    </div>
                  </div>
                  <span className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${activity.color}`}
                    />
                    {i !== recentActivity.length - 1 && (
                      <div className="w-px h-full bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.text}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {activity.detail}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              System Alerts
            </h2>
            <div className="space-y-3">
              {systemAlerts.map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-xl border ${alert.borderColor} ${alert.bgColor}`}
                >
                  <div className="flex items-start gap-3">
                    <alert.icon size={20} className={`${alert.color} mt-0.5`} />
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer ${alert.buttonColor}`}
                  >
                    {alert.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-5">
              {quickStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stat.barColor} transition-all duration-500`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
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
