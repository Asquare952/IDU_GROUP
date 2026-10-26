"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircleMore, X, SendHorizontal, Loader2 } from "lucide-react";
import {
  useCreateTicket,
  useGetUserTicket,
  useSendTicketMessage,
  useGetUserTickets,
} from "@/app/api/features/support";
import type {
  TicketMessage,
  TicketReply,
} from "@/app/api/features/support/types";
import { hasAccessToken } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/app/components/context/AuthContext";

const Support = () => {
  const router = useRouter();
  const { isLoggedIn, sessionVersion } = useAuth();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketRef, setTicketRef] = useState<string | undefined>(undefined);
  const [ticketCreationFailed, setTicketCreationFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutate: createTicket, isPending: isCreating } = useCreateTicket();
  const { mutate: sendMessage, isPending: isSending } = useSendTicketMessage();
  const {
    data: userTickets,
    isSuccess: isUserTicketsSuccess,
    isError: isUserTicketsError,
    isLoading: isLoadingUserTickets,
    isFetching: isFetchingUserTickets,
    refetch: refetchUserTickets,
  } = useGetUserTickets(isSupportOpen && isLoggedIn && hasAccessToken());
  const {
    data: ticketDetail,
    refetch: refetchTicketDetail,
    isLoading: isLoadingTicketDetail,
    isError: isTicketDetailError,
  } = useGetUserTicket(ticketRef, isSupportOpen && isLoggedIn);

  const toChatMessage = (reply: TicketReply): TicketMessage => ({
    id: reply.id,
    ticketId: reply.ticket_id,
    senderId: reply.sender_id ?? "",
    senderRole: reply.sender_role,
    senderName:
      reply.sender?.full_name ??
      (reply.sender_role === "admin" ? "RentULO Support" : "You"),
    content: reply.message,
    createdAt: reply.createdAt,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setTicketRef(undefined);
      setTicketCreationFailed(false);
    }
  }, [isLoggedIn, sessionVersion]);

  useEffect(() => {
    if (
      !isSupportOpen ||
      !isLoggedIn ||
      !hasAccessToken() ||
      ticketRef ||
      ticketCreationFailed ||
      !isUserTicketsSuccess ||
      isFetchingUserTickets ||
      isCreating
    ) {
      return;
    }

    const openTicket = userTickets?.find(
      (ticket) => ticket.status === "open" || ticket.status === "in_progress",
    );

    if (openTicket) {
      setTicketRef(openTicket.ticket_ref);
      return;
    }

    createTicket(
      {
        subject: "Support Request",
        description: "User initiated support chat",
        category: "general",
        priority: "medium",
      },
      {
        onSuccess: (ticket) => {
          setTicketCreationFailed(false);
          setTicketRef(ticket.ticket_ref);
        },
        onError: () => {
          setTicketCreationFailed(true);
          toast.error("Failed to create support ticket");
        },
      },
    );
  }, [
    isCreating,
    isFetchingUserTickets,
    isLoggedIn,
    isSupportOpen,
    isUserTicketsSuccess,
    ticketCreationFailed,
    userTickets,
    createTicket,
    ticketRef,
  ]);

  const messages: TicketMessage[] = (ticketDetail?.replies ?? [])
    .map(toChatMessage)
    .sort(
      (left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt),
    );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();

    if (!trimmed || isSending || !ticketRef) return;

    if (!isLoggedIn || !hasAccessToken()) {
      router.push("/login");
      return;
    }

    setMessage("");
    sendMessage(
      { ticketId: ticketRef, content: trimmed },
      {
        onError: () => {
          toast.error("Failed to send message");
          setMessage(trimmed);
        },
      },
    );
  };

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
            {!isLoggedIn || !hasAccessToken() ? (
              <div className="mt-8 text-center text-sm text-gray-500">
                Please log in to contact RentULO Support.
              </div>
            ) : isUserTicketsError && !ticketRef ? (
              <div className="mt-8 text-center text-sm text-red-600">
                <p>Unable to load your support history.</p>
                <button
                  type="button"
                  onClick={() => void refetchUserTickets()}
                  className="mt-2 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            ) : isLoadingUserTickets ||
              isFetchingUserTickets ||
              isCreating ||
              (ticketRef && isLoadingTicketDetail && !ticketDetail) ? (
              <div className="mt-8 flex justify-center text-[#43A047]">
                <Loader2 size={22} className="animate-spin" />
              </div>
            ) : ticketCreationFailed && !ticketRef ? (
              <div className="mt-8 text-center text-sm text-red-600">
                <p>Unable to start your support conversation.</p>
                <button
                  type="button"
                  onClick={() => setTicketCreationFailed(false)}
                  className="mt-2 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            ) : isTicketDetailError && !ticketDetail ? (
              <div className="mt-8 text-center text-sm text-red-600">
                <p>Unable to load this conversation.</p>
                <button
                  type="button"
                  onClick={() => void refetchTicketDetail()}
                  className="mt-2 font-semibold underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {isTicketDetailError && (
                  <div className="text-center text-xs text-red-600">
                    Could not refresh the conversation. Showing saved messages.{" "}
                    <button
                      type="button"
                      onClick={() => void refetchTicketDetail()}
                      className="font-semibold underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
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
                        msg.senderRole === "user"
                          ? "justify-end"
                          : "justify-start"
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
              </>
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
              disabled={
                isPending ||
                !ticketRef ||
                !isLoggedIn ||
                (isTicketDetailError && !ticketDetail) ||
                !hasAccessToken()
              }
            />
            <button
              type="submit"
              disabled={isPending || !message.trim() || !ticketRef}
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
