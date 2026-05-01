import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  login,
  register,
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
} from "./types";
import { writeCachedProfile } from "./profile-cache";

// ==============================
// LOGIN
// ==============================
export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: login,
    onSuccess: (data: any) => {
      console.log("Login response data:", data);
      if (!data || !data.role) {
        toast.error("Invalid response data");
        return;
      }
      Cookies.set("ACCESS_TOKEN", data.token, { expires: 1 });
      if (data.user) {
        Cookies.set("USER_PROFILE", JSON.stringify(data.user), { expires: 1 });
        writeCachedProfile(data.user);
      }
      toast.success("Login successful");
      if (data?.role === "landlord") {
        window.location.href = "/landlord/dashboard";
      } else if (data.role === "tenant") {
        window.location.href = "/tenant/dashboard";
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Login failed");
    },
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
export const useRegister = () =>
  useMutation<unknown, Error, RegisterPayload>({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Account created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });

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
