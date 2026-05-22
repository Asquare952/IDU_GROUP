import {
  FileText,
  Users,
  Home,
  Shield,
  Lock,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface Subsection {
  title: string;
  content: string;
}

export interface Section {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections?: Subsection[];
  bullets?: string[];
}

export const heroData = {
  headline: "Terms & Privacy",
  description:
    "Our commitment to transparency, safety, and responsible platform usage. We've designed our policies to be as clear and accessible as possible.",
  lastUpdated: "Last updated: May 24, 2026",
};

export const navItems: NavItem[] = [
  { id: "terms", label: "Terms of Service", icon: FileText },
  { id: "responsibilities", label: "User Responsibilities", icon: Users },
  { id: "listings", label: "Property Listings", icon: Home },
  { id: "fraud", label: "Fraud Prevention", icon: Shield },
  { id: "payments", label: "Payments & Fees", icon: FileText },
  { id: "privacy", label: "Privacy Policy", icon: Lock },
  { id: "data", label: "Data Collection", icon: FileText },
  { id: "security", label: "Security Practices", icon: Shield },
  { id: "suspension", label: "Account Suspension", icon: Users },
  { id: "contact", label: "Contact Information", icon: HelpCircle },
];

export const sections: Section[] = [
  {
    id: "terms",
    number: "1",
    title: "Terms of Service",
    content:
      "By accessing or using the RentULO platform, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and RentULO regarding your use of our real estate verification and listing services in the Nigerian market. We reserve the right to modify these terms at any time. Your continued use of the platform following any such modifications constitutes your acceptance of the new terms. We will notify users of significant changes via the email address associated with their account.",
  },
  {
    id: "responsibilities",
    number: "2",
    title: "User Responsibilities",
    content:
      "All users of RentULO are expected to act with integrity and respect. This section outlines what we expect from renters, landlords, and agents using our platform.",
    subsections: [
      {
        title: "Integrity",
        content:
          "Users must provide accurate, current, and complete information during the registration process and maintain the accuracy of such information.",
      },
      {
        title: "Compliance",
        content:
          "You are responsible for compliance with all local, state, and federal laws and regulations applicable to your property transactions.",
      },
    ],
  },
  {
    id: "listings",
    number: "3",
    title: "Property Listings",
    content:
      "RentULO serves as a verification layer and marketplace. All listings must undergo our proprietary verification process, which includes title deed authentication and physical inspection validation where applicable.",
    bullets: [
      "All photos must be recent and represent the actual state of the property.",
      "Pricing must be transparent, including any additional service charges or legal fees.",
      "Property descriptions must not contain discriminatory language or misleading claims.",
    ],
  },
  {
    id: "privacy",
    number: "5",
    title: "Privacy Policy",
    content:
      "Privacy is not an afterthought at RentULO. It is the foundation of our trust ecosystem. We collect only the data necessary to provide a secure and efficient real estate experience.",
    subsections: [
      {
        title: "What we collect",
        content:
          "Name, contact details, government-issued ID for verification, and transaction history.",
      },
      {
        title: "How we use it",
        content:
          "To verify identities, process transactions, improve platform security through machine learning.",
      },
      {
        title: "Who we share it with",
        content:
          "Verified transaction partners involved in your rental process and regulatory authorities when legally required.",
      },
    ],
  },
];

export const fraudData = {
  id: "fraud",
  number: "4",
  title: "Fraud Prevention & Security",
  headline: "Our Trust Guarantee",
  description:
    "Our radical transparency model is built on zero-tolerance for fraudulent activities. We utilize advanced AI-driven anomaly detection and manual verification cycles to protect every transaction.",
  features: [
    { icon: "shield", label: "End-to-End Encryption" },
    { icon: "check", label: "Manual Verification" },
  ],
};

export const ctaData = {
  headline: "Questions about our policies?",
  description:
    "Our legal team is here to help clarify any concerns you might have about our terms.",
  buttonLabel: "Contact Support",
};
