// API functions
export { adminApi } from "./admin.api";
export {
  registerAdmin,
  verifyAdminOTP,
  loginAdmin,
  checkAuthStatus,
  logoutAdmin,
} from "./admin.api";

// React Query hooks
export {
  useAdminUsers,
  useToggleAdminUserStatus,
  useDeleteAdminUser,
  useAdminRentals,
  useDeleteAdminRental,
  useLockedAdminRentals,
  useAdminReports,
  useUpdateAdminReportStatus,
  useAdminChats,
  useAdminChatMessages,
  // Auth hooks
  useAuthStatus,
  useRegisterAdmin,
  useVerifyAdminOTP,
  useLoginAdmin,
  useLogoutAdmin,
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
  //added
  AdminRegisterPayload,
  AdminVerifyOTPPayload,
  AdminLoginPayload,
  AuthMeResponse,
} from "./types";
