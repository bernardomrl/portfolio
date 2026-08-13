import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as rootParams from 'next/root-params';

import { routing } from '@/shared/config/i18n/routing';

// why: an explicit loader map keeps every import specifier static. A template
// literal inside `import()` is unresolvable for the compiler and the module
// arrives as `any`, which Rule B forbids (D-113).
const catalogs = {
  en: () => import('../../../../messages/en.json'),
  'pt-BR': () => import('../../../../messages/pt-BR.json'),
} satisfies Record<(typeof routing.locales)[number], () => Promise<{ default: unknown }>>;

/**
 * Per-request `next-intl` configuration for server-side code.
 *
 * The locale is read from `next/root-params` rather than from the request
 * headers, which is what keeps every route eligible for static rendering. The
 * whole catalog is returned and inherited by `NextIntlClientProvider` without
 * props (D-113, D-114).
 */
export default getRequestConfig(async ({ locale }) => {
  // why: the argument is only populated when a call site overrides the locale.
  // Everywhere else it is the matched `[locale]` root param — read lazily, so
  // an override never touches the root params context.
  //
  // why: namespace import is the documented form — the named exports of
  // next/root-params are generated per param by `next typegen`.
  const requested = locale ?? (await rootParams.locale());

  if (!hasLocale(routing.locales, requested)) notFound();

  return {
    locale: requested,
    messages: (await catalogs[requested]()).default,
  };
});
