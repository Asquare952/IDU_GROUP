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

export type LoginPayload =
  | { email: string; password: string }
  | { phone_no: string; password: string };

export interface AuthResponse {
  accessToken: string;
  // add refreshToken if backend sends it
}
