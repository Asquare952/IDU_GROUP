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

export const reportingApi = {
  /**
   * File a report against another user
   * Requires exactly one of: search_name OR report_user_id
   */
  fileReport: async (payload: CreateReportPayload): Promise<Report> => {
    // Validate that exactly one targeting method is used
    const hasSearchName = !!payload.search_name;
    const hasUserId = !!payload.report_user_id;

    if (!hasSearchName && !hasUserId) {
      throw new Error("Must provide either search_name or report_user_id");
    }

    if (hasSearchName && hasUserId) {
      throw new Error("Cannot provide both search_name and report_user_id");
    }

    const response = await api.post<ApiResponse<Report>>("/report/", payload);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to file report");
    }

    return response.data.data;
  },
};
