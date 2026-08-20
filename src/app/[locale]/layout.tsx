import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { fontVariables } from '@/bootstrap/font';
import { INTRO_SCRIPT } from '@/bootstrap/intro';
import { RootProvider } from '@/bootstrap/providers/root-provider';

import { SiteFooter } from '@/widgets/site-footer';
import { SiteHeader } from '@/widgets/site-header';

import { env } from '@/shared/config/browser-env';
import { routing } from '@/shared/config/i18n/routing';
import '@/shared/ui/styles/globals.css';

/**
 * Site-level metadata, declared once and inherited by every route of the
 * segment.
 *
 * why: D-109 puts every route inside `[locale]`, so what is declared here
 * holds for all of them. Only the fields that do not identify a document live
 * here — `metadataBase`, the robots directive, and a title and description
 * that exist to be inherited by `not-found.tsx`, which cannot export metadata
 * of its own. Open Graph is deliberately absent: metadata merges shallowly
 * between segments, so any route declaring `openGraph` would replace an
 * envelope written here whole, which is what T-17 measured (D-122, D-129).
 */
export async function generateMetadata({
  params,
}: Pick<LayoutProps<'/[locale]'>, 'params'>): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  // why: `generateStaticParams` plus `dynamicParams = false` close the segment
  // to the locales of routing.ts, and D-110 measured the proxy normalizing an
  // unlisted prefix before it ever reaches a route. The generated param type
  // is `string`, so that narrowing cannot be inferred.
  const locale = rawLocale as (typeof routing.locales)[number];

  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: t('title'),
    description: t('description'),
    // why: two sites compete for searches on the author's name while this one
    // is served from the subdomain (D-73). Declared once here and inherited:
    // metadata merges shallowly between segments, so a route that redeclares
    // `robots` — even partially — replaces this object whole and silently
    // loses the directive. §12 forbids that until the apex cutover, O-05.
    robots: { index: false, follow: false },
  };
}

// why: prerenders one route per locale at build time, which is what §4 requires
// of every page. Paired with dynamicParams below, an unknown locale is a 404
// instead of an on-demand render (D-110).
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

/**
 * why: the shell owns the `main` landmark rather than each route. The skip link of the
 * header needs one stable target, and a per-route id is a rule enforced by memory that
 * the first forgotten file breaks in silence — the failure mode D-110 rejected
 * `setRequestLocale` for. Routes render content and never the landmark.
 *
 * why: `body` is the flex column and `main` carries `flex-1`. The footer is in normal
 * flow, so without it a short document leaves the footer floating mid-viewport.
 *
 * why: the container is declared here and not per route. Header, main and footer share
 * one measure, and repeating it in three files is three chances to drift.
 */
export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col motion-reduce:animate-none first-visit:animate-intro">
        {/* why: first child of `body`, so it runs before anything below it paints. The
              script only sets an attribute on `html`, and the stylesheet is already parsed
              by the time it runs, so the gate is decided before the first frame. */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <RootProvider>
          <SiteHeader />
          <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
            {children}
          </main>
          <SiteFooter />
        </RootProvider>
      </body>
    </html>
  );
}
