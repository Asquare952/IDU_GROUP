import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "./support.api";
import type {
  AdminTicketFilters,
  CreateTicketRequest,
  SendTicketMessageRequest,
} from "./types";
const ticketsKey = ["support", "admin", "tickets"] as const;
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketRequest) =>
      supportApi.createTicket(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] }),
  });
};
export const useGetUserTickets = () =>
  useQuery({
    queryKey: ["support", "tickets"],
    queryFn: supportApi.getUserTickets,
  });
export const useGetUserTicket = (ticketRef?: string) =>
  useQuery({
    queryKey: ["support", "ticket", ticketRef],
    queryFn: () => supportApi.getUserTicket(ticketRef!),
    enabled: Boolean(ticketRef),
  });
export const useSendTicketMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendTicketMessageRequest) =>
      supportApi.sendMessage(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] }),
  });
};
export const useSupportDashboard = () =>
  useQuery({
    queryKey: ["support", "admin", "dashboard"],
    queryFn: supportApi.getDashboard,
  });
export const useGetAllTickets = (filters: AdminTicketFilters = {}) =>
  useQuery({
    queryKey: [...ticketsKey, filters],
    queryFn: () => supportApi.getAllTickets(filters),
  });
export const useGetAdminTicket = (ticketRef?: string) =>
  useQuery({
    queryKey: ["support", "admin", "ticket", ticketRef],
    queryFn: () => supportApi.getAdminTicket(ticketRef!),
    enabled: Boolean(ticketRef),
  });
export const useSendAdminReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketRef,
      message,
    }: {
      ticketRef: string;
      message: string;
    }) => supportApi.sendAdminReply(ticketRef, message),
    onSuccess: (_, { ticketRef }) => {
      queryClient.invalidateQueries({
        queryKey: ["support", "admin", "ticket", ticketRef],
      });
      queryClient.invalidateQueries({ queryKey: ticketsKey });
      queryClient.invalidateQueries({
        queryKey: ["support", "admin", "dashboard"],
      });
    },
  });
};
export const useResolveTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supportApi.resolveTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketsKey });
      queryClient.invalidateQueries({
        queryKey: ["support", "admin", "dashboard"],
      });
    },
  });
};
