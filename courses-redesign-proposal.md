# Long-form content: a redesign from first principles

> **Status — shipped in this PR (v6.4.0).** The core of this proposal is
> implemented for courses: the one-recursive-node model with optional `index.*`,
> a per-work `src/` → `dist/` source/output split kept under
> `client/src/app/courses/posts/` (uniform with blog/dictionaries, not a separate
> top-level `content/` tree), `transparent: true` in place of `_passthrough`,
> order prefixes stripped from
> URLs, positional numbering that fixes the title bug, a depth-limited sidebar
> with breadcrumbs, routable container (chapter) pages, the new `build-content.R`,
> and the `mathematical-statistics-with-R` migration. **Deferred** (called out in
> §12): folding blog/references/dictionaries into the one engine, per-part figure
> namespacing (figures stay flat per volume for now), and an old→new URL redirect
> map. One deliberate scoping choice vs. §4: the multi-volume *family* is kept
> `transparent` (so the volume's overview URL is preserved) rather than given its
> own landing page.

A response to `context.md`. Independent proposal; written after reading
`build-rmd.R`, `fetchContentMetadata.ts`, `contentTypes.ts`,
`createContentPage.tsx`, `ContentPost.tsx`, `ContentSideBar.tsx`,
`constants.server.ts`, the legacy `fetchCourseMetadata.ts`, and the live
`mathematical-statistics-with-R` tree.

---

## 0. TL;DR — the reframe

The current system feels hacky because **four different concerns are stacked
into one folder tree**: source (`.Rmd`), build output (`.mdx`), hand-edited
structure (`_meta.yaml`, `_series.mdx`), and the Next.js route tree (it all lives
under `app/`). Every pain point in the brief is a symptom of that stacking.

The proposal pulls those four apart and replaces the three special files with
**one optional convention**. Concretely:

| Decision | Today | Proposed |
|---|---|---|
| Node model | `series` / `chapter` / `part` — distinct, level-coded | One recursive **node**. A folder is a container, a file is a leaf. Identical at every depth. |
| Structural metadata | `_series.mdx` (root) **+** `_meta.yaml` (chapters) **+** `_passthrough` marker | **`index.*`** — one optional file per folder. Zero special files in the simple case. |
| Where metadata lives | In the **output** tree, hand-edited, never regenerated → lost on clean | In the **source** tree. Output becomes pure derivative. |
| Source vs output | Co-mingled in one folder (`src/` beside built `.mdx`) | Two parallel trees: `client/content/` (source) → `client/content-dist/` (output) |
| Output disposability | Impossible (deletes hand-edited metadata) | Total. `rm -rf` the dist tree, rebuild, lose nothing. |
| Ordering | `NN-` prefixes, **kept in the URL** | `NN-` prefixes as a **sort key, stripped from the URL** |
| Per-node title | `frontmatter.title` (which authors set to the *series* title) + `"Part N:"` label | The node's **own** title; numbering is a positional ornament rendered by the sidebar, never text in the title |
| "Hide from URL" | `_passthrough` marker file, only works at the top level | `transparent: true` in an `index.*`, works at **any** depth |
| Sidebar depth | unbounded | `maxDepth` knob, default **3**, active branch always expanded |
| Fetchers | two (current + orphaned legacy), four code paths | one recursive builder; legacy deleted |

The single idea that does most of the work: **every node — book, volume,
chapter, sub-chapter, leaf — is the same kind of thing, and a folder describes
itself with an optional `index.*` whose frontmatter is the same shape as a
leaf's.** That collapses the three special files into one, makes nesting truly
recursive, and moves the hand-edited metadata into source where it can't be
clobbered.

---

## 1. The core model: one recursive node

Forget "series / chapter / part." There is exactly one concept: a **node**.

- A **leaf node** is a single content file: `name.Rmd` or `name.mdx`. Its
  frontmatter carries its own title and metadata.
- A **container node** is a *folder*. Its children are the nodes inside it
  (more folders, more files). It optionally contains an `index.Rmd` / `index.mdx`
  that is *the folder's own page* — the title, the overview prose, the
  container-level settings.

That's the whole model. "Book," "volume," "chapter," "act," "movement" are just
container nodes at different depths; the machinery never names them. Nesting is
recursive with no ceiling because the builder only ever asks one question of a
path: *folder or file?*

Why this is the right primitive:

- It **collapses three special files into one**. `_series.mdx` was "the root
  folder's page." `_meta.yaml` was "a chapter folder's title/summary." Both are
  just *a folder describing itself* — which is exactly what `index.*` is. One
  filename, one frontmatter schema, used identically at every level.
- The `index.*` is **optional**. A folder with no `index.*` still works: its
  title defaults to its humanized slug, it's published, no summary. So the
  *minimum viable work* is **nested folders + content files and nothing else** —
  no `_meta.yaml`, no `_series.mdx`, no marker. You add an `index.*` only when
  you want a chapter summary, a preface, or a non-default setting. That is the
  strongest possible answer to "fewest special files."
- It makes the layout **self-evident**. A folder is a section of the book. A file
  is a page. If a folder has more inside it, it's a bigger section. There is
  nothing else to learn.

---

## 2. Folder & file layout

### 2.1 Source tree — the only thing the author touches

```
client/content/courses/                              # SOURCE ROOT for the "courses" section
└── mathematical-statistics-with-R/                  # a container node: the multi-volume work
    ├── index.mdx                                    # (optional) this work's landing page + metadata
    ├── data/                                         # shared datasets; ANY folder named data/ or assets/ is build-only, never a node
    │   ├── download_all.R
    │   └── classic/iris.csv …
    │
    ├── 01-foundations/                               # container node: Volume I.  "01-" = sort key (stripped from URL)
    │   ├── index.Rmd                                 # (optional) volume page — may run R (e.g. print the corpus); carries labels/cover
    │   │
    │   ├── 01-describing-data/                       # container node: a chapter
    │   │   ├── index.mdx                             # (optional) chapter page: title + summary  ← this replaces _meta.yaml, now in SOURCE
    │   │   ├── 01-types-and-central-tendency.Rmd     # leaf node: a part, authored in R Markdown
    │   │   ├── 02-spread-and-shape.Rmd               # leaf node
    │   │   └── 03-visualisation/                     # a part that itself has sub-parts → just make it a container. Recursion, no ceiling.
    │   │       ├── index.mdx                         #   sub-chapter overview
    │   │       ├── 01-histograms.Rmd                 #   sub-sub-part (R Markdown)
    │   │       └── 02-scatterplots.mdx               #   plain-MDX leaf → copied through, the R step is SKIPPED
    │   │
    │   └── 02-probability/
    │       ├── index.mdx
    │       ├── 01-sets-axioms-counting.Rmd
    │       └── 02-bayes-theorem.Rmd
    │
    └── 02-advanced/                                  # Volume II (same shape, authored later)
        └── …
```

Read it top to bottom and there is nothing to decode: folders are sections,
files are pages, `index.*` is "this folder's own page," `data/`/`assets/` are
ingredients. The deep `03-visualisation/` shows the recursion: a *part* became a
*container* simply by being a folder — no new concept, no level cap.

### 2.2 Output tree — generated, disposable, never in a URL

The build mirrors the source tree into a parallel **dist** tree, emitting `.mdx`
everywhere (knit from `.Rmd`, copied from `.mdx`):

```
client/content-dist/courses/                         # GENERATED. Safe to `rm -rf` and rebuild. Never appears in a URL.
└── mathematical-statistics-with-R/
    ├── index.mdx                                     # copied verbatim from source
    ├── 01-foundations/
    │   ├── index.mdx                                 # knit from index.Rmd
    │   ├── 01-describing-data/
    │   │   ├── index.mdx                             # copied from source index.mdx (frontmatter is source-of-truth)
    │   │   ├── 01-types-and-central-tendency.mdx     # knit from .Rmd
    │   │   ├── 02-spread-and-shape.mdx
    │   │   └── 03-visualisation/
    │   │       ├── index.mdx
    │   │       ├── 01-histograms.mdx
    │   │       └── 02-scatterplots.mdx               # copied (was already .mdx)
    │   └── 02-probability/ …
    └── …
```

`data/` is **not** copied — it's a build-time ingredient, not served content, so
it stays out of dist entirely. The dist tree is 100% derivative: every byte can
be regenerated from `client/content/`.

### 2.3 Figures — served from `public/`, namespaced per node

Next serves static files from `public/`, so figures must live there to get a
URL. Today they all land in one flat folder per work and rely on **globally
unique chunk names across the entire book** (`fig.path = ""` in `build-rmd.R`) —
a real latent collision bug at 61 parts. Fix: namespace the figure dir by the
node's path.

```
client/public/courses/mathematical-statistics-with-R/foundations/describing-data/types-and-central-tendency/
    compare-central-tendency-1.png
    histogram-shapes-1.png
```

Referenced in the built MDX as
`<Figure src="/courses/.../types-and-central-tendency/compare-central-tendency-1.png" … />`.
Chunk names now only need to be unique *within a part*, which is automatic. The
figure tree is **output**, so `--clean` wipes it alongside dist.

---

## 3. File conventions

### 3.1 How a node declares its title and metadata

Frontmatter — and the schema is **identical** whether it's a leaf file or a
container's `index.*`:

```yaml
---
title: 'Types of Data and Central Tendency'   # the node's OWN title. Never an ancestor's title.
summary: 'How we classify data and summarise its centre.'  # optional, used in cards/overviews
published: true                                # default true if omitted
tags: [statistics, data]                       # optional; leaves inherit ancestor tags if omitted
date: '2026-04-03'                             # optional
coverImage: 13                                 # optional; inherited from nearest ancestor if omitted
---
```

Container-only optional fields (ignored on leaves):

```yaml
transparent: true        # this folder contributes NO URL segment; its children promote up one level
label: 'Chapter'         # OPTIONAL display noun for THIS container's children ("Chapter 1 — …"); off by default
sidebarDepth: 4          # override the default sidebar depth for this work (root index only)
```

There is no separate `chapter:` / `part:` field and no top-level `labels` map.
A node names only itself; its place in the tree supplies all context.

### 3.2 Ordering

Numeric prefixes on file/folder names — `01-`, `02-`, and `NN-M_` are tolerated —
are the **sort key**. They are visible in `ls` (so reordering is a rename, and
order is obvious on disk) and **stripped to form the slug** (so they never reach
the URL). No `order:` frontmatter field, no central manifest list. The build
validates that siblings have distinct slugs after stripping and fails loudly on a
collision (e.g. `01-intro` + `02-intro` both → `intro`).

This is the Docusaurus convention and it resolves open question 6: keep prefixes
for authoring ergonomics, drop them from the reader-facing URL.

### 3.3 Container vs leaf

Decided purely by the filesystem: **a folder is a container, a file is a leaf.**
Promoting a leaf to a container is a two-step move a tired author can do without
documentation: make a folder named after it, drop the file inside as `index.*`,
add children. No flags, no type field.

### 3.4 Source format per file, and what the build does

Per-file, by extension:

- **`.Rmd`** → knit through R (runs code, emits figures/tables) → `.mdx` in dist.
  This is the default and primary format.
- **`.mdx`** → **copied through**, the R step skipped entirely → identical `.mdx`
  in dist.

`index.Rmd` vs `index.mdx` follows the same rule, so a chapter overview can run R
(`index.Rmd`) or be hand-written (`index.mdx`). The dist tree is uniformly
`.mdx`, so the fetcher and renderer never know or care which source produced a
page — exactly the "uniform served output, per-file source choice" the brief
asks for.

---

## 4. Source vs output, disposability, and the "overwrite" question

- **Source:** `client/content/<section>/…` — hand-edited, the single source of
  truth, holds `.Rmd`, `.mdx`, `index.*`, and `data/`.
- **Output:** `client/content-dist/<section>/…` (served pages) and
  `client/public/<section>/…` (figures) — both fully generated.

**Disposability is total.** Nothing hand-edited lives in output anymore. `rm -rf
client/content-dist/courses/<work>` and its figure dir, rebuild, and every page,
title, summary, and figure returns — because all of it derives from source.

**The "don't clobber my hand-edit on rebuild" requirement dissolves.** It existed
only because `_meta.yaml` lived in *output* and the build didn't regenerate it,
so a clean rebuild destroyed it. Once the chapter's title/summary is frontmatter
in a *source* `index.*`, a rebuild is the thing that *restores* it. There is
nothing in output to protect. The brief's requested "overwrite option" is
therefore reframed:

- Default: the build **always overwrites** dist from source (source is truth).
- `--force`: rebuild even when a dist `.mdx` is newer than its source (the
  existing freshness flag, kept).
- `--no-clobber` (optional safety): skip files already present in dist. Mostly
  unnecessary now; included only for the rare case of a deliberate manual dist
  tweak, which the architecture otherwise discourages.

This is a *deeper* fix than adding a flag: we removed the class of mistake the
flag was guarding against.

---

## 5. URL mapping

### 5.1 The exact rule (disk → reader URL)

Given a built node in the dist tree, the URL is computed by:

1. Drop the `client/content-dist/<section>/` prefix. (The output-folder name is
   the *base path* — it is structurally impossible for it to appear in the URL.)
2. If the node is a container's `index.mdx`, use its **folder's** segments (drop
   the `index` segment — a folder's index *is* the folder).
3. For each remaining segment, strip the leading ordering prefix
   (`^\d+([-_.]\d+)*[-_]`) and the `.mdx` extension → the **slug**.
4. Drop any segment whose node has `transparent: true`; its children keep their
   own slugs (promotion).
5. Join with `/`, prefix `/<section>`.

### 5.2 Worked examples

```
dist: …/courses/mathematical-statistics-with-R/01-foundations/01-describing-data/01-types-and-central-tendency.mdx
URL:  /courses/mathematical-statistics-with-R/foundations/describing-data/types-and-central-tendency

dist: …/courses/mathematical-statistics-with-R/01-foundations/index.mdx
URL:  /courses/mathematical-statistics-with-R/foundations

# if the work's index.mdx sets transparent: true (preserves today's shorter URLs):
URL:  /courses/foundations/describing-data/types-and-central-tendency
```

### 5.3 What happens to numeric prefixes

**Stripped.** They drive sort order only. This is a deliberate change from today
(where `01-describing-data` appears verbatim in the URL) and it shortens every
deep link — see §9 for how it's handled. Output machinery (`content-dist`, `src`,
`dist`, `index`) never appears because slugs are built from the *logical* tree,
and source/output are merely two physical encodings of that same logical tree.

---

## 6. Navigation

### 6.1 One recursive builder, one place titles are derived

Replace the current four code paths (`loadSeriesMetadata`, `loadContentMetadata`,
`buildHierarchyTree`, `buildFlatHierarchy`) and the orphaned
`fetchCourseMetadata.ts` with a single recursive function over the dist tree:

```
buildNode(path):
  if file (.mdx leaf):  read frontmatter → { slug, title, displayTitle, published, … , children: [] }
  if folder:            read index.* frontmatter (or defaults) → node
                        node.children = sortByPrefix(folder entries).map(buildNode)   // skip data/, assets/, dotfiles
                        node.transparent = frontmatter.transparent ?? false
```

A section is `buildNode(content-dist/<section>)` — a virtual root whose children
are the top-level works. Standalone articles are just leaves at that root;
multi-volume books are containers. One function, every level, no level-specific
code. Transparent nodes are spliced out (children promoted) when slugs/URLs are
computed.

### 6.2 The title rule that makes the bug impossible

The current sidebar shows `Part 1: Mathematical Statistics with R I: Foundations`
repeated down the book because (a) every part's `title:` frontmatter was set to
the *series* title, and (b) a `labels` map prefixes `"Part N:"`. Both causes are
removed:

- **`displayTitle = node.title`** — the node's *own* frontmatter title (or its
  humanized slug). Nothing is concatenated into it.
