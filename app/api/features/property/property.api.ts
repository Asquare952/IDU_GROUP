import api from "../../axios";
import type { AxiosRequestConfig } from "axios";
import { progressApi } from "../progress";
import {
  normalizeRental,
  normalizeRentalListResponse,
  type ApiResponse,
  type RawRental,
} from "../rental";
import type { Property, Properties } from "./types";

const RENTAL_ALL_ENDPOINT = "/rental/recent";

type ApiRequestConfig = AxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

const toStringValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
};

const toOptionalStringValue = (value: unknown): string | undefined => {
  const stringValue = toStringValue(value).trim();
  return stringValue || undefined;
};

const toOptionalNumberValue = (value: unknown): number | undefined => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : undefined;
};

const getUserId = (rental: RawRental): string => {
  const record = rental as Record<string, unknown>;
  const userIdValue =
    record.userId ??
    record.user_id ??
    ((record.User as Record<string, unknown> | undefined)?.id) ??
    ((record.user as Record<string, unknown> | undefined)?.id);

  return toStringValue(userIdValue);
};

export const normalizeProperty = (rental: RawRental): Property => {
  const normalizedRental = normalizeRental(rental);

  return {
    ...normalizedRental,
    slug: normalizedRental.slug ?? normalizedRental.id,
    price: Number(normalizedRental.price) || 0,
    address: toStringValue(rental.address),
    city: toStringValue(rental.city),
    state: toStringValue(rental.state),
    country: toOptionalStringValue(rental.country),
    bedrooms: toOptionalNumberValue(rental.bedrooms),
    bathrooms: toOptionalNumberValue(rental.bathrooms),
    added: toOptionalStringValue(rental.added),
    userId: getUserId(rental),
  };
};

const looksLikeRental = (value: unknown): value is RawRental => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    "id" in candidate ||
    "_id" in candidate ||
    "title" in candidate ||
    "propertyType" in candidate ||
    "location" in candidate ||
    "price" in candidate ||
    "images" in candidate
  );
};

const extractRentalList = (payload: unknown): RawRental[] => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload.filter(looksLikeRental);
  }

  if (typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const listKeys = [
    "data",
    "rentals",
    "properties",
    "listings",
    "items",
    "results",
    "rows",
    "docs",
  ];

  for (const key of listKeys) {
    const rentals = extractRentalList(record[key]);

    if (rentals.length > 0) {
      return rentals;
    }
  }

  return looksLikeRental(payload) ? [payload] : [];
};

const normalizeProperties = (payload: unknown): Properties => {
  const rentals = extractRentalList(payload);

  if (rentals.length > 0) {
    return rentals.map(normalizeProperty);
  }

  return normalizeRentalListResponse(
    payload as RawRental[] | { rentals?: RawRental[] } | null | undefined,
  ).map((rental) => normalizeProperty(rental));
};

export const fetchProperties = async (): Promise<Properties> => {
  const response = await api.get<
    ApiResponse<RawRental[] | { rentals?: RawRental[] }>
  >(RENTAL_ALL_ENDPOINT, { skipAuthRedirect: true } as ApiRequestConfig);

  return normalizeProperties(response.data);
};

export const searchProperties = async (params: {
  location?: string;
  lat?: number;
  lng?: number;
}): Promise<Properties> => {
  const queryParams = new URLSearchParams();

  if (params.location) {
    queryParams.append("location", params.location);
  }

  if (params.lat !== undefined && params.lng !== undefined) {
    queryParams.append("lat", String(params.lat));
    queryParams.append("lng", String(params.lng));
  }

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `/rental/search?${queryString}`
    : "/rental/search";

  try {
    const response = await api.get<
      ApiResponse<RawRental[] | { rentals?: RawRental[] }>
    >(endpoint, { skipAuthRedirect: true } as ApiRequestConfig);

    return normalizeProperties(response.data);
  } catch (error) {
    if (!params.location) {
      throw error;
    }

    const searchTerm = params.location.toLowerCase().trim();
    const properties = await fetchProperties();

    return properties.filter((property) =>
      [
        property.location,
        property.title,
        property.description,
        property.propertyType,
        property.city,
        property.state,
        property.country,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchTerm)),
    );
  }
};

const fetchPropertyByIdentifier = async (
  identifier: string,
): Promise<Property> => {
  const response = await api.get<ApiResponse<RawRental>>(`/rental/get1/${identifier}`, {
    skipAuthRedirect: true,
  } as ApiRequestConfig);

  return normalizeProperty(response.data.data);
};

export const fetchPropertyBySlug = async (slug: string): Promise<Property> => {
  const identifier = decodeURIComponent(slug).trim();

  try {
    return await fetchPropertyByIdentifier(identifier);
  } catch (error) {
    const properties = await fetchProperties();
    const matchedProperty = properties.find(
      (property) => property.slug === identifier || property.id === identifier,
    );

    if (!matchedProperty) {
      throw error;
    }

    if (matchedProperty.id === identifier) {
      return matchedProperty;
    }

    try {
      return await fetchPropertyByIdentifier(matchedProperty.id);
    } catch {
      return matchedProperty;
    }
  }
};

export const fetchPropertyById = fetchPropertyBySlug;

export const bookProperty = async (rentalId: string) => {
  return progressApi.bookRental(rentalId);
};

export const propertyApi = {
  fetchProperties,
  searchProperties,
  fetchPropertyById,
  fetchPropertyBySlug,
  bookProperty,
};
