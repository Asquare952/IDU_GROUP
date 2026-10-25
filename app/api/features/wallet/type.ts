export type Wallet = {
  accountName: string;
  accountNumber: string;
  balance: string;
  status: "ACTIVE" | "INACTIVE";
};

export type WalletResponse = {
  success: boolean;
  data: Wallet;
};

export type WalletTransaction = {
  id: string;
  tx_ref: string;
  flw_ref: string | null;
  type: string;
  role: string | null;
  amount: string;
  status: string;
  narration: string | null;
  from_account_number: string | null;
  from_account_name: string | null;
  to_account_number: string | null;
  to_account_name: string | null;
  createdAt: string;
};

export type WalletTransactionsResponse = {
  success: boolean;
  data: WalletTransaction[];
};

export type RedeemCouponPayload = {
  code: string;
};

export type CouponRedemptionResponse = {
  success: boolean;
  message: string;
  bonus: string;
  balance: string;
  tx_ref: string;
  transaction: {
    id: string;
    tx_ref: string;
    type: "bonus";
    amount: string;
    status: "success";
    narration: string;
    from_account_name: "RentULO Bonus";
    to_account_number: string;
    meta: {
      code: string;
      coupon_id: string;
      bonus_type: "fixed" | "percent";
      bonus_value: string;
      base_amount: string | null;
    };
  };
  coupon: {
    code: string;
    description: string | null;
  };
};

export type TopUpPayload = {
  amount: number;
};

export interface TopUpResponse {
  success: boolean;
  message: string;
  link: string;
  tx_ref: string;
}

export type WithdrawPayload = {
  amount: number;
  pin: string;
};

export interface WithdrawResponse {
  success: boolean;
  message: string;
  tx_ref: string;
  balance: string;
}

export type TransferPayload = {
  accountNumber: string;
  amount: number;
};

// FIX: /wallet/transfer returns { success, message, balance } — not a full Wallet object.
export interface TransferResponse {
  success: boolean;
  message: string;
  balance: string;
}

export type CreatePinPayload = {
  pin: string;
};

export interface CreatePinResponse {
  success: boolean;
  message: string;
}

export type PinUpdatePayload = {
  oldPin: string;
  newPin: string;
};

export interface PinUpdateResponse {
  success: boolean;
  message: string;
}