- **Numbering is positional and lives in the view.** `1`, `1.2`, `1.2.3` are
  computed from a node's index among its siblings and rendered by the sidebar /
  breadcrumb as a separate visual ornament — never spliced into the title string.
- **No node ever stores an ancestor's title.** Context comes from the tree
  (breadcrumbs), not from copying the book title into every page.
- The optional per-container `label` ("Chapter", "Act", "Movement") is composed
  *at render time* for that container's children if the author opts in; the
  stored `title` is still only the node's own.

The bug cannot recur: there is no series-title-in-part field to confuse, the
author writes only each page's own title, and numbering is structural. An opera's
acts and a thesis's chapters use the same mechanism with different optional
labels.

### 6.3 Sidebar with a depth knob (default 3)

`ContentSideBar` already recurses; it gains a `maxDepth` prop:

- `SIDEBAR_DEFAULT_DEPTH = 3`, overridable per-work via the root `index.*`
  `sidebarDepth`, overridable per-render via the prop.
- Render stops at `maxDepth` **except** along the branch containing the active
  page, which is always expanded down to the active node — so you can always
  navigate to where you are, however deep.
- Every **container page** renders its direct children as a local table of
  contents, so nodes deeper than `maxDepth` are always reachable by drilling into
  their parent's page.
- Add a clickable **breadcrumb of ancestor titles** to every page. This is the
  honest fix for "I feel lost in the hierarchy" — context is shown as a path of
  real titles, not by stuffing "Chapter 1:" into a heading.
