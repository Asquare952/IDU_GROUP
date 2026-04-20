import { useQuery } from "@tanstack/react-query";
import { getGlobalStatistics } from "./global-statistics.api";

export const useGlobalStatistics = () => {
  return useQuery({
    queryKey: ["global-statistics"],
    queryFn: getGlobalStatistics,
    staleTime: 60_000,
  });
};
