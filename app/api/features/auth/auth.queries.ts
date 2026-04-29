import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  confirmOtpApi,
  forgotPasswordApi,
  googleAuth,
  login,
  register,
  resetPasswordApi,
} from "./auth.api";
import type {
  AuthResponse,
  ConfirmOtpRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordRequest,
} from "./types";

export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: login,
  });

export const useGoogleAuth = () =>
  useMutation<AuthResponse, Error, GoogleAuthPayload>({
    mutationFn: googleAuth,
  });

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

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation<unknown, Error, ResetPasswordRequest>({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully! Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reset password",
      );
    },
  });
};
