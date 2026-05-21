import {
  AlertTriangle,
  FileText,
  User,
  CheckCircle,
  Shield,
  Mail,
  MessageCircle,
  Search,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

export interface HelpCategory {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  cardBg: string;
  title: string;
  description: string;
}

export interface SafetyFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ContactOption {
  icon: LucideIcon;
  label: string;
  variant: "primary" | "secondary";
}

export const heroData = {
  headline: "How Can We Help You?",
  description:
    "Search our knowledge base or browse categories below to find answers to common questions about Nigeria's most trusted property platform.",
  searchPlaceholder: "Search for help, e.g., 'how to verify my account'",
};

export const helpCategories: HelpCategory[] = [
  {
    icon: AlertTriangle,
    iconColor: "text-red-500",
    iconBg: "bg-red-100",
    cardBg: "bg-red-50",
    title: "Report a Scam",
    description:
      "Encountered a fraudulent listing or agent? Report it here and we'll take immediate action to protect our community.",
  },
  {
    icon: FileText,
    iconColor: "text-[#4CAF50]",
    iconBg: "bg-[#4CAF50]/12",
    cardBg: "bg-[#4CAF50]/5",
    title: "Listing Support",
    description:
      "Need help creating, editing, or managing your property listings? Get step-by-step guidance here.",
  },
  {
    icon: User,
    iconColor: "text-[#4CAF50]",
    iconBg: "bg-[#4CAF50]/12",
    cardBg: "bg-[#4CAF50]/5",
    title: "Account Help",
    description:
      "Issues with login, verification, profile settings, or account security? Find solutions here.",
  },
  {
    icon: CheckCircle,
    iconColor: "text-[#4CAF50]",
    iconBg: "bg-[#4CAF50]/12",
    cardBg: "bg-[#4CAF50]/5",
    title: "Property Verification",
    description:
      "Learn how we verify properties and what documents you need to get your listing approved faster.",
  },
  {
    icon: Shield,
    iconColor: "text-[#4CAF50]",
    iconBg: "bg-[#4CAF50]/12",
    cardBg: "bg-[#4CAF50]/5",
    title: "Inspection Issues",
    description:
      "Scheduling conflicts, virtual tour problems, or inspection disputes? We're here to help.",
  },
  {
    icon: FileText,
    iconColor: "text-[#4CAF50]",
    iconBg: "bg-[#4CAF50]/12",
    cardBg: "bg-[#4CAF50]/5",
    title: "Payment Concerns",
    description:
      "Questions about rent payments, deposits, refunds, or our zero-commission policy? Get clarity here.",
  },
];

export const safetyData = {
  badge: {
    icon: Shield,
    label: "TRUST & SAFETY",
  },
  headline: "Your Safety is Our Priority",
  description:
    "Renting in Nigeria should be secure and transparent. We've built protocols to protect you from the first search to the final payment.",
  features: [
    {
      icon: CheckCircle,
      title: "Never pay before inspection",
      description:
        "We ensure no agent will demand payment before you physically inspect the property.",
    },
    {
      icon: CheckCircle,
      title: "Verify listings",
      description:
        "Every property on RentULO undergoes rigorous verification before going live.",
    },
    {
      icon: CheckCircle,
      title: "Report suspicious agents",
      description:
        "Our system flags and removes bad actors to keep the platform safe for everyone.",
    },
  ] as SafetyFeature[],
};

export const contactData = {
  headline: "Can't find what you need?",
  description:
    "Our dedicated support team is available 24/7 to help you navigate your renting journey with complete peace of mind.",
  responseTime: "Average response time: < 2 minutes",
  options: [
    {
      icon: MessageCircle,
      label: "Chat with Us",
      variant: "primary" as const,
    },
    {
      icon: Mail,
      label: "Email Support",
      variant: "secondary" as const,
    },
  ] as ContactOption[],
};

export const footerData = {
  brand: "RentULO",
  copyright: "© 2026 RentULO. All rights reserved.",
};
