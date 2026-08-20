'use client';

import { useTranslations } from 'next-intl';

/**
 * why: the footer carries the keys rather than describing them in prose. The
 * glyph is the thing the reader will press, and `kbd` is the element the
 * platform has for it — not a primitive §10 reserves, so no registry component
 * is bought for two characters.
 *
 * why: the status replaces the shortcut hint rather than sitting beside it.
 * They compete for the same corner, and the transient message is the one that is
 * true right now.
 */
export function ConsoleFooter({ isRoot, status }: { isRoot: boolean; status: null | string }) {
  const t = useTranslations('Console');

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2 font-mono text-xs text-muted-foreground">
      <span aria-live="polite" className="min-w-0">
        {status ?? <span className="hidden pointer-fine:inline">{t('shortcutHint')}</span>}
      </span>

      <span className="flex shrink-0 items-center gap-3">
        <span className="flex items-center gap-1.5">
          {t('activate')}
          <kbd className="rounded border border-border px-1 py-0.5">↵</kbd>
        </span>
        {/* why: the key does two things depending on the layer, so the label
             names the one it does now. A footer that always says Close while the
             key goes back teaches the reader to distrust the footer. */}
        <span className="flex items-center gap-1.5">
          {isRoot ? t('close') : t('back')}
          <kbd className="rounded border border-border px-1 py-0.5">esc</kbd>
        </span>
      </span>
    </div>
  );
}
