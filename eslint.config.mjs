import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import boundaries from 'eslint-plugin-boundaries';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    name: 'portfolio/import-order',
    plugins: { perfectionist },
    rules: {
      // why: only sort-imports is enabled. The recommended preset also turns on
      // sort-jsx-props, which roadmap.md defers to the backlog until a custom
      // group can pin key, ref and className ahead of the alphabetical run.
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 1,
          // why: the group order mirrors the layer table in architecture.md §2.1,
          // highest layer first, so the first FSD group in an import block names
          // the highest layer the file depends on (D-10).
          groups: [
            ['side-effect-style', 'side-effect'],
            ['type-builtin', 'value-builtin'],
            ['type-external', 'value-external'],
            'content',
            'bootstrap',
            'widgets',
            'features',
            'entities',
            'shared',
            [
              'type-parent',
              'type-sibling',
              'type-index',
              'value-parent',
              'value-sibling',
              'value-index',
            ],
            'unknown',
          ],
          // why: custom groups outrank predefined ones, which is what separates
          // the layers — internalPattern would otherwise collapse every "@/" and
          // "#" import into a single value-internal group. Patterns for layers
          // that do not exist yet are inert until T-06 materializes them.
          customGroups: [
            { groupName: 'content', elementNamePattern: '^#site/content' },
            { groupName: 'bootstrap', elementNamePattern: '^@/bootstrap/.+' },
            { groupName: 'widgets', elementNamePattern: '^@/widgets/.+' },
            { groupName: 'features', elementNamePattern: '^@/features/.+' },
            { groupName: 'entities', elementNamePattern: '^@/entities/.+' },
            { groupName: 'shared', elementNamePattern: '^@/shared/.+' },
          ],
        },
      ],
    },
  },

  {
    name: 'portfolio/boundaries',
    // why: scoping by ESLint's own `files` keeps root tooling out of
    // classification without touching boundaries/ignore, which §2.5 reserves.
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      // why: absolute already; element patterns are relative to it, so a lint
      // run from another cwd must not silently reclassify the whole tree.
      'boundaries/root-path': import.meta.dirname,
      // why: partialMatch is disabled because the plugin's default right-to-left
      // matching would classify any nested folder named "shared" or "widgets" as
      // a layer. The layout here is fully known, so anchoring costs nothing (D-41).
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', partialMatch: false },
        { type: 'bootstrap', pattern: 'src/bootstrap', partialMatch: false },
        { type: 'widget', pattern: 'src/widgets/*', partialMatch: false },
        { type: 'feature', pattern: 'src/features/*', partialMatch: false },
        { type: 'entity', pattern: 'src/entities/*', partialMatch: false },
        // why: shared holds segments, not slices, so it is one element. Slicing it
        // would forbid @/shared/ui importing @/shared/lib, which §2.3 rule 4
        // declares legal (D-42).
        { type: 'shared', pattern: 'src/shared', partialMatch: false },
      ],
      // why: proxy.ts is framework-mandated and outside the hierarchy (§2.5).
      // A file category classifies it explicitly instead of hiding it in ignore.
      'boundaries/files': [{ pattern: 'src/proxy.ts', category: 'proxy' }],
      // why: by default an unresolvable "@/" import is flagged external and
      // skipped in silence — the exact failure this task exists to prevent.
      // Consequence: T-18 must classify "#site/content" explicitly (D-43).
      'boundaries/flag-as-external': { unresolvableAlias: false },
      // why: boundaries reads resolution from eslint-module-utils, which only
      // consumes this key. import/resolver-next is not read by this plugin.
      'import/resolver': {
        typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
      },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'app' } },
              allow: {
                to: [
                  { element: { type: ['bootstrap', 'shared'] } },
                  {
                    element: {
                      type: ['widget', 'feature', 'entity'],
                      fileInternalPath: 'index.ts',
                    },
                  },
                ],
              },
            },
            {
              from: { element: { type: 'bootstrap' } },
              allow: {
                to: [
                  { element: { type: 'shared' } },
                  {
                    element: {
                      type: ['widget', 'feature', 'entity'],
                      fileInternalPath: 'index.ts',
                    },
                  },
                ],
              },
            },
            {
              from: { element: { type: 'widget' } },
              allow: {
                to: [
                  { element: { type: 'shared' } },
                  {
                    element: {
                      type: ['feature', 'entity'],
                      fileInternalPath: 'index.ts',
                    },
                  },
                ],
              },
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: [
                  { element: { type: 'shared' } },
                  { element: { type: 'entity', fileInternalPath: 'index.ts' } },
                ],
              },
            },
            {
              from: { element: { type: 'entity' } },
              allow: { to: { element: { type: 'shared' } } },
            },
            // why: proxy.ts belongs to a file category, not an element (§2.5).
            // It negotiates locale and reads routing config from shared, nothing else.
            {
              from: { file: { categories: 'proxy' } },
              allow: { to: { element: { type: 'shared' } } },
            },
            // why: without this the public-API violation falls through to the
            // default and is reported as a layer violation, which is false —
            // the layer is legal and the entry point is not (§2.3 rule 4).
            {
              from: { element: { type: '*' } },
              disallow: {
                to: {
                  element: {
                    type: ['widget', 'feature', 'entity'],
                    fileInternalPath: '!index.ts',
                  },
                },
              },
              message:
                'A slice may only be imported through its public API. Import "{{to.element.path}}" instead of "{{to.element.fileInternalPath}}" inside it (architecture.md §2.3 rule 4).',
            },
          ],
        },
      ],
      // why: every file under src/ belongs to a layer or is a declared exception.
      // This is what keeps §2.5 from becoming a silent gap.
      'boundaries/no-unknown-files': 'error',
      // why: the dependencies rule skips unknown targets by default; this closes
      // that gap without enabling checkUnknownLocals and double-reporting.
      'boundaries/no-unknown-dependencies': 'error',
      // why: inert today (boundaries/ignore is empty) and a tripwire the day
      // someone adds an entry to it.
      'boundaries/no-ignored-dependencies': 'error',
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Velite output, generated and git-ignored (T-18):
    '.velite/**',
  ]),

  // why: must stay last — it only removes rules, and anything appended after it
  // could reintroduce a formatting rule that fights Prettier (D-09).
  eslintConfigPrettier,
]);

export default eslintConfig;
