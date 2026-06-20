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

I also enjoy visualisations using JavaScript since we build from Rmd to MDX we can include components that are processed by the MDX system such as the following:

TODO RESEARCH OUR CODEBASE AND FILL IN SMALL DEMOS HERE.

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

**British Oxford English** throughout.

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

Name a file or folder only for *itself* — the tree provides the rest. A leading
numeric prefix (`01-`, `02-`) sets the order; it is **stripped to form the URL
slug**, so it never appears in a link.

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
    ├── TOC.md  DATA.md  COURSE-GUIDE.md      # author notes
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

The tree is **recursive with no depth limit**: a leaf can be promoted to a
container (give it a folder + an `index.*` + numbered children), and a part may be
a plain `.mdx` leaf (copied through, no R) instead of `.Rmd`. No chapter uses
either yet — every part above is currently a flat `.Rmd`.

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
