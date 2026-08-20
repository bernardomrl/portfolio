import type enMessages from '../../../../messages/en.json';

/**
 * The shape every message catalog must have, taken from the default locale.
 *
 * why: `en` is the reference by construction — §3.3 of `project.md` makes it
 * `defaultLocale`, and a catalog shape declared by hand would be a third source
 * that diverges from both files with no error, which is the argument D-161 made
 * against repeating a file name in frontmatter.
 */
export type Catalog = typeof enMessages;

/**
 * why: without this augmentation `t()` takes `string` and a typo in a key is a
 * runtime miss that renders the key path and logs — invisible to `lint`,
 * `typecheck` and `build`. This task takes the catalogs from four namespaces to
 * seven, which is where that failure stops being theoretical.
 *
 * why: `Locale` is deliberately not augmented. It changes the return type of
 * `useLocale()` and the props of `Link` for `features/locale-switcher`, whose
 * source is not in scope here — Regra D. It belongs to whichever task next
 * touches that slice.
 */
declare module 'next-intl' {
  interface AppConfig {
    Messages: Catalog;
  }
}
