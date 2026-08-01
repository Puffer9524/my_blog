const fullDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const monthDayFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'short',
  day: 'numeric',
});

export function formatDate(date: Date): string {
  return fullDateFormatter.format(date);
}

export function formatMonthDay(date: Date): string {
  return monthDayFormatter.format(date);
}
