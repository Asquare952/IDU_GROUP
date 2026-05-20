import {
  Mail,
  Headphones,
  Briefcase,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ContactCard {
  icon: LucideIcon;
  title: string;
  description: string;
  email: string;
  actionLabel: string;
}

export const heroData = {
  headline: "Get In Touch",
  description:
    "We're building the future of Nigerian real estate. Whether you're looking for a trusted home or want to partner with us, our team is here to support you every step of the way.",
};

export const contactCards: ContactCard[] = [
  {
    icon: Mail,
    title: "General",
    description:
      "Ask us anything about RentULO, our services, or our verification process.",
    email: "hello@rentulo.ng",
    actionLabel: "Send Email",
  },
  {
    icon: Headphones,
    title: "Support",
    description:
      "Need help with your account, listings, or tenant verification? We've got you.",
    email: "help@rentulo.ng",
    actionLabel: "Help Center",
  },
  {
    icon: Briefcase,
    title: "Partnerships",
    description:
      "For real estate agents and developers looking to list verified properties.",
    email: "partners@rentulo.ng",
    actionLabel: "Partner With Us",
  },
  {
    icon: Users,
    title: "Careers",
    description:
      "Want to help us build something legendary? Join our growing team.",
    email: "careers@rentulo.ng",
    actionLabel: "View Openings",
  },
];

export const formData = {
  headline: "Send us a message",
  description:
    "Our team typically responds within 2 working hours. We're happy to answer any questions about the platform, partnerships, or press inquiries.",
  fields: {
    firstName: { label: "First Name", placeholder: "Dave" },
    lastName: { label: "Last Name", placeholder: "Smith" },
    email: { label: "Email", placeholder: "john@example.com" },
    subject: {
      label: "Subject",
      placeholder: "General Inquiry",
      options: [
        "General Inquiry",
        "Support",
        "Partnerships",
        "Careers",
        "Press",
      ],
    },
    message: { label: "Message", placeholder: "How can we help you?" },
  },
  submitLabel: "Send Message",
  privacyNote:
    "By submitting, you agree to our Terms of Service and Privacy Policy.",
};

export const socialData = {
  headline: "Follow our journey",
  platforms: [
    {
      name: "X",
      handle: "@Rentulonigeria",
      href: "https://x.com/Rentulonigeria",
    },
    {
      name: "Instagram",
      handle: "@Rentulonigeria",
      href: "https://www.instagram.com/rentulonigeria?igsh=YmF3N2ZjYjRkNjQ2&utm_source=qr",
    },
    {
      name: "Substack",
      handle: "@rentulo",
      href: "https://substack.com/@rentulo",
    },
    {
      name: "TikTok",
      handle: "@Rentulonigeria",
      href: "https://www.tiktok.com/@rentulonigeria?lang=en-GB",
    },
  ],
};

export const footerData = {
  brand: "RentULO",
  tagline: "Discover trusted houses for rents near you.",
  subTagline: "Directly from landlords, verified and location-based.",
  copyright: "2026, RentULO, IDU GROUP",
};
