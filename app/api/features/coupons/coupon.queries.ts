import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCoupon,
  deleteCoupon,
  getCouponDetails,
  getCoupons,
  updateCoupon,
} from "./coupon.api";
import type { CouponFilters, CreateCouponPayload } from "./coupon.api";

const couponKeys = {
  all: ["admin", "coupons"] as const,
  list: (filters: CouponFilters) => ["admin", "coupons", filters] as const,
  details: (id: string) => ["admin", "coupons", "details", id] as const,
};

export const useCoupons = (filters: CouponFilters = {}) =>
  useQuery({
    queryKey: couponKeys.list(filters),
    queryFn: () => getCoupons(filters),
  });

export const useCouponDetails = (id: string | null) =>
  useQuery({
    queryKey: couponKeys.details(id ?? ""),
    queryFn: () => getCouponDetails(id!),
    enabled: Boolean(id),
  });

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => createCoupon(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: couponKeys.all }),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCoupon,
    onSuccess: async (_response, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: couponKeys.all }),
        queryClient.invalidateQueries({ queryKey: couponKeys.details(id) }),
      ]);
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: async (_response, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: couponKeys.all }),
        queryClient.removeQueries({ queryKey: couponKeys.details(id) }),
      ]);
    },
  });
};
