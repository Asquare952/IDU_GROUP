import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  login,
  register,
  confirmVerifyOtpApi,
  forgotPasswordApi,
  confirmOtpApi,
  resetPasswordApi,
  changePasswordApi,
  getUserProfile,
  updateUserProfile,
  googleAuth,
} from "./auth.api";
import {
  AuthResponse,
  ConfirmOtpRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordRequest,
  ChangePasswordPayload,
  GoogleAuthPayload,
  userProfile,
  updateUserPayload,
  VerifyRegistrationOtpResponse,
} from "./types";
import { writeCachedProfile } from "./profile-cache";

// ==============================
// LOGIN
// ==============================
export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: login,
  });

// ==============================
// GOOGLE AUTH
// ==============================
export const useGoogleAuth = () =>
  useMutation<AuthResponse, Error, GoogleAuthPayload>({
    mutationFn: googleAuth,
  });

// ==============================
// REGISTER
// ==============================
export const useRegister = () => {
  const router = useRouter();

  return useMutation<unknown, Error, RegisterPayload>({
    mutationFn: register,
    onSuccess: (_data, variables) => {
      // toast.success("Account created successfully");
      router.push(
        `/confirm-registration-otp?email=${encodeURIComponent(variables.email)}`,
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });
};

// ==============================
// VERIFY REGISTRATION OTP
// ==============================

export const useConfirmVerifyOtp = () => {
  const router = useRouter();

  return useMutation<VerifyRegistrationOtpResponse, Error, ConfirmOtpRequest>({
    mutationFn: confirmVerifyOtpApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Email verified successfully!");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Invalid or expired OTP code",
      );
    },
  });
};

// ==============================
// USER PROFILE
// ==============================
export const useUserProfile = (userId?: string, enabled = true) => {
  return useQuery<userProfile, Error>({
    queryKey: ["user-profile", userId ?? "me"],
    queryFn: () => getUserProfile(userId as string),
    enabled: enabled && !!userId,
  });
};

export const useUpdateUserProfile = (userId?: string) => {
  const queryClient = useQueryClient();

    const router = useRouter();

  return useMutation<userProfile, Error, updateUserPayload>({
    mutationFn: (payload) => updateUserProfile(payload, userId as string),
    onSuccess: (data: any, variables) => {
      const queryKey = ["user-profile", userId ?? "me"];
      const existingProfile =
        queryClient.getQueryData<Partial<userProfile>>(queryKey);
      const hasProfileShape =
        !!data &&
        (typeof data?.id === "string" ||
          typeof data?.email === "string" ||
          typeof data?.first_name === "string");

      const mergedProfile = {
        ...existingProfile,
        ...(hasProfileShape ? data : {}),
        ...variables,
      } as userProfile;

      queryClient.setQueryData(queryKey, mergedProfile);

      const storedProfile = Cookies.get("USER_PROFILE");
      const parsedStoredProfile = storedProfile
        ? JSON.parse(storedProfile)
        : {};
      const nextProfile = {
        ...parsedStoredProfile,
        ...(hasProfileShape ? data : {}),
        ...variables,
      };

      Cookies.set("USER_PROFILE", JSON.stringify(nextProfile), { expires: 1 });
      writeCachedProfile(nextProfile);

      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      if (error?.response?.status === 404) {
        toast.error(
          "Profile update endpoint not found. Check the backend route.",
        );
        return;
      }

      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};

// ==============================
// CHANGE PASSWORD
// ==============================
export const useChangePassword = () => {
  return useMutation<unknown, Error, ChangePasswordPayload>({
    mutationFn: changePasswordApi,
    onSuccess: (data: any) => {
      toast.success(data?.message || "Password updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    },
  });
};

// ==============================
// FORGOT PASSWORD
// ==============================
export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordRequest>({
    mutationFn: forgotPasswordApi,
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Recovery email sent successfully!");
      router.push(`/confirm-otp?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to send recovery email",
      );
    },
  });
};

// ==============================
// CONFIRM OTP
// ==============================
export const useConfirmOtp = () => {
  const router = useRouter();

  return useMutation<unknown, Error, ConfirmOtpRequest>({
    mutationFn: confirmOtpApi,
    onSuccess: (_, variables) => {
      toast.success("OTP Verified Successfully!");
      const params = new URLSearchParams({
        email: variables.email,
        otpCode: variables.otpCode,
      });

      router.push(`/reset-password?${params.toString()}`);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Invalid or expired OTP code",
      );
    },
  });
};

// ==============================
// RESET PASSWORD
// ==============================
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation<unknown, Error, ResetPasswordRequest>({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully! Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    },
  });
};
