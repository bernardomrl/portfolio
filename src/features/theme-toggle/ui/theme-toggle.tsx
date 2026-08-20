'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { Button } from '@/shared/ui/button';
import { TextDecode } from '@/shared/ui/text-decode';

const CYCLE = ['light', 'dark', 'system'] as const;

type Mode = (typeof CYCLE)[number];

function isMode(value: string | undefined): value is Mode {
  return CYCLE.some((candidate) => candidate === value);
}

// why: `useSyncExternalStore` and not `useState` in an effect. Setting state
// synchronously inside an effect body triggers a cascading render, which React 19
// warns about; this hook expresses the same fact — "the server render is over" —
// as a subscription with a server snapshot, which is what it is. `subscribe` and
// both snapshots are module constants so their identity never changes between
// renders (D-213).
const subscribeToNothing = () => () => {};
const getHydrated = () => true;
const getServerHydrated = () => false;

/**
 * Cycles the document through light, dark and automatic themes.
 *
 * why: three states and not two. The stored preference and the resolved theme are
 * different facts, and a two-state control cannot express "follow the system" — it
 * silently converts the visitor's OS preference into a pinned choice on first click.
 *
 * why: the bracket renders a placeholder until mount. The preference lives in
 * `localStorage` and is `undefined` on the server, so reading it at render is the
 * hydration mismatch D-104 rejected. What makes the gate acceptable here, and did not
 * apply there, is that the swap is one glyph in a monospaced slot: `[·]` and `[L]` are
 * the same width, so nothing moves and nothing flashes — only a dot becomes a letter
 * (D-212).
 *
 * why: `theme` and not `resolvedTheme`. `resolvedTheme` collapses `system` into the
 * value it resolved to, which is the one distinction this control exists to show.
 *
 * why: a text label and no icon, so §7.11 has letters to work with and the four header
 * slots share one gesture (D-211).
 *
 * why: the label carries the mode, which is what makes §7.11 mean something here. The
 * decode transports a change — `[L]` becoming `[D]` — rather than resolving into the
 * word already on screen (D-214).
 */
export function ThemeToggle() {
  const t = useTranslations('ThemeToggle');
  const { setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(subscribeToNothing, getHydrated, getServerHydrated);

  // why: every read of the preference is gated by `mounted`, not just the visible one.
  // The first version gated the bracket and left `aria-label` reading `theme` directly,
  // which is `undefined` on the server and the resolved mode on the client — a diverged
  // attribute rather than a diverged text node, and React does not patch attributes up.
  // The rule this yields: a value that only exists after hydration must pass through the
  // same gate wherever it appears, including in attributes (D-215).
  const stored = isMode(theme) ? theme : 'system';
  const current: Mode = mounted ? stored : 'system';
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length] ?? 'system';

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={
        mounted
          ? t('switchTo', { current: t(`names.${current}`), next: t(`names.${next}`) })
          : t('short')
      }
      className="font-mono text-xs tracking-wider uppercase"
      onClick={() => setTheme(next)}
    >
      <TextDecode label={`${t('short')}[${mounted ? t(`modes.${current}`) : '·'}]`} />
    </Button>
  );
}
