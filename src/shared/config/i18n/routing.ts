import { defineRouting } from 'next-intl/routing';

/**
 * Locale routing contract for the whole application.
 *
 * Consumed by `proxy.ts` for negotiation and by `request.ts` for validation.
 */
export const routing = defineRouting({
  locales: ['en', 'pt-BR'],
  defaultLocale: 'en',
  // why: stated explicitly although it is the library default. Every document
  // has exactly one canonical URL per locale and no locale is privileged in
  // the URL structure (D-25).
  localePrefix: 'always',
});
