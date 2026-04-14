import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { login, register, forgotPasswordApi, confirmOtpApi, resetPasswordApi } from "./auth.api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

export const useRegister = () =>
  useMutation({
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

  return useMutation({
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

  return useMutation({
    mutationFn: confirmOtpApi,
    onSuccess: (data, variables) => {
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

  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully! Please login.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reset password"
      );
    },
  });
};
