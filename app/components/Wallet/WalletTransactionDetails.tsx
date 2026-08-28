"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { useWalletTransactions } from "@/app/api/features/wallet/wallet.queries";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
  Share2,
  Loader2,
} from "lucide-react";
import {
  formatNaira,
  getKind,
  getTypeLabel,
  getStatusLabel,
  getPaymentMethod,
  getCounterparty,
  formatDate,
} from "@/app/landlord/wallet/data/walletData";
import Breadcrumb from "@/app/components/Wallet/Breadcrumb";
import type { ComponentType, ReactNode } from "react";
import { toast } from "react-toastify";

const printAsPdf = (
  title: string,
  content: string,
  status: string,
  amount: string,
) => {
  const printWindow = window.open("", "_blank", "width=800,height=900");

  if (!printWindow) {
    toast.error("Please allow pop-ups to download the PDF receipt.");
    return;
  }

  const escapedContent = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
  const normalizedStatus = status.toLowerCase();
  const statusClass = normalizedStatus.includes("fail")
    ? "failed"
    : normalizedStatus.includes("pending")
      ? "pending"
      : "successful";

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; background: #f3f5f7; font-family: Arial, sans-serif; color: #162b4c; }
          .page { position: relative; width: 100%; max-width: 430px; min-height: 760px; margin: 24px auto; padding: 28px 24px; overflow: hidden; background: white; }
          .watermarks { position: absolute; inset: 130px 0 0; display: grid; grid-template-columns: repeat(2, 1fr); grid-auto-rows: 150px; align-items: center; justify-items: center; overflow: hidden; pointer-events: none; }
          .watermark { transform: rotate(-28deg); color: #43a047; opacity: .055; font-size: 22px; font-weight: 800; white-space: nowrap; }
          .brand { position: relative; display: flex; align-items: center; gap: 10px; padding-bottom: 22px; border-bottom: 1px solid #e6eaed; }
          .brand img { width: 42px; height: 42px; border-radius: 10px; object-fit: cover; }
          .brand-name { color: #43a047; font-size: 20px; font-weight: 800; }
          .brand-name span { color: #162b4c; }
          .heading { position: relative; padding: 28px 0 20px; text-align: center; }
          h1 { margin: 0 0 14px; color: #162b4c; font-size: 19px; }
          .status { display: inline-block; border-radius: 20px; padding: 7px 15px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          .status.successful { background: #e8f5e9; color: #238b3d; }
          .status.failed { background: #ffebee; color: #d32f2f; }
          .status.pending { background: #fff4e5; color: #b76e00; }
          .amount { margin-top: 20px; color: #162b4c; font-size: 34px; font-weight: 800; }
          .receipt { position: relative; margin-top: 10px; border-top: 1px dashed #cbd3d8; border-bottom: 1px dashed #cbd3d8; padding: 16px 0; font-size: 12px; line-height: 1.8; }
          .receipt br { content: ""; display: block; margin: 3px 0; }
          .footer { position: relative; padding-top: 22px; text-align: center; color: #87929b; font-size: 11px; }
          @media print { body { background: white; } .page { margin: 0 auto; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="watermarks">
            <span class="watermark">Rent<span style="color:#43a047">ULO</span></span>
            <span class="watermark">Rent<span style="color:#43a047">ULO</span></span>
            <span class="watermark">Rent<span style="color:#43a047">ULO</span></span>
            <span class="watermark">Rent<span style="color:#43a047">ULO</span></span>
            <span class="watermark">Rent<span style="color:#43a047">ULO</span></span>
            <span class="watermark">Rent<span style="color:#43a047">ULO</span></span>
          </div>
          <div class="brand">
            <img src="/IDU%20GROUP%20LOGO.png" alt="RentULO logo" />
            <div class="brand-name"><span>Rent</span><span style="color:#43a047">ULO</span></div>
          </div>
          <div class="heading">
            <h1>${title}</h1>
            <span class="status ${statusClass}">${status}</span>
            <div class="amount">${amount}</div>
          </div>
          <div class="receipt">${escapedContent}</div>
          <div class="footer">Thank you for using RentULO</div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.setTimeout(() => printWindow.print(), 250);
};

const WalletTransactionDetails = ({
  Layout,
  dashboardBase,
  walletBasePath,
}: {
  Layout: ComponentType<{ children: ReactNode }>;
  dashboardBase: string;
  walletBasePath: string;
}) => {
  const params = useParams<{ id: string }>();
  const { data: txRes, isLoading, isError } = useWalletTransactions();
  const transaction = txRes?.data.find((t) => t.id === params.id);

  if (isLoading) {
    return (
      <Layout>
        <div className="px-6 py-8 lg:px-10 flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (isError || !transaction) {
    return (
      <Layout>
        <div className="px-6 py-8 lg:px-10">
          <p className="text-sm text-slate-500">
            {isError
              ? "Couldn't load this transaction. Refresh to try again."
              : "Transaction not found."}
          </p>
        </div>
      </Layout>
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

  const receiptText = [
    "RentULO Transaction Receipt",
    "===========================",
    `Transaction Type: ${getTypeLabel(transaction)}`,
    `Status: ${getStatusLabel(transaction)}`,
    `Date: ${dateOnly}`,
    `Time: ${time}`,
    `Reference: ${transaction.tx_ref}`,
    `Flutterwave Reference: ${transaction.flw_ref ?? "N/A"}`,
    `Amount: ${isCredit ? "+" : "-"}${formatNaira(transaction.amount)}`,
    `Narration: ${transaction.narration ?? "N/A"}`,
    `Counterparty: ${getCounterparty(transaction) ?? "N/A"}`,
    `Payment Method: ${getPaymentMethod(transaction)}`,
  ].join("\n");

  const handleDownloadReceipt = () => {
    printAsPdf(
      "RentULO Transaction Receipt",
      receiptText,
      getStatusLabel(transaction),
      `${isCredit ? "+" : "-"}${formatNaira(transaction.amount)}`,
    );
  };

  const handleShareReceipt = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "RentULO Transaction Receipt",
          text: receiptText,
        });
        return;
      }

      await navigator.clipboard.writeText(receiptText);
      toast.success("Receipt copied to clipboard.");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        toast.error("Unable to share the receipt.");
      }
    }
  };

  return (
    <Layout>
      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: dashboardBase },
              { label: "Wallet", href: walletBasePath },
              { label: "Transactions", href: walletBasePath },
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
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                isCredit ? "bg-green-50" : "bg-red-50"
              }`}
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
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
              <button
                type="button"
                onClick={handleShareReceipt}
                className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 font-medium py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WalletTransactionDetails;
