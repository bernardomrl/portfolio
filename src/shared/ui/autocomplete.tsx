'use client';

import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';

import { cn } from '@/shared/lib/cn.util';

/**
 * A filterable list of items that perform an action when activated, rendered
 * inline inside a dialog — the composition Base UI documents as a command
 * palette.
 *
 * why: `Autocomplete` and not `Combobox`. Base UI's own guidelines split them
 * on whether selection is remembered: Combobox is for a value that persists in
 * a field, Autocomplete for a filter over items that act when clicked. The
 * Console navigates and toggles; nothing stays selected.
 *
 * why: the popup parts are not exported. The Console renders `inline` inside
 * `Dialog.Popup`, so `Portal`, `Positioner` and `Popup` have no caller, and
 * neither do `Trigger`, `Icon`, `Clear`, `Arrow`, `Row`, `Separator` or
 * `Status`. Exporting them would be API surface written against an imagined
 * consumer, which D-163 and D-170 already refused twice for the read seams.
 *
 * why: `Root` and `Collection` are re-exported rather than wrapped. Neither
 * renders an HTML element of its own, so there is no node to carry a
 * `data-slot` or a class, and a wrapper around them would be indirection with
 * nothing in it.
 *
 * why: group labels are mono, uppercase and tracked. §8 of `design.md` gives
 * the mono face navigation and control labels, and this is the same treatment
 * the footer column headings already carry — the register was established
 * before the rule was written.
 */
const Autocomplete = AutocompletePrimitive.Root;

const AutocompleteCollection = AutocompletePrimitive.Collection;

function AutocompleteInputGroup({ className, ...props }: AutocompletePrimitive.InputGroup.Props) {
  return (
    <AutocompletePrimitive.InputGroup
      data-slot="autocomplete-input-group"
      className={cn('flex items-center gap-2 border-b border-border px-4', className)}
      {...props}
    />
  );
}

function AutocompleteInput({ className, ...props }: AutocompletePrimitive.Input.Props) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(
        'h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function AutocompleteList({ className, ...props }: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn('flex flex-col gap-1 p-2', className)}
      {...props}
    />
  );
}

function AutocompleteGroup({ className, ...props }: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn('flex flex-col gap-1 pb-2 last:pb-0', className)}
      {...props}
    />
  );
}

function AutocompleteGroupLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn(
        'px-2 py-1 font-mono text-xs tracking-wider text-muted-foreground uppercase',
        className,
      )}
      {...props}
    />
  );
}

/**
 * why: the highlight is styled through `data-highlighted` and not `:hover`.
 * The primitive sets that attribute for both keyboard traversal and pointer
 * hover, so one declaration covers both and the two inputs cannot drift apart
 * visually — which is what a keyboard user comparing the two would notice.
 */
function AutocompleteItem({ className, ...props }: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "flex cursor-default items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors select-none data-highlighted:bg-muted data-highlighted:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn('px-4 py-6 text-center text-sm text-muted-foreground empty:hidden', className)}
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
};
