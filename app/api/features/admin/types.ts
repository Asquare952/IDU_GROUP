import type { Rental } from "../rental";

export type AdminUserProfile = {
  verified: boolean;
  image?: string;
};

export type AdminUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_superadmin: boolean;
  createdAt: string;
  updatedAt?: string;
  phone_no?: string;
  state?: string;
  address?: string;
  country?: string;
  rentalsCount: number;
  profile: AdminUserProfile | null;
};

export type AdminRental = Rental & {
  landlordName: string;
  userId: string;
  userEmail?: string;
  lockedByCount: number;
  tenantCount: number;
};

export type AdminReportStatus = "pending" | "resolved" | "rejected" | string;

export type AdminReport = {
  id: string;
  report_message: string;
  report_type: string;
  status: AdminReportStatus;
  createdAt: string;
  reporterName: string;
  reporterEmail?: string;
  targetName?: string;
  targetEmail?: string;
  searchName?: string;
  reportUserId?: string;
};

export type AdminChatParticipant = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

export type AdminChatConversation = {
  conversationId: string;
  participants: AdminChatParticipant[];
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
};
