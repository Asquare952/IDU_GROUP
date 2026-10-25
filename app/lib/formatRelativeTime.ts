export const formatRelativeTime = (value?: string): string => {
  if (!value) {
    return "Recently";
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return "Recently";
  }

  const differenceInSeconds = (Date.now() - timestamp) / 1000;

  if (differenceInSeconds < 60) {
    return "just now";
  }

  const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const timeUnits: Array<{
    amount: number;
    unit: Intl.RelativeTimeFormatUnit;
  }> = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 12, unit: "month" },
  ];

  let duration = differenceInSeconds;

  for (const { amount, unit } of timeUnits) {
    if (Math.abs(duration) < amount) {
      return relativeTime.format(-Math.round(duration), unit);
    }

    duration /= amount;
  }

  return relativeTime.format(-Math.round(duration), "year");
};
