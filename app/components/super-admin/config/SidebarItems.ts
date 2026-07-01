import { SidebarItems } from "../types";
import {
  LayoutDashboard,
  User2,
  Building2,
  DollarSign,
  NotepadText,
  ChartColumn,
  MessageSquare,
  BadgeAlert,
  Settings,
  MessageCircleMore
} from "lucide-react";

export const sidebarItems: SidebarItems[] = [
  {
    id: 1,
    name: "Dashboard",
    path: "/super-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    name: "User Management",
    path: "/super-admin/user-management",
    icon: User2,
  },
  {
    id: 3,
    name: "Properties",
    path: "/super-admin/properties",
    icon: Building2,
  },
  {
    id: 4,
    name: "Transactions",
    path: "/super-admin/transactions",
    icon: DollarSign,
  },
  {
    id: 5,
    name: "Reports",
    path: "/super-admin/reports",
    icon: NotepadText,
  },
  {
    id: 6,
    name: "Analytics",
    path: "/super-admin/analytics",
    icon: ChartColumn,
  },
  {
    id: 7,
    name: "Messages",
    path: "/super-admin/messages",
    icon: MessageSquare,
  },
  {
    id: 8,
    name: "Safety & Reports",
    path: "/super-admin/safety-and-reports",
    icon: BadgeAlert,
  },
  {
    id: 9,
    name: "Support Info",
    path: "/super-admin/support-info",
    icon: MessageCircleMore,
  },
  {
    id: 10,
    name: "Settings",
    path: "/super-admin/settings",
    icon: Settings,
  },
];
