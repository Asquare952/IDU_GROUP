export interface NotificationData {
  id: number;
  type: "Success" | "Info";
  message: string;
  time: string;
  isRead: boolean;
}

export const TENANT_NOTIFICATIONS: NotificationData[] = [
  {
    id: 1,
    type: "Success",
    message:
      "Welcome to RentULO, Ikechukwu! Your Tenant account was created via Email and we're happy to have you onboard.",
    time: "10m ago",
    isRead: false,
  },
  {
    id: 2,
    type: "Success",
    message:
      "Application Approved: Your application for 'Compact mini house' has been accepted by the landlord.",
    time: "2h ago",
    isRead: false,
  },
  {
    id: 3,
    type: "Info",
    message:
      "Rent Reminder: Your rent payment for 'Palm view apartment' is due in 5 days.",
    time: "1d ago",
    isRead: true,
  },
];
