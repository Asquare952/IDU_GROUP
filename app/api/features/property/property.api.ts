import axiosInstance from "../../axios";
import Cookies from "js-cookie";
import { LandlordListedProperties, Properties } from "./types";

const RENTAL_ALL_ENDPOINT = "/rental/all";

const getAuthHeaders = () => {
  const token = Cookies.get("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const normalizeLandlordListedProperties = (
  data: LandlordListedProperties | { data?: LandlordListedProperties },
) => {
  if ("data" in data && data.data) {
    return data.data;
  }

  return data as LandlordListedProperties;
};

export const fetchProperties = async (): Promise<Properties> => {
  const response = await axiosInstance.get(RENTAL_ALL_ENDPOINT, getAuthHeaders());
  return response.data;
};

export const fetchLandlordListedProperties =
  async (): Promise<LandlordListedProperties> => {
    const response = await axiosInstance.get(
      RENTAL_ALL_ENDPOINT,
      getAuthHeaders(),
    );

    return normalizeLandlordListedProperties(response.data);
};

export const bookProperty = async (rentalId: string) => {
  const response = await axiosInstance.post(
    "/progress/book",
    { rental_id: rentalId },
    getAuthHeaders(),
  );
  return response.data;
};
