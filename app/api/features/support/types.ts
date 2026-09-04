export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  category:
    | "general"
    | "complaint"
    | "booking"
    | "payment"
    | "property"
    | "other";
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

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

export interface UpdateTicketStatusRequest {
  ticketId: string;
  status: TicketStatus;
}

export interface SupportTicketResponse {
  data: SupportTicket;
  message?: string;
  status?: number;
}

export interface SupportTicketsListResponse {
  data: SupportTicket[];
  total?: number;
  message?: string;
  status?: number;
}
