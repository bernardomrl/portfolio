import { type Project, projects } from '#site/content';

import { routing } from '@/shared/config/i18n/routing';

export type { Project };

type Locale = (typeof routing.locales)[number];

/**
 * Reads one project by its slug in one locale.
 *
 * why: the rules governing this module — the confinement of `#site/content` to
 * `shared/content/` (§5.4), the refusal to re-export the raw collection under
 * `noUncheckedIndexedAccess` (D-153), and the `undefined` return instead of
 * `notFound()` — are stated once, in the JSDoc of `page.query.ts`. They are not
 * repeated here: a second copy is a second thing to keep true.
 *
 * why: there is no listing helper beside this one. Nothing enumerates the
 * collection until the Selected work section of T-25, which needs the ordering
 * rule and the card at the same time and is where the `project` entity is
 * materialized. Writing `listProjects` here would be API surface against an
 * imagined consumer, which is what D-163 refused for `pages` (D-170).
 */
export function findProject(slug: string, locale: Locale): Project | undefined {
  // why: the guard on the locale duplication of D-162, replicated per collection
  // rather than shared. `Page['locale']` and `Project['locale']` are separate
  // generated unions, so one assignment cannot cover both — and a collection
  // added without this line is exactly the divergence the guard exists to catch.
  const target: Project['locale'] = locale;

  return projects.find((project) => project.slug === slug && project.locale === target);
}
