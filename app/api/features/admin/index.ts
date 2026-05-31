// API functions
export { adminApi } from "./admin.api";
export {
  registerAdmin,
  verifyAdminOTP,
  loginAdmin,
  checkAuthStatus,
  logoutAdmin,
  fileReport,
} from "./admin.api";

// React Query hooks
export {
  useAdminUsers,
  useToggleAdminUserStatus,
  useSuspendUser,
  useUnsuspendUser,
  useDeleteAdminUser,
  useAdminRentals,
  useDeleteAdminRental,
  useLockedAdminRentals,
  useAdminReports,
  useUpdateAdminReportStatus,
  useAdminChats,
  useAdminChatMessages,
  useAdminAnalytics,
  // Auth hooks
  useAuthStatus,
  useRegisterAdmin,
  useVerifyAdminOTP,
  useLoginAdmin,
  useLogoutAdmin,
  useFileReport,
} from "./admin.queries";

// Types
export type {
  AdminUser,
  AdminUserProfile,
  AdminRental,
  AdminReport,
  AdminReportStatus,
  AdminChatConversation,
  AdminChatMessage,
  AdminChatParticipant,
  AdminAnalytics,
  ReportPayload,
  //added
  AdminRegisterPayload,
  AdminVerifyOTPPayload,
  AdminLoginPayload,
  AuthMeResponse,
} from "./types";
