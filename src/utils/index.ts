// ============================================================
// SMART ANGANWADI - UTILITY FUNCTIONS
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatRelativeTimeFallback(key: string, count?: number): string {
  switch (key) {
    case 'status.just_now':
      return 'just now';
    case 'status.min_ago':
      return `${count} min ago`;
    case 'status.hr_ago':
      return `${count} hr ago`;
    case 'status.day_ago':
      return `${count} day${count === 1 ? '' : 's'} ago`;
    default:
      return '';
  }
}

/** Format relative time (e.g., "5 min ago") */
export function formatRelativeTime(timestamp: string, t?: (key: string, vars?: any) => string): string {
  const now = new Date();
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return '';

  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return t?.('status.just_now') ?? formatRelativeTimeFallback('status.just_now');
  if (diffMin < 60) return t?.('status.min_ago', { count: diffMin }) ?? formatRelativeTimeFallback('status.min_ago', diffMin);
  if (diffHrs < 24) return t?.('status.hr_ago', { count: diffHrs }) ?? formatRelativeTimeFallback('status.hr_ago', diffHrs);
  if (diffDays < 7) return t?.('status.day_ago', { count: diffDays }) ?? formatRelativeTimeFallback('status.day_ago', diffDays);
  return date.toLocaleDateString('en-IN');
}

/** Format age in months to readable string */
export function formatAge(months: number, t: (key: string, vars?: any) => string): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} ${t('status.months')}`;
  if (remainingMonths === 0) return `${years} ${t('status.yr')}`;
  return `${years} ${t('status.yr')} ${remainingMonths} ${t('status.mo')}`;
}

/** Simulate an API call with delay */
export function simulateAPI<T>(data: T, delayMs: number = 800): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

/** Get skill level label from score */
export function getSkillLevel(score: number): 'basic' | 'intermediate' | 'advanced' {
  if (score < 40) return 'basic';
  if (score <= 70) return 'intermediate';
  return 'advanced';
}

/** Get skill level display info */
export function getSkillLevelInfo(score: number): { labelKey: string; color: string; bgColor: string } {
  if (score < 40) return { labelKey: 'common.at_risk', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/50' };
  if (score <= 70) return { labelKey: 'common.developing', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/50' };
  return { labelKey: 'common.on_track', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/50' };
}

/** Format a number with commas for Indian number system */
export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

export function getGrowthStatus(score: number): string {
  if (score >= 75) return 'common.healthy';
  if (score >= 50) return 'common.monitor';
  return 'common.needs_attention';
}

export function getProgressStatus(score: number): string {
  if (score >= 75) return 'common.on_track';
  if (score >= 50) return 'common.developing';
  return 'common.needs_attention';
}

export function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
