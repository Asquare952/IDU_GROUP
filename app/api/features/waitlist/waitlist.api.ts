import api from "../../axios";

export interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data?: WaitlistEntry;
}

type WaitlistApiPayload = {
  success?: boolean;
  message?: string;
  data?: unknown;
  waitlist?: unknown;
  waitlists?: unknown;
  entries?: unknown;
  results?: unknown;
};

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

const looksLikeWaitlistEntry = (
  value: unknown,
): value is Record<string, unknown> =>
  isRecord(value) && typeof value.email === "string";

const normalizeWaitlistEntry = (
  entry: Record<string, unknown>,
): WaitlistEntry => ({
  id: toStringValue(entry.id ?? entry._id),
  email: toStringValue(entry.email),
  createdAt: toStringValue(entry.createdAt ?? entry.created_at),
  updatedAt: toStringValue(entry.updatedAt ?? entry.updated_at) || undefined,
});

const extractWaitlistEntry = (payload: unknown): WaitlistEntry | undefined => {
  if (looksLikeWaitlistEntry(payload)) {
    return normalizeWaitlistEntry(payload);
  }

  if (Array.isArray(payload)) {
    const entry = payload.find(looksLikeWaitlistEntry);
    return entry ? normalizeWaitlistEntry(entry) : undefined;
  }

  if (!isRecord(payload)) {
    return undefined;
  }

  for (const key of ["data", "waitlist", "entry", "result"]) {
    const entry = extractWaitlistEntry(payload[key]);

    if (entry) {
      return entry;
    }
  }

  return undefined;
};

const extractWaitlistEntries = (payload: unknown): WaitlistEntry[] => {
  if (Array.isArray(payload)) {
    return payload.flatMap((item) => {
      const entry = extractWaitlistEntry(item);
      return entry ? [entry] : [];
    });
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of [
    "data",
    "waitlist",
    "waitlists",
    "entries",
    "results",
    "rows",
    "docs",
  ]) {
    const entries = extractWaitlistEntries(payload[key]);

    if (entries.length > 0) {
      return entries;
    }
  }

  const entry = extractWaitlistEntry(payload);
  return entry ? [entry] : [];
};

const extractMessage = (payload: unknown): string => {
  if (!isRecord(payload)) {
    return "";
  }

  const message = toStringValue(payload.message).trim();

  if (message) {
    return message;
  }

  for (const key of ["data", "result"]) {
    const nestedMessage = extractMessage(payload[key]);

    if (nestedMessage) {
      return nestedMessage;
    }
  }

  return "";
};

const normalizeWaitlistResponse = (
  payload: WaitlistApiPayload,
): WaitlistResponse => ({
  success: typeof payload.success === "boolean" ? payload.success : true,
  message: extractMessage(payload) || "Successfully joined the waitlist!",
  data: extractWaitlistEntry(payload),
});

export const waitlistApi = {
  joinWaitlist: async (email: string): Promise<WaitlistResponse> => {
    const response = await api.post<WaitlistApiPayload>("/waitlist", {
      email: email.trim().toLowerCase(),
    });
    return normalizeWaitlistResponse(response.data);
  },

  getAdminWaitlist: async (): Promise<WaitlistEntry[]> => {
    const response = await api.get<WaitlistApiPayload>("/admin/waitlist");
    return extractWaitlistEntries(response.data);
  },
};
