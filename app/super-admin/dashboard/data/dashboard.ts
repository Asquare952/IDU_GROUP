import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX2,
  UsersRound,
  House,
  ShieldAlert,
  AlertTriangle,
  Database,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Stat {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface UserStat {
  label: string;
  sublabel: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface Activity {
  type: string;
  text: string;
  detail: string;
  time: string;
  color: string;
}

export interface SystemAlert {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  buttonText: string;
  buttonColor: string;
  bgColor: string;
  borderColor: string;
}

export interface QuickStat {
  label: string;
  value: string;
  percentage: number;
  barColor: string;
}

export const stats: Stat[] = [
  {
    title: "Total Users",
    value: "24,583",
    change: "+12%",
    changeType: "up",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Properties",
    value: "8,492",
    change: "+8%",
    changeType: "up",
    icon: Building2,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "Total Revenue",
    value: "₦2.4B",
    change: "+23%",
    changeType: "up",
    icon: DollarSign,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    title: "Active Rentals",
    value: "15,249",
    change: "-3%",
    changeType: "down",
    icon: TrendingUp,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
];

export const userStats: UserStat[] = [
  {
    label: "Verified Users",
    sublabel: "Active & verified accounts",
    value: "18,234",
    icon: UserCheck,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Pending Verification",
    sublabel: "Awaiting approval",
    value: "1,349",
    icon: UserX2,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "Landlords",
    sublabel: "Property owners",
    value: "3,847",
    icon: UsersRound,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Tenants",
    sublabel: "Active renters",
    value: "20,736",
    icon: House,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export const recentActivity: Activity[] = [
  {
    type: "property",
    text: "New property listed",
    detail: "3BR Apartment in Lekki by John Doe Properties",
    time: "2 minutes ago",
    color: "bg-green-500",
  },
  {
    type: "user",
    text: "New user registered",
    detail: "Sarah Johnson joined as tenant",
    time: "15 minutes ago",
    color: "bg-blue-500",
  },
  {
    type: "payment",
    text: "Payment received",
    detail: "₦450,000 from Michael Adekunle",
    time: "1 hour ago",
    color: "bg-yellow-500",
  },
  {
    type: "report",
    text: "Safety report submitted",
    detail: "Tenant reported property issue",
    time: "3 hours ago",
    color: "bg-red-500",
  },
  {
    type: "verification",
    text: "Verification completed",
    detail: "Emma Wilson's ID verified",
    time: "5 hours ago",
    color: "bg-purple-500",
  },
];
export const systemAlerts: SystemAlert[] = [
  {
    icon: ShieldAlert,
    title: "12 Safety Reports Pending",
    description: "Urgent attention required for tenant safety issues",
    buttonText: "Review",
    buttonColor: "bg-red-500 hover:bg-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
    color: "text-red-500",
  },
  {
    icon: AlertTriangle,
    title: "847 Verification Requests",
    description: "Users waiting for account verification",
    buttonText: "Process",
    buttonColor: "bg-orange-500 hover:bg-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
    color: "text-orange-500",
  },
  {
    icon: Database,
    title: "Database Backup Needed",
    description: "Last backup was 6 days ago",
    buttonText: "Backup",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-100",
    color: "text-yellow-500",
  },
];

export const quickStats: QuickStat[] = [
  {
    label: "Platform Usage",
    value: "87%",
    percentage: 87,
    barColor: "bg-green-500",
  },
  {
    label: "Property Occupancy",
    value: "92%",
    percentage: 92,
    barColor: "bg-blue-500",
  },
  {
    label: "Payment Success Rate",
    value: "95%",
    percentage: 95,
    barColor: "bg-green-500",
  },
  {
    label: "User Satisfaction",
    value: "4.7/5",
    percentage: 94,
    barColor: "bg-purple-500",
  },
];
