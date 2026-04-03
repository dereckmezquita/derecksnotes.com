# Mathematical Statistics with R — Course Authoring Guide

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
- Create variables with defaults then conditionally update if necessary; do not use `varname <- if (...) ...`

### Reproducibility
- Include `set.seed()` for all random examples
- Use consistent seeds across related examples
- Show intermediate outputs where instructive

## Pedagogical Method

Every concept follows five modes of teaching through repetition:

1. **Prose and intuition** — plain language, analogies, context
2. **Formal mathematics** — definitions, theorems, proofs, derivations (LaTeX)
3. **Implementation from scratch** — build it in R before using built-in functions
4. **Visualisation** — ggplot2 plots and JavaScript canvas animations
5. **Exercises** — proofs, computations, interpretations, and error-spotting

## Language

- Use formal academic language for definitions and theorems
- Use plain modern English for explanations and intuition
- Both registers used together — introduce concepts in everyday language, then formalise
- British Oxford English spelling throughout

## File Naming Convention

```
{chapter}-{part}_{course}_{chapter-name}_{topic}.Rmd
```

Example:
```
01-1_mathematical-statistics-1-foundations_describing-data_types-and-central-tendency.Rmd
```

## Rmd Setup Chunk

```r
```{r setup, include=FALSE}
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
  dpi = 300,
  fig.width = 10,
  fig.height = 7,
  comment = "",
  warning = FALSE,
  collapse = FALSE,
  results = 'hold'
)
```
```

## Frontmatter Template

```yaml
---
title: "Mathematical Statistics with R I: Foundations"
chapter: "Chapter N: Chapter Title"
part: "Part N: Part Title"
coverImage: 13
author: "Dereck Mezquita"
date: "`r Sys.Date()`"
tags: [statistics, mathematics, probability, R]
published: false
comments: true
output:
  html_document:
    keep_md: true
---
```
