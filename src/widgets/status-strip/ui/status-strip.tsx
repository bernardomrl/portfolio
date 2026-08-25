import { getTranslations } from 'next-intl/server';

import { StatusStripReachOut } from '@/widgets/status-strip/ui/status-strip-reach-out';

/**
 * The status strip of §4.1.2 — three columns immediately under the hero.
 *
 * why: three columns and not four. The Writing column reads `posts`, which T-29
 * creates; a column carrying an invented title on the most factual surface of the
 * site is worse than a column that is not there yet, which is the family D-210
 * already settled in the footer.
 *
 * why: §7.5 on load rather than on scroll. The hero is 70svh, so the strip is
 * partially visible at the fold by design — an entrance triggered by scroll would
 * animate content the reader has already seen, and it would cost an observer and
 * a second client leaf for an effect that arrives late. The stagger stays per
 * child and stays Tier 1.
 *
 * why: the delay continues past the headline's own stagger rather than starting
 * at zero. The strip is the second half of one arrival, and two sequences racing
 * from the same instant read as one crowded event.
 *
 * why: dividers between the columns and none around them. §4.1.2 asks for dense
 * and scannable; a border on each side would draw three boxes, and boxes are what
 * a row of facts is not.
 */
export async function StatusStrip() {
  const t = await getTranslations('StatusStrip');

  const columns = [
    {
      body: <p className="text-sm text-muted-foreground">{t('now.value')}</p>,
      heading: t('now.heading'),
      key: 'now',
    },
    {
      body: <p className="text-sm text-muted-foreground">{t('building.value')}</p>,
      heading: t('building.heading'),
      key: 'building',
    },
    { body: <StatusStripReachOut />, heading: t('reachOut.heading'), key: 'reach-out' },
  ];

  return (
    <section className="border-t border-border/60">
      <div className="grid gap-x-6 gap-y-6 py-10 md:grid-cols-3">
        {columns.map(({ body, heading, key }, index) => (
          <div
            className="motion-safe:animate-strip-in md:not-first:border-l md:not-first:border-border/60 md:not-first:pl-6"
            key={key}
            style={{ animationDelay: `${String(560 + index * 90)}ms` }}
          >
            <h2 className="font-mono text-xs tracking-wider uppercase">{heading}</h2>
            <div className="mt-2 md:mt-4">{body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
