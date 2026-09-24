export type TicketStatus = "open" | "in_progress";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory =
  | "general"
  | "billing"
  | "technical"
  | "account"
  | "property"
  | "other";
export interface TicketUser {
  id: string;
  full_name: string;
  email?: string;
  phone_no?: string;
}
export interface TicketReply {
  id: string;
  ticket_id: string;
  sender_id?: string;
  sender_role: "user" | "admin";
  message: string;
  createdAt: string;
  updatedAt?: string;
  sender?: Pick<TicketUser, "id" | "full_name">;
}
export interface SupportTicket {
  id: string;
  ticket_ref: string;
  user_id: string;
  subject: string;
  description?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  reply_count?: number;
  last_reply?: string;
  user?: TicketUser;
  replies?: TicketReply[];
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  messages?: TicketMessage[];
}
export interface SupportDashboard {
  total_open: number;
  by_status: Record<TicketStatus, number>;
  by_priority: Record<TicketPriority, number>;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}
export interface AdminTicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  q?: string;
  page?: number;
  limit?: number;
}
export interface AdminTicketsListResponse {
  success: boolean;
  data: SupportTicket[];
  pagination: Pagination;
}
export interface SupportTicketResponse {
  success: boolean;
  data: SupportTicket;
  message?: string;
}
// Legacy widget shapes retained while the customer support widget is migrated.
export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: "user" | "admin";
  senderName: string;
  content: string;
  createdAt: string;
}
export interface CreateTicketRequest {
  subject: string;
  description: string;
  category?: string;
  priority?: string;
}
export interface SendTicketMessageRequest {
  ticketId: string;
  content: string;
}
