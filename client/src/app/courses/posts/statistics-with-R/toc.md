# Statistics with R — Master Table of Contents

A comprehensive three-part course on statistics using R programming, designed for those already proficient in R who want to deeply understand statistical thinking and methods.

---

## Course Structure

| Part | Title | Status | Chapters |
|------|-------|--------|----------|
| I | Foundations | In Progress | 15 |
| II | Intermediate | Not Started | TBD |
| III | Advanced | Not Started | TBD |

---

## Part I: Foundations

**Folder:** `statistics-1-foundations/`
**Status:** In Progress (2/15 chapters complete)

A rigorous introduction to statistical thinking covering descriptive statistics, probability, distributions, sampling theory, estimation, hypothesis testing, and introductory regression/ANOVA.

### Chapters

| Ch | Topic | Parts | Status |
|----|-------|-------|--------|
| 1 | Introduction to Statistics and Data | 3 | COMPLETE |
| 2 | Descriptive Statistics — Numerical Summaries | 3 | COMPLETE |
| 3 | Descriptive Statistics — Visualisation | 3 | Not Started |
| 4 | Probability — Foundations | 3 | Not Started |
| 5 | Random Variables and Distributions | 4 | Not Started |
| 6 | Sampling Distributions and CLT | 2 | Not Started |
| 7 | Point Estimation | 2 | Not Started |
| 8 | Confidence Intervals | 3 | Not Started |
| 9 | Hypothesis Testing — Foundations | 2 | Not Started |
| 10 | Hypothesis Tests for Means and Proportions | 2 | Not Started |
| 11 | Chi-Square Tests and Non-Parametric Methods | 2 | Not Started |
| 12 | Introduction to Linear Regression | 3 | Not Started |
| 13 | Analysis of Variance (ANOVA) | 2 | Not Started |
| 14 | Introduction to Experimental Design | 2 | Not Started |
| 15 | Multiple Comparisons and Reproducibility | 3 | Not Started |

### Detailed Progress

#### Chapter 1: Introduction to Statistics and Data
- [x] `01-1` What Is Statistics? / Populations and Samples
- [x] `01-2` Types of Variables / Data Collection Methods
- [x] `01-3` Sampling Methods / Bias / Reproducibility

#### Chapter 2: Descriptive Statistics — Numerical Summaries
- [x] `02-1` Central Tendency (Mean, Median, Mode)
- [x] `02-2` Dispersion and Position (Variance, SD, Percentiles)
- [x] `02-3` Shape, Grouped Data, Outliers

#### Chapter 3: Descriptive Statistics — Visualisation
- [ ] `03-1` Principles / Categorical / Univariate Plots
- [ ] `03-2` Bivariate / Grouped Visualisations
- [ ] `03-3` QQ Plots / Time Series / Advanced Topics

#### Chapter 4: Probability — Foundations
- [ ] `04-1` What Is Probability? / Sample Spaces / Basic Rules
- [ ] `04-2` Conditional Probability / Independence / Bayes' Theorem
- [ ] `04-3` Counting Methods / Simulation

#### Chapter 5: Random Variables and Distributions
- [ ] `05-1` Random Variables / Bernoulli / Binomial
- [ ] `05-2` Poisson / Other Discrete
- [ ] `05-3` Continuous / Uniform / Normal
- [ ] `05-4` Exponential / Gamma / Beta / Related

#### Chapter 6: Sampling Distributions and CLT
- [ ] `06-1` Sampling Distribution of the Mean / CLT
- [ ] `06-2` Proportion / Variance / t-Distribution

#### Chapter 7: Point Estimation
- [ ] `07-1` Properties of Estimators / Method of Moments
- [ ] `07-2` Maximum Likelihood / Comparison / Robust

#### Chapter 8: Confidence Intervals
- [ ] `08-1` Interpretation / CIs for Means
- [ ] `08-2` Proportions / Differences / Variance
- [ ] `08-3` Sample Size / Bootstrap

#### Chapter 9: Hypothesis Testing — Foundations
- [ ] `09-1` Logic / Test Statistics / P-Values / Errors
- [ ] `09-2` Power / Effect Sizes / Controversy

#### Chapter 10: Hypothesis Tests for Means and Proportions
- [ ] `10-1` Z-Test / t-Tests
- [ ] `10-2` Proportions / Variance Tests

#### Chapter 11: Chi-Square Tests and Non-Parametric Methods
- [ ] `11-1` Chi-Square / Fisher / McNemar / Normality
- [ ] `11-2` Rank Tests / Permutation Tests

#### Chapter 12: Introduction to Linear Regression
- [ ] `12-1` Model / Estimation / Fit
- [ ] `12-2` Inference / Prediction
- [ ] `12-3` Diagnostics / Transformations

#### Chapter 13: Analysis of Variance (ANOVA)
- [ ] `13-1` One-Way ANOVA / F-Test
- [ ] `13-2` Post-Hoc / Contrasts / ANOVA as Linear Model

#### Chapter 14: Introduction to Experimental Design
- [ ] `14-1` Principles / Common Designs
- [ ] `14-2` Power / Validity / Ethics

#### Chapter 15: Multiple Comparisons and Reproducibility
- [ ] `15-1` Multiple Testing / FDR
- [ ] `15-2` Reproducibility Crisis / QRPs
- [ ] `15-3` Solutions / Best Practices

---

## Part II: Intermediate

**Folder:** `statistics-2-intermediate/`
**Status:** Not Started

Building on the foundations to cover multiple regression, generalised linear models, mixed effects, and more advanced inferential techniques.

### Planned Topics

- Multiple Linear Regression
- Generalised Linear Models (Logistic, Poisson regression)
- Mixed Effects Models
- Time Series Analysis (Introduction)
- Bayesian Inference (Introduction)
- Survival Analysis (Introduction)
- Multivariate Methods (Introduction)

---

## Part III: Advanced

**Folder:** `statistics-3-advanced/`
**Status:** Not Started

Advanced topics including machine learning foundations, causal inference, computational statistics, and specialised applications.

### Planned Topics

- Statistical Learning and Prediction
- Causal Inference
- Advanced Bayesian Methods
- Computational Statistics (Bootstrap, MCMC)
- High-Dimensional Data Analysis
- Bioinformatics Applications
- Financial Applications

---

## Working Files

These files are for course development and are not published:

- `TOC.md` — This file (master table of contents)
- `toc-old.md` — Original single-course outline
- `src/` — Source R Markdown files and data
- Individual course `toc.md` files — Detailed per-course outlines
- `HANDOFF.md`, `DATA.md`, `PREFERENCES.md` — Development notes

---

## Notes

- Each chapter follows the three-part pedagogical approach: Prose/Intuition, Visualisation, Mathematical Derivation
- All R code is implemented from scratch before using built-in functions
- Uses biomedical and clinical examples throughout
- Written in British Oxford English
