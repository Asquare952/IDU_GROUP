"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
  Share2,
  Loader2,
} from "lucide-react";
import { useWalletTransactions } from "@/app/api/features/wallet/wallet.queries";
import {
  formatNaira,
  getKind,
  getTypeLabel,
  getStatusLabel,
  getPaymentMethod,
  getCounterparty,
  formatDate,
} from "../../data/walletData";
import Breadcrumb from "../../components/Breadcrumb";

const page = () => {
  const params = useParams<{ id: string }>();
  const { data: txRes, isLoading, isError } = useWalletTransactions();
  const transaction = txRes?.data.find((t) => t.id === params.id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-6 py-8 lg:px-10 flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !transaction) {
    return (
      <DashboardLayout>
        <div className="px-6 py-8 lg:px-10">
          <p className="text-sm text-slate-500">
            {isError
              ? "Couldn't load this transaction. Refresh to try again."
              : "Transaction not found."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const kind = getKind(transaction);
  const isCredit = kind === "credit";
  const { dateOnly, time } = formatDate(transaction.createdAt);

  const rows: [string, string][] = [
    ["Transaction Type", getTypeLabel(transaction)],
    ["Status", getStatusLabel(transaction)],
    ["Date", dateOnly],
    ["Time", time],
    ["Reference (tx_ref)", transaction.tx_ref],
    ["Flutterwave Reference (flw_ref)", transaction.flw_ref ?? "—"],
    ["Amount", `${isCredit ? "+" : "-"}${formatNaira(transaction.amount)}`],
    ["Narration", transaction.narration ?? "—"],
    ["Counterparty", getCounterparty(transaction) ?? "—"],
    ["Payment Method", getPaymentMethod(transaction)],
  ];

  return (
    <DashboardLayout>
      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6">
          {/* TODO: point "Transactions" at a dedicated list page once one exists */}
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/landlord" },
              { label: "Wallet", href: "/landlord/wallet" },
              { label: "Transactions", href: "/landlord/wallet" },
              { label: "Details" },
            ]}
          />
          <h1 className="text-2xl font-semibold text-slate-900">
            Transaction Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center text-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${isCredit ? "bg-green-50" : "bg-red-50"}`}
            >
              {isCredit ? (
                <ArrowUp className="w-6 h-6 text-green-600" />
              ) : (
                <ArrowDown className="w-6 h-6 text-red-500" />
              )}
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              {getTypeLabel(transaction)}
            </p>
            <p className="text-2xl font-bold text-slate-900 mb-3">
              {formatNaira(transaction.amount)}
            </p>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full mb-5 ${
                transaction.status === "success"
                  ? "bg-green-50 text-green-700"
                  : transaction.status === "pending"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-600"
              }`}
            >
              {getStatusLabel(transaction)}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(transaction.tx_ref)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Reference ID: {transaction.tx_ref}
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 mb-4">
              Transaction Details
            </h2>
            <div className="divide-y divide-slate-100">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-slate-400">{label}</span>
                  <span
                    className={`font-medium text-right ${
                      label === "Status" && transaction.status === "success"
                        ? "text-green-600"
                        : "text-slate-900"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <Share2 className="w-4 h-4" />
                Share Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
