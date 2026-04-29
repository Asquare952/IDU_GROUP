import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "./progress.api";
import type { Rental } from "../rental";

const progressQueryKeys = {
  liked: ["progress", "liked"] as const,
  locked: ["progress", "locked"] as const,
  booked: ["progress", "booked"] as const,
};

const invalidateProgressQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: progressQueryKeys.liked });
  queryClient.invalidateQueries({ queryKey: progressQueryKeys.locked });
  queryClient.invalidateQueries({ queryKey: progressQueryKeys.booked });
};

export const useLikedRentals = () =>
  useQuery<Rental[]>({
    queryKey: progressQueryKeys.liked,
    queryFn: progressApi.getLikedRentals,
  });

export const useLockedRentals = () =>
  useQuery<Rental[]>({
    queryKey: progressQueryKeys.locked,
    queryFn: progressApi.getLockedRentals,
  });

export const useBookedRentals = () =>
  useQuery<Rental[]>({
    queryKey: progressQueryKeys.booked,
    queryFn: progressApi.getBookedRentals,
  });

export const useLikeRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.likeRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useLockRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.lockRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useBookRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.bookRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useUnlikeRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.unlikeRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useUnlockRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.unlockRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useUnbookRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.unbookRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useClearLikedRentals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.clearLikedRentals,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useClearLockedRentals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.clearLockedRentals,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useClearBookedRentals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.clearBookedRentals,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};
