import { useMutation } from "@tanstack/react-query";
import { waitlistApi } from "./waitlist.api";

export const useJoinWaitlist = () => {
  return useMutation({
    mutationFn: (email: string) => waitlistApi.joinWaitlist(email),
  });
};
