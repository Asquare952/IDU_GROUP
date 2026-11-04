import type { Rental } from "../rental";

export type Property = Omit<Rental, "price"> & {
  slug: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  added?: string;
  userId: string;
  rentalModel?: ShortletRentalModel;
  livingRooms?: number;
  guestCapacity?: number;
  furnishingStatus?: ShortletFurnishingStatus;
  area?: string;
  landmark?: string;
  cleaningFee?: number;
  securityDeposit?: number;
  minimumStay?: number;
  maximumStay?: number;
  availableFrom?: string;
  availableTo?: string;
  checkInTime?: string;
  checkOutTime?: string;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  partiesAllowed?: boolean;
  houseRules?: string[];
};

export type Properties = Property[];

export type ShortletRentalModel =
  | "entire_place"
  | "private_room"
  | "shared_room"
  | "hotel";

export type ShortletFurnishingStatus =
  | "unfurnished"
  | "semi_furnished"
  | "fully_furnished";
