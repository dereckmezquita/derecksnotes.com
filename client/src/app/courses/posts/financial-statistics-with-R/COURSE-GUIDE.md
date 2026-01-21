# Algorithmic Trading with R — Course Development Guide

This document consolidates all development guidelines, pedagogical approach, code style, and data documentation for the Algorithmic Trading with R course.

---

## Course Overview

**Full Title:** Algorithmic Trading with R — A Rigorous Course on Building Systematic Trading Strategies

**Structure:** Two-part course structure. Part I is self-contained — after completing it, you can build and deploy profitable trading strategies. Part II extends with advanced methods and specialised markets.

| Part | Title | Folder | Chapters | Status |
|------|-------|--------|----------|--------|
| — | Prologue: Finance for Statisticians | `financial-statistics-1-foundations/` | 0 | Not Started |
| I | Foundations and Core Strategies | `financial-statistics-1-foundations/` | 1–12 | Not Started |
| II | Advanced Methods and Specialised Markets | `financial-statistics-2-advanced/` | 13–23 | Not Started |

**Target Audience:** PhD-level practitioners who want to understand *why* trading strategies work, not just *how* to implement them. Readers are comfortable with R programming, basic statistics (probability, regression), and have familiarity with financial markets.

**NOT For:** Beginners learning R or basic statistics. This is not an introduction to finance.

**Domain Focus:** Systematic trading strategies that generate profit. Every concept connects directly to making money: trend following, mean reversion, factor strategies, volatility trading, and machine learning approaches. Wall Street quant style.

---

## Pedagogical Approach

Every concept MUST be presented using a **five-part teaching method**:

### 1. Why It Works

First, explain the economic or behavioural rationale behind the strategy or concept. We answer:
- What market inefficiency or risk premium does this exploit?
- What behavioural bias or structural feature creates this opportunity?
- Why hasn't competition eliminated it?

This establishes the *economic foundation* before any technical details.

### 2. Visual Evidence

Second, demonstrate the concept visually with real data. Graphs, simulations, and empirical charts show:
- Historical performance of the strategy
- Distribution of returns
- Key patterns that the strategy exploits

Visualisation bridges intuition and mathematics. All visualisations use `ggplot2`.

### 3. The Mathematics

Third, present the formal mathematics with **intuitive derivations**. Following the French educational tradition, we don't state formulae — we *derive* them step by step. We show:
- How the formula arises naturally from the problem
- What each component means
- Why the formula takes the form it does

**Medium-level maths:** Accessible to PhD-level practitioners. Every formula is derived from first principles with enough detail for confident implementation, but without excessive abstraction.

### 4. Implementation

Fourth, implement the concept **from scratch in R**. Building from scratch demonstrates understanding and reveals the mechanics. Only after implementing from scratch do we compare to existing libraries.

**Code standards:**
- Use `box::use()` for all imports
- Use `data.table` for data manipulation (NEVER tidyverse)
- Use `ggplot2` for visualisation
- Heavy commenting explaining the logic
- Show intermediate outputs where instructive

### 5. Trading Application

Fifth, apply the concept to a **realistic trading strategy with transaction costs**. Every concept concludes with:
- A complete, tradeable implementation
- Realistic cost assumptions
- Performance analysis
- Practical considerations (capacity, decay, risks)

This ensures theory connects to profit.

---

## Chapter Structure

Each Rmd file MUST follow this structure:

1. **Opening** — Brief introduction to the section's themes (1-2 paragraphs)
2. **Sections** — Each section follows the five-part pedagogical approach
3. **Quick Reference** — Compact summary of formulae and R code for reference

Each section within a chapter follows:
```
## N.X Topic Name

### N.X.1 Why It Works
[Economic/behavioural rationale]

### N.X.2 Visual Evidence
[Charts, simulations, empirical demonstration]

### N.X.3 The Mathematics
[Derivation from first principles]

### N.X.4 Implementation
[R code from scratch]

### N.X.5 Trading Application
[Complete strategy with costs]
```

---

## Language and Style

### Spelling and Grammar
- **British Oxford English** throughout all content
- Examples: colour, analyse, summarise, behaviour, randomise, organisation, centre, metre

### Tone
- Professional, rigorous, but accessible
- Build intuition before formalism
- Focus on *why* things work, not just *how*
- Be direct about what makes money and what doesn't

