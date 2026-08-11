# Architecture

Normative rules for **code and architecture** only.

> **Out of scope for this document:** infrastructure, deployment, CI/CD, Git workflow,
> branching, commits, environments and repository operations.

---

## 1. Stack

| Concern                   | Choice                                           |
| ------------------------- | ------------------------------------------------ |
| Framework                 | Next.js 16 (App Router)                          |
| Runtime / package manager | Bun                                              |
| Language                  | TypeScript 5, `strict: true`                     |
| Styling                   | Tailwind CSS 4                                   |
| Component base            | Shadcn on **Base UI** (not Radix)                |
| Theme                     | `next-themes`                                    |
| Icons                     | `@tabler/icons-react`                            |
| Internationalization      | `next-intl`                                      |
| Content layer             | **Velite** — build-time, Zod-validated           |
| Markdown extensions       | `remark-gfm`                                     |
| Syntax highlighting       | `shiki` via `rehype-pretty-code`, at build time  |
| Validation                | Zod v4                                           |
| Open Graph images         | `next/og`                                        |
| Bundler                   | Turbopack (default in Next.js 16, dev and build) |
| React Compiler            | Not enabled (see `roadmap.md`, D-16)             |

There is **no backend**. No database, no authentication, no session, no user data, no
write path. Every byte the site serves is either a static asset or the compiled output
of a file in `content/`.

---

## 2. Architecture — Feature-Sliced Design

### 2.1 Layers

Top to bottom. **A module may only import from layers strictly below it.**

| Layer        | Responsibility                                                                                                                                      | May import from                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `app/`       | Next.js routing only: `page.tsx`, `layout.tsx`, `error.tsx`, `sitemap.ts`, route handlers. No UI, no business logic.                                | all layers below                 |
| `bootstrap/` | One-off global configuration and providers (theme, analytics, intl provider). Replaces the classic FSD `app` layer to avoid colliding with Next.js. | `widgets` and below              |
| `widgets/`   | Composition of features and entities into self-contained page blocks. The only legal place for cross-feature communication.                         | `features`, `entities`, `shared` |
| `features/`  | Isolated user actions and interactions.                                                                                                             | `entities`, `shared`             |
| `entities/`  | Core domain objects — here, the content model — with their derived types and read helpers.                                                          | `shared`                         |
| `shared/`    | Design system, base UI, content access, pure utilities. **No domain knowledge.**                                                                    | nothing                          |

### 2.2 On-demand materialization

`entities/` and `features/` exist in the layer hierarchy and in the linter configuration
from day zero, but **are not scaffolded as empty directories**. A slice is created when a
concrete case requires it, never in anticipation.

The reason is specific to this project. A portfolio has very few genuine domain objects
and very few genuine user actions; most of it is composition of content into blocks,
which is what `widgets/` is for. Pre-creating `features/hero`, `features/about` and
`features/contact` would produce slices that are, in substance, UI — architecture as
decoration rather than as constraint. Before creating the first slice in either layer,
justify why the code does not belong in `widgets/` or `shared/`.

`bootstrap/`, `widgets/` and `shared/` are on-demand in a weaker sense. They are
planned, they require no justification, and they simply appear when the task that
writes their first file lands, because an empty directory is never committed.

This is a narrower application of the same layer matrix, not a different architecture.
Rules 1–5 below apply unchanged.

### 2.3 Hard import rules

1. **Downward only.** Never import from a layer above.
2. **No sibling imports.** A slice must never import another slice of the same layer.
   A feature importing a feature is forbidden — compose them in `widgets/`.
3. **`bootstrap/` is top-level.** Only `app/` may import from it.
4. **Public API only.** Never import an internal segment of another slice.
   `import { x } from "@/features/locale-switcher"` ✅ ·
   `import { x } from "@/features/locale-switcher/model/schema"` ❌
   `shared/` is exempt: it holds segments, not slices, so `@/shared/ui/button` and
   `@/shared/content` are the intended import form, not a violation.
