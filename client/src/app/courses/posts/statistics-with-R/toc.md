# Statistics with R — Master Table of Contents

A comprehensive three-part course on statistics using R programming, designed for those already proficient in R who want to deeply understand statistical thinking and methods. Every concept follows our four-part pedagogical approach: Prose/Intuition, Visualisation, Mathematical Derivation, and Communicating to Stakeholders.

---

## Course Structure

| Part | Title | Folder | Chapters | Status |
|------|-------|--------|----------|--------|
| I | Foundations | `statistics-1-foundations/` | 15 | Complete (15/15) |
| II | Intermediate | `statistics-2-intermediate/` | 10 | Not Started |
| III | Advanced | `statistics-3-advanced/` | 8 | Not Started |

---

# Part I: Foundations

**Folder:** `statistics-1-foundations/`
**Status:** In Progress (7/15 chapters complete)

A rigorous introduction to statistical thinking covering descriptive statistics, probability, distributions, sampling theory, estimation, hypothesis testing, and introductory regression/ANOVA.

---

## Chapter 1: Introduction to Statistics and Data ✓

*This foundational chapter establishes the vocabulary and conceptual framework for statistical thinking.*

**Files:**
- `01-1_statistics-1-foundations_introduction_statistics-and-sampling.Rmd`
- `01-2_statistics-1-foundations_introduction_variables-and-collection.Rmd`
- `01-3_statistics-1-foundations_introduction_sampling-bias-reproducibility.Rmd`

### Part 1 (`01-1`): What Is Statistics? / Populations and Samples

- [x] **1.1 What Is Statistics?** — The science of learning from data under uncertainty.
  - [x] 1.1.1 Statistics as the Science of Learning from Data — Why uncertainty is inherent in all empirical knowledge.
  - [x] 1.1.2 A Brief History — From census-taking through probability theory to modern computational statistics.
  - [x] 1.1.3 Descriptive vs Inferential Statistics — Summarising data vs drawing conclusions about populations.
  - [x] 1.1.4 The Role of Statistics in Biomedical Research — Evidence-based medicine applications.
- [x] **1.2 Populations and Samples** — The fundamental distinction underpinning inference.
  - [x] 1.2.1 Defining the Population of Interest — Precise definition of the target group.
  - [x] 1.2.2 Why We Sample — Practical and theoretical reasons for sampling.
  - [x] 1.2.3 Parameters vs Statistics — Greek letters (μ, σ) for parameters; Roman letters (x̄, s) for statistics.
  - [x] 1.2.4 The Goal of Inference — Using sample data to make statements about populations.
  - [x] 1.2.5 Notation Conventions — Standardised notation throughout the course.
- [x] **Communicating to Stakeholders** — Explaining statistics and sampling to collaborators.
- [x] **Quick Reference** — Key terms and notation conventions.

### Part 2 (`01-2`): Types of Variables / Data Collection Methods

- [x] **1.3 Types of Variables** — Taxonomy determining which methods are appropriate.
  - [x] 1.3.1 Quantitative Variables — Continuous (any value) and discrete (countable) variables.
  - [x] 1.3.2 Qualitative (Categorical) Variables — Nominal (no order) and ordinal (meaningful order).
  - [x] 1.3.3 Scales of Measurement — Stevens' four levels: nominal, ordinal, interval, ratio.
  - [x] 1.3.4 Identifying Variable Types in Practice — Classifying NHANES variables.
- [x] **1.4 Data Collection Methods** — How data are gathered and implications for causation.
  - [x] 1.4.1 Observational Studies — Cross-sectional, case-control, and cohort designs.
  - [x] 1.4.2 Experimental Studies — Randomised controlled trials as the gold standard.
  - [x] 1.4.3 Association vs Causation — Only experiments can establish causation.
- [x] **Communicating to Stakeholders** — Explaining variable types and study designs.
- [x] **Quick Reference** — Variable classification flowchart.

### Part 3 (`01-3`): Sampling Methods / Bias / Reproducibility

- [x] **1.5 Sampling Methods** — Probability and non-probability approaches.
  - [x] 1.5.1 Probability Sampling Methods — Simple random, stratified, cluster, systematic.
  - [x] 1.5.2 Non-Probability Sampling Methods — Convenience, quota, snowball.
  - [x] 1.5.3 Sampling Bias and How to Minimise It — Sources and remediation.
  - [x] 1.5.4 Implementing Random Sampling in R — Using `sample()`.
- [x] **1.6 Sources of Bias and Variability** — Major threats to valid inference.
  - [x] 1.6.1 Selection Bias — Non-representative samples.
  - [x] 1.6.2 Measurement Bias — Systematic errors.
  - [x] 1.6.3 Response Bias — Question wording, social desirability, recall.
  - [x] 1.6.4 Survivorship Bias — Observing only "survivors."
  - [x] 1.6.5 Random Variability vs Systematic Bias — Accuracy vs precision.
