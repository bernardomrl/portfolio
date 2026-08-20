'use client';

import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import { useConsole } from '@/widgets/console/model/console.context';
import type { Entry } from '@/widgets/console/model/entry.type';
import { ConsoleEntry } from '@/widgets/console/ui/console-entry';
import { ConsolePanel } from '@/widgets/console/ui/console-panel';

import { Autocomplete, AutocompleteList } from '@/shared/ui/autocomplete';

const THEME_MODES = ['light', 'dark', 'system'] as const;
const THEME_ICONS = {
  dark: IconMoon,
  light: IconSun,
  system: IconDeviceDesktop,
} as const;

/**
 * why: the current mode is marked, which D-215 would have forbidden anywhere
 * else. It does not apply here: `Dialog.Portal` renders no children while the
 * overlay is closed, so this subtree never server-renders and there is no
 * markup for a client value to diverge from.
 *
 * why: `theme` and not `resolvedTheme`. `resolvedTheme` collapses `system` into
 * what it resolved to, which is the one distinction a three-entry list exists to
 * show — the same reading `features/theme-toggle` applies.
 *
 * why: the panel does not pop after a choice. Themes are worth comparing, and
 * closing the list on the first pick makes the second comparison cost a full
 * re-entry.
 */
export function ThemePanel() {
  const t = useTranslations('Console');
  const { setTheme, theme } = useTheme();
  const { pop } = useConsole();

  const entries = useMemo<Entry[]>(
    () =>
      THEME_MODES.map((mode) => ({
        icon: THEME_ICONS[mode],
        id: `theme-${mode}`,
        label: t(`themes.${mode}`),
        run: () => setTheme(mode),
        selected: theme === mode,
      })),
    [t, setTheme, theme],
  );

  return (
    <Autocomplete autoHighlight="always" inline items={entries} keepHighlight open>
      <ConsolePanel onBack={pop} placeholder={t('themePanel.title')}>
        <AutocompleteList>
          {(entry: Entry) => <ConsoleEntry entry={entry} key={entry.id} />}
        </AutocompleteList>
      </ConsolePanel>
    </Autocomplete>
  );
}
