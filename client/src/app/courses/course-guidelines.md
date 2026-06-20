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

Each page's `title` is **its own title** — never the book or chapter title; the
tree supplies that context. There is no `chapter:` / `part:` field.

```yaml
---
title: "Types of Data and Central Tendency"
published: true
tags: [statistics, data]    # optional; inherited from the volume if omitted
coverImage: 13              # optional; inherited if omitted
author: "Dereck Mezquita"   # optional; inherited if omitted
date: YYYY-MM-DD            # optional
output:
  html_document:
    keep_md: true
---
```

### Setup Chunk Template
````r
```{r setup, include=FALSE}
if (knitr::is_html_output()) knitr::knit_hooks$set(
  plot = function(x, options) {
    cap  <- options$fig.cap
      as.character(htmltools::tag(
      "Figure", list(src = x, alt = cap, paste("\n\t", cap, "\n", sep = ""))
    ))
  }
)

knitr::knit_hooks$set(optipng = knitr::hook_optipng)
knitr::opts_chunk$set(dpi = 300, fig.width = 10, fig.height = 7)
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

Content lives under `client/src/app/courses/posts/` (same place as before, and
uniform with `blog`/`dictionaries`). Each **work** (a volume) holds a `src/` you
edit and a generated, disposable `built/` that the site serves. One recursive node
model: a folder is a container, a file is a leaf.

```
client/src/app/courses/posts/
└── mathematical-statistics-with-R/          # organisational family
    ├── index.mdx                            # `transparent: true` -> kept out of the URL
    ├── data/                                # shared datasets (ignored by the site)
    ├── TOC.md  DATA.md  COURSE-GUIDE.md      # author notes
    └── mathematical-statistics-1-foundations/   # a volume = the routable "work"
        ├── src/                             # ← SOURCE you edit (.Rmd + index.mdx)
        │   ├── index.mdx                    # volume page + metadata  (was _series.mdx)
        │   ├── 01-describing-data/          # a chapter
        │   │   ├── index.mdx                # chapter title + summary  (was _meta.yaml)
        │   │   ├── 01-types-and-central-tendency.Rmd   # a part (R Markdown)
        │   │   ├── 02-spread-and-shape.Rmd
        │   │   └── 03-visualisation/        # a part with sub-parts → just make it a folder
        │   │       ├── index.mdx
        │   │       └── 01-histograms.mdx    # plain MDX leaf → copied through, no R
        │   └── 02-probability/ …
        └── built/                            # ← BUILT OUTPUT (generated, served, disposable)
            └── … same tree, every page as .mdx …
```

Build (or rebuild) a work — reads `src/`, writes `built/`:

```
Rscript build-content.R client/src/app/courses/posts/mathematical-statistics-with-R/mathematical-statistics-1-foundations
```

`src/` and `built/` are both hidden from the URL, so the page above is served at
`/courses/mathematical-statistics-1-foundations/describing-data/types-and-central-tendency`.

### Key conventions

- **`index.mdx`**: a folder's own page. Its frontmatter (`title`, `summary`,
  `published`, `transparent`, `coverImage`, …) describes the folder. Optional — a
  folder with no `index.mdx` still works (its title defaults to the slug).
- **`transparent: true`** (in an `index.mdx`): the folder contributes no URL
  segment; its children promote up. For organisational groupings (e.g. a
  multi-volume family). Replaces the old `_passthrough` marker; works at any depth.
- **`.Rmd` vs `.mdx`**: `.Rmd` is knit through R (runs code, emits figures);
  `.mdx` is copied through verbatim (no R). Per-file choice, uniform output.
- **`data/` and `assets/`**: build-time ingredients, ignored by the site.
- Figures are written to `client/public/courses/<volume>/` and served from
  `/courses/<volume>/`.
