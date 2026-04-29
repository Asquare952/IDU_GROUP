import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  rentalApi,
  Rental,
  CreateRentalPayload,
  UpdateRentalPayload,
  RentalSearchParams,
} from "./rental.api";

// ========================
// QUERIES (READ OPERATIONS)
// ========================

export const useGetAllRentals = (
  options?: Omit<UseQueryOptions<Rental[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<Rental[], Error>({
    queryKey: ["rentals", "all"],
    queryFn: () => rentalApi.getAllRentals({ skipAuthRedirect: true }),
    ...options,
  });
};

export const useSearchRentals = (
  params: RentalSearchParams,
  options?: Omit<UseQueryOptions<Rental[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<Rental[], Error>({
    queryKey: ["rentals", "search", params],
    queryFn: () => rentalApi.searchRentals(params, { skipAuthRedirect: true }),
    enabled: !!(params.location || (params.lat && params.lng)),
    ...options,
  });
};

export const useGetRentalById = (
  id: string | null | undefined,
  options?: Omit<UseQueryOptions<Rental, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<Rental, Error>({
    queryKey: ["rentals", id],
    queryFn: () => rentalApi.getRentalById(id!),
    enabled: !!id,
    ...options,
  });
};

// ========================
// MUTATIONS (WRITE OPERATIONS)
// ========================

export const useCreateRental = (
  options?: Omit<
    UseMutationOptions<Rental, Error, CreateRentalPayload>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<Rental, Error, CreateRentalPayload>({
    mutationFn: rentalApi.createRental,
    onSuccess: (newRental) => {
      // Invalidate all rental queries to refetch
      queryClient.invalidateQueries({
        queryKey: ["rentals"],
      });
    },
    ...options,
  });
};

export const useUpdateRental = (
  id: string,
  options?: Omit<
    UseMutationOptions<Rental, Error, UpdateRentalPayload>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<Rental, Error, UpdateRentalPayload>({
    mutationFn: (payload) => rentalApi.updateRental(id, payload),
    onSuccess: (updatedRental) => {
      // Update cache for specific rental
      queryClient.setQueryData(["rentals", id], updatedRental);

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["rentals"],
      });
    },
    ...options,
  });
};

export const useDeleteRental = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: rentalApi.deleteRental,
    onSuccess: () => {
      // Invalidate all rental queries
      queryClient.invalidateQueries({
        queryKey: ["rentals"],
      });
    },
    ...options,
  });
};
