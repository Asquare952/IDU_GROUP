export type Property = {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  status: string;
  country?: string;
  images?: string[];
  price: number;
  [key: string]: unknown;
};

export type Properties = Property[];

export type LandlordProfile = {
  id: string;
  user_id: string;
  phone?: string;
  image?: string;
  coverImage?: string;
  [key: string]: unknown;
};

export type LandlordListedProperties = {
  id: string;
  first_name: string;
  last_name: string;
  gender?: string;
  phone_no?: string;
  address?: string;
  state: string;
  country: string;
  role: "landlord";
  is_active: boolean;
  is_superadmin: boolean;
  profile?: LandlordProfile | null;
  rentals: Properties;
  totalListings: number;
  createdAt: string;
  updatedAt: string;
};
