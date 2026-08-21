'use client';

import { createContext, type ReactNode, use } from 'react';

import type { PanelId } from '@/widgets/console/model/use-panel-stack';

interface ConsoleContextValue {
  pop: () => void;
  push: (id: PanelId) => void;
  setStatus: (message: string) => void;
}

const ConsoleContext = createContext<ConsoleContextValue | null>(null);

/**
 * Panel navigation and the footer status, read by every panel.
 *
 * why: a context rather than callback props. The stack belongs to the slice and
 * not to each panel's signature — a fifth panel in T-52 would otherwise mean a
 * new prop threaded through the same three places. It also removes the
 * non-serializable-prop diagnostic the Next client-entry check reports for
 * callbacks passed between client modules, without renaming anything to
 * `*Action` and calling a plain function a Server Action.
 *
 * why: the default is `null` and the hook throws. A default object would let a
 * panel render outside the provider and fail silently by doing nothing when
 * `pop` is called, which is worse than a stack trace naming the mistake.
 *
 * why: `use` and not `useContext`. React 19 reads context with `use`, and the
 * project has no call site of the older form to stay consistent with.
 */
export function ConsoleProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ConsoleContextValue;
}) {
  return <ConsoleContext value={value}>{children}</ConsoleContext>;
}

export function useConsole(): ConsoleContextValue {
  const value = use(ConsoleContext);

  if (value === null) {
    throw new Error('useConsole must be called inside ConsoleProvider.');
  }

  return value;
}
