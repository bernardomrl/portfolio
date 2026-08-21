'use client';

import { useSyncExternalStore } from 'react';

/**
 * Whether the primary pointer is coarse — a finger rather than a mouse.
 *
 * why: `useSyncExternalStore` and not `useState` in an effect, which is the form
 * D-213 established for the same question in `features/theme-toggle`. The server
 * snapshot is `false`, so the fine-pointer behaviour is the one that renders
 * without a client, and the coarse branch only ever removes an affordance that
 * a finger cannot use.
 *
 * why: the query is subscribed rather than read once. A tablet with a keyboard
 * attached mid-session changes the answer, and a value read at mount would keep
 * the wrong one for the rest of the visit.
 */
const QUERY = '(pointer: coarse)';

function subscribe(onChange: () => void) {
  const list = window.matchMedia(QUERY);

  list.addEventListener('change', onChange);

  return () => list.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useCoarsePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
