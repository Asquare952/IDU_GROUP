import { title } from "process";
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
} from "lucide-react";

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
    icon: "🔍",
  },
  {
    id: 2,
    name: "Never pay inspection fees",
    desc: "Legitimate landlords never charge for house inspections. Report anyone asking for fees.",
    icon: "💰",
  },
  {
    id: 3,
    name: "Verify landlords before payment",
    desc: "Use RentULO's verification system to confirm landlord identity before making any payments.",
    icon: "✓ ",
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
    img: "/house-placeholder.jpg",
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
    "Your lock will expire in 36 hours. Complete your inspection and submit your application to secure this property. The ₦5,000 lock fee is refundable if the landlord accepts another application.",
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

//savedhouses data

export const SavedHousesData = [
  {
    id: 1,
    title: "3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "1,200,000",
    beds: 3,
    img: "/flat3.jpg",
    isVerified: true,
  },
  {
    id: 2,
    title: "2 Bedroom Apartment",
    location: "Victoria Island, Lagos",
    price: "950,000",
    beds: 2,
    img: "/flat1.jpg",
    isVerified: true,
  },
  {
    id: 3,
    title: "4 Bedroom Duplex",
    location: "Ikeja GRA, Lagos",
    price: "2,500,000",
    beds: 4,
    img: "/flat6.jpg",
    isVerified: true,
  },
  {
    id: 4,
    title: "Studio Apartment",
    location: "Surulere, Lagos",
    price: "450,000",
    beds: 1,
    img: "/flat2.jpg",
    isVerified: true,
  },
  {
    id: 5,
    title: "Penthouse Suite",
    location: "Ikoyi, Lagos",
    price: "5,000,000",
    beds: 4,
    img: "/flat7.jpg",
    isVerified: true,
  },
  {
    id: 6,
    title: "Self-Contain",
    location: "Yaba, Lagos",
    price: "350,000",
    beds: 1,
    img: "/flat4.jpg",
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