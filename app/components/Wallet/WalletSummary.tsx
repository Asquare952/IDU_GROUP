import { formatNaira, Tab, TABS } from "@/app/landlord/wallet/data/walletData";
import { ArrowUpFromLine, Shield, Headphones, Gift } from "lucide-react";
import type { Wallet } from "@/app/api/features/wallet/type";

type WalletSummaryProps = {
  wallet?: Wallet;
  totalCredits: number;
  totalDebits: number;
};

export default function WalletSummary({
  wallet,
  totalCredits,
  totalDebits,
}: WalletSummaryProps) {
  return (
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

      <div className="bg-[#43A047] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm">Invite & Earn</h3>
        </div>
        <p className="text-xs text-white/80 mb-3">
          Invite other users to RentULO and earn rewards.
        </p>
        <button className="text-xs font-medium bg-white text-[#43A047] px-3 py-2 rounded-lg hover:bg-white/90 cursor-pointer">
          Invite Now
        </button>
      </div>
    </div>
  );
}
