"use client";

import { useEffect, useRef, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, Search, SendHorizontal } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  useChatConversations,
  useChatMessages,
  useSendMessage,
} from "../api/features/chat/chat.queries";
import { getMessages, sanitizeConversationId } from "../api/features/chat/chat.api";
import { Conversation, Message, User } from "../api/features/chat/types";
import { socket } from "../lib/socket";

type DecodedToken = {
  id?: string;
  sub?: string;
  userId?: string;
  _id?: string;
};

const getParticipantId = (participant: User) =>
  participant._id ?? participant.id ?? "";

const getParticipantName = (participant: User) => {
  const fullName = participant.full_name ?? participant.fullName ?? "";
  const initials = fullName ? `${fullName[0]}` : "";

  return (
    fullName ||
    initials ||
    participant.email ||
    getParticipantId(participant) ||
    ""
  );
};

const getConversationTitle = (
  conversation: Conversation | undefined,
  currentUserId: string | null,
) => {
  if (!conversation) {
    return "Select a conversation";
  }

  const participants = conversation.participants ?? [];
  const otherParticipants = currentUserId
    ? participants.filter(
      (participant) => getParticipantId(participant) !== currentUserId,
    )
    : participants;
  const displayParticipants =
    otherParticipants.length > 0 ? otherParticipants : participants;
  const names = displayParticipants
    .map(getParticipantName)
    .filter(Boolean)
    .join(", ");

  return names || "";
};

const getConversationInitial = (
  conversation: Conversation | undefined,
  currentUserId: string | null,
) => {
  const title = getConversationTitle(conversation, currentUserId);
  const firstLetter = title.trim().charAt(0).toUpperCase();

  return /[A-Z0-9]/.test(firstLetter) ? firstLetter : "U";
};

const getLastMessagePreview = (message: Message | undefined) =>
  message?.content?.trim() || "No messages yet";

const formatMessageTime = (dateValue: string | undefined) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const isMatchingPendingMessage = (pendingMessage: Message, newMessage: Message) =>
  Boolean(pendingMessage.isOptimistic) &&
  pendingMessage.conversation_id === newMessage.conversation_id &&
  pendingMessage.senderId === newMessage.senderId &&
  pendingMessage.content === newMessage.content;

