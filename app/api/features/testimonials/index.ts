import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../axios";

// ---- Types ----
export interface Testimonial {
  id: string;
  rating: number;
  message: string;
  createdAt: string;
  updatedAt?: string;
  user?: {
    first_name?: string;
    last_name?: string;
    profileImage?: string;
    role?: string;
  } | null;
}

export interface TestimonialPayload {
  rating: number;
  message: string;
}

// ---- GET all testimonials (no auth) ----
export const useGetTestimonials = () =>
  useQuery({
    queryKey: ["testimonials"],
    queryFn: async (): Promise<Testimonial[]> => {
      const res = await api.get("/testimonials/");
      return res.data?.data ?? res.data ?? [];
    },
  });

// ---- GET my testimonial (auth - cookie handled by axios) ----
export const useGetMyTestimonial = () =>
  useQuery({
    queryKey: ["testimonials", "me"],
    queryFn: async (): Promise<Testimonial | null> => {
      try {
        const res = await api.get("/testimonials/me");
        return res.data?.data ?? res.data ?? null;
      } catch (err: any) {
        // 404 = user has no testimonial yet
        if (err.response?.status === 404) return null;
        // 401 = not logged in, also return null gracefully
        if (err.response?.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    // No staleTime so it refreshes when auth state changes
  });

// ---- POST new testimonial ----
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TestimonialPayload) => {
      const res = await api.post("/testimonials/", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials", "me"] });
    },
  });
};

// ---- PUT update testimonial ----
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<TestimonialPayload>) => {
      const res = await api.put("/testimonials/", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials", "me"] });
    },
  });
};

// ---- DELETE testimonial ----
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete("/testimonials/");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials", "me"] });
    },
  });
};
