import { Users, DollarSign, Building2, Flag } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface AnalyticStat {
  title: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export const analyticStats: AnalyticStat[] = [
  {
    title: "Total Users",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Total Revenue",
    icon: DollarSign,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "Properties Listed",
    icon: Building2,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "Pending Reports",
    icon: Flag,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];
