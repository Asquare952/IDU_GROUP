import { TrendingUp, Users, Eye, Wallet, LucideIcon } from "lucide-react";

export interface StatMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface ChartData {
  name: string;
  views: number;
}

export interface TopProperty {
  id: number;
  title: string;
  views: string;
  image: string;
}

export const MOCK_CHART_DATA: ChartData[] = [
  { name: "Jan", views: 400 },
  { name: "Feb", views: 700 },
  { name: "Mar", views: 1200 },
  { name: "Apr", views: 900 },
];

export const ANALYTICS_STATS: StatMetric[] = [
  {
    label: "Total Views",
    value: "12,405",
    icon: Eye,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "New Inquiries",
    value: "84",
    icon: Users,
    color: "text-[#4CAF50]",
    bg: "bg-[#4CAF50]/10",
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    label: "Est. Revenue",
    value: "₦14.2M",
    icon: Wallet,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export const TOP_PROPERTIES: TopProperty[] = [
  {
    id: 1,
    title: "3-Bedroom Apartment, Lekki",
    views: "4.2k views this month",
    image:
      "/flat7.jpg",
  },
  {
    id: 2,
    title: "Luxury Penthouse, Ikoyi",
    views: "3.8k views this month",
    image:
      "/flat8.jpg",
  },
  {
    id: 3,
    title: "Studio Apartment, Yaba",
    views: "2.5k views this month",
    image:
      "/flat9.jpg",
  },
  {
    id: 4,
    title: "Studio Apartment, Yaba",
    views: "2.5k views this month",
    image:
      "/flat4.jpg",
  },
  {
    id: 5,
    title: "Studio Apartment, Yaba",
    views: "2.5k views this month",
    image:
      "/flat1.jpg",
  },
];
