---
title: 'This site'
kind: 'Personal project'
role: 'Design and engineering'
year: 2026
summary: 'A bilingual portfolio built as its own first case study, with every architectural decision recorded as it was taken.'
stack:
  - 'Next.js'
  - 'TypeScript'
  - 'Tailwind CSS'
  - 'Velite'
  - 'next-intl'
cover: './portfolio-cover.png'
liveUrl: 'https://next.bernardomrl.dev'
repositoryUrl: 'https://github.com/bernardomrl/portfolio'
---

Most developer portfolios assert rigour. This one keeps the receipt. Every non-obvious
choice made while building it was written down before the code that depended on it —
what was decided, why, and what was rejected — and the record is part of the repository
rather than a story told afterwards.

## Content is data, not markup

Nothing on this site parses markdown in the browser. Prose is validated against a schema
at build time, and a document that fails validation stops the build instead of reaching
production:

```ts
const parsed = parseProjectPath(path);

if (parsed === null) {
  ctx.addIssue({ code: 'custom', fatal: true, message: `Unreadable project path "${path}".` });
  return z.NEVER;
}
```

The `slug` and the locale are read from the file name rather than declared in
frontmatter, because a field that repeats the file name is a second source of truth that
can drift with no error and no symptom.

The architecture behind that choice, and the layers it sits in, are described in the
[repository documentation](https://github.com/bernardomrl/portfolio).
