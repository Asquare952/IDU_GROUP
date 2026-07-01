import { SidebarItems } from "../types";
import {
  House,
  Lock,
  Heart,
  ClipboardList,
  MessageCircleMore,
  ClipboardCheck,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";

export const sidebarItems: SidebarItems[] = [
  {
    id: 1,
    name: "Dashboard",
    path: "/tenant/dashboard",
    icon: House,
  },
  {
    id: 2,
    name: "My Lock",
    path: "/tenant/locked-house",
    icon: Lock,
  },
  {
    id: 3,
    name: "Saved Houses",
    path: "/tenant/saved-house",
    icon: Heart,
  },
  {
    id: 4,
    name: "My Bookings",
    path: "/tenant/my-bookings",
    icon: ClipboardList,
  },
  {
    id: 5,
    name: "Message",
    path: "/tenant/messages",
    icon: MessageCircleMore,
  },
  {
    id: 6,
    name: "Safety Center",
    path: "/tenant/inspections",
    icon: ClipboardCheck,
  },
  {
    id: 7,
    name: "Safety Center",
    path: "/tenant/safety-center",
    icon: Shield,
  },
  {
    id: 8,
    name: "Settings",
    path: "/tenant/settings",
    icon: Settings,
  },
  {
    id: 9,
    name: "Logout",
    action: "logout",
    icon: LogOut,
  },
];
