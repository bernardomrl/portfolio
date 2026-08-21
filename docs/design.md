# Design

Normative source for what this site contains. `architecture.md` governs how the code is
organized; this file governs what exists on screen, what each route holds, where each
piece of text comes from, and how the site moves. Where the two touch — the prose versus
UI string division of §5.3 — `architecture.md` is authoritative and this file references
it.

---

## How to read this file

- **Route** = a URL that renders a document. **Surface** = something that exists across
  routes without a URL of its own.
- Every piece of text names its **origin**: `messages` for UI strings under
  `messages/<locale>.json`, or a Velite collection under `content/`.
- **Tier** marks the motion cost of an effect. See §6.1.
- A section listed here is a commitment. Removing one requires an entry in the Decisions
  Log, the same as removing a rule.

---

## 1. What this site is

A personal portfolio and blog for a front-end engineer repositioning in the market. It
is read by two audiences with different patience: a hiring manager scanning for evidence
in ninety seconds, and an engineer who opens the repository.

The site is the primary artifact. A generic template argues against its own author, so
the visual and interaction craft is not decoration — it is the claim being made.

Three constraints shape every decision below: it is statically generated with no
backend, it ships in `en` and `pt-BR`, and it must remain fast enough that the
performance claim survives inspection.

---

## 2. The three signature moments

These are what the site is remembered for. Everything else is competent and quiet.

### 2.1 The Console

The primary navigation is a command surface, not a menu. It opens with `Cmd/Ctrl+K` from
anywhere and from a trigger in the header. It handles route navigation, content search,
theme, locale, contact, and external links.

The header therefore carries a wordmark, the Console trigger, and nothing else. There is
no horizontal nav and no hamburger.

The Console is the only surface that carries sound.

Rationale: a site built by someone who thinks in systems should navigate like a system.
In the reference sites this pattern is an accessory; here it is the argument.

### 2.2 The Field

The hero background is a WebGL fragment shader rendering a structural mesh — grid,
nodes, connecting lines — that breathes slowly on its own and deforms locally around the
pointer.

Structural, deliberately: not aurora, not liquid gradient, not iridescence. Those read as
generic shader backgrounds. A mesh under load is the subject of the portfolio drawn as
its own wallpaper.

It is a progressive enhancement and never blocks the first paint. See §6.5.

### 2.3 The Trail

The repository carries a Decisions Log of ~150 entries, each with the alternatives
considered and the reason each was rejected. That is direct evidence of how the author
reasons, and it is currently invisible to anyone who does not open a markdown file.

The Trail surfaces it in two places: a live count on the landing, and an inline panel
inside each case study showing the decisions behind that project.

It is **curated, not exhaustive**: five to eight decisions per case study, rewritten for
a reader rather than copied from the log, authored in both locales, each carrying its
original `D-xx` identifier as a cross-reference for anyone who opens the repository.

Rationale: every developer portfolio _asserts_ rigour. This one _exhibits the record_. It
is the one element on this site that cannot be reproduced in a weekend, because the
artifact behind it took months to accumulate.

---

## 3. Global surfaces

### 3.1 Header

Present on every route, in normal flow, aligned to the same measure as the content and
the footer. There is no band, no bottom border and no fixed positioning: the header
scrolls away with the document.

| Slot            | Origin     | Notes                                                                |
| --------------- | ---------- | -------------------------------------------------------------------- |
| Wordmark        | —          | Links to `/` in the current locale. Display face; carries §7.13      |
| Locale switcher | `messages` | The target language in full, the two-letter code below `sm`          |
| Theme control   | `messages` | Label carries the current mode — `THEME[L]`, `[D]`, `[A]`            |
| Console trigger | `messages` | Labelled with the name of the surface, not with one of its functions |

The three controls are set in the mono face and share one gesture. A skip link is the
first focusable element: invisible until focused, positioned absolutely so it displaces
nothing.

### 3.2 The Console

An overlay, not a route. It never changes the URL and is dismissible with `Escape`, with
an overlay click, and with a visible close control in the footer. Focus is trapped while
open and returns to the trigger on close. The `⌘K` hint is shown inside the overlay on
pointer devices, not on the trigger.

