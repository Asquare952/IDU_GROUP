import api from "../../axios";
import {
  normalizeRental,
  type ApiResponse,
  type RawRental,
  type Rental,
} from "../rental";
import type { ProgressAction, ProgressListPayload } from "./types";
import type {
  LockPaymentInitializePayload,
  LockPaymentInitializeResponse,
  LockPaymentVerifyResponse,
  RentPaymentInitializePayload,
  RentPaymentInitializeResponse,
  RentPaymentVerifyResponse,
} from "./types";

type ProgressContainer = Record<string, unknown>;

const looksLikeRental = (value: unknown): value is RawRental => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    "title" in candidate ||
    "propertyType" in candidate ||
    "location" in candidate ||
    "price" in candidate ||
    "images" in candidate
  );
};

const extractRentalCandidate = (value: unknown): RawRental | null => {
  if (!value) {
    return null;
  }

  if (looksLikeRental(value)) {
    return value;
  }

  if (typeof value !== "object") {
    return null;
  }

  const record = value as ProgressContainer;
  const nestedCandidateKeys = [
    "rental",
    "Rental",
    "house",
    "House",
    "property",
    "Property",
    "listing",
    "Listing",
    "data",
  ];

  for (const key of nestedCandidateKeys) {
    const candidate = record[key];

    const nestedRental = extractRentalCandidate(candidate);

    if (nestedRental) {
      return nestedRental;
    }
  }

  return null;
};

const extractProgressItems = (payload: unknown): unknown[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload !== "object") {
    return [];
  }

  const record = payload as ProgressContainer;
  const listKeys = [
    "data",
    "items",
    "rentals",
    "likes",
    "locks",
    "books",
    "liked",
    "locked",
    "booked",
    "results",
    "rows",
    "docs",
  ];

  for (const key of listKeys) {
    const items = extractProgressItems(record[key]);

    if (items.length > 0) {
      return items;
    }
  }

  return extractRentalCandidate(payload) ? [payload] : [];
};

const normalizeProgressRentals = (payload: ProgressListPayload): Rental[] => {
  const source = extractProgressItems(payload);

  return source
    .map((item) => extractRentalCandidate(item))
    .filter((item): item is RawRental => Boolean(item))
    .map((item) => normalizeRental(item));
};

// API functions

// fetch liked, locked, or booked rentals for the current user
const getProgressList = async (action: ProgressAction): Promise<Rental[]> => {
  const response = await api.get<ApiResponse<ProgressListPayload>>(
    `/progress/${action}`,
  );

  return normalizeProgressRentals(response.data.data ?? response.data);
};

// like, lock, or book a rental for the current user
const addProgressItem = async (
  action: ProgressAction,
  rentalId: string,
): Promise<unknown> => {
  const response = await api.post(`/progress/${action}`, {
    rental_id: rentalId,
  });

  return response.data;
};

// remove a liked, locked, or booked rental
const removeProgressItem = async (
  action: ProgressAction,
  rentalId: string,
): Promise<void> => {
  await api.delete(`/progress/${action}/${rentalId}`);
};

const clearProgress = async (action: ProgressAction): Promise<void> => {
  await api.delete(`/progress/${action}`);
};

const findStringByKeys = (
  value: unknown,
  keys: string[],
): string | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;

  for (const key of keys) {
    const match = record[key];

    if (typeof match === "string" && match.trim()) {
      return match;
    }
  }

  for (const nestedValue of Object.values(record)) {
    const match = findStringByKeys(nestedValue, keys);

    if (match) {
      return match;
    }
  }

  return undefined;
};

const initializeLockPayment = async (
  payload: LockPaymentInitializePayload,
): Promise<LockPaymentInitializeResponse> => {
  const response = await api.post("/progress/lock/initialize", payload);
  const authorizationUrl = findStringByKeys(response.data, [
    "authorization_url",
    "authorizationUrl",
    "payment_url",
    "paymentUrl",
    "checkout_url",
    "checkoutUrl",
    "url",
  ]);

  if (!authorizationUrl) {
    throw new Error("Payment checkout link was not returned.");
  }

  return {
    authorizationUrl,
    reference: findStringByKeys(response.data, [
      "reference",
      "trxref",
      "transaction_reference",
    ]),
    raw: response.data,
  };
};

const verifyLockPayment = async (
  reference: string,
): Promise<LockPaymentVerifyResponse> => {
  const cleanedReference = reference.trim();

  try {
    const response = await api.get(
      `/progress/lock/verify?reference=${encodeURIComponent(cleanedReference)}`,
      { skipAuthRedirect: true } as any,
    );

    return {
      success: true,
      message:
        typeof response.data?.message === "string"
          ? response.data.message
          : undefined,
      raw: response.data,
    };
  } catch {
    const response = await api.post("/progress/lock/verify", {
      reference: cleanedReference,
    });

    return {
      success: true,
      message:
        typeof response.data?.message === "string"
          ? response.data.message
          : undefined,
      raw: response.data,
    };
  }
};

const initializeRentPayment = async (
  payload: RentPaymentInitializePayload,
): Promise<RentPaymentInitializeResponse> => {
  const response = await api.post("/progress/rent/initialize", payload);
  const authorizationUrl = findStringByKeys(response.data, [
    "authorization_url",
    "authorizationUrl",
    "payment_url",
    "paymentUrl",
    "checkout_url",
    "checkoutUrl",
    "url",
  ]);

  if (!authorizationUrl) {
    throw new Error("Payment checkout link was not returned.");
  }

  return {
    authorizationUrl,
    reference: findStringByKeys(response.data, [
      "reference",
      "trxref",
      "transaction_reference",
    ]),
    raw: response.data,
  };
};

const verifyRentPayment = async (
  reference: string,
): Promise<RentPaymentVerifyResponse> => {
  const cleanedReference = reference.trim();

  try {
    const response = await api.get(
      `/progress/rent/verify?reference=${encodeURIComponent(cleanedReference)}`,
      { skipAuthRedirect: true } as any,
    );

    return {
      success: true,
      message:
        typeof response.data?.message === "string"
          ? response.data.message
          : undefined,
      raw: response.data,
    };
  } catch {
    const response = await api.post("/progress/rent/verify", {
      reference: cleanedReference,
    });

    return {
      success: true,
      message:
        typeof response.data?.message === "string"
          ? response.data.message
          : undefined,
      raw: response.data,
    };
  }
};

export const progressApi = {
  getLikedRentals: () => getProgressList("like"),
  getLockedRentals: () => getProgressList("lock"),
  getBookedRentals: () => getProgressList("book"),
  likeRental: (rentalId: string) => addProgressItem("like", rentalId),
  lockRental: (rentalId: string) => addProgressItem("lock", rentalId),
  rentRental: (rentalId: string) => addProgressItem("rent", rentalId),
  initializeLockPayment,
  verifyLockPayment,
  initializeRentPayment,
  verifyRentPayment,
  bookRental: (rentalId: string) => addProgressItem("book", rentalId),
  unlikeRental: (rentalId: string) => removeProgressItem("like", rentalId),
  unlockRental: (rentalId: string) => removeProgressItem("lock", rentalId),
  unbookRental: (rentalId: string) => removeProgressItem("book", rentalId),
  clearLikedRentals: () => clearProgress("like"),
  clearLockedRentals: () => clearProgress("lock"),
  clearBookedRentals: () => clearProgress("book"),
};
