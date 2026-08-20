'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect, useRef } from 'react';

import {
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
} from '@/shared/ui/autocomplete';
import { Button } from '@/shared/ui/button';

interface ConsolePanelProps {
  children: ReactNode;
  onBack?: () => void;
  placeholder: string;
}

/**
 * The chrome every panel shares: a search field, an optional back control, the
 * empty state, and a scroll region of fixed height.
 *
 * why: this does not own `Autocomplete.Root`. The root takes either a flat list
 * or a list of groups through two overloads, and a union of the two matches
 * neither — TypeScript resolves an overload against one type, not against a
 * union. Making this component generic would push an `any` into the constraint
 * to satisfy the group overload. The honest split is that the frame is shared
 * and the item shape is not: each panel mounts its own root with its own items,
 * and this renders inside it.
 *
 * why: focus is moved to the input on mount. The `initialFocus` of the popup
 * runs when the dialog opens and does not fire again on a panel change, and the
 * ARIA combobox pattern puts arrow-key traversal on the input — with focus left
 * on the back control, the list has no keyboard owner and the panel silently
 * stops responding to arrows. Each panel is a separate mount, so one effect here
 * covers every push and every pop.
 *
 * why: the height lives on the wrapper around the list rather than on the list.
 * A `max-h` on the list lets the popup grow and shrink as the filter narrows,
 * which moves the footer under the pointer between keystrokes.
 */
export function ConsolePanel({ children, onBack, placeholder }: ConsolePanelProps) {
  const t = useTranslations('Console');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <AutocompleteInputGroup>
        {onBack ? (
          <Button aria-label={t('back')} onClick={onBack} size="icon-sm" variant="ghost">
            <IconArrowLeft />
          </Button>
        ) : null}
        <AutocompleteInput aria-label={placeholder} placeholder={placeholder} ref={inputRef} />
      </AutocompleteInputGroup>

      <div className="h-96 overflow-y-auto">
        <AutocompleteEmpty>{t('empty')}</AutocompleteEmpty>
        {children}
      </div>
    </>
  );
}
