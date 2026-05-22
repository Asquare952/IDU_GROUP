import { AlertTriangle, Clock, CheckCircle, ShieldAlert } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SafetyStat {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface Report {
  id: string;
  dateTime: string;
  reporter: string;
  reporterDetail: string;
  category: string;
  severity: "High" | "Critical" | "Medium" | "Low";
  status: "Pending" | "Under Review" | "Resolved";
}

export interface CriticalReport {
  type: string;
  description: string;
  reporter: string;
  date: string;
}

export const safetyStats: SafetyStat[] = [
  {
    title: "Pending Reports",
    value: "47",
    icon: AlertTriangle,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    title: "Under Review",
    value: "23",
    icon: Clock,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Resolved",
    value: "184",
    icon: CheckCircle,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "Critical Issues",
    value: "12",
    icon: ShieldAlert,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
];

export const filterTabs = [
  "All Reports",
  "Pending",
  "Under Review",
  "Resolved",
  "Critical",
];

export const reports: Report[] = [
  {
    id: "SR-2026-0847",
    dateTime: "Apr 27, 2026\n09:15 AM",
    reporter: "Sarah Johnson",
    reporterDetail: "3BR Apartment, Lekki",
    category: "Property Issue",
    severity: "High",
    status: "Pending",
  },
  {
    id: "SR-2026-0846",
    dateTime: "Apr 27, 2026\n08:30 AM",
    reporter: "Michael Chen",
    reporterDetail: "Studio, VI",
    category: "Safety Concern",
    severity: "Critical",
    status: "Under Review",
  },
  {
    id: "SR-2026-0845",
    dateTime: "Apr 26, 2026\n04:45 PM",
    reporter: "Grace Wilson",
    reporterDetail: "2BR Flat, Ikeja",
    category: "Harassment",
    severity: "Critical",
    status: "Resolved",
  },
  {
    id: "SR-2026-0844",
    dateTime: "Apr 26, 2026\n02:20 PM",
    reporter: "David Okafor",
    reporterDetail: "Duplex, Ikoyi",
    category: "Property Issue",
    severity: "Medium",
    status: "Resolved",
  },
  {
    id: "SR-2026-0843",
    dateTime: "Apr 26, 2026\n11:00 AM",
    reporter: "Emma Brown",
    reporterDetail: "Penthouse, Banana Island",
    category: "Security Issue",
    severity: "High",
    status: "Pending",
  },
];

export const criticalReports: CriticalReport[] = [
  {
    type: "Safety Concern",
    description: "Fire exit blocked by landlord's storage items",
    reporter: "Michael Chen",
    date: "Apr 27, 2026",
  },
  {
    type: "Harassment",
    description: "Inappropriate behavior from maintenance staff",
    reporter: "Grace Wilson",
    date: "Apr 26, 2026",
  },
];