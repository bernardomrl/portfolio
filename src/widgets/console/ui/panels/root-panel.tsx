'use client';

import {
  IconExternalLink,
  IconFileText,
  IconHome,
  IconLanguage,
  IconMail,
  IconPalette,
  IconScale,
} from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { useConsole } from '@/widgets/console/model/console.context';
import type { Entry, EntryGroup } from '@/widgets/console/model/entry.type';
import { useCoarsePointer } from '@/widgets/console/model/use-coarse-pointer';
import { ConsoleEntry } from '@/widgets/console/ui/console-entry';
import { ConsolePanel } from '@/widgets/console/ui/console-panel';

import { useRouter } from '@/shared/config/i18n/navigation';
import { CONNECT_LINKS, LINKEDIN_PROFILES, REPOSITORY_LINKS } from '@/shared/config/links.config';
import { consoleHandle } from '@/shared/lib/console.handle';
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteList,
} from '@/shared/ui/autocomplete';

/**
 * why: the preference entries push a panel instead of acting. Theme has three
 * states and locale lists every language including the current one, and a list
 * that omits the current state cannot mark it — an entry that acts directly can
 * only express the alternative.
 */
export function RootPanel() {
  const t = useTranslations('Console');
  const locale = useLocale();
  const router = useRouter();
  const coarse = useCoarsePointer();
  const { push } = useConsole();

  const groups = useMemo<EntryGroup[]>(
    () => [
      {
        items: [
          {
            icon: IconHome,
            id: 'page-home',
            label: t('pages.home'),
            run: () => {
              consoleHandle.close();
              router.push('/');
            },
          },
        ],
        value: t('groups.pages'),
      },
      {
        items: [
          {
            icon: IconPalette,
            id: 'theme',
            label: t('preferences.theme'),
            run: () => push('theme'),
          },
          {
            icon: IconLanguage,
            id: 'locale',
            label: t('preferences.locale'),
            run: () => push('locale'),
          },
        ],
        value: t('groups.preferences'),
      },
      {
        items: [
          {
            icon: IconMail,
            id: 'reach-out',
            label: t('connect.reachOut'),
            run: () => push('reach-out'),
          },
          {
            icon: IconExternalLink,
            id: 'github',
            label: t('connect.github'),
            run: () => window.open(CONNECT_LINKS.github, '_blank'),
          },
          {
            icon: IconExternalLink,
            id: 'linkedin',
            label: t('connect.linkedin'),
            run: () => window.open(LINKEDIN_PROFILES[locale], '_blank'),
          },
        ],
        value: t('groups.connect'),
      },
      {
        items: [
          {
            icon: IconFileText,
            id: 'source',
            label: t('legal.source'),
            run: () => window.open(REPOSITORY_LINKS.source, '_blank'),
          },
          {
            icon: IconScale,
            id: 'license',
            label: t('legal.license'),
            run: () => window.open(REPOSITORY_LINKS.license, '_blank'),
          },
        ],
        value: t('groups.legal'),
      },
    ],
    [t, locale, push, router],
  );

  return (
    <Autocomplete
      autoHighlight={coarse ? false : 'always'}
      inline
      items={groups}
      keepHighlight
      open
    >
      <ConsolePanel placeholder={t('placeholder')}>
        <AutocompleteList>
          {(group: EntryGroup) => (
            <AutocompleteGroup items={group.items} key={group.value}>
              <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
              <AutocompleteCollection>
                {(entry: Entry) => <ConsoleEntry entry={entry} key={entry.id} />}
              </AutocompleteCollection>
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </ConsolePanel>
    </Autocomplete>
  );
}
