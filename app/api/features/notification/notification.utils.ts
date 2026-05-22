import {
  Notification,
  NotificationCount,
  NotificationCountResponse,
  NotificationListResponse,
  NotificationRecord,
  NotificationValue,
} from "./types";

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const toStringValue = (...values: NotificationValue[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
};

const toBooleanValue = (...values: NotificationValue[]) => {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "number") {
      return value > 0;
    }

    if (typeof value === "string") {
      const normalizedValue = value.trim().toLowerCase();

      if (["true", "1", "yes", "read"].includes(normalizedValue)) {
        return true;
      }

      if (["false", "0", "no", "unread"].includes(normalizedValue)) {
        return false;
      }
    }
  }

  return false;
};

const toNumberValue = (...values: NotificationValue[]) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const parsedValue = Number(value.replace(/,/g, "").trim());

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return 0;
};

const getNotificationMessage = (notification: NotificationRecord) => {
  return toStringValue(
    notification.message as NotificationValue,
    notification.notificationMessage as NotificationValue,
    notification.notification_message as NotificationValue,
    notification.body as NotificationValue,
    notification.content as NotificationValue,
    notification.text as NotificationValue,
    notification.description as NotificationValue,
    notification.details as NotificationValue,
    notification.title as NotificationValue,
    notification.notificationTitle as NotificationValue,
    notification.notification_title as NotificationValue,
    notification.subject as NotificationValue,
  );
};

export const normalizeNotification = (
  notification: NotificationRecord,
): Notification => {
  const title = toStringValue(
    notification.title as NotificationValue,
    notification.notificationTitle as NotificationValue,
    notification.notification_title as NotificationValue,
    notification.subject as NotificationValue,
    notification.heading as NotificationValue,
  );
  const message = getNotificationMessage(notification);
  const createdAt = toStringValue(
    notification.createdAt as NotificationValue,
    notification.created_at as NotificationValue,
    notification.updatedAt as NotificationValue,
    notification.updated_at as NotificationValue,
    notification.date as NotificationValue,
    notification.timestamp as NotificationValue,
  );

  return {
    id:
      toStringValue(
        notification.id as NotificationValue,
        notification._id as NotificationValue,
        notification.uuid as NotificationValue,
        notification.notificationId as NotificationValue,
        notification.notification_id as NotificationValue,
      ) || crypto.randomUUID(),
    title,
    message,
    isRead: toBooleanValue(
      notification.isRead as NotificationValue,
      notification.is_read as NotificationValue,
      notification.read as NotificationValue,
      notification.read_status as NotificationValue,
      notification.status as NotificationValue,
    ),
    createdAt,
  };
};

const getNotificationTimeValue = (notification: Notification) => {
  const parsedDate = Date.parse(notification.createdAt);

  if (Number.isNaN(parsedDate)) {
    return 0;
  }

  return parsedDate;
};

const sortNotifications = (notifications: Notification[]) => {
  return [...notifications].sort((firstNotification, secondNotification) => {
    return (
      getNotificationTimeValue(secondNotification) -
      getNotificationTimeValue(firstNotification)
    );
  });
};

export const normalizeNotifications = (
  payload: NotificationListResponse,
): Notification[] => {
  let source: unknown = payload;

  if (Array.isArray(payload)) {
    source = payload;
  } else if (Array.isArray(payload.notifications)) {
    source = payload.notifications;
  } else if (Array.isArray(payload.results)) {
    source = payload.results;
  } else if (Array.isArray(payload.items)) {
    source = payload.items;
  } else if (Array.isArray(payload.docs)) {
    source = payload.docs;
  } else if (Array.isArray(payload.rows)) {
    source = payload.rows;
  } else if (Array.isArray(payload.records)) {
    source = payload.records;
  } else if (Array.isArray(payload.data)) {
    source = payload.data;
  } else if (isRecord(payload.data)) {
    const nestedData = payload.data;

    if (Array.isArray(nestedData.notifications)) {
      source = nestedData.notifications;
    } else if (Array.isArray(nestedData.results)) {
      source = nestedData.results;
    } else if (Array.isArray(nestedData.items)) {
      source = nestedData.items;
    } else if (Array.isArray(nestedData.docs)) {
      source = nestedData.docs;
    } else if (Array.isArray(nestedData.rows)) {
      source = nestedData.rows;
    } else if (Array.isArray(nestedData.records)) {
      source = nestedData.records;
    }
  }

  if (!Array.isArray(source)) {
    return [];
  }

  const notifications = source
    .filter(isRecord)
    .map((notification) =>
      normalizeNotification(notification as NotificationRecord),
    )
    .filter(
      (notification) =>
        Boolean(notification.id) &&
        Boolean(notification.message || notification.title),
    );

  return sortNotifications(notifications);
};

export const normalizeNotificationCount = (
  payload: NotificationCountResponse,
): NotificationCount => {
  if (typeof payload === "number") {
    return { count: payload };
  }

  const data =
    isRecord(payload.data) && !Array.isArray(payload.data) ? payload.data : {};

  return {
    count: toNumberValue(
      payload.count as NotificationValue,
      payload.unreadCount as NotificationValue,
      payload.unread_count as NotificationValue,
      payload.total as NotificationValue,
      data.count as NotificationValue,
      data.unreadCount as NotificationValue,
      data.unread_count as NotificationValue,
      payload.data as NotificationValue,
    ),
  };
};
