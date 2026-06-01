import api from "../../axios";
import type { ApiResponse } from "../rental";

export interface WaitlistResponse {
  message: string;
  data?: {
    email: string;
    createdAt?: string;
  };
}

export const waitlistApi = {
  joinWaitlist: async (email: string): Promise<WaitlistResponse> => {
    const response = await api.post<ApiResponse<WaitlistResponse>>(
      "/waitlist",
      { email },
    );
    return response.data.data ?? response.data;
  },
};
