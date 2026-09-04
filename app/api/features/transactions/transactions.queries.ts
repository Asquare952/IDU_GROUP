import { useQuery } from "@tanstack/react-query";
import { transactionsApi } from "./transactions.api";
import type { GetTransactionsFilters } from "./types";

// Get transaction stats (today's revenue, counts)
export const useGetTransactionStats = () => {
  return useQuery({
    queryKey: ["admin", "transactions", "stats"],
    queryFn: () => transactionsApi.getTransactionStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get transactions list with filters and pagination
export const useGetTransactions = (filters?: GetTransactionsFilters) => {
  return useQuery({
    queryKey: [
      "admin",
      "transactions",
      filters?.status || "all",
      filters?.method || "all",
      filters?.page || 1,
      filters?.limit || 10,
    ],
    queryFn: () => transactionsApi.getTransactions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single transaction by ID
export const useGetTransaction = (transactionId?: string) => {
  return useQuery({
    queryKey: ["admin", "transaction", transactionId],
    queryFn: () => transactionsApi.getTransaction(transactionId!),
    enabled: !!transactionId, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
