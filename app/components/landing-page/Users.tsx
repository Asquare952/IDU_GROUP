"use client";

import { useGlobalStatistics } from "@/app/api/features/global-statistics";

const formatCount = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const statItems = [
  { key: "totalUsers", label: "Verified users" },
  { key: "totalLandlords", label: "Verified landlords" },
  { key: "totalListings", label: "Properties listed" },
  { key: "totalTenants", label: "Registered tenants" },
] as const;

const Users = () => {
  const {
    data: globalStatistics,
    isLoading: isLoadingGlobalStatistics,
    isError: hasGlobalStatisticsError,
  } = useGlobalStatistics();

  return (
    <section className="bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center">
          {statItems.map((item, index) => (
            <div
              key={item.key}
              className={`flex flex-col items-center md:items-start md:pl-10 py-8 ${
                index < statItems.length - 1
                  ? "md:border-r border-gray-200"
                  : ""
              }`}
            >
              <h2
                className={`text-4xl md:text-5xl font-bold text-[#1A2B49] mb-2 ${
                  isLoadingGlobalStatistics ? "animate-pulse" : ""
                }`}
              >
                {formatCount(globalStatistics?.[item.key] ?? 0)}
              </h2>
              <p className="text-base md:text-sm font-medium text-gray-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        {hasGlobalStatisticsError ? (
          <p className="mt-6 text-base md:text-sm text-red-500">
            Live platform statistics are unavailable right now.
          </p>
        ) : null}
        <hr className="mt-20 border-gray-100" />
      </div>
    </section>
  );
};

export default Users;
