export type CountValue = number | string | null | undefined;

export interface GlobalStatistics {
  totalUsers: number;
  totalListings: number;
  totalLandlords: number;
  totalTenants: number;
}

export type GlobalStatisticsResponse = Record<string, unknown> & {
  total_users?: CountValue;
  totalUsers?: CountValue;
  users?: CountValue;
  total_user?: CountValue;
  total_listings?: CountValue;
  totalListings?: CountValue;
  listings?: CountValue;
  total_listing?: CountValue;
  total_landlords?: CountValue;
  totalLandlords?: CountValue;
  landlords?: CountValue;
  total_landlord?: CountValue;
  total_tenants?: CountValue;
  totalTenants?: CountValue;
  tenants?: CountValue;
  total_tenant?: CountValue;
  data?: Record<string, unknown>;
  counts?: Record<string, unknown>;
  statistics?: Record<string, unknown>;
};
