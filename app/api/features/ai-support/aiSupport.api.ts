import apiInstance from "../../axios";
import {
  SendChatPayload,
  SendChatResponse,
  SessionsResponse,
  HistoryResponse,
  DeleteSessionResponse,
} from "./type";

export const sendChatMessage = async (payload: SendChatPayload): Promise<SendChatResponse> => {
  const { data } = await apiInstance.post("/ai-support/chat", payload);
  return data;
};

export const getChatSessions = async (): Promise<SessionsResponse> => {
  const { data } = await apiInstance.get("/ai-support/sessions");
  return data;
};

export const getChatHistory = async (params?: {
  session_id?: string;
  limit?: number;
}): Promise<HistoryResponse> => {
  const { data } = await apiInstance.get("/ai-support/history", { params });
  return data;
};

export const deleteChatSession = async (session_id: string): Promise<DeleteSessionResponse> => {
  const { data } = await apiInstance.delete(`/ai-support/session/${session_id}`);
  return data;
};