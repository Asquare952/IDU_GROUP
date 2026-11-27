import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookShortlet,
  cancelShortletBooking,
  createShortlet,
  deleteAdminShortlet,
  deleteShortlet,
  fetchAdminShortlets,
  fetchHostShortletBookings,
  fetchHostShortletInspections,
  fetchHostShortletReviews,
  fetchShortletById,
  fetchShortletAvailability,
  fetchShortletBookings,
  fetchShortletCancellationPreview,
  fetchShortletReviews,
  fetchPendingShortletReviews,
  fetchShortletQuote,
  fetchShortlets,
  respondToShortletReview,
  submitShortletReview,
  updateShortlet,
  submitShortletInspection,
} from "./shortlet.api";
import type {
  CreateShortletPayload,
  CancelShortletBookingPayload,
  CancelShortletBookingResponse,
  ShortletCancellationPreview,
  ShortletGuestBooking,
  ShortletHostReviewFilters,
  ShortletInspectionPayload,
  ShortletInspectionResponse,
  ShortletBookingPayload,
  ShortletBookingResponse,
  ShortletAvailability,
  ShortletQuote,
  UpdateShortletPayload,
} from "./shortlet.api";
import { isAxiosError } from "axios";
import type { WalletResponse } from "../wallet/type";

export const useCreateShortlet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShortletPayload) => createShortlet(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shortlets"] });
    },
  });
};

export const useFetchShortlets = (recentOnly = true) =>
  useQuery({
    queryKey: ["shortlets", recentOnly ? "recent" : "all"],
    queryFn: () => fetchShortlets(recentOnly),
  });

export const useFetchAdminShortlets = () =>
  useQuery({
    queryKey: ["admin", "shortlets"],
    queryFn: fetchAdminShortlets,
  });

export const useFetchShortletById = (
  identifier: string | null | undefined,
  enabled = true,
) =>
  useQuery({
    queryKey: ["shortlet", identifier],
    queryFn: () => fetchShortletById(identifier!),
    enabled: Boolean(identifier) && enabled,
  });

export const useShortletAvailability = (
  identifier: string | null | undefined,
  enabled = true,
) =>
  useQuery<ShortletAvailability>({
    queryKey: ["shortlet-availability", identifier],
    queryFn: () => fetchShortletAvailability(identifier!),
    enabled: Boolean(identifier) && enabled,
  });

export const useShortletQuote = (
  identifier: string | null | undefined,
  params: { checkIn: string; checkOut: string; guests: number } | null,
  enabled = true,
) =>
  useQuery<ShortletQuote>({
    queryKey: ["shortlet-quote", identifier, params],
    queryFn: () => fetchShortletQuote(identifier!, params!),
    enabled: Boolean(identifier && params) && enabled,
    retry: false,
  });

export const useBookShortlet = () => {
  const queryClient = useQueryClient();

  return useMutation<ShortletBookingResponse, Error, ShortletBookingPayload>({
    mutationFn: bookShortlet,
    onSuccess: async (response, payload) => {
      queryClient.setQueryData<WalletResponse>(["wallet"], (current) =>
        current
          ? {
              ...current,
              data: { ...current.data, balance: response.walletBalance },
            }
          : current,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wallet"] }),
        queryClient.invalidateQueries({
          queryKey: ["wallet-transactions"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["shortlet-availability", payload.shortlet_id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["shortlet-quote", payload.shortlet_id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["shortlet-bookings"],
        }),
      ]);
    },
    onError: async (error, payload) => {
      if (
        isAxiosError<{ code?: unknown }>(error) &&
        error.response?.data?.code === "DATES_UNAVAILABLE"
      ) {
        await queryClient.invalidateQueries({
          queryKey: ["shortlet-availability", payload.shortlet_id],
        });
        await queryClient.invalidateQueries({
          queryKey: ["shortlet-quote", payload.shortlet_id],
        });
      }
    },
  });
};

export const useShortletBookings = () =>
  useQuery<ShortletGuestBooking[]>({
    queryKey: ["shortlet-bookings"],
    queryFn: fetchShortletBookings,
  });

export const useShortletReviews = (
  identifier: string | null | undefined,
  params: { limit?: number; offset?: number } = { limit: 50, offset: 0 },
  enabled = true,
) =>
  useQuery({
    queryKey: ["shortlet-reviews", identifier, params],
    queryFn: () => fetchShortletReviews(identifier!, params),
    enabled: Boolean(identifier) && enabled,
  });

export const usePendingShortletReviews = () =>
  useQuery({
    queryKey: ["shortlet-pending-reviews"],
    queryFn: fetchPendingShortletReviews,
  });

export const useSubmitShortletReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitShortletReview,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["shortlet-pending-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlet-bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlet-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlet"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlets"] }),
      ]);
    },
  });
};

export const useHostShortletReviews = (
  filters: ShortletHostReviewFilters = {},
) =>
  useQuery({
    queryKey: ["host-shortlet-reviews", filters],
    queryFn: () => fetchHostShortletReviews(filters),
  });

export const useRespondToShortletReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: respondToShortletReview,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["host-shortlet-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlet-reviews"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlet"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlets"] }),
      ]);
    },
  });
};

export const useHostShortletBookings = (
  status?: "confirmed" | "cancelled" | "completed",
) =>
  useQuery<ShortletGuestBooking[]>({
    queryKey: ["host-shortlet-bookings", status ?? "all"],
    queryFn: () => fetchHostShortletBookings(status),
  });

export const useHostShortletInspections = () =>
  useQuery<ShortletGuestBooking[]>({
    queryKey: ["host-shortlet-inspections"],
    queryFn: fetchHostShortletInspections,
  });

export const useSubmitShortletInspection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ShortletInspectionResponse,
    Error,
    ShortletInspectionPayload
  >({
    mutationFn: submitShortletInspection,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["host-shortlet-inspections"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["host-shortlet-bookings"],
        }),
        queryClient.invalidateQueries({ queryKey: ["wallet"] }),
        queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] }),
      ]);
    },
  });
};

export const useShortletCancellationPreview = (
  bookingId: string | null,
  checkOutDate?: string,
) =>
  useQuery<ShortletCancellationPreview>({
    queryKey: ["shortlet-booking-cancellation", bookingId, checkOutDate],
    queryFn: () => fetchShortletCancellationPreview(bookingId!, checkOutDate),
    enabled: Boolean(bookingId),
    retry: false,
  });

export const useCancelShortletBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CancelShortletBookingResponse,
    Error,
    CancelShortletBookingPayload
  >({
    mutationFn: cancelShortletBooking,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["shortlet-bookings"] }),
        queryClient.invalidateQueries({
          queryKey: ["host-shortlet-bookings"],
        }),
        queryClient.invalidateQueries({ queryKey: ["progress", "booked"] }),
        queryClient.invalidateQueries({ queryKey: ["wallet"] }),
        queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] }),
      ]);
    },
  });
};

export const useUpdateShortlet = (identifier: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateShortletPayload) =>
      updateShortlet(identifier, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["shortlet", identifier] }),
        queryClient.invalidateQueries({ queryKey: ["shortlets"] }),
      ]);
    },
  });
};

export const useDeleteShortlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (identifier: string) => deleteShortlet(identifier),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shortlets"] });
    },
  });
};

export const useDeleteAdminShortlet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (identifier: string) => deleteAdminShortlet(identifier),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "shortlets"] }),
        queryClient.invalidateQueries({ queryKey: ["shortlets"] }),
      ]);
    },
  });
};
