import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useMarkAllNotificationsAsRead,
  useNotificationCount,
  useNotifications,
} from "@/app/api/features/notification";
import { formatNotificationTime } from "@/app/components/shared/notification-helpers";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { data: notificationCount, isLoading: isCountLoading } =
    useNotificationCount();
  const {
    data: notifications = [],
    isLoading: isNotificationsLoading,
    isError: hasNotificationsError,
  } = useNotifications();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount =
    !isNotificationsLoading && !hasNotificationsError
      ? notifications.filter((notification) => !notification.isRead).length
      : (notificationCount?.count ?? 0);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#162B4C] transition-colors hover:bg-slate-50 hover:text-[#43A047]"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell size={24} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF4343] px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
        {isCountLoading ? (
          <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 animate-pulse rounded-full bg-[#43A047]" />
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+12px)] z-[120] w-[320px] overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-bold text-[#162B4C]">Notifications</h3>
            <button
              type="button"
              onClick={() => markAllAsRead.mutate(notifications)}
              disabled={
                unreadCount === 0 ||
                notifications.length === 0 ||
                markAllAsRead.isPending
              }
              className="text-xs font-semibold text-[#43A047] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {markAllAsRead.isPending ? "Updating..." : "Mark all read"}
            </button>
          </div>

          <div className="bg-slate-50/60 px-4 py-4">
            {isNotificationsLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="max-h-[300px] space-y-3 overflow-y-auto">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className="space-y-1.5 rounded-lg border border-slate-100 bg-white p-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold leading-snug text-[#162B4C]">
                          {notification.title ||
                            notification.message ||
                            "New notification"}
                        </h4>
                        <p className="text-xs leading-5 text-slate-600">
                          {notification.message ||
                            "No extra details available."}
                        </p>
                      </div>
                      {!notification.isRead ? (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#43A047]" />
                      ) : null}
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                You have no notifications yet.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationBell;
