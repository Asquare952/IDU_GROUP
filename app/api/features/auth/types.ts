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
  accessToken: string;
  user: {
    id: string;
    role: "landlord" | "tenant";
    email: string;
    first_name?: string;
  };
}
