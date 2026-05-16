import {
  DollarSign,
  Users,
  Building2,
  TrendingUp,
  FileText,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ReportType {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface RecentReport {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  size: string;
}

export interface ScheduledReport {
  id: string;
  type: string;
  title: string;
  schedule: string;
  status: "Active" | "Paused" | "Inactive";
  lastRun?: string;
  nextRun?: string;
}
export const reportTypes: ReportType[] = [
  {
    title: "Revenue Report",
    description: "Financial overview",
    icon: DollarSign,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "User Report",
    description: "User analytics",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Property Report",
    description: "Listings & occupancy",
    icon: Building2,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "Performance Report",
    description: "Platform metrics",
    icon: TrendingUp,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

export const recentReports: RecentReport[] = [
  {
    id: "1",
    title: "Monthly Revenue Report",
    description: "Complete breakdown of platform revenue for April 2026",
    date: "Apr 27, 2026",
    type: "Financial",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "User Activity Report",
    description: "User engagement and activity metrics for Q1 2026",
    date: "Apr 25, 2026",
    type: "Analytics",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "Property Listings Report",
    description: "New property listings and occupancy rates for March 2026",
    date: "Apr 20, 2026",
    type: "Properties",
    size: "3.1 MB",
  },
  {
    id: "4",
    title: "Transaction Summary",
    description: "Payment transactions and success rates for April 2026",
    date: "Apr 18, 2026",
    type: "Financial",
    size: "1.2 MB",
  },
];

export const scheduledReports: ScheduledReport[] = [
  {
    id: "1",
    title: "Monthly Revenue Report",
    schedule: "Every 1st of the month at 9:00 AM",
    status: "Active",
    type: "Financial",
  },
  {
    id: "2",
    title: "Weekly User Activity",
    schedule: "Every Monday at 8:00 AM",
    status: "Active",
    type: "Analytics",
  },
  {
    id: "3",
    title: "Quarterly Performance Review",
    schedule: "Every quarter on the 1st at 10:00 AM",
    status: "Active",
    type: "Performance",
  },
];