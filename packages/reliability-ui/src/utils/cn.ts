// packages/reliability-ui/src/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind-aware className merge utility
 * Combines clsx's conditional merging with tailwind-merge's conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
