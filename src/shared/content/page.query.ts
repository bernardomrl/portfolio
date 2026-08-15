import { type Page, pages } from '#site/content';

import { routing } from '@/shared/config/i18n/routing';

export type { Page };

type Locale = (typeof routing.locales)[number];

/**
 * Reads one page by its slug in one locale.
 *
 * why: this module is the only place in `src/` allowed to import
 * `#site/content` (§5.4). The linter classifies the alias as an element and
 * permits the whole `shared` layer to reach it — it cannot express "this
 * directory only" — so the confinement is a rule of the document, enforced here
 * and in review, not by the plugin.
 *
 * why: the raw collection is not re-exported. `noUncheckedIndexedAccess` makes
 * every indexed read of an array possibly `undefined`, so a consumer handed
 * `pages` either writes the narrowing itself or reaches for a non-null
 * assertion — and the second is what the flag exists to prevent. Handing out a
 * lookup that has already narrowed removes the choice (D-153).
 *
 * why: a missing page returns `undefined` rather than calling `notFound()`. The
 * 404 is a decision of the route (§7), and the same absence is not an error
 * everywhere: a listing filters it (§6.4) and `sitemap.ts` skips it, while a
 * document route does have to fail. `notFound()` here would also bind a data
 * module to the routing runtime, which is the coupling §2.3 forbids in the
 * other direction.
 *
 * why: there is no listing helper beside this one. `pages` backs routes, and a
 * route asks for one document by name — nothing enumerates the collection until
 * the Console of T-40 searches across all of them. Regra C.
 */
export function findPage(slug: string, locale: Locale): Page | undefined {
  // why: the locale union is declared twice — once in `routing.ts` and once in
  // `velite.config.ts`, which is bundled by esbuild outside the tsconfig paths
  // and cannot import it. This assignment is the guard on that duplication: a
  // locale added to the routing contract and not to the collection makes
  // `Locale` wider than the collection's own union and stops compiling here.
  // Without it the divergence ships as a page that resolves for no locale, at
  // runtime, in production (D-162).
  const target: Page['locale'] = locale;

  return pages.find((page) => page.slug === slug && page.locale === target);
}
