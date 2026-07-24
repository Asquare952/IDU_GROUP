import type { Rental, RawRental } from "@/app/api/features/rental";

export type ProgressAction = "like" | "lock" | "book" | "rent/pay";

export type ProgressListPayload =
  | RawRental[]
  | {
      data?: unknown;
      items?: unknown[];
      rentals?: RawRental[];
      likes?: unknown[];
      locks?: unknown[];
      books?: unknown[];
      liked?: unknown[];
      locked?: unknown[];
      rent?: unknown[];
      booked?: unknown[];
      results?: unknown[];
    };

export interface ProgressMutationPayload {
  rental_id: string;
}

export interface ProgressRecord {
  rental: Rental;
  progressId?: string;
}

export type LockPaymentInitializePayload = {
  rental_id: string;
  callback_url?: string;
  callbackUrl?: string;
  return_url?: string;
  returnUrl?: string;
  redirect_url?: string;
  redirectUrl?: string;
};

export type LockPaymentInitializeResponse = {
  authorizationUrl: string;
  reference?: string;
  raw: unknown;
};

export type LockPaymentVerifyResponse = {
  success: boolean;
  message?: string;
  raw: unknown;
};

export type RentPaymentInitializePayload = {
  rental_id: string;
  callback_url?: string;
  callbackUrl?: string;
  return_url?: string;
  returnUrl?: string;
  redirect_url?: string;
  redirectUrl?: string;
};

export type RentPaymentInitializeResponse = {
  authorizationUrl: string;
  reference?: string;
  raw: unknown;
};

export type RentPaymentVerifyResponse = {
  success: boolean;
  message?: string;
  raw: unknown;
};
