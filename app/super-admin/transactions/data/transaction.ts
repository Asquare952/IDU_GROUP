import { DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface TransactionStat {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export interface Transaction {
  id: string;
  dateTime: string;
  tenant: string;
  tenantDetail: string;
  property: string;
  amount: string;
  method: string;
  status: "Completed" | "Pending" | "Failed";
}

export const transactionStats: TransactionStat[] = [
  {
    title: "Total Today",
    value: "₦124.8M",
    icon: DollarSign,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Completed",
    value: "1,284",
    icon: CheckCircle,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    title: "Pending",
    value: "47",
    icon: Clock,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    title: "Failed",
    value: "12",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
];

export const filterTabs = [
  "All Transactions",
  "Completed",
  "Pending",
  "Failed",
];

export const transactions: Transaction[] = [
  {
    id: "TXN-2026-001234",
    dateTime: "Apr 27, 2026\n10:45 AM",
    tenant: "Ola Adeniji",
    tenantDetail: "to John Doe Properties",
    property: "3BR Apartment, Lekki",
    amount: "₦450,000",
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "TXN-2026-001233",
    dateTime: "Apr 27, 2026\n09:20 AM",
    tenant: "Sarah Johnson",
    tenantDetail: "to Premium Estates",
    property: "Studio, VI",
    amount: "₦320,000",
    method: "Card Payment",
    status: "Pending",
  },
  {
    id: "TXN-2026-001232",
    dateTime: "Apr 26, 2026\n04:15 PM",
    tenant: "Michael Chen",
    tenantDetail: "to Sarah Properties Ltd",
    property: "2BR Flat, Ikeja",
    amount: "₦380,000",
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "TXN-2026-001231",
    dateTime: "Apr 26, 2026\n02:30 PM",
    tenant: "Grace Wilson",
    tenantDetail: "to John Doe Properties",
    property: "Duplex, Ikoyi",
    amount: "₦850,000",
    method: "Card Payment",
    status: "Failed",
  },
  {
    id: "TXN-2026-001230",
    dateTime: "Apr 26, 2026\n11:00 AM",
    tenant: "David Okafor",
    tenantDetail: "to Premium Estates",
    property: "Penthouse, Banana Island",
    amount: "₦2,500,000",
    method: "Bank Transfer",
    status: "Completed",
  },
];
