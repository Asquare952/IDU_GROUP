import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "./progress.api";
import type { Rental } from "../rental";
import { toast } from "react-toastify";
import { success } from "zod";

const progressQueryKeys = {
  liked: ["progress", "liked"] as const,
  locked: ["progress", "locked"] as const,
  booked: ["progress", "booked"] as const,
};

const invalidateProgressQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: progressQueryKeys.liked });
  queryClient.invalidateQueries({ queryKey: progressQueryKeys.locked });
  queryClient.invalidateQueries({ queryKey: progressQueryKeys.booked });
};

// Queries

// like rental
export const useLikeRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.likeRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// lock rental
export const useLockRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.lockRental,
    onSuccess: (success: any) => {
      invalidateProgressQueries(queryClient);
      const successMessage =
        success?.response?.data?.message || "Apartment locked successfully!";
      toast.success(successMessage);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while locking the apartment.";
      toast.error(errorMessage);
    },
  });
};

// rent rental
export const useRentRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.rentRental,
    onSuccess: (success: any) => {
      invalidateProgressQueries(queryClient);
      const successMessage =
        success?.response?.data?.message || "Apartment rented successfully!";
      toast.success(successMessage);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while renting the apartment.";
      toast.error(errorMessage);
    },
  });
};

// book rental
export const useBookRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.bookRental,
    onSuccess: () => {
      invalidateProgressQueries(queryClient);
      toast.success("Apartment booked successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "An error occurred while booking the apartment.";
      toast.error(errorMessage);
    },
  });
};

// unlike rental
export const useUnlikeRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.unlikeRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// unlock rental
export const useUnlockRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.unlockRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// unbook rental
export const useUnbookRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.unbookRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// get liked rentals for the current user
export const useLikedRentals = () =>
  useQuery<Rental[]>({
    queryKey: progressQueryKeys.liked,
    queryFn: progressApi.getLikedRentals,
  });

// get locked rental for the current user
export const useLockedRentals = () =>
  useQuery<Rental[]>({
    queryKey: progressQueryKeys.locked,
    queryFn: progressApi.getLockedRentals,
  });

// get booked rental for the current user
export const useBookedRentals = () =>
  useQuery<Rental[]>({
    queryKey: progressQueryKeys.booked,
    queryFn: progressApi.getBookedRentals,
  });

// clear liked rentals
export const useClearLikedRentals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.clearLikedRentals,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// clear locked rentals
export const useClearLockedRentals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.clearLockedRentals,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// clear booked rentals
export const useClearBookedRentals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.clearBookedRentals,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};