- Give each depth a visual treatment (indent + weight). Today every level uses
  the same two components, so nesting is invisible.

---

## 7. The build tool

`build-rmd.R` becomes `build-content.R` (or keeps its name) with these changes:

- **Input:** a source work dir under `client/content/<section>/…` (or a whole
  section). Walk the source tree **recursively**, not just a `src/` subfolder.
- **Per file:** `.Rmd`/`index.Rmd` → knit; `.mdx`/`index.mdx` → copy. Ignore
  `data/`, `assets/`, dotfiles.
- **Output:** mirror into `client/content-dist/<section>/…`; figures into the
  namespaced `client/public/<section>/<node-path>/` dir; rewrite figure refs to
  the namespaced web path.
- **`--clean`:** wipe the work's **entire** dist subtree and its public figure
  subtree — now genuinely clean, because no hand-authored file lives there.
- **`--force` / `--dry-run` / `--quiet`:** kept.
- **`--check` (new, CI-friendly):** assert every source file has a dist
  counterpart, slugs are unique per parent, and copy-through `.mdx` frontmatter
  matches source. This needs no R for the copy-through majority, so CI can verify
  structure without an R toolchain (see open question 2).
- Move the hardcoded figure DPI/size and the build log out of the content dir
  (the log currently lands *inside* the content tree). The log belongs with
  output, e.g. `client/content-dist/<section>/<work>/.build.log`.