**One surface, one mechanic.** Every panel is a filterable list, and nothing is pinned
outside it: a control that is neither navigable nor filterable occupies the most valuable
space on the surface and is reachable only by someone already looking at it, while an
entry is reachable by typing its name (D-231).

**Panels are a stack.** `Escape` and the back control both mean the layer above, and the
overlay closes only from the root. Typing does not push a panel — a query narrows the
current list in place, which is filtering and not navigation (D-232).

**Root.** A search field above a grouped list: Pages, Preferences, Connect, Legal.
Activating a page entry closes the overlay and navigates, whether or not the destination
differs from the current route. Cross-collection results extend this list under a query
rather than replacing it, and are owned by T-52.

**Theme and Locale.** Each lists every state, including the current one, marked. A list
that omits the current state cannot mark it, which is why these are panels and not entries
that act directly. A locale change unmounts the overlay, so the panel to restore is carried
in `sessionStorage` and the overlay reopens on it (D-236).

**Reach out.** Reached from the Connect group and from every contact call to action on the
site. Copy the address, book a call, or open a profile. There is no message form: the site
has no backend, and a form that cannot send is worse than no form. The scheduling
destination is a link and never an embed — a third-party iframe on a static page costs
Lighthouse, control, and a privacy disclosure.

**Footer.** Present on every panel. Carries the close control, which reads Back above the
root, the `Enter` hint, and the `⌘K` hint. Both hints are hidden on a coarse pointer, where
neither key exists. It is also where a completed action reports itself — the clipboard write
leaves no trace on screen and is the one action that needs saying (D-237).

| Slot                                    | Origin                                    |
| --------------------------------------- | ----------------------------------------- |
| Panel titles, group labels, placeholder | `messages`                                |
| Footer hints, close and back labels     | `messages`                                |
| Page entries                            | `messages` for labels, routing for hrefs  |
| Preference entries                      | `messages`                                |
| Connect and Legal entries               | `shared/config/links.config.ts`           |
| Post and project results                | `posts` and `projects` collections (T-52) |

### 3.3 Footer

Present on every route. The mark beside the wordmark, a short line of prose, three link
columns, copyright, and the sound toggle. The mark is bare and takes the colour of the
text around it; the plate belongs to the application icon, which sits on a surface this
site does not control (D-241).

| Slot                            | Origin                                |
| ------------------------------- | ------------------------------------- |
| Mark                            | Component — §10, in `currentColor`    |
| Tagline                         | `messages`                            |
| Column headings and link labels | `messages`                            |
| Copyright                       | `messages`, with an interpolated year |

### 3.4 Theme and locale

Dark and light are both first-class; neither is a filter of the other. The locale
switcher preserves the current path. Both are also reachable from the Console, as entries
of the Preferences group leading to a panel that lists every state, rather than as pinned
controls (D-231).

---

## 4. Routes

### 4.1 Landing — `/[locale]`

Single page with anchored sections. Sections have no URLs of their own; the Console is
the real navigation. This resolves O-01 in favour of option (a).

**4.1.1 Hero — The Field**

| Slot             | Origin     | Notes                                        |
| ---------------- | ---------- | -------------------------------------------- |
| Eyebrow          | `messages` | Role, short                                  |
| Headline         | `messages` | Array of lines; each line is a separate slot |
| Meta line        | `messages` | Location and years, monospaced               |
| Primary action   | `messages` | Opens the Console at the Reach out panel     |
| Secondary action | `messages` | Anchors to selected work                     |

**4.1.2 Status strip**

Four columns immediately under the hero. Dense, scannable, factual.

| Column    | Content                      | Origin     |
| --------- | ---------------------------- | ---------- |
| Now       | Current role and company     | `messages` |
| Building  | Current project and one line | `messages` |
| Writing   | Latest post title and date   | `posts`    |
| Reach out | Action opening the Console   | `messages` |

**4.1.3 Evidence — the public face of The Trail**

A bento grid of tiles. The rule separating this from the pattern it borrows: every tile
carries a **measurement or an artifact**, never an adjective. No tile says "clean code".

| Tile         | Content                                     | Origin                                   |
| ------------ | ------------------------------------------- | ---------------------------------------- |
| Decisions    | Live count, linking into the Trail          | `decisions`                              |
| Performance  | Current Lighthouse figures, dated           | `messages`, updated by hand at each pass |
| Pipeline     | The gates every change passes               | `messages`                               |
| Stack        | The real dependency list of this repository | `messages`                               |
| Availability | Timezone, working hours, current status     | `messages`                               |
| Writing      | Post count and a link to the blog           | `posts`                                  |

