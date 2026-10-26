import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportApi } from "./support.api";
import type {
  AdminTicketFilters,
  CreateTicketRequest,
  SendTicketMessageRequest,
  SupportTicket,
  TicketReply,
} from "./types";
const ticketsKey = ["support", "admin", "tickets"] as const;

type OptimisticReplyContext = {
  optimisticId: string;
  previousTicket: SupportTicket | undefined;
};

const reconcileReply = (
  ticket: SupportTicket | undefined,
  reply: TicketReply,
  optimisticId?: string,
): SupportTicket | undefined => {
  if (!ticket) {
    return ticket;
  }

  const replies = (ticket.replies ?? []).filter(
    (existing) => existing.id !== optimisticId && existing.id !== reply.id,
  );
  replies.push(reply);

  return {
    ...ticket,
    replies: replies.sort(
      (left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt),
    ),
  };
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketRequest) =>
      supportApi.createTicket(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] }),
  });
};
export const useGetUserTickets = (enabled = true) =>
  useQuery({
    queryKey: ["support", "tickets"],
    queryFn: supportApi.getUserTickets,
    enabled,
  });
export const useGetUserTicket = (ticketRef?: string, enabled = true) =>
  useQuery({
    queryKey: ["support", "ticket", ticketRef],
    queryFn: () => supportApi.getUserTicket(ticketRef!),
    enabled: Boolean(ticketRef) && enabled,
    refetchInterval: enabled && ticketRef ? 5000 : false,
    refetchIntervalInBackground: false,
  });
export const useSendTicketMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<
    TicketReply,
    Error,
    SendTicketMessageRequest,
    OptimisticReplyContext
  >({
    mutationFn: (payload: SendTicketMessageRequest) =>
      supportApi.sendMessage(payload),
    onMutate: async (variables) => {
      const queryKey = ["support", "ticket", variables.ticketId] as const;
      await queryClient.cancelQueries({ queryKey });
      const previousTicket = queryClient.getQueryData<SupportTicket>(queryKey);
      const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimisticReply: TicketReply = {
        id: optimisticId,
        ticket_id: variables.ticketId,
        sender_role: "user",
        message: variables.content,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<SupportTicket>(queryKey, (ticket) =>
        ticket
          ? {
              ...ticket,
              replies: [...(ticket.replies ?? []), optimisticReply],
            }
          : ticket,
      );

      return { previousTicket, optimisticId };
    },
    onError: (_error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          ["support", "ticket", variables.ticketId],
          context.previousTicket,
        );
      }
    },
    onSuccess: (reply, variables, context) => {
      queryClient.setQueryData<SupportTicket>(
        ["support", "ticket", variables.ticketId],
        (ticket) => reconcileReply(ticket, reply, context?.optimisticId),
      );
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["support", "ticket", variables.ticketId],
      });
    },
  });
};
export const useSupportDashboard = () =>
  useQuery({
    queryKey: ["support", "admin", "dashboard"],
    queryFn: supportApi.getDashboard,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });
export const useGetAllTickets = (filters: AdminTicketFilters = {}) =>
  useQuery({
    queryKey: [...ticketsKey, filters],
    queryFn: () => supportApi.getAllTickets(filters),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  });
export const useGetAdminTicket = (ticketRef?: string) =>
  useQuery({
    queryKey: ["support", "admin", "ticket", ticketRef],
    queryFn: () => supportApi.getAdminTicket(ticketRef!),
    enabled: Boolean(ticketRef),
    refetchInterval: ticketRef ? 5000 : false,
    refetchIntervalInBackground: false,
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
    onMutate: async ({ ticketRef, message }) => {
      const queryKey = ["support", "admin", "ticket", ticketRef] as const;
      await queryClient.cancelQueries({ queryKey });
      const previousTicket = queryClient.getQueryData<SupportTicket>(queryKey);
      const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimisticReply: TicketReply = {
        id: optimisticId,
        ticket_id: ticketRef,
        sender_role: "admin",
        message,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<SupportTicket>(queryKey, (ticket) =>
        ticket
          ? {
              ...ticket,
              replies: [...(ticket.replies ?? []), optimisticReply],
            }
          : ticket,
      );

      return { previousTicket, optimisticId };
    },
    onError: (_error, { ticketRef }, context) => {
      if (context) {
        queryClient.setQueryData(
          ["support", "admin", "ticket", ticketRef],
          context.previousTicket,
        );
      }
    },
    onSuccess: (reply, { ticketRef }, context) => {
      queryClient.setQueryData<SupportTicket>(
        ["support", "admin", "ticket", ticketRef],
        (ticket) => reconcileReply(ticket, reply, context?.optimisticId),
      );
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
