# Course Development Guidelines

Universal guidelines for creating courses on Dereck's Notes.

---

## Pedagogical Approach

Every concept MUST be presented using the **four-part teaching method**:

### 1. Prose and Intuition
Explain the concept in plain language with analogies and context:
- What is this?
- Why does it matter?
- When would you use it?

Build intuition before formalism. Make complex topics accessible.

### 2. Visualisation
Demonstrate concepts visually using `ggplot2`. Graphs and diagrams bridge intuition and mathematics.

### 3. Mathematical Derivation
Present formal mathematics following the French educational tradition — *derive* formulae - do mathematical demonstrations, don't just state them:
- How the formula was discovered
- Why it takes the form it does
- What each component means

### 4. Communicating to Stakeholders
Teach how to explain the concept to non-specialists:
- Plain language reporting
- Common misunderstandings to avoid
- How to answer questions from collaborators

After the four-part introduction, implement methods **from scratch**, then show built-in functions.

---

## Chapter Structure

1. **Opening** — Brief introduction (1-2 paragraphs)
2. **Sections** — Each follows the four-part pedagogical approach
3. **Communication** — End-of-chapter guidance for non-specialists
4. **Quick Reference** — Compact summary of formulae and code

---

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

---

## Code Style

### Package Management
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

### Core Packages
| Package | Purpose |
|---------|---------|
| `data.table` | Data manipulation (NEVER tidyverse) |
| `ggplot2` | Visualisation |
| `box` | Package imports |

### Coding Paradigms
- Use 2 spaces for indents
- Old-school C-style coding preferred
- Base R for simple operations
- Heavy use of `data.table` for data manipulation
- Implement functions from scratch BEFORE showing built-in versions
- Use `Rscript` to run scripts — never use `source()`
- Create variables with defaults then conditionally update if necessary do not use `varname <- if (...) ...`

### Reproducibility
- Include `set.seed()` for all random examples
- Use consistent seeds across related examples
- Heavy commenting explaining logic
- Show intermediate outputs where instructive

---

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
edit and a generated, disposable `dist/` that the site serves. One recursive node
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
        └── dist/                            # ← BUILT OUTPUT (generated, served, disposable)
            └── … same tree, every page as .mdx …
```

Build (or rebuild) a work — reads `src/`, writes `dist/`:

```
Rscript build-content.R client/src/app/courses/posts/mathematical-statistics-with-R/mathematical-statistics-1-foundations
```

`src/` and `dist/` are both hidden from the URL, so the page above is served at
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

---

## Quality Checklist

Before submitting any chapter:

- [ ] British Oxford English spelling verified
- [ ] Four-part method used for each concept
- [ ] Mathematical derivations shown, not just formulae stated
- [ ] Code implemented from scratch before built-in functions shown
- [ ] `set.seed()` used for all random examples
- [ ] Visualisations have clear titles, labels, and captions
- [ ] "Communicating to Stakeholders" section included
- [ ] "Quick Reference" section included
- [ ] Rmd file knits without errors
- [ ] All code chunks run and produce expected output

---

## Workflow

1. Write one chapter at a time
2. Follow the four-part pedagogical approach for each concept
3. Submit for review
4. Proceed to next chapter only after explicit approval