---

## 8. Runtime / fetcher changes (Next.js)

- Add one constant, e.g. `CONTENT_DIST_ROOT = path.join(ROOT_DIR, 'content-dist')`,
  and a `CONTENT_SRC_ROOT` for tooling. Point the fetcher and **`sitemap.ts:55`**
  (both reference the content root today) at the dist root. This is the only
  place the source/output location is encoded.
- Rewrite `fetchContentMetadata.ts` around the single `buildNode` recursion;
  build a `slug-array → node` map once and use it for **both** `resolveSlugToPath`
  and `collectAllPathsRecursive` so resolution and `generateStaticParams` can
  never disagree.
- `generateStaticParams` enumerates every node's URL from that map — fully
  compatible with static export.
- Delete the orphaned `fetchCourseMetadata.ts` (confirmed: nothing imports it).
- `compileMDX` already reads `.mdx` as text via `fs`, so reading from
  `content-dist` instead of `app/.../posts` is a path change, not an
  architecture change — verified in `processMdx.ts`.

---

## 9. Migration — independently committable steps

The existing course keeps its hand-edited `_meta.yaml` content (it moves into
source) and, if desired, its URLs (via `transparent: true` + redirects). Steps:

1. **Reorganize into the source tree (no site change).** A one-shot script
   creates `client/content/courses/mathematical-statistics-with-R/` and:
   - moves `…/<volume>/src/<chapter>/*.Rmd` to
     `…/content/courses/<work>/<volume>/<chapter>/`, renamed to short
     self-describing names (`01-types-and-central-tendency.Rmd`);
   - **fixes the title defect at the data level**: sets each part's frontmatter
     `title:` to its real name (read from the old `part:` field) and drops the
     redundant `chapter:` / `part:` / series-`title:` baggage;
   - converts each chapter `_meta.yaml` → that chapter folder's `index.mdx`
     (its `title`/`summary`/`published` become frontmatter) — **this is how the
     hand-edited metadata is preserved**, by promoting it to source;
   - converts `_series.mdx` → the volume folder's `index.*`;
   - converts the `_passthrough` family marker → `transparent: true` in the
     work's `index.mdx` (only if you want to keep today's shorter URLs);
   - moves `data/` into the work's source folder.
   Commit. The live site still serves from the old tree.

