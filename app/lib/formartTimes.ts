const formatTime = (timeStr?: string | null) => {
  if (!timeStr) return "";
  const s = String(timeStr).trim();

  // If string already contains am/pm, normalize spacing and case: e.g. "7am" -> "7:00 AM"
  const ampmRegex = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i;
  let m = s.match(ampmRegex);
  if (m) {
    const h = parseInt(m[1], 10);
    const min = m[2] ?? "00";
    const suffix = m[3].toUpperCase();
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${min} ${suffix}`;
  }

  // Extract hour and minute from various formats like "HH:MM", "HH:MM:SS", "HH:MM:SS.000Z", "HH"
  const genericRegex =
    /^(?:T)?(\d{1,2})(?::(\d{2}))?(?::\d{2})?(?:\.\d+)?(?:Z)?$/i;
  m = s.match(genericRegex);
  if (m) {
    let h = parseInt(m[1], 10);
    const min = m[2] ?? "00";
    // Normalize hour within 0-23
    if (h === 24) h = 0;
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${min} ${suffix}`;
  }

  // Fallback: return original string unchanged
  return s;
};

export default formatTime;