5. Rules 1–4 are enforced by `eslint-plugin-boundaries` at severity `error`, through the
   `boundaries/dependencies` policy list. Three companion rules close the gaps the policy
   list leaves open: `boundaries/no-unknown-files` requires every file under `src/` to
   belong to a layer or to a declared exception, `boundaries/no-unknown-dependencies`
   reports an import whose target belongs to no layer, and
   `boundaries/no-ignored-dependencies` guards the empty `boundaries/ignore` list against
   a future entry. An unresolved `@/` specifier is treated as a local unknown rather than
   an external module, so a broken path alias fails the lint job instead of disabling the
   rules in silence. Since Next.js 16 `next build` no longer lints, a boundary violation
   fails the `lint` job, never the build.

Imports resolve through a single alias, `@/*` → `./src/*`. There is no per-layer alias
and no `baseUrl`: the layer must stay visible in the import path, and a bare specifier
must never resolve from the source root.

Import order encodes the same hierarchy. `perfectionist/sort-imports` groups imports by
layer, highest first, mirroring the table in §2.1, so the first layer group in a file's
import block names the highest layer that file depends on — a downward-only violation is
visible in the diff before the linter reports it. Custom groups are the mechanism: the
plugin's own internal-import heuristic collapses every `@/` specifier into a single
group, which would hide exactly what this ordering exists to expose.

The Velite output is imported from the generated alias `#site/content`, mapped to
`./.velite`. It is treated as an external package, not as a layer — see §5.4.

### 2.4 Slice anatomy

```
src/features/locale-switcher/
├── ui/            # components
├── model/         # schemas, types, client-side logic
├── lib/           # slice-local pure helpers
├── config/        # slice-local constants
└── index.ts       # public API — the ONLY legal entry point
```

`index.ts` is mandatory in every slice and exports the minimum surface required.
An export that nothing outside the slice consumes must not be in `index.ts`.

There is no `api/` segment in this project's slices. The segment exists in FSD for
communication with a backend, and there is none.

### 2.5 Architectural exceptions

Two files live outside the layer hierarchy because the framework requires it.
They are exceptions, not precedents:

