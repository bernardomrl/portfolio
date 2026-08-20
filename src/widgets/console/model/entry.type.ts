import type { Icon } from '@tabler/icons-react';

/**
 * why: `icon` holds the component and not a rendered element. An entry is data
 * and the item decides the size and the colour; a `ReactNode` here would fix
 * both at the point that has no business fixing either.
 *
 * why: the glyph names what the entry is, not what activating it does. One icon
 * per kind — a command glyph, a link glyph — would repeat four shapes down the
 * whole list and inform nothing, which is the noise §7 refuses for effects and
 * the same argument holds for iconography.
 */
export interface Entry {
  icon: Icon;
  id: string;
  label: string;
  run: () => void;
  selected?: boolean;
}

export interface EntryGroup {
  items: Entry[];
  value: string;
}
