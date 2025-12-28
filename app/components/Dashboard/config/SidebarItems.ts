import { SidebarItems } from "../types";
import {
  LayoutDashboard,
  Plus,
  MessageCircleMore,
  Settings,
  LogOut,
  List,
  ChartNoAxesCombined,
  UsersRound,
  CircleQuestionMark,
} from "lucide-react";

export const sidebarItems: SidebarItems[] = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    name: "My listings",
    path: "/dashboard/my-listings",
    icon: List,
  },
  {
    id: 3,
    name: "Upload Listings",
    path: "/dashboard/upload-listings",
    icon: Plus,
  },
  {
    id: 4,
    name: "Message",
    path: "/dashboard/messages",
    icon: MessageCircleMore,
  },
  {
    id: 5,
    name: "Insight and Analytics",
    path: "/dashboard/insight-and-analytics",
    icon: ChartNoAxesCombined,
  },
  {
    id: 6,
    name: "Clients",
    path: "/dashboard/clients",
    icon: UsersRound,
  },
];

export const sidebarItems2: SidebarItems[] = [
  {
    id: 1,
    name: "Help",
    path: "/dashboard/help",
    icon: CircleQuestionMark,
  },
  {
    id: 2,
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
  {
    id: 3,
    name: "Logout",
    path: "",
    icon: LogOut,
  },
];
