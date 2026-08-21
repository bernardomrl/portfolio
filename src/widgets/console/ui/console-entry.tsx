import { IconCheck } from '@tabler/icons-react';

import type { Entry } from '@/widgets/console/model/entry.type';

import { AutocompleteItem } from '@/shared/ui/autocomplete';

/**
 * One row of any panel: glyph, label, and the selected marker when the entry
 * carries state.
 *
 * why: extracted at the third panel, not before. Root, Reach out and Theme all
 * render the same row, and the fourth — Locale — makes it four; Regra C is
 * satisfied and the alternative is the same three lines in four files.
 *
 * why: the glyph is `aria-hidden`. It duplicates the label beside it, and a
 * screen reader announcing both reads every entry twice.
 */
export function ConsoleEntry({ entry }: { entry: Entry }) {
  const Icon = entry.icon;

  return (
    <AutocompleteItem onClick={entry.run} value={entry}>
      {/* why: the glyph sits on a plate rather than bare. A row of unframed
           icons of differing weight reads as a ragged left edge; a fixed plate
           gives every entry the same optical start, which is what makes a long
           list scannable. */}
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="truncate">{entry.label}</span>
      {entry.selected ? <IconCheck aria-hidden className="ml-auto size-4" /> : null}
    </AutocompleteItem>
  );
}
