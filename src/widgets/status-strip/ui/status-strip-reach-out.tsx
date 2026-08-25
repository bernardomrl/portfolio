'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useTranslations } from 'next-intl';

import { CONSOLE_PANEL_ATTRIBUTE, consoleHandle } from '@/shared/lib/console.handle';
import { HoverFlip } from '@/shared/ui/hover-flip';

/**
 * The Reach out column's value of §4.1.2, opening the Console at the same panel
 * the hero's primary action opens.
 *
 * why: a link in weight and a trigger in behaviour. The three columns of §4.1.2
 * are one row of facts, and a filled button here would read as the row's purpose
 * rather than as its third entry — with the primary action of §4.1.1 two hundred
 * pixels above, opening the same panel.
 *
 * why: no §7.1 here, unlike the hero action. The catalogue grants the pull to
 * isolated primary actions, and this target sits in a row beside two others.
 *
 * why: `HoverFlip`, which is what every link of §3.3 carries. The strip is a row
 * of factual entries and this one is a link among them.
 *
 * why: the panel attribute rather than a shared component with the hero trigger.
 * The two are a filled button and a text link, sharing one call and no markup —
 * an abstraction over that would be shape without substance, and Regra C holds
 * at the third case, which is T-26.
 */
export function StatusStripReachOut() {
  const t = useTranslations('StatusStrip');

  return (
    <Dialog.Trigger
      {...{ [CONSOLE_PANEL_ATTRIBUTE]: 'reach-out' }}
      className="w-fit text-sm text-muted-foreground hover:text-foreground"
      handle={consoleHandle}
    >
      <HoverFlip label={t('reachOut.action')} />
    </Dialog.Trigger>
  );
}
