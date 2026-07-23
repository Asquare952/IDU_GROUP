import { ChevronRight, Plus, Send, ArrowUpFromLine } from "lucide-react";
import { useRouter } from "next/navigation";

const QUICK_ACTIONS = [
  {
    icon: Plus,
    title: "Top Up Wallet",
    sub: "Fund your wallet instantly",
    path: "top-up",
  },
  {
    icon: Send,
    title: "Transfer Money",
    sub: "Send money to another RentULO user",
    path: "transfer",
  },
  {
    icon: ArrowUpFromLine,
    title: "Withdraw Money",
    sub: "Withdraw to your bank account",
    path: "withdraw",
  },
];

export default function WalletActions({ basePath }: { basePath: string }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {QUICK_ACTIONS.map(({ icon: Icon, title, sub, path }) => (
        <button
          key={title}
          onClick={() => router.push(`${basePath}/${path}`)}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 text-left hover:border-[#43A047]/40 hover:shadow-sm transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#43A047] flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500 truncate">{sub}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#43A047] transition-colors shrink-0" />
        </button>
      ))}
    </div>
  );
}
