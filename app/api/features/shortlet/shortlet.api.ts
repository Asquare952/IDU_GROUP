import api from "../../axios";
import { isAxiosError, type AxiosRequestConfig } from "axios";
import type {
  Property,
  ShortletFurnishingStatus,
  ShortletRentalModel,
} from "../property/types";
import type { ApiResponse } from "../rental/types";
import { hasAccessToken } from "@/app/lib/auth";

type ShortletRequestConfig = AxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

export type ShortletPropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "condo"
  | "townhouse"
  | "bungalow"
  | "loft";

export interface CreateShortletPayload {
  title: string;
  description: string;
  rentalModel: ShortletRentalModel;
  propertyType: ShortletPropertyType;
  bedrooms?: number;
  bathrooms?: number;
  livingRooms?: number;
  guestCapacity?: number;
  furnishingStatus?: ShortletFurnishingStatus;
  address: string;
  city: string;
  area?: string;
  landmark?: string;
  pricePerNight: number;
  cleaningFee?: number;
  securityDeposit?: number;
  minimumStay?: number;
  maximumStay?: number;
  availableFrom: string;
  availableTo: string;
  checkInTime?: string;
  checkOutTime?: string;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  partiesAllowed?: boolean;
  houseRules?: string[];
  status: string;
  amenities: string[];
  images: File[];
  videos: File[];
}

export type UpdateShortletPayload = Partial<
  Omit<CreateShortletPayload, "images" | "videos">
> & {
  images?: string[];
  videos?: string[];
};

type RawShortlet = Record<string, unknown>;

export interface ShortletAvailability {
  id: string;
  availableFrom: string;
  availableTo: string;
  minimumStay: number;
  maximumStay: number;
  checkInTime: string;
  checkOutTime: string;
  guestCapacity: number;
  earlyCheckoutRefundable: boolean;
  status: string;
  bookable: boolean;
  bookedRanges: Array<{ checkIn: string; checkOut: string }>;
}

export interface ShortletQuote {
  shortlet_id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  checkInTime: string;
  checkOutTime: string;
  pricePerNight: string;
  nights: number;
  subtotal: string;
  cleaningFee: string;
  securityDeposit: string;
  securityDepositRefundable: boolean;
  cautionFee?: string;
  cautionFeeRefundable?: boolean;
  total: string;
  cancellationPolicy: {
    policy: string;
    label: string;
    windows: Array<{
      nightsRefundPercent: number;
      minHoursBeforeCheckIn: number;
      from: string | null;
      until: string | null;
    }>;
    gracePeriod: {
      withinHoursOfBooking: number;
      minHoursBeforeCheckIn: number;
      until: string | null;
    };
    earlyCheckout: {
      unusedNightsRefundable: boolean;
      noticeHours: number;
      summary: string;
    };
    freeCancellationUntil: string | null;
    summary: string;
  };
}

export interface ShortletBookingPayload {
  shortlet_id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  pin: string;
}

export interface ShortletBookingResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>;
  walletBalance: string;
}

export interface ShortletDepositInspection {
  canInspect?: boolean;
  cautionFee?: string | number | null;
  inspection?: {
    outcome?: "no_damage" | "damage" | null;
    inspectedAt?: string | null;
    pending?: boolean;
  } | null;
}

export interface ShortletGuestBooking {
  id: string;
  booking_id?: string;
  shortlet_id?: string;
  status: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total?: string | number;
  refundedAmount?: string | number;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  review?: ShortletBookingReviewStatus | null;
  depositClaim?: ShortletDepositInspection | null;
  guest?: {
    id?: string;
    fullName?: string;
    phone?: string;
  } | null;
  shortlet?: {
    id?: string;
    slug?: string;
    title?: string;
    address?: string;
    city?: string;
    area?: string;
    images?: string[];
    pricePerNight?: string | number;
  } | null;
}

export type ShortletInspectionPayload =
  | {
      bookingId: string;
      outcome: "no_damage";
    }
  | {
      bookingId: string;
      outcome: "damage";
      description: string;
      photos: File[];
      videos: File[];
    };

