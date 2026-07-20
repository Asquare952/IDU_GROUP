import { useMemo } from "react";
import { useChatConversations } from "@/app/api/features/chat/chat.queries";
import { Conversation } from "@/app/api/features/chat/types";
import { RecentInquiries } from "@/app/components/Dashboard/types";

const getParticipant = (conversation: Conversation) => {
  return (conversation.participants ?? [])[0];
};

const getParticipantName = (conversation: Conversation) => {
  const participant = getParticipant(conversation);

  if (!participant) {
    return "Unknown contact";
  }

  return (
    participant.full_name ||
    participant.fullName ||
    participant.email ||
    "Unknown contact"
  );
};

const getParticipantImage = (conversation: Conversation) => {
  const participant = getParticipant(conversation);

  return (
    participant?.image ||
    participant?.profileImage ||
    participant?.profile_image ||
    participant?.avatar ||
    ""
  );
};

const getMessagePreview = (conversation: Conversation) => {
  const preview = conversation.lastMessage?.content?.trim();
  return preview && preview.length > 0 ? preview : "";
};

const isRecentMessage = (conversation: Conversation) => {
  if (!conversation.lastMessage?.createdAt) {
    return false;
  }

  const messageTime = new Date(conversation.lastMessage.createdAt).getTime();

  if (Number.isNaN(messageTime)) {
    return false;
  }

  return Date.now() - messageTime < 15 * 60 * 1000;
};

export const sortRecentInquiries = (items: RecentInquiries[]) => {
  return [...items].sort((left, right) => {
    if (left.isNew && !right.isNew) return -1;
    if (!left.isNew && right.isNew) return 1;

    const leftTime = new Date(left.lastMessageAt ?? "").getTime();
    const rightTime = new Date(right.lastMessageAt ?? "").getTime();

    const timeDifference =
      (Number.isNaN(rightTime) ? 0 : rightTime) -
      (Number.isNaN(leftTime) ? 0 : leftTime);

    if (timeDifference !== 0) return timeDifference;

    return (right.figure ?? 0) - (left.figure ?? 0);
  });
};

export const useRecentInquiries = () => {
  const { conversations, isLoading } = useChatConversations();

  const data = useMemo(() => {
    const mapped = conversations.map((conversation, index) => {
      const conversationId =
        conversation.conversation_id ||
        conversation._id ||
        conversation.id ||
        "";
      const lastMessageAt =
        conversation.lastMessage?.createdAt ||
        conversation.updatedAt ||
        conversation.createdAt;
      const participantImage = getParticipantImage(conversation);

      return {
        id: index + 1,
        name: getParticipantName(conversation),
        message: getMessagePreview(conversation),
        figure: 0,
        image: participantImage || "/assets/user-img-dash.png",
        isNew: isRecentMessage(conversation),
        lastMessageAt,
        conversationId,
      } as RecentInquiries;
    });

    return sortRecentInquiries(mapped).slice(0, 5);
  }, [conversations]);

  return {
    data,
    isLoading,
  };
};
