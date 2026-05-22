export interface User {
  _id: string;
  id?: string;
  first_name: string;
  last_name?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  role?: "tenant" | "landlord";
}

export interface Message {
  _id: string;
  conversation_id: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface SendMessagePayload {
  conversation_id: string;
  content: string;
}

export interface CreateConversationPayload {
  other_user_id: string;
}

export interface Conversation {
  conversation_id: string;
  _id?: string;
  id?: string;
  participants: User[]; // very important
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
}
