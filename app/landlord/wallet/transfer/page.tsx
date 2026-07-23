"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { Shield, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import {
  useWallet,
  useTransferFromWallet,
} from "@/app/api/features/wallet/wallet.queries";
import { formatNaira } from "../data/walletData";
import Breadcrumb from "../components/Breadcrumb";

const page = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const { data: walletRes, isLoading: walletLoading } = useWallet();
  const {
    mutate: transfer,
    isPending,
    error,
    isSuccess,
    data,
  } = useTransferFromWallet();

  const wallet = walletRes?.data;

  const handleSend = () => {
    transfer({ accountNumber: accountNumber.trim(), amount: Number(amount) });
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
              { label: "Dashboard", href: "/landlord" },
              { label: "Wallet", href: "/landlord/wallet" },
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
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-xs text-slate-400 mb-1">Wallet Balance</p>
            {walletLoading ? (
              <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-slate-900">
                {wallet ? formatNaira(wallet.balance) : "—"}
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 mb-1">
              Transfer Money
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Send money from your wallet to another RentULO user.
            </p>

            <label className="text-sm font-medium text-slate-700 block mb-2">
              Recipient Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="RentULO-XXXXX"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-slate-900 mb-2 focus:outline-none focus:ring-2 focus:ring-[#43A047]/30 focus:border-[#43A047]"
            />
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2.5 mb-5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Double-check this account number — transfers settle instantly
                and can't be reversed.
              </span>
            </div>

            <label className="text-sm font-medium text-slate-700 block mb-2">
              Amount
            </label>
            <div className="relative mb-6">
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
            {isSuccess && (
              <p className="text-sm text-green-700 mb-4">
                Transfer successful. New balance:{" "}
                {data?.balance ? formatNaira(data.balance) : "—"}
              </p>
            )}

            <button
              onClick={handleSend}
              disabled={
                !accountNumber || !amount || Number(amount) <= 0 || isPending
              }
              className="w-full flex items-center justify-center gap-2 bg-[#43A047] text-white font-medium py-3 rounded-lg hover:bg-[#3d8f40] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send Money
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
