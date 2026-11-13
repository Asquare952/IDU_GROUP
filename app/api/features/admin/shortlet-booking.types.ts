export type AdminShortletBookingStatus =
  | "confirmed"
  | "completed"
  | "cancelled";

export type AdminShortletDepositStatus =
  | "none"
  | "held"
  | "claimed"
  | "refunded"
  | "settled";

export type AdminShortletBookingFilters = {
  status?: AdminShortletBookingStatus;
  deposit_status?: AdminShortletDepositStatus;
  shortlet_id?: string;
  guest_id?: string;
  host_id?: string;
  limit: number;
  offset: number;
};

export type AdminMoneyValue = string | number;

export type AdminShortletDepositClaim = {
  canResolve?: boolean;
  deposit_claim_amount?: AdminMoneyValue | null;
  deposit_claim_reason?: string | null;
  deposit_claim_photos?: unknown;
  deposit_claimed_at?: string | null;
  security_deposit?: AdminMoneyValue | null;
  deposit_claim_decision?: string | null;
  deposit_claim_note?: string | null;
  deposit_paid_to_host?: AdminMoneyValue | null;
  paidToHost?: AdminMoneyValue | null;
  refundedToGuest?: AdminMoneyValue | null;
};

export type AdminShortletBooking = {
  id?: string;
  booking_id?: string;
  status?: string | null;
  deposit_status?: string | null;
  platform_fee?: AdminMoneyValue | null;
  shortlet?: unknown;
  guest?: unknown;
  host?: unknown;
  depositClaim?: AdminShortletDepositClaim | null;
};

export type AdminShortletBookingsResponse = {
  success: boolean;
  count: number;
  total: number;
  data: AdminShortletBooking[];
  message?: string;
};

export type AdminShortletBookingDetailResponse = {
  success?: boolean;
  data?: AdminShortletBooking;
  message?: string;
};

export type AdminDepositClaim = AdminShortletDepositClaim & {
  booking_id?: string;
};

export type AdminDepositClaimsResponse = {
  success?: boolean;
  count?: number;
  data: AdminDepositClaim[];
  message?: string;
};

export type ResolveAdminDepositClaimPayload = {
  decision: "approve" | "reject";
  amount?: number;
  note?: string;
};

export type ResolveAdminDepositClaimResponse = {
  success?: boolean;
  message?: string;
  data?: {
    paidToHost?: AdminMoneyValue | null;
    refundedToGuest?: AdminMoneyValue | null;
    depositClaim?: AdminShortletDepositClaim | null;
  };
  paidToHost?: AdminMoneyValue | null;
  refundedToGuest?: AdminMoneyValue | null;
};
