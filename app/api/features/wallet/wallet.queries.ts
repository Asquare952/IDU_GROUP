import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWallet,
  getWalletTransactions,
  topUpWallet,
  withdrawFromWallet,
  transferFromWallet,
} from "./wallet.api";
import {
  WalletTransactionsResponse,
  TopUpPayload,
  WithdrawPayload,
  TransferPayload,
  WalletResponse,
  WithdrawResponse,
} from "./type";

// Hook to fetch wallet information
export const useWallet = () => {
  const { data, isLoading } = useQuery<WalletResponse>({
    queryKey: ["wallet"],
    queryFn: getWallet,
  });
  return { data, isLoading };
};

// Hook to fetch wallet transactions
export const useWalletTransactions = () => {
  const { data, isLoading } = useQuery<WalletTransactionsResponse>({
    queryKey: ["wallet-transactions"],
    queryFn: getWalletTransactions,
  });
  return { data, isLoading };
};

// Hook to top up wallet
export const useTopUpWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<WalletResponse, Error, TopUpPayload>({
    mutationFn: topUpWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
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
    },
  });
};

// Hook to transfer from one RentUlO wallet to another
export const useTransferFromWallet = () => {
  const queryClient = useQueryClient();
  return useMutation<WalletResponse, Error, TransferPayload>({
    mutationFn: transferFromWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};