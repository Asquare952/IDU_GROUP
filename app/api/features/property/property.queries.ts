import { useMutation } from "@tanstack/react-query";
import { bookProperty } from "./property.api";

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
