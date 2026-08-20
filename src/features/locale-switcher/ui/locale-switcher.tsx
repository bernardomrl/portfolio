'use client';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/shared/config/i18n/navigation';
import { routing } from '@/shared/config/i18n/routing';
import { Button } from '@/shared/ui/button';
import { TextDecode } from '@/shared/ui/text-decode';

/**
 * Switches the document between the configured locales, preserving the current
 * pathname.
 *
 * why: two locales are a two-state control, so the button renders the label of
 * the target rather than a menu — no primitive beyond `button` is installed
 * (D-87, D-116). `find` rather than an index read: `noUncheckedIndexedAccess`
 * makes every indexed access `T | undefined`, and the fallback keeps the
 * control rendering the day a third locale lands and this becomes a menu.
 *
 * why: `replace` rather than `push`. Switching language corrects the current
 * view instead of adding a step to the reading path, and a history entry per
 * switch makes the back button toggle the language rather than leave the page.
 * Query string and hash are dropped: reading them would require
 * `useSearchParams` and a Suspense boundary, and no route carries either until
 * O-01 is resolved (D-117).
 */
export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const target = routing.locales.find((candidate) => candidate !== locale) ?? routing.defaultLocale;

  return (
    <Button
      variant="ghost"
      aria-label={t('switchTo', { language: t(`name.${target}`) })}
      className="font-mono text-xs tracking-wider uppercase"
      onClick={() => router.replace(pathname, { locale: target })}
    >
      <span className="sm:hidden">
        <TextDecode label={t(`short.${target}`)} />
      </span>
      <span className="hidden sm:inline">
        <TextDecode label={t(`name.${target}`)} />
      </span>
    </Button>
  );
}
