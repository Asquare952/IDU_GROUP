export interface RegisterPayload {
  first_name: string;
  last_name: string;
  gender: string;
  role: string;
  phone_no: string;
  email: string;
  address: string;
  state: string;
  password: string;
}

export interface LoginPayload {
  user: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  token?: string;
  role?: "landlord" | "tenant";
  user?: {
    id: string;
    role: "landlord" | "tenant";
    email: string;
    first_name?: string;
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

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}
