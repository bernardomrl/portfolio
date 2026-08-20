'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/shared/lib/cn.util';

/** Glyphs the decode draws from. */
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789/<>{}=+*#$%&';
/** Characters that keep their place, so the word keeps its silhouette. */
const FIXED = new Set([' ', '.', '-', '[', ']']);
/** Total run, in ms. */
const DURATION = 460;
/** Ms between re-randomisations. One per frame reads as noise, not as decoding. */
const TICK = 38;

interface TextDecodeProps {
  className?: string;
  label: string;
}

/**
 * Resolves its label out of random glyphs whenever that label changes — §7.11 of
 * `design.md`. Tier 2 under §6.1.
 *
 * why: the label changing is the only trigger, and that is the whole point. A control
 * whose label carries state — `THEME[L]` becoming `THEME[D]` — decodes into the new
 * value, so the effect transports the change instead of decorating it. On hover the
 * label does not change, and a decode resolving to the word already on screen is
 * ornament; §7 calls an effect applied where it signals nothing noise (D-214).
 *
 * why: it therefore behaves identically on touch, which is the one case §6.4 asks
 * about — there is no pointer in the trigger at all.
 *
 * why: the animated text is written straight to `textContent` through a ref, and no
 * frame touches React state. §6.1 fixes that as the cost of Tier 2.
 *
 * why: two layers. The real string sits in the flow at `opacity-0`, which is what sizes
 * the box and what a screen reader and a text selection get; the decoding layer is
 * absolute and `aria-hidden`, so it contributes nothing to layout. A single mutating
 * node would resize the box on every tick.
 *
 * why: `requestAnimationFrame` throttled to TICK rather than `setInterval`. A background
 * tab stops scheduling frames; an interval keeps firing into a document nobody sees.
 *
 * Touch: identical, because the trigger is not a pointer event (§6.4). Reduced motion:
 * the effect returns before scheduling a frame and the label is present (§6.3).
 */
export function TextDecode({ className, label }: TextDecodeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let startedAt = 0;
    let drawnAt = 0;

    const step = (now: number) => {
      if (!startedAt) startedAt = now;

      const progress = Math.min((now - startedAt) / DURATION, 1);

      if (progress >= 1) {
        node.textContent = label;
        frame.current = 0;
        return;
      }

      if (now - drawnAt >= TICK) {
        drawnAt = now;

        const revealed = Math.floor(progress * label.length);
        let next = '';

        for (let index = 0; index < label.length; index += 1) {
          const char = label[index] ?? '';

          if (index < revealed || FIXED.has(char)) {
            next += char;
            continue;
          }

          next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '';
        }

        node.textContent = next;
      }

      frame.current = requestAnimationFrame(step);
    };

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      node.textContent = label;
    };
  }, [label]);

  return (
    <span className={cn('relative inline-block', className)}>
      <span className="opacity-0">{label}</span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-pre select-none" ref={ref}>
        {label}
      </span>
    </span>
  );
}
