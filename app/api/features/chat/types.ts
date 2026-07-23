export interface User {
  _id: string;
  id?: string;
  full_name: string;
  fullName?: string;
  email?: string;
  role?: "tenant" | "landlord";
  image?: string;
  profileImage?: string;
  profile_image?: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  conversation_id: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isOptimistic?: boolean;
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface SendMessagePayload {
  conversation_id: string;
  content: string;
  optimisticId?: string;
  optimisticSenderId?: string;
}

export interface CreateConversationPayload {
  other_user_id: string;
}

export interface Conversation {
  conversation_id: string;
  _id?: string;
  id?: string;

  // type: "user" | "support";

  participants: User[]; // very important
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
}
