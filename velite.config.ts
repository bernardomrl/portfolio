import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from 'rehype-pretty-code';
// why: the `z` re-exported below is Velite 0.4's own Zod and it is v3 — `z.url`
// is `undefined` on it, measured in T-21. The project's direct dependency is
// `zod@4.4.3`, which `browser-env.ts` uses, so two majors coexist in the tree
// and the v4 API is not reachable from this file. Importing `zod` directly here
// instead would put a v4 schema in front of a v3 validator, a pairing neither
// library states a contract for (D-186).
import { defineConfig, s, z } from 'velite';
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

// why: the locale set is repeated here rather than imported from
// `src/shared/config/i18n/routing.ts`. This file is bundled by esbuild outside
// the tsconfig paths and outside the FSD hierarchy, so the import is not
// available, and a build config reaching into application code inverts the
// dependency anyway. The duplication is guarded rather than accepted: each seam
// in `shared/content/` types its parameter as the routing contract's own locale
// union and assigns it to its collection's, so a divergence between the two
// lists fails `typecheck` instead of shipping a document that resolves for no
// locale (D-162).
// why: one constant for every collection, not one per collection. A constant is
// not an abstraction and Regra C does not reach it — duplicating the tuple would
// create a second source that diverges in silence, which is the argument D-161
// already made against repeating the file name in frontmatter (D-171).
const CONTENT_LOCALES = ['en', 'pt-BR'] as const;

type ContentLocale = (typeof CONTENT_LOCALES)[number];

const isContentLocale = (value: string): value is ContentLocale =>
  (CONTENT_LOCALES as readonly string[]).includes(value);

// why: `s.path()` returns the path relative to the content root with the
// extension removed — `pages/about.en` for `content/pages/about.en.md`. It
// carries the collection directory and the locale suffix, so neither `slug` nor
// `locale` is readable without parsing, and neither belongs in frontmatter: §3
// fixes the pair in the file name, and a frontmatter field repeating the file
// name is a second source that can diverge with no error. A path this parser
// cannot read fails the build carrying the value it received, so the schema
// diagnoses itself (D-161).
// why: positional captures rather than named groups. `(?<name>…)` is ES2018 and
// `tsconfig.json` targets ES2017; raising the target is a global change with no
// relation to this task. `noUncheckedIndexedAccess` types both captures as
// possibly `undefined` either way, so the guard below is not a cost of this form.
const PAGE_PATH = /^pages\/([a-z0-9]+(?:-[a-z0-9]+)*)\.([^.]+)$/;

const parsePagePath = (path: string): null | { locale: ContentLocale; slug: string } => {
  const match = PAGE_PATH.exec(path);
  const slug = match?.[1];
  const locale = match?.[2];

  if (slug === undefined || locale === undefined || !isContentLocale(locale)) return null;

  return { locale, slug };
};

// why: the second occurrence of the path-to-`{ slug, locale }` transform, and it
// is duplicated rather than extracted. D-163 pre-committed the extraction to the
// third case, which lands in T-29 or T-43 — generalizing here would fix the shape
// against two examples when the third is already scheduled and may not fit it.
// Regra C. The regex differs by the anchored directory, which is the only part a
// shared parser would have taken as an argument (D-171).
const PROJECT_PATH = /^projects\/([a-z0-9]+(?:-[a-z0-9]+)*)\.([^.]+)$/;

const parseProjectPath = (path: string): null | { locale: ContentLocale; slug: string } => {
  const match = PROJECT_PATH.exec(path);
  const slug = match?.[1];
  const locale = match?.[2];

  if (slug === undefined || locale === undefined || !isContentLocale(locale)) return null;

  return { locale, slug };
};

// why: the third occurrence of the path transform and the first with a shape the
// other two do not have. The case study owning an entry is a path segment, so
// this parser returns three fields where the others return two, and a shared
// parser would have to be parameterized by segment count to cover all three.
// D-163 pre-committed the extraction to the third case; the third case is the
// one that does not fit it. The extraction moves to `posts` in T-29, which is
// `posts/<slug>.<locale>` and is the third *identical* occurrence (D-180).
// why: the project lives in the path rather than in frontmatter. A decision does
// not exist outside the case study it belongs to, so the two move, rename and get
// deleted as one unit — the ownership argument D-168 made for the cover. Neither
// form is validated by Zod, but choosing an existing directory fails less often
// than typing a free string, and `ls content/decisions/` answers which case
// studies have a Trail (D-179).
// why: the entry identifier is the slug and nothing else. `d-139` is the original
// `D-xx` in the file name, and a frontmatter field repeating it is the second
// source D-161 refused. `\d{2,}` rejects `d-9`: a missing leading zero publishes
// a cross-reference that points at nothing (D-184).
const DECISION_PATH = /^decisions\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(d-\d{2,})\.([^.]+)$/;

