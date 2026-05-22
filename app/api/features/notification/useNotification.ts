import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "./notification.api";
import { Notification } from "./types";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const getAccessToken = () => Cookies.get("ACCESS_TOKEN") || "";

const getNotificationScope = () => {
  const role = Cookies.get("USER_ROLE") || "anonymous";
  const token = getAccessToken() || "guest";

  return `${role}:${token.slice(-12)}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data;

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }

  return fallback;
};

export const notificationQueryKeys = {
  all: (scope: string) => ["notifications", scope] as const,
  count: (scope: string) => ["notification-count", scope] as const,
};

export const useNotifications = () => {
  const scope = getNotificationScope();
  const hasToken = Boolean(getAccessToken());

  return useQuery({
    queryKey: notificationQueryKeys.all(scope),
    queryFn: notificationApi.getNotifications,
    enabled: hasToken,
    refetchInterval: 20000,
  });
};

export const useNotificationCount = () => {
  const scope = getNotificationScope();
  const hasToken = Boolean(getAccessToken());

  return useQuery({
    queryKey: notificationQueryKeys.count(scope),
    queryFn: notificationApi.getUnreadCount,
    enabled: hasToken,
    refetchInterval: 20000,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const scope = getNotificationScope();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.all(scope),
        }),
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.count(scope),
        }),
      ]);
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "Failed to mark notification as read"),
      );
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const scope = getNotificationScope();

  return useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.all(scope),
        }),
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.count(scope),
        }),
      ]);
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "Failed to delete notification"),
      );
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const scope = getNotificationScope();

  return useMutation({
    mutationFn: async (notifications: Notification[]) => {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead,
      );

      await Promise.all(
        unreadNotifications.map((notification) =>
          notificationApi.markAsRead(notification.id),
        ),
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.all(scope),
        }),
        queryClient.invalidateQueries({
          queryKey: notificationQueryKeys.count(scope),
        }),
      ]);
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "Failed to mark notifications as read"),
      );
    },
  });
};
