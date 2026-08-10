import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
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
