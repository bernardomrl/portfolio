'use client';

import { IconCalendar, IconCopy, IconExternalLink } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { useConsole } from '@/widgets/console/model/console.context';
import type { Entry } from '@/widgets/console/model/entry.type';
import { useCoarsePointer } from '@/widgets/console/model/use-coarse-pointer';
import { ConsoleEntry } from '@/widgets/console/ui/console-entry';
import { ConsolePanel } from '@/widgets/console/ui/console-panel';

import { CONNECT_LINKS, EMAIL_ADDRESS, LINKEDIN_PROFILES } from '@/shared/config/links.config';
import { Autocomplete, AutocompleteList } from '@/shared/ui/autocomplete';

/**
 * why: the copy result is reported in the footer instead of on the control. A
 * label that changes to "Copied" and back is state living on the thing that
 * caused it, and it would move the item under the pointer.
 */
export function ReachOutPanel() {
  const t = useTranslations('Console');
  const locale = useLocale();
  const coarse = useCoarsePointer();
  const { pop, setStatus } = useConsole();

  const entries = useMemo<Entry[]>(
    () => [
      {
        id: 'copy-email',
        icon: IconCopy,
        label: t('reachOut.copyEmail'),
        // why: the status is set on the gesture rather than in `.then`. On the
        // mobile browser the write succeeds and the promise stays pending, so a
        // status set on resolution never arrives — measured on device. Reporting
        // the gesture is also the better shape: the message answers the tap, and
        // the `.catch` is what corrects it if the write actually failed.
        run: () => {
          setStatus(t('reachOut.copied'));

          void navigator.clipboard.writeText(EMAIL_ADDRESS).catch(() => {
            setStatus(t('reachOut.copyFailed', { email: EMAIL_ADDRESS }));
          });
        },
      },
      {
        id: 'scheduling',
        icon: IconCalendar,
        label: t('reachOut.scheduling'),
        run: () => window.open(CONNECT_LINKS.scheduling, '_blank'),
      },
      {
        id: 'github',
        icon: IconExternalLink,
        label: t('connect.github'),
        run: () => window.open(CONNECT_LINKS.github, '_blank'),
      },
      {
        id: 'linkedin',
        icon: IconExternalLink,
        label: t('connect.linkedin'),
        run: () => window.open(LINKEDIN_PROFILES[locale], '_blank'),
      },
    ],
    [t, locale, setStatus],
  );

  return (
    <Autocomplete
      autoHighlight={coarse ? false : 'always'}
      inline
      items={entries}
      keepHighlight
      open
    >
      <ConsolePanel onBack={pop} placeholder={t('reachOut.title')}>
        <AutocompleteList>
          {(entry: Entry) => <ConsoleEntry entry={entry} key={entry.id} />}
        </AutocompleteList>
      </ConsolePanel>
    </Autocomplete>
  );
}