- [x] **1.7 Statistical Software and Reproducibility** — Tools for reproducible analysis.
  - [x] 1.7.1 Why Reproducibility Matters — The reproducibility crisis.
  - [x] 1.7.2 Setting Seeds — `set.seed()` for reproducible random processes.
  - [x] 1.7.3 Organising Statistical Projects — Best practices.
  - [x] 1.7.4 R Markdown for Reproducible Reports — Literate programming.
- [x] **Communicating to Stakeholders** — Study design limitations and reproducibility.
- [x] **Quick Reference** — Sampling methods and bias types.

---

## Chapter 2: Descriptive Statistics — Numerical Summaries ✓

*This chapter covers the fundamental numerical summaries: centre, spread, and shape.*

**Files:**
- `02-1_statistics-1-foundations_descriptive-numerical_central-tendency.Rmd`
- `02-2_statistics-1-foundations_descriptive-numerical_dispersion-position.Rmd`
- `02-3_statistics-1-foundations_descriptive-numerical_shape-grouped-outliers.Rmd`

### Part 1 (`02-1`): Measures of Central Tendency

- [x] **2.1 Measures of Central Tendency** — Mean, median, and mode.
  - [x] 2.1.1 The Arithmetic Mean — The "balance point," key properties.
  - [x] 2.1.2 The Median — Minimises absolute deviations, robust to outliers.
  - [x] 2.1.3 The Mode — Most frequent value, for categorical data.
  - [x] 2.1.4 Comparing Mean, Median, and Mode — Effect of skewness.
  - [x] 2.1.5 Other Means — Weighted, trimmed, geometric, harmonic.
- [x] **Communicating to Stakeholders** — Which average to report and why.
- [x] **Quick Reference** — Central tendency formulae.

### Part 2 (`02-2`): Measures of Dispersion and Position

- [x] **2.2 Measures of Dispersion (Spread)** — Quantifying spread.
  - [x] 2.2.1 Range and Interquartile Range — Simple measures.
  - [x] 2.2.2 Variance — Average squared deviation, Bessel's correction.
  - [x] 2.2.3 Standard Deviation — In original units.
  - [x] 2.2.4 Coefficient of Variation — Scale-free comparison.
  - [x] 2.2.5 Mean Absolute Deviation — Robust alternative.
  - [x] 2.2.6 Robust Measures of Spread — Median absolute deviation.
- [x] **2.3 Measures of Position** — Where observations fall.
  - [x] 2.3.1 Percentiles and Quantiles — Formal definitions.
  - [x] 2.3.2 Quartiles and Five-Number Summary — Compact snapshot.
  - [x] 2.3.3 Z-Scores — Standard deviations from the mean.
  - [x] 2.3.4 Percentile Ranks — Clinical reference ranges.
- [x] **Communicating to Stakeholders** — Spread and percentiles in reports.
- [x] **Quick Reference** — Dispersion and position formulae.

### Part 3 (`02-3`): Shape, Grouped Data, Outliers

- [x] **2.4 Measures of Shape** — Beyond centre and spread.
  - [x] 2.4.1 Skewness — Standardised third moment, asymmetry.
  - [x] 2.4.2 Kurtosis — Standardised fourth moment, tail heaviness.
  - [x] 2.4.3 Why Shape Matters — Choice of statistics and tests.
- [x] **2.5 Summarising Grouped Data** — Statistics from frequency tables.
  - [x] 2.5.1 Frequency Distributions — Relative and cumulative.
  - [x] 2.5.2 Computing Statistics from Grouped Data — Class midpoints.
  - [x] 2.5.3 Efficient Grouped Summaries with data.table — Fast calculations.
