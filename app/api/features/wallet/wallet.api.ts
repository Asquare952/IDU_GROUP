import apiInstance from "../../axios";
import {
  WalletTransactionsResponse,
  TopUpPayload,
  TopUpResponse,
  WithdrawPayload,
  WithdrawResponse,
  TransferPayload,
  TransferResponse,
  WalletResponse,
} from "./type";

export const getWallet = async (): Promise<WalletResponse> => {
  const { data } = await apiInstance.get("/wallet");
  return data;
};

export const getWalletTransactions =
  async (): Promise<WalletTransactionsResponse> => {
    const { data } = await apiInstance.get("/wallet/transactions");
    return data;
  };

// FIX: was typed Promise<WalletResponse> — the endpoint returns { link, tx_ref, ... }, not a Wallet.
export const topUpWallet = async (
  payload: TopUpPayload,
): Promise<TopUpResponse> => {
  const { data } = await apiInstance.post("/wallet/topup/initialize", payload);
  return data;
};

export const withdrawFromWallet = async (
  payload: WithdrawPayload,
): Promise<WithdrawResponse> => {
  const { data } = await apiInstance.post("/wallet/withdraw", payload);
  return data;
};

// FIX: was typed Promise<WalletResponse> — the endpoint returns { message, balance }, not a Wallet.
export const transferFromWallet = async (
  payload: TransferPayload,
): Promise<TransferResponse> => {
  const { data } = await apiInstance.post("/wallet/transfer", payload);
  return data;
};