### Writing Guidelines
- Use active voice where possible
- Define terms when first introduced
- Use concrete examples before abstract definitions
- Always connect concepts to profit/loss implications

---

## Code Style

### Package Management

```r
# ALWAYS use box::use() for imports
box::use(
    data.table,           # Import all exports then use functions as: data.table$fread
    fs[ file_info ]       # If only some functions required import specifically
)

# Access ggplot2 functions with namespace prefix
ggplot2$ggplot(dt, ggplot2$aes(x = date, y = returns)) +
    ggplot2$geom_line() +
    ggplot2$theme_minimal()
```

### Core Packages

| Package | Purpose |
|---------|---------|
| `data.table` | Main data package to use (NEVER tidyverse) |
| `ggplot2` | Visualisation |
| `box` | Package imports |
| `fs` | File system operations |
| `lubridate` | Date-time handling |
| `Rcpp` | C++ integration for performant processing |
| `quantmod` | Market data retrieval |
| `xts` / `zoo` | Time series handling |

We can use quantmod or xts/zoo etc but we want to avoid overuse as the goal of the course is to demonstrate the concepts from first principles so a raw implementation should be shown.

### Additional Packages (as needed)

| Package | Purpose |
|---------|---------|
| `rugarch` | GARCH models (after implementing from scratch) |
| `glmnet` | LASSO/ridge regression |
| `TTR` | Technical indicators (for verification only) |
| `PerformanceAnalytics` | Performance metrics (for verification only) |

### Coding Paradigm
- Old-school C-style coding preferred
- Base R for simple operations
- Heavy use of `data.table` for data manipulation
- **Implement from scratch BEFORE showing library versions**

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
title: "Algorithmic Trading with R"
chapter: "Chapter 1: Financial Data and Returns"
part: "Part 1: Market Structure and Data"
section: "01-1"
coverImage: 13
author: "Dereck Mezquita"
date: 2026-01-20
tags: [algorithmic-trading, quantitative-finance, R, statistics]
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
````

### File Naming Convention

Pattern: `{chapter}-{part}_{course-name}_{chapter-name}_{section-name}.Rmd`

Examples:
- `01-1_financial-statistics-1-foundations_data_market-structure.Rmd`
- `05-2_financial-statistics-1-foundations_sizing_kelly.Rmd`
- `07-3_financial-statistics-1-foundations_meanrev_pairs.Rmd`

---

## Directory Structure

```
financial-statistics-with-R/                    # Course collection folder
├── _passthrough                                # Marker file (promotes contents)
├── TOC.md                                      # Master table of contents
├── COURSE-GUIDE.md                             # This document
│
├── financial-statistics-1-foundations/         # Part I: Chapters 1-12
│   ├── _series.mdx                             # Course manifest
│   ├── DATA.md                                 # Dataset documentation
│   ├── src/
│   │   ├── data/                               # Downloaded datasets
│   │   │   ├── market/                         # Stocks, ETFs, indices
│   │   │   ├── factors/                        # Fama-French factors
│   │   │   ├── crypto/                         # Cryptocurrency data
│   │   │   ├── forex/                          # Currency pairs
│   │   │   ├── volatility/                     # VIX data
│   │   │   ├── download_all.R                  # Master download script
│   │   │   ├── download_datasets.R             # Market data download
│   │   │   ├── download_factor_data.R          # Fama-French download
│   │   │   └── download_crypto_forex.R         # Crypto/forex download
│   │   └── [chapter-folders]/
│   │       └── *.Rmd                           # R Markdown source files
│   └── [chapter-folders]/                      # Compiled content
│       ├── _meta.yaml
│       └── *.mdx
│
└── financial-statistics-2-advanced/            # Part II: Chapters 13-21
    ├── _series.mdx                             # Course manifest
    ├── src/
    │   ├── data/                               # Additional datasets
    │   │   ├── satellite/                      # Satellite imagery data
    │   │   ├── social/                         # Social media sentiment
    │   │   ├── alternative/                    # Other alt data
    │   │   └── emerging/                       # Emerging market data
    │   └── [chapter-folders]/
    │       └── *.Rmd                           # R Markdown source files
    └── [chapter-folders]/                      # Compiled content
        ├── _meta.yaml
        └── *.mdx
```
