"use client";
import React from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import NotificationItem from "@/app/components/shared/NotificationItems";
import { Bell, Check } from "lucide-react";
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

const page = () => {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  );

  return (
    <DashboardLayout>
      <div className="p-10 bg-[#FBFBFC] min-h-screen">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-50 rounded-full">
              <Bell size={40} className="text-[#43A047]" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#162B4C] mb-2">
            Notifications
          </h2>
          <p className="text-slate-500 text-sm">
            Stay updated on your rental applications and payment reminders.
          </p>
        </div>
        <div className="max-w-2xl mx-auto mb-8">
          <button
            type="button"
            onClick={() => markAllAsRead.mutate(notifications)}
            disabled={
              unreadNotifications.length === 0 ||
              notifications.length === 0 ||
              markAllAsRead.isPending
            }
            className="w-full bg-[#43A047] hover:bg-green-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-green-300"
          >
            <Check size={20} />{" "}
            {markAllAsRead.isPending ? "Updating..." : "Mark all as read"}
          </button>
        </div>
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-3xl bg-white shadow-sm"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
              Unable to load your notifications right now.
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">
              You have no notifications yet.
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
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
};

export default page;
