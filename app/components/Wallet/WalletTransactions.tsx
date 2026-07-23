import { ChevronRight, ArrowUpFromLine } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
  getKind,
  getTypeLabel,
  getStatusLabel,
  getSubtext,
  formatDate,
  formatNaira,
  Tab,
  TABS,
} from "@/app/landlord/wallet/data/walletData";
import type { WalletTransaction } from "@/app/api/features/wallet/type";
import { useRouter } from "next/navigation";

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "pending" | "failed";
}) {
  const map = {
    success: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-600",
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

export default function WalletTransactions({
  transactions,
  isLoading,
  tab,
  setTab,
  basePath,
}: {
  transactions: WalletTransaction[];
  isLoading: boolean;
  tab: Tab;
  setTab: Dispatch<SetStateAction<Tab>>;
  basePath: string;
}) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">Recent Transactions</h2>
        <button
          onClick={() => router.push(basePath)}
          className="text-sm font-medium text-[#43A047] border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-green-50 cursor-pointer"
        >
          View All
        </button>
      </div>
      <div className="flex items-center gap-1 px-5 pt-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${tab === t ? "bg-green-50 text-[#43A047]" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <div className="w-5 h-5 animate-spin rounded-full border-t-2 border-slate-400" />
        </div>
      ) : transactions.length === 0 ? (
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
              {transactions.map((t) => {
                const kind = getKind(t);
                const sign =
                  kind === "credit" ? "+" : kind === "debit" ? "-" : "";
                return (
                  <tr
                    key={t.id}
                    onClick={() =>
                      router.push(`${basePath}/transaction/${t.id}`)
                    }
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${kind === "credit" ? "bg-green-50 text-green-600" : kind === "debit" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}
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
  );
}
