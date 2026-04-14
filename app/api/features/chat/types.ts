export interface User {
  _id: string;
  name: string;
  email?: string;
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

export interface Conversation {
  _id: string;
  participants: User[]; // very important
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
}
