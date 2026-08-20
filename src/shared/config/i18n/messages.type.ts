import { routing } from '@/shared/config/i18n/routing';

import type enMessages from '../../../../messages/en.json';

/**
 * The shape every message catalog must have, taken from the default locale.
 *
 * why: `en` is the reference by construction — §3.3 of `project.md` makes it
 * `defaultLocale`, and a catalog shape declared by hand would be a third source
 * that diverges from both files with no error, which is the argument D-161 made
 * against repeating a file name in frontmatter.
 */
export type Catalog = typeof enMessages;

/**
 * why: `Locale` is augmented here, closing the debt this module recorded in
 * T-22. That note deferred it because narrowing the return of `useLocale()`
 * and the props of `Link` reaches `features/locale-switcher`, whose source was
 * out of scope then. T-40 is the first task that needs the narrow union — a
 * locale-keyed constant cannot be indexed by `string` — and the narrowing was
 * measured against the whole tree before being taken, not assumed safe.
 *
 * why: the union is derived from `routing.ts` rather than written out. That
 * file is the routing contract and a second list would diverge with no error,
 * which is the argument D-161 made against repeating a file name in
 * frontmatter and D-171 made against duplicating the locale tuple.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Catalog;
  }
}
