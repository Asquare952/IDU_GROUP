"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Send,
  ArrowUpFromLine,
  ChevronRight,
  Shield,
  Headphones,
  Gift,
  Home,
  Loader2,
} from "lucide-react";
import {
  useWallet,
  useWalletTransactions,
} from "@/app/api/features/wallet/wallet.queries";
import {
  TABS,
  formatNaira,
  getKind,
  getTypeLabel,
  getStatusLabel,
  getSubtext,
  formatDate,
  type Tab,
} from "./data/walletData";
import Breadcrumb from "./components/Breadcrumb";

function RentuloMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${light ? "bg-white/20" : "bg-[#43A047]"}`}
      >
        <Home
          className="w-4.5 h-4.5 text-white"
          strokeWidth={2.4}
          fill="white"
          fillOpacity={0.15}
        />
      </div>
      <span className="text-[17px] font-bold tracking-tight">
        <span className={light ? "text-white" : "text-slate-900"}>Rent</span>
        <span className={light ? "text-white" : "text-[#43A047]"}>ULO</span>
      </span>
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "pending" | "failed";
}) {
  const map = {
    success: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    failed: "bg-red-50 text-red-600",
  } as const;
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[tone]}`}
    >
      {label}
    </span>
  );
}

const QUICK_ACTIONS = [
  {
    icon: Plus,
    title: "Top Up Wallet",
    sub: "Fund your wallet instantly",
    href: "/landlord/wallet/top-up",
  },
  {
    icon: Send,
    title: "Transfer Money",
    sub: "Send money to another RentULO user",
    href: "/landlord/wallet/transfer",
  },
  {
    icon: ArrowUpFromLine,
    title: "Withdraw Money",
    sub: "Withdraw to your bank account",
    href: "/landlord/wallet/withdraw",
  },
];

