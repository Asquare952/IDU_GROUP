import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProperties,
  bookProperty,
  fetchPropertyBySlug,
  searchProperties,
} from "./property.api";
import { Properties, Property } from "./types";
import type { RentalSearchParams } from "../rental";

export const useFetchProperties = () => {
  return useQuery<Properties, Error>({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });
};

export const useSearchProperties = (params: RentalSearchParams) => {
  return useQuery<Properties, Error>({
    queryKey: ["properties", "search", params],
    queryFn: () => searchProperties(params),
    enabled: !!(
      params.location ||
      (params.lat !== undefined && params.lng !== undefined)
    ),
  });
};

export const useFetchPropertyBySlug = (slug: string | null | undefined) => {
  return useQuery<Property, Error>({
    queryKey: ["properties", slug],
    queryFn: () => fetchPropertyBySlug(slug!),
    enabled: !!slug,
  });
};

export const useFetchPropertyById = useFetchPropertyBySlug;

export const useBookProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rentalId: string) => bookProperty(rentalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({
        queryKey: ["landlord-listed-properties"],
      });
    },
  });
};
