// Transaction Types
export type PaymentType =
  | "topup"
  | "withdrawal"
  | "transfer"
  | "lock"
  | "rent"
  | "inspection"
  | "refund"
  | (string & {});
export type TransactionStatus = "completed" | "success" | "pending" | "failed";

export interface TransactionUser {
  id: string;
  full_name: string;
  email: string;
  accountNumber?: string;
  walletBalance?: string;
}

export interface Transaction {
  id: string;
  source: "rent" | "wallet";
  user_id: string;
  amount: number;
  payment_type: PaymentType;
  status: TransactionStatus;
  reference: string;
  narration?: string;
  createdAt: string;
  User?: TransactionUser;
  Rental?: unknown | null;
}

export interface TransactionStats {
  totalToday: number;
  completed: number;
  pending: number;
  failed: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request/Response Types
export interface GetTransactionsFilters {
  status?: TransactionStatus;
  method?: PaymentType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionStatsResponse {
  success: boolean;
  message: string;
  data: TransactionStats;
}

export interface TransactionListResponse {
  success: boolean;
  message: string;
  data: Transaction[];
  pagination: PaginationMeta;
}

export interface TransactionDetailResponse {
  success: boolean;
  message: string;
  data: Transaction;
}
