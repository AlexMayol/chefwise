export type RelativeTime = { key: string; count: number };

// Coarse "time ago" bucket as an i18n key + count, so callers translate it:
// t(key, { count }). `now` is injectable for tests.
export function timeAgo(iso: string, now: number = Date.now()): RelativeTime {
  const days = Math.floor((now - new Date(iso).getTime()) / 86_400_000);

  if (days <= 0) return { key: 'time.today', count: 0 };
  if (days === 1) return { key: 'time.yesterday', count: 1 };
  if (days < 7) return { key: 'time.daysAgo', count: days };
  if (days < 30) return { key: 'time.weeksAgo', count: Math.floor(days / 7) };
  if (days < 365) return { key: 'time.monthsAgo', count: Math.floor(days / 30) };
  return { key: 'time.yearsAgo', count: Math.floor(days / 365) };
}