| File           | Reason                                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/**`   | Next.js file-system routing. Kept intentionally thin.                                                                                                 |
| `src/proxy.ts` | Next.js 16 renamed `middleware.ts` to `proxy.ts` and requires it at the root of `src/`. It hosts the `next-intl` locale negotiation and nothing else. |

Both are classified explicitly in the boundaries configuration — `src/app/**` as an
element, `src/proxy.ts` as a file category. Neither is added to `boundaries/ignore`:
the exceptions are exactly where a silent rule gap is most expensive.

---

## 3. Naming conventions

Files are **kebab-case**, always. Suffixes are **singular**.

| Suffix          | Content                                                       |
| --------------- | ------------------------------------------------------------- |
| `.schema.ts`    | Zod schemas                                                   |
| `.query.ts`     | Content read helpers (filter, sort, find by slug)             |
| `use-[name].ts` | Custom React hooks                                            |
| `.type.ts`      | TypeScript types and interfaces                               |
| `.config.ts`    | Static configuration objects                                  |
| `.util.ts`      | Pure functions                                                |
| _(no suffix)_   | Visual components — `project-card.tsx`, `locale-switcher.tsx` |

`src/shared/config/browser-env.ts` keeps the name §9 fixes for it and takes no
`.config.ts` suffix. The suffix marks a static configuration object; that module
is a validated read of the environment, performed once at import time.

Identifiers: `PascalCase` for components and types, `camelCase` for functions and
variables, `SCREAMING_SNAKE_CASE` for module-level constants.

Content files in `content/` are kebab-case slugs with a locale suffix:
`fsd-boundaries-in-next.en.mdx`, `fsd-boundaries-in-next.pt-BR.mdx`. The slug is
everything before the first dot and is shared across locales by definition.

---

## 4. Rendering model

- **React Server Components by default.**
- `"use client"` is allowed **only on tree leaves**: the theme toggle, the locale
  switcher, the copy-to-clipboard button, motion wrappers, components using hooks or
  browser APIs.
- `app/[locale]/page.tsx` **never awaits**. It renders the shell and mounts widgets. Data
  here is compiled content imported synchronously, so there is nothing to suspend on;
  the rule stands so that the page never becomes the place where work happens.
- Passing a server-only value into a client component is a boundary error — pass
  serialized data, never a module instance or a helper function.

The leaf rule constrains the module graph, not the render tree. Providers in
`bootstrap/` are its only exception: a provider carries `"use client"` and renders
`{children}`, and it is legal because it never imports what it wraps. A Server Component
that passes `children` as a prop renders that subtree on the server and hands the client
boundary an opaque node to place in a slot — what ships is the provider's own module, not
the tree below it. A provider that imports its subtree instead of receiving it converts
that subtree into client code, and is a boundary error under the same rule. A module that
only composes providers and forwards `children` carries no directive at all: the boundary
belongs to each provider file.

Every page in this project is statically generated. A page that cannot be statically
generated requires a decision entry in `roadmap.md` explaining why.

---

## 5. Content layer

### 5.1 The absolute rule

**All markdown is compiled at build time. No markdown parser ever reaches the browser.**

Velite reads `content/`, validates each file against a Zod schema, compiles the body to
MDX, and emits typed JavaScript into `.velite/`. The application imports data, not
documents. A runtime markdown renderer (`react-markdown`, `streamdown`, `marked`) is
forbidden — see D-19 in `roadmap.md` for the reasoning and for the single condition that
would reverse it.

### 5.2 Directory shape

```
content/
├── sections/         # prose blocks composed into the landing page
│   ├── hero.en.md
│   ├── hero.pt-BR.md
│   ├── about.en.md
│   └── about.pt-BR.md
├── projects/         # case studies
│   ├── greenfield.en.mdx
│   └── greenfield.pt-BR.mdx
└── posts/            # blog
    ├── some-post.en.mdx
    └── some-post.pt-BR.mdx
```

### 5.3 Prose versus UI strings

This division is normative and is the most common place to get it wrong.

| Kind of text                                                                         | Where it lives                            | Why                                                                                           |
| ------------------------------------------------------------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| Prose — anything with paragraphs, links, emphasis or structure                       | `content/`, as markdown                   | It is edited as writing, benefits from markdown, and must be changeable without touching code |
| UI strings — button labels, nav items, `aria-label`, form placeholders, date formats | `messages/<locale>.json`, via `next-intl` | It is interface, needs interpolation and pluralization, and has no structure to render        |

A heading that is part of the layout is a UI string. A heading inside a case study is
prose. When in doubt: **if removing it would break the layout, it is a UI string.**

### 5.4 Collections and typing

Each directory in `content/` is a Velite collection with an explicit Zod schema. Every
schema carries at minimum `title`, `slug`, `locale` and the compiled `body`. Frontmatter
that fails validation **fails the build** — a malformed post never reaches production.

Velite's generated types are the source of truth for content shapes. Domain types derive
from them; they are never re-declared by hand.

Access to `#site/content` is confined to `shared/content/`, which re-exports the raw
collections. Entities and widgets import from `shared/content/`, never from the generated
alias directly. This keeps a single seam to change if the content layer is ever replaced.

### 5.5 MDX pipeline

Configured once, in `velite.config.ts`:

- `remark-gfm` — tables, task lists, strikethrough, autolinks.
- `rehype-pretty-code` with `shiki` — syntax highlighting resolved at build time, emitted
  as HTML with inline styles. **Zero highlighting JavaScript ships to the client**, and
  there is no post-hydration colour flash.

MDX components (custom `<Callout>`, styled `<a>`, `next/image` wrappers) are registered
in a single mapping in `shared/ui/mdx/`. A content file may only use components from that
mapping — an unmapped component in an MDX file is a defect, not a feature.

---

## 6. Internationalization

### 6.1 Routing

Configured in `src/shared/config/i18n/routing.ts` via `defineRouting`:

- `locales: ["en", "pt-BR"]`
- `defaultLocale: "en"`
- `localePrefix: "always"`

`defaultLocale` is **not "the author's language"** — it is the fallback for a request
that could not be identified. Crawlers generally send no `accept-language` header and
therefore always resolve to it, which is why `en` is chosen: a Portuguese-speaking
visitor is matched correctly by header negotiation regardless.

With `localePrefix: "always"`, the bare apex domain is never a page. It is a redirect
issued by the proxy to `/en` or `/pt-BR`.

### 6.2 Locale negotiation

Handled entirely by `next-intl` in `src/proxy.ts`, in this priority order: a locale
prefix in the pathname, then the `NEXT_LOCALE` cookie, then the `accept-language` header.
Matching is best-fit, so `pt-PT` resolves to `pt-BR` without extra configuration.

Since `next-intl` 4 the cookie is written only after a manual locale switch, so **no code
may assume the cookie exists**. A first visit is header negotiation and nothing else.

`proxy.ts` performs locale negotiation and nothing else. It never reads content, never
branches on business rules, and never grows a second responsibility.

### 6.3 The locale switcher is mandatory

Automatic detection is a guess and it is wrong often enough to matter: corporate machines
forced to English, VPNs, and readers who simply prefer the other language. A visible,
keyboard-reachable locale switcher is a requirement of the design, not an enhancement.
It preserves the current pathname when switching.

### 6.4 Missing translations

Content is per-file and per-locale, and **a translated pair is not required**. A post
that exists only in `pt-BR` is listed only under `pt-BR`. Listings filter by the active
locale; they never fall back to another language silently, because a page that promises
Portuguese and delivers English is worse than a shorter list.

`hreflang` alternates are emitted only for locales in which the document actually exists.

---

## 7. Error handling

There is no write path, so there is no result contract to define. Errors fall into two
classes:

| Class                                                      | Handling                                         |
| ---------------------------------------------------------- | ------------------------------------------------ |
| Content that does not exist (unknown slug, unknown locale) | `notFound()` → the route group's `not-found.tsx` |
| Everything else (bug, unexpected throw)                    | `throw` → caught by `error.tsx`                  |

Malformed content is not a runtime class at all: Velite rejects it during the build.
This is the point of validating at build time, and it is why no defensive parsing of
frontmatter is allowed in application code.

---

## 8. State management

| State kind                       | Tool                                                 |
| -------------------------------- | ---------------------------------------------------- |
| Local UI state                   | `useState`                                           |
| Theme                            | The theme provider in `bootstrap/`                   |
| Active section / scroll position | Local state in the owning widget                     |
| Server state                     | Does not exist — content is compiled into the bundle |
| Global client state              | Avoided. No Zustand.                                 |

Complex `useReducer` logic requires justification. `useEffect` for data fetching is
forbidden; there is nothing to fetch.

---

## 9. Environment variables

A single fail-fast Zod-validated module:

| File             | Contents                    |
| ---------------- | --------------------------- |
| `browser-env.ts` | Only `NEXT_PUBLIC_*` values |

It lives in `src/shared/config/` and is imported as `@/shared/config/browser-env`.
`shared/` holds segments rather than slices, so §2.3 rule 4 does not apply and there is
no barrel to route through. Never read `process.env` directly anywhere else.

Next.js inlines `NEXT_PUBLIC_*` values by statically replacing literal
`process.env.NEXT_PUBLIC_X` member expressions in the source text. The module
therefore builds the object it validates as an object literal, with one literal
member expression per key. Passing `process.env` itself, destructuring it, or
indexing it with a variable is forbidden: none of those forms is inlined, so the
value resolves on the server, the build succeeds, and the browser gets
`undefined`.

Every key is required and carries no default (D-54). Setting the value is the
responsibility of each environment: `.env.local` locally, an `env:` block in CI,
the Vercel dashboard in Preview and Production.

`server-env.ts` does not exist in the MVP, because the MVP has no secret. The first
feature that introduces one must create it in the same pull request, starting with
`import "server-only"`, and importing it from a client component is a hard error.

---

## 10. UI and styling

- Shadcn + Base UI primitives live in `shared/ui/`. Treat generated components as
  vendored source: edit them to fit the design system, but keep the API stable.
- `cn()` (clsx + tailwind-merge) is mandatory for conditional class composition.
- Icons come from `@tabler/icons-react` and are always imported by name. A namespace
  import pulls the entire library into the bundle. No second icon set is introduced —
  `components.json` declares Tabler, and the CLI emits those imports on its own.
- Design tokens are CSS variables consumed by Tailwind. **No hardcoded hex values in
  components** — a portfolio is judged on visual coherence, and a stray colour is the
  fastest way to lose it.
- The global stylesheet lives in `shared/ui/styles/`, not in `app/`. `app/` is routing.
- Accessibility rests on Base UI primitives. Do not hand-roll dialogs, popovers, selects
  or menus.
- `next/image` is mandatory for every image, local or remote. Content images are
  referenced from `public/` and resolved through the MDX component mapping.
- Typography for compiled markdown is defined once, as a `prose` style in
  `shared/ui/styles/`. Content files never carry styling instructions.

---

## 11. Motion and accessibility

- Every animation is gated behind `prefers-reduced-motion`. This is not optional and it
  is not a polish task: motion without the guard is an accessibility defect.
- Smooth scrolling, parallax, and entrance animations all fall under the same guard.
- Animation never gates content: text must be readable and links must be reachable with
  animations disabled, with JavaScript failing to load, and with the page still
  hydrating.
- Focus is never removed. Any interaction that moves the viewport must also move focus to
  the destination, or keyboard users are silently left behind.
- Colour contrast targets WCAG AA at minimum, in both themes.

---

## 12. SEO and metadata

- Every route exports `generateMetadata`, localized. No route inherits a generic title.
- `metadataBase` derives from `NEXT_PUBLIC_SITE_URL`. No hostname is ever hardcoded.
- Every localized document declares `alternates.canonical` and `alternates.languages`
  restricted to the locales it exists in (§6.4).
- Open Graph images are generated with `next/og` per document, from the same frontmatter
  that renders the page. No hand-made image files per post.
- `sitemap.ts` and `robots.ts` live in `app/` and derive from the content collections, so
  a new post is indexed by the act of existing.
- While this site is served from `next.bernardomrl.dev`, every route declares
  `robots: { index: false, follow: false }`. `robots.txt` must **not** block crawling
  while the directive is in force: a crawler that cannot fetch the page never reads the
  tag, and the URL can be listed anyway. Removing the directive belongs to the apex
  cutover — O-05 in `roadmap.md` — and is not a cleanup task.

---

## 13. TypeScript rules

- `strict: true`, extended by five flags: `noUncheckedIndexedAccess`,
  `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch` and
  `noImplicitOverride`. The consequences below are normative, not stylistic.
- `any` is forbidden — use `unknown` plus a type guard, or generics.
- Indexed access yields `T | undefined`. Narrow it; do not silence it with `!`. This bites
  hardest on content lookups by slug, which is exactly where it should.
- Type-only imports and exports carry the `type` modifier. This matters most in a slice's
  `index.ts`: `export type { Project }` for types, plain `export` for values.
- `enum`, runtime `namespace`, parameter properties and `import =` are unavailable.
  Domain unions derive from Zod schemas (`z.infer`), never from a TypeScript `enum`.
- `satisfies` for configuration objects, to keep inference while enforcing shape.
- Prefer `type` for unions and derived shapes, `interface` for extensible object
  contracts.
- Non-null assertions (`!`) and unchecked `as` casts require a `// why:` comment.

---

## 14. Loading and error UX

- `loading.tsx` is **forbidden**: it blocks navigation at the route level.
- Use granular `<Suspense>` with skeletons co-located next to the component they replace.
  A skeleton must match the final layout to avoid layout shift.
- `error.tsx` and `not-found.tsx` exist per route group, both localized.

---

## 15. Comments and documentation

- **JSDoc is mandatory** on everything exported through a slice's `index.ts`.
- Comments explain **why** — a constraint, a workaround, a non-obvious trade-off. Never
  **what**; the syntax already says that.
- A comment that restates the code is deleted on review.

---

## 16. File size and complexity

Qualitative criterion: **Single Responsibility Principle**. No line limits. If a file
needs "and" to describe what it does, split it. If a component mixes content access,
composition and presentation, split it by segment.

---

## 17. Automated testing

Out of scope for the MVP, by explicit decision. **Do not generate test files, test
scripts or testing dependencies** unless the decision is reversed in `roadmap.md`.
Code must nonetheless remain testable: pure functions, no hidden singletons, content
access confined to one seam.
