export type NotificationValue = string | number | boolean | null | undefined;

export interface Notification {
  id: string;
  title: string
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationCount {
  count: number;
}

export type NotificationRecord = Record<string, unknown> & {
  id?: NotificationValue;
  is_read?: NotificationValue;
  notification?: NotificationValue;
  createdAt?: NotificationValue;
  updatedAt?: NotificationValue;
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
