import type { ComponentProps } from 'react';

interface IconMarkProps extends ComponentProps<'svg'> {
  /** Edge of the square, in pixels. Governs both `width` and `height`. */
  size?: number;
}

/**
 * The site's mark — §10 of `design.md`. A four-by-four grid whose opacity falls with
 * `col + row`, with the `sum = 1` diagonal empty and two corners absent.
 *
 * why: the same geometry as `app/icon.svg` at a different scale. That file draws on a
 * 32 viewBox with an inset of 4, because a browser tab and an iOS home screen are
 * surfaces this site does not control and the plate is what separates the mark from
 * them (D-241). Inside the document there is nothing to separate from, so the grid
 * fills the viewBox and the plate is gone.
 *
 * why: `currentColor` on the root, inherited by every rect. §10 of `architecture.md`
 * forbids a literal colour in a component, and this is also what makes the mark follow
 * the theme without a class, a variable or a second file — which the plate would have
 * made impossible.
 *
 * why: `size` governs both dimensions and there is no `color` and no `stroke`. Those
 * two are the contract of `@tabler/icons-react`, where `createReactComponent` turns
 * `color` into `stroke` and `stroke` into `stroke-width` over `fill="none"`. A
 * fill-only drawing would accept both and drop both in silence.
 *
 * why: no `cn()`. The component carries no base class, so there is nothing to merge —
 * `className` arrives through the spread with the rest of the SVG attributes.
 *
 * why: no `title` prop. The only consumer is decorative, and a `<title>` rendered from
 * a prop nobody passes is API with no caller.
 */
export function IconMark({ size = 24, ...props }: IconMarkProps) {
  return (
    <svg
      fill="currentColor"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect height="6" width="6" x="0" y="0" />
      <rect height="6" opacity="0.6" width="6" x="12" y="0" />
      <rect height="6" opacity="0.6" width="6" x="6" y="6" />
      <rect height="6" opacity="0.45" width="6" x="12" y="6" />
      <rect height="6" opacity="0.3" width="6" x="18" y="6" />
      <rect height="6" opacity="0.6" width="6" x="0" y="12" />
      <rect height="6" opacity="0.45" width="6" x="6" y="12" />
      <rect height="6" opacity="0.3" width="6" x="12" y="12" />
      <rect height="6" opacity="0.15" width="6" x="18" y="12" />
      <rect height="6" opacity="0.3" width="6" x="6" y="18" />
      <rect height="6" opacity="0.15" width="6" x="12" y="18" />
    </svg>
  );
}
