import api from "../../axios";
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
  RedeemCouponPayload,
  CouponRedemptionResponse,
} from "./type";

export const getWallet = async (): Promise<WalletResponse> => {
  const { data } = await api.get("/wallet");
  return data;
};

export const getWalletTransactions =
  async (): Promise<WalletTransactionsResponse> => {
    const { data } = await api.get("/wallet/transactions");
    return data;
  };

export const topUpWallet = async (
  payload: TopUpPayload,
): Promise<TopUpResponse> => {
  const { data } = await api.post("/wallet/topup/initialize", payload);
  return data;
};

export const withdrawFromWallet = async (
  payload: WithdrawPayload,
): Promise<WithdrawResponse> => {
  const { data } = await api.post("/wallet/withdraw", payload);
  return data;
};

export const transferFromWallet = async (
  payload: TransferPayload,
): Promise<TransferResponse> => {
  const { data } = await api.post("/wallet/transfer", payload);
  return data;
};

export const redeemWalletCoupon = async (
  payload: RedeemCouponPayload,
): Promise<CouponRedemptionResponse> => {
  const { data } = await api.post(
    "/wallet/coupons/redeem",
    payload,
  );
  return data;
};

// Create transaction pin
export const createTransactionPin = async (
  payload: CreatePinPayload,
): Promise<CreatePinResponse> => {
  const { data } = await api.post("/pin/create", payload);
  return data;
};

// Update Transaction pin
export const updateTransactionPin = async (
  payload: PinUpdatePayload,
): Promise<PinUpdateResponse> => {
  const { data } = await api.put("/pin/update", payload);
  return data;
};