export interface ShortletInspectionResponse {
  success: boolean;
  message: string;
  refunded?: boolean;
  data?: unknown;
}

export interface ShortletHostResponse {
  text: string;
  respondedAt?: string;
  updatedAt?: string;
}

export interface ShortletPublicReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  stay?: {
    checkIn?: string;
    checkOut?: string;
    month?: string;
  };
  verifiedBooking?: boolean;
  guest?: {
    displayName?: string;
    profileImage?: string | null;
  } | null;
  hostResponse?: ShortletHostResponse | null;
}

export interface ShortletReviewsResult {
  shortlet_id: string;
  ratingAverage: string | null;
  reviewCount: number;
  reviews: ShortletPublicReview[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ShortletPendingReview {
  booking_id: string;
  shortlet: {
    id: string;
    slug?: string;
    title?: string;
    coverImage?: string;
    city?: string;
    area?: string;
  };
  check_in: string;
  check_out: string;
  reviewDeadline: string;
}

export interface ShortletHostReview extends ShortletPublicReview {
  booking_id: string;
  shortlet: {
    id: string;
    slug?: string;
    title?: string;
    ratingAverage?: string | null;
    reviewCount?: number;
  };
  canRespond: boolean;
}

export interface ShortletHostReviewFilters {
  shortlet_id?: string;
  responded?: boolean;
  limit?: number;
  offset?: number;
}

export interface ShortletBookingReviewStatus {
  submitted?: boolean;
  canReview?: boolean;
  deadline?: string | null;
  review?: ShortletPublicReview | null;
  canRespond?: boolean;
}

export interface ShortletReviewSubmissionResponse {
  success: boolean;
  message: string;
  data: ShortletPublicReview;
  shortlet: {
    id: string;
    ratingAverage: string | null;
    reviewCount: number;
  };
}

export interface ShortletHostReviewResponse {
  success: boolean;
  message: string;
  data: ShortletPublicReview;
}

export interface ShortletCancellationPreview {
  booking_id: string;
  status: string;
  cancelledBy: string;
  policy?: {
    policy?: string;
    label?: string;
    summary?: string;
  };
  cancellation:
    | {
        canCancel: true;
        policy?: string;
        policyVersion?: number;
        stage?: string;
        rule?: string;
        refundPercent?: number;
        refundAmount: string;
        nonRefundableAmount: string;
        breakdown?: Record<string, string>;
        nights?: {
          total?: number;
          used?: number | null;
          charged?: number | null;
          refunded?: number | null;
        };
        actualCheckOut?: string | null;
        checkOutDateOptions?: {
          earliest: string;
          latest: string;
        } | null;
        noticeHours?: number | null;
        earlyCheckoutRefundable?: boolean | null;
        freeCancellationUntil?: string | null;
      }
    | {
        canCancel: false;
        code: string;
        reason: string;
      };
  expectedRefundAmount?: string;
}

export interface ShortletCancellationPreviewResponse {
  success: boolean;
  message: string;
  data: ShortletCancellationPreview;
}

export interface CancelShortletBookingPayload {
  bookingId: string;
  reason?: string;
  expectedRefundAmount?: string;
  checkOutDate?: string;
}

export interface CancelShortletBookingResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown>;
  refundAmount: string;
  hostDebtCreated?: string;
}

interface ShortletApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ShortletListApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

interface ShortletReviewsApiResponse {
  success: boolean;
  message?: string;
  data: Omit<ShortletReviewsResult, "pagination">;
  pagination?: ShortletReviewsResult["pagination"];
}

export const getShortletApiError = (
  error: unknown,
): { code?: string; message: string; status?: number } => {
  if (
    isAxiosError<{
      code?: unknown;
      message?: unknown;
      error?: unknown;
      details?: unknown;
    }>(error)
  ) {
    const code =
      typeof error.response?.data?.code === "string"
        ? error.response.data.code
        : undefined;
    const message =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : typeof error.response?.data?.error === "string"
          ? error.response.data.error
          : typeof error.response?.data?.details === "string"
            ? error.response.data.details
        : error.message;
    return { code, message, status: error.response?.status };
  }

  return {
    message: error instanceof Error ? error.message : "The request failed.",
  };
};

const asRecord = (value: unknown): RawShortlet | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as RawShortlet)
    : null;

