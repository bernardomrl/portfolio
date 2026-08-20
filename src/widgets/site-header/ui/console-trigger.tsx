import { getTranslations } from 'next-intl/server';

import { Button } from '@/shared/ui/button';
import { TextDecode } from '@/shared/ui/text-decode';

/**
 * The Console trigger of §3.1. Inert until T-40 builds the overlay.
 *
 * why: enabled and without a handler, rather than `disabled` or absent. `disabled`
 * removes the control from the tab order and from the accessibility tree, which makes
 * the header's keyboard model provisional and forces T-40 to undo it. Accepted cost:
 * between the two tasks the click does nothing, on a shell reachable only in preview
 * and shipping `noindex` under D-73.
 *
 * why: a text label and no icon. §7.11 needs letters, and while three slots were text
 * and one was an icon no gesture could be common to the four — which is what made the
 * header read as two treatments rather than one system (D-211).
 *
 * why: the label is the name of the surface and not of one of its functions. §3.2 gives
 * the overlay three panels and only one of them is search, so a magnifier and the word
 * "Search" both advertise a third of what T-40 ships — and a label corrected later
 * breaks the memory of anyone who already used it. The word is the same in both
 * catalogs: it names a thing, and translating it would create two names for one surface
 * (D-220).
 *
 * why: no `[⌘K]` notation yet. A header advertising a key that does nothing is worse
 * than one advertising nothing. It lands with the binding, in T-40 (D-208).
 */
export async function ConsoleTrigger() {
  const t = await getTranslations('Header');

  return (
    <Button variant="ghost" size="sm" className="font-mono text-xs tracking-wider uppercase">
      <TextDecode label={t('console')} />
    </Button>
  );
}
