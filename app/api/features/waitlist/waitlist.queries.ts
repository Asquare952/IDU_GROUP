import { useMutation, useQuery } from "@tanstack/react-query";
import { waitlistApi } from "./waitlist.api";

export const waitlistKeys = {
  all: ["waitlist"] as const,
  admin: () => [...waitlistKeys.all, "admin"] as const,
};

export const useJoinWaitlist = () => {
  return useMutation({
    mutationFn: (email: string) => waitlistApi.joinWaitlist(email),
  });
};

export const useAdminWaitlist = () => {
  return useQuery({
    queryKey: waitlistKeys.admin(),
    queryFn: waitlistApi.getAdminWaitlist,
  });
};
