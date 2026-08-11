import { Archivo } from 'next/font/google';

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
