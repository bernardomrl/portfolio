'use client';

import { IconLanguage } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { useConsole } from '@/widgets/console/model/console.context';
import type { Entry } from '@/widgets/console/model/entry.type';
import { useCoarsePointer } from '@/widgets/console/model/use-coarse-pointer';
import { REOPEN_KEY } from '@/widgets/console/model/use-panel-stack';
import { ConsoleEntry } from '@/widgets/console/ui/console-entry';
import { ConsolePanel } from '@/widgets/console/ui/console-panel';

import { usePathname, useRouter } from '@/shared/config/i18n/navigation';
import { routing } from '@/shared/config/i18n/routing';
import { Autocomplete, AutocompleteList } from '@/shared/ui/autocomplete';

/**
 * why: every locale is listed rather than only the alternative. The root panel
 * offers a switch because two locales have exactly one alternative; a panel is a
 * list of states, and a list that omits the current one cannot mark it.
 *
 * why: the session flag is set before navigating. A locale change unmounts the
 * `[locale]` segment, and Base UI documents that each `Dialog.Root` mount starts
 * from fresh state with no open state carried over, so the overlay is reopened
 * after the navigation rather than kept through it (§4.1).
 *
 * why: one icon for every entry. The glyph names the kind, and no flag stands in
 * for a language — a flag names a country, and `en` is not one.
 */
export function LocalePanel() {
  const t = useTranslations('Console');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const coarse = useCoarsePointer();
  const { pop } = useConsole();

  const entries = useMemo<Entry[]>(
    () =>
      routing.locales.map((candidate) => ({
        icon: IconLanguage,
        id: `locale-${candidate}`,
        label: t(`languages.${candidate}`),
        run: () => {
          if (candidate === locale) return;

          sessionStorage.setItem(REOPEN_KEY, 'locale');
          router.replace(pathname, { locale: candidate });
        },
        selected: candidate === locale,
      })),
    [t, locale, pathname, router],
  );

  return (
    <Autocomplete
      autoHighlight={coarse ? false : 'always'}
      inline
      items={entries}
      keepHighlight
      open
    >
      <ConsolePanel onBack={pop} placeholder={t('localePanel.title')}>
        <AutocompleteList>
          {(entry: Entry) => <ConsoleEntry entry={entry} key={entry.id} />}
        </AutocompleteList>
      </ConsolePanel>
    </Autocomplete>
  );
}
