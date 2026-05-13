export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  address: string;
  city: string;
  state: string;
  status: string;
  country?: string;
  propertyType?: string;
  priceType?: string;
  images: string[];
  price: number;
};

export type Properties = Property[];

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
  rentals: Properties;
  totalListings: number;
  createdAt: string;
  updatedAt: string;
};
