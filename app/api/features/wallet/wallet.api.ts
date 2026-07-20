import apiInstance from "../../axios";
import {
  WalletTransactionsResponse,
  TopUpPayload,
  WithdrawPayload,
  TransferPayload,
  WalletResponse,
  WithdrawResponse,
} from "./type";


export const getWallet = async (): Promise<WalletResponse> => {
  const { data } = await apiInstance.get("/wallet");
  return data;
}

export const getWalletTransactions = async (): Promise<WalletTransactionsResponse> => {
  const { data } = await apiInstance.get("/wallet/transactions");
  return data;
}

export const topUpWallet = async (payload: TopUpPayload): Promise<WalletResponse> => {
  const { data } = await apiInstance.post("/wallet/topup/initialize", payload);
  return data;
}

export const withdrawFromWallet = async (payload: WithdrawPayload): Promise<WithdrawResponse> => {
  const { data } = await apiInstance.post("/wallet/withdraw", payload);
  return data;
}

export const transferFromWallet = async (payload: TransferPayload): Promise<WalletResponse> => {
  const { data } = await apiInstance.post("/wallet/transfer", payload);
  return data;
}