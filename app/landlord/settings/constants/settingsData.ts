import {
  Bell,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Info,
} from "lucide-react";

// 1. Navigation Tabs
export const SETTINGS_TABS = [
  { id: "profile", label: "Profile Information", icon: User },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing & Plans", icon: CreditCard },
];

// 2. Notification Toggle List
export const NOTIFICATION_SETTINGS = [
  {
    id: "tenant-req",
    title: "New tenant requests",
    desc: "Get notified when someone requests to view your property",
    defaultActive: true,
  },
  {
    id: "app-updates",
    title: "Application updates",
    desc: "Updates on tenant application status and reviews",
    defaultActive: true,
  },
  {
    id: "insp-reminders",
    title: "Inspection reminders",
    desc: "Reminders for upcoming property inspections",
    defaultActive: true,
  },
  {
    id: "pay-notifs",
    title: "Payment notifications",
    desc: "Alerts for rent payments and deal closures",
    defaultActive: true,
  },
  {
    id: "marketing",
    title: "Marketing emails",
    desc: "Tips, guides, and platform updates",
    defaultActive: false,
  },
];

// 3. Form Field Config (Optional, but keeps your JSX clean)
export const PROFILE_FIELDS = [
  { id: "firstName", label: "First Name", type: "text", placeholder: "John" },
  { id: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
  {
    id: "email",
    label: "Email Address",
    type: "email",
    icon: Mail,
    placeholder: "john.doe@example.com",
  },
  {
    id: "phone",
    label: "Phone Number",
    type: "text",
    icon: Phone,
    placeholder: "+234 810 000 0000",
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    icon: MapPin,
    placeholder: "123 Main Street, Lagos, NG",
  },
];

// 4. Quick Links
export const QUICK_LINKS = [
  "Help Center",
  "Privacy Policy",
  "Terms of Service",
  "Contact Support",
];
