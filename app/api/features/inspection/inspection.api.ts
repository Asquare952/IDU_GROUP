import api from "../../axios";

import { CreateInspection, Inspections, UpdateInspection, InspectionResponse } from "./types";

// Book inspection
export const bookInspection = async (payload: CreateInspection) => {
  const { data } = await api.post("/inspection/create", payload);

  return data;
};

// Get inspections
export const getInspections = async (): Promise<Inspections[]> => {
  const res = await api.get<InspectionResponse>("/inspection/all");

  return res.data.data;
};

// Get single inspection detials
export const getInspection = async (id: string): Promise<Inspections> => {
  const res = await api.get(`/inspection/${id}`);

  return res.data;
};

// Update inspection
export const updateInspection = async (
  payload: UpdateInspection,
  id: string,
) => {
  const res = await api.put(`/inspection/update/${id}`, payload);

  return res.data;
};
