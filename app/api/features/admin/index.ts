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
  useAdminHostDebts,
  useAdminShortletBookings,
  useAdminShortletBooking,
  useAdminDepositClaims,
  useResolveAdminDepositClaim,
  useToggleAdminUserStatus,
  useSuspendUser,
  useUnsuspendUser,
  useDeleteAdminUser,
  useSetShortletCommission,
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
  HostDebt,
  HostDebtStatus,
  HostDebtsResponse,
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
export type {
  AdminShortletBookingStatus,
  AdminShortletDepositStatus,
  AdminShortletBookingFilters,
  AdminShortletBooking,
  AdminShortletBookingDetailResponse,
  AdminShortletBookingsResponse,
  AdminShortletDepositClaim,
  AdminDepositClaim,
  AdminDepositClaimsResponse,
  ResolveAdminDepositClaimPayload,
  ResolveAdminDepositClaimResponse,
} from "./shortlet-booking.types";
