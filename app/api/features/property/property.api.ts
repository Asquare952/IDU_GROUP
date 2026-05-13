import api from "../../axios";
import type { AxiosRequestConfig } from "axios";
import { getCurrentUserId } from "@/app/lib/auth";
import { progressApi } from "../progress";
import {
  normalizeRentalListResponse,
  type ApiResponse,
  type RawRental,
  type Rental,
} from "../rental";
import { LandlordListedProperties, Properties } from "./types";

const RENTAL_ALL_ENDPOINT = "/rental/all";

type ApiRequestConfig = AxiosRequestConfig & {
  skipAuthRedirect?: boolean;
};

type ProfileRentalsResponse = {
  success?: boolean;
  data?: {
    user?: Partial<LandlordListedProperties>;
    profile?: LandlordListedProperties["profile"];
    rentals?: RawRental[];
  };
  message?: string;
};

const toProperty = (rental: Rental) => ({
  ...rental,
  price: Number(rental.price) || 0,
  address: String(rental.address ?? ""),
  city: String(rental.city ?? ""),
  state: String(rental.state ?? ""),
});

const normalizeProperties = (
  data: RawRental[] | { rentals?: RawRental[] } | null | undefined,
): Properties => {
  return normalizeRentalListResponse(data).map(toProperty);
};

export const fetchProperties = async (): Promise<Properties> => {
  const response = await api.get<
    ApiResponse<RawRental[] | { rentals?: RawRental[] }>
  >(RENTAL_ALL_ENDPOINT, { skipAuthRedirect: true } as ApiRequestConfig);

  return normalizeProperties(response.data.data);
};

export const fetchLandlordListedProperties =
  async (): Promise<LandlordListedProperties> => {
    const userId = getCurrentUserId();

    if (!userId) {
      throw new Error("You must be logged in to view landlord listings.");
    }

    const response = await api.get<ProfileRentalsResponse>(
      `/profile/get1/${userId}`,
    );
    const profileData = response.data.data;
    const user = profileData?.user;
    const rentals = normalizeProperties(profileData?.rentals);

    return {
      id: String(user?.id ?? userId),
      first_name: String(user?.first_name ?? ""),
      last_name: String(user?.last_name ?? ""),
      gender: typeof user?.gender === "string" ? user.gender : "",
      phone_no: String(user?.phone_no ?? ""),
      address: typeof user?.address === "string" ? user.address : "",
      state: String(user?.state ?? ""),
      country: String(user?.country ?? ""),
      role: "landlord",
      is_active: typeof user?.is_active === "boolean" ? user.is_active : true,
      is_superadmin:
        typeof user?.is_superadmin === "boolean" ? user.is_superadmin : false,
      profile: profileData?.profile ?? null,
      rentals,
      totalListings: rentals.length,
      createdAt: String(user?.createdAt ?? ""),
      updatedAt: String(user?.updatedAt ?? ""),
    };
  };

export const bookProperty = async (rentalId: string) => {
  return progressApi.bookRental(rentalId);
};
