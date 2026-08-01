"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import {
  useWallet,
  useWalletTransactions,
} from "@/app/api/features/wallet/wallet.queries";
import Breadcrumb from "@/app/components/Wallet/Breadcrumb";
import WalletActions from "@/app/components/Wallet/WalletActions";
import WalletSummary from "@/app/components/Wallet/WalletSummary";
import WalletTransactions from "@/app/components/Wallet/WalletTransactions";
import { formatNaira, Tab } from "@/app/landlord/wallet/data/walletData";

/**
 * Shared wallet page shell, reused by both the landlord and tenant routes.
 * Each route just passes in its own breadcrumb link, base path (so the
 * quick actions/transaction rows link to the right sub-routes), page title,
 * and dashboard Layout wrapper — everything else here is identical for both.
 */
const WalletPage = ({
  breadcrumbBase,
  walletBasePath,
  pageTitle,
  Layout,
}: {
  breadcrumbBase: string;
  walletBasePath: string;
  pageTitle: string;
  Layout: ({ children }: { children: ReactNode }) => ReactNode;
}) => {
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
  // Fall back to an empty ledger on error/no-data — the empty state in
  // WalletTransactions handles both "genuinely no transactions yet" and
  // "the fetch failed" the same way, so the user never sees a raw error.
  const transactions = txRes?.data ?? [];

  // Real failures are logged for debugging but never shown to the user directly.
  useEffect(() => {
    if (walletError) console.error("Failed to load wallet:", walletErrorObj);
  }, [walletError, walletErrorObj]);

  useEffect(() => {
    if (txError)
      console.error("Failed to load wallet transactions:", txErrorObj);
  }, [txError, txErrorObj]);

  // Filter the ledger by the active tab (All / Credits / Debits / Pending).
  // "Credit" vs "debit" isn't a field the API gives us directly — we derive
  // it from the transaction type (topup/transfer_in/refund_payment = money
  // coming in, everything else = money going out).
  const filtered = useMemo(() => {
    if (!transactions) return [];
    if (tab === "All") return transactions;
    return transactions.filter((t) => {
      const kind =
        t.status === "pending"
          ? "pending"
          : t.type === "topup" ||
              t.type === "transfer_in" ||
              t.type === "refund_payment"
            ? "credit"
            : "debit";
      return tab === "Credits"
        ? kind === "credit"
        : tab === "Debits"
          ? kind === "debit"
          : kind === "pending";
    });
  }, [transactions, tab]);

  // Running totals for the Wallet Summary card — computed client-side since
  // the API doesn't return pre-aggregated credit/debit totals.
  const { totalCredits, totalDebits } = useMemo(() => {
    if (!transactions) return { totalCredits: 0, totalDebits: 0 };

    return transactions.reduce(
      (acc, t) => {
        if (t.status !== "success") return acc;
        const amount = parseFloat(t.amount);
        const kind =
          t.type === "topup" ||
          t.type === "transfer_in" ||
          t.type === "refund_payment"
            ? "credit"
            : "debit";
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
    <Layout>
      <div className="px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Breadcrumb
              items={[
                { label: "Dashboard", href: breadcrumbBase },
                { label: "Wallet" },
              ]}
            />
            <h1 className="text-2xl font-semibold text-slate-900">
              {pageTitle}
            </h1>
          </div>
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 bg-white px-3.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
            Transaction Limits
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* Balance card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#43A047] px-6 py-7 sm:px-8 sm:py-8 text-white">
              <div className="absolute -right-6 -bottom-10 opacity-[0.14] pointer-events-none select-none">
                <div className="w-56 h-56 rounded-full bg-white/25" />
              </div>

              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                    <span>Available Balance</span>
                    {/*
                      Icon-only toggle instead of a "Hide"/"Show" text label —
                      keeps this compact on mobile. EyeOff shown while the
                      balance IS visible (click it to hide); Eye shown while
                      it's hidden (click it to reveal) — standard convention.
                    */}
                    <button
                      onClick={() => setShowBalance((s) => !s)}
                      className="hover:text-white transition-colors cursor-pointer"
                      aria-label={showBalance ? "Hide balance" : "Show balance"}
                    >
                      {showBalance ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
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
                    {/*
                      Account number stays as text (that's the actual data),
                      but the trailing "Copy"/"Copied" label is now icon-only —
                      Check icon confirms the copy briefly, then reverts to Copy.
                    */}
                    <button
                      onClick={copyAccount}
                      className="inline-flex items-center gap-1.5 font-semibold hover:text-white/90 cursor-pointer"
                      aria-label="Copy account number"
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
            </div>

            {/* Top Up / Transfer / Withdraw — now the OPay-style icon grid */}
            <WalletActions basePath={walletBasePath} />

            <WalletTransactions
              transactions={filtered}
              isLoading={txLoading}
              tab={tab}
              setTab={setTab}
              basePath={walletBasePath}
            />
          </div>

          <WalletSummary
            wallet={wallet}
            totalCredits={totalCredits}
            totalDebits={totalDebits}
          />
        </div>
      </div>
    </Layout>
  );
};

export default WalletPage;
