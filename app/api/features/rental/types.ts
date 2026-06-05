export type RentalStatus = "available" | "pending" | "locked" | "rented" | string;

export interface RentalUser {
  id: string;
  first_name: string;
  last_name: string;
  phone_no: string;
  Profile?: {
    image: string;
    verified: boolean;
  } | null;
}

export interface Rental {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: string | number;
  legalFee: number;
  cautionFee: number;
  brokeFee: number;
  mgtServiceCharge: number;
  priceType: string;
  status: RentalStatus;
  liked?: boolean;
  locked?: boolean;
  booked?: boolean;
  images: string[];
  videos: string[];
  amenities: string[];
  createdAt: string;
  slug?: string;
  UserId: string;
  User?: RentalUser | null;
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
  legalFee: number;
  cautionFee: number;
  brokeFee: number;
  mgtServiceCharge: number;
  priceType: string;
  status: string;
  images: File[];
  videos?: File[];
  amenities?: string[];
}

export interface UpdateRentalPayload {
  title?: string;
  description?: string;
  propertyType?: string;
  location?: string;
  price?: string | number;
  legalFee?: number;
  cautionFee?: number;
  brokeFee?: number;
  mgtServiceCharge?: number;
  priceType?: string;
  status?: string;
  images?: File[];
  videos?: File[];
  amenities?: string[];
}

export interface ProfileCompletionError {
  needsProfileCompletion: true;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface RentalRequestOptions {
  skipAuthRedirect?: boolean;
}

export type LandlordProfile = {
  id: string;
  user_id: string;
  phone: string;
  image: string;
  coverImage: string;
};

export type LandlordListedProperties = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_no: string;
  address: string;
  state: string;
  country: string;
  role: "landlord";
  is_active: boolean;
  is_superadmin: boolean;
  profile: LandlordProfile | null;
  rentals: Rental[];
  totalListings: number;
  createdAt: string;
  updatedAt: string;
};

export type RawRental = Partial<Omit<Rental, "images" | "videos">> & {
  _id?: string;
  userId?: string;
  images?: unknown;
  videos?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  country?: unknown;
  bedrooms?: unknown;
  bathrooms?: unknown;
  added?: unknown;
};
