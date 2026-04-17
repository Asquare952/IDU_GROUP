export interface NotificationData {
  id: number;
  type: "Success" | "Info";
  message: string;
  time: string;
  isRead: boolean;
}

export const LANDLORD_NOTIFICATIONS: NotificationData[] = [
  {
    id: 1,
    type: "Success",
    message:
      "Welcome to RentULO, Daniel! Your Landlord account was created via Google and we're happy to have you onboard.",
    time: "5m ago",
    isRead: false,
  },
  {
    id: 2,
    type: "Info",
    message:
      "New Feature: You can now export your rental income reports as PDF from the Insights tab.",
    time: "1h ago",
    isRead: true,
  },
];
