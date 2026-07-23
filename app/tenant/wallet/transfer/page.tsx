"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Tenant-Dashboard/DashboardLayout";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import {
  useWallet,
  useTransferFromWallet,
} from "@/app/api/features/wallet/wallet.queries";
import { formatNaira } from "@/app/landlord/wallet/data/walletData";
import Breadcrumb from "@/app/components/Wallet/Breadcrumb";

const page = () => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const { data: walletRes, isLoading: walletLoading } = useWallet();
  const { mutate: transfer, isPending, error } = useTransferFromWallet();

  const wallet = walletRes?.data;

  const handleContinue = () => {
    transfer(
      { amount: Number(amount), accountNumber: recipient },
      {
        onSuccess: () => {
          window.location.href = "/tenant/wallet";
        },
      },
    );
  };

  const errorMessage = (error as any)?.response?.data?.message as
    | string
    | undefined;

  return (
    <DashboardLayout>
      <div className="px-6 py-8 lg:px-10">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/tenant/dashboard" },
              { label: "Wallet", href: "/tenant/wallet" },
              { label: "Transfer" },
            ]}
          />
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">
              Transfer Money
            </h1>
            <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 bg-white px-3.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <Shield className="w-4 h-4" />
              Transaction Limits
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs text-slate-400 mb-1">Current Balance</p>
              {walletLoading ? (
                <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse mb-4" />
              ) : (
                <p className="text-2xl font-bold text-slate-900 mb-4">
                  {wallet ? formatNaira(wallet.balance) : "—"}
                </p>
              )}
              <p className="text-xs text-slate-400 mb-1.5">Wallet Status</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                {wallet?.status ?? "—"}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#43A047]" />
                <p className="text-sm font-semibold text-slate-900">
                  Your wallet is secure
                </p>
              </div>
              <p className="text-xs text-slate-500">
                All transactions are encrypted and protected with bank-level
                security.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 mb-1">
              Transfer Money
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Send money from your wallet to another RentULO user.
            </p>

            <label className="text-sm font-medium text-slate-700 block mb-2">
              Recipient
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient email or ID"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 mb-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#43A047]/30 focus:border-[#43A047]"
            />

            <label className="text-sm font-medium text-slate-700 block mb-2">
              Amount
            </label>
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ₦
              </span>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-slate-200 rounded-lg pl-8 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#43A047]/30 focus:border-[#43A047]"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            )}

            <button
              onClick={handleContinue}
              disabled={
                !recipient || !amount || Number(amount) <= 0 || isPending
              }
              className="w-full flex items-center justify-center gap-2 bg-[#43A047] text-white font-medium py-3 rounded-lg hover:bg-[#3d8f40] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Transfer Now
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