const Chat = () => {
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const params = useParams<{ conversationId?: string | string[] }>();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const routeConversationId = Array.isArray(params.conversationId)
    ? params.conversationId[0]
    : params.conversationId;
  const { conversations } = useChatConversations();
  const activeConversationId = sanitizeConversationId(routeConversationId);
  const { messages } = useChatMessages(activeConversationId ?? "");
  const { mutate: sendMessage, isPending } = useSendMessage();
  const conversationIds = (conversations ?? [])
    .map((conversation) =>
      sanitizeConversationId(
        (conversation as any).conversation_id ??
        (conversation as any)._id ??
        (conversation as any).id,
      ),
    )
    .filter(Boolean);
  const messagePreviewQueries = useQueries({
    queries: conversationIds.map((conversationId) => ({
      queryKey: ["messages", conversationId],
      queryFn: () => getMessages(conversationId),
      enabled: Boolean(conversationId),
      staleTime: 30_000,
    })),
  });
  const lastMessageByConversationId = new Map<string, Message>();

  messagePreviewQueries.forEach((query, index) => {
    const conversationId = conversationIds[index];
    const previewMessages = query.data?.messages ?? [];
    const lastMessage = previewMessages[previewMessages.length - 1];

    if (conversationId && lastMessage) {
      lastMessageByConversationId.set(conversationId, lastMessage);
    }
  });
  const messagesBasePath = pathname.includes("/messages/")
    ? pathname.split("/messages/")[0] + "/messages"
    : pathname;
  const isMobileConversationOpen = !!routeConversationId;

  const selectedConversation = (conversations ?? []).find((conversation) =>
    conversation.conversation_id === activeConversationId ||
    (conversation as any)._id === activeConversationId ||
    (conversation as any).id === activeConversationId,
  );

  const selectedConversationTitle = getConversationTitle(
    selectedConversation,
    currentUserId,
  );
  const selectedConversationInitial = getConversationInitial(
    selectedConversation,
    currentUserId,
  );
  useEffect(() => {
    const token = Cookies.get("ACCESS_TOKEN");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUserId(
        decoded._id ?? decoded.id ?? decoded.userId ?? decoded.sub ?? null,
      );
    } catch {
      setCurrentUserId(null);
    }
  }, []);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;

    socket.emit("join_conversation", activeConversationId);
  }, [activeConversationId]);

  useEffect(() => {
    const handleNewMessage = (msg: Message) => {
      queryClient.setQueryData(
        ["messages", msg.conversation_id],
        (oldData: { messages: Message[] } | undefined) => {
          if (!oldData) {
            return { messages: [msg] };
          }

          const alreadyExists = oldData.messages.some(
            (existingMessage) =>
              existingMessage._id === msg._id ||
              isMatchingPendingMessage(existingMessage, msg),
          );

          if (alreadyExists) return oldData;

          return {
            ...oldData,
            messages: [...oldData.messages, msg],
          };
        },
      );
      queryClient.setQueryData(
        ["conversations"],
        (oldData: { conversations: Conversation[] } | undefined) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            conversations: oldData.conversations.map((conversation) =>
              conversation.conversation_id === msg.conversation_id
                ? {
                  ...conversation,
                  lastMessage: msg,
                  updatedAt: msg.createdAt || conversation.updatedAt,
                }
                : conversation,
            ),
          };
        },
      );
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConversationSelect = (nextConversationId: string) => {
    const sanitizedNextConversationId = sanitizeConversationId(nextConversationId);

    if (!sanitizedNextConversationId) return;

    router.push(`${messagesBasePath}/${sanitizedNextConversationId}`);
  };

  const handleBackToList = () => {
    router.push(messagesBasePath);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim() || !activeConversationId) return;

    sendMessage({
      conversation_id: activeConversationId,
      content: message.trim(),
      optimisticId: `optimistic-${Date.now()}`,
      optimisticSenderId: currentUserId ?? "",
    });

    setMessage("");
  };

  const conversationList = (
    <>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md bg-[#ddd] py-1.5 pl-9 pr-6 text-black outline-none"
          placeholder="Search conversations..."
        />
        <Search className="absolute left-1.5 top-1.5 text-gray-400" size={18} />
      </div>
      <div className="mt-3 border-b border-white/20 md:border-[#ffffff33]" />
      <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
        {(conversations ?? []).map((conversation) => {
          const convId = sanitizeConversationId(
            (conversation as any).conversation_id ??
            (conversation as any)._id ??
            (conversation as any).id,
          );

          if (!convId) {
            return null;
          }

          const isActive = convId === activeConversationId;
          const participantNames = getConversationTitle(
            conversation,
            currentUserId,
          );
          const participantInitial = getConversationInitial(
            conversation,
            currentUserId,
          );
          const lastMessagePreview = getLastMessagePreview(
            lastMessageByConversationId.get(convId) ??
            conversation.lastMessage,
          );
          const lastMessageTime = formatMessageTime(
            (lastMessageByConversationId.get(convId) ?? conversation.lastMessage)
              ?.createdAt,
          );

          return (
            <button
              key={convId}
              type="button"
              onClick={() => handleConversationSelect(convId)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${isActive ? "bg-white text-[#43A047]" : "bg-white/10 hover:bg-white/20"}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${isActive ? "bg-[#43A047] text-white" : "bg-white text-[#43A047]"}`}
                aria-hidden="true"
              >
                {participantInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="block flex-1 truncate text-sm font-bold">
                    {participantNames}
                  </span>
                  {lastMessageTime && (
                    <span
                      className={`shrink-0 text-[10px] ${isActive ? "text-slate-500" : "text-white/70"}`}
                    >
                      {lastMessageTime}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-1 block truncate text-xs ${isActive ? "text-slate-500" : "text-white/70"}`}
                >
                  {lastMessagePreview}
                </span>
              </div>

            </button>
          );
        })}
      </div>
    </>
  );

  const chatPanel = (
    <>
      <header className="sticky top-0 z-10 border-b border-[#EBECED] bg-[#43A047] px-4 py-4 text-white md:py-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToList}
            className="rounded-full border border-white/20 p-2 text-white md:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={18} />
          </button>
          <div className=" flex min-w-0 items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-[#43A047]"
              aria-hidden="true"
            >
              {selectedConversationInitial}
            </div>
            <p className="truncate text-base font-medium md:text-lg">
              {selectedConversationTitle}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto bg-[#F7F8FA] p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">
            {activeConversationId
              ? "No messages yet."
              : "Choose a conversation to start chatting."}
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isMe = currentUserId ? msg.senderId === currentUserId : false;
            const sentTime = formatMessageTime(msg.createdAt);

            return (
              <div
                key={msg._id ?? `message-${idx}`}
                className={`mb-2 max-w-[85%] rounded-2xl px-4 py-2 md:max-w-[60%] ${isMe ? "self-end bg-green-500 text-white" : "self-start bg-white text-black"} ${msg.isOptimistic ? "opacity-80" : ""}`}
              >
                <p className="whitespace-pre-wrap break-words text-sm">
                  {msg.content}
                </p>
                <div
                  className={`mt-1 text-right text-[10px] leading-none ${isMe ? "text-white/75" : "text-slate-400"}`}
                >
                  {sentTime}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#ddd] bg-white p-2.5">
        <form className="flex items-center gap-1.5" onSubmit={handleSend}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-3xl border border-[#ccc] px-4 py-2.5 outline-none"
            placeholder="Type a message..."
            disabled={!activeConversationId}
          />
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#43A047] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!message.trim() || !activeConversationId || isPending}
          >
            <SendHorizontal />
          </button>
        </form>
      </div>
    </>
  );

  return (
    <section className="relative h-[calc(100dvh-73px)] overflow-hidden bg-white md:h-[88.5vh] md:rounded-2xl md:border md:border-[#EBECED]">
      <div className="hidden h-full md:flex">
        <div className="flex h-full w-[30%] shrink-0 flex-col border-r bg-[#43A047] p-2.5 text-white">
          {conversationList}
        </div>
        <div className="flex h-full flex-1 flex-col bg-white">{chatPanel}</div>
      </div>

      <div className="relative h-full md:hidden">
        <div className="absolute inset-0 flex flex-col bg-[#43A047] p-2.5 text-white">
          {conversationList}
        </div>

        <AnimatePresence initial={false}>
          {isMobileConversationOpen ? (
            <motion.div
              key={routeConversationId}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col bg-white"
            >
              {chatPanel}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Chat;
