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
  images?: File[];
  videos?: File[];
  removedImages?: string[];
  removedVideos?: string[];
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

interface ShortletApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getShortletApiError = (
  error: unknown,
): { code?: string; message: string; status?: number } => {
  if (isAxiosError<{ code?: unknown; message?: unknown }>(error)) {
    const code =
      typeof error.response?.data?.code === "string"
        ? error.response.data.code
        : undefined;
    const message =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
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
    cautionFee: asOptionalNumber(raw.securityDeposit) ?? 0,
    brokeFee: 0,
    mgtServiceCharge: asOptionalNumber(raw.cleaningFee) ?? 0,
    priceType: "nightly",
    status,
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
    securityDeposit: asOptionalNumber(raw.securityDeposit),
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

const toFormData = (payload: UpdateShortletPayload) => {
  const formData = new FormData();
  const { images, videos, amenities, houseRules, ...fields } = payload;

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (amenities) formData.append("amenities", JSON.stringify(amenities));
  if (houseRules) formData.append("houseRules", JSON.stringify(houseRules));
  payload.removedImages?.forEach((image) =>
    formData.append("removedImages", image),
  );
  payload.removedVideos?.forEach((video) =>
    formData.append("removedVideos", video),
  );
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
  const response = await api.get<ApiResponse<unknown>>(endpoint, {
    skipAuthRedirect: recentOnly,
  } as ShortletRequestConfig);
  return unwrapShortletList(response.data).map(normalizeShortlet);
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
  const response = await api.get<ApiResponse<unknown>>(
    `/shortlet/search${suffix ? `?${suffix}` : ""}`,
  );
  return unwrapShortletList(response.data).map(normalizeShortlet);
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
    toFormData(payload),
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
