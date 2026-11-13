import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookShortlet,
  createShortlet,
  deleteAdminShortlet,
  deleteShortlet,
  fetchAdminShortlets,
  fetchShortletById,
  fetchShortletAvailability,
  fetchShortletQuote,
  fetchShortlets,
  updateShortlet,
} from "./shortlet.api";
import type {
  CreateShortletPayload,
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

  return useMutation<
    ShortletBookingResponse,
    Error,
    ShortletBookingPayload
  >({
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
