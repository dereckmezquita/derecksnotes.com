# Course Development Guidelines using R

Universal guidelines for creating courses on derecksnotes.com.

## Pedagogical Approach

We present concepts in multiple ways. Depending on the subject matter we might choose to do:

1. Prose
2. Visualisations
3. Demonstrations
4. Communication

Different learners have different approaches and ways of retaining information. I find I personally benefit from visualisations and demonstrations. Especially deriving equations from first principles. I will never forget working with formulas for PH and then asking a question to myself, if pH s the measure of potential hydrogen and thus I asked does the inverse exist pOH? I played with formulas and out dropped a demonstration that allowed me to more intuitively understand pH/pOH.

### 1. Prose

I would opt to use simpler more direct language. People have short attention spans, I don't want to waste anyones time. Although, I typically heavily rely on analogies.

### 2. Visualisations

Demonstrate concepts visually using `ggplot2`. Graphs and diagrams to bridge intuition and mathematics.

I also enjoy visualisations using JavaScript since we build from Rmd to MDX we can include components that are processed by the MDX system — interactive plots, animations, callouts, carousels, and more. See the [MDX Components](#mdx-components) section below for the full set and how to use them.

### 3. Mathematical Derivation

Present formal mathematics following the French educational tradition — *derive* formulae - do mathematical demonstrations, don't just state them:

- Add some prose 1-2 sentences who and how the formula was discovered.
- Why it takes the form it does explain the topology or groups of terms of the formula. Sometimes a formula can be explained by groups of terms, some terms are about X or Y or the denominator/numerator etc represent Z or A etc.
- What each component means

Make use of formulas using the fence "$$" for displayed maths and "$" for inline.

### 4. Communicating to Stakeholders

I typcailly not only teach the concept but also how to communicate the idea to others. This is often important in science, business, and teaching.

Teach how to explain the concept to non specialists:

- Plain language reporting
- Common misunderstandings to avoid

Teach how to explain the concept to specialists as well.

## Exercise and code

Depending on the subject if it calls for it we can then implement from scratch and demonstrate to users in a separate section.

If the course is teaching statistics for example we implement the function from scratch before using a base function.

## Language and Style

### Spelling

**British Oxford English** throughout — and in code where the library allows it. `ggplot2` ships both spellings of every function and argument (`scale_colour_manual` / `scale_color_manual`, `colour =` / `color =`), so use the British form to match the prose. Where a function only exists in American spelling, use it as-is.

### Tone

- Professional, academic, but accessible; think Richard Feynman
- Build intuition before formalism
- Avoid unnecessarily complex language
- Use active voice where possible
- Define terms when first introduced
- Use concrete examples before abstract definitions

## Code Style

These are Rmd documents as such you can write code fences inside using "```{r}". Always include a title for the code block. Only override echo and other such items if absolutely necessary, we already set defaults in the setup chunk by default.

We use renv for managing packages a lock file should be created in the course folder. Every course should have it's own renv setup.

### Imports

```r
# ALWAYS use box::use() — NEVER use library()
box::use(
  data.table,
  ggplot2
)

# Access with namespace prefix
dt <- data.table$data.table(x = 1:10, y = rnorm(10))
ggplot2$ggplot(dt, ggplot2$aes(x = x, y = y)) + ggplot2$geom_point()

# Only import individual functions when 1-3 are needed
box::use(
  data.table[as.data.table, .N]
)
```

### `box::use` gotchas — NSE in ggplot2 and data.table

Two cases need the `::` form (not `$`) or a small shim, because they rely on non-standard evaluation:

- **ggplot2 functions inside `aes()`** (`after_stat()`, `vars()`, …) are evaluated in ggplot2's NSE context, so `$` won't resolve — use `::`:

```r
ggplot2$geom_histogram(ggplot2$aes(y = ggplot2::after_stat(density)))  # correct
ggplot2$geom_histogram(ggplot2$aes(y = ggplot2$after_stat(density)))   # wrong: $ fails here
```

- **data.table special symbols** (`.N`, `.SD`, `.GRP`) must exist in the calling environment. Bind the ones you use in a hidden chunk right after `setup`:

````r
```{r dt-symbols, include=FALSE}
.N <- data.table::.N
.SD <- data.table::.SD
```
````

then `dt[, .N, by = group]` works naturally in visible code.

### Common heavy use packages

- `data.table`: Data manipulation (NEVER tidyverse)
- `ggplot2`: Visualisation
- `box`: Package imports
- `renv`: install packages
- `rlang`: for better errors `rlang::abort` etc.
- parallisation if necessary with `future`/`mirai`

### Coding Style

- Use 2 spaces for indents
- Old-school C-style coding preferred
- Base R for simple operations
- Heavy use of `data.table` for data manipulation
- Use `Rscript` to run scripts — never use `source()`
- NEVER RETURN FROM CONTROL FLOW; create variables with defaults then conditionally update if necessary do not use `varname <- if (...) ...`

### Printing and output

- **Don't overuse `cat()`.** For simple inspection, print the object directly and explain it in prose below the chunk — let the object speak for itself. Reserve `cat()` / `sprintf()` for genuinely formatted output (a comparison table, a step-by-step calculation).
- Use inline R (`` `r some_var` ``) for dynamic values woven into prose; verify the rendered value matches the surrounding text.

### Reproducibility

- Include `set.seed()` for all random examples
- Use consistent seeds across related examples
- Medium amount of commenting explaining logic
- Show intermediate outputs where instructive

## File Format

### Page Header Template (a leaf `.Rmd` or `.mdx`)

Each page's `title` is **its own title** — never the book or chapter title; the tree supplies that context. There is no `chapter:` / `part:` field.

```yaml
---
title: "Types of Data and Central Tendency"   # the node's OWN title — never the book/chapter title
coverImage: 13              # optional; inherited from the volume if omitted
author: "Dereck Mezquita"   # optional; inherited if omitted
date: "`r Sys.Date()`"      # optional; inherited if omitted. Sys.Date() stamps the build date
tags: [statistics, mathematics, data, R, ggplot2]  # optional; inherited if omitted
published: true             # optional; default true. Set false to hide this page (and its subtree)
comments: true              # optional; inherited if omitted
output:
  html_document:
    keep_md: true
---
```

### Setup Chunk Template

The build (`build-content.R`) **already injects the `<Figure>` plot hook and base chunk defaults** for every `.Rmd` it knits — `dev = "png"`, `echo = TRUE`, `results = "hold"`, `dpi = 250`, `fig.width = 10`, `fig.height = 7`. A `setup` chunk is therefore only for **overriding** those per course, and for making a *local* HTML knit (e.g. an RStudio preview) emit the same `<Figure>` tags — which is what the `is_html_output()` guard is for: it is false during the site build (Markdown output, where the build's own hook is active) and true only for a local HTML render.

````r
```{r setup, include=FALSE}
# Only fires on a local HTML knit; the build injects this same hook itself.
if (knitr::is_html_output()) knitr::knit_hooks$set(
  plot = function(x, options) {
    cap <- options$fig.cap
    as.character(htmltools::tag(
      "Figure", list(src = x, alt = cap, paste("\n\t", cap, "\n", sep = ""))
    ))
  }
)

knitr::knit_hooks$set(optipng = knitr::hook_optipng)
knitr::opts_chunk$set(
  dpi = 300,           # overrides the build's 250 default
  fig.width = 10,
  fig.height = 7,
  comment = "",        # no "##" prefix on printed output
  warning = FALSE,
  collapse = FALSE,
  results = "hold"
)
```
````

### File & Folder Naming

Name a file or folder only for *itself* — the tree provides the rest. A leading numeric prefix (`01-`, `02-`) sets the order; it is **stripped to form the URL slug**, so it never appears in a link.

- Leaf page: `01-types-and-central-tendency.Rmd` → slug `types-and-central-tendency`
- Chapter:   `01-describing-data/` → slug `describing-data`

Reordering is a rename; there is no separate order field.

---

## Directory Structure

Content lives under `client/src/app/courses/posts/` (courses share the `posts/` location with `blog`). Each **work** (a volume) holds a `src/` you edit and a generated, disposable `built/` that the site serves — this `src/` + `built/` split is course-specific: `blog` posts are flat files, and `dictionaries` build flat `.mdx` beside a `src/` (no `built/`). One recursive node model: a folder is a container, a file is a leaf.

```
client/src/app/courses/posts/
└── mathematical-statistics-with-R/          # organisational family
    ├── index.mdx                            # `transparent: true` -> kept out of the URL
    ├── data/                                # shared datasets (ignored by the site)
    ├── TOC.md  DATA.md                       # author notes
    └── mathematical-statistics-1-foundations/   # a volume = the routable "work"
        ├── src/                             # ← SOURCE you edit (.Rmd + index.mdx)
        │   ├── index.mdx                    # volume page + metadata  (was _series.mdx)
        │   ├── 01-describing-data/          # a chapter (container)
        │   │   ├── index.mdx                # chapter title + summary  (was _meta.yaml)
        │   │   ├── 01-types-and-central-tendency.Rmd   # a part (R Markdown leaf)
        │   │   ├── 02-spread-and-shape.Rmd
        │   │   └── 03-visualisation-and-relationships.Rmd
        │   ├── 02-probability/ …
        │   └── …                            # 25 chapters in all
        └── built/                            # ← BUILT OUTPUT (generated, served, disposable)
            └── … same tree, every page as .mdx …
```

The tree is **recursive with no depth limit**: a leaf can be promoted to a container (give it a folder + an `index.*` + numbered children), and a part may be a plain `.mdx` leaf (copied through, no R) instead of `.Rmd`. No chapter uses either yet — every part above is currently a flat `.Rmd`.

Build (or rebuild) a work — reads `src/`, writes `built/`:

```
Rscript build-content.R client/src/app/courses/posts/mathematical-statistics-with-R/mathematical-statistics-1-foundations
```

Useful flags: `--force` rebuilds even when `built/` is newer than `src/`, `--clean` wipes the work's `built/` and figures first, and `--dry-run` shows what would change without writing. The same script also builds dictionaries (flat output) when the path is under `dictionaries/`.

`src/` and `built/` are both hidden from the URL, so the page above is served at `/courses/mathematical-statistics-1-foundations/describing-data/types-and-central-tendency`.

### Key conventions

- **`index.mdx`** (or **`index.Rmd`**): a folder's own page. Its frontmatter (`title`, `summary`, `published`, `transparent`, `coverImage`, …) describes the folder. Use `index.Rmd` when a chapter/section intro needs to run R (e.g. a plot) — it is knit like any other part. Optional — a folder with no index still works (its title defaults to the slug).
- **`transparent: true`** (in an `index.mdx`): the folder contributes no URL segment; its children promote up. For organisational groupings (e.g. a multi-volume family). Replaces the old `_passthrough` marker; works at any depth.
- **`.Rmd` vs `.mdx`**: `.Rmd` is knit through R (runs code, emits figures); `.mdx` is copied through verbatim (no R). Per-file choice, uniform output.
- **`data/` and `assets/`**: build-time ingredients, ignored by the site. The site also skips `drafts/`, `deprecated/`, `ignore/`, any `*.ignore` name, and dotfiles — handy for parking work-in-progress without deleting it.
- **Hiding a page**: `published: false` in a leaf's frontmatter (or a container's `index.mdx`) removes it — and, for a container, its whole subtree — from the URL map, sidebar, and overview lists.
- Figures are written to `client/public/courses/<volume>/` and served from `/courses/<volume>/`.

### Data and file paths

Every chunk is knit with its **working directory set to the `.Rmd`'s own folder** — the build runs `knitr::opts_knit$set(root.dir = dirname(src))`. So a relative path in a chunk resolves from *that file's* location, never from `src/`, the work root, or the repo root.

Shared datasets live in a `data/` folder kept at the **family** level, so every volume draws from the same place. The CSVs are **git-ignored** and fetched by the `download_*.R` scripts beside them (e.g. `Rscript data/download_primary.R`) — a fresh clone populates `data/` by running those, rather than committing the data:

```
mathematical-statistics-with-R/
├── data/                         # build-time only — never copied to built/ or served
│   ├── download_*.R              # fetch the datasets (git-ignored CSVs land here)
│   ├── primary/penguins.csv
│   └── classic/airquality.csv …
└── mathematical-statistics-1-foundations/
    └── src/01-describing-data/01-types-and-central-tendency.Rmd
```

`data/` (like `assets/`) is a **build-time ingredient**: the build ignores it (`discover_sources` skips `data`, `assets`, `node_modules`) and so does the site, so nothing in `data/` ever lands in `built/` or reaches the browser. A chunk reads a CSV at knit time to produce a figure or table — the **figure** is emitted (to `public/courses/<volume>/`), the raw CSV is not.

Read a dataset with a path relative to the `.Rmd`, defined once at the top:

```r
box::use(data.table)

# from src/<chapter>/<part>.Rmd, "../../.." climbs chapter -> src -> volume -> family
data_dir <- "../../../data"
penguins <- data.table$fread(file.path(data_dir, "primary/penguins.csv"))
```

The number of `../` tracks the file's depth: a part one chapter deep uses `../../../data`; promote that part into its own sub-folder (one level deeper) and it becomes `../../../../data`. Keep the path in a single `data_dir` variable so a move is a one-line fix, and never use an absolute or repo-rooted path — the build sets the working directory to the file's own folder, so those won't resolve.

## MDX Components

Because every page compiles from `.Rmd`/`.mdx` through MDX, you can drop React components straight into the prose. The available set is registered in `client/src/components/mdx/index.tsx`. Use them sparingly — only where they earn their place. **This set is not fixed:** if a course needs something new, you can add your own component backed by JavaScript or anything else (see *Building a new component* at the end).

### `<Figure>` — captioned image with zoom

A captioned image with a click-to-zoom lightbox (Esc closes); handles PDFs too. The children are the caption (markdown/links allowed) and `alt` is derived from them.

```mdx
<Figure src="/courses/<volume>/diagram.png">A labelled sampling distribution.</Figure>
```

You rarely write this by hand for R plots — the build's plot hook wraps every R figure as `<Figure src=… alt=…/>` automatically, taking the caption from the chunk's `fig.cap`. Reach for it directly only for static images you've placed under `public/`.

### `<Alert>` — callout box

GitHub-style callout with an icon and a coloured rule. `type` is `note`, `important`, or `warning` (it is the most-used rich element on the site).

```mdx
<Alert type="warning">
The sample variance divides by `n - 1`, not `n` — see the derivation above.
</Alert>
```

### `<Blockquote>` — pull quote

A styled quotation with an optional `src` attribution (markdown links allowed, opened in a new tab).

```mdx
<Blockquote src="[R. A. Fisher](https://en.wikipedia.org/wiki/Ronald_Fisher)">
To consult the statistician after an experiment is finished is often merely to ask him to conduct a post mortem examination.
</Blockquote>
```

### `<InteractivePlot>` — canvas with live controls

Sliders / checkboxes / selects above a `<canvas>`, redrawn on every change — use it when the reader benefits from turning a parameter (distribution shape, sample size, …). The `draw` string is **JavaScript** (canvas 2D, not R), run in a sandboxed iframe; it receives `canvas`, `ctx`, and `params` (current control values keyed by `id`).

```mdx
<InteractivePlot
  controls={[
    { id: "lambda", type: "range", label: "λ", min: 0.5, max: 25, step: 0.5, default: 5 },
    { id: "showApprox", type: "checkbox", label: "Normal approx", default: false },
    { id: "dist", type: "select", label: "Distribution", options: ["poisson", "binomial"], default: "poisson" }
  ]}
  draw={`
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lam = params.lambda;
    // ... draw using params ...
  `}
  width={600}
  height={400}
/>
```

Control types: `range` (`min`/`max`/`step?`/`default`), `checkbox` (`default` boolean), `select` (`options`/`default`).

### `<CanvasWithJs>` — simple animation

A bare sandboxed `<canvas>` for an auto-playing animation with **no** controls — when you don't need `InteractivePlot`'s parameter UI. The `code` string (JavaScript) receives `canvas` and `ctx`; use `requestAnimationFrame` for motion.

```mdx
<CanvasWithJs code={`
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ... draw one frame ...
    requestAnimationFrame(frame);
  }
  frame();
