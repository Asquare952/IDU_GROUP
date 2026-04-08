import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
export type DashboardLayoutProps = {
  children: ReactNode;
};

export type SidebarItems = {
  id: number;
  name: string;
  path: string;
  icon: LucideIcon;
};

export type DashboardMetrics = {
  id: number;
  name: string;
  figure: string;
  icon: LucideIcon;
};

export type SafetyTips = {
  id: number;
  name: string;
  desc: string;
  icon: LucideIcon;
};
