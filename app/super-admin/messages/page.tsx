"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/app/components/super-admin/DashboardLayout";
import { MessageSquare, Search } from "lucide-react";
import {
  useAdminChatMessages,
  useAdminChats,
} from "@/app/api/features/admin";

const formatDateTime = (value: string) => {
  if (!value) {
    return "Recently";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const { data: chats = [], isLoading, isError, error } = useAdminChats();
  const { data: messages = [], isLoading: isLoadingMessages } =
    useAdminChatMessages(selectedConversationId);

  useEffect(() => {
    if (!selectedConversationId && chats[0]?.conversationId) {
      setSelectedConversationId(chats[0].conversationId);
    }
  }, [chats, selectedConversationId]);

  const filteredChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return chats.filter((chat) => {
      const participantNames = chat.participants
        .map((participant) => participant.name)
        .join(" ")
        .toLowerCase();

      return (
        !query ||
        participantNames.includes(query) ||
        chat.lastMessage.toLowerCase().includes(query)
      );
    });
  }, [chats, searchQuery]);

  const selectedConversation =
    chats.find((chat) => chat.conversationId === selectedConversationId) ?? null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Messages
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Monitor platform conversations across users
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-4 md:gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#43A047]"
                />
              </div>
              <p className="text-xs text-gray-400">
                {filteredChats.length} conversation(s)
              </p>
            </div>

            <div className="max-h-[720px] overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-sm text-gray-500">
                  Loading conversations...
                </div>
              ) : isError ? (
                <div className="p-6 text-sm text-red-500">
                  {error.message || "Unable to load conversations."}
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-6 text-sm text-gray-500">
                  No conversations found.
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const participantNames =
                    chat.participants.map((participant) => participant.name).join(", ") ||
                    "Platform users";
                  const isSelected =
                    chat.conversationId === selectedConversationId;

                  return (
                    <button
                      key={chat.conversationId}
                      type="button"
                      onClick={() => setSelectedConversationId(chat.conversationId)}
                      className={`w-full text-left px-4 py-4 border-b border-gray-50 transition-colors ${
                        isSelected ? "bg-green-50/60" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {participantNames}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {chat.lastMessage || "No messages yet."}
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatDateTime(chat.lastMessageAt || chat.updatedAt)}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[540px]">
            {selectedConversation ? (
              <>
                <div className="p-4 md:p-5 border-b border-gray-100">
                  <h2 className="text-base md:text-lg font-semibold text-gray-900">
                    {selectedConversation.participants
                      .map((participant) => participant.name)
                      .join(", ") || "Conversation"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Conversation ID: {selectedConversation.conversationId}
                  </p>
                </div>

                <div className="p-4 md:p-5 space-y-4 max-h-[640px] overflow-y-auto bg-gray-50/50">
                  {isLoadingMessages ? (
                    <div className="text-sm text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No messages in this conversation yet.
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {message.senderName}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatDateTime(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="h-full min-h-[540px] flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-full bg-green-50 text-[#43A047] flex items-center justify-center mb-4">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Select a conversation
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Choose any conversation from the left panel to inspect its
                  message history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
