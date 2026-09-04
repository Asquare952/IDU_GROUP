import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "./support.api";
import type {
  SupportTicket,
  CreateTicketRequest,
  SendTicketMessageRequest,
  UpdateTicketStatusRequest,
} from "./types";

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketRequest) =>
      supportApi.createTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
    },
  });
};

export const useGetUserTickets = () => {
  return useQuery({
    queryKey: ["support", "tickets"],
    queryFn: () => supportApi.getUserTickets(),
  });
};

export const useGetTicket = (ticketId: string | undefined) => {
  return useQuery({
    queryKey: ["support", "ticket", ticketId],
    queryFn: () => supportApi.getTicket(ticketId!),
    enabled: !!ticketId,
  });
};

export const useSendTicketMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendTicketMessageRequest) =>
      supportApi.sendMessage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support", "ticket", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
    },
  });
};

// Admin queries
export const useGetAllTickets = (filters?: {
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ["support", "all-tickets", filters],
    queryFn: () => supportApi.getAllTickets(filters),
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTicketStatusRequest) =>
      supportApi.updateTicketStatus(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support", "all-tickets"],
      });
      queryClient.invalidateQueries({
        queryKey: ["support", "ticket", variables.ticketId],
      });
    },
  });
};

export const useSendAdminMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      content,
    }: {
      ticketId: string;
      content: string;
    }) => supportApi.sendAdminMessage(ticketId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["support", "ticket", variables.ticketId],
      });
      queryClient.invalidateQueries({
        queryKey: ["support", "all-tickets"],
      });
    },
  });
};

export const useCloseTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => supportApi.closeTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "all-tickets"] });
    },
  });
};