const asString = (value: unknown): string =>
  typeof value === "string" ? value : value == null ? "" : String(value);

const asOptionalString = (value: unknown): string | undefined => {
  const stringValue = asString(value).trim();
  return stringValue || undefined;
};

const asOptionalNumber = (value: unknown): number | undefined => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0
    ? numberValue
    : undefined;
};

const asStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(asStringList);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        return asStringList(JSON.parse(trimmed));
      } catch {
        return [trimmed];
      }
    }
    return [trimmed];
  }
  return [];
};

const asMediaList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(asMediaList);
  }
  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }
  const record = asRecord(value);
  if (!record) return [];
  return ["secure_url", "url", "image", "path", "src"].flatMap((key) =>
    asMediaList(record[key]),
  );
};

const findShortlet = (value: unknown): RawShortlet | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const shortlet = findShortlet(item);
      if (shortlet) return shortlet;
    }
    return null;
  }
  const record = asRecord(value);
  if (!record) return null;
  if (
    "title" in record &&
    ("pricePerNight" in record || "rentalModel" in record)
  ) {
    return record;
  }
  for (const key of ["data", "shortlet", "property", "listing", "result"]) {
    const shortlet = findShortlet(record[key]);
    if (shortlet) return shortlet;
  }
  return null;
};

const unwrapShortletList = (value: unknown): RawShortlet[] => {
  if (Array.isArray(value)) {
    return value
      .map(findShortlet)
      .filter((item): item is RawShortlet => !!item);
  }
  const record = asRecord(value);
  if (!record) return [];
  for (const key of ["data", "shortlets", "listings", "results", "items"]) {
    const items = unwrapShortletList(record[key]);
    if (items.length) return items;
  }
  const item = findShortlet(value);
  return item ? [item] : [];
};

export const normalizeShortlet = (raw: RawShortlet): Property => {
  const owner =
    asRecord(raw.User) ?? asRecord(raw.user) ?? asRecord(raw.landlord) ?? null;
  const ownerProfile =
    asRecord(owner?.Profile) ?? asRecord(owner?.profile) ?? null;
  const id = asString(raw.id ?? raw._id);
  const price = Number(raw.pricePerNight) || 0;
  const status = asString(raw.status) || "available";
  const images = asMediaList(raw.images ?? raw.coverImage);

  return {
    id,
    slug: asString(raw.slug) || id,
    title: asString(raw.title),
    description: asString(raw.description),
    propertyType: asString(raw.propertyType),
    location: asString(raw.area ?? raw.city ?? raw.address),
    price,
    legalFee: 0,
    cautionFee:
      asOptionalNumber(raw.cautionFee) ??
      asOptionalNumber(raw.securityDeposit) ??
      0,
    brokeFee: 0,
    mgtServiceCharge: asOptionalNumber(raw.cleaningFee) ?? 0,
    priceType: "nightly",
    status,
    ratingAverage:
      raw.ratingAverage === null
        ? null
        : (asOptionalNumber(raw.ratingAverage) ?? null),
    reviewCount: asOptionalNumber(raw.reviewCount),
    liked: typeof raw.liked === "boolean" ? raw.liked : undefined,
    images,
    videos: asMediaList(raw.videos),
    amenities: asStringList(raw.amenities),
    createdAt: asString(raw.createdAt),
    UserId: asString(raw.userId ?? raw.UserId ?? owner?.id),
    User: owner
      ? {
          id: asString(owner.id ?? owner._id),
          full_name: asString(owner.full_name ?? owner.name),
          phone_no: asString(owner.phone_no),
          Profile: ownerProfile
            ? {
                image: asString(ownerProfile.image),
                verified: ownerProfile.verified === true,
              }
            : null,
        }
      : null,
    address: asString(raw.address),
    city: asString(raw.city),
    state: asString(raw.state),
    country: asOptionalString(raw.country),
    bedrooms: asOptionalNumber(raw.bedrooms),
    bathrooms: asOptionalNumber(raw.bathrooms),
    userId: asString(raw.userId ?? raw.UserId ?? owner?.id),
    rentalModel: asString(raw.rentalModel) as ShortletRentalModel,
    livingRooms: asOptionalNumber(raw.livingRooms),
    guestCapacity: asOptionalNumber(raw.guestCapacity),
    furnishingStatus: asOptionalString(
      raw.furnishingStatus,
    ) as ShortletFurnishingStatus,
    area: asOptionalString(raw.area),
    landmark: asOptionalString(raw.landmark),
    cleaningFee: asOptionalNumber(raw.cleaningFee),
    securityDeposit:
      asOptionalNumber(raw.cautionFee) ??
      asOptionalNumber(raw.securityDeposit),
    minimumStay: asOptionalNumber(raw.minimumStay),
    maximumStay: asOptionalNumber(raw.maximumStay),
    availableFrom: asOptionalString(raw.availableFrom),
    availableTo: asOptionalString(raw.availableTo),
    checkInTime: asOptionalString(raw.checkInTime),
    checkOutTime: asOptionalString(raw.checkOutTime),
    smokingAllowed:
      typeof raw.smokingAllowed === "boolean" ? raw.smokingAllowed : undefined,
    petsAllowed:
      typeof raw.petsAllowed === "boolean" ? raw.petsAllowed : undefined,
    partiesAllowed:
      typeof raw.partiesAllowed === "boolean" ? raw.partiesAllowed : undefined,
    houseRules: asStringList(raw.houseRules),
  };
};

