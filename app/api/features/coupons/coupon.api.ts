import api from "../../axios";

export type CouponBonusType = "fixed" | "percent";

export interface CreateCouponPayload {
  code: string;
  description?: string;
  bonus_type: CouponBonusType;
  bonus_value: number;
  base_amount?: number;
  max_bonus?: number;
  max_uses?: number | null;
  max_uses_per_user?: number;
  starts_at?: string;
  expires_at?: string;
  is_active?: boolean;
}

export interface CreatedCoupon {
  id: string;
  code: string;
  description: string | null;
  bonus_type: CouponBonusType;
  bonus_value: string;
  base_amount: string | null;
  max_bonus: string | null;
  max_uses: number | null;
  max_uses_per_user: number;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_by: string | null;
  redemption_count: number;
  remaining_uses: number | null;
}

export interface CreateCouponResponse {
  success: boolean;
  message: string;
  coupon: CreatedCoupon;
}

export interface CouponRedemption {
  id: string;
  user_id: string;
  amount: string;
  tx_ref: string;
  createdAt: string;
  User: { id: string; full_name: string; email: string };
}

export type ManagedCoupon = Pick<
  CreatedCoupon,
  | "id"
  | "code"
  | "bonus_type"
  | "bonus_value"
  | "max_uses"
  | "max_uses_per_user"
  | "used_count"
  | "is_active"
  | "redemption_count"
  | "remaining_uses"
> &
  Partial<
    Pick<
      CreatedCoupon,
      | "description"
      | "base_amount"
      | "max_bonus"
      | "starts_at"
      | "expires_at"
      | "created_by"
    >
  > & { redemptions?: CouponRedemption[] };

export type CouponFilters = { active?: boolean; code?: string };
export type CouponListResponse = { success: boolean; data: ManagedCoupon[] };
export type CouponDetailsResponse = { success: boolean; data: ManagedCoupon };
export type UpdateCouponPayload = Partial<Omit<CreateCouponPayload, "code">>;
export type UpdateCouponResponse = {
  success: boolean;
  message: string;
  coupon: Partial<ManagedCoupon> & { id: string };
};
export type DeleteCouponResponse = { success: boolean; message: string };

export const createCoupon = async (
  payload: CreateCouponPayload,
): Promise<CreateCouponResponse> => {
  const { data } = await api.post<CreateCouponResponse>(
    "/admin/coupons",
    payload,
  );
  return data;
};

export const getCoupons = async (
  filters: CouponFilters = {},
): Promise<CouponListResponse> => {
  const { data } = await api.get<CouponListResponse>("/admin/coupons", {
    params: filters,
  });
  return data;
};

export const getCouponDetails = async (
  id: string,
): Promise<CouponDetailsResponse> => {
  const { data } = await api.get<CouponDetailsResponse>(
    `/admin/coupons/${encodeURIComponent(id)}`,
  );
  return data;
};

export const updateCoupon = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCouponPayload;
}): Promise<UpdateCouponResponse> => {
  const { data } = await api.patch<UpdateCouponResponse>(
    `/admin/coupons/${encodeURIComponent(id)}`,
    payload,
  );
  return data;
};

export const deleteCoupon = async (
  id: string,
): Promise<DeleteCouponResponse> => {
  const { data } = await api.delete<DeleteCouponResponse>(
    `/admin/coupons/${encodeURIComponent(id)}`,
  );
  return data;
};
