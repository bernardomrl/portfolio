import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getPathname } from '@/shared/config/i18n/navigation';
import { OG_LOCALES } from '@/shared/config/i18n/og-locale.config';
import { routing } from '@/shared/config/i18n/routing';

/**
 * Document-level metadata for the landing page.
 *
 * why: §12 requires every route to declare its own title, description and
 * alternates, and to inherit none of them. The alternates are absolute by
 * resolution against the `metadataBase` of the layout, so no hostname appears
 * here. `x-default` points at the document of the default locale rather than
 * at `/`: with `localePrefix: 'always'` the root is a redirect and never a
 * document, and advertising it would publish a URL that is never 200 (D-125).
 */
export async function generateMetadata({
  params,
}: Pick<PageProps<'/[locale]'>, 'params'>): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  // why: same narrowing as the layout — the segment is closed by
  // `dynamicParams = false` and the param type is `string` regardless (D-110).
  const locale = rawLocale as (typeof routing.locales)[number];

  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const canonical = getPathname({ href: '/', locale });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((candidate) => [
            candidate,
            getPathname({ href: '/', locale: candidate }),
          ]),
        ),
        'x-default': getPathname({ href: '/', locale: routing.defaultLocale }),
      },
    },
    // why: the envelope is declared per route rather than in the layout.
    // Metadata merges shallowly between segments, so any route declaring
    // `openGraph` replaces the parent object whole — measured in T-17, where
    // `og:type`, `og:site_name` and `og:locale` vanished from a page that
    // declared only title, description and url. The repetition this costs is
    // real and stays inline: T-27 and T-29 are the second and third routes,
    // and the extraction belongs to whichever of them lands first (D-129).
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => OG_LOCALES[candidate]),
      title: t('title'),
      description: t('description'),
      url: canonical,
    },
  };
}

export default function Home() {
  return <div>Hello world!</div>;
}
