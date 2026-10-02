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
  CreatePinPayload,
  CreatePinResponse,
  PinUpdatePayload,
  PinUpdateResponse,
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

export const transferFromWallet = async (
  payload: TransferPayload,
): Promise<TransferResponse> => {
  const { data } = await apiInstance.post("/wallet/transfer", payload);
  return data;
};

// Create transaction pin
export const createTransactionPin = async (
  payload: CreatePinPayload,
): Promise<CreatePinResponse> => {
  const { data } = await apiInstance.post("/pin/create", payload);
  return data;
};

// Update Transaction pin
export const updateTransactionPin = async (
  payload: PinUpdatePayload,
): Promise<PinUpdateResponse> => {
  const { data } = await apiInstance.put("/pin/update", payload);
  return data;
};
