import { NextIntlClientProvider } from 'next-intl';
import type { PropsWithChildren } from 'react';

import { ThemeProvider } from '@/bootstrap/providers/theme-provider';

/**
 * Composes every application-wide provider around the route tree.
 *
 * why: no `"use client"` directive here. This module only forwards `children`,
 * and each provider file carries its own boundary (D-105). It stays a Server
 * Component on purpose: that is the condition under which
 * `NextIntlClientProvider` inherits the locale, the formats and the whole
 * catalog from `request.ts` and needs no props at all (D-114).
 */
export function RootProvider({ children }: PropsWithChildren) {
  return (
    <NextIntlClientProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}