const toFormData = (payload: CreateShortletPayload) => {
  const formData = new FormData();
  const { images, videos, amenities, houseRules, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (amenities) formData.append("amenities", JSON.stringify(amenities));
  if (houseRules) formData.append("houseRules", JSON.stringify(houseRules));
  images?.forEach((image) => formData.append("images", image));
  videos?.forEach((video) => formData.append("videos", video));

  return formData;
};

export const createShortlet = async (payload: CreateShortletPayload) => {
  const response = await api.post<ApiResponse<unknown>>(
    "/shortlet/post",
    toFormData(payload),
  );
  return response.data;
};

export const fetchShortlets = async (
  recentOnly = true,
): Promise<Property[]> => {
  const endpoint = recentOnly ? "/shortlet/recent" : "/shortlet/all";

  try {
    const response = await api.get<ApiResponse<unknown>>(endpoint, {
      skipAuthRedirect: recentOnly,
    } as ShortletRequestConfig);
    return unwrapShortletList(response.data).map(normalizeShortlet);
  } catch (error) {
    // Empty shortlet collections are commonly returned as 404 by the API.
    // Treat that as an empty list so it does not hide long-term properties.
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const fetchShortletAvailability = async (
  identifier: string,
): Promise<ShortletAvailability> => {
  const response = await api.get<ShortletApiResponse<ShortletAvailability>>(
    `/shortlet/availability/${encodeURIComponent(identifier)}`,
  );
  return response.data.data;
};

export const fetchShortletQuote = async (
  identifier: string,
  params: { checkIn: string; checkOut: string; guests: number },
): Promise<ShortletQuote> => {
  const response = await api.get<ShortletApiResponse<ShortletQuote>>(
    `/shortlet/quote/${encodeURIComponent(identifier)}`,
    { params },
  );
  return response.data.data;
};

export const bookShortlet = async (
  payload: ShortletBookingPayload,
): Promise<ShortletBookingResponse> => {
  const response = await api.post<ShortletBookingResponse>(
    "/shortlet/book",
    payload,
  );
  return response.data;
};

export const fetchShortletBookings = async (): Promise<
  ShortletGuestBooking[]
> => {
  const response = await api.get<unknown>("/shortlet/bookings");
  const payload = asRecord(response.data);
  const bookings = findBookingList(payload)
    .map(normalizeGuestBooking)
    .filter((booking) => booking.id);

  if (bookings.length > 0) {
    return bookings;
  }

  const progressResponse = await api.get<unknown>("/progress/book");
  const progressPayload = asRecord(progressResponse.data);
  return findBookingList(progressPayload?.shortletBookings)
    .map(normalizeGuestBooking)
    .filter((booking) => booking.id);
};

const findBookingList = (value: unknown, depth = 0): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }
  if (!value || typeof value !== "object" || depth > 3) {
    return [];
  }

  const record = value as Record<string, unknown>;
  for (const key of ["data", "shortletBookings", "bookings", "results"]) {
    if (key in record) {
      const result = findBookingList(record[key], depth + 1);
      if (result.length > 0) return result;
    }
  }

  return [];
};

const normalizeGuestBooking = (value: unknown): ShortletGuestBooking => {
  const booking = asRecord(value) ?? {};
  const shortlet = asRecord(booking.shortlet);
  const guest = asRecord(booking.guest);
  const depositClaim = asRecord(booking.depositClaim ?? booking.deposit_claim);
  const inspection = asRecord(depositClaim?.inspection);
  const bookingReview = asRecord(booking.review);
  const review = asRecord(bookingReview?.review);
  const reviewGuest = asRecord(review?.guest);
  const reviewStay = asRecord(review?.stay);
  const hostResponse = asRecord(review?.hostResponse);
  const rawImages = asStringList(shortlet?.images);
  const coverImage = asOptionalString(shortlet?.coverImage);
  const pricePerNight = shortlet?.pricePerNight ?? booking.price_per_night;

  return {
    id: asString(booking.id ?? booking.booking_id),
    booking_id: asOptionalString(booking.booking_id),
    shortlet_id: asOptionalString(booking.shortlet_id),
    status: asString(booking.status) || "confirmed",
    checkIn: asString(booking.checkIn ?? booking.check_in),
    checkOut: asString(booking.checkOut ?? booking.check_out),
    guests: Number(booking.guests) || 1,
    total: (booking.total ?? booking.total_amount) as
      | string
      | number
      | undefined,
    refundedAmount: (booking.refundedAmount ?? booking.refunded_amount) as
      | string
      | number
      | undefined,
    cancelledAt: asOptionalString(booking.cancelledAt ?? booking.cancelled_at),
    cancelledBy: asOptionalString(booking.cancelledBy ?? booking.cancelled_by),
    cancellationReason: asOptionalString(
      booking.cancellationReason ?? booking.cancellation_reason,
    ),
    review: bookingReview
      ? {
          submitted: bookingReview.submitted === true,
          canReview: bookingReview.canReview === true,
          deadline: asOptionalString(bookingReview.deadline) ?? null,
          canRespond: bookingReview.canRespond === true,
          review: review
            ? {
                id: asString(review.id),
                rating: Number(review.rating),
                comment: asString(review.comment),
                createdAt: asString(review.createdAt),
                stay: reviewStay
                  ? {
                      checkIn: asOptionalString(reviewStay.checkIn),
                      checkOut: asOptionalString(reviewStay.checkOut),
                      month: asOptionalString(reviewStay.month),
                    }
                  : undefined,
                verifiedBooking: review.verifiedBooking === true,
                guest: reviewGuest
                  ? {
                      displayName: asOptionalString(
                        reviewGuest.displayName,
                      ),
                      profileImage:
                        asOptionalString(reviewGuest.profileImage) ?? null,
                    }
                  : null,
                hostResponse: hostResponse
                  ? {
                      text: asString(hostResponse.text),
                      respondedAt: asOptionalString(
                        hostResponse.respondedAt,
                      ),
                      updatedAt: asOptionalString(hostResponse.updatedAt),
                    }
                  : null,
              }
            : null,
        }
      : null,
    depositClaim: depositClaim
      ? {
          canInspect: depositClaim.canInspect === true,
          cautionFee:
            typeof depositClaim.cautionFee === "string" ||
            typeof depositClaim.cautionFee === "number"
              ? depositClaim.cautionFee
              : null,
          inspection: inspection
            ? {
                outcome:
                  inspection.outcome === "no_damage" ||
                  inspection.outcome === "damage"
                    ? inspection.outcome
                    : null,
                inspectedAt: asOptionalString(inspection.inspectedAt) ?? null,
                pending:
                  typeof inspection.pending === "boolean"
                    ? inspection.pending
                    : undefined,
              }
            : null,
        }
      : null,
    guest: guest
      ? {
          id: asOptionalString(guest.id),
          fullName: asOptionalString(guest.full_name ?? guest.fullName),
          phone: asOptionalString(guest.phone_no ?? guest.phone),
        }
      : null,
    shortlet: shortlet
      ? {
          id: asOptionalString(shortlet.id),
          slug: asOptionalString(shortlet.slug),
          title: asOptionalString(shortlet.title),
          address: asOptionalString(shortlet.address),
          city: asOptionalString(shortlet.city),
          area: asOptionalString(shortlet.area),
          images:
            rawImages.length > 0 ? rawImages : coverImage ? [coverImage] : [],
          pricePerNight: pricePerNight as string | number | undefined,
        }
      : null,
  };
};

export const fetchHostShortletBookings = async (
  status?: "confirmed" | "cancelled" | "completed",
): Promise<ShortletGuestBooking[]> => {
  const response = await api.get<unknown>("/shortlet/host/bookings", {
    params: status ? { status } : undefined,
  });
  const bookings = findBookingList(response.data)
    .map(normalizeGuestBooking)
    .filter((booking) => booking.id);

  return bookings;
};

export const fetchHostShortletInspections = async (): Promise<
  ShortletGuestBooking[]
> => {
  const response = await api.get<unknown>("/shortlet/host/inspections");
  return findBookingList(response.data)
    .map(normalizeGuestBooking)
    .filter((booking) => booking.id);
};

export const submitShortletInspection = async (
  payload: ShortletInspectionPayload,
): Promise<ShortletInspectionResponse> => {
  const endpoint = `/shortlet/bookings/${encodeURIComponent(payload.bookingId)}/inspection`;
  let body: { outcome: "no_damage" } | FormData;

  if (payload.outcome === "no_damage") {
    body = { outcome: payload.outcome };
  } else {
    const formData = new FormData();
    formData.append("outcome", payload.outcome);
    formData.append("description", payload.description);
    payload.photos.forEach((photo) => formData.append("photos", photo));
    payload.videos.forEach((video) => formData.append("videos", video));
    body = formData;
  }

  const response = await api.post<ShortletInspectionResponse>(endpoint, body);
  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to submit the inspection.");
  }
  return response.data;
};

