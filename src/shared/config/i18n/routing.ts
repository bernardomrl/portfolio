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
  // why: the proxy otherwise emits a `link` header with `rel="alternate"` for
  // every locale of this contract, on every request. §6.4 restricts alternates
  // to the locales a document actually exists in, which the network layer
  // cannot know, so from T-27 onward the header would be wrong. Emitting an
  // indexing directive is also a second responsibility, which §6.2 forbids the
  // proxy. The metadata of each route is the normative source (D-124).
  alternateLinks: false,
});
