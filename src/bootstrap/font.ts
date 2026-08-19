import { Archivo, Fraunces, IBM_Plex_Mono } from 'next/font/google';

/**
 * The application typeface, loaded and self-hosted at build time.
 *
 * why: the variable is named apart from the theme's `--font-sans`, which
 * composes it with an explicit fallback stack. Binding both to one name is a
 * cycle that only resolves through cascade layer order, and it drops the
 * fallback (D-97).
 *
 * why: no `axes` entry. Archivo's variable font carries a width axis alongside
 * weight, and next/font ships the weight axis alone unless the others are
 * requested. Nothing renders condensed text, so requesting `wdth` would pay
 * file size for an axis no utility reads (D-92).
 */
export const fontSans = Archivo({
  subsets: ['latin'],
  variable: '--font-sans-archivo',
});

/**
 * The display typeface, restricted to headings and large sizes by §8 of
 * `design.md`.
 *
 * why: `axes` takes tags, not values — the whole range of each listed axis
 * ships and the value is pinned in CSS. `opsz` is requested so the browser
 * default `font-optical-sizing: auto` can track it against font-size; without
 * the axis, Fraunces renders every size at one optical cut.
 *
 * why: `WONK` is deliberately absent, which locks it at the fvar default of 1
 * — the leaning n/m/h are on and cannot be turned off. That is the form chosen
 * at the T-47 prototype, so the cheaper declaration and the chosen one are the
 * same declaration (D-188).
 *
 * why: `preload: false`. Nothing renders this family until T-22, and a
 * preloaded face with no consumer is a request paid on every route for markup
 * that does not exist. The `@font-face` still ships; the file is fetched the
 * first time a glyph asks for it (D-191).
 */
export const fontDisplay = Fraunces({
  axes: ['opsz'],
  preload: true,
  subsets: ['latin'],
  variable: '--font-display-fraunces',
});

/**
 * The monospace typeface. It carries the eyebrow, the meta line and numbers
 * under §8 of `design.md`, and the compiled code blocks under §10 of
 * `architecture.md` — one declaration serving both (D-189).
 *
 * why: the static 400 rather than a variable mono. §8 asks for one weight, and
 * for a single weight the static cut is the smaller file.
 *
 * why: `preload: false`, for the reason given above. T-22 is its first
 * consumer.
 */
export const fontMono = IBM_Plex_Mono({
  preload: false,
  subsets: ['latin'],
  variable: '--font-mono-plex',
  weight: '400',
});

/**
 * why: the root layout applies one binding rather than three. Adding a fourth
 * family is then an edit to this module alone and never touches `app/`, which
 * §2.1 of `architecture.md` reserves for routing.
 */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`;
