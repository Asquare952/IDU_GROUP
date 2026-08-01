"use client";

/**
 * Quick action row for the wallet (Top Up / Transfer / Withdraw).
 *
 * This renders TWO different layouts from the same data, and CSS decides
 * which one is actually visible — only one is ever shown at a time:
 *
 *  - Mobile (below the `sm` breakpoint, ~640px): compact OPay-style grid —
 *    icon-in-a-square on top, short label centered underneath, no subtext.
 *    Keeps things tight on small screens.
 *
 *  - Desktop (`sm` breakpoint and up): the original detailed cards — icon
 *    circle on the left, title + description on the right, chevron arrow.
 *    Same as before, untouched.
 *
 * `sm:hidden` on the mobile block and `hidden sm:grid` on the desktop block
 * is what does the actual switching — Tailwind's responsive prefixes.
 */

import { useRouter } from "next/navigation";
import {
  Plus,
  Send,
  ArrowUpFromLine,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

type WalletAction = {
  icon: LucideIcon;
  title: string; // shown on desktop
  subtitle: string; // shown on desktop only
  shortLabel: string; // shown on mobile only
  href: string; // appended to basePath, e.g. "/landlord/wallet" + "/top-up"
};

const ACTIONS: WalletAction[] = [
  {
    icon: Plus,
    title: "Top Up Wallet",
    subtitle: "Fund your wallet instantly",
    shortLabel: "Top Up",
    href: "/top-up",
  },
  {
    icon: Send,
    title: "Transfer Money",
    subtitle: "Send money to another RentULO user",
    shortLabel: "Transfer",
    href: "/transfer",
  },
  {
    icon: ArrowUpFromLine,
    title: "Withdraw Money",
    subtitle: "Withdraw to your bank account",
    shortLabel: "Withdraw",
    href: "/withdraw",
  },
];

export default function WalletActions({ basePath }: { basePath: string }) {
  const router = useRouter();
  const goTo = (href: string) => router.push(`${basePath}${href}`);

  return (
    <>
      {/* ---------- MOBILE: OPay-style icon grid (hidden on sm and up) ---------- */}
      <div className="sm:hidden bg-white border border-slate-200 rounded-xl p-5">
        <div className="grid grid-cols-3 gap-2">
          {ACTIONS.map(({ icon: Icon, shortLabel, href }) => (
            <button
              key={shortLabel}
              type="button"
              onClick={() => goTo(href)}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#43A047] flex items-center justify-center transition-colors group-hover:bg-[#3d8f40]">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-700 text-center">
                {shortLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- DESKTOP: original detailed cards (hidden below sm) ---------- */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ACTIONS.map(({ icon: Icon, title, subtitle, href }) => (
          <button
            key={title}
            type="button"
            onClick={() => goTo(href)}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 text-left hover:border-[#43A047]/40 hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#43A047] flex items-center justify-center shrink-0">
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="text-xs text-slate-500 truncate">{subtitle}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#43A047] transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </>
  );
}
