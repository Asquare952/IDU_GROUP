import Cookies from "js-cookie";
import api from "../../axios";

export type ReportType = "spam" | "harassment" | "fraud" | "other";
export type ReportStatus = "pending" | "resolved" | "rejected";

export interface CreateReportPayload {
  report_message: string;
  report_type: ReportType;
  search_name?: string;
  report_user_id?: string;
}

export interface Report {
  id: string;
  report_message: string;
  report_type: ReportType;
  report_status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  reportedByUserId?: string;
  reportedUserId?: string;
  searchName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (
  record: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string") {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        return trimmedValue;
      }
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return undefined;
};

const reportResponseKeys = [
  "data",
  "report",
  "report_data",
  "reportData",
  "item",
  "result",
  "record",
  "payload",
] as const;

const normalizeReportRecord = (payload: unknown): Report | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const hasReportShape = [
    "id",
    "_id",
    "report_message",
    "reportMessage",
    "report_type",
    "reportType",
    "report_status",
    "reportStatus",
    "status",
    "createdAt",
    "created_at",
    "updatedAt",
    "updated_at",
    "search_name",
    "searchName",
    "report_user_id",
    "reportUserId",
    "reported_user_id",
    "reportedUserId",
    "reported_by_user_id",
    "reportedByUserId",
  ].some((key) => key in candidate);

  if (!hasReportShape) {
    return null;
  }

  const id = readString(candidate, ["id", "_id"]) ?? "";
  const reportMessage =
    readString(candidate, [
      "report_message",
      "reportMessage",
      "message",
      "description",
      "reason",
    ]) ?? "";
  const reportType =
    (readString(candidate, [
      "report_type",
      "reportType",
      "type",
      "category",
    ]) as ReportType | undefined) ?? "other";
  const reportStatus =
    (readString(candidate, [
      "report_status",
      "reportStatus",
      "status",
    ]) as ReportStatus | undefined) ?? "pending";
  const createdAt =
    readString(candidate, ["createdAt", "created_at", "date"]) ?? "";
  const updatedAt =
    readString(candidate, ["updatedAt", "updated_at"]) ?? createdAt;

  return {
    id,
    report_message: reportMessage,
    report_type: reportType,
    report_status: reportStatus,
    createdAt,
    updatedAt,
    reportedByUserId: readString(candidate, [
      "reportedByUserId",
      "reported_by_user_id",
      "reporterId",
      "reporter_id",
    ]),
    reportedUserId: readString(candidate, [
      "reportedUserId",
      "reported_user_id",
      "reportUserId",
      "report_user_id",
    ]),
    searchName: readString(candidate, ["searchName", "search_name"]),
  };
};

const extractReportRecord = (payload: unknown): Report | null => {
  if (!payload) {
    return null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const report = extractReportRecord(item);
      if (report) {
        return report;
      }
    }

    return null;
  }

  const normalizedReport = normalizeReportRecord(payload);

  if (normalizedReport) {
    return normalizedReport;
  }

  if (!isRecord(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;

  for (const key of reportResponseKeys) {
    const report = extractReportRecord(record[key]);

    if (report) {
      return report;
    }
  }

  return null;
};

const buildFallbackReport = (
  payload: CreateReportPayload,
): Report => ({
  id: "",
  report_message: payload.report_message.trim(),
  report_type: payload.report_type,
  report_status: "pending",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  reportedByUserId: undefined,
  reportedUserId: payload.report_user_id?.trim() || undefined,
  searchName: payload.search_name?.trim() || undefined,
});

export const reportingApi = {
  /**
   * File a report against another user
   * Requires exactly one of: search_name OR report_user_id
   */
  fileReport: async (payload: CreateReportPayload): Promise<Report> => {
    const searchName = payload.search_name?.trim();
    const reportUserId = payload.report_user_id?.trim();
    const hasSearchName = Boolean(searchName);
    const hasUserId = Boolean(reportUserId);

    if (!hasSearchName && !hasUserId) {
      throw new Error("Must provide either search_name or report_user_id");
    }

    if (hasSearchName && hasUserId) {
      throw new Error("Cannot provide both search_name and report_user_id");
    }

    const accessToken = Cookies.get("ACCESS_TOKEN");

    const response = await api.post<ApiResponse<Report>>(
      "/report/",
      {
        report_message: payload.report_message.trim(),
        report_type: payload.report_type,
        ...(searchName ? { search_name: searchName } : {}),
        ...(reportUserId ? { report_user_id: reportUserId } : {}),
      },
      {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      },
    );

    if (isRecord(response.data) && response.data.success === false) {
      throw new Error(
        readString(response.data, ["message"]) ?? "Failed to file report",
      );
    }

    const report =
      extractReportRecord(response.data) ??
      extractReportRecord((response.data as ApiResponse<Report>).data) ??
      buildFallbackReport(payload);

    return report;
  },
};
