# portfolio

Personal portfolio and blog. Live at
[next.bernardomrl.dev](https://next.bernardomrl.dev) — the apex `bernardomrl.dev` still
serves the previous portfolio until the cutover (D-72 and O-05 in
[`docs/roadmap.md`](./docs/roadmap.md)).

[![CI](https://github.com/bernardomrl/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/bernardomrl/portfolio/actions/workflows/ci.yml)

A statically generated site built with Next.js 16 (App Router), TypeScript in strict
mode, Tailwind CSS 4 and Bun. There is no backend: no database, no authentication, no
session and no write path. Every byte served is a static asset or the compiled output of
a file in this repository.

The full stack, the layer architecture and the rules that govern both live in
[`docs/architecture.md`](./docs/architecture.md).

## Prerequisites

- **Node.js 22.** `package.json#engines` pins the major (`22.x`), and both CI and Vercel
  resolve the build runtime from it — on Vercel it overrides the project's Node.js
  Version setting, and `next build` executes under Node rather than under Bun. Build on
  22 to reproduce CI and production.
- **Bun**, at the version pinned in `package.json#packageManager`. Bun is the package
  manager and the script runner.

## Local setup

```bash
git clone https://github.com/bernardomrl/portfolio.git
cd portfolio
bun install --frozen-lockfile
cp .env.example .env.local
```

`.env.example` ships a deliberately invalid placeholder, so `.env.local` has to be
edited before anything runs. For local development, set:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then start the development server:

```bash
bun dev
```

## Scripts

| Script         | What it does                                        |
| -------------- | --------------------------------------------------- |
| `dev`          | Development server on `http://localhost:3000`       |
| `build`        | Production build                                    |
| `start`        | Serves the production build; requires `build` first |
| `lint`         | ESLint over the project; warnings fail the run      |
| `typecheck`    | Generated route types, then `tsc --noEmit`          |
| `format`       | Prettier over the repository, writing in place      |
| `format:check` | Prettier over the repository, reporting only        |

`lint`, `typecheck` and `build` are required status checks on `main`. Linting is not a
side effect of the build: `next build` stopped running it in Next.js 16, so it is
enforced by CI and by the `pre-commit` hook only. Formatting is enforced by the
`pre-commit` hook alone — there is no formatting job in CI.

## Environment variables

Every variable is public and prefixed `NEXT_PUBLIC_`. They are read exclusively through
`src/shared/config/browser-env.ts`, which validates them at import time and fails fast.
Never read `process.env` anywhere else.

| Key                    | Required | Local                   | Preview and production                                  |
| ---------------------- | -------- | ----------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Yes      | `http://localhost:3000` | `https://next.bernardomrl.dev`, in the Vercel dashboard |

`NEXT_PUBLIC_SITE_URL` has no default and no development fallback, on purpose. A default
would let a wrong host render successfully while every canonical URL, `hreflang`
alternate, sitemap entry and Open Graph image pointed somewhere else — a failure with no
symptom.

## Architecture

- [`docs/architecture.md`](./docs/architecture.md) — normative rules for code: the
  Feature-Sliced Design layers and their import hierarchy, the build-time content layer,
  internationalization, rendering model, naming and TypeScript strictness.
- [`docs/roadmap.md`](./docs/roadmap.md) — scope, execution order, the Definition of
  Done every change is held to, and the decisions log.

## License

The code in this repository is licensed under the MIT License. See
[`LICENSE`](./LICENSE).

The written content of the site — posts, case studies and section copy, authored under
`content/` — is **not** covered by that grant. It is © 2026 Bernardo Antonio Meirelles Lima, all
rights reserved, and is published here to be read, not to be redistributed.
