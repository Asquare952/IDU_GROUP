export type ChatRole = "user" | "assistant";

export type SendChatPayload = {
  message: string;
  session_id?: string; // omit to start a new session
};

export type SendChatResponse = {
  success: boolean;
  data: {
    session_id: string;
    reply: string;
  };
};

export type ChatSession = {
  session_id: string;
  message_count: string;
  last_active: string;
  created_at: string;
};

export type SessionsResponse = {
  success: boolean;
  data: ChatSession[];
};

export type ChatSessionSummary = {
  session_id: string;
  last_message: string;
  last_role: ChatRole;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  session_id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

// GET /ai-support/history returns session summaries when no session_id is passed,
// or the full ordered transcript when one is.
export type HistoryResponse = {
  success: boolean;
  data: ChatSessionSummary[] | ChatMessage[];
};

export type DeleteSessionResponse = {
  success: boolean;
  message: string;
};