- [x] **2.6 Detecting Outliers** — Identifying unusual observations.
  - [x] 2.6.1 What Is an Outlier? — Context-dependent interpretation.
  - [x] 2.6.2 The IQR Rule (Tukey's Fences) — 1.5×IQR rule.
  - [x] 2.6.3 Z-Score Method — |z| > 3.
  - [x] 2.6.4 Modified Z-Score Using MAD — Robust alternative.
  - [x] 2.6.5 Outliers in Biomedical Data — When to remove vs retain.
- [x] **Communicating to Stakeholders** — Summary tables and outlier decisions.
- [x] **Quick Reference** — Shape and outlier detection.

---

## Chapter 3: Descriptive Statistics — Visualisation ✓

*Graphical methods for exploring and presenting data.*

**Files:**
- `03-1_statistics-1-foundations_visualisation_principles-categorical-univariate.Rmd`
- `03-2_statistics-1-foundations_visualisation_bivariate-grouped.Rmd`
- `03-3_statistics-1-foundations_visualisation_qq-timeseries-advanced.Rmd`

### Part 1 (`03-1`): Principles / Categorical / Univariate Plots

- [x] **3.1 Principles of Statistical Graphics** — Theoretical foundation.
  - [x] 3.1.1 The Grammar of Graphics Philosophy — Layered grammar in `ggplot2`.
  - [x] 3.1.2 Choosing the Right Plot — Decision framework by variable type.
  - [x] 3.1.3 Principles of Effective Visualisation — Tufte's principles, data-ink ratio.
  - [x] 3.1.4 Common Mistakes — Truncated axes, dual y-axes, 3D effects.
- [x] **3.2 Visualising Categorical Data** — Categories and groups.
  - [x] 3.2.1 Bar Charts — Simple, grouped, stacked.
  - [x] 3.2.2 Pie Charts and Waffle Charts — When pie charts fail.
  - [x] 3.2.3 Mosaic Plots — Two categorical variables.
- [x] **3.3 Visualising Quantitative Data — Single Variable** — Distributions.
  - [x] 3.3.1 Histograms — Bin width formulae (Sturges, Scott, Freedman-Diaconis).
  - [x] 3.3.2 Density Plots — Kernel density estimation.
  - [x] 3.3.3 Box Plots — Five-number summary.
  - [x] 3.3.4 Violin Plots — Density + box plot.
  - [x] 3.3.5 Strip Plots and Jittered Dot Plots — All data points.
  - [x] 3.3.6 Stem-and-Leaf Plots — Classic display.
  - [x] 3.3.7 ECDF Plots — Cumulative distribution.
- [x] **Communicating to Stakeholders** — Plot choice for different audiences.
- [x] **Quick Reference** — Plot selection guide with ggplot2 syntax.

### Part 2 (`03-2`): Bivariate / Grouped Visualisations

- [x] **3.4 Two Quantitative Variables** — Relationships.
  - [x] 3.4.1 Scatter Plots — Handling overplotting.
  - [x] 3.4.2 Trend Lines — Linear and LOESS.
  - [x] 3.4.3 Scatter Plot Matrices — Pairwise relationships.
- [x] **3.5 Relationships with Categorical Variables** — Group comparisons.
  - [x] 3.5.1 Grouped Box Plots and Violin Plots — Side-by-side displays.
  - [x] 3.5.2 Faceting (Small Multiples) — `facet_wrap()` and `facet_grid()`.
  - [x] 3.5.3 Colour and Shape Encoding — Accessibility considerations.
- [x] **3.6 Visualising Correlation** — Correlation patterns.
  - [x] 3.6.1 Correlation Matrices and Heatmaps — Diverging colour scales.
- [x] **Communicating to Stakeholders** — Presenting relationships.
- [x] **Quick Reference** — Bivariate visualisation syntax.

### Part 3 (`03-3`): QQ Plots / Time Series / Advanced

- [x] **3.7 QQ Plots** — Assessing distributional assumptions.
  - [x] 3.7.1 Comparing Data to a Theoretical Distribution — Points on a line.
  - [x] 3.7.2 Constructing QQ Plots Step by Step — Manual construction.
  - [x] 3.7.3 Interpreting Deviations — S-shapes, curves, steps.
- [x] **3.8 Time Series Visualisation** — Data over time.
  - [x] 3.8.1 Line Plots — Temporal data.
  - [x] 3.8.2 Spaghetti Plots — Individual trajectories.
  - [x] 3.8.3 Summary Trajectories — Confidence bands.
- [x] **3.9 Advanced Topics** — Publication-ready figures.
  - [x] 3.9.1 Combining Plots (patchwork) — Multi-panel figures.
  - [x] 3.9.2 Interactive Visualisation (plotly) — Tooltips, zoom, pan.
  - [x] 3.9.3 Annotating for Publication — Labels, formatting.
  - [x] 3.9.4 Exporting High-Quality Figures — PNG, PDF, resolution.
- [x] **Communicating to Stakeholders** — Publication-ready figures.
- [x] **Quick Reference** — QQ plots, time series, export settings.

---

## Chapter 4: Probability — Foundations ✓

*The mathematical framework of probability theory.*

**Files:**
- `04-1_statistics-1-foundations_probability_basics-rules.Rmd`
- `04-2_statistics-1-foundations_probability_conditional-independence-bayes.Rmd`
- `04-3_statistics-1-foundations_probability_counting-simulation.Rmd`

### Part 1 (`04-1`): Probability Basics / Rules

- [x] **4.1 What Is Probability?** — Three interpretations.
  - [x] 4.1.1 Frequentist Interpretation — Long-run relative frequency.
  - [x] 4.1.2 Bayesian Interpretation — Degree of belief.
  - [x] 4.1.3 Axiomatic Approach — Kolmogorov's axioms.
  - [x] 4.1.4 Why Probability Matters for Statistics — Foundation for inference.
- [x] **4.2 Sample Spaces and Events** — Formal language.
  - [x] 4.2.1 Defining the Sample Space — Set of all possible outcomes.
  - [x] 4.2.2 Events as Subsets — Union, intersection, complement.
  - [x] 4.2.3 Simple and Compound Events — Single vs multiple outcomes.
  - [x] 4.2.4 Visualising Sample Spaces — Venn and tree diagrams.
- [x] **4.3 Basic Probability Rules** — Fundamental rules.
  - [x] 4.3.1 Probability Axioms (Kolmogorov) — Non-negativity, normalisation, additivity.
  - [x] 4.3.2 The Complement Rule — P(A') = 1 - P(A).
  - [x] 4.3.3 The Addition Rule — P(A ∪ B) = P(A) + P(B) - P(A ∩ B).
  - [x] 4.3.4 Implementing Probability in R — Functions for computation.
- [x] **Communicating to Stakeholders** — Explaining probability basics.
- [x] **Quick Reference** — Axioms and basic rules.

### Part 2 (`04-2`): Conditional Probability / Independence / Bayes

- [x] **4.4 Conditional Probability** — Conditioning on information.
  - [x] 4.4.1 Definition and Intuition — P(A|B) = P(A ∩ B) / P(B).
  - [x] 4.4.2 The Multiplication Rule — P(A ∩ B) = P(A|B) × P(B).
  - [x] 4.4.3 Visualising Conditional Probability — Tree diagrams.
  - [x] 4.4.4 Medical Screening Example — Sensitivity and specificity.
- [x] **4.5 Independence** — Events providing no information about each other.
  - [x] 4.5.1 Definition of Independence — P(A ∩ B) = P(A) × P(B).
  - [x] 4.5.2 Testing for Independence — Comparing frequencies.
  - [x] 4.5.3 Independence vs Mutual Exclusivity — Common confusion.
  - [x] 4.5.4 Independence in Biomedical Contexts — When it fails.
- [x] **4.6 Bayes' Theorem** — Updating beliefs with evidence.
  - [x] 4.6.1 Derivation — P(A|B) = P(B|A) × P(A) / P(B).
  - [x] 4.6.2 Components — Prior, likelihood, posterior, evidence.
  - [x] 4.6.3 The Base Rate Fallacy — Ignoring prior probabilities.
  - [x] 4.6.4 Diagnostic Testing — Sensitivity, specificity, PPV, NPV.
  - [x] 4.6.5 Why Screening Rare Diseases Is Hard — False positives dominate.
  - [x] 4.6.6 The Law of Total Probability — P(A) = Σ P(A|Bᵢ) × P(Bᵢ).
- [x] **Communicating to Stakeholders** — Explaining test results to patients.
- [x] **Quick Reference** — Conditional probability and Bayes formulae.

### Part 3 (`04-3`): Counting Methods / Simulation

- [x] **4.7 Counting Methods (Combinatorics)** — Counting outcomes.
  - [x] 4.7.1 The Multiplication Principle — m × n ways.
  - [x] 4.7.2 Permutations — n!/(n-r)! when order matters.
  - [x] 4.7.3 Combinations — C(n,r) when order doesn't matter.
  - [x] 4.7.4 Applications in Probability — Genetics, sampling.
  - [x] 4.7.5 Implementing Counting in R — `factorial()`, `choose()`.
- [x] **4.8 Simulation-Based Probability** — Monte Carlo methods.
  - [x] 4.8.1 Monte Carlo Methods — Estimating intractable probabilities.
  - [x] 4.8.2 Estimating Probabilities Through Simulation — Birthday problem.
  - [x] 4.8.3 The Law of Large Numbers — Convergence to true probability.
  - [x] 4.8.4 Setting Seeds for Reproducibility — `set.seed()`.
- [x] **Communicating to Stakeholders** — Using simulation to explain.
- [x] **Quick Reference** — Counting formulae and simulation patterns.

---

## Chapter 5: Random Variables and Distributions ✓

*Formalising random variables and major probability distributions.*

**Files:**
- `05-1_statistics-1-foundations_distributions_discrete-bernoulli-binomial.Rmd`
- `05-2_statistics-1-foundations_distributions_poisson-other-discrete.Rmd`
- `05-3_statistics-1-foundations_distributions_continuous-uniform-normal.Rmd`
- `05-4_statistics-1-foundations_distributions_exponential-gamma-beta-related.Rmd`

### Part 1 (`05-1`): Random Variables / Bernoulli / Binomial

- [x] **5.1 Random Variables** — Mapping outcomes to numbers.
  - [x] 5.1.1 Definition — Functions from sample spaces to reals.
  - [x] 5.1.2 Discrete Random Variables — Countable values.
  - [x] 5.1.3 Continuous Random Variables — Values in intervals.
  - [x] 5.1.4 Notation Conventions — Capital X, lowercase x.
- [x] **5.2 Discrete Probability Distributions** — Mathematical apparatus.
  - [x] 5.2.1 Probability Mass Function (PMF) — p(x) = P(X = x).
  - [x] 5.2.2 Cumulative Distribution Function (CDF) — F(x) = P(X ≤ x).
  - [x] 5.2.3 Expected Value (Mean) — E(X) = Σ x·p(x).
  - [x] 5.2.4 Variance and Standard Deviation — Var(X) = E[(X-μ)²].
- [x] **5.3 The Bernoulli Distribution** — Single yes/no trial.
  - [x] 5.3.1 Definition and PMF — P(X=1) = p, P(X=0) = 1-p.
  - [x] 5.3.2 Mean and Variance — E(X) = p, Var(X) = p(1-p).
  - [x] 5.3.3 Implementation — Random number generation.
- [x] **5.4 The Binomial Distribution** — Counting successes.
  - [x] 5.4.1 Definition — Sum of n Bernoulli trials.
  - [x] 5.4.2 PMF Derivation — P(X = k) = C(n,k) × p^k × (1-p)^(n-k).
  - [x] 5.4.3 Mean and Variance — E(X) = np, Var(X) = np(1-p).
  - [x] 5.4.4 Shape and Parameters — Effect of n and p.
  - [x] 5.4.5 Implementation from Scratch — d/p/q/r convention.
  - [x] 5.4.6 Applications — Treatment response, genetics, quality control.
- [x] **Communicating to Stakeholders** — Success/failure models.
- [x] **Quick Reference** — Bernoulli and binomial formulae.

### Part 2 (`05-2`): Poisson / Other Discrete

- [x] **5.5 The Poisson Distribution** — Counting rare events.
  - [x] 5.5.1 Definition — Events at constant rate λ.
  - [x] 5.5.2 PMF Derivation — P(X = k) = (λ^k × e^(-λ)) / k!
  - [x] 5.5.3 Mean and Variance — E(X) = Var(X) = λ.
  - [x] 5.5.4 Implementation from Scratch — Handling large λ.
  - [x] 5.5.5 Applications — Mutations, admissions, adverse events.
- [x] **5.6 Other Discrete Distributions** — Specialised contexts.
  - [x] 5.6.1 Geometric Distribution — Trials until first success.
  - [x] 5.6.2 Negative Binomial Distribution — Trials until r successes.
  - [x] 5.6.3 Hypergeometric Distribution — Sampling without replacement.
- [x] **Communicating to Stakeholders** — Count data modelling.
- [x] **Quick Reference** — Poisson and other discrete formulae.

### Part 3 (`05-3`): Continuous / Uniform / Normal

- [x] **5.7 Continuous Probability Distributions** — Variables in intervals.
  - [x] 5.7.1 Probability Density Function (PDF) — f(x), P(X=x) = 0.
  - [x] 5.7.2 Cumulative Distribution Function (CDF) — F(x) = ∫f(t)dt.
  - [x] 5.7.3 Expected Value and Variance — Via integration.
  - [x] 5.7.4 Quantile Function — Q(p) = F⁻¹(p).
- [x] **5.8 The Uniform Distribution** — Equal probability on interval.
  - [x] 5.8.1 Definition and Properties — f(x) = 1/(b-a).
  - [x] 5.8.2 Applications — Random number generation.
- [x] **5.9 The Normal (Gaussian) Distribution** — Most important distribution.
  - [x] 5.9.1 Definition and Historical Context — Why it's central.
  - [x] 5.9.2 PDF Derivation — (1/√(2πσ²)) × exp(-(x-μ)²/(2σ²)).
  - [x] 5.9.3 Properties — Symmetry, 68-95-99.7 rule.
  - [x] 5.9.4 The Standard Normal (Z) — N(0,1), standardisation.
  - [x] 5.9.5 Implementation from Scratch — Numerical integration.
  - [x] 5.9.6 Why the Normal Is Everywhere — CLT preview.
- [x] **Communicating to Stakeholders** — The normal curve.
- [x] **Quick Reference** — Uniform and normal formulae.

### Part 4 (`05-4`): Exponential / Gamma / Beta / Related

- [x] **5.10 The Exponential Distribution** — Waiting times.
  - [x] 5.10.1 Definition and Properties — Rate λ, scale θ = 1/λ.
  - [x] 5.10.2 The Memoryless Property — P(X > s+t | X > s) = P(X > t).
  - [x] 5.10.3 Applications — Failure times, inter-arrival times.
- [x] **5.11 The Gamma Distribution** — Flexible positive family.
  - [x] 5.11.1 Definition and Properties — Shape α, rate β.
  - [x] 5.11.2 Special Cases — Exponential, chi-square.
  - [x] 5.11.3 Applications — Waiting for k events.
- [x] **5.12 The Beta Distribution** — Probabilities on [0,1].
  - [x] 5.12.1 Definition and Properties — Parameters α, β.
  - [x] 5.12.2 Applications — Success rates, Bayesian inference.
- [x] **5.13 Distributions Related to the Normal** — From normal transformations.
  - [x] 5.13.1 Chi-Square Distribution — Sum of squared normals.
  - [x] 5.13.2 Student's t-Distribution — Heavier tails.
  - [x] 5.13.3 F-Distribution — Ratio of chi-squares.
- [x] **5.14 Choosing the Right Distribution** — Decision guide.
  - [x] 5.14.1 Decision Flowchart — Discrete/continuous, bounded/unbounded.
  - [x] 5.14.2 Visual Assessment of Fit — QQ plots, density overlays.
- [x] **Communicating to Stakeholders** — Distribution choice.
- [x] **Quick Reference** — Distribution summary table.

---

## Chapter 6: Sampling Distributions and the CLT ✓

*The conceptual foundation of statistical inference.*

**Files:**
- `06-1_statistics-1-foundations_sampling-distributions_mean-clt.Rmd`
- `06-2_statistics-1-foundations_sampling-distributions_proportion-variance-t.Rmd`

### Part 1 (`06-1`): Sampling Distribution of the Mean / CLT

- [x] **6.1 The Concept of a Sampling Distribution** — Statistics as random variables.
  - [x] 6.1.1 What Happens When We Sample Repeatedly? — Motivation.
  - [x] 6.1.2 Statistics as Random Variables — Their own distributions.
  - [x] 6.1.3 Simulating Sampling Distributions in R — Empirical distributions.
- [x] **6.2 Sampling Distribution of the Sample Mean** — Most important distribution.
  - [x] 6.2.1 Expected Value — E(X̄) = μ, unbiased.
  - [x] 6.2.2 Variance — Var(X̄) = σ²/n.
  - [x] 6.2.3 Standard Error — SE(X̄) = σ/√n, vs SD.
  - [x] 6.2.4 Visualising Sample Size Effect — Narrowing distributions.
- [x] **6.3 The Central Limit Theorem** — Most remarkable result.
  - [x] 6.3.1 Statement of the CLT — X̄ → N(μ, σ²/n) regardless of population.
  - [x] 6.3.2 Why the CLT Is Remarkable — Works for any distribution.
  - [x] 6.3.3 Visualising the CLT — Simulations from various populations.
  - [x] 6.3.4 How Large Is "Large Enough"? — n ≥ 30 guideline.
  - [x] 6.3.5 Mathematical Intuition — Why sums become normal.
- [x] **Communicating to Stakeholders** — Sampling variability and CLT.
- [x] **Quick Reference** — Sampling distribution formulae.

### Part 2 (`06-2`): Proportions / Variance / t-Distribution

- [x] **6.4 Sample Proportion** — Categorical data.
  - [x] 6.4.1 Proportion as a Special Mean — Mean of 0s and 1s.
  - [x] 6.4.2 Standard Error of a Proportion — SE(p̂) = √[p(1-p)/n].
  - [x] 6.4.3 Normal Approximation to Binomial — np ≥ 10 rule.
- [x] **6.5 Sample Variance** — Chi-square distribution.
  - [x] 6.5.1 Distribution of S² — (n-1)S²/σ² ~ χ²(n-1).
  - [x] 6.5.2 Why We Divide by n-1 — Rigorous proof.
- [x] **6.6 Sampling Distribution of Differences** — Comparing groups.
  - [x] 6.6.1 Difference of Two Means — Distribution derivation.
  - [x] 6.6.2 Difference of Two Proportions — For proportion tests.
- [x] **6.7 The t-Distribution in Sampling** — Unknown σ.
  - [x] 6.7.1 When σ Is Unknown — Additional uncertainty.
  - [x] 6.7.2 The t-Statistic — t = (X̄ - μ) / (s/√n).
  - [x] 6.7.3 Degrees of Freedom and Shape — Approaches normal.
- [x] **Communicating to Stakeholders** — Why larger studies are more reliable.
- [x] **Quick Reference** — Proportion and t formulae.

---

## Chapter 7: Point Estimation ✓

*Estimating population parameters from sample data.*

**Files:**
- `07-1_statistics-1-foundations_point-estimation_properties-mom.Rmd`
- `07-2_statistics-1-foundations_point-estimation_mle.Rmd`

### Part 1 (`07-1`): Properties of Estimators / Method of Moments

- [x] **7.1 What Is Point Estimation?** — Using sample data to estimate parameters.
  - [x] 7.1.1 The Estimation Problem — Formal definition.
  - [x] 7.1.2 Estimators vs Estimates — Random variables vs realised values.
  - [x] 7.1.3 The Hat Notation Convention — θ̂ denotes estimator of θ.
- [x] **7.2 Properties of Estimators** — Evaluating estimation quality.
  - [x] 7.2.1 Bias — E(θ̂) - θ, systematic error.
  - [x] 7.2.2 Variance — Var(θ̂), precision of estimator.
  - [x] 7.2.3 Mean Squared Error — MSE = Bias² + Variance, bias-variance tradeoff.
  - [x] 7.2.4 Consistency — θ̂ → θ as n → ∞.
  - [x] 7.2.5 Efficiency — Cramér-Rao bound, relative efficiency.
- [x] **7.3 Method of Moments** — Matching sample to population moments.
  - [x] 7.3.1 The Idea — Express parameters as functions of moments.
  - [x] 7.3.2 MOM for Normal Distribution — μ̂ = X̄, σ̂² from sample variance.
  - [x] 7.3.3 MOM for Exponential Distribution — λ̂ = 1/X̄.
  - [x] 7.3.4 MOM for Gamma Distribution — Two-parameter example.
  - [x] 7.3.5 Limitations of MOM — Not always optimal.
- [x] **Communicating to Stakeholders** — Explaining estimation to collaborators.
- [x] **Quick Reference** — Properties and MOM formulae.

### Part 2 (`07-2`): Maximum Likelihood Estimation

- [x] **7.4 The Likelihood Function** — Probability of observing data given parameters.
  - [x] 7.4.1 From Probability to Likelihood — Switching perspective.
  - [x] 7.4.2 Likelihood vs Probability — L(θ|x) not a probability.
  - [x] 7.4.3 The Maximum Likelihood Principle — Choose θ maximising L.
- [x] **7.5 Finding MLEs** — Analytical derivations.
  - [x] 7.5.1 The Log-Likelihood — Simplifies products to sums.
  - [x] 7.5.2 MLE for Bernoulli/Binomial — p̂ = X̄.
  - [x] 7.5.3 MLE for Normal Distribution — μ̂ = X̄, σ̂² = (1/n)Σ(Xᵢ - X̄)².
  - [x] 7.5.4 MLE for Exponential Distribution — λ̂ = 1/X̄.
  - [x] 7.5.5 MLE for Poisson Distribution — λ̂ = X̄.
- [x] **7.6 Properties of MLEs** — Asymptotic optimality.
  - [x] 7.6.1 Asymptotic Normality — √n(θ̂ - θ) → N(0, 1/I(θ)).
  - [x] 7.6.2 Invariance Property — MLE of g(θ) is g(θ̂).
  - [x] 7.6.3 Fisher Information — I(θ) = -E[∂²ℓ/∂θ²].
  - [x] 7.6.4 Standard Errors from Fisher Information — SE = 1/√I(θ̂).
- [x] **7.7 Numerical MLE** — When analytical solutions don't exist.
  - [x] 7.7.1 Using optim() in R — Numerical optimisation.
  - [x] 7.7.2 MLE for Beta Distribution — Numerical example.
  - [x] 7.7.3 MLE for Gamma Distribution — Comparison with MOM.
- [x] **Communicating to Stakeholders** — Likelihood-based inference.
- [x] **Quick Reference** — MLE derivations and optim() patterns.

---

## Chapters 8–15: Summary

| Ch | Topic | Parts | Status |
|----|-------|-------|--------|
| 8 | Confidence Intervals — Construction and interpretation | 3 | Not Started |
| 9 | Hypothesis Testing — Logic, p-values, errors | 2 | Not Started |
| 10 | Tests for Means and Proportions — t-tests, z-tests | 2 | Not Started |
| 11 | Chi-Square and Non-Parametric — Contingency tables, rank tests | 2 | Not Started |
| 12 | Linear Regression — Model, inference, diagnostics | 3 | Not Started |
| 13 | ANOVA — Comparing multiple groups | 2 | Not Started |
| 14 | Experimental Design — Randomisation, validity | 2 | Not Started |
| 15 | Multiple Comparisons — FDR, reproducibility crisis | 3 | Not Started |

---

## Appendices (Part I)

- [ ] **Appendix A:** R Programming for Statistical Computing
- [ ] **Appendix B:** Mathematical Foundations
- [ ] **Appendix C:** Probability Distribution Reference
- [ ] **Appendix D:** Statistical Tables
- [ ] **Appendix E:** Datasets (see DATA.md for 57 datasets)
- [ ] **Appendix F:** Glossary of Statistical Terms
- [ ] **Appendix G:** Quick Reference Cards

---

# Part II: Intermediate

**Folder:** `statistics-2-intermediate/`
**Status:** Not Started

Building on foundations to cover regression, GLMs, mixed effects, time series, Bayesian inference, and survival analysis.

## Planned Chapters

| Ch | Topic | Parts | Origin (Old TOC) |
|----|-------|-------|-----------------|
| 1 | Multiple Linear Regression | 3 | Ch 6.2–6.4 |
| 2 | Regression Diagnostics and Remedies | 2 | Ch 6.3–6.4 |
| 3 | Generalised Linear Models Framework | 2 | Ch 7.1 |
| 4 | Logistic Regression | 3 | Ch 7.2 |
| 5 | Poisson and Count Data Models | 2 | Ch 7.3 |
| 6 | Mixed-Effects Models | 3 | Ch 11.1–11.3 |
| 7 | Time Series Analysis | 3 | Ch 8.1–8.3 |
| 8 | Introduction to Bayesian Statistics | 3 | Ch 9.1–9.3 |
| 9 | Survival Analysis | 3 | Ch 12.1–12.4 |
| 10 | Multivariate Methods | 2 | Ch 10.1–10.4 |

### Detailed Outline

- [ ] **Chapter 1: Multiple Linear Regression**
  - [ ] Matrix formulation and interpretation
  - [ ] Partial and semipartial correlation
  - [ ] Multicollinearity detection
  - [ ] Variable selection (stepwise, AIC, BIC, cross-validation)
- [ ] **Chapter 2: Regression Diagnostics**
  - [ ] Residual analysis and influence measures
  - [ ] Heteroscedasticity and autocorrelation
  - [ ] Transformations and weighted least squares
  - [ ] Robust regression methods
- [ ] **Chapter 3: GLM Framework**
  - [ ] Exponential family of distributions
  - [ ] Link functions
  - [ ] Maximum likelihood estimation
- [ ] **Chapter 4: Logistic Regression**
  - [ ] Binary response models
  - [ ] Odds ratios and interpretation
  - [ ] ROC curves and classification
  - [ ] Separation issues
- [ ] **Chapter 5: Count Data Models**
  - [ ] Poisson regression
  - [ ] Overdispersion and zero-inflation
  - [ ] Negative binomial regression
- [ ] **Chapter 6: Mixed-Effects Models**
  - [ ] Random intercepts and slopes
  - [ ] Nested and crossed effects
  - [ ] GLMM for binary/count outcomes
- [ ] **Chapter 7: Time Series**
  - [ ] Components and stationarity
  - [ ] Smoothing methods
  - [ ] ARIMA models
- [ ] **Chapter 8: Bayesian Statistics**
  - [ ] Prior distributions
  - [ ] MCMC methods
  - [ ] Bayesian regression with brms
- [ ] **Chapter 9: Survival Analysis**
  - [ ] Censoring and hazard functions
  - [ ] Kaplan-Meier and log-rank
  - [ ] Cox proportional hazards
- [ ] **Chapter 10: Multivariate Methods**
  - [ ] PCA and factor analysis
  - [ ] Discriminant analysis
  - [ ] Cluster analysis

---

# Part III: Advanced

**Folder:** `statistics-3-advanced/`
**Status:** Not Started

Advanced topics: statistical learning, causal inference, computational statistics, and applications.

## Planned Chapters

| Ch | Topic | Parts | Origin (Old TOC) |
|----|-------|-------|-----------------|
| 1 | Statistical Learning and Prediction | 3 | Ch 13.1–13.3 |
| 2 | Tree-Based Methods and Ensemble Learning | 2 | Ch 13.4 |
| 3 | Causal Inference | 3 | Ch 14 |
| 4 | Advanced Bayesian Methods | 2 | Ch 9.4–9.6 |
| 5 | Computational Statistics | 3 | Ch 18 |
| 6 | High-Dimensional Statistics | 2 | Ch 17.6 |
| 7 | Bioinformatics Applications | 3 | Ch 15 |
| 8 | Network and Spatial Analysis | 2 | Ch 17.2, 19.1 |

### Detailed Outline

- [ ] **Chapter 1: Statistical Learning**
  - [ ] Bias-variance tradeoff
  - [ ] Regularisation (ridge, lasso, elastic net)
  - [ ] Cross-validation and model selection
- [ ] **Chapter 2: Tree-Based Methods**
  - [ ] Decision trees
  - [ ] Random forests
  - [ ] Boosting (XGBoost)
- [ ] **Chapter 3: Causal Inference**
  - [ ] Potential outcomes framework
  - [ ] Propensity score methods
  - [ ] Difference-in-differences
  - [ ] Instrumental variables
- [ ] **Chapter 4: Advanced Bayesian**
  - [ ] Hierarchical models
  - [ ] Gaussian processes
  - [ ] Model selection (WAIC, LOO)
- [ ] **Chapter 5: Computational Statistics**
  - [ ] Monte Carlo integration
  - [ ] Bootstrap methods
  - [ ] EM algorithm
  - [ ] MCMC diagnostics
- [ ] **Chapter 6: High-Dimensional Statistics**
  - [ ] Multiple testing and FDR
  - [ ] Sparse estimation
  - [ ] Covariance estimation
- [ ] **Chapter 7: Bioinformatics**
  - [ ] RNA-seq differential expression
  - [ ] Gene set enrichment
  - [ ] Single-cell analysis
  - [ ] GWAS methods
- [ ] **Chapter 8: Network and Spatial**
  - [ ] Network metrics and community detection
  - [ ] Spatial autocorrelation
  - [ ] Kriging

---

## File Structure

```
statistics-with-R/                      # Organisational folder
├── _passthrough                        # Marker (content system ignores folder)
├── TOC.md                              # This file
├── COURSE-GUIDE.md                     # Development guidelines
│
├── statistics-1-foundations/
│   ├── _series.mdx                     # Course manifest
│   ├── DATA.md                         # 57 datasets documented
│   ├── src/
│   │   ├── data/
│   │   │   ├── primary/                # NHANES, penguins, gapminder
│   │   │   ├── medical/                # scurvy, strep_tb, etc.
│   │   │   ├── supplementary/          # survival, MASS datasets
│   │   │   ├── bioinformatics/         # RNA-seq, cancer, genomics
│   │   │   ├── microbiome/             # GlobalPatterns, OTU tables
│   │   │   ├── proteomics/             # CPTAC spike-in
│   │   │   └── gwas/                   # Rice GWAS, simulated SNPs
│   │   └── *.Rmd                       # Source files
│   └── 01-introduction/                # Published chapters
│       └── 01-1_....mdx
│
├── statistics-2-intermediate/
│   └── _series.mdx
│
└── statistics-3-advanced/
    └── _series.mdx
```

---

## Development Notes

- **Four-part approach:** Prose → Visualisation → Mathematical Derivation → Communicating to Stakeholders
- **Language:** British Oxford English
- **Code style:** `box::use()`, `data.table`, `ggplot2`
- **Implementation:** From scratch before built-in functions
- **Datasets:** 57 datasets in `DATA.md` (including microbiome, proteomics, GWAS)

---

*Written in British Oxford English with biomedical examples. Every concept follows the four-part pedagogical approach.*
