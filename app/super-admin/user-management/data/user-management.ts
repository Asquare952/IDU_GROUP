export const filterTabs = [
  "All Users",
  "Tenants",
  "Landlords",
  "Verified",
  "Pending",
  "Suspended",
];

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  type: "Tenant" | "Landlord";
  status: "Verified" | "Pending" | "Suspended";
  joined: string;
  properties: number;
}

export const users: User[] = [
  {
    id: "1",
    name: "Ola Adeniji",
    email: "ola.adeniji@email.com",
    initials: "OA",
    type: "Tenant",
    status: "Verified",
    joined: "May 15, 2026",
    properties: 1,
  },
  {
    id: "2",
    name: "AbdulAfeez Olamilekan",
    email: "abdulafeez@email.com",
    initials: "AO",
    type: "Landlord",
    status: "Suspended",
    joined: "May 20, 2026",
    properties: 5,
  },
  {
    id: "3",
    name: "David Ugochukwu",
    email: "davidu@email.com",
    initials: "DU",
    type: "Landlord",
    status: "Pending",
    joined: "May 19, 2026",
    properties: 12,
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "johnson@email.com",
    initials: "SJ",
    type: "Tenant",
    status: "Verified",
    joined: "Jun 15, 2026",
    properties: 10,
  },
  {
    id: "5",
    name: "Damzy Grayson",
    email: "damzygrayson@email.com",
    initials: "DG",
    type: "Tenant",
    status: "Suspended",
    joined: "Jun 12, 2026",
    properties: 15,
  },
];
