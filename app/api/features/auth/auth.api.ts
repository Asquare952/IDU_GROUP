import api from "../../axios";
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  GoogleAuthPayload,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ConfirmOtpRequest,
  ResetPasswordRequest,
} from "./types";

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const googleAuth = async (
  data: GoogleAuthPayload,
): Promise<AuthResponse> => {
  const response = await api.post("/auth/google-auth", data);
  return response.data;
};

export const forgotPasswordApi = async (
  data: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const confirmOtpApi = async (data: ConfirmOtpRequest): Promise<any> => {
  const response = await api.post("/auth/confirm-otp", data);
  return response.data;
};

export const resetPasswordApi = async (data: ResetPasswordRequest) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
