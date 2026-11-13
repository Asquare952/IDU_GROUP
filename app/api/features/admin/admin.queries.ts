import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  checkAuthStatus,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  verifyAdminOTP,
  fileReport,
} from "./admin.api";
import type { AdminReportStatus, HostDebtStatus } from "./types";
import type {
  AdminShortletBookingFilters,
  AdminShortletDepositStatus,
} from "./shortlet-booking.types";

const adminQueryKeys = {
  users: ["admin", "users"] as const,
  rentals: ["admin", "rentals"] as const,
  lockedRentals: ["admin", "rentals", "locked"] as const,
  reports: ["admin", "reports"] as const,
  chats: ["admin", "chats"] as const,
  chatMessages: (id: string) => ["admin", "chats", id, "messages"] as const,
  analytics: ["admin", "analytics"] as const,
  hostDebts: (status: HostDebtStatus) =>
    ["admin", "host-debts", status] as const,
  shortletBookings: (filters: AdminShortletBookingFilters) =>
    ["admin", "shortlet-bookings", filters] as const,
  shortletBooking: (bookingId: string) =>
    ["admin", "shortlet-booking", bookingId] as const,
  depositClaims: (status: "open" | "resolved" | "all") =>
    ["admin", "shortlet-deposit-claims", status] as const,
};

const invalidateAdminQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
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

export const useAdminHostDebts = (status: HostDebtStatus) =>
  useQuery({
    queryKey: adminQueryKeys.hostDebts(status),
    queryFn: () => adminApi.getHostDebts(status),
  });

export const useAdminShortletBookings = (
  filters: AdminShortletBookingFilters,
) =>
  useQuery({
    queryKey: adminQueryKeys.shortletBookings(filters),
    queryFn: () => adminApi.getShortletBookings(filters),
  });

export const useAdminShortletBooking = (
  bookingId: string | null,
  enabled = true,
) =>
  useQuery({
    queryKey: adminQueryKeys.shortletBooking(bookingId ?? ""),
    queryFn: () => adminApi.getShortletBooking(bookingId!),
    enabled: Boolean(bookingId) && enabled,
  });

export const useAdminDepositClaims = (status: "open" | "resolved" | "all") =>
  useQuery({
    queryKey: adminQueryKeys.depositClaims(status),
    queryFn: () => adminApi.getDepositClaims(status),
  });

export const useResolveAdminDepositClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.resolveDepositClaim,
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin", "shortlet-bookings"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin", "shortlet-booking", variables.bookingId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["admin", "shortlet-deposit-claims"],
        }),
      ]);
    },
  });
};

export const useToggleAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.toggleUserStatus,
    onSuccess: () => invalidateAdminQueries(queryClient),
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.suspendUser,
    onSuccess: () => invalidateAdminQueries(queryClient),
  });
};

export const useUnsuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.unsuspendUser,
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

export const useSetShortletCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.setShortletCommission,
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

export const useAdminAnalytics = () =>
  useQuery({
    queryKey: adminQueryKeys.analytics,
    queryFn: adminApi.getAnalytics,
  });

// ==================== AUTH QUERIES ====================
const authQueryKeys = {
  me: ["auth", "me"] as const,
};

export const useAuthStatus = () =>
  useQuery({
    queryKey: authQueryKeys.me,
    queryFn: checkAuthStatus,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

export const useRegisterAdmin = () =>
  useMutation({
    mutationFn: registerAdmin,
  });

export const useVerifyAdminOTP = () =>
  useMutation({
    mutationFn: verifyAdminOTP,
  });

export const useLoginAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
};

export const useLogoutAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useFileReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fileReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.reports });
    },
  });
};
