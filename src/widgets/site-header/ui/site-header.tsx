import { getTranslations } from 'next-intl/server';

import { ConsoleTrigger } from '@/widgets/site-header/ui/console-trigger';
import { Wordmark } from '@/widgets/site-header/ui/wordmark';

import { LocaleSwitcher } from '@/features/locale-switcher';
import { ThemeToggle } from '@/features/theme-toggle';

import { Link } from '@/shared/config/i18n/navigation';

/**
 * The header of every route — §3.1 of `design.md`.
 *
 * why: the component stays a Server Component. The three controls and the wordmark
 * carry their own leaf boundaries, and nothing here reads a hook.
 *
 * why: the skip link is a plain anchor. Its target is a fragment of the current
 * document, and the locale-aware `Link` would prefix it and turn it into a navigation.
 * It is positioned absolutely when focused: `not-sr-only` alone returns it to the flex
 * flow and pushes the wordmark and the controls sideways the moment a keyboard user
 * reaches it.
 *
 * why: the wordmark is a literal (D-202) and the only surface rendering the display
 * face, which is what makes `preload: true` on Fraunces earn its request (D-196). It
 * carries §7.13 and is the one slot without §7.11 — its label never changes (D-218).
 */
export async function SiteHeader() {
  const t = await getTranslations('Header');

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-background focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:ring-3 focus-visible:ring-ring"
      >
        {t('skipToContent')}
      </a>

      <Link
        href="/"
        className="font-display text-lg tracking-tight text-foreground [font-optical-sizing:auto] sm:text-xl"
      >
        <Wordmark label="bernardomrl" />
      </Link>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
        <ConsoleTrigger />
      </div>
    </header>
  );
}
