import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { login } from "./auth.api";
import { register } from "./auth.api";
import { toast } from "react-toastify";

export const useLogin = () =>
  useMutation({
    mutationFn: login,

    onSuccess: (data: any) => {
      console.log("Login response data:", data); // Debug log
      if (!data || !data.role) {
        toast.error("Invalid response data");
        return;
      }
      Cookies.set("ACCESS_TOKEN", data.token, { expires: 1 });
      toast.success("Login successful");
      if (data.role === "landlord") {
        window.location.href = "/landlord/dashboard";
      } else if (data.role === "tenant") {
        window.location.href = "/tenant/homepage";
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
