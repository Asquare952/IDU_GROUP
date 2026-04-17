import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "./notification.api";

export const useNotificationCount = () => {
  return useQuery({
    queryKey: ["notification-count"],
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 20000,
  });
};
