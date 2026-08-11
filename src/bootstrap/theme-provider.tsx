'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';

/**
 * Applies the persisted theme to the document before first paint and keeps it
 * in sync with the operating system.
 *
 * why: `attribute="class"` writes the `.dark` class that the stylesheet's
 * `@custom-variant` selects (D-86). `children` is received as a prop and never
 * imported, so the client boundary covers this module alone — the exception
 * §4 of architecture.md grants to `bootstrap/` providers (D-100).
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
