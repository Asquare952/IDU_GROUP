"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  useGetAdminTicket,
  useGetAllTickets,
  useResolveTicket,
  useSendAdminReply,
  useSupportDashboard,
} from "@/app/api/features/support";
import type { TicketStatus } from "@/app/api/features/support/types";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import { toast } from "react-toastify";

const statusColors: Record<TicketStatus, string> = {
  open: "bg-red-100 text-red-800",
  in_progress: "bg-blue-100 text-blue-800",
};
const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

export default function SupportInfoPage() {
  const [selectedRef, setSelectedRef] = useState<string>();
  const [status, setStatus] = useState<"all" | TicketStatus>("all");
  const [message, setMessage] = useState("");
  const { data: ticketResponse, isLoading: isLoadingTickets } =
    useGetAllTickets({
      status: status === "all" ? undefined : status,
      limit: 100,
    });
  const { data: ticket, isLoading: isLoadingTicket } =
    useGetAdminTicket(selectedRef);
  const { data: dashboard } = useSupportDashboard();
  const { mutate: sendReply, isPending: isSending } = useSendAdminReply();
  const { mutate: resolve, isPending: isResolving } = useResolveTicket();
  const tickets = ticketResponse?.data ?? [];
  const submitReply = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRef || !message.trim()) return;
    sendReply(
      { ticketRef: selectedRef, message: message.trim() },
      {
        onSuccess: () => {
          setMessage("");
          toast.success("Reply sent and ticket moved to in progress.");
        },
        onError: () => toast.error("Unable to send reply."),
      },
    );
  };
  const resolveTicket = () => {
    if (
      !selectedRef ||
      !confirm(
        "Resolve this ticket? Its ticket and replies will be permanently deleted.",
      )
    )
      return;
    resolve(selectedRef, {
      onSuccess: () => {
        setSelectedRef(undefined);
        toast.success("Ticket resolved and removed.");
      },
      onError: () => toast.error("Unable to resolve ticket."),
    });
  };
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-8">
        <div className="mx-auto max-w-[1400px]">
          <header className="mb-6">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
              <MessageSquare className="text-[#4CAF50]" size={32} />
              Support tickets
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review, respond to, and resolve customer requests.
            </p>
          </header>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Open queue" value={dashboard?.total_open} />
            <Stat label="Open" value={dashboard?.by_status.open} />
            <Stat
              label="In progress"
              value={dashboard?.by_status.in_progress}
            />
            <Stat label="Urgent" value={dashboard?.by_priority.urgent} />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="flex max-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 p-4">
                <h2 className="mb-3 font-bold text-slate-800">Tickets</h2>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "all" | TicketStatus)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="all">All active tickets</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                </select>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoadingTickets ? (
                  <Loading />
                ) : tickets.length === 0 ? (
                  <Empty text="No tickets found" />
                ) : (
                  tickets.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedRef(item.ticket_ref)}
                      className={`w-full border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${selectedRef === item.ticket_ref ? "bg-[#E8F5E9]" : ""}`}
                    >
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.subject}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.ticket_ref} · {item.user_name}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Badge className={statusColors[item.status]}>
                          {item.status.replace("_", " ")}
                        </Badge>
                        <Badge className={priorityColors[item.priority]}>
                          {item.priority}
                        </Badge>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>
            <section className="flex max-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:col-span-3">
              {!selectedRef ? (
                <Empty text="Select a ticket to view its details" />
              ) : isLoadingTicket ? (
                <Loading />
              ) : !ticket ? (
                <Empty text="Ticket not found" />
              ) : (
                <>
                  <div className="border-b border-slate-100 bg-slate-50 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">
                          {ticket.subject}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          <strong>From:</strong>{" "}
                          {ticket.user?.full_name ?? ticket.user_name}{" "}
                          {ticket.user?.email && `(${ticket.user.email})`}
                        </p>
                        {ticket.user?.phone_no && (
                          <p className="text-sm text-slate-600">
                            <strong>Phone:</strong> {ticket.user.phone_no}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={statusColors[ticket.status]}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      {ticket.description}
                    </p>
                    <button
                      onClick={resolveTicket}
                      disabled={isResolving}
                      className="mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {isResolving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      Resolve & remove
                    </button>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-6">
                    {ticket.replies?.length ? (
                      ticket.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`flex ${reply.sender_role === "admin" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${reply.sender_role === "admin" ? "bg-[#4CAF50] text-white" : "border border-slate-200 bg-white text-slate-800"}`}
                          >
                            <p className="mb-1 text-sm font-medium">
                              {reply.sender?.full_name ??
                                (reply.sender_role === "admin"
                                  ? "Support"
                                  : "Customer")}
                            </p>
                            <p className="text-sm">{reply.message}</p>
                            <p className="mt-1 text-xs opacity-70">
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Empty text="No replies yet" />
                    )}
                  </div>
                  <form
                    onSubmit={submitReply}
                    className="flex gap-2 border-t border-slate-100 bg-white p-4"
                  >
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={2000}
                      rows={3}
                      placeholder="Write a reply…"
                      className="flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                      disabled={isSending}
                    />
                    <button
                      disabled={isSending || !message.trim()}
                      className="flex items-center gap-2 self-end rounded-lg bg-[#4CAF50] px-4 py-3 font-bold text-white disabled:opacity-50"
                    >
                      {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      Send
                    </button>
                  </form>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-bold capitalize ${className}`}
    >
      {children}
    </span>
  );
}
function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-800">{value ?? "–"}</p>
    </div>
  );
}
function Loading() {
  return (
    <div className="flex h-full min-h-32 items-center justify-center">
      <Loader2 className="animate-spin text-[#4CAF50]" />
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-32 items-center justify-center p-4 text-center text-sm text-slate-400">
      <AlertCircle className="mr-2" size={18} />
      {text}
    </div>
  );
}
