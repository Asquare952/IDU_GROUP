import api from "../../axios";
import type {
  Transaction,
  TransactionStats,
  TransactionDetailResponse,
  TransactionListResponse,
  TransactionStatsResponse,
  GetTransactionsFilters,
} from "./types";

const TRANSACTIONS_ENDPOINT = "/admin/transactions";

export const transactionsApi = {
  // Get transaction stats (today's revenue, completed/pending/failed counts)
  getTransactionStats: async (): Promise<TransactionStats> => {
    const response = await api.get<TransactionStatsResponse>(
      `${TRANSACTIONS_ENDPOINT}/stats`,
      { withCredentials: true },
    );
    return response.data.data;
  },

  // Get list of transactions with filters and pagination
  getTransactions: async (
    filters?: GetTransactionsFilters,
  ): Promise<{ data: Transaction[]; pagination: any }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.method) params.append("method", filters.method);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${TRANSACTIONS_ENDPOINT}?${queryString}`
      : TRANSACTIONS_ENDPOINT;

    const response = await api.get<TransactionListResponse>(url, {
      withCredentials: true,
    });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  // Get single transaction by ID
  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const response = await api.get<TransactionDetailResponse>(
      `${TRANSACTIONS_ENDPOINT}/${transactionId}`,
      { withCredentials: true },
    );
    return response.data.data;
  },
};
