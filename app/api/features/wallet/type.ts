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
