import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: (rentalId: string) => bookProperty(rentalId),
    onSuccess: (data) => {
      console.log("House Successfully Locked:", data);
    },
    onError: (error) => {
      console.error("Failed to lock house:", error);
    },
  });
};
