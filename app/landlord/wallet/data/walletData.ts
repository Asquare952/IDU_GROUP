import type { WalletTransaction } from "@/app/api/features/wallet/type";

export type Tab = "All" | "Credits" | "Debits" | "Pending";
export const TABS: Tab[] = ["All", "Credits", "Debits", "Pending"];

export function formatNaira(value: number | string) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

const CREDIT_TYPES = ["topup", "transfer_in", "refund_payment"];
const DEBIT_TYPES = ["withdrawal", "transfer_out"];

// "lock house" / "house rent" / "inspection fee" are marketplace types shared between
// a tenant (payer, debit) and a landlord (role: "landlord", credit) — direction depends on role.
export function getDirection(t: WalletTransaction): "credit" | "debit" {
  if (CREDIT_TYPES.includes(t.type)) return "credit";
  if (DEBIT_TYPES.includes(t.type)) return "debit";
  return t.role === "landlord" ? "credit" : "debit";
}

export function getKind(t: WalletTransaction): "credit" | "debit" | "pending" {
  if (t.status === "pending") return "pending";
  return getDirection(t);
}

const TYPE_LABELS: Record<string, string> = {
  topup: "Top Up",
  withdrawal: "Withdrawal",
  transfer_in: "Transfer Received",
  transfer_out: "Transfer Sent",
  "lock house": "Lock Fee",
  "house rent": "Rent Payment",
  "inspection fee": "Inspection Fee",
  refund_payment: "Refund",
};

export function getTypeLabel(t: WalletTransaction) {
  return TYPE_LABELS[t.type] ?? t.type;
}

const STATUS_LABELS: Record<string, string> = {
  success: "Successful",
  pending: "Pending",
  failed: "Failed",
};

export function getStatusLabel(t: WalletTransaction) {
  return STATUS_LABELS[t.status] ?? t.status;
}

// topup/withdrawal go through Flutterwave; everything else settles wallet-to-wallet internally.
export function getPaymentMethod(t: WalletTransaction) {
  return t.type === "topup" || t.type === "withdrawal"
    ? "Flutterwave"
    : "Wallet Balance";
}

export function getSubtext(t: WalletTransaction) {
  if (t.narration) return t.narration;
  const direction = getDirection(t);
  if (direction === "credit" && t.from_account_name)
    return `From ${t.from_account_name}`;
  if (direction === "debit" && t.to_account_name)
    return `To ${t.to_account_name}`;
  return t.tx_ref;
}

export function getCounterparty(t: WalletTransaction) {
  const direction = getDirection(t);
  return direction === "credit" ? t.from_account_name : t.to_account_name;
}

export function formatDate(createdAt: string) {
  const date = new Date(createdAt);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  });
  const day = date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    time,
    dateOnly: day,
    label: isToday
      ? `Today, ${time}`
      : isYesterday
        ? `Yesterday, ${time}`
        : `${day}, ${time}`,
  };
}
