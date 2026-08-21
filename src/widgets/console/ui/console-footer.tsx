'use client';

import { Dialog } from '@base-ui/react';
import { useTranslations } from 'next-intl';

import { useCoarsePointer } from '@/widgets/console/model/use-coarse-pointer';

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
  const coarse = useCoarsePointer();
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2 font-mono text-xs text-muted-foreground">
      <span aria-live="polite" className="min-w-0 flex-1 truncate">
        {status ?? <span className="hidden pointer-fine:inline">{t('shortcutHint')}</span>}
      </span>

      <span className="flex shrink-0 items-center gap-3">
        {coarse ? null : (
          <span className="flex items-center gap-1.5">
            {t('activate')}
            <kbd className="rounded border border-border px-1 py-0.5">↵</kbd>
          </span>
        )}
        <Dialog.Close
          render={
            <button
              className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-foreground"
              type="button"
            />
          }
        >
          {isRoot ? t('close') : t('back')}
          {coarse ? null : <kbd className="rounded border border-border px-1 py-0.5">esc</kbd>}
        </Dialog.Close>
      </span>
    </div>
  );
}
