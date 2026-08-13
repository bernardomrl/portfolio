import { createNavigation } from 'next-intl/navigation';

import { routing } from '@/shared/config/i18n/routing';

/**
 * Locale-aware navigation APIs bound to the routing contract of `routing.ts`.
 *
 * why: only the APIs with a consumer are exported (D-115). `usePathname`
 * returns the pathname with the locale prefix stripped, which is what lets the
 * switcher rebuild the same document under another locale (§6.3).
 * `getPathname` is the inverse and is what builds the canonical URL and the
 * `hreflang` alternates of §12. `Link` is the locale-aware anchor of the
 * localized 404. `redirect` still has no consumer and stays unexported.
 */
export const { Link, getPathname, usePathname, useRouter } = createNavigation(routing);
