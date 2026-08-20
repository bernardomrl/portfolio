'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/ui/button';

/**
 * The error boundary of the locale segment, deferred here from T-17 by D-128.
 *
 * why: it renders inline in `app/` rather than delegating to a widget. That is the
 * precedent `not-found.tsx` set in T-17 for a boundary file with a heading, a line
 * and one control, and Regra C holds the extraction until a third error surface
 * asks for the same shape.
 *
 * why: `useTranslations` and not `getTranslations` — the file carries `"use client"`
 * because the convention requires it. `NextIntlClientProvider` sits in the layout,
 * above this boundary, and inherits the catalog with no props (D-114).
 *
 * Known gap, not a deliverable: an error thrown by the layout itself is not caught
 * here. Only `global-error.tsx` covers that, and it lives outside `[locale]` with
 * the same monolingual problem D-132 identified — see the entry that closes it.
 */
export default function LocaleError({ reset }: { reset: () => void }) {
  const t = useTranslations('Error');

  return (
    <>
      <h1>{t('heading')}</h1>
      <p>{t('description')}</p>
      <Button onClick={reset}>{t('retry')}</Button>
    </>
  );
}
