import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  profileApi,
  ProfileResponse,
  UpdateProfilePayload,
} from "./profile.api";

export const useGetProfile = (
  userId: string | null | undefined,
  options?: Omit<
    UseQueryOptions<ProfileResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ProfileResponse, Error>({
    queryKey: ["profile", userId],
    queryFn: () => profileApi.getProfile(userId!),
    enabled: !!userId,
    ...options,
  });
};

export const useUpdateProfile = (
  options?: Omit<
    UseMutationOptions<ProfileResponse, Error, UpdateProfilePayload>,
    "mutationFn"
  >,
) => {
  return useMutation<ProfileResponse, Error, UpdateProfilePayload>({
    mutationFn: profileApi.updateProfile,
    ...options,
  });
};
