import { createNavigation } from 'next-intl/navigation';

import { routing } from '@/shared/config/i18n/routing';

/**
 * Locale-aware navigation APIs bound to the routing contract of `routing.ts`.
 *
 * why: only the two APIs with a consumer are exported. `usePathname` returns
 * the pathname with the locale prefix stripped, which is what lets the
 * switcher rebuild the same document under another locale (§6.3). `Link`,
 * `redirect` and `getPathname` land with the shell of T-22 and the metadata of
 * T-17 (D-115).
 */
export const { usePathname, useRouter } = createNavigation(routing);
