import api from "../../axios";
import {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
  GoogleAuthPayload,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ConfirmOtpRequest,
  VerifyRegistrationOtpResponse,
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
  const raw = data?.data ?? data?.profile ?? data?.user ?? data;

  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const fullName =
    (typeof raw.full_name === "string" && raw.full_name.trim()) ||
    (typeof raw.fullName === "string" && raw.fullName.trim()) ||
    "";

  if (fullName && (!raw.first_name || !raw.last_name)) {
    const parts = fullName.split(/\s+/).filter(Boolean);

    return {
      ...raw,
      first_name: raw.first_name ?? parts[0] ?? "",
      last_name: raw.last_name ?? parts.slice(1).join(" ") ?? "",
    };
  }

  return raw;
};

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const confirmVerifyOtpApi = async (
  data: ConfirmOtpRequest,
): Promise<VerifyRegistrationOtpResponse> => {
  const response = await api.post("/auth/verify-registration", data);
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
