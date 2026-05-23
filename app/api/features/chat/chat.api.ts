import axiosInstance from "../../axios";
import {
  GetConversationsResponse,
  GetMessagesResponse,
  Message,
  SendMessagePayload,
  Conversation,
  CreateConversationPayload,
  User,
} from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toStringValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
};

const findStringByKeys = (
  value: unknown,
  keys: string[],
): string | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  for (const key of keys) {
    const match = toStringValue(value[key]).trim();

    if (match) {
      return match;
    }
  }

  return undefined;
};

export const sanitizeConversationId = (
  conversationId: string | number | null | undefined,
) => {
  let id = toStringValue(conversationId).trim();

  id = id.replace(/^:+/, "");

  if (id.startsWith("conversation_id")) {
    id = id.replace(/^conversation_id:?/, "");
  }

  if (!id || id === "undefined" || id === "null" || /^conversation-\d+$/.test(id)) {
    return "";
  }

  return id;
};

const unwrapRecord = (payload: unknown, keys: string[]): unknown => {
  let current = payload;

  for (let index = 0; index < 4; index += 1) {
    if (!isRecord(current)) {
      return current;
    }

    const record = current;
    const nextKey = keys.find((key) => record[key] !== undefined);

    if (!nextKey) {
      return record;
    }

    current = record[nextKey];
  }

  return current;
};

const normalizeUser = (value: unknown): User => {
  const record = isRecord(value) ? value : {};
  const id =
    findStringByKeys(record, ["_id", "id", "user_id", "userId"]) || "";
  const firstName =
    findStringByKeys(record, ["first_name", "firstName", "name", "fullName"]) ||
    "User";

  return {
    _id: id,
    id,
    first_name: firstName,
    last_name: findStringByKeys(record, ["last_name", "lastName"]),
    name: findStringByKeys(record, ["name"]),
    fullName: findStringByKeys(record, ["fullName"]),
    firstName: findStringByKeys(record, ["firstName"]),
    role: findStringByKeys(record, ["role"]) as User["role"],
  };
};

const normalizeMessage = (value: unknown): Message => {
  const record = isRecord(value) ? value : {};
  const sender = record.sender ?? record.Sender ?? record.user ?? record.User;

  return {
    _id: findStringByKeys(record, ["_id", "id"]) || "",
    conversation_id:
      findStringByKeys(record, [
        "conversation_id",
        "conversationId",
        "ConversationId",
        "conversation",
      ]) || "",
    senderId:
      findStringByKeys(record, ["senderId", "sender_id", "userId", "user_id"]) ||
      findStringByKeys(sender, ["_id", "id"]) ||
      "",
    content: findStringByKeys(record, ["content", "message", "text", "body"]) || "",
    createdAt: findStringByKeys(record, ["createdAt", "created_at"]) || "",
    updatedAt: findStringByKeys(record, ["updatedAt", "updated_at"]),
  };
};

const extractArray = (payload: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of keys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value;
    }

    const nested = extractArray(value, keys);

    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

const normalizeConversation = (payload: unknown): Conversation => {
  const record = unwrapRecord(payload, [
    "data",
    "conversation",
    "Conversation",
    "result",
  ]);
  const conversation = isRecord(record) ? record : {};
  const conversationId = sanitizeConversationId(
    findStringByKeys(conversation, [
      "conversation_id",
      "conversationId",
      "id",
      "_id",
    ]),
  );
  const participants = extractArray(conversation, [
    "participants",
    "users",
    "members",
  ]).map(normalizeUser);
  const lastMessageSource =
    conversation.lastMessage ??
    conversation.last_message ??
    conversation.message ??
    conversation.latestMessage;

  return {
    conversation_id: conversationId,
    _id: findStringByKeys(conversation, ["_id"]),
    id: findStringByKeys(conversation, ["id"]),
    participants,
    lastMessage: lastMessageSource
      ? normalizeMessage(lastMessageSource)
      : undefined,
    createdAt: findStringByKeys(conversation, ["createdAt", "created_at"]) || "",
    updatedAt: findStringByKeys(conversation, ["updatedAt", "updated_at"]) || "",
  };
};

const normalizeMessagesResponse = (payload: unknown): GetMessagesResponse => ({
  messages: extractArray(payload, ["messages", "data", "items", "results"]).map(
    normalizeMessage,
  ),
});

const normalizeConversationsResponse = (
  payload: unknown,
): GetConversationsResponse => ({
  conversations: extractArray(payload, [
    "conversations",
    "data",
    "items",
    "results",
  ])
    .map(normalizeConversation)
    .filter((conversation) => Boolean(conversation.conversation_id)),
});

export const getMessages = async (
  conversationId: string,
): Promise<GetMessagesResponse> => {
  const id = sanitizeConversationId(conversationId);

  if (!id) {
    return { messages: [] };
  }

  try {
    const { data } = await axiosInstance.get(
      `/chat/message/${encodeURIComponent(id)}`,
    );
    return normalizeMessagesResponse(data);
  } catch {
    return { messages: [] };
  }
};

export const getConversations = async (): Promise<GetConversationsResponse> => {
  const { data } = await axiosInstance.get("/chat/conversation");
  return normalizeConversationsResponse(data);
};

export const createConversation = async (
  payload: CreateConversationPayload,
): Promise<Conversation> => {
  const { data } = await axiosInstance.post("/chat/conversation", payload);
  const conversation = normalizeConversation(data);

  if (!conversation.conversation_id) {
    throw new Error("Conversation was created, but no conversation id was returned.");
  }

  return conversation;
};

export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<Message> => {
  const { data } = await axiosInstance.post("/chat/message", payload);
  return normalizeMessage(unwrapRecord(data, ["data", "message", "result"]));
};
