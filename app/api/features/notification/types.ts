export type NotificationValue = string | number | boolean | null | undefined;

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCount {
  count: number;
}

export type NotificationRecord = Record<string, unknown> & {
  id?: NotificationValue;
  _id?: NotificationValue;
  uuid?: NotificationValue;
  notificationId?: NotificationValue;
  notification_id?: NotificationValue;
  title?: NotificationValue;
  notificationTitle?: NotificationValue;
  notification_title?: NotificationValue;
  subject?: NotificationValue;
  heading?: NotificationValue;
  message?: NotificationValue;
  notificationMessage?: NotificationValue;
  notification_message?: NotificationValue;
  body?: NotificationValue;
  content?: NotificationValue;
  text?: NotificationValue;
  description?: NotificationValue;
  details?: NotificationValue;
  isRead?: NotificationValue;
  is_read?: NotificationValue;
  read?: NotificationValue;
  read_status?: NotificationValue;
  status?: NotificationValue;
  createdAt?: NotificationValue;
  created_at?: NotificationValue;
  updatedAt?: NotificationValue;
  updated_at?: NotificationValue;
  date?: NotificationValue;
  timestamp?: NotificationValue;
};

export type NotificationListResponse =
  | NotificationRecord[]
  | (Record<string, unknown> & {
      data?: NotificationRecord[] | Record<string, unknown>;
      notifications?: NotificationRecord[];
      results?: NotificationRecord[];
      items?: NotificationRecord[];
      docs?: NotificationRecord[];
      rows?: NotificationRecord[];
      records?: NotificationRecord[];
    });

export type NotificationCountResponse =
  | number
  | (Record<string, unknown> & {
      count?: NotificationValue;
      unreadCount?: NotificationValue;
      unread_count?: NotificationValue;
      total?: NotificationValue;
      data?: Record<string, unknown> | NotificationValue;
    });
