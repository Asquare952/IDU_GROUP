"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import {
  useWallet,
  useTopUpWallet,
} from "@/app/api/features/wallet/wallet.queries";
import { formatNaira } from "../data/walletData";
import Breadcrumb from "../components/Breadcrumb";

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000];

const page = () => {
  const [amount, setAmount] = useState("");
  const { data: walletRes, isLoading: walletLoading } = useWallet();
  const { mutate: initializeTopUp, isPending, error } = useTopUpWallet();

  const wallet = walletRes?.data;

  const handleQuickAmount = (value: number) => setAmount(String(value));

  const handleContinue = () => {
    initializeTopUp(
      { amount: Number(amount) },
      {
        onSuccess: (data) => {
          window.location.href = data.link;
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
              { label: "Dashboard", href: "/landlord/dashboard" },
              { label: "Wallet", href: "/landlord/wallet" },
              { label: "Top Up" },
            ]}
          />
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">
              Top Up Wallet
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
              Top Up Your Wallet
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Fund your wallet to pay for locks, rent, inspections and more.
            </p>

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

            <p className="text-sm font-medium text-slate-700 mb-2">
              Quick Amounts
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {QUICK_AMOUNTS.map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickAmount(value)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                    Number(amount) === value
                      ? "bg-[#43A047] border-[#43A047] text-white"
                      : "border-slate-200 text-slate-700 hover:border-[#43A047]/40"
                  }`}
                >
                  ₦{value.toLocaleString("en-NG")}
                </button>
              ))}
            </div>

            <div className="flex items-start gap-2 bg-green-50 text-green-700 text-xs rounded-lg px-3.5 py-3 mb-5">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                You will be redirected to Flutterwave to complete your payment
                securely.
              </span>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            )}

            <button
              onClick={handleContinue}
              disabled={!amount || Number(amount) <= 0 || isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#43A047] text-white font-medium py-3 rounded-lg hover:bg-[#3d8f40] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Continue to Flutterwave
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
