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
  flw_ref: string;
  type: string;
  role: string | null;
  amount: string;
  status: string;
  narration: string;
  from_account_number: string;
  from_account_name: string;
  to_account_number: string;
  to_account_name: string;
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