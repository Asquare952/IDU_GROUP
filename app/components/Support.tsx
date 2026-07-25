"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircleMore, X, SendHorizontal, Loader2 } from "lucide-react";
import {
  useSendChatMessage,
  useChatHistory,
} from "@/app/api/features/ai-support/aiSupport.queries";
import type { ChatMessage as ApiChatMessage } from "@/app/api/features/ai-support/type";

type LocalMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SESSION_STORAGE_KEY = "rentulo-ai-support-session";

const Support = () => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending, error } = useSendChatMessage();
  const { data: historyRes } = useChatHistory(sessionId);

  // Restore an existing session for this browser, if one exists, on first mount.
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) setSessionId(stored);
  }, []);

  // Hydrate local messages from the fetched transcript once we have a session.
  useEffect(() => {
    if (!historyRes || !sessionId) return;
    const transcript = historyRes.data as ApiChatMessage[];
    setMessages(
      transcript.map((m) => ({ id: m.id, role: m.role, content: m.content })),
    );
  }, [historyRes, sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isPending) return;

    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, role: "user", content: trimmed },
    ]);
    setMessage("");

    sendMessage(
      { message: trimmed, session_id: sessionId },
      {
        onSuccess: (data) => {
          if (!sessionId) {
            setSessionId(data.data.session_id);
            localStorage.setItem(SESSION_STORAGE_KEY, data.data.session_id);
          }
          setMessages((prev) => [
            ...prev,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: data.data.reply,
            },
          ]);
        },
      },
    );
  };

  const errorMessage =
    (error as any)?.response?.status === 429
      ? "You're sending messages too quickly. Please slow down."
      : ((error as any)?.response?.data?.message as string | undefined);

  return (
    <div>
      {isSupportOpen && (
        <div className="fixed z-50 bottom-30 right-10 shadow bg-white rounded-t-2xl rounded-b-2xl w-[360px] max-w-[calc(100vw-2.5rem)] h-[520px] flex flex-col">
          <header className="sticky top-0 flex items-center justify-between bg-[#43A047] py-6 px-3 rounded-t-2xl shrink-0">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-white text-[18px]">RentULO Support</h2>
              <p className="text-white text-[13px]">
                We typically reply in a few seconds
              </p>
            </div>
            <button
              className="cursor-pointer"
              onClick={() => setIsSupportOpen(false)}
            >
              <X size={20} className="text-white" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-[#F7F8FA] p-4"
          >
            {messages.length === 0 && !isPending && (
              <p className="text-center text-sm text-slate-400 mt-6">
                Ask me anything about RentULO — locking a house, your wallet,
                inspections, or listings.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#43A047] text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isPending && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <p className="px-4 py-1.5 text-xs text-red-600 bg-red-50 shrink-0">
              {errorMessage}
            </p>
          )}

          <div className="border-t border-[#ddd] bg-white p-2.5 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-1.5">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 rounded-3xl border border-[#ccc] px-4 py-2.5 outline-none disabled:opacity-60"
                placeholder="Type a message..."
                disabled={isPending}
              />
              <button
                type="submit"
                className="cursor-pointer rounded-full bg-[#43A047] px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
                disabled={!message.trim() || isPending}
              >
                <SendHorizontal />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsSupportOpen(true)}
        className="fixed bottom-10 right-10 bg-[#43A047] text-white p-5 rounded-full shadow-2xl transition-all z-40 active:scale-90 cursor-pointer"
      >
        <MessageCircleMore size={32} />
      </button>
    </div>
  );
};

export default Support;