export const fetchShortletReviews = async (
  identifier: string,
  params: { limit?: number; offset?: number } = { limit: 50, offset: 0 },
): Promise<ShortletReviewsResult> => {
  const response = await api.get<ShortletReviewsApiResponse>(
    `/shortlet/get1/${encodeURIComponent(identifier)}/reviews`,
    {
      params,
      skipAuthRedirect: true,
    } as ShortletRequestConfig,
  );
  const result = response.data.data;
  if (!result || !Array.isArray(result.reviews)) {
    throw new Error("The reviews response did not contain a review list.");
  }
  return { ...result, pagination: response.data.pagination };
};

export const fetchPendingShortletReviews = async (): Promise<
  ShortletPendingReview[]
> => {
  const response = await api.get<
    ShortletListApiResponse<ShortletPendingReview[]>
  >("/shortlet/reviews/pending");
  if (!Array.isArray(response.data.data)) {
    throw new Error("The pending reviews response did not contain a list.");
  }
  return response.data.data;
};

export const submitShortletReview = async ({
  bookingId,
  rating,
  comment,
}: {
  bookingId: string;
  rating: number;
  comment: string;
}): Promise<ShortletReviewSubmissionResponse> => {
  const response = await api.post<ShortletReviewSubmissionResponse>(
    `/shortlet/bookings/${encodeURIComponent(bookingId)}/review`,
    { rating, comment },
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to submit the review.");
  }
  return response.data;
};

