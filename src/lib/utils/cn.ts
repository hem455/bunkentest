/**
 * Conditional class name utility
 * Tailwind CSS クラス名を条件付きで結合する
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * クラス名を条件付きで結合し、Tailwindの競合を解決する
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}