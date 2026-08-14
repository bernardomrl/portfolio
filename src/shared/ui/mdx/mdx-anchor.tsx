import type { ComponentPropsWithoutRef } from 'react';

import { Link } from '@/shared/config/i18n/navigation';

type MdxAnchorProps = ComponentPropsWithoutRef<'a'>;

/**
 * The `a` element of compiled MDX.
 *
 * why: this is the one element the pipeline cannot leave to the browser. With
 * `localePrefix: 'always'` every document lives under a locale segment and
 * `dynamicParams = false` closes the segment, so a raw `<a href="/about">`
 * written in prose resolves to a path that does not exist. The locale-aware
 * `Link` of `navigation.ts` rebuilds the prefix from the active locale, which
 * is the same inverse §12 already uses to build canonical URLs.
 *
 * why: a fragment stays a plain anchor — routing it through `Link` would
 * prepend a locale to an in-document reference. External links get `rel` but
 * no `target`: forcing a new tab overrides a choice that belongs to the reader.
 */
export function MdxAnchor({ children, href, ...rest }: MdxAnchorProps) {
  if (href === undefined || href.startsWith('#')) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} rel="noreferrer" {...rest}>
      {children}
    </a>
  );
}
