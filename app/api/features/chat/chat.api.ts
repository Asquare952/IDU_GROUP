// services/chat.ts
import axiosInstance from "../../axios";
import {
  GetConversationsResponse,
  GetMessagesResponse,
  Message,
  SendMessagePayload,
} from "./types";

export const getMessages = async (
  conversationId: string,
): Promise<GetMessagesResponse> => {
  const { data } = await axiosInstance.get(`/chat/message/${conversationId}`);
  return data;
};

export const getConversations = async (): Promise<GetConversationsResponse> => {
  const { data } = await axiosInstance.get("/chat/conversation");
  return data;
};

export const sendMessage = async (payload: SendMessagePayload): Promise<Message> => {
  const { data } = await axiosInstance.post("/chat/message", payload);
  return data;
};
