/**
 * Rentulo Frontend API Integration Summary
 * ===========================================
 * 
 * All Backend API Endpoints Consumed
 * Base URL: https://idu-group-backend.onrender.com
 */

// ============================================
// 1. AUTHENTICATION & USERS
// ============================================

/**
 * POST /auth/register
 * Description: Registers a new user account
 * File: app/api/features/auth/auth.api.ts
 * Status: ✅ IMPLEMENTED
 */

/**
 * POST /auth/login
 * Description: Authenticates a user and returns a JWT token
 * File: app/api/features/auth/auth.api.ts
 * Status: ✅ IMPLEMENTED
 */

/**
 * POST /auth/google-auth
 * Description: Google Authentication (Login & Register)
 * File: app/api/features/auth/auth.api.ts
 * Status: ✅ IMPLEMENTED
 */

/**
 * POST /auth/forgot-password
 * Description: Generates an OTP and sends it via email to the user
 * File: app/api/features/auth/auth.api.ts
 * Status: ✅ IMPLEMENTED
 */

/**
 * POST /auth/confirm-otp
 * Description: Verifies if the OTP code provided is correct and valid
 * File: app/api/features/auth/auth.api.ts
 * Status: ✅ IMPLEMENTED
 */

/**
 * POST /auth/reset-password
 * Description: Allows the user to reset their password with a valid OTP
 * File: app/api/features/auth/auth.api.ts
 * Status: ✅ IMPLEMENTED
 */

/**
 * GET /search
 * Description: Searches for users by their name or email
 * Status: ✅ AVAILABLE (Query: ?name=<search_string>)
 */

// ============================================
// 2. PROFILE MANAGEMENT
// ============================================

/**
 * PUT /profile/update
 * Description: Updates profile details and uploads files
 * File: app/api/features/profile/profile.api.ts
 * Status: ✅ IMPLEMENTED
 * Supports: bio, profileImage (file), coverImage (file)
 */

/**
 * GET /profile/get1/:id
 * Description: Fetches a user's full profile and their associated rentals
 * File: app/api/features/profile/profile.api.ts
 * Status: ✅ IMPLEMENTED
 * Params: id (User ID)
 */

// ============================================
// 3. RENTAL MANAGEMENT
// ============================================

/**
 * POST /rental/post
 * Description: Creates a property listing (Landlords only)
 * File: app/api/features/rental/rental.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hooks: app/api/features/rental/rental.queries.ts
 */

/**
 * GET /rental/all
 * Description: Returns all rental listings in the system
 * File: app/api/features/rental/rental.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useGetAllRentals()
 */

/**
 * GET /rental/search
 * Description: Searches rentals by location mapping
 * File: app/api/features/rental/rental.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useSearchRentals()
 * Query: ?location=<string> OR ?lat=<curr_lat>&lng=<curr_lng>
 */

/**
 * GET /rental/get1/:id
 * Description: Fetches a single rental by its ID or Slug
 * File: app/api/features/rental/rental.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useGetRentalById(id)
 * Params: id (Rental UUID or Slug)
 */

/**
 * PUT /rental/update/:id
 * Description: Updates a rental listing (Landlords only)
 * File: app/api/features/rental/rental.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useUpdateRental(id)
 */

/**
 * DELETE /rental/delete/:id
 * Description: Deletes a property (Landlords only)
 * File: app/api/features/rental/rental.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useDeleteRental()
 */

// ============================================
// 4. REPORTING SYSTEM
// ============================================

/**
 * POST /report/
 * Description: Files a report against another user
 * File: app/api/features/report/report.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useFileReport()
 * Body: report_message, report_type, AND EXACTLY ONE OF search_name OR report_user_id
 */

// ============================================
// 5. SYSTEM NOTIFICATIONS
// ============================================

/**
 * GET /notification/
 * Description: Fetches all notifications belonging to the logged-in user
 * File: app/api/features/notification/notification.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useNotifications()
 */

/**
 * GET /notification/count
 * Description: Returns the count of unread notifications
 * File: app/api/features/notification/notification.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useNotificationCount()
 */

/**
 * PUT /notification/read
 * Description: Marks a specific notification as 'read'
 * File: app/api/features/notification/notification.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useMarkNotificationAsRead()
 * Body: id (Notification ID)
 */

/**
 * DELETE /notification/delete
 * Description: Deletes a specific notification entirely
 * File: app/api/features/notification/notification.api.ts
 * Status: ✅ IMPLEMENTED
 * Body: id (Notification ID)
 */

// ============================================
// 6. PROGRESS TRACKING (LIKES, LOCKS, BOOKS)
// ============================================

/**
 * POST /progress/like
 * Description: Likes a rental house
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useLikeRental()
 * Body: rental_id
 */

/**
 * GET /progress/like
 * Description: Retrieves all houses liked by the user
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useLikedRentals()
 */

