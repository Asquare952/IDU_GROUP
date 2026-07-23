import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getMessages,
  sanitizeConversationId,
  sendMessage,
  createConversation,
} from "./chat.api";
import {
  GetConversationsResponse,
  GetMessagesResponse,
  Message,
  SendMessagePayload,
  CreateConversationPayload,
  Conversation,
} from "./types";

type SendMessageContext = {
  conversationId: string;
  optimisticId: string;
  previousMessages: GetMessagesResponse | undefined;
  previousConversations: GetConversationsResponse | undefined;
};

export const useChatMessages = (conversationId: string) => {
  const sanitizedConversationId = sanitizeConversationId(conversationId);
  const { data, isLoading } = useQuery<GetMessagesResponse>({
    queryKey: ["messages", sanitizedConversationId],
    queryFn: () => getMessages(sanitizedConversationId),
    enabled: !!sanitizedConversationId,
  });

  return {
    messages: data?.messages ?? [],
    isLoading,
  };
};

export const useChatConversations = () => {
  const { data, isLoading } = useQuery<GetConversationsResponse>({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    enabled: true,
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
  });

  return {
    conversations: data?.conversations ?? [],
    isLoading,
  };
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateConversationPayload>({
    mutationFn: createConversation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, SendMessagePayload, SendMessageContext>({
    mutationFn: sendMessage,

    onMutate: async (payload) => {
      const conversationId = sanitizeConversationId(payload.conversation_id);

      if (!conversationId) {
        return {
          conversationId: "",
          optimisticId: "",
          previousMessages: undefined,
          previousConversations: undefined,
        };
      }

      await queryClient.cancelQueries({
        queryKey: ["messages", conversationId],
      });

      const previousMessages = queryClient.getQueryData<GetMessagesResponse>([
        "messages",
        conversationId,
      ]);
      const previousConversations =
        queryClient.getQueryData<GetConversationsResponse>(["conversations"]);
      const optimisticMessage: Message = {
        _id: payload.optimisticId ?? `optimistic-${Date.now()}`,
        conversation_id: conversationId,
        senderId: payload.optimisticSenderId ?? "",
        content: payload.content,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      queryClient.setQueryData<GetMessagesResponse>(
        ["messages", conversationId],
        (oldData) => {
          if (!oldData) {
            return { messages: [optimisticMessage] };
          }

          return {
            ...oldData,
            messages: [...oldData.messages, optimisticMessage],
          };
        },
      );

      queryClient.setQueryData<GetConversationsResponse>(
        ["conversations"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            conversations: oldData.conversations.map((conversation) =>
              conversation.conversation_id === conversationId
                ? {
                    ...conversation,
                    lastMessage: optimisticMessage,
                    updatedAt: optimisticMessage.createdAt,
                  }
                : conversation,
            ),
          };
        },
      );

      return {
        conversationId,
        optimisticId: optimisticMessage._id,
        previousMessages,
        previousConversations,
      };
    },

    onSuccess: (newMessage, _payload, context) => {
      const conversationId = sanitizeConversationId(
        newMessage.conversation_id || context?.conversationId,
      );

      if (!conversationId) {
        return;
      }

      queryClient.setQueryData<GetMessagesResponse>(
        ["messages", conversationId],
        (oldData) => {
          if (!oldData) {
            return { messages: [newMessage] };
          }

          const withoutOptimisticMessage = oldData.messages.filter(
            (message) =>
              message._id !== context?.optimisticId &&
              message._id !== newMessage._id,
          );

          return {
            ...oldData,
            messages: [...withoutOptimisticMessage, newMessage],
          };
        },
      );

      queryClient.setQueryData<GetConversationsResponse>(
        ["conversations"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            conversations: oldData.conversations.map((conversation) =>
              conversation.conversation_id === conversationId
                ? {
                    ...conversation,
                    lastMessage: newMessage,
                    updatedAt: newMessage.createdAt || conversation.updatedAt,
                  }
                : conversation,
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },

    onError: (_error, _payload, context) => {
      if (!context) {
        return;
      }

      queryClient.setQueryData(
        ["messages", context.conversationId],
        context.previousMessages,
      );
      queryClient.setQueryData(
        ["conversations"],
        context.previousConversations,
      );
    },
  });
};
