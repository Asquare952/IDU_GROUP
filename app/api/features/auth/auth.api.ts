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
  ChangePasswordPayload,
  userProfile,
  updateUserPayload,
} from "./types";

const resolveProfileEndpoint = (userId: string) => `/profile/get1/${userId}`;
const UPDATE_PROFILE_ENDPOINT = "/profile/update";
const CHANGE_PASSWORD_ENDPOINT =
  process.env.NEXT_PUBLIC_CHANGE_PASSWORD_ENDPOINT ?? "/auth/change-password";

const normalizeProfileResponse = (data: any): userProfile => {
  if (data?.data) {
    return data.data;
  }

  if (data?.profile) {
    return data.profile;
  }

  if (data?.user) {
    return data.user;
  }

  return data;
};

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getUserProfile = async (userId: string): Promise<userProfile> => {
  const res = await api.get(resolveProfileEndpoint(userId));
  return normalizeProfileResponse(res.data);
};

export const updateUserProfile = async (
  payload: updateUserPayload,
  _userId: string,
): Promise<userProfile> => {
  const res = await api.put(UPDATE_PROFILE_ENDPOINT, payload);
  return normalizeProfileResponse(res.data);
};

export const changePasswordApi = async (payload: ChangePasswordPayload) => {
  const response = await api.post(CHANGE_PASSWORD_ENDPOINT, payload);
  return response.data; // <-- ADD THIS LINE
}; // <-- ADD THIS CLOSING BRACE

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
