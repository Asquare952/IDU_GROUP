import api from "../../axios";
import { isAxiosError } from "axios";
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

export type TransactionPinErrorCode =
  | "PIN_NOT_SET"
  | "PIN_REQUIRED"
  | "PIN_INCORRECT";

type PinErrorResponse = {
  code?: unknown;
  message?: unknown;
};

export const getTransactionPinErrorCode = (
  error: unknown,
): TransactionPinErrorCode | undefined => {
  if (!isAxiosError<PinErrorResponse>(error)) {
    return undefined;
  }

  const code = error.response?.data?.code;
  return code === "PIN_NOT_SET" ||
    code === "PIN_REQUIRED" ||
    code === "PIN_INCORRECT"
    ? code
    : undefined;
};

export const isMissingTransactionPinError = (
  error: unknown,
  operation: "transaction" | "update" = "transaction",
): boolean =>
  getTransactionPinErrorCode(error) === "PIN_NOT_SET" ||
  (operation === "update" &&
    isAxiosError(error) &&
    error.response?.status === 404);

export const getTransactionPinErrorMessage = (
  error: unknown,
  fallback: string,
  operation: "transaction" | "update" = "transaction",
): string => {
  switch (getTransactionPinErrorCode(error)) {
    case "PIN_NOT_SET":
      return "You haven't set a transaction PIN yet. Create one in Transaction PIN settings before continuing.";
    case "PIN_REQUIRED":
      return "A valid 4-digit transaction PIN is required.";
    case "PIN_INCORRECT":
      return operation === "update"
        ? "Your current transaction PIN is incorrect."
        : "Your transaction PIN is incorrect. Please try again.";
  }

  if (
    operation === "update" &&
    isAxiosError<PinErrorResponse>(error) &&
    error.response?.status === 404
  ) {
    return "No transaction PIN exists for this account. Create one in Transaction PIN settings.";
  }

  if (
    isAxiosError<PinErrorResponse>(error) &&
    typeof error.response?.data?.message === "string"
  ) {
    return error.response.data.message;
  }

  return error instanceof Error && error.message ? error.message : fallback;
};

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
