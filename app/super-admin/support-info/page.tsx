"use client";

import React, { useState } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import {
  useGetAllTickets,
  useSendAdminMessage,
  useUpdateTicketStatus,
} from "@/app/api/features/support";
import { SupportTicket, TicketStatus } from "@/app/api/features/support/types";
import {
  Loader2,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

const SupportInfoPage = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | TicketStatus>("all");
  const [adminMessage, setAdminMessage] = useState("");

  const { data: tickets = [], isLoading } = useGetAllTickets({
    status: filterStatus === "all" ? undefined : filterStatus,
  });
  const { mutate: sendMessage, isPending: isSending } = useSendAdminMessage();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateTicketStatus();

  const selectedTicket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId)
    : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !adminMessage.trim()) return;

    sendMessage(
      { ticketId: selectedTicket.id, content: adminMessage },
      {
        onSuccess: () => {
          setAdminMessage("");
          toast.success("Message sent!");
        },
        onError: () => {
          toast.error("Failed to send message");
        },
      },
    );
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    updateStatus(
      { ticketId: selectedTicket.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Ticket marked as ${newStatus}`);
        },
        onError: () => {
          toast.error("Failed to update status");
        },
      },
    );
  };

  const statusColors: Record<TicketStatus, string> = {
    open: "bg-red-100 text-red-800",
    "in-progress": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-[1400px] mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare size={32} className="text-[#4CAF50]" />
              Support Tickets
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage user support requests and respond to inquiries
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col max-h-[600px]">
              <div className="p-4 bg-slate-50 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 mb-3">Tickets</h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
                >
                  <option value="all">All Tickets</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2
                      className="animate-spin text-[#4CAF50]"
                      size={24}
                    />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    No tickets found
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {tickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full text-left p-4 hover:bg-slate-50 transition ${
                          selectedTicketId === ticket.id ? "bg-[#E8F5E9]" : ""
                        }`}
                      >
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {ticket.subject}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {ticket.userName}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span
                            className={`px-2 py-0.5 text-xs font-bold rounded ${
                              statusColors[ticket.status]
                            }`}
                          >
                            {ticket.status}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-bold rounded ${
                              priorityColors[ticket.priority]
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col max-h-[600px]">
              {selectedTicket ? (
                <>
                  {/* Ticket Header */}
                  <div className="p-6 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {selectedTicket.subject}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          <strong>From:</strong> {selectedTicket.userName}
                          {selectedTicket.userEmail &&
                            ` (${selectedTicket.userEmail})`}
                        </p>
                        {selectedTicket.userPhone && (
                          <p className="text-sm text-slate-600">
                            <strong>Phone:</strong> {selectedTicket.userPhone}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded ${
                            statusColors[selectedTicket.status]
                          }`}
                        >
                          {selectedTicket.status}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded ${
                            priorityColors[selectedTicket.priority]
                          }`}
                        >
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                      {selectedTicket.description}
                    </p>

                    <div className="flex gap-2 mt-4 flex-wrap">
                      {selectedTicket.status !== "closed" && (
                        <>
                          {selectedTicket.status !== "in-progress" && (
                            <button
                              onClick={() => handleStatusChange("in-progress")}
                              disabled={isUpdating}
                              className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                              Mark In Progress
                            </button>
                          )}
                          {selectedTicket.status !== "resolved" && (
                            <button
                              onClick={() => handleStatusChange("resolved")}
                              disabled={isUpdating}
                              className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => handleStatusChange("closed")}
                        disabled={
                          isUpdating || selectedTicket.status === "closed"
                        }
                        className="px-4 py-2 bg-gray-500 text-white text-sm font-bold rounded-lg hover:bg-gray-600 disabled:opacity-50"
                      >
                        Close Ticket
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {selectedTicket.messages.length === 0 ? (
                      <p className="text-center text-slate-400 text-sm mt-8">
                        No messages yet
                      </p>
                    ) : (
                      selectedTicket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderRole === "user"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.senderRole === "user"
                                ? "bg-white border border-slate-200 text-slate-800"
                                : "bg-[#4CAF50] text-white"
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              {msg.senderName}
                            </p>
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.senderRole === "user"
                                  ? "text-slate-400"
                                  : "text-green-100"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply Form */}
                  <form
                    onSubmit={handleSendMessage}
                    className="border-t border-slate-100 p-4 bg-white flex gap-2"
                  >
                    <textarea
                      value={adminMessage}
                      onChange={(e) => setAdminMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4CAF50] resize-none"
                      rows={3}
                      disabled={isSending || selectedTicket.status === "closed"}
                    />
                    <button
                      type="submit"
                      disabled={
                        isSending ||
                        !adminMessage.trim() ||
                        selectedTicket.status === "closed"
                      }
                      className="px-4 py-2 bg-[#4CAF50] text-white font-bold rounded-lg hover:bg-[#43A047] disabled:opacity-50 transition flex items-center gap-2"
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
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <AlertCircle
                      size={48}
                      className="text-slate-300 mx-auto mb-4"
                    />
                    <p className="text-slate-400 text-lg">
                      Select a ticket to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportInfoPage;