const parseDecisionPath = (
  path: string,
): null | { locale: ContentLocale; project: string; slug: string } => {
  const match = DECISION_PATH.exec(path);
  const project = match?.[1];
  const slug = match?.[2];
  const locale = match?.[3];

  if (
    project === undefined ||
    slug === undefined ||
    locale === undefined ||
    !isContentLocale(locale)
  )
    return null;

  return { locale, project, slug };
};

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
  // why: `assets` and `base` also equal the defaults and are declared for the
  // same reason `root` is — `s.image()` writes files into `assets` and emits
  // URLs under `base`, so a default that shifts in a minor would move the
  // written files and the emitted `src` together, in silence, with `.gitignore`
  // still pointing at the old path (D-168).
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
  },
  collections: {
    // why: prose that backs a route of its own (§5.2). Landing copy is not here —
    // it is fragmented into strings the layout animates separately and lives in
    // `messages/` (D-152). The extension is `.md` and the body still compiles
    // through `s.mdx()`; the two are not in tension. `s.mdx()` is a schema, not a
    // file format: it hands the body to the MDX compiler with the file path, whose
    // default `format: 'detect'` reads `.md` as markdown and disables JSX and ESM
    // while still emitting the function-body a component mapping can consume. The
    // restriction is the point — a page is prose and may not carry components
    // (D-142, D-147).
    pages: {
      name: 'Page',
      pattern: 'pages/*.md',
      schema: s
        .object({
          title: s.string().min(1).max(120),
          body: s.mdx(),
          path: s.path(),
        })
        .transform(({ path, ...fields }, ctx) => {
          const parsed = parsePagePath(path);

          if (parsed === null) {
            ctx.addIssue({
              code: 'custom',
              fatal: true,
              message: `Unreadable page path "${path}". Expected "pages/<kebab-slug>.<locale>.md" with locale in ${CONTENT_LOCALES.join(', ')}.`,
            });

            return z.NEVER;
          }

          return { ...fields, locale: parsed.locale, slug: parsed.slug };
        }),
    },
    // why: a case study is prose that backs a route of its own, exactly as a page
    // is, and it carries the fields §4.4 of design.md lists as slots — nothing
    // beyond them, in the order that document lists them. There is no `featured`
    // flag and no ordering field: §4.1.4 lists neither, `year` already orders the
    // index of §4.3, and inventing curation here would decide the Selected work
    // layout from a task that has no layout (D-172).
    // why: `role` and `kind` are free strings, not enums. Both are rendered as
    // text on a bilingual site, so an enum would force a translation table in
    // `messages/` for a vocabulary that currently has one value each, and §5.3
    // puts translated text in the document rather than in the catalog. A document
    // per locale already carries its own translation (D-172).
    projects: {
      name: 'Project',
      pattern: 'projects/*.md',
      schema: s
        .object({
          title: s.string().min(1).max(120),
          summary: s.string().min(1).max(200),
          year: s.number().int().min(2000).max(2100),
          role: s.string().min(1).max(80),
          kind: s.string().min(1).max(80),
          stack: s.array(s.string().min(1)).min(1),
          // why: both optional. A project may not be deployed and a repository
          // may be private — this one is neither, the next one may be both.
          liveUrl: s.string().url().optional(),
          repositoryUrl: s.string().url().optional(),
          // why: `s.image()` reads the file from disk relative to the document,
          // copies it into `output.assets` under a content hash and returns
          // `src`, `width`, `height` and `blurDataURL`. It is the only mechanism
          // in this project that produces intrinsic dimensions, which §10
          // requires of every `next/image`, and a broken path fails the build
          // instead of shipping a missing asset. The file is authored beside the
          // document because a case study and its cover are one unit — they move,
          // rename and get deleted together — while a path into `public/` is a
          // global namespace nothing validates (D-168, D-169).
          cover: s.image(),
          body: s.mdx(),
          path: s.path(),
        })
        .transform(({ path, ...fields }, ctx) => {
          const parsed = parseProjectPath(path);

          if (parsed === null) {
            ctx.addIssue({
              code: 'custom',
              fatal: true,
              message: `Unreadable project path "${path}". Expected "projects/<kebab-slug>.<locale>.md" with locale in ${CONTENT_LOCALES.join(', ')}.`,
            });

            return z.NEVER;
          }

          return { ...fields, locale: parsed.locale, slug: parsed.slug };
        }),
    },
    // why: a Trail entry is prose that backs no route of its own — it is rendered
    // inside the case study panel of §4.4 — so it carries the §5.4 minimum and
    // nothing else. No `order` field: whether the panel sorts by the `D-xx`
    // number or editorially is a decision of T-28, and a field no route reads is
    // a guess with a migration cost across every authored document. No `summary`
    // and no date: §2.3 lists neither (D-184).
    // why: `decisions/**/*.md` rather than `decisions/*/*.md`. The single-level
    // glob would silently skip a file dropped at `decisions/orphan.md`; the
    // recursive one picks it up and the parser fails the build carrying the path
    // it received. Loud over silent, which is the whole reason D-161 put the
    // diagnosis in the transform.
    decisions: {
      name: 'Decision',
      pattern: 'decisions/**/*.md',
      schema: s
        .object({
          title: s.string().min(1).max(120),
          body: s.mdx(),
          path: s.path(),
        })
        .transform(({ path, ...fields }, ctx) => {
          const parsed = parseDecisionPath(path);

          if (parsed === null) {
            ctx.addIssue({
              code: 'custom',
              fatal: true,
              message: `Unreadable decision path "${path}". Expected "decisions/<project-slug>/d-<number>.<locale>.md" with locale in ${CONTENT_LOCALES.join(', ')}.`,
            });

            return z.NEVER;
          }

          return {
            ...fields,
            locale: parsed.locale,
            project: parsed.project,
            slug: parsed.slug,
          };
        }),
    },
  },
  // why: Zod validates one document at a time and cannot see another collection,
  // so the reference from an entry to its case study has no schema-level check.
  // `prepare` is the only hook handed every collection, and it runs after the
  // build and before the output is written, so aborting here leaves no stale
  // `.velite` behind for the next command to read.
  // why: the pair `(project, locale)` is checked, not the slug alone. An entry in
  // a locale its case study does not exist in has no surface to appear on under
  // §6.4, which makes it invisible content — the one thing a curated Trail
  // cannot ship. The reverse direction is deliberately not checked: §4.4 says
  // only this site's Trail is complete, so a case study with no entries is
  // expected (D-181).
  // why: the message names `<project>/<slug>.<locale>` and not a file path —
  // `path` is consumed by the transform and is gone by the time this runs. The
  // file is `content/decisions/<project>/<slug>.<locale>.md` and reconstructs
  // from the three values.
  prepare: ({ decisions, projects }) => {
    const authored = new Set(projects.map((project) => `${project.slug}.${project.locale}`));

    const orphans = decisions
      .filter((decision) => !authored.has(`${decision.project}.${decision.locale}`))
      .map((decision) => `${decision.project}/${decision.slug}.${decision.locale}`);

    if (orphans.length > 0) {
      throw new Error(
        `Trail entries reference a case study that does not exist in their locale: ${orphans.join(', ')}.`,
      );
    }
  },
  // why: only `mdx` is declared. `s.markdown()` has no consumer in this project
  // — every collection compiles through `s.mdx()` (D-142) — so a `markdown`
  // block would state an intent it never has, which is what D-134 and D-139
  // rejected twice. `remark-gfm` is absent for the opposite reason: Velite
  // defaults `gfm` to true and pushes the plugin itself, so declaring it here
  // applies it twice (D-141).
  mdx: {
    // why: the plugin resolves every link href against the content root and
    // reads it, to copy the target into `output.assets`. Body images do not need
    // it — §10 references them from `public/` and resolves them through the
    // component mapping — and frontmatter images reach `output.assets` through
    // `s.image()` instead, which is a schema and not this option. So it only
    // turns navigation hrefs into disk reads. Measured against the installed
    // source: `join(absoluteRoot, value)` collapses `/` back to the content root,
    // and reading a directory throws EISDIR, aborting the build; `/about`
    // resolves to a nonexistent path and is skipped. A link to the home page is
    // the most ordinary thing prose contains (D-149, D-169).
    copyLinkedFiles: false,
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
});