**4.1.4 Selected work**

The text column is `position: sticky`; the image column scrolls past it. As each project
enters, the fixed text swaps: the outgoing text leaves quickly, the incoming enters, and
the container width animates subtly between them.

The layout is designed **from two projects upward**. The sticky swap engages from the
second item; it is not a layout that needs four to read correctly.

| Slot                                             | Origin     |
| ------------------------------------------------ | ---------- |
| Section eyebrow and heading                      | `messages` |
| Project title, year, kind, summary, stack, cover | `projects` |
| Link to the full index                           | `messages` |

**4.1.5 Writing**

Three most recent posts, as cards with cover, title, excerpt, reading time and date.

| Slot                        | Origin     |
| --------------------------- | ---------- |
| Section eyebrow and heading | `messages` |
| Post fields                 | `posts`    |

**4.1.6 Closing call to action**

Full-width, high contrast, one line of intent, one action that opens the Console at the
Reach out panel. The same gesture as the hero action, deliberately — one contact surface
for the whole site.

Present at the end of every route except posts. See §4.6.

### 4.2 About — `/[locale]/about`

A route, not a landing section: it holds prose that stands on its own.

| Slot                                               | Origin                                                                      |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| Eyebrow                                            | `messages`                                                                  |
| Headline                                           | `messages`                                                                  |
| Body — several paragraphs, with links and emphasis | `pages`, `about`                                                            |
| Side visual                                        | A single professional portrait in a sticky frame, treated with theme tokens |
| Experience list                                    | See O-06                                                                    |
| Social links                                       | `messages`                                                                  |

The portrait is one image, not a carousel and not a stack. One good photograph beats
four mediocre ones, and a gallery of travel and mirror shots would exist to fill a
pattern that is not this site's.

### 4.3 Projects index — `/[locale]/projects`

Every project, most recent first. No filtering: filtering needs state, state needs a
client component, and the list is short enough that the control would be interface for
its own sake.

| Slot                         | Origin     |
| ---------------------------- | ---------- |
| Page heading and description | `messages` |
| Project cards                | `projects` |

Locale rule: a project is listed only in the locales it exists in. §6.4 of
`architecture.md`. No fallback, no partial translation.

### 4.4 Project detail — `/[locale]/projects/[slug]`

| Section    | Slots                                          | Origin                    |
| ---------- | ---------------------------------------------- | ------------------------- |
| Header     | Title, year, role, kind, one-line summary      | `projects`                |
| Meta       | Stack, live link, repository link              | `projects`                |
| Cover      | Image with dimensions                          | `projects`                |
| Case study | Long-form prose with headings, code and images | `projects`, compiled body |
| The Trail  | The decisions behind this project              | `decisions`               |
| Next       | Link to the next project                       | Derived                   |

This site is itself the first case study, and the only one where the Trail is complete.
The previous portfolio is the second, written honestly about what it was and why it was
replaced.

### 4.5 Blog index — `/[locale]/blog`

| Slot                                                  | Origin     |
| ----------------------------------------------------- | ---------- |
| Page heading and description                          | `messages` |
| Post cards: cover, title, excerpt, reading time, date | `posts`    |

Same locale rule as §4.3.

### 4.6 Post — `/[locale]/blog/[slug]`

| Section | Slots                           | Origin                 |
| ------- | ------------------------------- | ---------------------- |
| Header  | Title, date, reading time, tags | `posts`                |
| Body    | Prose, code blocks, images      | `posts`, compiled body |
| Footer  | Previous and next post          | Derived                |

Reading measure is constrained; this is the one route optimized for reading rather than
for looking. The closing call to action of §4.1.6 is **absent** here — a reader who
finished an article gets the next article, not a pitch.

### 4.7 Not found — `/[locale]/*`

Heading, one line of explanation, a link home, and the Console trigger. Nothing else.

---

## 5. Where text comes from

