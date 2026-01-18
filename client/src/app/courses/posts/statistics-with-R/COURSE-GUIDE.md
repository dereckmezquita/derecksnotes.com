# Statistics with R — Course Development Guide

This document consolidates all development guidelines, pedagogical approach, code style, and data documentation for the Statistics with R course series.

---

## Course Overview

**Full Title:** Statistics with R — A Comprehensive Course for R Programmers

**Structure:** Three-part course series covering foundational through advanced statistics.

| Part | Title | Folder | Status |
|------|-------|--------|--------|
| I | Foundations | `statistics-1-foundations/` | In Progress (2/15 chapters) |
| II | Intermediate | `statistics-2-intermediate/` | Not Started |
| III | Advanced | `statistics-3-advanced/` | Not Started |

**Target Audience:** R programmers who already know how to code but want to learn statistics deeply. They are comfortable with `data.table` and `ggplot2`.

**NOT For:** Beginners learning R. This is a statistics course, not an R course.

**Domain Focus:** Biomedical and bioinformatics applications primarily. All examples draw from health, medicine, and clinical research contexts.

---

## Pedagogical Approach

Every concept MUST be presented using a **four-part teaching method**:

### 1. Prose and Intuition

First, we explain the concept in plain language with analogies, examples, and context. We answer:
- What is this?
- Why does it matter?
- When would you use it?

We build intuition before introducing any formalism. Avoid pretentious or unnecessarily complex language — make PhD-level statistics accessible.

### 2. Visualisation

Second, we demonstrate the concept visually. Graphs, diagrams, and simulations help readers *see* what's happening. Visualisation bridges the gap between intuition and mathematics. All visualisations use `ggplot2`.

### 3. Mathematical Derivation

Third, we present the formal mathematics. Following the French educational tradition, we don't simply state formulae — we *derive* them. We show:
- How the formula was discovered
- Why it takes the form it does
- What each component means

Readers will understand not just *what* to compute, but *why* the computation works.

### 4. Communicating to Stakeholders

Fourth, we teach how to explain the concept to non-statisticians. Every section concludes with practical guidance on:
- How to report results in plain language
- What to include in reports and presentations
- Common misunderstandings to avoid
- How to answer questions from collaborators

After the four-part introduction, we implement the method **from scratch in R**, then show how to use built-in functions efficiently.

---

## Chapter Structure

Each chapter MUST follow this structure:

1. **Opening** — Brief introduction to the chapter's themes (1-2 paragraphs)
2. **Sections** — Each section follows the four-part pedagogical approach
3. **Communicating to Stakeholders** — End-of-chapter section on explaining concepts to non-statisticians
4. **Quick Reference** — Compact summary of formulae and R code for reference manual use

---

## Language and Style

### Spelling and Grammar
- **British Oxford English** throughout all content
- Examples: colour, analyse, summarise, behaviour, randomise, organisation, centre, metre

### Tone
- Professional, academic, but accessible
- Build intuition before formalism
- Avoid pretentious or unnecessarily complex language

### Writing Guidelines
- Use active voice where possible
- Define terms when first introduced
- Use concrete examples before abstract definitions
- Reference biomedical applications throughout

---

## Code Style

### Package Management
```r
# ALWAYS use box::use() for imports — NEVER use library()
box::use(
    data.table,
    ggplot2
)

# Access functions with namespace prefix
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

### Coding Paradigm
- Old-school C-style coding preferred
- Base R for simple operations
- Heavy use of `data.table` for data manipulation
- Implement statistical functions from scratch BEFORE showing built-in versions

### Script Execution
- Use `Rscript` to run R scripts — never use `source()`

### Reproducibility
- Include `set.seed()` for all random examples
- Use consistent seeds across related examples

### Code Block Requirements
- Implement functions from scratch before showing built-in versions
- Heavy commenting explaining the logic
- Show intermediate outputs where instructive

---

## File Format and Structure

### Rmd File Header Template

```yaml
---
title: "Statistics with R I: Foundations"
chapter: "Chapter 1: Introduction to Statistics and Data"
coverImage: 13
author: "Dereck Mezquita"
date: 2025-01-14
tags: [statistics, mathematics, probability, data, R, biomedical]
published: true
comments: true
output:
  html_document:
    keep_md: true
---
```

### Setup Chunk Template

````r
```{r setup, include=FALSE}
# https://bookdown.org/yihui/rmarkdown-cookbook/hook-html5.html
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

