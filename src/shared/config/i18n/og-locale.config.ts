// src/shared/config/i18n/og-locale.config.ts
import { routing } from '@/shared/config/i18n/routing';

/**
 * The locales of `routing.ts` written in the form the Open Graph protocol
 * requires.
 *
 * why: `og:locale` is not a BCP 47 tag. The protocol specifies ISO 639-1 joined
 * to ISO 3166-1 alpha-2 by an underscore, so `pt-BR` is invalid there and `en`
 * carries no territory at all. It is a static configuration object rather than
 * a transform because supplying `US` for `en` is an editorial choice about
 * which English the site addresses, not a derivation.
 */
export const OG_LOCALES = {
  en: 'en_US',
  'pt-BR': 'pt_BR',
} as const satisfies Record<(typeof routing.locales)[number], string>;
