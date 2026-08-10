/**
 * Kept deliberately fast — heavy verification belongs to CI (project.md §5).
 *
 * ESLint is invoked directly rather than through the `lint` script: that script
 * lints the whole project, and `--no-warn-ignored` is required because ESLint 9
 * warns on an explicitly passed file matching `globalIgnores`, which
 * `--max-warnings 0` turns into a blocked commit.
 *
 * ESLint runs before Prettier so that formatting always has the last word.
 */
const config = {
  '*.{ts,tsx,mjs}': ['eslint --fix --max-warnings 0 --no-warn-ignored', 'prettier --write'],
  '*.{json,md,mdx,css}': 'prettier --write',
};

export default config;
