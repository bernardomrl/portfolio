'use client';

import { useCallback, useState } from 'react';

export type PanelId = 'locale' | 'reach-out' | 'root' | 'theme';

const PANEL_IDS = ['locale', 'reach-out', 'root', 'theme'] as const;

/**
 * Session key naming the panel to restore after a navigation that unmounts the
 * overlay.
 *
 * why: it lives beside `PanelId` because the stored value is one. The key and
 * the union it carries are one fact, and separating them puts a string in one
 * file and the set of values it may hold in another.
 */
export const REOPEN_KEY = 'console:reopen';

export function isPanelId(value: null | string): value is PanelId {
  return PANEL_IDS.some((candidate) => candidate === value);
}

/**
 * The panel stack of §3.2, as a stack rather than a flag.
 *
 * why: a stack and not a `PanelId` state. `Escape` and the back control both
 * mean "the layer above this one", which only a stack answers without every
 * panel having to know its own parent — and T-52 adds a fifth panel that would
 * otherwise need another conditional.
 *
 * why: a restored panel is pushed onto the root rather than replacing it. The
 * navigation interrupted a reader who was one layer deep, so `Escape` has to
 * return them to the root exactly as it would have before.
 *
 * why: `?? 'root'` rather than a non-null assertion. `noUncheckedIndexedAccess`
 * types the indexed read as possibly `undefined`, and the fallback is the state
 * the stack is initialised to.
 */
export function usePanelStack(initial: PanelId = 'root') {
  const [stack, setStack] = useState<PanelId[]>(initial === 'root' ? ['root'] : ['root', initial]);

  const push = useCallback((id: PanelId) => {
    setStack((previous) => [...previous, id]);
  }, []);

  const pop = useCallback(() => {
    setStack((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
  }, []);

  const reset = useCallback(() => {
    setStack(['root']);
  }, []);

  return {
    current: stack[stack.length - 1] ?? 'root',
    isRoot: stack.length === 1,
    pop,
    push,
    reset,
  };
}
