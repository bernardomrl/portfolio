'use client';

import { stagger, useAnimate, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

import { cn } from '@/shared/lib/cn.util';

/** Seconds between adjacent letters. */
const STAGGER = 0.028;

const TRANSITION = { duration: 0.62, type: 'spring' } as const;

interface HoverFlipProps {
  className?: string;
  label: string;
}

/**
 * Rolls its letters out through the bottom while an identical set arrives from above,
 * staggered per letter and settling on a spring — §7.12 of `design.md`. Tier 4 under
 * §6.1.
 *
 * why: Tier 4, and the mechanism §6.1 requires naming is spring physics. The settle is
 * the effect; a CSS transition can approximate a spring with `linear()` but cannot be
 * given mass, and a `cubic-bezier` reads as a slide. Every other property of this effect
 * — the roll, the per-letter delay, the clip — is expressible in CSS, and the spring is
 * the only reason the dependency is here (D-2xx, O-03).
 *
 * why: the run completes once started and a re-entry during it is ignored. A CSS
 * transition on `:hover` reverses when the pointer leaves, which is the one behaviour
 * this effect must not have, and restarting mid-flight leaves the letters at unrelated
 * offsets and reads as a stutter.
 *
 * why: no `motion` component and no `LazyMotion`. `useAnimate` scopes its selectors to a
 * ref that takes a plain HTML element, so nothing declarative is mounted and there is no
 * feature bundle to load. The declarative component would be 34kb before `LazyMotion`
 * and 4.6kb after; this path is the hybrid `useAnimate` alone.
 *
 * why: the blocked flag is a ref. Through state it would re-render the component twice
 * per hover to gate an animation that never touches React.
 *
 * why: both faces animate `y` — a transform — rather than `top`. The reference this
 * adapts moved the incoming face with `top`, which is a layout property and costs a
 * reflow per frame per letter.
 *
 * why: the letters are `aria-hidden` and the accessible name comes from a visually
 * hidden copy. Per-letter spans read as separate words to a screen reader and break text
 * selection.
 *
 * Touch: `pointerenter` does not fire without a pointer and the label rests (§6.4).
 * Reduced motion: the handler returns immediately and nothing moves (§6.3).
 */
export function HoverFlip({ className, label }: HoverFlipProps) {
  const [scope, animate] = useAnimate();
  const running = useRef(false);
  const reduced = useReducedMotion();

  const onEnter = () => {
    if (reduced) return;
    if (running.current) return;

    running.current = true;

    const transition = { ...TRANSITION, delay: stagger(STAGGER) };

    void animate('[data-flip=in]', { y: 0 }, transition).then(() =>
      animate('[data-flip=in]', { y: '-100%' }, { duration: 0 }),
    );

    void animate('[data-flip=out]', { y: '100%' }, transition).then(async () => {
      await animate('[data-flip=out]', { y: 0 }, { duration: 0 });
      running.current = false;
    });
  };

  return (
    <span
      className={cn('relative flex items-center overflow-hidden leading-[1.35]', className)}
      onPointerEnter={onEnter}
      ref={scope}
    >
      <span className="sr-only">{label}</span>

      {[...label].map((char, index) => (
        <span
          aria-hidden="true"
          className="relative flex whitespace-pre select-none"
          // why: the label is static, so position is the only identity a letter has.
          key={index}
        >
          <span className="relative" data-flip="out">
            {char}
          </span>
          <span
            className="absolute inset-0"
            data-flip="in"
            style={{ transform: 'translateY(-100%)' }}
          >
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}
