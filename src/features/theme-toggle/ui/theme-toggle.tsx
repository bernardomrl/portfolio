'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/shared/ui/button';

/**
 * Switches the document between the light and dark themes.
 *
 * why: both icons are always rendered and swapped by the `dark` variant, so
 * nothing here depends on `resolvedTheme` at render time. Reading it would
 * return `undefined` on the server and produce a hydration mismatch inside the
 * control that exists to avoid a flash (D-104).
 */
export function ThemeToggle() {
  const t = useTranslations('ThemeToggle');
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('label')}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <IconSun className="dark:hidden" />
      <IconMoon className="hidden dark:block" />
    </Button>
  );
}
