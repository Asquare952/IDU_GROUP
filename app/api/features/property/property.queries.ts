import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProperties,
  bookProperty,
  fetchLandlordListedProperties,
} from "./property.api";
import { LandlordListedProperties, Properties } from "./types";

export const useFetchProperties = () => {
  return useQuery<Properties, Error>({
    queryKey: ["properties"],
    queryFn: fetchProperties,
  });
};

export const useFetchLandlordListedProperties = () => {
  return useQuery<LandlordListedProperties, Error>({
    queryKey: ["landlord-listed-properties"],
    queryFn: fetchLandlordListedProperties,
  });
};

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