2. **Land `build-content.R`; generate `content-dist/` + figures.** Run the build,
   commit the generated tree and namespaced figures. Diff page-for-page against
   the old output to confirm parity. Commit.

3. **Cut over.** Point the fetcher + `sitemap.ts` at `content-dist`, ship the
   recursive fetcher, the depth-limited sidebar, breadcrumbs, and delete
   `fetchCourseMetadata.ts`. This is the commit where reader behavior changes.

4. **Delete the old co-mingled tree** under `client/src/app/courses/posts/`.
   From here output is disposable.

**On URLs:** stripping numeric prefixes shortens every deep link
(`/courses/…/01-describing-data/01-1_…long…` → `/courses/…/describing-data/types-and-central-tendency`).
Given there are no users yet, I recommend taking the clean URLs. The build knows
both the old and new path for every page, so it can emit an `old → new` map for a
Next.js `redirects()` config as a safety net. If you'd rather not change URLs at
all yet, keep the numeric prefixes in the slug (a one-line toggle in the slug
function) and only adopt the structural changes.

---

## 10. Answers to the open questions (§6 of the brief)

1. **Inside `app/` or outside?** **Outside** — `client/content/` (source) and
   `client/content-dist/` (output), neither under `app/`. `compileMDX` reads
   strings via `fs`, so nothing requires content to sit in the route tree; the
   catch-all route already decoupled disk from routing. Keeping both trees under
   `client/` (not the repo root) keeps them inside the Docker build context and
   relative to `process.cwd()`.