`} width={600} height={400} />
```

Don't use a canvas for a *static* image (ggplot2 makes better static output), and don't duplicate one visualisation in both R and canvas.

### `<Carousel>` — image carousel

An auto-advancing carousel with prev/next. `items` is an array of `{ src, caption? }`; `interval` is milliseconds (default 5000). Registered as `<Carousel>` (the file is `FigureCarrousel.tsx`).

```mdx
<Carousel
  items={[
    { src: "/courses/<volume>/step-1.png", caption: "Step 1" },
    { src: "/courses/<volume>/step-2.png", caption: "Step 2" }
  ]}
/>
```

### `<KnowledgeGraphEmbed>` — embed the site graph

Drops the site-wide knowledge graph (force-directed, with a control panel and a "View full screen" link to `/explore`) inline. Takes no props; niche, but handy for meta/overview pages.

```mdx
<KnowledgeGraphEmbed />
```

### Choosing a visualisation

| Need | Use |
|------|-----|
| Static plot or diagram | `ggplot2` in an R chunk (auto-wrapped as `<Figure>`) |
| A static image you placed yourself | `<Figure>` |
| Reader adjusts parameters | `<InteractivePlot>` |
| Auto-playing animation, no controls | `<CanvasWithJs>` |
| A callout / aside | `<Alert>` |

### Building a new component

The set above is just React — the MDX pipeline is open, so when nothing fits you can build your own. Add `client/src/components/mdx/<Name>.tsx`, register it in the map in `index.tsx`, and it becomes usable as `<Name … />` in any `.Rmd`/`.mdx`. For anything that runs client-side JavaScript (canvas, animation, interactivity), follow `CanvasWithJs` / `InteractivePlot`: they execute author-supplied JS inside a sandboxed iframe (`sandbox="allow-scripts"`), which is the safe pattern for arbitrary drawing code. Keep new components general (reusable across courses), not one-offs.
