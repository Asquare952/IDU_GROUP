import { DashboardMetrics, SafetyTips } from "../types";

import { Heart, Lock, Calendar, Eye } from "lucide-react";

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
    img: "/house-placeholder.jpg" 
  }
];
