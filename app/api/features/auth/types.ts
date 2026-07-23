export interface RegisterPayload {
  full_name: string;
  gender: string;
  role: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  user: string;
  password: string;
}

export interface userProfile {
  id: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  phone_no?: string;
  email: string;
  address?: string;
  state?: string;
  bio?: string;
  profileImage?: string;
  createdAt?: string;
  is_verified?: boolean;
  verified?: boolean;
  withdrawalAccountName?: string;
  withdrawalAccountNumber?: string;
  withdrawalBankName?: string;
}
export interface updateUserPayload {
  bio?: string;
  profileImage?: string | File;
  phone_no?: string;
  address?: string;
  state?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  withdrawalAccountName?: string;
  withdrawalAccountNumber?: string;
  withdrawalBankName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken?: string;
  token?: string;
  role?: "landlord" | "tenant";
  user?: {
    id: string;
    role: "landlord" | "tenant";
    email: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    name?: string;
    phone_no?: string;
    address?: string;
    state?: string;
    bio?: string;
    profileImage?: string;
    createdAt?: string;
    is_verified?: boolean;
    verified?: boolean;
    withdrawalAccountName?: string;
    withdrawalAccountNumber?: string;
    withdrawalBankName?: string;
  };
}

export interface GoogleAuthPayload {
  idToken: string;
}

// Request type for triggering the OTP email
export interface ForgotPasswordRequest {
  email: string;
}
export interface ForgotPasswordResponse {
  message: string;
  status: string;
}
//otp flow
export interface ConfirmOtpRequest {
  email: string;
  otpCode: string;
}

export interface VerifyRegistrationOtpResponse {
  message?: string;
  status?: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}
