'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { CONSOLE_PANEL_ATTRIBUTE, consoleHandle } from '@/shared/lib/console.handle';
import { Button } from '@/shared/ui/button';

/** Distance in px at which the target starts responding to the pointer. */
const PULL_RADIUS = 160;
/** Fraction of the pointer-to-centre distance the target travels at most. */
const PULL_STRENGTH = 0.32;

/**
 * The primary action of §4.1.1, opening the Console at the Reach out panel and
 * carrying §7.1.
 *
 * why: the only client leaf of the hero. The handle is a client store (D-226), so
 * anything importing it converts — keeping the import here leaves the headline, the
 * eyebrow and the meta line on the server, which is what §7.4 needs in order to cost
 * no hydration.
 *
 * why: `Dialog.Trigger` with `render`, the composition the header trigger uses. The
 * primitive owns `aria-haspopup`, `aria-expanded` and the focus restoration target,
 * and the base button style already excludes a popup trigger from its press translate.
 *
 * why: §7.1 here and not on the header controls. The catalogue lists primary actions
 * as legal and this target is isolated, so the pull has nothing to compete with — the
 * condition D-218 found missing when the same effect was built on the wordmark.
 *
 * why: the displacement is a fraction of the pointer-to-centre vector rather than a
 * capped distance normalised by the radius. Normalising twice — dividing by the radius
 * and multiplying by the falloff — makes the travel a fraction of a fraction, which was
 * measured at 2.6px on a 240px radius and read as no effect at all.
 *
 * why: `requestAnimationFrame` coalesces the writes. `pointermove` fires faster than the
 * compositor paints, and uncoalesced writes fight the transition rather than feed it.
 *
 * why: every write goes to the DOM through a ref and none through React state, which is
 * what keeps a Tier 2 effect off the render path.
 *
 * why: the listener is not attached at all under a coarse pointer or reduced motion,
 * which is what §7.1 and §6.4 require — the effect is absent rather than shortened.
 *
 * why: this duplicates the arithmetic of `MagneticGroup` in `widgets/site-header` rather
 * than sharing it. A widget cannot import another widget, and the two are not the same
 * component: that one hosts §7.3 over a group of three controls, which §7.3 forbids
 * outside tiles and cards. Regra C holds the extraction at the third case, which is T-26.
 */
export function HeroReachOutTrigger() {
  const t = useTranslations('Hero');
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const button = buttonRef.current;

    if (root === null || button === null) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const settle = () => {
      button.style.setProperty('--pull-x', '0px');
      button.style.setProperty('--pull-y', '0px');
    };

    const onMove = (event: PointerEvent) => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;

        const rect = button.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const pull = distance > PULL_RADIUS ? 0 : PULL_STRENGTH * (1 - distance / PULL_RADIUS);

        button.style.setProperty('--pull-x', `${String(dx * pull)}px`);
        button.style.setProperty('--pull-y', `${String(dy * pull)}px`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      settle();
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="-m-12 w-fit p-12" ref={rootRef}>
      <Dialog.Trigger
        {...{ [CONSOLE_PANEL_ATTRIBUTE]: 'reach-out' }}
        handle={consoleHandle}
        render={
          <Button
            className="[translate:var(--pull-x,0px)_var(--pull-y,0px)] px-6 text-base transition-[translate,background-color] duration-500 ease-out"
            ref={buttonRef}
            size="lg"
          />
        }
      >
        {t('primaryAction')}
      </Dialog.Trigger>
    </div>
  );
}
