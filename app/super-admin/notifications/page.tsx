"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import NotificationItem from "@/app/components/shared/NotificationItems";
import {
  useDeleteNotification,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/app/api/features/notification";
import {
  formatNotificationTime,
  getNotificationType,
} from "@/app/components/shared/notification-helpers";

export default function SuperAdminNotificationsPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 flex items-center gap-4">
            <div className="rounded-full bg-green-50 p-3">
              <Bell size={28} className="text-[#43A047]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#162B4C]">
                Notifications
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Platform alerts and updates for your admin account.
              </p>
            </div>
          </header>

          <button
            type="button"
            onClick={() => markAllAsRead.mutate(notifications)}
            disabled={
              unreadCount === 0 ||
              markAllAsRead.isPending ||
              !isHydrated ||
              isLoading ||
              isError
            }
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#43A047] px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check size={18} />
            {markAllAsRead.isPending ? "Updating..." : "Mark all as read"}
          </button>

          {!isHydrated || isLoading ? (
            <div className="space-y-4" aria-label="Loading notifications">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">
              <p>Unable to load notification history.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 font-semibold text-[#43A047] underline"
              >
                Retry
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
              You have no notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                type={getNotificationType(notification)}
                message={notification.message}
                time={formatNotificationTime(notification.createdAt)}
                isRead={notification.isRead}
                accentColor="#43A047"
                onMarkAsRead={
                  notification.isRead
                    ? undefined
                    : () => markAsRead.mutate(notification.id)
                }
                onDelete={() => deleteNotification.mutate(notification.id)}
                isMarkingAsRead={
                  markAsRead.isPending &&
                  markAsRead.variables === notification.id
                }
                isDeleting={
                  deleteNotification.isPending &&
                  deleteNotification.variables === notification.id
                }
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
