import {
  Rocket,
  ShieldCheck,
  Shield,
  Home,
  CreditCard,
  UserCircle,
  type LucideIcon,
} from "lucide-react";

export interface FaqCategory {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const heroData = {
  headline: "Frequently Asked Questions",
  description:
    "Everything you need to know about renting with RentULO. Can't find what you're looking for? Reach out to our support team.",
  searchPlaceholder: "Search for answers...",
};

export const categories: FaqCategory[] = [
  {
    icon: Rocket,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    title: "Getting Started",
    description:
      "New to RentULO? Learn how to create an account and start your search.",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    title: "Property Verification",
    description: "Understand how we verify listings and what the badges mean.",
  },
  {
    icon: Shield,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    title: "Renter Safety",
    description:
      "Tips and protocols to keep you safe during your rental journey.",
  },
  {
    icon: Home,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    title: "Listing a Property",
    description:
      "How landlords and agents can list verified properties on our platform.",
  },
  {
    icon: CreditCard,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    title: "Payments & Fees",
    description: "Our zero-commission policy and how payments work on RentULO.",
  },
  {
    icon: UserCircle,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    title: "Account Support",
    description: "Managing your profile, verification, and account settings.",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "What is RentULO?",
    answer:
      "RentULO is Nigeria's most trusted property platform, designed to eliminate rental fraud and hidden fees. We verify every listing and property owner so you can rent with confidence.",
  },
  {
    question: "Are listings verified?",
    answer:
      "Yes. Every property on RentULO undergoes a multi-stage verification process including identity checks, title verification, and physical inspection where possible.",
  },
  {
    question: "How does RentULO reduce scams?",
    answer:
      "We verify landlords and agents, use 4K virtual tours to reduce fake listings, and never allow payment before physical inspection. Our system also flags and removes suspicious accounts.",
  },
  {
    question: "Can agents list properties?",
    answer:
      "Yes, but only vetted agents who pass our verification process. We distinguish between direct-to-owner listings and verified agent listings so you always know who you're dealing with.",
  },
  {
    question: "How do inspections work?",
    answer:
      "We offer both virtual inspections via 4K video tours and scheduled physical inspections. You never pay before seeing the property in person or via live video.",
  },
  {
    question: "How do I report fake listings?",
    answer:
      "Click the 'Report' button on any listing or visit our Help Center. Our team investigates within 24 hours and removes confirmed fraudulent listings immediately.",
  },
  {
    question: "What fees should renters expect?",
    answer:
      "Zero commission on standard listings. The price you see is the price you pay. No hidden agency fees, legal fees, or inspection charges.",
  },
];

export const trustData = {
  headline: "Our Trust Guarantee",
  description:
    "We don't just promise safety — we guarantee it. Every listing is backed by our verification protocol and every transaction is protected.",
  features: [
    "Verified property owners",
    "Secure payment processing",
    "24/7 fraud monitoring",
    "Money-back protection",
  ],
};

export const ctaData = {
  headline: "Still need help?",
  description:
    "Our support team is available around the clock to answer your questions and resolve any issues.",
  primaryLabel: "Contact Support",
  secondaryLabel: "Help Center",
  secondaryHref: "/help-center",
};

export const footerData = {
  brand: "RentULO",
  tagline: "Nigeria's standard for the rental economy.",
  links: {
    Product: ["Find a house", "List a property", "Virtual Tours", "Pricing"],
    Company: ["About Us", "Careers", "Press", "Contact"],
    Resources: ["Blog", "FAQs", "Help Center", "Terms of Service"],
  },
  copyright: "© 2026 RentULO, IDU GROUP. All rights reserved.",
};
