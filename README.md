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

| Script         | What it does                                                             |
| -------------- | ------------------------------------------------------------------------ |
| `dev`          | Compiles content, then the development server on `http://localhost:3000` |
| `build`        | Compiles content, then the production build                              |
| `start`        | Serves the production build; requires `build` first                      |
| `lint`         | ESLint over the project; warnings fail the run                           |
| `typecheck`    | Compiles content, generates route types, then `tsc --noEmit`             |
| `format`       | Prettier over the repository, writing in place                           |
| `format:check` | Prettier over the repository, reporting only                             |

`lint`, `typecheck` and `build` are required status checks on `main`. Linting is not a
side effect of the build: `next build` stopped running it in Next.js 16, so it is
enforced by CI and by the `pre-commit` hook only. Formatting is enforced by the
`pre-commit` hook alone — there is no formatting job in CI.

`dev`, `build` and `typecheck` each run `velite build --clean --strict` first. Velite
reads `content/`, validates every file against its collection schema and emits typed
data into `.velite/`, which is generated, git-ignored and imported through the
`#site/content` alias — no markdown parser ever reaches the browser. `--strict` is what
makes a malformed document stop the build instead of reaching production; it is a
command-line flag rather than a `velite.config.ts` option because the config value is
never read when the CLI is the caller.

There is no watch mode in the scripts. A change under `content/` is picked up by
restarting `bun dev`, or by running `bun run velite --watch` in a second terminal —
without `--strict` there, so a half-written file pauses the rebuild instead of killing
the watcher.

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

## Internationalization

The site ships in English and Brazilian Portuguese. Every URL carries its locale
prefix, and a visible switcher preserves the current path across the change.

UI strings — button labels, `aria-label`s, navigation items — live in
`messages/<locale>.json` and are read through `next-intl`. Prose does not: it is
authored as markdown under `content/`, and that workflow is documented separately.

### Adding a locale

1. Add the tag to `locales` in `src/shared/config/i18n/routing.ts`. Leave
   `defaultLocale` alone unless the fallback for unidentified requests is meant to
   change.
2. Create `messages/<locale>.json` by copying `messages/en.json` and translating
   every value.
3. Register the catalog in the `catalogs` map of
   `src/shared/config/i18n/request.ts`. The import specifiers there are static on
   purpose: a missing catalog is a type error rather than a runtime one.
4. Add the tag to the `name` and `short` objects of `LocaleSwitcher` in **every**
   catalog, including the ones already translated — each locale names the others in
   its own language.
5. Run `bun run build`. The `[locale]` segment prerenders one route per locale, so
   an unregistered catalog fails there rather than in production.

Beyond two locales the switcher stops being a two-state button and needs a menu
primitive. See D-116 in [`docs/roadmap.md`](./docs/roadmap.md).

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
