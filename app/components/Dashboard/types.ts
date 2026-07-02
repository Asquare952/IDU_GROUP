import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
export type DashboardLayoutProps = {
  children: ReactNode;
};

export type SidebarItems = {
  id: number;
  name: string;
  path?: string;
  action?: "logout";
  icon: LucideIcon;
};

export type DashboardMetrics = {
  id: number;
  name: string;
  figure: string;
  // percentage: number;
  image: string;
};

export type DashboardpropListings = {
  id: number;
  name: string;
  location: string;
  status: string;
  price: number;
  inquiries: number;
  views: number;
  image: string
}

export type RecentInquiries = {
  id: number;
  name: string;
  message: string;
  figure: number;
  image: string;
};