| Route                          | `messages`                     | Collections                      |
| ------------------------------ | ------------------------------ | -------------------------------- |
| Header, footer, Console chrome | All                            | —                                |
| Landing                        | Every headline, label and tile | `posts`, `projects`, `decisions` |
| About                          | Eyebrow, headline, labels      | `pages`                          |
| Projects index                 | Heading, description           | `projects`                       |
| Project detail                 | Field labels, section headings | `projects`, `decisions`          |
| Blog index                     | Heading, description           | `posts`                          |
| Post                           | Field labels                   | `posts`                          |
| Not found                      | All                            | —                                |

Collections: `pages`, `projects`, `posts`, `decisions`.

The rule producing this table is §5.3 of `architecture.md` and nothing else. Text with
paragraphs, links, emphasis or structure is prose and lives in `content/`. Text whose
removal breaks the layout is a UI string and lives in `messages/`.

---

## 6. Motion

### 6.1 Tiers

| Tier | Means                          | Cost                                                                               |
| ---- | ------------------------------ | ---------------------------------------------------------------------------------- |
| 1    | CSS only                       | Free — compositor, no JavaScript, components stay on the server                    |
| 2    | CSS driven by a pointer ref    | One small client component per effect; writes a custom property, never React state |
| 3    | View Transitions API           | Native, no dependency                                                              |
| 4    | A JavaScript animation library | A dependency, plus a hydration island per animated element                         |
| 5    | WebGL                          | A render loop and continuous GPU work                                              |

Always use the lowest tier that produces the effect. **Tier 4 and above require a
Decisions Log entry** naming the mechanism the lower tiers could not express — exit
animation, layout animation, spring physics, interruptible sequence, or Firefox
fallback. "Smoother" is not a mechanism.

### 6.2 Scroll-driven animation

`animation-timeline` is unsupported in Firefox stable. Every Tier 1 scroll effect is
written inside `@supports (animation-timeline: view())` with the unanimated state visible
by default.

### 6.3 Reduced motion

Every animation declares its `prefers-reduced-motion` fallback. For Tier 2 the handler
is not attached. For Tier 5 the canvas is not mounted and its chunk is not loaded.

### 6.4 Touch

Tier 2 is pointer-only by definition. Every effect in §7 that depends on a pointer
declares its touch behaviour, and the answer is never "nothing happens where something
was needed".

### 6.5 The WebGL budget

The Field is bound by seven rules, all of which are conditions of it existing at all:

1. A static CSS gradient paints first and is what LCP measures. The canvas mounts after
   and cross-fades in.
2. Device pixel ratio is clamped.
3. The loop pauses when the canvas leaves the viewport and when the tab loses focus.
4. Pointer position is written to a ref and read by the render loop. It never passes
   through React state.
5. Not mounted under `prefers-reduced-motion`.
6. Not mounted below a viewport threshold. Mobile keeps the gradient.
7. The fragment shader has a declared complexity ceiling.

### 6.6 Sound

Four cues — open, close, move, confirm — on the Console only. Behind an explicit toggle,
defaulting to off, with the preference persisted. A single sprite, decoded once. Never
under `prefers-reduced-motion`.

An `AudioContext` cannot start before a user gesture, so no sound exists before the first
interaction regardless. This is a constraint of the platform, not a choice.

---

## 7. Interaction catalogue

Every named effect on this site, with where it belongs and where it does not. An effect
not listed here does not exist; adding one requires a Decisions Log entry.

The forbidden column is the load-bearing part. An effect applied everywhere stops being
a signal and becomes noise.

### 7.1 Magnetic pull

The target translates toward the pointer as it approaches, and springs back on exit.

|                         |                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tier**                | 2                                                                                                                                           |
| **Where**               | Small interactive targets only: primary actions, the Console trigger, icon buttons, card arrow affordances                                  |
| **Forbidden**           | Anything not clickable; anything larger than a button; images; text blocks; cards as a whole                                                |
| **Why forbidden there** | The pull is an affordance — it promises the target responds. On a large or inert element it reads as a trick, and it costs layout stability |
| **Touch**               | Not attached. The target keeps its pressed state                                                                                            |
| **Reduced motion**      | Not attached                                                                                                                                |

### 7.2 Counter-parallax

The element shifts a few pixels **opposite** to the pointer, giving depth without
implying interactivity.