2. **Commit output or regenerate in CI?** **Commit it.** The site already commits
   built `.mdx`, and the author explicitly wants no R in the serving path. Build
   locally, commit dist, CI/Docker consume `.mdx` only. "Disposable" means
   *regenerable on demand*, not *git-ignored*. Mitigate drift with `--check` in
   CI (structural, no R needed).
3. **Figures in the output tree or `public/`?** **`public/`**, because Next only
   serves static assets from there — but treated as output: namespaced per node
   (kills the global-chunk-name fragility) and wiped by `--clean`.
4. **Grouping folder — keep or flatten?** **Keep it, as a real container node**
   with its own landing page (the recursion makes a "family" just another
   container). It earns its place: it owns shared `data/` and an overview of the
   volumes. Set `transparent: true` on it if you want today's shorter URLs; that
   one flag is the whole difference between "visible work" and "invisible
   grouping," at any level.
5. **Marker file or named constant for hiding?** **Neither — a frontmatter flag**
   `transparent: true` on the folder's `index.*`. It needs no extra file kind, it
   reads in plain language, it's uniform with all other node settings, and unlike
   today's `_passthrough` it works at **any** depth (today passthrough is only
   applied in the top-level scan, not inside `buildHierarchyTree`).
6. **Ordering?** **Numeric filename prefixes as a sort key, stripped from the
   URL.** Visible in `ls`, reordering is a rename, no separate `order:` field, no
   central manifest, clean URLs.

