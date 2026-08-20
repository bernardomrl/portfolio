'use client';

import { useEffect, useRef } from 'react';

/** Weight at rest, and the peak under the pointer. Both inside Fraunces' 100–900 range. */
const BASE_WEIGHT = 400;
const PEAK_WEIGHT = 900;
/** Distance in px over which the peak falls back to the base. */
const FALLOFF = 56;

interface WordmarkProps {
  label: string;
}

/**
 * The wordmark, whose letters gain weight as the pointer passes over them — §7.13 of
 * `design.md`. Tier 2 under §6.1.
 *
 * why: no cost in bytes. The `@font-face` this project already ships declares
 * `font-weight: 100 900` — measured in T-22 — because `next/font` sends the weight axis
 * of a variable family whether or not it is listed, and `axes: ['opsz']` asks for the
 * optical axis in addition to it rather than instead of it (D-92, D-218).
 *
 * why: weight and not scale. A scaled letter is the same letter drawn bigger; a heavier
 * cut of a variable face is a different drawing — the stems thicken, the thins hold, the
 * counters close. It is the one gesture on this site that only exists because the
 * typeface was chosen with an axis, which is what makes it hard to copy.
 *
 * why: every write goes to the DOM through a ref and none through React state, which is
 * what §6.1 fixes as the cost of Tier 2. `requestAnimationFrame` coalesces the writes to
 * one per frame — `pointermove` fires faster than the compositor paints.
 *
 * why: the listener sits on the wordmark itself rather than on `window`. The effect
 * begins where the pointer is over a letter, so there is nothing to track from further
 * away, and a global listener would run on every route for a target most pointers never
 * reach.
 *
 * why: a short transition on `font-weight` rather than none. Written raw, the letters
 * snap frame by frame and read as flicker; at 180ms the peak trails the pointer and the
 * word reads as a wave. It also covers the return to rest on exit, so no easing has to
 * be written by hand.
 *
 * why: the letters are `aria-hidden` and the accessible name comes from a visually
 * hidden copy. Per-letter spans read as separate words to a screen reader and break text
 * selection. The cost is kerning: a letter in its own box has no pair to kern against.
 *
 * Touch: not attached, and the wordmark rests at `BASE_WEIGHT` (§6.4). Reduced motion:
 * not attached (§6.3).
 */
export function Wordmark({ label }: WordmarkProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const letters = () => root.querySelectorAll<HTMLElement>('[data-letter]');

    const onMove = (event: PointerEvent) => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;

        for (const letter of letters()) {
          const rect = letter.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const distance = Math.hypot(dx, dy);
          const weight =
            distance > FALLOFF
              ? BASE_WEIGHT
              : BASE_WEIGHT + (PEAK_WEIGHT - BASE_WEIGHT) * (1 - distance / FALLOFF);

          letter.style.fontWeight = `${Math.round(weight)}`;
        }
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;

      for (const letter of letters()) {
        letter.style.fontWeight = `${BASE_WEIGHT}`;
      }
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
    <span className="inline-flex" ref={ref}>
      <span className="sr-only">{label}</span>

      {[...label].map((char, index) => (
        <span
          aria-hidden="true"
          className="inline-block whitespace-pre transition-[font-weight] duration-180 ease-out select-none"
          data-letter=""
          // why: the label is static, so position is the only identity a letter has.
          key={index}
          style={{ fontWeight: BASE_WEIGHT }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
