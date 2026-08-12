import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import * as rootParams from 'next/root-params';

import { routing } from '@/shared/config/i18n/routing';

/**
 * Per-request `next-intl` configuration for server-side code.
 *
 * The locale is read from `next/root-params` rather than from the request
 * headers, which is what keeps every route eligible for static rendering.
 * `messages` is absent until T-16 creates the catalogs.
 */
export default getRequestConfig(async ({ locale }) => {
  // why: the argument is only populated when a call site overrides the locale.
  // Everywhere else it is the matched `[locale]` root param.
  if (locale) return { locale };

  // why: namespace import is the documented form — the named exports of
  // next/root-params are generated per param by `next typegen`.
  const paramValue = await rootParams.locale();
  if (!hasLocale(routing.locales, paramValue)) notFound();

  return { locale: paramValue };
});
