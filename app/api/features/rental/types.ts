export interface Rental {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: string | number;
  priceType: string;
  status: "available" | "pending" | "rented" | string;
  images: string[];
  videos: string[];
  createdAt: string;
  slug?: string;
  UserId: string;
}

export interface RentalListResponse {
  rentals: Rental[];
  total: number;
}

export interface RentalSearchParams {
  location?: string;
  lat?: number;
  lng?: number;
}

export interface CreateRentalPayload {
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: string | number;
  priceType: string;
  status: string;
  images: File[];
  videos?: File[];
}

export interface UpdateRentalPayload {
  title?: string;
  description?: string;
  propertyType?: string;
  location?: string;
  price?: string | number;
  priceType?: string;
  status?: string;
  images?: File[];
  videos?: File[];
}

export interface ProfileCompletionError {
  needsProfileCompletion: true;
  message: string;
}
