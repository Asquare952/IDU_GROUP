import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  bookInspection,
  getInspection,
  getInspections,
  updateInspection,
} from "./inspection.api";
import { CreateInspection, Inspections, UpdateInspection } from "./types";

// =========================
// MUTATIONS
//  ========================

// Book inspection
export const useBookInspection = () => {
  return useMutation<unknown, Error, CreateInspection>({
    mutationFn: bookInspection,
    onSuccess: () => {
      toast.success("Inspection scheduled successfully");
    },
  });
};

export const useUpdateInspection = (id: string) => {
  return useMutation<Inspections, Error, UpdateInspection>({
    mutationFn: (payload) => updateInspection(payload, id),
    onSuccess: () => {
      toast.success("Inspection re-scheduled successfully");
    },
  });
};

// =====================
// QUERIES
// =====================

// Get all booked inspections
export const useGetInspections = () => {
  return useQuery<Inspections[], Error>({
    queryKey: ["inspections"],
    queryFn: () => getInspections(),
  });
};


// Get single booked inspection by id
export const useGetInspection = (id: string) => {
  return useQuery<Inspections, Error>({
    queryKey: ["inspection", id],
    queryFn: () => getInspection(id!),
  });
};
