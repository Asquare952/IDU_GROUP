"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircleMore, X, SendHorizontal, Loader2 } from "lucide-react";
import {
  useCreateTicket,
  useSendTicketMessage,
  useGetUserTickets,
} from "@/app/api/features/support";
import type { TicketMessage } from "@/app/api/features/support/types";
import { hasAccessToken } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Support = () => {
  const router = useRouter();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutate: createTicket, isPending: isCreating } = useCreateTicket();
  const { mutate: sendMessage, isPending: isSending } = useSendTicketMessage();
  const { data: userTickets } = useGetUserTickets();

  // Initialize: Get or create a ticket
  useEffect(() => {
    if (!hasAccessToken()) {
      setIsInitialized(true);
      return;
    }

    // Check if user has an open ticket
    if (userTickets && userTickets.length > 0) {
      const openTicket = userTickets.find(
        (t) => t.status === "open" || t.status === "in-progress",
      );
      if (openTicket) {
        setTicketId(openTicket.id);
        setMessages(openTicket.messages || []);
        setIsInitialized(true);
        return;
      }
    }

    // Create a new ticket when support opens
    if (isSupportOpen && !ticketId) {
      createTicket(
        {
          subject: "Support Request",
          description: "User initiated support chat",
          category: "general",
          priority: "medium",
        },
        {
          onSuccess: (ticket) => {
            setTicketId(ticket.id);
            setMessages(ticket.messages || []);
            setIsInitialized(true);
          },
          onError: () => {
            toast.error("Failed to create support ticket");
            setIsInitialized(true);
          },
        },
      );
    } else {
      setIsInitialized(true);
    }
  }, [isSupportOpen, userTickets, createTicket, ticketId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();

    if (!trimmed || isSending || !ticketId) return;

    if (!hasAccessToken()) {
      router.push("/login");
      return;
    }

    setMessage("");

    sendMessage(
      { ticketId, content: trimmed },
      {
        onSuccess: (newMessage) => {
          setMessages((prev) => [...prev, newMessage]);
        },
        onError: () => {
          toast.error("Failed to send message");
          setMessage(trimmed);
        },
      },
    );
  };

  if (!isInitialized) {
    return null;
  }

  const isPending = isCreating || isSending;

  return (
    <div>
      {isSupportOpen && (
        <div className="fixed z-50 bottom-30 right-10 shadow bg-white rounded-t-2xl rounded-b-2xl w-[360px] max-w-[calc(100vw-2.5rem)] h-[520px] flex flex-col">
          <header className="sticky top-0 flex items-center justify-between bg-[#43A047] py-6 px-3 rounded-t-2xl shrink-0">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-white text-[18px]">RentULO Support</h2>
              <p className="text-white text-[13px]">
                We typically reply within a few hours
              </p>
            </div>
            <button
              onClick={() => setIsSupportOpen(false)}
              className="cursor-pointer text-white hover:bg-[#3A8C3D] p-2 rounded-full transition"
              aria-label="Close support"
            >
              <X size={20} />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-8">
                <p className="font-medium">Hi! 👋</p>
                <p className="mt-2">How can we help you today?</p>
                <p className="text-xs mt-4">
                  Send your message and our team will respond as soon as
                  possible.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderRole === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                      msg.senderRole === "user"
                        ? "bg-[#43A047] text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderRole === "user"
                          ? "text-green-100"
                          : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isPending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <Loader2 size={16} className="animate-spin text-[#43A047]" />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="sticky bottom-0 flex gap-2 bg-white border-t border-gray-200 p-3 rounded-b-2xl shrink-0"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#43A047]"
              disabled={isPending || !ticketId}
            />
            <button
              type="submit"
              disabled={isPending || !message.trim() || !ticketId}
              className="cursor-pointer bg-[#43A047] text-white p-2 rounded-full hover:bg-[#3A8C3D] disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Send message"
            >
              <SendHorizontal size={18} />
            </button>
          </form>
        </div>
      )}

      {!isSupportOpen && (
        <button
          onClick={() => setIsSupportOpen(true)}
          className="fixed z-50 bottom-10 right-10 bg-[#43A047] text-white p-4 rounded-full shadow-lg hover:bg-[#3A8C3D] transition flex items-center justify-center cursor-pointer"
          aria-label="Open support chat"
        >
          <MessageCircleMore size={24} />
        </button>
      )}
    </div>
  );
};

export default Support;