/**
 * DELETE /progress/like/:id
 * Description: Unlikes a specific house
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useUnlikeRental()
 * Params: id (Rental ID, not progress ID)
 */

/**
 * DELETE /progress/like
 * Description: Clears all liked houses for the user
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useClearLikedRentals()
 */

/**
 * POST /progress/lock
 * Description: Locks a rental house (Requires house to be liked first)
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useLockRental()
 * Body: rental_id
 */

/**
 * GET /progress/lock
 * Description: Retrieves all locked houses
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useLockedRentals()
 */

/**
 * DELETE /progress/lock/:id
 * Description: Removes a house from the locked list
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useUnlockRental()
 * Params: id (Rental ID)
 */

/**
 * DELETE /progress/lock
 * Description: Clears all locked houses
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useClearLockedRentals()
 */

/**
 * POST /progress/book
 * Description: Books a rental house (Requires house to be liked first)
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useBookRental()
 * Body: rental_id
 */

/**
 * GET /progress/book
 * Description: Retrieves all booked houses
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useBookedRentals()
 */

/**
 * DELETE /progress/book/:id
 * Description: Removes a house from the booked list
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useUnbookRental()
 * Params: id (Rental ID)
 */

/**
 * DELETE /progress/book
 * Description: Clears all booked houses
 * File: app/api/features/progress/progress.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useClearBookedRentals()
 */

// ============================================
// 7. GLOBAL APPLICATION STATISTICS
// ============================================

/**
 * GET /counts/
 * Description: Retrieves high-level application metrics
 * File: app/api/features/global-statistics/global-statistics.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useGlobalStatistics()
 * Returns: totalUsers, totalListings, totalLandlords, totalTenants
 */

// ============================================
// 8. CHATTING SYSTEM
// ============================================

/**
 * POST /chat/conversation
 * Description: Retrieves an existing chat or creates a new conversation
 * File: app/api/features/chat/chat.api.ts
 * Status: ✅ IMPLEMENTED (Chat frontend completed by other developer)
 * Body: other_user_id
 */

/**
 * GET /chat/conversation
 * Description: Retrieves all ongoing chats for the logged in user
 * File: app/api/features/chat/chat.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useChatConversations()
 */

/**
 * POST /chat/message
 * Description: Sends a new message inside a specific conversation
 * File: app/api/features/chat/chat.api.ts
 * Status: ✅ IMPLEMENTED
 * Mutation Hook: useSendMessage()
 * Body: conversation_id, content
 */

/**
 * GET /chat/message/:conversation_id
 * Description: Retrieves all messages for a specific conversation
 * File: app/api/features/chat/chat.api.ts
 * Status: ✅ IMPLEMENTED
 * Query Hook: useChatMessages(conversationId)
 * Params: conversation_id
 */

/**
 * Socket.io Events
 * join_conversation: Listen for messages (pass direct integer conversation_id)
 * new_message: Receive instant messages when any user posts
 * File: app/lib/socket.ts
 * Status: ✅ IMPLEMENTED
 */

// ============================================
// 9. SUPER ADMIN MANAGEMENT (NOT IMPLEMENTED)
// ============================================
/**
 * ⛔ NOT IMPLEMENTED - Reserved for Super Admin Only
 * 
 * The following endpoints require is_superadmin = true:
 * - GET /admin/users (Fetch all system users)
 * - PUT /admin/users/:id/status (Block/unblock user)
 * - DELETE /admin/users/:id (Delete user account)
 * - GET /admin/rentals (Fetch all listings)
 * - DELETE /admin/rentals/:id (Remove listing)
 * - GET /admin/rentals/locked (Retrieve locked listings)
 * - GET /admin/reports (Fetch all reports)
 * - PUT /admin/reports/:id/status (Update report status)
 * - GET /admin/chats (Retrieve all chats)
 * - GET /admin/chats/:id/messages (Retrieve messages in conversation)
 * 
 * Reason: Super Admin endpoints are not needed for regular user/landlord operations
 */

// ============================================
// SUMMARY
// ============================================
/**
 * ✅ Total Endpoints Implemented: 34+
 * ✅ All Regular User Endpoints: CONSUMED
 * ⛔ Super Admin Endpoints: NOT CONSUMED (As requested)
 * 
 * Key Features Implemented:
 * - Authentication & Authorization
 * - Rental Property Management
 * - Progress Tracking (Like, Lock, Book)
 * - Notifications System
 * - User Profiles
 * - Chat/Messaging
 * - Reporting System
 * - Global Statistics
 * - React Query Integration
 * - Mutation & Query Hooks
 * 
 * Frontend Improvements Made:
 * ✅ Landing page now shows listings without login restriction
 * ✅ Tenant dashboard shows real recommended houses from API
 * ✅ Rental upload form fixed (500 error resolved)
 * ✅ All API endpoints fully typed with TypeScript
 * ✅ React Query hooks for data fetching and caching
 * ✅ Error handling and loading states
 */
