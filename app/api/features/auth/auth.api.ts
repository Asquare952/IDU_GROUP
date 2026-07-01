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

const firstImageString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (Array.isArray(value)) {
      const match = value.find(
        (item): item is string =>
          typeof item === "string" && item.trim() !== "",
      );

      if (match) {
        return match.trim();
      }
    }
  }

  return "";
};

const normalizeProfileResponse = (data: any): userProfile => {
  const raw = data?.data ?? data?.profile ?? data?.user ?? data;

  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const profile = raw.profile ?? {};
  const profileImage = firstImageString(
    raw.profileImage,
    raw.profile_image,
    raw.image,
    raw.avatar,
    profile.profileImage,
    profile.profile_image,
    profile.image,
    profile.avatar,
  );
  const fullName =
    (typeof raw.full_name === "string" && raw.full_name.trim()) ||
    (typeof raw.fullName === "string" && raw.fullName.trim()) ||
    (typeof profile.full_name === "string" && profile.full_name.trim()) ||
    (typeof profile.fullName === "string" && profile.fullName.trim()) ||
    "";

  const normalized = {
    ...raw,
    first_name:
      raw.first_name ??
      raw.firstName ??
      profile.first_name ??
      profile.firstName ??
      (fullName ? (fullName.split(/\s+/).filter(Boolean)[0] ?? "") : ""),
    last_name:
      raw.last_name ??
      raw.lastName ??
      profile.last_name ??
      profile.lastName ??
      (fullName
        ? (fullName.split(/\s+/).filter(Boolean).slice(1).join(" ") ?? "")
        : ""),
    phone_no:
      raw.phone_no ?? raw.phone ?? profile.phone_no ?? profile.phone ?? "",
    address: raw.address ?? profile.address ?? "",
    state: raw.state ?? profile.state ?? profile.location ?? "",
    bio: raw.bio ?? profile.bio ?? "",
    profileImage,
  };

  return normalized;
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
