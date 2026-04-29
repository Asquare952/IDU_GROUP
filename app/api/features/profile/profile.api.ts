import api from "../../axios";

export interface ProfileUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no?: string;
  gender?: "male" | "female" | "others";
  address?: string;
  state?: string;
  country?: string;
  role: "tenant" | "landlord";
  createdAt?: string;
}

export interface ProfileData {
  bio?: string;
  profileImage?: string;
  coverImage?: string;
}

export interface ProfileResponse {
  success: boolean;
  data?: {
    user?: ProfileUser;
    profile?: ProfileData;
    rentals?: any[];
  };
  message?: string;
}

export interface UpdateProfilePayload {
  bio?: string;
  profileImage?: File;
  coverImage?: File;
}

export const profileApi = {
  /**
   * Update profile details and upload files
   * Supports bio, profileImage (file), coverImage (file)
   */
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<ProfileResponse> => {
    const formData = new FormData();

    if (payload.bio !== undefined) {
      formData.append("bio", payload.bio);
    }

    if (payload.profileImage) {
      formData.append("profileImage", payload.profileImage);
    }

    if (payload.coverImage) {
      formData.append("coverImage", payload.coverImage);
    }

    const response = await api.put<ProfileResponse>(
      "/profile/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  /**
   * Get user's full profile and their associated rentals (for landlords)
   */
  getProfile: async (userId: string): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>(`/profile/get1/${userId}`);
    return response.data;
  },
};
