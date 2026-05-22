export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  imageCount: number;
  tenantCount: number;
  landlord: string;
  status: "Available" | "Occupied" | "Under Review";
  image: string;
}

export const propertyStats = {
  total: 8492,
  available: 1284,
  occupied: 6847,
  underReview: 361,
};

export const properties: Property[] = [
  {
    id: "1",
    title: "Luxury 3BR Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦450,000/month",
    imageCount: 12,
    tenantCount: 1,
    landlord: "John Doe Properties",
    status: "Occupied",
    image: "bg-green-600",
  },
  {
    id: "2",
    title: "Modern Studio",
    location: "Victoria Island, Lagos",
    price: "₦320,000/month",
    imageCount: 8,
    tenantCount: 0,
    landlord: "John Doe Properties",
    status: "Available",
    image: "bg-green-500",
  },
  {
    id: "3",
    title: "Family Duplex",
    location: "Ikoyi, Lagos",
    price: "₦850,000/month",
    imageCount: 15,
    tenantCount: 1,
    landlord: "John Doe Properties",
    status: "Occupied",
    image: "bg-green-700",
  },
  {
    id: "4",
    title: "2BR Apartment",
    location: "Ikeja GRA, Lagos",
    price: "₦380,000/month",
    imageCount: 6,
    tenantCount: 0,
    landlord: "Sarah Properties Ltd",
    status: "Under Review",
    image: "bg-green-800",
  },
  {
    id: "5",
    title: "Penthouse Suite",
    location: "Banana Island, Lagos",
    price: "₦2,500,000/month",
    imageCount: 20,
    tenantCount: 0,
    landlord: "Premium Estates",
    status: "Available",
    image: "bg-green-600",
  },
];

export const filterTabs = [
  { label: "All Properties", value: "all", count: null },
  { label: "Available", value: "available", count: 1284 },
  { label: "Occupied", value: "occupied", count: 6847 },
  { label: "Under Review", value: "under-review", count: 361 },
] as const;
