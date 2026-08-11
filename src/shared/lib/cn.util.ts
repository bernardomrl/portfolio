import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Composes class names conditionally and resolves Tailwind conflicts, so the last
 * utility of a group wins regardless of the order the strings were assembled in.
 *
 * Mandatory for conditional class composition — see `architecture.md` §10.
 *
 * @param inputs - Class values in any form `clsx` accepts: strings, arrays, or
 * objects keyed by class name.
 * @returns A single class string with conflicting Tailwind utilities removed.
 *
 * @example
 * ```ts
 * cn('px-2 py-1', isLarge && 'px-4'); // 'py-1 px-4'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