export const fetchHostShortletReviews = async (
  filters: ShortletHostReviewFilters = {},
): Promise<ShortletHostReview[]> => {
  const response = await api.get<
    ShortletListApiResponse<ShortletHostReview[]>
  >("/shortlet/host/reviews", { params: filters });
  if (!Array.isArray(response.data.data)) {
    throw new Error("The host reviews response did not contain a review list.");
  }
  return response.data.data;
};

export const respondToShortletReview = async ({
  reviewId,
  response: message,
}: {
  reviewId: string;
  response: string;
}): Promise<ShortletHostReviewResponse> => {
  const response = await api.put<ShortletHostReviewResponse>(
    `/shortlet/reviews/${encodeURIComponent(reviewId)}/response`,
    { response: message },
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Unable to publish the response.");
  }
  return response.data;
};

export const fetchShortletCancellationPreview = async (
  bookingId: string,
  checkOutDate?: string,
): Promise<ShortletCancellationPreview> => {
  const response = await api.get<ShortletCancellationPreviewResponse>(
    `/shortlet/bookings/${encodeURIComponent(bookingId)}/cancellation`,
    checkOutDate ? { params: { checkOutDate } } : undefined,
  );
  return response.data.data;
};

export const cancelShortletBooking = async ({
  bookingId,
  ...payload
}: CancelShortletBookingPayload): Promise<CancelShortletBookingResponse> => {
  const response = await api.post<CancelShortletBookingResponse>(
    `/shortlet/bookings/${encodeURIComponent(bookingId)}/cancel`,
    payload,
  );
  return response.data;
};

