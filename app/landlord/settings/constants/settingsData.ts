import { User, Shield, Bell, CreditCard, Building } from "lucide-react";

export const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business Details", icon: Building },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];
