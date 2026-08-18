import { type Decision, decisions } from '#site/content';

import { routing } from '@/shared/config/i18n/routing';

export type { Decision };

type Locale = (typeof routing.locales)[number];

/**
 * Reads the Trail entries of one case study in one locale.
 *
 * why: the rules governing this module — the confinement of `#site/content` to
 * `shared/content/` (§5.4) and the refusal to re-export the raw collection under
 * `noUncheckedIndexedAccess` (D-153) — are stated once, in the JSDoc of
 * `page.query.ts`, and are not repeated here.
 *
 * why: this listing exists before its consumer, which D-163 refused for `pages`
 * and D-170 refused for `projects`. The reason is different: the locale guard of
 * D-162 is per collection and needs a host, and without one `decisions` would be
 * the only collection outside the signal D-171 measured — widening
 * `routing.locales` would report every seam but this one. The function is the one
 * §2.3 names, not a guessed shape, and it is what T-28 calls (D-183).
 *
 * why: no ordering. Whether the panel sorts by the `D-xx` number or editorially
 * is a decision of T-28, which is the first place a reader sees the sequence;
 * imposing one here would fix it from a task with no panel (D-182).
 */
export function listProjectDecisions(project: string, locale: Locale): Decision[] {
  // why: the guard on the locale duplication of D-162, replicated per collection
  // rather than shared. `Decision['locale']` is a third generated union and one
  // assignment cannot cover three.
  const target: Decision['locale'] = locale;

  return decisions.filter((decision) => decision.project === project && decision.locale === target);
}
