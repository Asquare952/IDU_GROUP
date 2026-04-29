import type { Rental, RawRental } from "@/app/api/features/rental";

export type ProgressAction = "like" | "lock" | "book";

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
