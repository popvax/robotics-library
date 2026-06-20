import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Tags are stored kebab-case (the id used for filtering/search/URL); display them with spaces. */
export const formatTag = (tag: string) => tag.replace(/-/g, ' ');
