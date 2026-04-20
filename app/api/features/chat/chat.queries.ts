import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversations, getMessages, sendMessage } from "./chat.api";
import {
  GetConversationsResponse,
  GetMessagesResponse,
  Message,
  SendMessagePayload,
} from "./types";

export const useChatMessages = (conversationId: string) => {
  const { data, isLoading } = useQuery<GetMessagesResponse>({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  return {
    messages: data?.messages ?? [],
    isLoading,
  };
};

export const useChatConversations = () => {
  const { data, isLoading } = useQuery<GetConversationsResponse>({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  return {
    conversations: data?.conversations ?? [],
    isLoading,
  };
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
