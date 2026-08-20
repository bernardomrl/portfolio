'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useTranslations } from 'next-intl';

import { consoleHandle } from '@/shared/lib/console.handle';
import { Button } from '@/shared/ui/button';
import { TextDecode } from '@/shared/ui/text-decode';

/**
 * The Console trigger of §3.1, bound to the overlay of T-40.
 *
 * why: a Client Component, where D-194 left a Server Component. The handle of
 * `createHandle()` is a client store, so a server render cannot read it and
 * cannot pass it across the boundary as a prop. The cost is bounded: this slot
 * already shipped `TextDecode`, which is client, so the leaf was hydrated
 * either way and what changed is which component owns the directive.
 *
 * why: `getTranslations` becomes `useTranslations`. Same catalog, same key —
 * `NextIntlClientProvider` inherits the whole catalog with no props (D-114).
 *
 * why: `Dialog.Trigger` with `render` rather than a `Button` with `onClick`.
 * The primitive owns the association with the popup — `aria-haspopup`,
 * `aria-expanded`, `data-popup-open`, and the focus restoration target on
 * close — and `render` composes it onto the styled button instead of nesting
 * two of them.
 *
 * why: a text label and no icon. §7.11 needs letters, and the four header slots
 * share one gesture (D-211).
 *
 * why: the label is the name of the surface and not of one of its functions.
 * §3.2 gives the overlay panels of which only one is search, so a magnifier and
 * the word "Search" both advertise a fraction of what this opens, and a label
 * corrected later breaks the memory of anyone who already used it. The word is
 * the same in both catalogs: it names a thing (D-220).
 *
 * why: no `[⌘K]` notation. The hint renders inside the overlay on pointer
 * devices, where the shortcut becomes useful, and a label in a corner cluster
 * has nowhere to put it without becoming the widest element there (D-208).
 */
export function ConsoleTrigger() {
  const t = useTranslations('Header');

  return (
    <Dialog.Trigger
      handle={consoleHandle}
      render={
        <Button variant="ghost" size="sm" className="font-mono text-xs tracking-wider uppercase" />
      }
    >
      <TextDecode label={t('console')} />
    </Dialog.Trigger>
  );
}