### File Naming Convention

Pattern: `{number}-{part}_{course-name}_{chapter-name}_{section-name}.Rmd`

Examples:
- `01-1_statistics-1-foundations_introduction_statistics-and-sampling.Rmd`
- `02-2_statistics-1-foundations_descriptive-numerical_dispersion-position.Rmd`

---

## Directory Structure

```
Statistics-With-R/                      # Organisational folder
├── _passthrough                        # Marker file (content system ignores this folder)
├── TOC.md                              # Master table of contents
├── COURSE-GUIDE.md                     # This document
├── statistics-1-foundations/
│   ├── _series.mdx                     # Course manifest
│   ├── src/                            # Source files
│   │   ├── data/                       # Datasets (CSV files)
│   │   └── *.Rmd                       # R Markdown source files
│   └── 01-introduction/                # Chapter folders (compiled content)
│       └── 01-1_....mdx
├── statistics-2-intermediate/
│   └── _series.mdx
└── statistics-3-advanced/
    └── _series.mdx
```

---

## Datasets

All datasets have been downloaded as CSV files. See `DATA.md` in `statistics-1-foundations/` for complete documentation.

### Primary Datasets

| Dataset | n | Variables | Primary Use |
|---------|---|-----------|-------------|
| NHANES | 10,000 | 76 | Demographics, health, nearly all chapters |
| Palmer Penguins | 344 | 8 | Variable types, regression, ANOVA |
| Gapminder | 1,704 | 6 | Time series, visualisation |

### Medical Datasets

| Dataset | n | Variables | Historical Significance |
|---------|---|-----------|------------------------|
| scurvy | 12 | 8 | First controlled clinical trial (1757) |
| strep_tb | 107 | 13 | First double-blind RCT (1948) |
| blood_storage | 316 | 20 | Retrospective cohort study |
| covid_testing | 15,524 | 17 | Contemporary pandemic data |
| indo_rct | 602 | 33 | NEJM 2012 landmark trial |

### Bioinformatics Datasets

| Dataset | n | Variables | Application |
|---------|---|-----------|-------------|
| RNA-seq Influenza | 32,428 | 19 | Differential expression, multiple testing |
| Breast Cancer Wisconsin | 569 | 32 | Classification, ROC curves |
| Golub Leukemia | 38 | 3,054 | High-dimensional data, FDR |
| Heart Disease Cleveland | 303 | 15 | Logistic regression |
| Pima Diabetes | 768 | 9 | Risk factor analysis |

### Loading Data

```r
box::use(data.table)

# Set data directory
data_dir <- "src/data"

# Load primary datasets
nhanes <- data.table$fread(file.path(data_dir, "primary/nhanes.csv"))
penguins <- data.table$fread(file.path(data_dir, "primary/penguins.csv"))

# Load medical datasets
scurvy <- data.table$fread(file.path(data_dir, "medical/scurvy.csv"))
strep_tb <- data.table$fread(file.path(data_dir, "medical/strep_tb.csv"))
```

---

## Workflow

### Writing Process
1. Write one chapter at a time
2. Follow the four-part pedagogical approach for each concept
3. Submit for user review
4. Proceed to next chapter only after explicit approval

### Quality Checklist

Before submitting any chapter:

- [ ] British Oxford English spelling verified
- [ ] Four-part method used for each concept (prose → visualisation → math → stakeholders)
- [ ] Mathematical derivations shown, not just formulae stated
- [ ] Code implemented from scratch before built-in functions shown
- [ ] `set.seed()` used for all random examples
- [ ] Visualisations have clear titles, labels, and captions
- [ ] "Communicating to Stakeholders" section included
- [ ] "Quick Reference" section included
- [ ] Rmd file knits without errors
- [ ] All code chunks run and produce expected output
- [ ] Examples use specified datasets (NHANES, medicaldata, etc.)

---

## Reference Materials

### For Rmd Format
Look at existing Rmd files in `statistics-with-R/src/` for format reference (header, setup chunk, code chunks, visualisations).

### For Content Structure
The complete table of contents with descriptions is at `TOC.md` in this folder.

### For Dataset Details
Complete dataset documentation is at `statistics-1-foundations/DATA.md`.

---

## Contact

**Project Owner:** Dereck Mezquita
**Repository:** derecksnotes.com

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial consolidation from HANDOFF.md, PREFERENCES.md |
