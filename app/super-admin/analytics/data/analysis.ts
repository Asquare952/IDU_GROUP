import { Users, DollarSign, Building2, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface AnalyticStat {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface Location {
  name: string;
  value: number;
  percentage: number;
}

export interface PropertyType {
  name: string;
  value: number;
  color: string;
}

export interface PlatformActivity {
  label: string;
  value: number;
  sublabel: string;
  color: string;
  bg: string;
}

export const analyticStats: AnalyticStat[] = [
  {
    title: "Total Users",
    value: "24,583",
    change: "+12.5%",
    changeType: "up",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Revenue",
    value: "₦2.4B",
    change: "+18.2%",
    changeType: "up",
    icon: DollarSign,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "Properties Listed",
    value: "8,492",
    change: "+8.3%",
    changeType: "up",
    icon: Building2,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "Occupancy Rate",
    value: "92%",
    change: "-2.1%",
    changeType: "down",
    icon: TrendingUp,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const topLocations: Location[] = [
  { name: "Lekki, Lagos", value: 1284, percentage: 85 },
  { name: "Victoria Island, Lagos", value: 968, percentage: 65 },
  { name: "Ikoyi, Lagos", value: 742, percentage: 50 },
  { name: "Ikeja, Lagos", value: 621, percentage: 42 },
  { name: "Abuja CBD", value: 518, percentage: 35 },
];

export const propertyTypes: PropertyType[] = [
  { name: "Apartments", value: 3247, color: "bg-blue-500" },
  { name: "Houses", value: 2184, color: "bg-green-500" },
  { name: "Studios", value: 1821, color: "bg-purple-500" },
  { name: "Duplexes", value: 892, color: "bg-orange-500" },
  { name: "Penthouses", value: 348, color: "bg-red-500" },
];

export const platformActivity: PlatformActivity[] = [
  {
    label: "New Listings",
    value: 127,
    sublabel: "Last 24 hours",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "New Users",
    value: 284,
    sublabel: "Last 24 hours",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Transactions",
    value: 412,
    sublabel: "Last 24 hours",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];