---

## 11. Tradeoffs & self-critique

- **Content leaves `app/`.** This decouples disk from routing — a conceptual
  shift for anyone who expects "folder = route." But the catch-all already broke
  that 1:1 mapping, so we're making an existing reality explicit, not inventing a
  new indirection. Net cost is ~one path constant.
- **`index` is an overloaded word.** An author might wonder whether `index.mdx`
  is special (it is — it's the *one* special name). The alternative `_index.*`
  (Hugo) signals specialness with an underscore but is uglier. I chose `index.*`
  for familiarity; this is a cheap bikeshed to repaint later.
- **Committed output can drift from source.** A full anti-drift check wants R in
  CI, which we're avoiding. The compromise (`--check`: structure + copy-through
  frontmatter, no R) catches the common cases (missing/orphan pages, slug
  collisions, edited copy-through frontmatter) but not "the `.Rmd` changed and
  nobody rebuilt." Discipline (rebuild before commit) plus mtime comparison
  covers the rest. Acceptable for a one-author repo.
- **Stripped prefixes can collide** (`01-intro` + `02-intro` → `intro`). Handled
  by a build-time uniqueness check that fails loudly, but it *is* a new failure
  mode the numeric-prefix-in-URL scheme didn't have.
- **Two output locations** (`content-dist` for pages, `public` for figures). A
  small asymmetry forced by Next's static-serving model; both are wiped by
  `--clean`, so disposability is preserved.
- **Whole-tree build per render.** The recursive builder walks the section tree;
  for very large works this is O(n) per page, as today. Memoize if it ever
  matters. Deferred.
- **Considered and rejected: a single root manifest** (`book.yaml` listing every
  node, order, and title). It centralizes metadata but violates "self-evident
  from layout" (you edit one giant file divorced from the content) and
  "recursive/uniform" (one privileged file at the root, content scattered
  elsewhere). The distributed `index.*` keeps each title next to the thing it
  titles.

---

## 12. Deferred to follow-ups

- Fold **blog** and **references** (same `posts/` + `src/` pattern today) and the
  **dictionaries** content type into the one recursive engine.
- A `redirects()` generator wired into `next.config` from the build's old→new map.
- Cross-node references / "see chapter X" links resolved at build time.
- Whole-work exports (PDF/EPUB) — the clean recursive tree makes a book export
  natural later.
- Full-text search over the dist tree.
- Co-located non-generated assets (author-supplied images beside a part) — define
  an `assets/` passthrough copy if/when needed.

---

### One-line summary

Make every level the same recursive node; let a folder describe itself with one
optional `index.*`; split a clean source tree from a disposable output tree; move
all hand-edited metadata into source; strip ordering prefixes from URLs; and
derive each title from the node itself with numbering as a view-layer ornament.
Everything the brief calls hacky is a consequence of not having done those, and
each falls out of doing them.
