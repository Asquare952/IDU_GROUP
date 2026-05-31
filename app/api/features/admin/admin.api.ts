import api from "../../axios";
import { normalizeRental, type RawRental } from "../rental";
import type {
  AdminChatConversation,
  AdminChatMessage,
  AdminChatParticipant,
  AdminRegisterPayload,
  AdminRental,
  AdminReport,
  AdminReportStatus,
  AdminUser,
  AdminVerifyOTPPayload,
  AuthMeResponse,
  AdminLoginPayload,
  AdminAnalytics,
  ReportPayload,
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

const toBooleanValue = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (["true", "1", "yes", "active", "verified"].includes(normalizedValue)) {
      return true;
    }

    if (
      ["false", "0", "no", "inactive", "blocked", "suspended"].includes(
        normalizedValue,
      )
    ) {
      return false;
    }
  }

  return fallback;
};

const toNumberValue = (value: unknown, fallback = 0): number => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const findStringByKeys = (
  value: unknown,
  keys: string[],
): string | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  for (const key of keys) {
    const directMatch = toStringValue(value[key]).trim();

    if (directMatch) {
      return directMatch;
    }
  }

  for (const nestedValue of Object.values(value)) {
    const nestedMatch = findStringByKeys(nestedValue, keys);

    if (nestedMatch) {
      return nestedMatch;
    }
  }

  return undefined;
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

const extractListPayload = (payload: unknown): unknown[] =>
  extractArray(payload, [
    "data",
    "users",
    "rentals",
    "reports",
    "chats",
    "conversations",
    "messages",
    "items",
    "results",
    "rows",
    "docs",
  ]);

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    first_name: parts[0] ?? "",
    last_name: parts.slice(1).join(" "),
  };
};

const getUserName = (value: unknown) => {
  if (!isRecord(value)) {
    return "";
  }

  const firstName = findStringByKeys(value, ["first_name", "firstName"]);
  const lastName = findStringByKeys(value, ["last_name", "lastName"]);
  const joinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (joinedName) {
    return joinedName;
  }

  return (
    findStringByKeys(value, ["fullName", "name", "username", "email"]) ?? ""
  );
};

const normalizeAdminUser = (payload: unknown): AdminUser => {
  const record = isRecord(payload) ? payload : {};
  const fullName = getUserName(record);
  const splitName = splitFullName(fullName);
  const profileValue = (record.Profile ?? record.profile) as unknown;
  const rentals = extractArray(record, ["rentals", "properties", "listings"]);
  const rentalsCount =
    rentals.length ||
    toNumberValue(
      record.rentalsCount ??
        record.propertiesCount ??
        record.totalListings ??
        record.totalProperties,
      0,
    );

  return {
    id: findStringByKeys(record, ["id", "_id", "userId", "user_id"]) ?? "",
    first_name:
      findStringByKeys(record, ["first_name", "firstName"]) ??
      splitName.first_name,
    last_name:
      findStringByKeys(record, ["last_name", "lastName"]) ??
      splitName.last_name,
    email: findStringByKeys(record, ["email"]) ?? "",
    role: findStringByKeys(record, ["role"]) ?? "user",
    is_active: toBooleanValue(record.is_active, true),
    is_superadmin: toBooleanValue(record.is_superadmin, false),
    createdAt:
      findStringByKeys(record, ["createdAt", "created_at", "joinedAt"]) ?? "",
    updatedAt: findStringByKeys(record, ["updatedAt", "updated_at"]),
    phone_no: findStringByKeys(record, ["phone_no", "phone"]),
    state: findStringByKeys(record, ["state"]),
    address: findStringByKeys(record, ["address"]),
    country: findStringByKeys(record, ["country"]),
    rentalsCount,
    profile: profileValue
      ? {
          verified: toBooleanValue(
            (profileValue as Record<string, unknown>).verified,
            false,
          ),
          image: findStringByKeys(profileValue, [
            "image",
            "profileImage",
            "profile_image",
          ]),
        }
      : null,
  };
};

const looksLikeRental = (value: unknown): value is RawRental => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    "title" in value ||
    "propertyType" in value ||
    "location" in value ||
    "price" in value ||
    "images" in value
  );
};

