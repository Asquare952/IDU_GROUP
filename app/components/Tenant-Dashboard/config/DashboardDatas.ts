import { DashboardMetrics, SafetyTips } from "../types";
import {
  Heart,
  Lock,
  Calendar,
  Eye,
  AlertTriangle,
  UserX,
  ShieldAlert,
  MapPin,
  Search,
  Banknote,
  BadgeCheck
} from "lucide-react";

export const ActiveProperty = {
  id: 1,
  title: "2 Bedroom Apartment – Yaba",
  location: "15 Ajayi Road, Yaba, Lagos",
  price: "₦850,000",
  images: [
    "/flat3.webp",
    "/flat4.webp",
    "/flat5.webp",
    "/flat6.webp",
    "/flat2.webp",
    "/flat1.webp",
    "/flat8.webp",
    "/flat7.webp",
  ],
  lockProgress: 75,
  hoursRemaining: "36 hours",
};
export const DashMetrics: DashboardMetrics[] = [
  {
    id: 1,
    name: "Saved house",
    figure: "12",
    icon: Heart,
  },
  {
    id: 2,
    name: "Upcoming Inspections",
    figure: "3",
    icon: Calendar,
  },
  {
    id: 3,
    name: "Total Houses Viewed",
    figure: "47",
    icon: Eye,
  },
  {
    id: 4,
    name: "Active Locks",
    figure: "1",
    icon: Lock,
  },
];

export const Safetytips: SafetyTips[] = [
  {
    id: 1,
    name: "How to spot fake agents",
    desc: "Always verify agent credentials through RentULO. Real agents will have verified badges.",
    icon: Search,
  },
  {
    id: 2,
    name: "Never pay inspection fees",
    desc: "Legitimate landlords never charge for house inspections. Report anyone asking for fees.",
    icon: Banknote,
  },
  {
    id: 3,
    name: "Verify landlords before payment",
    desc: "Use RentULO's verification system to confirm landlord identity before making any payments.",
    icon: BadgeCheck,
  },
];

export const LockedPropertyData = [
  {
    id: 1,
    title: "2 Bedroom Apartment – Yaba",
    address: "15 Ajayi Road, Yaba, Lagos",
    price: "₦850,000",
    period: "/year",
    lockFee: "₦5,000",
    expiry: "36 hours",
    progress: 60,
    landlord: "Mr. Ibrahim Adeyemi",
    isVerified: true,
    images: [
      "/flat3.webp",
      "/flat4.webp",
      "/flat5.webp",
      "/flat6.webp",
    ],
  },
];

export const steps = [
  { id: 1, title: "Lock Paid", status: "completed" },
  {
    id: 2,
    title: "Inspection Scheduled",
    subtitle: "Scheduled for March 16, 2026 at 2:00 PM",
    status: "completed",
  },
  {
    id: 3,
    title: "Application Submitted",
    status: "pending",
  },
  {
    id: 4,
    title: "Deal Closed",
    status: "pending",
  },
];

export const ImportantNoticeData = {
  title: "Important Notice",
  message:
    "Your lock will expire in 24 hours. Complete your inspection and submit your application to secure this property. The ₦5,000 lock fee is refundable if the landlord accepts another application.",
  icon: AlertTriangle,
};

export const SafetyAction = [
  {
    id: 1,
    label: "Report Agent",
    icon: UserX,
    variant: "danger",
  },
  {
    id: 2,
    label: "Alert Support",
    icon: ShieldAlert,
    variant: "Success",
  },
  {
    id: 3,
    label: "Share Location",
    icon: MapPin,
    variant: "Success",
  },
];