|                    |                                                              |
| ------------------ | ------------------------------------------------------------ |
| **Tier**           | 2                                                            |
| **Where**          | The `/about` portrait; the hero foreground against The Field |
| **Forbidden**      | Anything clickable — it would contradict §7.1                |
| **Touch**          | Not attached                                                 |
| **Reduced motion** | Not attached                                                 |

### 7.3 Pointer-tracked border

A highlight follows the pointer along the border or surface of a bordered element.

|                    |                                                            |
| ------------------ | ---------------------------------------------------------- |
| **Tier**           | 2                                                          |
| **Where**          | Evidence tiles; project cards; post cards; Console entries |
| **Forbidden**      | Full-width sections; the footer                            |
| **Touch**          | Not attached                                               |
| **Reduced motion** | Static border retained                                     |

### 7.4 Masked reveal

Text enters from behind a mask, staggered per line or per word.

|                         |                                                                               |
| ----------------------- | ----------------------------------------------------------------------------- |
| **Tier**                | 1                                                                             |
| **Where**               | Hero headline, per word, on load. Section headings, per line, on scroll entry |
| **Forbidden**           | Body prose; anything inside a post; any text longer than two lines            |
| **Why forbidden there** | Revealing a paragraph word by word delays reading to perform                  |
| **Reduced motion**      | Text present, no animation                                                    |

### 7.5 Staggered entry

A group rises and fades as it enters the viewport, with a per-child delay.

|                    |                                                               |
| ------------------ | ------------------------------------------------------------- |
| **Tier**           | 1                                                             |
| **Where**          | Status strip; evidence tiles; card grids; `/about` paragraphs |
| **Forbidden**      | Post bodies                                                   |
| **Reduced motion** | Present, no animation                                         |

### 7.6 Sticky swap

A sticky text column whose content swaps as scroll-linked siblings pass it.

|                    |                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Tier**           | 1                                                                                        |
| **Where**          | Selected work, §4.1.4, only                                                              |
| **Fallback**       | Without `animation-timeline`, a plain stacked layout with each text beside its own image |
| **Reduced motion** | The stacked fallback                                                                     |

### 7.7 Shared-element transition

An element persists visually across a route change.

|                    |                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Tier**           | 3                                                                                      |
| **Where**          | Project card to project detail; post card to post                                      |
| **Forbidden**      | Locale changes — the whole document changes language and the continuity would be a lie |
| **Reduced motion** | Plain cross-fade                                                                       |

### 7.8 Reading progress

A thin indicator tracking scroll position.

|                    |                                                |
| ------------------ | ---------------------------------------------- |
| **Tier**           | 1                                              |
| **Where**          | Post routes only                               |
| **Forbidden**      | The landing, `/about`, index routes            |
| **Reduced motion** | Retained — it conveys position, not decoration |

### 7.9 The Field

See §2.2 and §6.5.

|                    |                                                              |
| ------------------ | ------------------------------------------------------------ |
| **Tier**           | 5                                                            |
| **Where**          | The hero of the landing, and nowhere else                    |
| **Forbidden**      | Every other route, every other section, the footer, any card |
| **Touch**          | Static gradient                                              |
| **Reduced motion** | Static gradient; canvas never mounted                        |

### 7.10 Console panel changes

The entering panel arrives with a short travel and a fade. The leaving panel is gone: a
panel change unmounts one subtree and mounts another, so there is no departure to animate.

|                    |                                                                  |
| ------------------ | ---------------------------------------------------------------- |
| **Tier**           | 1                                                                |
| **Where**          | The Console only, on every push and every pop                    |
| **Forbidden**      | Direction: a pop enters from the same side as a push (D-233)     |
| **Touch**          | Identical — the transition answers a state change, not a pointer |
| **Reduced motion** | Instant panel change, no transition                              |

### 7.11 Text decode

The label resolves out of random glyphs, character by character.

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| **Tier**           | 2                                                                  |
| **Where**          | Header control labels, on mount and whenever the label changes     |
| **Forbidden**      | Prose; headings; any label whose value never changes; the wordmark |
| **Touch**          | Identical — the trigger is the label, not the pointer              |
| **Reduced motion** | Not attached; the label is present                                 |

### 7.12 Hover flip

The label rolls out through the bottom while an identical face arrives from above,
staggered per letter and settling on a spring.

