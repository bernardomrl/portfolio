'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { ConsoleProvider } from '@/widgets/console/model/console.context';
import {
  isPanelId,
  type PanelId,
  REOPEN_KEY,
  usePanelStack,
} from '@/widgets/console/model/use-panel-stack';
import { ConsoleFooter } from '@/widgets/console/ui/console-footer';
import { LocalePanel } from '@/widgets/console/ui/panels/locale-panel';
import { ReachOutPanel } from '@/widgets/console/ui/panels/reach-out-panel';
import { RootPanel } from '@/widgets/console/ui/panels/root-panel';
import { ThemePanel } from '@/widgets/console/ui/panels/theme-panel';

import { consoleHandle } from '@/shared/lib/console.handle';

/** How long a footer status stays before clearing, in ms. */
const STATUS_DURATION = 10000;

/**
 * The Console overlay — §3.2 of `design.md`. The first signature moment of §2.1.
 *
 * why: `Dialog` and not a hand-rolled overlay. §10 of `architecture.md` forbids
 * hand-rolling dialogs, and every property §3.2 states is one the primitive has:
 * `modal` traps focus, locks page scroll and marks the rest of the document
 * inert; `Escape` and a backdrop press close; focus returns to the trigger.
 *
 * why: one surface, one mechanic. Every panel is a filterable list and nothing
 * is pinned outside it — an entry is reachable by typing its name while a pinned
 * toggle is reachable only by someone already looking at it (D-233).
 *
 * why: closing and going back share one callback, so the reason separates them.
 * Above the root panel, `Escape` and a backdrop press pop a layer instead of
 * dismissing the overlay, which is the convention a command palette teaches.
 *
 * why: a route change closes the overlay and nothing restores it. Base UI
 * documents that each `Dialog.Root` mount starts from fresh state, and the
 * `[locale]` segment remounts on navigation — so activating a page entry ends
 * the interaction by construction, which is what activating it means. Only a
 * locale change asks for the overlay back, because there the navigation is the
 * preference rather than the destination.
 *
 * why: `initialFocus` reads the interaction type, resolving the first half of
 * O-09. On touch the popup takes focus and the virtual keyboard stays down, so
 * the panel opens fully visible and the keyboard rises only when the user taps
 * the field — the mitigation D-200 assumed existed. Written out rather than
 * inherited, so a default that shifts in a minor cannot move a decision (D-135).
 *
 * why: the shortcut is bound here and not on the trigger. The trigger scrolls
 * out of view with the header (D-202) while this component is mounted on every
 * route, so the binding survives where the control does not.
 */
export function Console() {
  const t = useTranslations('Console');
  const [status, setStatus] = useState<null | string>(null);

  // why: read in the initialiser rather than in an effect. The stack is built on
  // first render, and an effect would mount the root panel, move focus into it,
  // then swap — a visible flash and a focus move for nothing.
  //
  // why: the flag is removed as it is read, so a failure to open cannot leave a
  // value that reopens the overlay on every subsequent navigation.
  //
  // why: the `window` guard is not optional. This component is a child of the
  // layout and does render on the server; only the contents of `Dialog.Portal`
  // do not. It produces no hydration mismatch for the same reason — the value
  // only reaches the portal subtree, which has no server markup to diverge from
  // (D-215).
  const [initialPanel] = useState<PanelId>(() => {
    if (typeof window === 'undefined') return 'root';

    const stored = sessionStorage.getItem(REOPEN_KEY);
    sessionStorage.removeItem(REOPEN_KEY);

    return isPanelId(stored) ? stored : 'root';
  });

  const { current, isRoot, pop, push, reset } = usePanelStack(initialPanel);
  // why: memoized because it is a context value. A fresh object each render
  // re-renders every panel below it, which for a list under a filter is the one
  // place a wasted render is visible.
  const contextValue = useMemo(() => ({ pop, push, setStatus }), [pop, push]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k') return;
      if (!event.metaKey && !event.ctrlKey) return;

      event.preventDefault();
      consoleHandle.open(null);
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (initialPanel === 'root') return;

    consoleHandle.open(null);
  }, [initialPanel]);

  // why: the timeout is keyed on the message, so a second action while the first
  // is still showing restarts the clock instead of leaving an orphaned timer to
  // clear a message it did not set.
  useEffect(() => {
    if (status === null) return;

    const timer = setTimeout(() => setStatus(null), STATUS_DURATION);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <Dialog.Root
      // why: `defaultOpen` and not `open`. The overlay only needs to start open
      // on the mount that follows a locale change, which is an initial value and
      // not ongoing control. Passing `open` made the dialog controlled, and
      // alternating it back to `undefined` is the uncontrolled-to-controlled
      // switch React warns about; controlling it permanently instead would mean
      // owning a state the handle and the header trigger already own.
      //
      // why: not `consoleHandle.open()` in an effect either. Base UI ignores a
      // handle call made while no root is attached, and that effect races the
      // root's own registration — a race it loses silently.
      defaultOpen={initialPanel !== 'root'}
      handle={consoleHandle}
      onOpenChange={(open, eventDetails) => {
        if (open) return;

        if (!isRoot) {
          eventDetails.cancel();
          pop();
          return;
        }

        reset();
        setStatus(null);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/20 duration-100 supports-backdrop-filter:backdrop-blur-xs" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
          <Dialog.Popup
            aria-label={t('label')}
            className="data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 flex w-full max-w-2xl origin-top flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none"
            initialFocus={(openType) => openType !== 'touch'}
          >
            <ConsoleProvider value={contextValue}>
              {/* why: the key is the panel id, so a panel change unmounts one
                  subtree and mounts another. Without it React reconciles the two
                  panels into the same nodes, the mount animation never fires,
                  and the focus effect of `ConsolePanel` never runs again — the
                  same failure that killed the arrow keys on the first version of
                  the Reach out panel.

                  why: `flex flex-col` is repeated here. The wrapper sits between
                  `Dialog.Popup` and the panel, and without it the panel stops
                  being a flex item of the popup. */}
              <div className="flex flex-col motion-safe:animate-panel-in" key={current}>
                {current === 'root' ? <RootPanel /> : null}
                {current === 'theme' ? <ThemePanel /> : null}
                {current === 'locale' ? <LocalePanel /> : null}
                {current === 'reach-out' ? <ReachOutPanel /> : null}
              </div>
            </ConsoleProvider>

            <ConsoleFooter isRoot={isRoot} status={status} />
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
