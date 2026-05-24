import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./admin.api";
import type { AdminReportStatus } from "./types";

const adminQueryKeys = {
  users: ["admin", "users"] as const,
  rentals: ["admin", "rentals"] as const,
  lockedRentals: ["admin", "rentals", "locked"] as const,
  reports: ["admin", "reports"] as const,
  chats: ["admin", "chats"] as const,
  chatMessages: (id: string) => ["admin", "chats", id, "messages"] as const,
};

const invalidateAdminQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.users });
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.rentals });
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.lockedRentals });
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.reports });
  queryClient.invalidateQueries({ queryKey: adminQueryKeys.chats });
};

export const useAdminUsers = () =>
  useQuery({
    queryKey: adminQueryKeys.users,
    queryFn: adminApi.getUsers,
  });

export const useToggleAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.toggleUserStatus,
    onSuccess: () => invalidateAdminQueries(queryClient),
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => invalidateAdminQueries(queryClient),
  });
};

export const useAdminRentals = () =>
  useQuery({
    queryKey: adminQueryKeys.rentals,
    queryFn: adminApi.getRentals,
  });

export const useDeleteAdminRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.deleteRental,
    onSuccess: () => invalidateAdminQueries(queryClient),
  });
};

export const useLockedAdminRentals = () =>
  useQuery({
    queryKey: adminQueryKeys.lockedRentals,
    queryFn: adminApi.getLockedRentals,
  });

export const useAdminReports = () =>
  useQuery({
    queryKey: adminQueryKeys.reports,
    queryFn: adminApi.getReports,
  });

export const useUpdateAdminReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminReportStatus }) =>
      adminApi.updateReportStatus(id, status),
    onSuccess: () => invalidateAdminQueries(queryClient),
  });
};

export const useAdminChats = () =>
  useQuery({
    queryKey: adminQueryKeys.chats,
    queryFn: adminApi.getChats,
  });

export const useAdminChatMessages = (id: string | null) =>
  useQuery({
    queryKey: adminQueryKeys.chatMessages(id ?? ""),
    queryFn: () => adminApi.getChatMessages(id!),
    enabled: Boolean(id),
  });
