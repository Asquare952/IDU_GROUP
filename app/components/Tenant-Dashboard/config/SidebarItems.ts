import { SidebarItems } from "../types";
import {
  House,
  Lock,
  Heart,
  MessageCircleMore,
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
    path: "/tenant/dashboard/locked-house",
    icon: Lock,
  },
  {
    id: 3,
    name: "Saved Houses",
    path: "/tenant/dashboard/saved-house",
    icon: Heart,
  },
  {
    id: 4,
    name: "Message",
    path: "/tenant/messages",
    icon: MessageCircleMore,
  },
  {
    id: 5,
    name: "Safety Center",
    path: "/tenant/dashboard/safety-center",
    icon: Shield,
  },
  {
    id: 6,
    name: "Settings",
    path: "/tenant/dashboard/settings",
    icon: Settings,
  },
  {
    id: 7,
    name: "Logout",
    path: "",
    icon: LogOut,
  },
];
