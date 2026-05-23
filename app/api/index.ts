/**
 * Central API Exports
 * All API features are exported from here for easy access
 */

// ============================================
// Authentication & Users
// ============================================
export {
  register,
  login,
  googleAuth,
  forgotPasswordApi,
  confirmOtpApi,
  resetPasswordApi,
} from "./features/auth/auth.api";
export * from "./features/auth/auth.queries";
export type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
} from "./features/auth/types";

// ============================================
// Profile Management
// ============================================
export { profileApi } from "./features/profile/profile.api";
export {
  useGetProfile,
  useUpdateProfile,
} from "./features/profile/profile.queries";
export type {
  ProfileUser,
  ProfileData,
  ProfileResponse,
  UpdateProfilePayload,
} from "./features/profile/profile.api";

// ============================================
// Rental Management
// ============================================
export {
  fetchLandlordListedProperties,
  rentalApi,
  normalizeRental,
  normalizeRentalListResponse,
} from "./features/rental/rental.api";
export {
  useGetAllRentals,
  useSearchRentals,
  useGetRentalById,
  useFetchLandlordListedProperties,
  useCreateRental,
  useUpdateRental,
  useDeleteRental,
} from "./features/rental/rental.queries";
export type {
  Rental,
  RentalUser,
  LandlordListedProperties,
  LandlordProfile,
  CreateRentalPayload,
  UpdateRentalPayload,
  RentalSearchParams,
} from "./features/rental/rental.api";

// ============================================
// Property Browse / Details
// ============================================
export {
  propertyApi,
  fetchProperties,
  searchProperties,
  fetchPropertyById,
  normalizeProperty,
  useFetchProperties,
  useSearchProperties,
  useFetchPropertyById,
  useBookProperty,
} from "./features/property";
export type { Property, Properties } from "./features/property";

// ============================================
// Progress Tracking (Likes, Locks, Books)
// ============================================
export { progressApi } from "./features/progress/progress.api";
export {
  useLikedRentals,
  useLockedRentals,
  useBookedRentals,
  useLikeRental,
  useLockRental,
  useBookRental,
  useInitializeLockPayment,
  useUnlikeRental,
  useUnlockRental,
  useUnbookRental,
  useVerifyLockPayment,
  useClearLikedRentals,
  useClearLockedRentals,
  useClearBookedRentals,
} from "./features/progress/progress.queries";

// ============================================
// Notifications
// ============================================
export { notificationApi } from "./features/notification/notification.api";
export {
  useNotifications,
  useNotificationCount,
  useMarkNotificationAsRead,
  useDeleteNotification,
  notificationQueryKeys,
} from "./features/notification/useNotification";
export type {
  Notification,
  NotificationCount,
} from "./features/notification/types";

// ============================================
// Chat/Messaging
// ============================================
export {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
} from "./features/chat/chat.api";
export {
  useChatMessages,
  useChatConversations,
  useSendMessage,
} from "./features/chat/chat.queries";
export type {
  Conversation,
  Message,
  GetConversationsResponse,
  GetMessagesResponse,
  SendMessagePayload,
  CreateConversationPayload,
} from "./features/chat/types";

// ============================================
// Reporting System
// ============================================
export { reportingApi } from "./features/report/report.api";
export { useFileReport } from "./features/report/report.queries";
export type {
  Report,
  CreateReportPayload,
  ReportType,
  ReportStatus,
} from "./features/report/report.api";

// ============================================
// Global Statistics
// ============================================
export {
  getGlobalStatistics,
  normalizeGlobalStatistics,
  EMPTY_GLOBAL_STATISTICS,
} from "./features/global-statistics/global-statistics.api";
export { useGlobalStatistics } from "./features/global-statistics/global-statistics.queries";
export type {
  GlobalStatistics,
  GlobalStatisticsResponse,
} from "./features/global-statistics/types";

// ============================================
// Axios Instance
// ============================================
export { default as api, API_BASE_URL } from "./axios";