export const SavedHousesData = [
  {
    id: 1,
    title: "3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "1,200,000",
    beds: 3,
    img: "/flat1.webp",
    isVerified: true,
  },
  {
    id: 2,
    title: "2 Bedroom Apartment",
    location: "Victoria Island, Lagos",
    price: "950,000",
    beds: 2,
    img: "/flat2.webp",
    isVerified: true,
  },
  {
    id: 3,
    title: "4 Bedroom Duplex",
    location: "Ikeja GRA, Lagos",
    price: "2,500,000",
    beds: 4,
    img: "/flat3.webp",
    isVerified: true,
  },
  {
    id: 4,
    title: "Studio Apartment",
    location: "Surulere, Lagos",
    price: "450,000",
    beds: 1,
    img: "/flat4.webp",
    isVerified: true,
  },
  {
    id: 5,
    title: "Penthouse Suite",
    location: "Ikoyi, Lagos",
    price: "5,000,000",
    beds: 5,
    img: "/flat5.webp",
    isVerified: true,
  },
  {
    id: 6,
    title: "Self-Contain",
    location: "Yaba, Lagos",
    price: "350,000",
    beds: 1,
    img: "/flat6.webp",
    isVerified: true,
  },
];

export const NotificationSettingsData = [
  {
    id: 1,
    label: "New Property Alerts",
    isActive: true,
  },
  {
    id: 2,
    label: "Lock Expiry Reminders",
    isActive: true,
  },
  {
    id: 3,
    label: "Messages from Landlords",
    isActive: true,
  },
  {
    id: 4,
    label: "Marketing Emails",
    isActive: false,
  },
];

export const PrivacySecurityData = [
  { id: 1, label: "Two-Factor Authentication", isActive: true },
  { id: 2, label: "Share Profile with Landlords", isActive: true },
];

export const SupportLinks = [
  { id: 1, label: "Help Center" },
  { id: 2, label: "Contact Support" },
  { id: 3, label: "Terms of Service" },
  { id: 4, label: "Privacy Policy" },
];

export const SafetyBannerData = {
  title: "Need Immediate Help?",
  description:
    "If you're in an unsafe situation or suspect fraud, contact us immediately.",
  emergencyLine: "09058161216-RentULO",
  chatText: "Live Chat Support",
};

export const SafetyReportCards = [
  {
    id: 1,
    title: "Report Fake Listing",
    description:
      "Found a suspicious property listing? Let us know so we can investigate.",
    icon: "Flag",
    color: "red",
    bgColor: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    id: 2,
    title: "Report Agent",
    description:
      "Report fraudulent agents or suspicious behavior during your search.",
    icon: "AlertTriangle",
    color: "orange",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    id: 3,
    title: "Contact RentULO Support",
    description:
      "Get help from our verified support team regarding any safety concerns.",
    icon: "MessageCircle",
    color: "blue",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
];

export const SafetyTipsData = [
  {
    id: 1,
    title: "Never Pay Before Inspection",
    desc: "Legitimate landlords will never ask for payment before you inspect the property. Always visit the property first.",
    icon: "ShieldCheck",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    title: "Verify Landlord Identity",
    desc: "Use RentULO's verification system. Check for the verified badge and confirm identity before making any payments.",
    icon: "UserCheck",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "No Inspection Fees",
    desc: "Real landlords don't charge for inspections. If someone asks for inspection fees, it's likely a scam.",
    icon: "Info",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 4,
    title: "Meet in Safe Locations",
    desc: "Always meet agents or landlords at the property or in public places. Never send money to unverified accounts.",
    icon: "AlertTriangle",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

export const CommonScamsData = [
  {
    id: 1,
    title: "Too Good to Be True Prices",
    desc: "Be wary of properties priced significantly below market rate. Scammers use low prices to attract victims.",
  },
  {
    id: 2,
    title: "Urgent Payment Requests",
    desc: "Scammers create false urgency. Take your time to verify everything before making any payments.",
  },
  {
    id: 3,
    title: "Requests for Direct Bank Transfer",
    desc: "Always use RentULO's secure payment system. Never transfer money directly to unverified accounts.",
  },
  {
    id: 4,
    title: "Landlord Not at Property",
    desc: "Be suspicious if the 'landlord' isn't present during inspection or makes excuses about property access.",
  },
];
