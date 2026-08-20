import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/shared/config/i18n/navigation';
import { CONNECT_LINKS, LINKEDIN_PROFILES, REPOSITORY_LINKS } from '@/shared/config/links.config';
import { HoverFlip } from '@/shared/ui/hover-flip';

/**
 * The footer of every route — §3.3 of `design.md`.
 *
 * why: three columns, and every entry resolves today. `Pages` carries the one
 * route that exists and grows with T-24, T-45 and T-29; `Legal` carries the
 * repository and the MIT text, which §14 of `project.md` already names as the
 * legal statement over the code. Columns padded with links to routes that 404
 * would be a defect shipped to make a table look complete.
 *
 * why: the sound toggle of §3.3 is absent. T-42 owns sound and is what mounts it.
 *
 * why: the year is interpolated as a string. Passed as a number, ICU formats it
 * through NumberFormat and renders "2,026". It is also frozen at build time,
 * which is correct for a statically generated site and stale only if the site is
 * not deployed for a year.
 */
export async function SiteFooter() {
  const t = await getTranslations('Footer');
  // why: the locale selects the LinkedIn profile version. `getLocale()` returns
  // the narrowed union because `AppConfig.Messages` is augmented and the locale
  // comes from the same contract (D-195).
  const locale = await getLocale();

  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-[1.6fr_repeat(3,1fr)]">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl tracking-tight [font-optical-sizing:auto]">
            bernardomrl
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t('tagline')}</p>
        </div>

        <nav aria-labelledby={t('pages.heading')}>
          <h2 className="font-mono text-xs tracking-wider uppercase">{t('pages.heading')}</h2>
          <ul className="mt-4 w-fit space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                <HoverFlip label={t('pages.home')} />
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby={t('connect.heading')}>
          <h2 className="font-mono text-xs tracking-wider uppercase">{t('connect.heading')}</h2>
          <ul className="mt-4 w-fit space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={CONNECT_LINKS.github}
                className="hover:text-foreground"
                rel="me"
                target="_blank"
              >
                <HoverFlip label={t('connect.github')} />
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN_PROFILES[locale]}
                className="hover:text-foreground"
                rel="me"
                target="_blank"
              >
                <HoverFlip label={t('connect.linkedin')} />
              </a>
            </li>
            <li>
              <a href={CONNECT_LINKS.email} className="hover:text-foreground">
                <HoverFlip label={t('connect.email')} />
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby={t('legal.heading')}>
          <h2 className="font-mono text-xs tracking-wider uppercase">{t('legal.heading')}</h2>
          <ul className="mt-4 w-fit space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={REPOSITORY_LINKS.source} className="hover:text-foreground" target="_blank">
                <HoverFlip label={t('legal.source')} />
              </a>
            </li>
            <li>
              <a href={REPOSITORY_LINKS.license} className="hover:text-foreground" target="_blank">
                <HoverFlip label={t('legal.license')} />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <p className="mx-auto w-full max-w-6xl px-4 pb-10 font-mono text-xs text-muted-foreground sm:px-6">
        {t('copyright', { year: String(new Date().getFullYear()) })}
      </p>
    </footer>
  );
}
