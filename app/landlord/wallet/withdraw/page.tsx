"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/components/Dashboard/DashboardLayout";
import { Shield, ArrowRight, Landmark, Loader2 } from "lucide-react";
import {
  useWallet,
  useWithdrawFromWallet,
} from "@/app/api/features/wallet/wallet.queries";
import { formatNaira } from "../data/walletData";
import Breadcrumb from "../components/Breadcrumb";

const page = () => {
  const [amount, setAmount] = useState("");
  const { data: walletRes, isLoading: walletLoading } = useWallet();
  const {
    mutate: withdraw,
    isPending,
    error,
    isSuccess,
    data,
  } = useWithdrawFromWallet();

  const wallet = walletRes?.data;

  const handleWithdraw = () => {
    withdraw({ amount: Number(amount) });
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
              { label: "Withdraw" },
            ]}
          />
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">
              Withdraw Money
            </h1>
            <button className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-200 bg-white px-3.5 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <Shield className="w-4 h-4" />
              Transaction Limits
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6 -mt-2">
          Withdraw funds from your wallet to your saved bank account.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  Payout Account
                </p>
                <p className="text-xs text-slate-500">
                  Sent to the bank account saved in{" "}
                  <Link
                    href="/landlord/settings"
                    className="text-[#43A047] hover:underline cursor-pointer"
                  >
                    Settings
                  </Link>
                  . Add one there before withdrawing if you haven't already.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
          <div className="flex items-start gap-2 bg-green-50 text-green-700 text-xs rounded-lg px-3.5 py-3 mb-5">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Withdrawal requests are processed securely via Flutterwave.
            </span>
          </div>

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
          {isSuccess && (
            <p className="text-sm text-green-700 mb-4">
              {data?.message ?? "Withdrawal submitted."}{" "}
              {data?.balance ? `New balance: ${formatNaira(data.balance)}` : ""}
            </p>
          )}

          <button
            onClick={handleWithdraw}
            disabled={!amount || Number(amount) <= 0 || isPending}
            className="w-full flex items-center justify-center gap-2 bg-[#43A047] text-white font-medium py-3 rounded-lg hover:bg-[#3d8f40] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Withdraw Funds
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">
            Withdrawals are typically processed within a few minutes.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
