# Statistics with R I: Foundations — Developer Handoff Document

## Project Overview

We are building a comprehensive three-level statistics course for R programmers with a focus on biomedical/bioinformatics applications. This document covers **Level 1: Foundations** only.

**Course Title:** Statistics with R I: Foundations

**Target Audience:** R programmers who already know how to code but want to learn statistics deeply. They know data.table and ggplot2.

**NOT for:** Beginners learning R. This is a statistics course, not an R course.

---

## Key Guidelines

### Language and Style
- **British Oxford English** throughout all content (colour, analyse, summarise, etc.)
- Build intuition before formalism — make PhD-level statistics accessible
- Avoid pretentious or unnecessarily complex language

### Pedagogical Approach (THREE-PART METHOD)

Every concept MUST be presented in three parts:

1. **Prose and Intuition** — Explain the concept in plain language with analogies and examples. Answer: What is this? Why does it matter? When would you use it?

2. **Visualisation** — Demonstrate the concept visually with graphs, diagrams, or simulations. This bridges intuition and mathematics.

3. **Mathematical Derivation** — Present formal mathematics following the French educational tradition: don't just state formulae, *derive* them. Show how the formula was discovered, why it takes the form it does.

After the three-part introduction, implement the method **from scratch in R**, then show how to use built-in functions.

### Code Style
- Use `box::use()` for package imports (see existing Rmd files for examples)
- Primary packages: `data.table`, `ggplot2`
- Implement statistical functions from scratch BEFORE showing built-in versions
- Code should prioritise clarity over efficiency
- Include `set.seed()` for reproducibility in all random examples

### Chapter Structure
Each chapter ends with:
- **"Communicating to Stakeholders"** section — How to explain the concept to non-statisticians
- **"Quick Reference"** section — Compact summary of formulae and R code for reference manual use

---

## Directory Structure

```
client/src/app/courses/posts/
├── statistics-1-foundations/     # NEW COURSE (this one)
│   ├── toc.md                    # ✅ COMPLETE - Table of Contents
│   ├── DATA.md                   # 🔲 TODO - Dataset acquisition instructions
│   ├── HANDOFF.md                # This document
│   └── src/
│       ├── 00_preface.Rmd        # 🔲 TODO
│       ├── 01_introduction-to-statistics-and-data.Rmd  # 🔲 TODO (START HERE)
│       ├── 02_descriptive-statistics-numerical.Rmd     # 🔲 TODO
│       └── ... (chapters 03-15)
│
├── statistics-2-intermediate/    # Empty - future course
├── statistics-3-advanced/        # Empty - future course
│
└── statistics-with-R/            # OLD COURSE - Use as reference for format only
    ├── toc.md
    └── src/
        └── *.Rmd                 # Reference these for Rmd format structure
```

---

## Rmd File Format

Use this exact header template for all Rmd files:

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

Setup chunk (copy exactly):

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

Package imports pattern:

```r
box::use(
    data.table[as.data.table, .SD, .N, `:=`],
    ggplot2[...]
)
```

---

## Datasets to Use

### Primary Datasets (R Packages - No Downloads Needed)

1. **NHANES** (CRAN package `NHANES`)
   - 10,000 observations, 75 variables
   - Demographics, physical measurements, health indicators, lab values
   - Use for: Variable types, descriptive stats, regression, ANOVA

2. **medicaldata** (CRAN package `medicaldata`)
   - `scurvy` (n=12): James Lind's 1757 trial — small samples, ordinal data
   - `strep_tb` (n=109): 1948 Streptomycin trial — binary outcomes
   - `blood_storage` (n=316): Prostate cancer cohort — regression, survival
   - `covid_testing` (n=13,000+): Contemporary data — large samples, missing data

3. **Simulated Data**
   - Generate custom datasets for specific teaching scenarios
   - Control exact properties (normality, effect sizes, sample sizes)

### Dataset Usage by Chapter

| Chapter | Primary Dataset | Purpose |
|---------|-----------------|---------|
| Ch 1: Introduction | NHANES | Variable types, data structure examples |
| Ch 2: Descriptive Numerical | NHANES, blood_storage | Central tendency, spread, outliers |
| Ch 3: Visualisation | NHANES, covid_testing | All plot types |
| Ch 4: Probability | Simulated, scurvy | Diagnostic testing, Bayes theorem |
| Ch 5: Distributions | Simulated, NHANES | Fitting distributions to real data |
| Ch 6: Sampling/CLT | Simulated from NHANES | Demonstrating sampling distributions |
| Ch 7: Point Estimation | NHANES | MLE examples |
| Ch 8: Confidence Intervals | NHANES, strep_tb | CI calculation and interpretation |
| Ch 9-10: Hypothesis Testing | strep_tb, NHANES | t-tests, proportion tests |
| Ch 11: Chi-square/Non-param | scurvy, strep_tb | Categorical analysis |
| Ch 12: Regression | NHANES, blood_storage | Linear regression |
| Ch 13: ANOVA | NHANES, simulated | Group comparisons |
| Ch 14: Experimental Design | scurvy, strep_tb | Classic trial examples |
| Ch 15: Multiple Testing | covid_testing | FDR, reproducibility |

---

## TODO List — Ordered by Priority

### Phase 1: Setup (Do First)

