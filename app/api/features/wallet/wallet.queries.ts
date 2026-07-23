import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWallet,
  getWalletTransactions,
  topUpWallet,
  withdrawFromWallet,
  transferFromWallet,
} from "./wallet.api";
import {
  WalletResponse,
  WalletTransactionsResponse,
  TopUpPayload,
  TopUpResponse,
  WithdrawPayload,
  WithdrawResponse,
  TransferPayload,
  TransferResponse,
} from "./type";

// Hook to fetch wallet information
export const useWallet = () => {
  const { data, isLoading, isError, error } = useQuery<WalletResponse>({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });
  return { data, isLoading, isError, error };
};

// Hook to fetch wallet transactions
export const useWalletTransactions = () => {
  const { data, isLoading, isError, error } =
    useQuery<WalletTransactionsResponse>({
      queryKey: ["wallet-transactions"],
      queryFn: getWalletTransactions,
    });
  return { data, isLoading, isError, error };
};

// Hook to top up wallet
export const useTopUpWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<TopUpResponse, Error, TopUpPayload>({
    mutationFn: topUpWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};

// Hook to withdraw from wallet
export const useWithdrawFromWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<WithdrawResponse, Error, WithdrawPayload>({
    mutationFn: withdrawFromWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};

// Hook to transfer from one RentULO wallet to another
export const useTransferFromWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<TransferResponse, Error, TransferPayload>({
    mutationFn: transferFromWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};
