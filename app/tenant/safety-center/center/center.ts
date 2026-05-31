import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Flag,
  Info,
  MessageCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import type { ToastOptions } from "react-toastify";
import { toast } from "react-toastify";
import type { ReportType } from "@/app/api/features/report";
export type { ReportType };

export type ReportTargetField = "search_name" | "report_user_id";

export type ReportTemplate = {
  targetField: ReportTargetField;
  targetLabel: string;
  targetPlaceholder: string;
  targetHint: string;
  defaultReportType: ReportType;
};

export const reportTemplates: Record<number, ReportTemplate | null> = {
  1: {
    targetField: "search_name",
    targetLabel: "Listing name",
    targetPlaceholder: "Enter the property title or search name",
    targetHint: "This will be sent as `search_name`.",
    defaultReportType: "fraud",
  },
  2: {
    targetField: "report_user_id",
    targetLabel: "Agent user ID",
    targetPlaceholder: "Enter the agent's user ID",
    targetHint: "This will be sent as `report_user_id`.",
    defaultReportType: "fraud",
  },
  3: null,
};

export const reportTypeOptions: Array<{ value: ReportType; label: string }> = [
  { value: "fraud", label: "Fraud / Scam" },
  { value: "harassment", label: "Harassment" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
];

export const safetyActionFeedback: Record<number, string> = {
  2: "Support contact is not connected yet. Please file a report for suspicious listings or agents.",
  3: "Location sharing is not connected yet in this build.",
};

export const safetyCenterIconMap: Record<string, LucideIcon> = {
  Flag,
  AlertTriangle,
  MessageCircle,
  ShieldCheck,
  UserCheck,
  Info,
};

export const reportSuccessToastOptions: ToastOptions = {
  style: {
    background: "#43A047",
    color: "#FFFFFF",
    border: "1px solid #43A047",
  },
};

// Toastify `info` toasts are blue by default.
// Use this helper for Safety Center notices so the accent stays green.
export const showGreenSafetyToast = (message: string) => {
  toast.success(message);
};
