import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShortlet,
  deleteAdminShortlet,
  deleteShortlet,
  fetchAdminShortlets,
  fetchShortletById,
  fetchShortlets,
  updateShortlet,
} from "./shortlet.api";
import type {
  CreateShortletPayload,
  UpdateShortletPayload,
} from "./shortlet.api";

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
