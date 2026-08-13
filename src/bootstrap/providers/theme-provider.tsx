'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect, useLayoutEffect } from 'react';
import type { PropsWithChildren } from 'react';

const THEME_STORAGE_KEY = 'theme';
const THEME_CLASSES = ['light', 'dark'] as const;

// why: a layout effect runs after React's DOM mutation and before paint, in the
// same commit, so the repair below cannot be preempted by a frame. On the
// server the hook does not run at all, and calling useLayoutEffect there warns.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function readStoredTheme() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    // why: localStorage access throws in Safari private browsing. The pre-paint
    // script of next-themes swallows the same failure and falls back to system.
    return null;
  }
}

function applyStoredTheme() {
  const stored = readStoredTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved =
    stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';

  document.documentElement.classList.remove(...THEME_CLASSES);
  document.documentElement.classList.add(resolved);
  document.documentElement.style.colorScheme = resolved;
}

/**
 * Applies the persisted theme to the document before first paint and keeps it
 * in sync with the operating system.
 *
 * why: `attribute="class"` writes the `.dark` class that the stylesheet's
 * `@custom-variant` selects (D-86). `children` is received as a prop and never
 * imported, so the client boundary covers this module alone — the exception
 * §4 of architecture.md grants to `bootstrap/` providers (D-100).
 *
 * why: the layout effect repairs a gap in next-themes rather than duplicating
 * it. Switching locale changes the `[locale]` segment, so the root layout
 * remounts, and React re-acquires the `html` singleton — it strips every
 * attribute and rewrites only those coming from props, discarding the theme
 * class and `color-scheme`. The library's pre-paint script cannot restore them,
 * because React never executes a rendered script on the client, which is the
 * same defect its own console warning reports. Its passive effect does restore
 * them, but only after paint (D-121).
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  useIsomorphicLayoutEffect(applyStoredTheme, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={THEME_STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  );
}