const page = () => {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [tab, setTab] = useState<Tab>("All");
  const [copied, setCopied] = useState(false);

  const {
    data: walletRes,
    isLoading: walletLoading,
    isError: walletError,
    error: walletErrorObj,
  } = useWallet();
  const {
    data: txRes,
    isLoading: txLoading,
    isError: txError,
    error: txErrorObj,
  } = useWalletTransactions();

  const wallet = walletRes?.data;
  // Fall back to an empty ledger on error/no-data instead of surfacing a raw error to the user —
  // real failures are still logged below for debugging.
  const transactions = txRes?.data ?? [];

  useEffect(() => {
    if (walletError) console.error("Failed to load wallet:", walletErrorObj);
  }, [walletError, walletErrorObj]);

  useEffect(() => {
    if (txError)
      console.error("Failed to load wallet transactions:", txErrorObj);
  }, [txError, txErrorObj]);

  const filtered = useMemo(() => {
    if (!transactions) return [];
    if (tab === "All") return transactions;
    return transactions.filter((t) => {
      const kind = getKind(t);
      return tab === "Credits"
        ? kind === "credit"
        : tab === "Debits"
          ? kind === "debit"
          : kind === "pending";
    });
  }, [transactions, tab]);

  const { totalCredits, totalDebits } = useMemo(() => {
    if (!transactions) return { totalCredits: 0, totalDebits: 0 };
    return transactions.reduce(
      (acc, t) => {
        if (t.status !== "success") return acc;
        const amount = parseFloat(t.amount);
        const kind = getKind(t);
        if (kind === "credit") acc.totalCredits += amount;
        if (kind === "debit") acc.totalDebits += amount;
        return acc;
      },
      { totalCredits: 0, totalDebits: 0 },
    );
  }, [transactions]);

  const copyAccount = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Breadcrumb
              items={[
                { label: "Dashboard", href: "/landlord" },
                { label: "Wallet" },
              ]}
            />
            <h1 className="text-2xl font-semibold text-slate-900">Wallet</h1>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 bg-white px-3.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            <Shield className="w-4 h-4" />
            Transaction Limits
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* balance card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#43A047] px-6 py-7 sm:px-8 sm:py-8 text-white">
              <div className="absolute -right-6 -bottom-10 opacity-[0.14] pointer-events-none select-none">
                <Home
                  className="w-56 h-56"
                  strokeWidth={1.2}
                  fill="white"
                  fillOpacity={0.25}
                />
              </div>

              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <span>Available Balance</span>
                    <button
                      onClick={() => setShowBalance((s) => !s)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {showBalance ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {walletLoading ? (
                    <div className="h-10 w-40 bg-white/15 rounded-lg animate-pulse" />
                  ) : (
                    <>
                      <p className="text-4xl sm:text-[42px] font-bold tracking-tight tabular-nums">
                        {showBalance
                          ? formatNaira(wallet?.balance ?? 0)
                          : "₦••••••.••"}
                      </p>
                      {wallet && (
                        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          {wallet.status}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {wallet && (
                  <div className="text-sm sm:text-right">
                    <p className="text-white/70 mb-1">Account Name</p>
                    <p className="font-semibold mb-3">{wallet.accountName}</p>
                    <p className="text-white/70 mb-1">Account Number</p>
                    <button
                      onClick={copyAccount}
                      className="inline-flex items-center gap-1.5 font-semibold hover:text-white/90 cursor-pointer"
                    >
                      {wallet.accountNumber}
                      {copied ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="relative mt-2">
                <RentuloMark light />
              </div>
            </div>

            {/* quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {QUICK_ACTIONS.map(({ icon: Icon, title, sub, href }) => (
                <button
                  key={title}
                  onClick={() => router.push(href)}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 text-left hover:border-[#43A047]/40 hover:shadow-sm transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#43A047] flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#43A047] transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* transactions */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">
                  Recent Transactions
                </h2>
                <button className="text-sm font-medium text-[#43A047] border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-green-50 cursor-pointer">
                  View All
                </button>
              </div>
              <div className="flex items-center gap-1 px-5 pt-3">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      tab === t
                        ? "bg-green-50 text-[#43A047]"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {txLoading ? (
                <div className="flex items-center justify-center py-16 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="px-5 py-10 text-sm text-slate-500">
                  No transactions yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mt-2">
                    <thead>
                      <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                        <th className="font-medium px-5 py-3">Transaction</th>
                        <th className="font-medium px-5 py-3">Type</th>
                        <th className="font-medium px-5 py-3">Amount</th>
                        <th className="font-medium px-5 py-3">Status</th>
                        <th className="font-medium px-5 py-3">Date</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t) => {
                        const kind = getKind(t);
                        const sign =
                          kind === "credit" ? "+" : kind === "debit" ? "-" : "";
                        return (
                          <tr
                            key={t.id}
                            onClick={() =>
                              router.push(
                                `/landlord/wallet/transaction/${t.id}`,
                              )
                            }
                            className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 cursor-pointer"
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                    kind === "credit"
                                      ? "bg-green-50 text-green-600"
                                      : kind === "debit"
                                        ? "bg-red-50 text-red-500"
                                        : "bg-amber-50 text-amber-600"
                                  }`}
                                >
                                  <ArrowUpFromLine className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-slate-900 truncate">
                                    {getTypeLabel(t)}
                                  </p>
                                  <p className="text-xs text-slate-400 truncate">
                                    {getSubtext(t)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-slate-500">
                              {getTypeLabel(t)}
                            </td>
                            <td
                              className={`px-5 py-3.5 font-medium tabular-nums ${kind === "credit" ? "text-green-600" : "text-slate-900"}`}
                            >
                              {sign}
                              {formatNaira(t.amount)}
                            </td>
                            <td className="px-5 py-3.5">
                              <StatusPill
                                label={getStatusLabel(t)}
                                tone={
                                  t.status === "success"
                                    ? "success"
                                    : t.status === "pending"
                                      ? "pending"
                                      : "failed"
                                }
                              />
                            </td>
                            <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                              {formatDate(t.createdAt).label}
                            </td>
                            <td className="px-5 py-3.5 text-slate-300">
                              <ChevronRight className="w-4 h-4" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* right rail */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <ArrowUpFromLine className="w-4 h-4 text-[#43A047]" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Wallet Summary
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Available Balance</span>
                  <span className="font-semibold">
                    {formatNaira(wallet?.balance ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Credits</span>
                  <span className="font-semibold text-green-600">
                    {formatNaira(totalCredits)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Debits</span>
                  <span className="font-semibold text-red-500">
                    {formatNaira(totalDebits)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#43A047]" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Account Security
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Your wallet is protected with bank-level security.
              </p>
              <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                Secure
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Need Help?
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                We're here to help you 24/7 with customer support.
              </p>
              <button className="text-xs font-medium text-white bg-slate-900 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer">
                Contact Support
              </button>
            </div>

            <div className="bg-[#43A047] rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">Invite & Earn</h3>
              </div>
              <p className="text-xs text-white/80 mb-3">
                Invite other landlords to RentULO and earn rewards.
              </p>
              <button className="text-xs font-medium bg-white text-[#43A047] px-3 py-2 rounded-lg hover:bg-white/90 cursor-pointer">
                Invite Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
