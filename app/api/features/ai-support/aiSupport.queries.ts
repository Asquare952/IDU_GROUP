import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendChatMessage,
  getChatSessions,
  getChatHistory,
  deleteChatSession,
} from "./aiSupport.api";
import {
  SendChatPayload,
  SendChatResponse,
  SessionsResponse,
  HistoryResponse,
  DeleteSessionResponse,
} from "./type";

// Hook to send a message to the AI assistant
export const useSendChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<SendChatResponse, Error, SendChatPayload>({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["ai-support", "history", data.data.session_id],
      });
      queryClient.invalidateQueries({ queryKey: ["ai-support", "sessions"] });
    },
  });
};

// Hook to fetch the full transcript for a specific session (disabled until a session exists)
export const useChatHistory = (sessionId?: string) => {
  const { data, isLoading, isError, error } = useQuery<HistoryResponse>({
    queryKey: ["ai-support", "history", sessionId],
    queryFn: () =>
      getChatHistory(sessionId ? { session_id: sessionId } : undefined),
    enabled: !!sessionId,
    retry: false,
  });
  return { data, isLoading, isError, error };
};

// Hook to list all chat sessions for the logged-in user
export const useChatSessions = () => {
  const { data, isLoading, isError, error } = useQuery<SessionsResponse>({
    queryKey: ["ai-support", "sessions"],
    queryFn: getChatSessions,
    retry: false,
  });
  return { data, isLoading, isError, error };
};

// Hook to delete a chat session
export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteSessionResponse, Error, string>({
    mutationFn: deleteChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-support"] });
    },
  });
};
