import api from "../../axios";
import { API_BASE_URL } from "../../axios";
import { getAccessToken } from "@/app/lib/auth";

export interface RentalUser {
  id: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  Profile?: {
    image: string;
    verified: boolean;
  } | null;
}

export interface Rental {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: string | number;
  priceType: string;
  status: "available" | "pending" | "rented" | string;
  images: string[];
  videos: string[];
  UserId: string;
  createdAt: string;
  slug?: string;
  User?: RentalUser | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RentalSearchParams {
  location?: string;
  lat?: number;
  lng?: number;
}

export interface CreateRentalPayload {
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: string | number;
  priceType: string;
  status: string;
  images: File[];
  videos?: File[];
}

export interface UpdateRentalPayload {
  title?: string;
  description?: string;
  propertyType?: string;
  location?: string;
  price?: string | number;
  priceType?: string;
  status?: string;
  images?: File[];
  videos?: File[];
}

export interface RentalRequestOptions {
  skipAuthRedirect?: boolean;
}

export type RawRental = Partial<Rental> & {
  _id?: string;
  userId?: string;
  images?: unknown;
  videos?: unknown;
};

const getApiBaseUrl = () => String(api.defaults.baseURL ?? "").replace(/\/$/, "");

const parseJsonSafely = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const normalizeMediaUrl = (value: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (trimmedValue.startsWith("data:")) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith("//")) {
    return `https:${trimmedValue}`;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`;
  }

  return trimmedValue.startsWith("/")
    ? `${baseUrl}${trimmedValue}`
    : `${baseUrl}/${trimmedValue}`;
};

const normalizeMediaList = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => normalizeMediaList(item))
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return [];
    }

    if (trimmedValue.startsWith("[") || trimmedValue.startsWith("{")) {
      return normalizeMediaList(parseJsonSafely(trimmedValue));
    }

    return [normalizeMediaUrl(trimmedValue)].filter(Boolean);
  }

  if (typeof value === "object") {
    const mediaObject = value as Record<string, unknown>;

    return ["secure_url", "url", "image", "path", "src"]
      .flatMap((key) => normalizeMediaList(mediaObject[key]))
      .filter((item): item is string => Boolean(item));
  }

  return [];
};

export const normalizeRental = (rental: RawRental): Rental => ({
  id: String(rental.id ?? rental._id ?? ""),
  title: rental.title ?? "",
  description: rental.description ?? "",
  propertyType: rental.propertyType ?? "",
  location: rental.location ?? "",
  price: rental.price ?? "",
  priceType: rental.priceType ?? "yearly",
  status: rental.status ?? "available",
  images: normalizeMediaList(rental.images),
  videos: normalizeMediaList(rental.videos),
  UserId: rental.UserId ?? rental.userId ?? "",
  createdAt: rental.createdAt ?? "",
  slug: rental.slug,
  User: rental.User ?? null,
});

export const normalizeRentalListResponse = (
  data: RawRental[] | { rentals?: RawRental[] } | null | undefined,
): Rental[] => {
  if (Array.isArray(data)) {
    return data.map(normalizeRental);
  }

  if (data && Array.isArray(data.rentals)) {
    return data.rentals.map(normalizeRental);
  }

  return [];
};

const buildRentalFormData = (
  payload: CreateRentalPayload | UpdateRentalPayload,
): FormData => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      key !== "images" &&
      key !== "videos"
    ) {
      formData.append(key, String(value));
    }
  });

  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  if (payload.videos && payload.videos.length > 0) {
    payload.videos.forEach((video) => {
      formData.append("videos", video);
    });
  }

  return formData;
};

export const rentalApi = {
  createRental: async (payload: CreateRentalPayload): Promise<Rental> => {
    const formData = buildRentalFormData(payload);
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/rental/post`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    const data = (await response.json()) as ApiResponse<RawRental> & {
      message?: string;
    };

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data,
        },
        message: data?.message || "Failed to upload rental listing.",
      };
    }

    return normalizeRental(data.data);
  },

  getAllRentals: async (options?: RentalRequestOptions): Promise<Rental[]> => {
    const response = await api.get<ApiResponse<RawRental[] | { rentals?: RawRental[] }>>(
      "/rental/all",
      options?.skipAuthRedirect ? ({ skipAuthRedirect: true } as any) : undefined,
    );

    return normalizeRentalListResponse(response.data.data);
  },

  searchRentals: async (
    params: RentalSearchParams,
    options?: RentalRequestOptions,
  ): Promise<Rental[]> => {
    const queryParams = new URLSearchParams();

    if (params.location) {
      queryParams.append("location", params.location);
    }

    if (params.lat !== undefined && params.lng !== undefined) {
      queryParams.append("lat", String(params.lat));
      queryParams.append("lng", String(params.lng));
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/rental/search?${queryString}`
      : "/rental/search";

    const response = await api.get<ApiResponse<RawRental[] | { rentals?: RawRental[] }>>(
      url,
      options?.skipAuthRedirect ? ({ skipAuthRedirect: true } as any) : undefined,
    );

    return normalizeRentalListResponse(response.data.data);
  },

  getRentalById: async (
    id: string,
    options?: RentalRequestOptions,
  ): Promise<Rental> => {
    const response = await api.get<ApiResponse<RawRental>>(`/rental/get1/${id}`, options?.skipAuthRedirect ? ({ skipAuthRedirect: true } as any) : undefined);

    return normalizeRental(response.data.data);
  },

  updateRental: async (
    id: string,
    payload: UpdateRentalPayload,
  ): Promise<Rental> => {
    const formData = buildRentalFormData(payload);
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/rental/update/${id}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    const data = (await response.json()) as ApiResponse<RawRental> & {
      message?: string;
    };

    if (!response.ok) {
      throw {
        response: {
          status: response.status,
          data,
        },
        message: data?.message || "Failed to update rental listing.",
      };
    }

    return normalizeRental(data.data);
  },

  deleteRental: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/rental/delete/${id}`);
  },
};
