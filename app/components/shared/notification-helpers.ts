import { Notification } from "@/app/api/features/notification";

export const getNotificationType = (notification: Notification) => {
  const content = `${notification.title} ${notification.message}`.toLowerCase();

  if (
    ["welcome", "approved", "created", "success", "onboard", "verified"].some(
      (keyword) => content.includes(keyword),
    )
  ) {
    return "Success" as const;
  }

  return "Info" as const;
};

export const formatNotificationTime = (value: string) => {
  const parsedDate = Date.parse(value);

  if (Number.isNaN(parsedDate)) {
    return value || "Just now";
  }

  const differenceInSeconds = Math.floor((Date.now() - parsedDate) / 1000);

  if (differenceInSeconds < 60) {
    return "Just now";
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const timeUnits: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> =
    [
      { amount: 60, unit: "second" },
      { amount: 60, unit: "minute" },
      { amount: 24, unit: "hour" },
      { amount: 7, unit: "day" },
      { amount: 4.34524, unit: "week" },
      { amount: 12, unit: "month" },
    ];

  let duration = differenceInSeconds;

  for (const { amount, unit } of timeUnits) {
    if (Math.abs(duration) < amount) {
      return rtf.format(-Math.round(duration), unit);
    }

    duration /= amount;
  }

  return rtf.format(-Math.round(duration), "year");
};
