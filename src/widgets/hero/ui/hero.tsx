import { useTranslations } from 'next-intl';

import { HeroReachOutTrigger } from '@/widgets/hero/ui/hero-reach-out-trigger';

/**
 * Which headline lines the layout draws, in order.
 *
 * why: the count lives here and not in `messages`. How many lines the sentence
 * breaks into is a layout decision, and a fourth key added to the catalog with no
 * entry here renders nothing, while an entry here with no key is a type error from
 * next-intl. Both directions report.
 */
const HEADLINE_LINES = ['one', 'two', 'three'] as const;

/**
 * The hero of §4.1.1.
 *
 * why: a Server Component. Every slot but the action is static text, and §7.4 is
 * Tier 1 — the words are split here, at build time, and the stagger is a CSS
 * delay per span. Nothing about the reveal reaches the client.
 *
 * why: the word index is continuous across the three lines rather than restarting
 * per line. The sentence unrolls as one sentence; a per-line restart would read as
 * three blocks arriving.
 *
 * why: only the headline animates. §7 is a closed catalogue and no listed effect
 * covers an eyebrow or a meta line, so they are present from the first frame —
 * which is also what D-151 asks of everything that is not the one strong gesture.
 *
 * why: the mask is `overflow-hidden` with a padding and an equal negative margin.
 * The display face at this size has descenders and pt-BR carries stacked
 * diacritics; clipping the line box exactly would cut both (D-188).
 */
export function Hero() {
  const t = useTranslations('Hero');

  // why: the words of every line are flattened once, so `index` is the position
  // in the whole sentence and the stagger runs continuously across the three
  // lines. Splitting per line and adding a running offset needs a variable
  // mutated inside a map, which the React Compiler rejects — and rightly: a map
  // is not an accumulator.
  const lines = HEADLINE_LINES.map((key) => ({ key, words: t(`headline.${key}`).split(' ') }));
  const wordCounts = lines.map(({ words }) => words.length);

  return (
    <section className="relative flex min-h-[70svh] flex-col justify-center pt-16 pb-4">
      {/* why: the static gradient of §6.5 rule 1. It paints first and is what LCP
          measures; the canvas of T-41 mounts after and cross-fades over it.

          why: it bleeds past the container on both sides and dissolves at the
          bottom instead of ending on an edge. A hard boundary would announce
          where the canvas stops before the canvas exists, and T-41 would inherit
          a limit it did not choose.

          why: `-z-10` and not a `background` on the section. The canvas needs a
          sibling to fade over, and a background image cannot be cross-faded
          against without becoming two properties on one element.

          why: tokens, never a hex, and a value per theme. §10 forbids a literal
          colour in a component; the intensity differs because darkening white and
          lightening black are not symmetric operations, and one value measured on
          the dark theme was invisible on the light one. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[calc(50%-50vw)] -top-16 bottom-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_25%,color-mix(in_oklch,var(--foreground)_14%,transparent),transparent_65%)] dark:bg-[radial-gradient(120%_90%_at_50%_25%,color-mix(in_oklch,var(--foreground)_10%,transparent),transparent_65%)]"
      />
      <p className="mb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {t('eyebrow')}
      </p>

      <h1 className="font-display text-[clamp(2.25rem,8vw,6rem)] leading-[1.15] font-normal tracking-tight select-none sm:leading-[1.3]">
        {lines.map(({ key, words }, line) => {
          /* why: the mask carries its own height rather than inheriting the line box, and the
           * leading is above 1 rather than below it. Measured at 61.06px font-size: the glyphs
           * of this face occupy 76px, which is 1.245em — a line box under 1em cannot contain
           * them, and padding does not help, because what clips is the line box and not the
           * mask. Two earlier drafts tuned padding against a sub-1 leading and both failed, the
           * first showing the selection rectangle over the descenders above, the second showing
           * glyph fragments during the reveal. The leading clears the measured height and the
           * negative top margin recovers the vertical rhythm between masks that no longer
           * overlap. */
          const start = wordCounts.slice(0, line).reduce((total, count) => total + count, 0);

          return (
            <span
              className="block text-balance sm:overflow-hidden sm:not-first:mt-[-0.34em]"
              key={key}
            >
              {words.map((word, position) => (
                <span key={`${key}-${String(position)}`}>
                  <span
                    className="inline-block motion-safe:animate-word-fade motion-safe:sm:animate-word-reveal"
                    style={{ animationDelay: `${String((start + position) * 40)}ms` }}
                  >
                    {word}
                  </span>{' '}
                </span>
              ))}
            </span>
          );
        })}
      </h1>

      <p className="my-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {t('metaLine')}
      </p>

      <div className="mt-2">
        <HeroReachOutTrigger />
      </div>
    </section>
  );
}
