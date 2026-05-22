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
};

export type Properties = Property[];
