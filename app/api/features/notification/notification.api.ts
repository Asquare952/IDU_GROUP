import api from "../../axios";
import { Notification, NotificationCount } from "./types";

export const notificationApi = {
  // GET `/notification/`
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get("/notification/");
    return response.data;
  },

  // GET `/notification/count`
  getUnreadCount: async (): Promise<NotificationCount> => {
    const response = await api.get("/notification/count");
    return response.data;
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
