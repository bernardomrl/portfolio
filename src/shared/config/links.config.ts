import { routing } from '@/shared/config/i18n/routing';

type Locale = (typeof routing.locales)[number];

/**
 * External destinations shared by the footer of §3.3 and the Console of §3.2.
 *
 * why: `shared/config/` and not the `widgets/site-footer/config/` this module
 * was authored in. The lift is not Regra C reaching a third case — it is a
 * boundary. `widgets/console` cannot import `widgets/site-footer`: the policy
 * grants a widget `shared`, `feature/index` and `entity/index` and nothing
 * else, and the path is internal to the slice, which the public API rule
 * refuses a second time with a message of its own. The second consumer could
 * not reach the constant at all, so the choice was never between two
 * occurrences and three.
 *
 * why: the note this module carried invoked Regra C, and D-171 had already
 * settled that Regra C does not reach constants — a duplicated constant is a
 * second source that diverges with no error, the argument D-161 made against
 * repeating a file name in frontmatter. The prediction is corrected here
 * rather than inherited.
 *
 * why: the address is stored bare and the `mailto:` is derived beside it. The
 * Reach out panel copies the address to the clipboard while the footer links
 * it, and deriving one from the other at a call site would be string surgery
 * on a URI scheme.
 */
export const EMAIL_ADDRESS = 'contato@bernardomrl.dev';

/**
 * why: the profile is authored in both languages and the query string selects
 * which version is served. A reader who chose one language and is handed the
 * other at the last click is the §6.4 defect applied to an external
 * destination. The degradation is benign: `locale` is LinkedIn's own product
 * behaviour rather than a standard, and dropping it resolves to the profile's
 * default language instead of breaking.
 *
 * why: annotated as `Record<Locale, string>` rather than `satisfies`. A third
 * locale added to `routing.ts` and not here stops compiling, which is the
 * D-162 instrument applied to a constant. The literal types buy nothing for a
 * URL.
 *
 * why: separate from `CONNECT_LINKS` rather than nested inside it. Only this
 * destination varies by locale, and giving the other three the same shape
 * would describe a variation they do not have.
 */
export const LINKEDIN_PROFILES: Record<Locale, string> = {
  en: 'https://www.linkedin.com/in/bernardoamrl/?locale=en-US',
  'pt-BR': 'https://www.linkedin.com/in/bernardoamrl/?locale=pt-BR',
};

export const CONNECT_LINKS = {
  github: 'https://github.com/bernardomrl',
  scheduling: 'https://cal.com/bernardomrl/intro',
  email: `mailto:${EMAIL_ADDRESS}`,
} as const;

export const REPOSITORY_LINKS = {
  source: 'https://github.com/bernardomrl/portfolio',
  license: 'https://github.com/bernardomrl/portfolio/blob/main/LICENSE',
} as const;
