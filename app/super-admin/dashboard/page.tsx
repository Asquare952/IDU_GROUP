"use client";

import React, { useMemo } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  TrendingUp,
  Users,
  Building2,
  BadgeAlert,
  MessageSquare,
  UserCheck,
  UserX2,
  UsersRound,
  House,
  ShieldAlert,
  Ban,
  Lock,
  Database,
} from "lucide-react";
import {
  useAdminChats,
  useAdminRentals,
  useAdminReports,
  useAdminUsers,
  useLockedAdminRentals,
} from "@/app/api/features/admin";

const formatMetric = (value: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);

const formatActivityDate = (value: string) => {
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
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const toTimestamp = (value: string) => {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const Page = () => {
  const { data: users = [], isLoading: isLoadingUsers } = useAdminUsers();
  const { data: rentals = [], isLoading: isLoadingRentals } = useAdminRentals();
  const { data: reports = [], isLoading: isLoadingReports } = useAdminReports();
  const { data: chats = [], isLoading: isLoadingChats } = useAdminChats();
  const { data: lockedRentals = [], isLoading: isLoadingLockedRentals } =
    useLockedAdminRentals();

  const isLoading =
    isLoadingUsers ||
    isLoadingRentals ||
    isLoadingReports ||
    isLoadingChats ||
    isLoadingLockedRentals;

  const dashboardData = useMemo(() => {
    const activeUsers = users.filter((user) => user.is_active).length;
    const blockedUsers = users.filter((user) => !user.is_active).length;
    const landlords = users.filter((user) => user.role === "landlord").length;
    const tenants = users.filter((user) => user.role === "tenant").length;
    const superAdmins = users.filter((user) => user.is_superadmin).length;
    const availableRentals = rentals.filter(
      (rental) => rental.status.toLowerCase() === "available",
    ).length;
    const resolvedReports = reports.filter(
      (report) => report.status.toLowerCase() === "resolved",
    ).length;
    const pendingReports = reports.filter(
      (report) => report.status.toLowerCase() === "pending",
    ).length;

    const stats = [
      {
        title: "Total Users",
        value: formatMetric(users.length),
        change: `${activeUsers} active`,
        icon: Users,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-500",
      },
      {
        title: "Total Properties",
        value: formatMetric(rentals.length),
        change: `${availableRentals} available`,
        icon: Building2,
        iconBg: "bg-green-50",
        iconColor: "text-green-500",
      },
      {
        title: "Open Reports",
        value: formatMetric(reports.length),
        change: `${pendingReports} pending`,
        icon: BadgeAlert,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
      },
      {
        title: "Active Chats",
        value: formatMetric(chats.length),
        change: `${lockedRentals.length} locked listings`,
        icon: MessageSquare,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-500",
      },
    ];

    const userStats = [
      {
        label: "Super Admins",
        sublabel: "Privileged platform managers",
        value: formatMetric(superAdmins),
        icon: UserCheck,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        label: "Blocked Users",
        sublabel: "Accounts currently restricted",
        value: formatMetric(blockedUsers),
        icon: UserX2,
        color: "text-orange-600",
        bg: "bg-orange-50",
      },
      {
        label: "Landlords",
        sublabel: "Property owners on platform",
        value: formatMetric(landlords),
        icon: UsersRound,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      {
        label: "Tenants",
        sublabel: "House seekers and renters",
        value: formatMetric(tenants),
        icon: House,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
    ];

    const recentActivity = [
      ...rentals.slice(0, 3).map((rental) => ({
        text: "New property listed",
        detail: `${rental.title} in ${rental.location}`,
        time: formatActivityDate(rental.createdAt),
        color: "bg-green-500",
        timestamp: toTimestamp(rental.createdAt),
      })),
      ...users.slice(0, 3).map((user) => ({
        text: "New user registered",
        detail: `${`${user.first_name} ${user.last_name}`.trim() || user.email} joined as ${user.role}`,
        time: formatActivityDate(user.createdAt),
        color: "bg-blue-500",
        timestamp: toTimestamp(user.createdAt),
      })),
      ...reports.slice(0, 3).map((report) => ({
        text: "Safety report submitted",
        detail: report.report_message || report.report_type,
        time: formatActivityDate(report.createdAt),
        color: "bg-red-500",
        timestamp: toTimestamp(report.createdAt),
      })),
      ...chats.slice(0, 3).map((chat) => ({
        text: "New conversation started",
        detail:
          chat.participants.map((participant) => participant.name).join(", ") ||
          "Platform conversation",
        time: formatActivityDate(chat.updatedAt || chat.createdAt),
        color: "bg-purple-500",
        timestamp: toTimestamp(chat.updatedAt || chat.createdAt),
      })),
    ]
      .sort((left, right) => right.timestamp - left.timestamp)
      .slice(0, 5);

    const systemAlerts = [
      {
        icon: ShieldAlert,
        title: `${pendingReports} Reports Pending`,
        description: "Safety or abuse reports waiting for review",
        buttonText: "Review",
        buttonColor: "bg-red-500 hover:bg-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-100",
        color: "text-red-500",
      },
      {
        icon: Ban,
        title: `${blockedUsers} Blocked Accounts`,
        description: "Users currently restricted on the platform",
        buttonText: "Inspect",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-100",
        color: "text-orange-500",
      },
      {
        icon: Lock,
        title: `${lockedRentals.length} Locked Listings`,
        description: "Properties currently reserved by users",
        buttonText: "Monitor",
        buttonColor: "bg-yellow-500 hover:bg-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-100",
        color: "text-yellow-500",
      },
    ];

    const quickStats = [
      {
        label: "Active User Rate",
        value: `${users.length ? Math.round((activeUsers / users.length) * 100) : 0}%`,
        percentage: users.length ? (activeUsers / users.length) * 100 : 0,
        barColor: "bg-green-500",
      },
      {
        label: "Available Listings",
        value: `${rentals.length ? Math.round((availableRentals / rentals.length) * 100) : 0}%`,
        percentage: rentals.length ? (availableRentals / rentals.length) * 100 : 0,
        barColor: "bg-blue-500",
      },
      {
        label: "Resolved Reports",
        value: `${reports.length ? Math.round((resolvedReports / reports.length) * 100) : 0}%`,
        percentage: reports.length ? (resolvedReports / reports.length) * 100 : 0,
        barColor: "bg-purple-500",
      },
      {
        label: "Platform Coverage",
        value: `${Math.min(100, Math.round(((users.length + rentals.length + chats.length) / 10) || 0))}%`,
        percentage: Math.min(
          100,
          Math.round(((users.length + rentals.length + chats.length) / 10) || 0),
        ),
        barColor: "bg-emerald-500",
      },
    ];

    return {
      stats,
      userStats,
      recentActivity,
      systemAlerts,
      quickStats,
    };
  }, [chats, lockedRentals.length, rentals, reports, users]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Super Admin</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center text-gray-500">
            Loading dashboard data...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardData.stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                      <stat.icon size={20} className={stat.iconColor} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-green-500">
                      <TrendingUp size={14} />
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  User Statistics
                </h2>
                <div className="space-y-4">
                  {dashboardData.userStats.map((stat) => (
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
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={`${activity.text}-${index}`} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${activity.color}`}
                        />
                        {index !== dashboardData.recentActivity.length - 1 && (
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
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
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
                  {dashboardData.systemAlerts.map((alert) => (
                    <div
                      key={alert.title}
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
                  {dashboardData.quickStats.map((stat) => (
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Page;
