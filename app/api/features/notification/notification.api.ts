import api from "../../axios";
import {
  Notification,
  NotificationCount,
  NotificationCountResponse,
  NotificationListResponse,
} from "./types";
import {
  normalizeNotificationCount,
  normalizeNotifications,
} from "./notification.utils";

export const notificationApi = {
  // GET `/notification/`
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get<NotificationListResponse>("/notification/");
    return normalizeNotifications(response.data);
  },

  // GET `/notification/count`
  getUnreadCount: async (): Promise<NotificationCount> => {
    const response = await api.get<NotificationCountResponse>(
      "/notification/count",
    );
    return normalizeNotificationCount(response.data);
  },

  // PUT `/notification/read`
  markAsRead: async (id: string): Promise<void> => {
    await api.put("/notification/read", { id });
  },

  // DELETE `/notification/delete`
  deleteNotification: async (id: string): Promise<void> => {
    await api.delete("/notification/delete", { data: { id } });
  },
};
