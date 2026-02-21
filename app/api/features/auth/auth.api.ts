import api from "../../axios";
import { RegisterPayload, LoginPayload, AuthResponse } from "./types";

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