|                    |                                                                |
| ------------------ | -------------------------------------------------------------- |
| **Tier**           | 4 — spring physics                                             |
| **Where**          | Footer links only                                              |
| **Forbidden**      | The header; prose; headings; any label longer than three words |
| **Touch**          | Not attached                                                   |
| **Reduced motion** | Not attached                                                   |

### 7.13 Variable weight

Letters gain weight as the pointer passes over them, retuning the cut rather than scaling
the glyph.

|                    |                                                   |
| ------------------ | ------------------------------------------------- |
| **Tier**           | 2                                                 |
| **Where**          | The wordmark, and nowhere else                    |
| **Forbidden**      | Prose; headings; any text set in the sans or mono |
| **Touch**          | Not attached; the wordmark rests at 400           |
| **Reduced motion** | Not attached                                      |

### 7.14 Intro fade

The document fades in on the first view of a session.

|                    |                                                       |
| ------------------ | ----------------------------------------------------- |
| **Tier**           | 1                                                     |
| **Where**          | `body`, once per session                              |
| **Forbidden**      | Every subsequent navigation, including locale changes |
| **Reduced motion** | Not played; the document is present                   |

---

## 8. Typography

**Sans — Archivo.** Neutral grotesque, the application typeface. In a pairing this size
the sans is the one that should stay quiet, and it carries body copy and every interface
string.

**Display serif — Fraunces.** Variable, requested with the `opsz` axis alone so the
browser tracks optical size against font-size. `WONK` stays at its default of 1: the axis
is not requested, so the leaning n/m/h cannot be turned off, and that is the form the
prototype chose (D-188).

**Mono — IBM Plex Mono, 400, `latin`.** One weight, one subset. It carries eyebrows, meta
lines and numbers, and it is the family of every compiled code block under §10 of
`architecture.md`.

The mono also carries navigation and control labels: the footer column headings and the
three header controls. It is the register of the thing being named rather than of the
thing being said, and the footer already operated this way before the rule was written.

**The display face stops at large sizes.** It is legal on headlines and on any text set
large enough to read as titling, and it is forbidden on the eyebrow, the meta line,
captions, labels and any running text. Small factual text is mono; everything else is
Archivo. Measured at the T-47 prototype: the meta line set in Fraunces was materially
harder to read than the same line in mono, and the fix is not a second serif for small
sizes — it is one rule about where the serif ends (D-190).

Every family is SIL Open Font License, loaded through `next/font/google`. Abril Fatface
is rejected: a fat didone contradicts a structural direction (D-92). Instrument Serif is
rejected: it reads better than Fraunces at small sizes, which is a strength the rule above
makes irrelevant, and it buys no optical size axis for the sizes that matter.

---

## 9. Open design decisions

Questions about the site rather than about the order of work. They share the `O-xx`
namespace with `roadmap.md`. Resolving one produces a numbered entry in the Decisions Log.

| #    | Question                                                                                                                                                                                                                                            | State                                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| O-06 | Whether `/about` carries an experience list, and whether it is frontmatter or prose                                                                                                                                                                 | Open                                                   |
| O-09 | Whether the Console is reachable on touch without the virtual keyboard consuming the panel — (a) whether the search field takes focus on open, owned by T-40, and (b) whether the header carries route navigation beyond the trigger, owned by T-22 | Resolved: (b) by D-200, (a) by D-235                   |
| O-10 | Whether an intro sequence covers the first load — it only has a wait to cover once The Field and the hero exist, and if it lands it owns the session gate that §7.14 holds today                                                                    | Open; owned by whichever of T-23 and T-41 lands second |

---

## 10. The mark

A four-by-four grid of squares whose opacity falls along the anti-diagonal — the corner
solid, then a deliberate empty band, then four decreasing steps. It is structural in the
same sense §2.2 is, and it is not a letterform: the display face carries the wordmark and
the mark carries nothing the wordmark already says.

It ships in two dresses. As an application icon it sits on a white plate with a rounded
corner and an inset, because a browser tab and an iOS home screen are surfaces this site
does not control. Everywhere inside the document it is bare and takes the colour of the
text around it.

This section is appended rather than inserted: every `§` reference in the repository is
positional, and renumbering §8 and §9 to open a slot would invalidate all of them.
