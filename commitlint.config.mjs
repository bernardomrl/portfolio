/**
 * Enforces project.md §4.1 as far as a rule can express it. Imperative mood and
 * the proper-name exception are left to the author and to review.
 */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // §4.1 allows nine types; the preset also ships `revert` and `test`.
    // `git revert` still passes — commitlint's default ignores match the header
    // Git generates for it.
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'perf', 'style', 'build', 'ci'],
    ],
    // §4.1 is Conventional Commits without scopes.
    'scope-empty': [2, 'always'],
  },
};

export default config;
