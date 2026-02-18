import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { login } from "./auth.api";
import { register } from "./auth.api";
import { toast } from "react-toastify";

export const useLogin = () =>
  useMutation({
    mutationFn: login,

    // onSuccess: (data) => {
    //   Cookies.set("ACCESS_TOKEN", data.accessToken, {
    //     expires: 1,
    //   });

    //   toast.success("Login successful");

    //   window.location.href = "/";
    // },

    // onError: (error: any) => {
    //   toast.error(error?.response?.data?.message || "Login failed");
    // },
  });

export const useRegister = () =>
  useMutation({
    mutationFn: register,

    onSuccess: () => {
      toast.success("Account created successfully");
      window.location.href = "/login";
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Registration failed");
    },
  });
