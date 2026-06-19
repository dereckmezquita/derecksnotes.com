# Mathematical Statistics with R — Course Authoring Guide

## Code Style

### Package Management

ALWAYS use `box::use()` — NEVER use `library()`. Import the namespace, then access functions with the dollar sign prefix. This is pedagogically important: readers can see exactly where every function comes from.

```r
# Import namespaces
box::use(data.table)
box::use(ggplot2)

# Access with dollar sign — the reader sees where each function lives
dt <- data.table$data.table(x = 1:10, y = rnorm(10))
ggplot2$ggplot(dt, ggplot2$aes(x = x, y = y)) + ggplot2$geom_point()
```

**NEVER** use wildcard imports like `box::use(ggplot2[...])` or `box::use(data.table[...])`. The only exception is importing 1-2 specific functions from a package that isn't used heavily: `box::use(patchwork[wrap_plots])`.

#### ggplot2 non-standard evaluation inside aes()

Functions like `after_stat()` and `vars()` that appear inside `aes()` need the `::` form (not `$`) because they are evaluated inside ggplot2's NSE context:

```r
# CORRECT: use :: inside aes()
ggplot2$geom_histogram(ggplot2$aes(y = ggplot2::after_stat(density)))

# WRONG: $ doesn't resolve inside aes()
ggplot2$geom_histogram(ggplot2$aes(y = ggplot2$after_stat(density)))
```

#### data.table special symbols (.N, .SD, .GRP)

These symbols require non-standard evaluation and must exist in the calling environment. Import them in a **hidden** chunk immediately after the setup chunk:

```r
```{r dt-symbols, include=FALSE}
# data.table special symbols must be in the calling environment for NSE
.N <- data.table::.N
.SD <- data.table::.SD
```
```

Only include the symbols actually used in that file. In visible code, `.N` works naturally inside `dt[, .N, by = group]` because we imported it above.

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

### Printing and Output

**Do not overuse `cat()`.** For simple variable inspection, just print the object directly and explain what the reader is seeing in prose below the code chunk.

**WRONG:**
```r
cat("Species values:\n")
unique(penguins$species)
cat("\nIsland values:\n")
unique(penguins$island)
```

**RIGHT:**
```r
unique(penguins$species)
unique(penguins$island)
```
Then in prose: "We see three species: Adelie, Gentoo, and Chinstrap, spread across three islands."

Keep `cat()` or `sprintf()` only when formatted output genuinely helps — e.g., building a comparison table or printing a step-by-step calculation. For most variable printing, let the object speak for itself.

Use inline R (`` `r some_var` ``) for dynamic values in prose where useful. Verify the output is correct and matches the surrounding text.

### Reproducibility
- Include `set.seed()` for all random examples
- Use consistent seeds across related examples (seed 42 as default)
- Show intermediate outputs where instructive
- `results = 'hold'` is set globally in the setup chunk — output appears as one block under the code

## Pedagogical Method

Every concept follows five modes of teaching through repetition:

1. **Prose and intuition** — plain language, analogies, context
2. **Formal mathematics** — definitions, theorems, proofs, derivations (LaTeX)
3. **Implementation from scratch** — build it in R before using built-in functions
4. **Built-in functions** — show the standard R way after the from-scratch version
5. **Visualisation** — ggplot2 for static plots; `<InteractivePlot>` for interactive explorations

### Exercises

End each part with exercises mixing:
- Proof exercises ("show that...")
- Computational exercises ("simulate... and compare")
- Interpretation exercises ("given this output, what can you conclude and why?")
- Spot-the-error exercises ("a colleague claims... what is wrong?")

## Interactive Visualisations

### When to use what

| Need | Tool |
|------|------|
| Static plot | ggplot2 in an R chunk |
| Static diagram (Venn, flowchart) | ggplot2 in an R chunk |
| Interactive exploration (sliders, parameters) | `<InteractivePlot>` component |
| Simple auto-playing animation (no controls) | `<CanvasWithJs>` component |

**Rules:**
- Do NOT use canvas for static images — ggplot2 produces better static output
- Do NOT duplicate a visualisation in both R and canvas
- Use `<InteractivePlot>` when the reader benefits from adjusting parameters (distribution shape, sample size, probability, etc.)

### InteractivePlot component

```mdx
<InteractivePlot
  controls={[
    { id: "lambda", type: "range", label: "λ", min: 0.5, max: 25, step: 0.5, default: 5 },
    { id: "showApprox", type: "checkbox", label: "Normal approx", default: false },
    { id: "dist", type: "select", label: "Distribution", options: ["poisson", "binomial"], default: "poisson" }
  ]}
  draw={`
    // canvas, ctx, params are pre-injected
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var lam = params.lambda;
    // ... drawing code
  `}
  width={600}
  height={400}
/>
```

Control types: `range` (slider with value display), `checkbox`, `select` (dropdown).

The `draw` string receives `canvas`, `ctx`, and `params` (object with current control values). It is called on mount and every time a control changes.

### CanvasWithJs component (simple animations only)

```mdx
<CanvasWithJs code={`
  // canvas and ctx are pre-injected
  // Use requestAnimationFrame for animations
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ... animation logic
    requestAnimationFrame(animate);
  }
  animate();
`} width={600} height={400} />
```

## Language

- Use formal academic language for definitions and theorems
- Use plain modern English for explanations and intuition
- Both registers used together — introduce concepts in everyday language, then formalise
- British Oxford English spelling throughout (visualisation, colour, analyse, behaviour, etc.)
- R code uses American spelling where R functions require it (e.g., `scale_color_manual()`)

## File Naming Convention

```
{chapter}-{part}_{course}_{chapter-name}_{topic}.Rmd
```

Example:
```
01-1_mathematical-statistics-1-foundations_describing-data_types-and-central-tendency.Rmd
```

## Rmd Setup Chunk

Every file starts with this setup chunk:

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

If the file uses data.table `.N`/`.SD`/`.GRP`, add the hidden import chunk immediately after:

```r
```{r dt-symbols, include=FALSE}
.N <- data.table::.N
.SD <- data.table::.SD
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
published: true
comments: true
output:
  html_document:
    keep_md: true
---
```

Note: `published: true` so content is visible during development.

## Data Loading

From any Rmd file in `src/NN-chapter/`:

```r
box::use(data.table)
data_dir <- "../../../data"
penguins <- data.table$fread(file.path(data_dir, "primary/penguins.csv"))
nhanes <- data.table$fread(file.path(data_dir, "primary/nhanes.csv"))
```

## Section Structure

Each part (Rmd file) should follow this structure:

1. Content sections with prose, maths, code, visualisation
2. **Communicating to Stakeholders** — how to explain these concepts to non-statisticians
3. **Quick Reference** — summary table of key formulas and R functions
4. **Exercises** — mixed proof/computation/interpretation/spot-the-error
