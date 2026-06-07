import type { Rental } from "../rental";

export type AdminUserProfile = {
  verified: boolean;
  image?: string;
};

export type AdminUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_superadmin: boolean;
  createdAt: string;
  updatedAt?: string;
  phone_no?: string;
  state?: string;
  address?: string;
  country?: string;
  rentalsCount: number;
  profile: AdminUserProfile | null;
};

export type AdminRental = Rental & {
  landlordName: string;
  userId: string;
  userEmail?: string;
  lockedByCount: number;
  tenantCount: number;
};

export type AdminReportStatus = "pending" | "resolved" | "rejected" | string;

export type AdminReport = {
  id: string;
  report_message: string;
  report_type: string;
  status: AdminReportStatus;
  createdAt: string;
  reporterName: string;
  reporterEmail?: string;
  targetName?: string;
  targetEmail?: string;
  searchName?: string;
  reportUserId?: string;
};

export type AdminChatParticipant = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

export type AdminChatConversation = {
  conversationId: string;
  participants: AdminChatParticipant[];
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
};

// ==================== ANALYTICS TYPES ====================
export type AdminAnalytics = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  usersByRole: {
    landlords: number;
    tenants: number;
    admins: number;
  };
  totalRentals: number;
  totalLikes: number;
  totalLocks: number;
  totalBookings: number;
  pendingReports: number;
  resolvedReports: number;
  totalTransactionRevenue: number;
};

// ==================== AUTH TYPES ====================
export type AdminRegisterPayload = {
  full_name: string;
  gender: "male" | "female" | "others";
  phone_no: string;
  email: string;
  address: string;
  state: string;
  password: string;
  adminSecretKey: string;
};

export type AdminVerifyOTPPayload = {
  email: string;
  otpCode: string;
};

export type AdminLoginPayload = {
  user: string;
  password: string;
};

export type AuthMeResponse = {
  isLoggedIn: boolean;
  userRole: string | null;
};

// ==================== REPORT TYPES ====================
export type ReportPayload = {
  report_message: string;
  report_type: string;
  search_name?: string;
  report_user_id?: string;
};
