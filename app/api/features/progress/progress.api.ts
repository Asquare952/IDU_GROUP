import api from "../../axios";
import {
  normalizeRental,
  type ApiResponse,
  type RawRental,
  type Rental,
} from "../rental";
import type { ProgressAction, ProgressListPayload } from "./types";

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

    if (looksLikeRental(candidate)) {
      return candidate;
    }
  }

  return null;
};

const normalizeProgressRentals = (payload: ProgressListPayload): Rental[] => {
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.rentals)
        ? payload.rentals
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.likes)
            ? payload.likes
            : Array.isArray(payload?.locks)
              ? payload.locks
              : Array.isArray(payload?.books)
                ? payload.books
                : Array.isArray(payload?.liked)
                  ? payload.liked
                  : Array.isArray(payload?.locked)
                    ? payload.locked
                    : Array.isArray(payload?.booked)
                      ? payload.booked
                      : Array.isArray(payload?.results)
                        ? payload.results
                        : [];

  return source
    .map((item) => extractRentalCandidate(item))
    .filter((item): item is RawRental => Boolean(item))
    .map((item) => normalizeRental(item));
};

const getProgressList = async (action: ProgressAction): Promise<Rental[]> => {
  const response = await api.get<ApiResponse<ProgressListPayload>>(
    `/progress/${action}`,
  );

  return normalizeProgressRentals(response.data.data ?? response.data);
};

const addProgressItem = async (
  action: ProgressAction,
  rentalId: string,
): Promise<unknown> => {
  const response = await api.post(`/progress/${action}`, {
    rental_id: rentalId,
  });

  return response.data;
};

const removeProgressItem = async (
  action: ProgressAction,
  rentalId: string,
): Promise<void> => {
  await api.delete(`/progress/${action}/${rentalId}`);
};

const clearProgress = async (action: ProgressAction): Promise<void> => {
  await api.delete(`/progress/${action}`);
};

export const progressApi = {
  getLikedRentals: () => getProgressList("like"),
  getLockedRentals: () => getProgressList("lock"),
  getBookedRentals: () => getProgressList("book"),
  likeRental: (rentalId: string) => addProgressItem("like", rentalId),
  lockRental: (rentalId: string) => addProgressItem("lock", rentalId),
  bookRental: (rentalId: string) => addProgressItem("book", rentalId),
  unlikeRental: (rentalId: string) => removeProgressItem("like", rentalId),
  unlockRental: (rentalId: string) => removeProgressItem("lock", rentalId),
  unbookRental: (rentalId: string) => removeProgressItem("book", rentalId),
  clearLikedRentals: () => clearProgress("like"),
  clearLockedRentals: () => clearProgress("lock"),
  clearBookedRentals: () => clearProgress("book"),
};
