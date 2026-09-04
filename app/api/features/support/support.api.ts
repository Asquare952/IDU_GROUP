import api from "../../axios";
import type {
  SupportTicket,
  TicketMessage,
  CreateTicketRequest,
  SendTicketMessageRequest,
  UpdateTicketStatusRequest,
  SupportTicketResponse,
  SupportTicketsListResponse,
} from "./types";

const SUPPORT_ENDPOINT = "/support";

export const supportApi = {
  // Create a new support ticket
  createTicket: async (
    payload: CreateTicketRequest,
  ): Promise<SupportTicket> => {
    const response = await api.post<SupportTicketResponse>(
      `${SUPPORT_ENDPOINT}/ticket`,
      payload,
      { withCredentials: true },
    );
    return response.data.data;
  },

  // Get all tickets for current user
  getUserTickets: async (): Promise<SupportTicket[]> => {
    const response = await api.get<SupportTicketsListResponse>(
      `${SUPPORT_ENDPOINT}/tickets`,
      { withCredentials: true },
    );
    return response.data.data || [];
  },

  // Get single ticket by ID
  getTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.get<SupportTicketResponse>(
      `${SUPPORT_ENDPOINT}/ticket/${ticketId}`,
      { withCredentials: true },
    );
    return response.data.data;
  },

  // Send message to ticket
  sendMessage: async (
    payload: SendTicketMessageRequest,
  ): Promise<TicketMessage> => {
    const response = await api.post<{
      data: TicketMessage;
      message?: string;
    }>(`${SUPPORT_ENDPOINT}/message`, payload, { withCredentials: true });
    return response.data.data;
  },

  // Get all tickets (Admin only)
  getAllTickets: async (filters?: {
    status?: string;
    priority?: string;
  }): Promise<SupportTicket[]> => {
    const response = await api.get<SupportTicketsListResponse>(
      `${SUPPORT_ENDPOINT}/tickets/all`,
      {
        withCredentials: true,
        params: filters,
      },
    );
    return response.data.data || [];
  },

  // Update ticket status (Admin only)
  updateTicketStatus: async (
    payload: UpdateTicketStatusRequest,
  ): Promise<SupportTicket> => {
    const response = await api.patch<SupportTicketResponse>(
      `${SUPPORT_ENDPOINT}/ticket/${payload.ticketId}`,
      { status: payload.status },
      { withCredentials: true },
    );
    return response.data.data;
  },

  // Admin: Send message to ticket
  sendAdminMessage: async (
    ticketId: string,
    content: string,
  ): Promise<TicketMessage> => {
    const response = await api.post<{
      data: TicketMessage;
      message?: string;
    }>(
      `${SUPPORT_ENDPOINT}/message`,
      { ticketId, content, senderRole: "admin" },
      { withCredentials: true },
    );
    return response.data.data;
  },

  // Close ticket (Admin only)
  closeTicket: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.patch<SupportTicketResponse>(
      `${SUPPORT_ENDPOINT}/ticket/${ticketId}`,
      { status: "closed" },
      { withCredentials: true },
    );
    return response.data.data;
  },
};
