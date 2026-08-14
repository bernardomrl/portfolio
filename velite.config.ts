import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from 'rehype-pretty-code';
import { defineConfig } from 'velite';

// why: dual theme is not a preference. A single theme writes one set of colours
// into the markup at build time, and the site has two — next-themes toggles the
// `.dark` class on `html` (D-86) long after Velite has run. With two themes shiki
// emits `--shiki-light` and `--shiki-dark` per token and the stylesheet chooses,
// which is the only form that survives a runtime toggle.
// keepBackground drops the theme's own surface so the block sits on `--card`
// like every other bordered surface; bypassInlineCode leaves `code` outside a
// fence to typeset.css, which styles it as a token and not as a snippet;
// defaultLang keeps an unlabelled fence from rendering unthemed next to a
// labelled one.
const rehypePrettyCodeOptions = {
  theme: { light: 'github-light', dark: 'github-dark-dimmed' },
  keepBackground: false,
  bypassInlineCode: true,
  defaultLang: 'plaintext',
} satisfies RehypePrettyCodeOptions;

export default defineConfig({
  // why: root and output both equal the library defaults and are declared
  // anyway. project.md §1 fixes content/ at the repository root and §2.3 of
  // architecture.md maps #site/content to this output path — a default that
  // shifts in a minor would move both in silence.
  root: 'content',
  // why: `clean` and `strict` are deliberately absent. Both are readable here
  // and both are dead under the CLI: velite's argument parser defaults each
  // flag to `false`, and resolveConfig merges with `??`, so the config value is
  // never consulted. They live on the command line in package.json instead
  // (D-139). Every other option below is read from this file.
  output: {
    data: '.velite',
  },
  // why: empty until T-20. content/ does not exist and §1 of project.md forbids
  // committing an empty directory, so this task ships the pipeline alone and
  // T-20 ships the first collection together with the files that justify it.
  collections: {},
  // why: only `mdx` is declared. `s.markdown()` has no consumer in this project
  // — every collection compiles through `s.mdx()` (D-142) — so a `markdown`
  // block would state an intent it never has, which is what D-134 and D-139
  // rejected twice. `remark-gfm` is absent for the opposite reason: Velite
  // defaults `gfm` to true and pushes the plugin itself, so declaring it here
  // applies it twice (D-141).
  mdx: {
    // why: the plugin resolves every link href against the content root and
    // reads it, to copy the target into `output.assets`. This project never
    // needs it — §10 references content images from `public/` and resolves them
    // through the component mapping — so it only turns navigation hrefs into
    // disk reads. Measured against the installed source: `join(absoluteRoot,
    // value)` collapses `/` back to the content root, and reading a directory
    // throws EISDIR, aborting the build; `/about` resolves to a nonexistent
    // path and is skipped. A link to the home page is the most ordinary thing
    // prose contains (D-149).
    copyLinkedFiles: false,
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});
