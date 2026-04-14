import { SidebarItems } from "../types";
import {
  LayoutDashboard,
  Plus,
  MessageCircleMore,
  Settings,
  LogOut,
  List,
  ChartNoAxesCombined,
  ClipboardCheck,
  CircleQuestionMark,
} from "lucide-react";

export const sidebarItems: SidebarItems[] = [
  {
    id: 1,
    name: "Dashboard",
    path: "/landlord/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    name: "My listings",
    path: "/landlord/my-listings",
    icon: List,
  },
  {
    id: 3,
    name: "Upload Listings",
    path: "/landlord/upload-listings",
    icon: Plus,
  },
  {
    id: 4,
    name: "Message",
    path: "/landlord/messages",
    icon: MessageCircleMore,
  },
  {
    id: 5,
    name: "Insight and Analytics",
    path: "/landlord/insight-analytics",
    icon: ChartNoAxesCombined,
  },
  {
    id: 6,
    name: "Inspections",
    path: "/landlord/inspections",
    icon: ClipboardCheck,
  },
];

export const sidebarItems2: SidebarItems[] = [
  {
    id: 1,
    name: "Help",
    path: "/landlord/help",
    icon: CircleQuestionMark,
  },
  {
    id: 2,
    name: "Settings",
    path: "/landlord/settings",
    icon: Settings,
  },
  {
    id: 3,
    name: "Logout",
    path: "",
    icon: LogOut,
  },
];
