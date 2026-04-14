import { useMutation } from "@tanstack/react-query";
import { login } from "./auth.api";
import { register } from "./auth.api";
import { toast } from "react-toastify";
import { AuthResponse, LoginPayload } from "./types";

export const useLogin = () =>
  useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: login,
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