export const fetchAdminShortlets = async (): Promise<Property[]> => {
  const response = await api.get<ApiResponse<unknown>>("/admin/shortlets");
  return unwrapShortletList(response.data).map(normalizeShortlet);
};

export const searchShortlets = async (params: {
  location?: string;
}): Promise<Property[]> => {
  const query = new URLSearchParams();
  if (params.location) query.set("location", params.location);
  const suffix = query.toString();

  try {
    const response = await api.get<ApiResponse<unknown>>(
      `/shortlet/search${suffix ? `?${suffix}` : ""}`,
    );
    return unwrapShortletList(response.data).map(normalizeShortlet);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const fetchShortletById = async (
  identifier: string,
): Promise<Property> => {
  if (!hasAccessToken()) {
    const recent = await fetchShortlets(true);
    const match = recent.find(
      (item) => item.id === identifier || item.slug === identifier,
    );
    if (match) return match;
  }

  const response = await api.get<ApiResponse<unknown>>(
    `/shortlet/get1/${encodeURIComponent(identifier)}`,
    { skipAuthRedirect: true } as ShortletRequestConfig,
  );
  const shortlet = findShortlet(response.data);
  if (!shortlet) {
    throw new Error("Shortlet was not found in the API response.");
  }
  return normalizeShortlet(shortlet);
};

export const updateShortlet = async (
  identifier: string,
  payload: UpdateShortletPayload,
) => {
  const response = await api.put<ApiResponse<unknown>>(
    `/shortlet/update/${encodeURIComponent(identifier)}`,
    payload,
  );
  return response.data;
};

export const deleteShortlet = async (identifier: string) => {
  const response = await api.delete<ApiResponse<unknown>>(
    `/shortlet/delete/${encodeURIComponent(identifier)}`,
  );
  return response.data;
};

export const deleteAdminShortlet = async (identifier: string) => {
  const response = await api.delete<ApiResponse<unknown>>(
    `/admin/shortlets/${encodeURIComponent(identifier)}`,
  );
  return response.data;
};

export const shortletApi = {
  createShortlet,
  fetchAdminShortlets,
  fetchShortlets,
  searchShortlets,
  fetchShortletById,
  updateShortlet,
  deleteShortlet,
  deleteAdminShortlet,
};
