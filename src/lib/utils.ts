import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a "YYYY", "YYYY-MM", or "YYYY-MM-DD" string for display. Falls back to the raw value. */
export function formatDate(date: string): string {
  if (/^\d{4}$/.test(date)) return date;
  const ymd = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(date);
  if (ymd) {
    const [, y, m, d] = ymd;
    const dt = new Date(Number(y), Number(m) - 1, d ? Number(d) : 1);
    return dt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      ...(d ? { day: 'numeric' } : {}),
    });
  }
  const dt = new Date(date);
  return Number.isNaN(dt.getTime())
    ? date
    : dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
