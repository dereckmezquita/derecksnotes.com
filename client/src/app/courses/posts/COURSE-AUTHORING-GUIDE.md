# Course Authoring Guide for derecksnotes.com

This guide explains how to write and publish courses on derecksnotes.com, specifically for R-based educational content.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Directory Structure](#2-directory-structure)
3. [Required Files](#3-required-files)
4. [Rmd File Structure](#4-rmd-file-structure)
5. [knitr Chunk Options](#5-knitr-chunk-options)
6. [R Output Functions](#6-r-output-functions)
7. [Package Loading with box::use](#7-package-loading-with-boxuse)
8. [Data Loading](#8-data-loading)
9. [Figures and Visualizations](#9-figures-and-visualizations)
10. [Building Courses](#10-building-courses)
11. [Verification Checklist](#11-verification-checklist)

---

## 1. System Overview

The course system transforms R Markdown (`.Rmd`) files into MDX files for the Next.js website.

**Pipeline:**
```
Rmd (source) → knitr execution → MDX (output) + PNG figures
```

**Key Components:**
- `build-courses.R` - Build script that processes Rmd → MDX
- `_series.mdx` - Series-level metadata (course landing page)
- `_meta.yaml` - Chapter-level metadata (required for visibility)
- `data/` - Shared datasets used across courses

---

## 2. Directory Structure

```
client/src/app/courses/posts/<course-collection>/
├── _passthrough                    # Marker: promotes contents to parent
├── data/                           # Shared datasets
│   ├── primary/                    # Main datasets
│   ├── medical/
│   └── ...
├── course-1/                       # Course directory
│   ├── _series.mdx                # REQUIRED: Course metadata & preface
│   ├── src/                       # SOURCE: Rmd files go here
│   │   ├── 01-chapter-name/
│   │   │   ├── 01-1_course_chapter_topic.Rmd
│   │   │   └── 01-2_course_chapter_topic.Rmd
│   │   └── 02-chapter-name/
│   │       └── ...
│   ├── 01-chapter-name/           # OUTPUT: MDX files generated here
│   │   ├── _meta.yaml            # REQUIRED: Chapter metadata
│   │   ├── 01-1_course_chapter_topic.mdx
│   │   └── ...
│   └── ...
└── ...

client/public/courses/
└── course-1/                       # Generated PNG figures served here
    ├── figure-name-1.png
    └── ...
```

**Key Points:**
- Rmd source files go in `src/` subdirectories
- MDX output files are generated in the parent (non-src) directories
- Figures are output to `client/public/courses/<course-name>/`
- Each chapter directory needs a `_meta.yaml` file or it won't appear on the website

---

## 3. Required Files

### 3.1 `_series.mdx` (Course-level)

Located at the root of each course directory. Contains course metadata and preface.

```yaml
---
title: "Course Title"
blurb: "Brief course description"
coverImage: 13
author: "Author Name"
date: "2026-01-15"
tags: [tag1, tag2, tag3]
published: true
comments: true
labels:
    1: "Chapter"
    2: "Part"
---

[Markdown preface content here - course introduction, prerequisites, pedagogical approach]
```

**Required Fields:**
- `title` - Full course title
- `coverImage` - Image reference (number or path)
- `author` - Author name
- `tags` - Array of topic tags
- `published` - `true` to make visible, `false` to hide
- `comments` - Enable/disable comments

**Optional Fields:**
- `blurb` - Short description
- `date` - Publication date
- `labels` - Custom hierarchy labels (default: Chapter, Part, Section, Topic)

### 3.2 `_meta.yaml` (Chapter-level)

Located in each chapter output directory (e.g., `01-introduction/_meta.yaml`).

```yaml
title: 'Chapter Title'
summary: 'Brief description of what this chapter covers.'
published: true
```

**Required Fields:**
- `title` - Chapter title

**Optional Fields:**
- `summary` - Chapter description
- `published` - Override series publication status

**CRITICAL:** Without `_meta.yaml`, the chapter is invisible to the website.

---

## 4. Rmd File Structure

### 4.1 File Naming Convention

```
{chapter}-{part}_{course}_{section}_{topic}.Rmd
```

Examples:
- `01-1_statistics-1-foundations_introduction_statistics-and-sampling.Rmd`
- `05-2_statistics-2-intermediate_glm_logistic-regression.Rmd`

### 4.2 YAML Frontmatter

```yaml
---
title: "Course Title"
chapter: "Chapter 1: Chapter Name"
part: "Part 1: Part Name"
section: "01-1"
coverImage: 13
author: "Author Name"
date: 2025-01-18
tags: [tag1, tag2, tag3]
published: true
comments: true
output:
  html_document:
    keep_md: true
---
```

### 4.3 Standard File Template

````r
---
title: "Course Title"
chapter: "Chapter N: Chapter Title"
part: "Part N: Part Title"
section: "NN-N"
coverImage: 13
author: "Author Name"
date: 2025-01-18
tags: [tag1, tag2, tag3]
published: true
comments: true
output:
  html_document:
    keep_md: true
---

```{r setup, include=FALSE}
# HTML5 figure hook for accessibility
if (knitr::is_html_output()) knitr::knit_hooks$set(
    plot = function(x, options) {
        cap  <- options$fig.cap
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

[Opening paragraph introducing the topic]

```{r packages, message=FALSE, warning=FALSE}
box::use(
    data.table[...],
    ggplot2
)
```

```{r load_data, message=FALSE}
data_dir <- "../../../data"
my_data <- fread(file.path(data_dir, "primary/dataset.csv"))
```

---

## Table of Contents

## N.1 First Section

### N.1.1 Subsection

[Content...]
````

---

## 5. knitr Chunk Options

### 5.1 Global Options (in setup chunk)

```r
knitr::opts_chunk$set(
    dpi = 300,              # High-resolution figures
    fig.width = 10,         # Figure width in inches
    fig.height = 7,         # Figure height in inches
    comment = "",           # No prefix on output (cleaner look)
    warning = FALSE,        # Suppress warnings
    collapse = FALSE,       # Keep code and output in separate blocks
    results = 'hold'        # Collect all output at end of chunk
)
```

### 5.2 Key Options Explained

| Option | Value | Effect |
|--------|-------|--------|
| `collapse` | `FALSE` | Code and output in separate blocks |
| `collapse` | `TRUE` | Code and output interleaved (not recommended) |
| `results` | `'hold'` | All output displayed together at chunk end |
| `results` | `'markup'` | Output after each line (default) |
| `comment` | `""` | No prefix on output |
| `comment` | `"#>"` | Tidyverse-style prefix |
| `comment` | `"##"` | Default knitr prefix |
| `echo` | `TRUE` | Show code |
| `message` | `FALSE` | Suppress messages |
| `warning` | `FALSE` | Suppress warnings |

### 5.3 Per-Chunk Options

````r
```{r chunk_name, fig.cap="Figure caption for accessibility", fig.height=5}
# Code here
```
````

---

## 6. R Output Functions

### 6.1 Recommended: Inline R Code

Best for statistics woven into prose - renders as clean text with no code blocks:

```markdown
The sample mean was `r round(mean(x), 2)` with SD = `r round(sd(x), 2)`.
The test yielded p = `r format.pval(p_value, digits=3)`.
```

### 6.2 `cat()` for Structured Output

Use with `results = 'hold'` for formatted reports:

```r
cat("One-Sample T-Test Results\n")
cat("=========================\n\n")
cat(sprintf("Sample size: n = %d\n", n))
cat(sprintf("Sample mean: %.2f\n", x_bar))
cat(sprintf("P-value: %.4f\n", p_value))
```

### 6.3 `print()` for R Objects

Shows R object structure (includes `[1]` prefix by default):

```r
result <- t.test(x, mu = 100)
print(result)
```

### 6.4 Function Comparison

| Function | Stream | Purpose | Use For |
|----------|--------|---------|---------|
| Inline R | N/A | Dynamic text | Statistics in prose |
| `cat()` | stdout | Formatted output | Structured reports |
| `print()` | stdout | Object display | R objects as-is |
| `message()` | stderr | Diagnostics | Progress info (avoid for results) |

**Note:** `message()` writes to stderr and is meant for informational/diagnostic side-channel communication (like "Loading package..."). Do not use it for primary output - use `cat()` or inline R instead.

---

## 7. Package Loading with box::use

All courses use `box::use()` for explicit imports:

````r
```{r packages, message=FALSE, warning=FALSE}
box::use(
    data.table[...],      # Import all exports with [...]
    ggplot2               # Import entire package
)
```
````

**Patterns:**
- `package[...]` - Import all exports (use for data.table)
- `package` - Import package, access via `package$function()`
- `package[func1, func2]` - Import specific functions

**For ggplot2**, always use explicit prefix:
```r
ggplot2$ggplot(data, ggplot2$aes(x, y)) +
    ggplot2$geom_point() +
    ggplot2$theme_minimal()
```

**External packages** (not compatible with box::use):
```r
library(glmnet)   # For LASSO/ridge
library(MASS)     # For specialized functions
```

---

## 8. Data Loading

### 8.1 Loading Pattern

````r
```{r load_data, message=FALSE}
data_dir <- "../../../data"  # Relative path from src/chapter/

dataset1 <- fread(file.path(data_dir, "primary/dataset1.csv"))
dataset2 <- fread(file.path(data_dir, "medical/dataset2.csv"))

cat("Datasets loaded:\n")
cat("  Dataset 1:", nrow(dataset1), "observations,", ncol(dataset1), "variables\n")
```
````

### 8.2 Path Structure

The `data_dir` path is relative from the Rmd file location in `src/chapter/`:
- From `src/01-introduction/file.Rmd` → `../../../data/`

---

## 9. Figures and Visualizations

### 9.1 Figure Chunk Options

````r
```{r figure_name, fig.cap="Descriptive caption for accessibility"}
# Plotting code
```
````

**Required:** Always include `fig.cap` for accessibility (alt text).

### 9.2 ggplot2 Conventions

```r
ggplot2$ggplot(data, ggplot2$aes(x = var1, y = var2)) +
    ggplot2$geom_point(colour = "#0072B2", alpha = 0.6) +
    ggplot2$geom_smooth(method = "lm", colour = "#D55E00") +
    ggplot2$labs(
        title = "Descriptive Title",
        x = "X-axis Label",
        y = "Y-axis Label"
    ) +
    ggplot2$theme_minimal()
```

### 9.3 Standard Color Palette

| Color | Hex | Use |
|-------|-----|-----|
| Blue | `#0072B2` | Primary |
| Orange | `#D55E00` | Secondary |
| Green | `#009E73` | Tertiary |
| Purple | `#CC79A7` | Quaternary |

### 9.4 Figure Output

Figures are automatically:
1. Generated as PNG at 300 DPI
2. Saved to `client/public/courses/<course-name>/`
3. Paths fixed in MDX to `/courses/<course-name>/filename.png`
4. Wrapped in `<Figure>` component with alt text from `fig.cap`

---

## 10. Building Courses

### 10.1 Build Command

```bash
cd /path/to/derecksnotes.com
Rscript build-courses.R client/src/app/courses/posts/<course-collection>/<course-name>
```

### 10.2 Build Options

```bash
Rscript build-courses.R <course-path> [OPTIONS]

OPTIONS:
  --clean     Remove existing MDX files before building
  --force     Rebuild even if MDX is newer than Rmd
  --dry-run   Show what would be done without doing it
  --quiet     Suppress detailed output
```

### 10.3 What the Build Does

1. Finds all `.Rmd` files in `src/` subdirectories
2. Executes R code via knitr
3. Generates PNG figures in `client/public/courses/<course-name>/`
4. Creates `.mdx` files in chapter directories (parallel to `src/`)
5. Fixes figure paths to web-absolute URLs
6. Logs operations to `rmd-build.log`

### 10.4 Incremental Builds

By default, only files where Rmd is newer than MDX are rebuilt. Use `--force` to rebuild everything.

---

## 11. Verification Checklist

Before publishing, verify:

### File Structure
- [ ] `_series.mdx` exists at course root with correct frontmatter
- [ ] `_meta.yaml` exists in each chapter output directory
- [ ] All Rmd files are in `src/` subdirectories
- [ ] File naming follows convention: `NN-N_course_chapter_topic.Rmd`

### Rmd Content
- [ ] YAML frontmatter complete (title, chapter, part, tags, etc.)
- [ ] Setup chunk has correct knitr options
- [ ] Packages loaded with `box::use()`
- [ ] Data loaded with correct relative paths
- [ ] `## Table of Contents` heading present
- [ ] All figures have `fig.cap` for accessibility
- [ ] No hardcoded absolute paths

### knitr Options
- [ ] `collapse = FALSE` (code and output separate)
- [ ] `results = 'hold'` (output collected at end)
- [ ] `comment = ""` (clean output without `##`)
- [ ] `dpi = 300` (high-resolution figures)

### Build Verification
```bash
# Count total Rmd files
find . -name "*.Rmd" | wc -l

# Verify all have required options
grep -l "collapse = FALSE" $(find . -name "*.Rmd") | wc -l
grep -l "results = 'hold'" $(find . -name "*.Rmd") | wc -l

# Build and check for errors
Rscript build-courses.R <course-path> 2>&1 | grep -E "(ERROR|Error)"

# Verify MDX files generated
find . -name "*.mdx" | wc -l
```

### Website Verification
- [ ] Course appears on courses landing page
- [ ] All chapters visible in navigation
- [ ] Figures load correctly
- [ ] TOC generates properly
- [ ] Code blocks render correctly
- [ ] Output blocks separate from code

---

## Quick Reference Card

### File Locations
| What | Where |
|------|-------|
| Rmd source | `course/src/chapter/*.Rmd` |
| MDX output | `course/chapter/*.mdx` |
| Figures | `client/public/courses/course-name/` |
| Series metadata | `course/_series.mdx` |
| Chapter metadata | `course/chapter/_meta.yaml` |
| Shared data | `data/subdirectory/*.csv` |

### Essential knitr Options
```r
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

### Build Command
```bash
Rscript build-courses.R client/src/app/courses/posts/<course-collection>/<course-name>
```
