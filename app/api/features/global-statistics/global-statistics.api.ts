import api from "../../axios";
import {
  CountValue,
  GlobalStatistics,
  GlobalStatisticsResponse,
} from "./types";

export const EMPTY_GLOBAL_STATISTICS: GlobalStatistics = {
  totalUsers: 0,
  totalListings: 0,
  totalLandlords: 0,
  totalTenants: 0,
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toCount = (...values: CountValue[]) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsedValue = Number(value.replace(/,/g, "").trim());

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return 0;
};

const getStatsSource = (payload: GlobalStatisticsResponse) => {
  if (isRecord(payload.counts)) {
    return payload.counts;
  }

  if (isRecord(payload.data)) {
    return payload.data;
  }

  if (isRecord(payload.statistics)) {
    return payload.statistics;
  }

  return payload;
};

export const normalizeGlobalStatistics = (
  payload: GlobalStatisticsResponse,
): GlobalStatistics => {
  const source = getStatsSource(payload);

  return {
    totalUsers: toCount(
      source.total_users as CountValue,
      source.totalUsers as CountValue,
      source.total_user as CountValue,
      source.users as CountValue,
    ),
    totalListings: toCount(
      source.total_listings as CountValue,
      source.totalListings as CountValue,
      source.total_listing as CountValue,
      source.listings as CountValue,
    ),
    totalLandlords: toCount(
      source.total_landlords as CountValue,
      source.totalLandlords as CountValue,
      source.total_landlord as CountValue,
      source.landlords as CountValue,
    ),
    totalTenants: toCount(
      source.total_tenants as CountValue,
      source.totalTenants as CountValue,
      source.total_tenant as CountValue,
      source.tenants as CountValue,
    ),
  };
};

export const getGlobalStatistics = async (): Promise<GlobalStatistics> => {
  const response = await api.get<GlobalStatisticsResponse>("/counts/");
  return normalizeGlobalStatistics(response.data);
};