const extractRentalCandidate = (value: unknown): RawRental | null => {
  if (!value) {
    return null;
  }

  if (looksLikeRental(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return null;
  }

  for (const key of [
    "rental",
    "Rental",
    "property",
    "Property",
    "listing",
    "Listing",
    "data",
  ]) {
    const nested = extractRentalCandidate(value[key]);

    if (nested) {
      return nested;
    }
  }

  return null;
};

const normalizeAdminRental = (payload: unknown): AdminRental => {
  const rawRental = extractRentalCandidate(payload) ?? {};
  const normalizedRental = normalizeRental(rawRental);
  const record = isRecord(payload) ? payload : {};
  const userRecord = (record.User ?? record.user ?? rawRental.User) as unknown;
  const locks = extractArray(record, [
    "locks",
    "lockedBy",
    "lockers",
    "progress",
    "items",
  ]);

  return {
    ...normalizedRental,
    landlordName: getUserName(userRecord) || "Unknown Landlord",
    userId:
      findStringByKeys(record, ["UserId", "userId", "user_id"]) ||
      normalizedRental.UserId,
    userEmail: findStringByKeys(userRecord, ["email"]),
    lockedByCount:
      locks.length ||
      toNumberValue(
        record.lockedByCount ??
          record.locksCount ??
          record.lockCount ??
          record.locked_count,
        0,
      ),
    tenantCount: toNumberValue(
      record.tenantCount ??
        record.tenantsCount ??
        record.bookedCount ??
        record.booksCount,
      0,
    ),
  };
};

const dedupeAdminRentals = (rentals: AdminRental[]) => {
  const rentalsById = new Map<string, AdminRental>();

  rentals.forEach((rental) => {
    const existingRental = rentalsById.get(rental.id);

    if (!existingRental) {
      rentalsById.set(rental.id, rental);
      return;
    }

    rentalsById.set(rental.id, {
      ...existingRental,
      lockedByCount: Math.max(
        existingRental.lockedByCount,
        existingRental.lockedByCount + 1,
        rental.lockedByCount,
      ),
      tenantCount: Math.max(existingRental.tenantCount, rental.tenantCount),
    });
  });

  return [...rentalsById.values()];
};

const normalizeAdminReport = (payload: unknown): AdminReport => {
  const record = isRecord(payload) ? payload : {};
  const reporterSource =
    record.reporter ??
    record.Reporter ??
    record.user ??
    record.User ??
    record.createdBy;
  const targetSource =
    record.reportedUser ??
    record.report_user ??
    record.reportUser ??
    record.targetUser ??
    record.ReportUser;

  return {
    id: findStringByKeys(record, ["id", "_id"]) ?? "",
    report_message:
      findStringByKeys(record, [
        "report_message",
        "message",
        "description",
        "reason",
      ]) ?? "",
    report_type:
      findStringByKeys(record, ["report_type", "type", "category"]) ?? "other",
    status:
      (findStringByKeys(record, [
        "status",
        "report_status",
        "reportStatus",
      ]) as AdminReportStatus) ?? "pending",
    createdAt:
      findStringByKeys(record, ["createdAt", "created_at", "date"]) ?? "",
    reporterName:
      getUserName(reporterSource) ||
      findStringByKeys(record, [
        "search_name",
        "searchName",
        "reporterName",
        "reporter_name",
      ]) ||
      "Unknown Reporter",
    reporterEmail: findStringByKeys(reporterSource, ["email"]),
    targetName: getUserName(targetSource),
    targetEmail: findStringByKeys(targetSource, ["email"]),
    searchName: findStringByKeys(record, ["search_name", "searchName"]),
    reportUserId: findStringByKeys(record, [
      "report_user_id",
      "reportUserId",
      "reported_user_id",
    ]),
  };
};

const sanitizeConversationId = (value: unknown) =>
  toStringValue(value).trim().replace(/^:+/, "");

const normalizeChatParticipant = (payload: unknown): AdminChatParticipant => {
  const record = isRecord(payload) ? payload : {};

  return {
    id: findStringByKeys(record, ["id", "_id", "userId", "user_id"]) ?? "",
    name: getUserName(record) || "Unknown User",
    email: findStringByKeys(record, ["email"]),
    role: findStringByKeys(record, ["role"]),
  };
};

const normalizeChatConversation = (payload: unknown): AdminChatConversation => {
  const record = isRecord(payload) ? payload : {};
  const participants = extractArray(record, [
    "participants",
    "users",
    "members",
  ]).map(normalizeChatParticipant);
  const lastMessageSource =
    record.lastMessage ??
    record.last_message ??
    record.message ??
    record.latestMessage;

  return {
    conversationId:
      sanitizeConversationId(
        findStringByKeys(record, [
          "conversation_id",
          "conversationId",
          "_id",
          "id",
        ]),
      ) ?? "",
    participants,
    lastMessage:
      findStringByKeys(lastMessageSource, ["content", "message", "text"]) ||
      toStringValue(lastMessageSource),
    lastMessageAt:
      findStringByKeys(lastMessageSource, ["createdAt", "created_at"]) ||
      findStringByKeys(record, ["updatedAt", "updated_at"]) ||
      "",
    createdAt: findStringByKeys(record, ["createdAt", "created_at"]) ?? "",
    updatedAt: findStringByKeys(record, ["updatedAt", "updated_at"]) ?? "",
  };
};

const normalizeChatMessage = (payload: unknown): AdminChatMessage => {
  const record = isRecord(payload) ? payload : {};
  const senderSource =
    record.sender ?? record.Sender ?? record.user ?? record.User ?? {};

  return {
    id: findStringByKeys(record, ["id", "_id"]) ?? "",
    conversationId:
      findStringByKeys(record, [
        "conversation_id",
        "conversationId",
        "conversation",
      ]) ?? "",
    senderId:
      findStringByKeys(record, [
        "senderId",
        "sender_id",
        "userId",
        "user_id",
      ]) ||
      findStringByKeys(senderSource, ["id", "_id"]) ||
      "",
    senderName: getUserName(senderSource) || "User",
    content:
      findStringByKeys(record, ["content", "message", "text", "body"]) ?? "",
    createdAt: findStringByKeys(record, ["createdAt", "created_at"]) ?? "",
    updatedAt: findStringByKeys(record, ["updatedAt", "updated_at"]),
  };
};



//======== Test ======
export const adminApi = {
  getUsers: async (): Promise<AdminUser[]> => {
    const response = await api.get("/admin/users");
    return extractListPayload(response.data).map(normalizeAdminUser);
  },

  toggleUserStatus: async (id: string): Promise<unknown> => {
    const response = await api.put(`/admin/users/${id}/status`, {});
    return response.data;
  },

  suspendUser: async (id: string): Promise<unknown> => {
    const response = await api.put(`/admin/users/${id}/suspend`, {});
    return response.data;
  },

  unsuspendUser: async (id: string): Promise<unknown> => {
    const response = await api.put(`/admin/users/${id}/unsuspend`, {});
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  getRentals: async (): Promise<AdminRental[]> => {
    const response = await api.get("/admin/rentals");
    return dedupeAdminRentals(
      extractListPayload(response.data).map(normalizeAdminRental),
    );
  },

  deleteRental: async (id: string): Promise<void> => {
    await api.delete(`/admin/rentals/${id}`);
  },

  getLockedRentals: async (): Promise<AdminRental[]> => {
    const response = await api.get("/admin/rentals/locked");
    return dedupeAdminRentals(
      extractListPayload(response.data).map(normalizeAdminRental),
    );
  },

  getReports: async (): Promise<AdminReport[]> => {
    const response = await api.get("/admin/reports");
    return extractListPayload(response.data).map(normalizeAdminReport);
  },

  updateReportStatus: async (
    id: string,
    status: AdminReportStatus,
  ): Promise<unknown> => {
    const response = await api.put(`/admin/reports/${id}/status`, { status });
    return response.data;
  },

  getChats: async (): Promise<AdminChatConversation[]> => {
    const response = await api.get("/admin/chats");
    return extractListPayload(response.data)
      .map(normalizeChatConversation)
      .filter((chat) => Boolean(chat.conversationId));
  },

  getChatMessages: async (id: string): Promise<AdminChatMessage[]> => {
    const response = await api.get(
      `/admin/chats/${encodeURIComponent(id)}/messages`,
    );
    return extractListPayload(response.data).map(normalizeChatMessage);
  },

  getAnalytics: async (): Promise<AdminAnalytics> => {
    const response = await api.get("/admin/analytics");
    const data = response.data;
    return {
      totalUsers: toNumberValue(data.totalUsers ?? data.total_users, 0),
      activeUsers: toNumberValue(data.activeUsers ?? data.active_users, 0),
      suspendedUsers: toNumberValue(data.suspendedUsers ?? data.suspended_users, 0),
      usersByRole: {
        landlords: toNumberValue(data.usersByRole?.landlords ?? data.landlords, 0),
        tenants: toNumberValue(data.usersByRole?.tenants ?? data.tenants, 0),
        admins: toNumberValue(data.usersByRole?.admins ?? data.admins, 0),
      },
      totalRentals: toNumberValue(data.totalRentals ?? data.total_rentals, 0),
      totalLikes: toNumberValue(data.totalLikes ?? data.total_likes, 0),
      totalLocks: toNumberValue(data.totalLocks ?? data.total_locks, 0),
      totalBookings: toNumberValue(data.totalBookings ?? data.total_bookings, 0),
      pendingReports: toNumberValue(data.pendingReports ?? data.pending_reports, 0),
      resolvedReports: toNumberValue(data.resolvedReports ?? data.resolved_reports, 0),
      totalTransactionRevenue: toNumberValue(data.totalTransactionRevenue ?? data.total_transaction_revenue, 0),
    };
  },
};

export const registerAdmin = async (payload: AdminRegisterPayload) => {
  const response = await api.post(
    "/auth/register-admin",
    {
      ...payload,
      role: "admin",
    },
    {
      headers: {
        "x-admin-secret": payload.adminSecretKey,
      },
    },
  );
  return response.data;
};
export const verifyAdminOTP = async (payload: AdminVerifyOTPPayload) => {
  const response = await api.post("/auth/verify-admin", payload);
  return response.data;
};

export const loginAdmin = async (payload: AdminLoginPayload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const checkAuthStatus = async (): Promise<AuthMeResponse> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const fileReport = async (payload: ReportPayload) => {
  const response = await api.post("/report", payload);
  return response.data;
};
