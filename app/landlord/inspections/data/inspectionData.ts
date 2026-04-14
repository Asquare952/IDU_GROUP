export interface Inspection {
  id: number;
  property: string;
  address: string;
  date: string;
  time: string;
  type: "Routine" | "Move-out" | "Move-in";
}

export const inspectionData: Inspection[] = [
  {
    id: 1,
    property: "Sunset Boulevard Unit 5A",
    address: "2847 Sunset Blvd",
    date: "Apr 15, 2026",
    time: "10:00 AM",
    type: "Routine",
  },
  {
    id: 2,
    property: "Harbor View Apartment 2B",
    address: "891 Harbor Street",
    date: "Apr 16, 2026",
    time: "2:30 PM",
    type: "Move-out",
  },
  {
    id: 3,
    property: "Pine Street House",
    address: "1234 Pine Street",
    date: "Apr 18, 2026",
    time: "9:00 AM",
    type: "Move-in",
  },
];