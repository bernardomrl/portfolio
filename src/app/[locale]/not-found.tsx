// src/app/[locale]/not-found.tsx
import { getTranslations } from 'next-intl/server';

import { Link } from '@/shared/config/i18n/navigation';

/**
 * The not-found boundary of the locale segment.
 *
 * why: `not-found.tsx` receives no props, so the locale is read from the
 * request configuration rather than from a param — which resolves because the
 * file renders inside `[locale]` and `request.ts` reads the root param
 * (D-110). It carries no metadata export of its own and inherits the site
 * title from the layout. It needs no provider: the strings are read on the
 * server, and `NextIntlClientProvider` is already above it either way (D-114).
 */
export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <main>
      <h1>{t('heading')}</h1>
      <p>{t('description')}</p>
      <Link href="/">{t('backToHome')}</Link>
    </main>
  );
}
