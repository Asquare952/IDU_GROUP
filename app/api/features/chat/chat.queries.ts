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

  return useMutation<Message, Error, SendMessagePayload>({
    mutationFn: sendMessage,

    onSuccess: (newMessage) => {
      // update messages instantly
      queryClient.setQueryData<GetMessagesResponse>(
        ["messages", newMessage.conversation_id],
        (oldData) => {
          if (!oldData) {
            return { messages: [newMessage] };
          }

          return {
            ...oldData,
            messages: [...oldData.messages, newMessage],
          };
        },
      );

      // update conversation list
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
