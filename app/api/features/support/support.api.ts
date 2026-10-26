import api from "../../axios";
import type {
  AdminTicketFilters,
  AdminTicketsListResponse,
  CreateTicketRequest,
  SendTicketMessageRequest,
  SupportDashboard,
  SupportTicket,
  SupportTicketResponse,
  TicketReply,
} from "./types";

const ADMIN_SUPPORT_ENDPOINT = "/admin/support";

export const supportApi = {
  async createTicket(payload: CreateTicketRequest): Promise<SupportTicket> {
    return (
      await api.post<SupportTicketResponse>("/support/tickets", payload, {
        withCredentials: true,
      })
    ).data.data;
  },
  async getUserTickets(): Promise<SupportTicket[]> {
    return (
      await api.get<{ success: boolean; data: SupportTicket[] }>(
        "/support/tickets",
      )
    ).data.data;
  },
  async getUserTicket(ticketRef: string): Promise<SupportTicket> {
    return (
      await api.get<SupportTicketResponse>(
        `/support/tickets/${encodeURIComponent(ticketRef)}`,
        { withCredentials: true },
      )
    ).data.data;
  },
  async sendMessage(payload: SendTicketMessageRequest): Promise<TicketReply> {
    const response = await api.post<{
      success: boolean;
      data: { reply: TicketReply };
    }>(
      `/support/tickets/${encodeURIComponent(payload.ticketId)}/reply`,
      { message: payload.content },
      { withCredentials: true },
    );
    return response.data.data.reply;
  },
  async getDashboard(): Promise<SupportDashboard> {
    return (
      await api.get<{ success: boolean; data: SupportDashboard }>(
        `${ADMIN_SUPPORT_ENDPOINT}/stats`,
        { withCredentials: true },
      )
    ).data.data;
  },
  async getAllTickets(
    filters: AdminTicketFilters = {},
  ): Promise<AdminTicketsListResponse> {
    return (
      await api.get<AdminTicketsListResponse>(
        `${ADMIN_SUPPORT_ENDPOINT}/tickets`,
        { params: filters, withCredentials: true },
      )
    ).data;
  },
  async getAdminTicket(ticketRef: string): Promise<SupportTicket> {
    return (
      await api.get<SupportTicketResponse>(
        `${ADMIN_SUPPORT_ENDPOINT}/tickets/${encodeURIComponent(ticketRef)}`,
        { withCredentials: true },
      )
    ).data.data;
  },
  async sendAdminReply(
    ticketRef: string,
    message: string,
  ): Promise<TicketReply> {
    return (
      await api.post<{ success: boolean; data: { reply: TicketReply } }>(
        `${ADMIN_SUPPORT_ENDPOINT}/tickets/${encodeURIComponent(ticketRef)}/reply`,
        { message },
        { withCredentials: true },
      )
    ).data.data.reply;
  },
  async resolveTicket(ticketRef: string): Promise<void> {
    await api.post(
      `${ADMIN_SUPPORT_ENDPOINT}/tickets/${encodeURIComponent(ticketRef)}/resolve`,
      undefined,
      { withCredentials: true },
    );
  },
};