- [ ] **Create DATA.md** — Instructions for installing required R packages
  ```r
  install.packages(c("NHANES", "medicaldata", "data.table", "ggplot2", "box"))
  ```
  Include brief description of each dataset that will be used.

- [ ] **Create src/ directory** in statistics-1-foundations/

- [ ] **Test dataset access** — Write a quick R script to verify all datasets load correctly

### Phase 2: Chapter 1 Writing (Current Priority)

- [ ] **Create 00_preface.Rmd** — Course introduction (~500 words)
  - Who the course is for
  - Prerequisites
  - How to use the course
  - Three-part pedagogical approach explanation

- [ ] **Create 01_introduction-to-statistics-and-data.Rmd** — Full Chapter 1
  Write section by section:

  - [ ] Section 1.1: What Is Statistics? (~600 words)
    - Define statistics as learning from data under uncertainty
    - Brief history: census → probability theory → modern computational statistics
    - Descriptive vs inferential statistics
    - Role in biomedical research

  - [ ] Section 1.2: Populations and Samples (~800 words)
    - Define population of interest
    - Why we sample
    - Parameters (μ, σ, π) vs Statistics (x̄, s, p̂)
    - Notation conventions
    - **Visualisation:** Diagram showing sampling from population

  - [ ] Section 1.3: Types of Variables (~700 words)
    - Quantitative: continuous vs discrete
    - Qualitative: nominal vs ordinal
    - Scales of measurement (nominal, ordinal, interval, ratio)
    - **Example:** Classify variables from NHANES dataset
    - **Visualisation:** Variable type decision flowchart

  - [ ] Section 1.4: Data Collection Methods (~800 words)
    - Observational studies (cross-sectional, case-control, cohort)
    - Experimental studies (RCTs)
    - Association vs Causation — critical distinction
    - **Examples:** Real biomedical studies

  - [ ] Section 1.5: Sampling Methods (~900 words)
    - Probability sampling: simple random, stratified, cluster, systematic
    - Non-probability sampling: convenience, quota, snowball
    - Sampling bias
    - **Code:** Implement sampling functions from scratch
    - **Visualisation:** Sampling method illustrations

  - [ ] Section 1.6: Sources of Bias and Variability (~700 words)
    - Selection bias
    - Measurement bias (systematic error)
    - Response bias
    - Survivorship bias
    - Random variability vs systematic bias
    - **Visualisation:** Target diagram (accuracy vs precision)

  - [ ] Section 1.7: Reproducibility (~600 words)
    - Why reproducibility matters
    - set.seed() demonstration
    - Project organisation best practices
    - R Markdown/Quarto introduction
    - **Communicating to Stakeholders** section
    - **Quick Reference** section

### Phase 3: Subsequent Chapters (After Chapter 1 Complete)

- [ ] Chapter 2: Descriptive Statistics — Numerical
- [ ] Chapter 3: Descriptive Statistics — Visualisation
- [ ] Chapter 4: Probability Foundations
- [ ] Chapter 5: Random Variables and Distributions
- [ ] Chapter 6: Sampling Distributions and CLT
- [ ] Chapter 7: Point Estimation
- [ ] Chapter 8: Confidence Intervals
- [ ] Chapter 9: Hypothesis Testing Foundations
- [ ] Chapter 10: Tests for Means and Proportions
- [ ] Chapter 11: Chi-Square and Non-Parametric Tests
- [ ] Chapter 12: Linear Regression
- [ ] Chapter 13: ANOVA
- [ ] Chapter 14: Experimental Design
- [ ] Chapter 15: Multiple Comparisons and Reproducibility

### Phase 4: Appendices

- [ ] Appendix A: R Programming for Statistical Computing
- [ ] Appendix B: Mathematical Foundations
- [ ] Appendix C: Probability Distribution Reference
- [ ] Appendix D: Statistical Tables
- [ ] Appendix E: Datasets Used
- [ ] Appendix F: Glossary
- [ ] Appendix G: Quick Reference Cards

---

## Reference Files

### For Rmd Format
Look at: `client/src/app/courses/posts/statistics-with-R/src/`
- `0_statistics-with-R_preface.Rmd` — Header and setup chunk format
- `1_statistics-with-R_foundations-of-statistical-thinking_part2.Rmd` — Content structure, code chunks, visualisations

### For TOC Structure
The complete table of contents with descriptions for every section is at:
`client/src/app/courses/posts/statistics-1-foundations/toc.md`

This file contains 1-2 sentence descriptions for each subsection that should guide your writing.

---

## Quality Checklist

Before submitting any chapter:

- [ ] British Oxford English spelling verified (colour, analyse, summarise, behaviour, etc.)
- [ ] Three-part method used for each concept (prose → visualisation → math)
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

## Contact

Project Owner: Dereck Mezquita
Repository: derecksnotes.com

---

## Notes from Previous Work

- The course was originally planned as one massive course but has been split into three levels
- The old `statistics-with-R/` directory contains reference material but should not be modified
- The three new directories (`statistics-1-foundations/`, `statistics-2-intermediate/`, `statistics-3-advanced/`) are for the new course structure
- Only Level 1 should be worked on until complete
- Bioinformatics and medicine are the primary domains for examples
- Finance examples will be in a separate future course
