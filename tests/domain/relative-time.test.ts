import { timeAgo } from '@/lib/formatting/relative-time';

const NOW = new Date('2026-06-26T12:00:00.000Z').getTime();
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

describe('timeAgo', () => {
  it('buckets into today / yesterday / days / weeks / months / years', () => {
    expect(timeAgo(daysAgo(0), NOW)).toEqual({ key: 'time.today', count: 0 });
    expect(timeAgo(daysAgo(1), NOW)).toEqual({ key: 'time.yesterday', count: 1 });
    expect(timeAgo(daysAgo(3), NOW)).toEqual({ key: 'time.daysAgo', count: 3 });
    expect(timeAgo(daysAgo(10), NOW)).toEqual({ key: 'time.weeksAgo', count: 1 });
    expect(timeAgo(daysAgo(45), NOW)).toEqual({ key: 'time.monthsAgo', count: 1 });
    expect(timeAgo(daysAgo(800), NOW)).toEqual({ key: 'time.yearsAgo', count: 2 });
  });
});
