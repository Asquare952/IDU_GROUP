import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "./progress.api";
import type { Rental } from "../rental";
import type {
  LockPaymentInitializePayload,
  LockPaymentInitializeResponse,
  LockPaymentVerifyResponse,
  RentPaymentInitializePayload,
  RentPaymentInitializeResponse,
  RentPaymentVerifyResponse,
} from "./types";

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
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useInitializeLockPayment = () => {
  return useMutation<
    LockPaymentInitializeResponse,
    Error,
    LockPaymentInitializePayload
  >({
    mutationFn: progressApi.initializeLockPayment,
  });
};

export const useVerifyLockPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<LockPaymentVerifyResponse, Error, string>({
    mutationFn: progressApi.verifyLockPayment,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// rent rental
export const useRentRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.rentRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

export const useInitializeRentPayment = () => {
  return useMutation<
    RentPaymentInitializeResponse,
    Error,
    RentPaymentInitializePayload
  >({
    mutationFn: progressApi.initializeRentPayment,
  });
};

export const useVerifyRentPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<RentPaymentVerifyResponse, Error, string>({
    mutationFn: progressApi.verifyRentPayment,
    onSuccess: () => invalidateProgressQueries(queryClient),
  });
};

// book rental
export const useBookRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: progressApi.bookRental,
    onSuccess: () => invalidateProgressQueries(queryClient),
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
