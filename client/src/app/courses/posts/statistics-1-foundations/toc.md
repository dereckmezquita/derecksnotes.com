# Statistics with R I: Foundations
## A Comprehensive Introduction for R Programmers

---

## Preface

This course provides a rigorous introduction to statistical thinking and methods for those already proficient in R programming. Rather than teaching R basics, we assume you can write functions, manipulate data with data.table, and create visualisations with ggplot2. Our focus is purely on statistics: building deep intuition, understanding the mathematics, and implementing methods from scratch before relying on packages.

Throughout this course, we use biomedical and clinical examples to ground abstract concepts in real-world applications. You will work with publicly available datasets from sources such as NHANES, the {medicaldata} R package, NHLBI teaching datasets, and simulated clinical trial data.

We write in British Oxford English throughout.

---

## Pedagogical Approach

Every concept in this course is presented using a **three-part teaching method**:

### 1. Prose and Intuition
First, we explain the concept in plain language with analogies, examples, and context. We answer: What is this? Why does it matter? When would you use it? We build intuition before introducing any formalism.

### 2. Visualisation
Second, we demonstrate the concept visually. Graphs, diagrams, and interactive simulations help you *see* what's happening. Visualisation bridges the gap between intuition and mathematics.

### 3. Mathematical Derivation
Third, we present the formal mathematics. Following the French educational tradition, we don't simply state formulae — we *derive* them. We show how the formula was discovered, why it takes the form it does, and what each component means. You will understand not just *what* to compute, but *why* the computation works.

After the three-part introduction, we implement the method from scratch in R, then show how to use built-in functions efficiently.

---

## Technical Format

All course materials are written as **R Markdown (.Rmd) documents**, allowing seamless integration of:
- Prose explanations and mathematical notation (LaTeX)
- R code chunks with executable examples
- Generated visualisations and tables
- Interactive elements where appropriate

Students are encouraged to run the code themselves and experiment with the examples.

---

## How to Use This Course

This course is designed to be followed sequentially, with each chapter building upon previous material. However, each chapter concludes with a **Quick Reference** section summarising key formulae and R code, allowing the course to serve as a reference manual.

**Prerequisites:**
- Proficiency in R programming (functions, loops, vectorisation)
- Familiarity with data.table syntax
- Basic ggplot2 knowledge
- Secondary school mathematics (algebra, basic calculus helpful but not required)

---

# Table of Contents

---

## Chapter 1: Introduction to Statistics and Data

*This foundational chapter establishes the vocabulary and conceptual framework for statistical thinking. We explore what statistics is, why it matters, and how to think critically about data.*

- **`01.1_statistics-1-foundations_introduction_statistics-and-sampling.Rmd`**
    - **1.1 What Is Statistics?**
        - **1.1.1 Statistics as the Science of Learning from Data** — We define statistics as the discipline of collecting, organising, analysing, and interpreting data to make informed decisions under uncertainty.
        - **1.1.2 A Brief History: From Census to Modern Data Science** — We trace the evolution of statistics from ancient census-taking through the development of probability theory, the frequentist revolution, and into modern computational statistics.
        - **1.1.3 Descriptive vs Inferential Statistics** — We distinguish between summarising data we have (descriptive) and drawing conclusions about larger populations (inferential), establishing the two main branches of statistics.
        - **1.1.4 The Role of Statistics in Biomedical Research** — We examine how statistics enables evidence-based medicine, from clinical trials to epidemiology to genomics, showing why statistical literacy is essential for biomedical scientists.
    - **1.2 Populations and Samples**
        - **1.2.1 Defining the Population of Interest** — We explain how to precisely define the group about which you want to draw conclusions, a critical first step often overlooked.
        - **1.2.2 Why We Sample: Practical and Theoretical Reasons** — We explore why studying entire populations is usually impossible or impractical, motivating the need for sampling.
        - **1.2.3 Parameters vs Statistics: The Fundamental Distinction** — We introduce the crucial difference between fixed (but unknown) population parameters and variable sample statistics, using notation conventions (μ vs x̄, σ vs s).
        - **1.2.4 The Goal of Inference: Learning About Populations from Samples** — We frame the central problem of statistics: using sample data to make statements about population parameters.
        - **1.2.5 Notation Conventions** — We establish the notation used throughout the course, distinguishing Greek letters for parameters from Roman letters for statistics.
    - **Communicating to Stakeholders:** Explaining what statistics is and why sampling matters to collaborators.
    - **Quick Reference:** Key terms and notation conventions.
- **`01.2_statistics-1-foundations_introduction_variables-and-collection.Rmd`**
    - **1.3 Types of Variables**
        - **1.3.1 Quantitative Variables** — We define variables that represent numerical measurements or counts, distinguishing between continuous (any value in a range) and discrete (countable values).
        - **1.3.2 Qualitative (Categorical) Variables** — We define variables that represent categories or groups, distinguishing between nominal (no natural order) and ordinal (meaningful order).
        - **1.3.3 Scales of Measurement: Nominal, Ordinal, Interval, Ratio** — We present Stevens' four levels of measurement, explaining what mathematical operations are meaningful for each.
        - **1.3.4 Identifying Variable Types in Practice** — We work through examples of classifying real variables, building the skill of recognising variable types in datasets.
    - **1.4 Data Collection Methods**
        - **1.4.1 Observational Studies** — We explain studies where researchers observe without intervention, covering cross-sectional, case-control, and cohort designs with their strengths and limitations.
        - **1.4.2 Experimental Studies** — We explain studies where researchers actively intervene, focusing on randomised controlled trials as the gold standard for causal inference.
        - **1.4.3 The Crucial Difference: Association vs Causation** — We emphasise why observational studies can only show association while experiments can establish causation, a distinction fundamental to scientific reasoning.
    - **Communicating to Stakeholders:** Explaining variable types and study designs to collaborators.
    - **Quick Reference:** Variable classification and study design comparison table.
- **`01.3_statistics-1-foundations_introduction_sampling-bias-reproducibility.Rmd`**
    - **1.5 Sampling Methods**
        - **1.5.1 Probability Sampling Methods** — We cover simple random sampling, stratified sampling, cluster sampling, and systematic sampling, explaining when each is appropriate.
        - **1.5.2 Non-Probability Sampling Methods** — We discuss convenience, quota, and snowball sampling, explaining their limitations and when they might be acceptable.
        - **1.5.3 Sampling Bias and How to Minimise It** — We identify common sources of sampling bias and strategies to reduce them.
        - **1.5.4 Implementing Random Sampling in R** — We write functions to perform various sampling methods, demonstrating practical implementation.
    - **1.6 Sources of Bias and Variability**
        - **1.6.1 Selection Bias** — We explain how non-representative samples lead to biased conclusions, with examples from medical research.
        - **1.6.2 Measurement Bias (Systematic Error)** — We discuss how flawed measurement procedures introduce systematic errors that cannot be reduced by larger samples.
        - **1.6.3 Response Bias** — We cover how question wording, social desirability, and recall errors affect self-reported data.
        - **1.6.4 Survivorship Bias** — We explain this subtle but common bias where we only observe "survivors," with classic examples.
        - **1.6.5 Random Variability vs Systematic Bias** — We distinguish between random error (reduced by larger samples) and systematic bias (not reduced by larger samples), using target diagrams.
    - **1.7 Introduction to Statistical Software and Reproducibility**
        - **1.7.1 Why Reproducibility Matters** — We explain the reproducibility crisis and why computational reproducibility is essential for credible science.
        - **1.7.2 Setting Seeds for Reproducible Random Processes** — We demonstrate set.seed() and explain why it's critical for reproducible analyses.
        - **1.7.3 Organising Statistical Projects** — We present best practices for project structure, file naming, and documentation.
        - **1.7.4 Introduction to R Markdown and Quarto for Reproducible Reports** — We introduce literate programming tools that combine code, results, and narrative.
    - **Communicating to Stakeholders:** Explaining study design limitations and why reproducibility matters.
    - **Quick Reference:** Sampling methods comparison and bias types summary.

---

## Chapter 2: Descriptive Statistics — Summarising Data Numerically

*This chapter covers the fundamental numerical summaries used to describe datasets. We learn to quantify centre, spread, and shape, implementing each measure from scratch to understand what they truly measure.*

### 2.1 Measures of Central Tendency

- **2.1.1 The Arithmetic Mean** — We derive the mean as the "balance point" of a distribution, prove its key properties, and implement it from scratch before using mean().

- **2.1.2 The Median** — We derive the median as the value minimising absolute deviations, explain its robustness to outliers, and implement it from scratch.

- **2.1.3 The Mode** — We define the mode as the most frequent value, discuss its limitations, and show how to find it programmatically.

- **2.1.4 Comparing Mean, Median, and Mode** — We visualise how skewness affects the relationship between these measures and establish guidelines for when to use each.

- **2.1.5 Other Means: Weighted, Trimmed, Geometric, Harmonic** — We derive and implement specialised means for specific applications like growth rates, ratios, and weighted surveys.

### 2.2 Measures of Dispersion (Spread)

- **2.2.1 Range and Interquartile Range** — We define these simple measures of spread, discuss their properties, and explain when each is appropriate.

- **2.2.2 Variance** — We derive variance as the average squared deviation from the mean, explain why we square, and prove why we divide by n-1 for samples.

- **2.2.3 Standard Deviation** — We take the square root of variance to return to original units, interpret SD in context, and implement from scratch.

- **2.2.4 Coefficient of Variation** — We derive CV as the ratio of SD to mean, enabling comparison of variability across different scales.

- **2.2.5 Mean Absolute Deviation** — We present MAD as an alternative to SD that's more robust and easier to interpret.

- **2.2.6 Robust Measures of Spread** — We introduce the median absolute deviation and explain when robust measures outperform classical ones.

### 2.3 Measures of Position

- **2.3.1 Percentiles and Quantiles** — We define these measures formally, explain different calculation methods, and implement them from scratch.

- **2.3.2 Quartiles and the Five-Number Summary** — We explain how quartiles divide data and introduce the five-number summary as a distribution snapshot.

- **2.3.3 Z-Scores (Standard Scores)** — We derive z-scores as the number of standard deviations from the mean, enabling comparison across different variables.

- **2.3.4 Percentile Ranks** — We explain how to express a value as a percentile, with applications to clinical reference ranges.

### 2.4 Measures of Shape

- **2.4.1 Skewness** — We derive the skewness formula, explain what positive and negative skewness mean visually, and implement calculation from scratch.

- **2.4.2 Kurtosis** — We derive the kurtosis formula, explain what it measures about tails and peaks, and clarify common misconceptions.

- **2.4.3 Why Shape Matters** — We explain how distributional shape affects the choice of summary statistics and statistical tests.

### 2.5 Summarising Grouped Data

- **2.5.1 Frequency Distributions** — We construct frequency tables and explain relative and cumulative frequencies.

- **2.5.2 Computing Statistics from Grouped Data** — We derive formulae for estimating mean and variance when only grouped data are available.

- **2.5.3 Efficient Grouped Summaries with data.table** — We demonstrate fast, elegant grouped calculations using data.table syntax.

### 2.6 Detecting Outliers

- **2.6.1 What Is an Outlier?** — We define outliers conceptually and discuss why context matters for interpretation.

- **2.6.2 The IQR Rule (Tukey's Fences)** — We derive the 1.5×IQR rule, explain its rationale, and implement outlier detection.

- **2.6.3 Z-Score Method** — We explain outlier detection based on standard deviations and discuss its limitations.

- **2.6.4 Modified Z-Score Using MAD** — We present a robust alternative for outlier detection when data are non-normal.

- **2.6.5 Outliers in Biomedical Data** — We discuss the critical decision of whether outliers represent errors or genuine extreme values in clinical contexts.

**Communicating to Stakeholders:** Creating summary tables for clinical reports that convey the right information without overwhelming.

**Quick Reference:** Chapter 2 Formulae and R Implementations

---

## Chapter 3: Descriptive Statistics — Visualising Data

*This chapter covers graphical methods for exploring and presenting data. We focus on creating effective visualisations that reveal patterns and communicate findings clearly.*

### 3.1 Principles of Statistical Graphics

- **3.1.1 The Grammar of Graphics Philosophy** — We introduce the layered grammar underlying ggplot2, explaining how it enables systematic construction of visualisations.

- **3.1.2 Choosing the Right Plot for Your Data Type** — We present a decision framework for selecting appropriate visualisations based on variable types and analysis goals.

- **3.1.3 Principles of Effective Data Visualisation** — We cover Tufte's principles including data-ink ratio, chartjunk avoidance, and appropriate scales.

- **3.1.4 Common Visualisation Mistakes and How to Avoid Them** — We catalogue frequent errors like truncated axes, misleading scales, and inappropriate chart types.

### 3.2 Visualising Categorical Data

- **3.2.1 Bar Charts** — We construct simple, grouped, and stacked bar charts, explaining when each is appropriate.

- **3.2.2 Pie Charts and Waffle Charts** — We discuss when pie charts are acceptable (rarely) and present waffle charts as a better alternative.

- **3.2.3 Mosaic Plots for Two Categorical Variables** — We introduce mosaic plots for visualising associations between categorical variables.

### 3.3 Visualising Quantitative Data — Single Variable

- **3.3.1 Histograms** — We construct histograms, derive optimal bin width formulae (Sturges, Scott, Freedman-Diaconis), and discuss interpretation.

- **3.3.2 Density Plots** — We introduce kernel density estimation conceptually, explain bandwidth selection, and compare to histograms.

- **3.3.3 Box Plots (Box-and-Whisker Plots)** — We construct box plots from the five-number summary, explain outlier display, and discuss interpretation.

- **3.3.4 Violin Plots** — We combine density and box plot information, explaining when violin plots are more informative.

- **3.3.5 Strip Plots and Jittered Dot Plots** — We show all data points with jittering to avoid overplotting, ideal for small samples.

- **3.3.6 Stem-and-Leaf Plots** — We construct this classic display that preserves original values while showing distribution shape.

- **3.3.7 Empirical Cumulative Distribution Function (ECDF) Plots** — We derive and construct ECDFs, explaining how to read percentiles from them.

### 3.4 Visualising Relationships Between Two Quantitative Variables

- **3.4.1 Scatter Plots** — We construct scatter plots, identify patterns, and handle overplotting through transparency, jittering, and binning.

- **3.4.2 Adding Trend Lines** — We add linear regression lines and LOESS smoothers to reveal relationships.

- **3.4.3 Scatter Plot Matrices (Pairs Plots)** — We construct matrices showing all pairwise relationships for multivariate exploration.

### 3.5 Visualising Relationships Involving Categorical Variables

- **3.5.1 Grouped Box Plots and Violin Plots** — We compare distributions across groups using side-by-side displays.

- **3.5.2 Faceting (Small Multiples)** — We use facet_wrap() and facet_grid() to create small multiples that reveal patterns across subgroups.

- **3.5.3 Colour and Shape Encoding for Groups** — We encode categorical variables using aesthetics like colour, shape, and size.

### 3.6 Visualising Correlation

- **3.6.1 Correlation Matrices and Heatmaps** — We compute correlation matrices and display them as heatmaps with appropriate colour scales.

### 3.7 Visualising Distributions: QQ Plots

- **3.7.1 The Idea: Comparing Data to a Theoretical Distribution** — We explain the logic of QQ plots: if data follow a distribution, points fall on a line.

- **3.7.2 Constructing QQ Plots Step by Step** — We manually construct QQ plots to understand exactly what they show.

- **3.7.3 Interpreting Deviations from the Line** — We catalogue patterns indicating skewness, heavy tails, and outliers.

### 3.8 Time Series and Longitudinal Data Visualisation

- **3.8.1 Line Plots for Time Series** — We construct line plots for temporal data with appropriate axis formatting.

- **3.8.2 Spaghetti Plots for Individual Trajectories** — We plot individual subject trajectories over time.

- **3.8.3 Summary Trajectories with Confidence Bands** — We summarise multiple trajectories with means and uncertainty bands.

### 3.9 Advanced Visualisation Topics

- **3.9.1 Combining Multiple Plots (patchwork Package)** — We compose multi-panel figures for publication.

- **3.9.2 Interactive Visualisation with plotly** — We create interactive versions of static plots for exploration.

- **3.9.3 Annotating Plots for Publication** — We add labels, annotations, and formatting for publication-ready figures.

- **3.9.4 Exporting High-Quality Figures** — We export figures in appropriate formats and resolutions for different uses.

**Communicating to Stakeholders:** Creating publication-ready figures that communicate findings to diverse audiences.

**Quick Reference:** Chapter 3 Plot Selection Guide and ggplot2 Syntax

---

## Chapter 4: Probability — Foundations

*This chapter introduces the mathematical framework of probability theory. We build intuition through simulation before formalising concepts mathematically.*

### 4.1 What Is Probability?

- **4.1.1 Probability as Long-Run Frequency (Frequentist Interpretation)** — We define probability as the limit of relative frequency in repeated trials, grounding the concept in observable phenomena.

- **4.1.2 Probability as Degree of Belief (Bayesian Interpretation)** — We introduce the alternative view of probability as quantified uncertainty, setting up later Bayesian chapters.

- **4.1.3 Probability as a Mathematical System (Axiomatic Approach)** — We present Kolmogorov's axioms that define probability mathematically, independent of interpretation.

- **4.1.4 Why Probability Matters for Statistics** — We explain how probability provides the mathematical foundation for all of statistical inference.

### 4.2 Sample Spaces and Events

- **4.2.1 Defining the Sample Space** — We define the sample space as the set of all possible outcomes, with examples of discrete and continuous spaces.

- **4.2.2 Events as Subsets of the Sample Space** — We define events as collections of outcomes and introduce set notation.

- **4.2.3 Simple and Compound Events** — We distinguish single-outcome events from compound events involving multiple outcomes.

- **4.2.4 Visualising Sample Spaces** — We use Venn diagrams and tree diagrams to represent sample spaces visually.

### 4.3 Basic Probability Rules

- **4.3.1 Probability Axioms (Kolmogorov)** — We present the three axioms of probability and derive their immediate consequences.

- **4.3.2 The Complement Rule** — We derive P(A') = 1 - P(A) and apply it to "at least one" problems.

- **4.3.3 The Addition Rule** — We derive P(A ∪ B) for mutually exclusive and general events, with visual proof using Venn diagrams.

- **4.3.4 Implementing Probability Calculations in R** — We write functions to compute probabilities and simulate random events.

### 4.4 Conditional Probability

- **4.4.1 Definition and Intuition** — We derive P(A|B) = P(A ∩ B) / P(B) and explain it as restricting the sample space.

- **4.4.2 The Multiplication Rule** — We derive P(A ∩ B) = P(A|B) × P(B) and apply it to sequential events.

- **4.4.3 Visualising Conditional Probability** — We use tree diagrams and restricted Venn diagrams to build intuition.

- **4.4.4 Medical Screening Example** — We work through diagnostic testing in detail, introducing sensitivity, specificity, and predictive values.

### 4.5 Independence

- **4.5.1 Definition of Independence** — We define independence via P(A ∩ B) = P(A) × P(B) and the equivalent P(A|B) = P(A).

- **4.5.2 Testing for Independence** — We show how to check whether events are independent from data.

- **4.5.3 Independence vs Mutual Exclusivity** — We clarify the common confusion between these very different concepts.

- **4.5.4 Independence in Biomedical Contexts** — We discuss when independence assumptions are reasonable in medical data.

### 4.6 Bayes' Theorem

- **4.6.1 Derivation from Conditional Probability** — We derive Bayes' theorem step by step from the definition of conditional probability.

- **4.6.2 Components: Prior, Likelihood, Posterior, Evidence** — We name and interpret each component of Bayes' formula.

- **4.6.3 The Base Rate Fallacy** — We explain why ignoring prior probabilities leads to dramatic errors in reasoning.

- **4.6.4 Diagnostic Testing: Sensitivity, Specificity, PPV, NPV** — We derive all diagnostic measures and show how prevalence affects predictive values.

- **4.6.5 Why Screening Rare Diseases Is Hard** — We demonstrate mathematically why positive tests for rare conditions are often false positives.

- **4.6.6 The Law of Total Probability** — We derive this tool for computing marginal probabilities via conditioning.

### 4.7 Counting Methods (Combinatorics)

- **4.7.1 The Multiplication Principle** — We derive the fundamental counting principle for sequential choices.

- **4.7.2 Permutations** — We derive n! and nPr formulae for ordered arrangements.

- **4.7.3 Combinations** — We derive the binomial coefficient formula for unordered selections.

- **4.7.4 Applications in Probability** — We apply counting to compute probabilities in genetics, sampling, and games.

- **4.7.5 Implementing Counting Functions in R** — We implement factorial(), choose(), and related functions from scratch.

### 4.8 Simulation-Based Probability

- **4.8.1 Monte Carlo Methods: The Idea** — We introduce simulation as a tool for estimating probabilities that are difficult to compute analytically.

- **4.8.2 Estimating Probabilities Through Simulation** — We write simulations to estimate probabilities and compare to analytical results.

- **4.8.3 The Law of Large Numbers** — We demonstrate how simulation estimates converge to true probabilities.

- **4.8.4 Setting Seeds for Reproducibility** — We explain why and how to use set.seed() for reproducible simulations.

**Communicating to Stakeholders:** Explaining diagnostic test results to patients and clinicians in ways they can understand and act upon.

**Quick Reference:** Chapter 4 Probability Rules and Formulae

---

## Chapter 5: Random Variables and Probability Distributions

*This chapter formalises random variables and introduces the major probability distributions. We implement distribution functions from scratch to deeply understand what they compute.*

### 5.1 Random Variables

- **5.1.1 Definition: Mapping Outcomes to Numbers** — We define random variables as functions from sample spaces to real numbers, bridging probability and calculus.

- **5.1.2 Discrete Random Variables** — We define discrete random variables as those taking countable values.

- **5.1.3 Continuous Random Variables** — We define continuous random variables as those taking values in intervals.

- **5.1.4 Notation Conventions** — We establish notation: capital letters for random variables, lowercase for values.

### 5.2 Discrete Probability Distributions

- **5.2.1 Probability Mass Function (PMF)** — We define the PMF as P(X = x), derive its properties, and visualise as bar charts.

- **5.2.2 Cumulative Distribution Function (CDF)** — We define F(x) = P(X ≤ x), derive its properties, and visualise as step functions.

- **5.2.3 Expected Value (Mean)** — We derive E(X) as a weighted average of outcomes, prove linearity of expectation, and implement from scratch.

- **5.2.4 Variance and Standard Deviation** — We derive Var(X) = E[(X-μ)²] = E(X²) - [E(X)]², prove key properties, and implement from scratch.

### 5.3 The Bernoulli Distribution

- **5.3.1 Definition and PMF** — We define the Bernoulli as the distribution of a single trial with probability p of success.

- **5.3.2 Mean and Variance** — We derive E(X) = p and Var(X) = p(1-p) from first principles.

- **5.3.3 Implementation** — We implement Bernoulli functions and connect to coin flips and binary outcomes.

### 5.4 The Binomial Distribution

- **5.4.1 Definition: Counting Successes** — We derive the binomial as the sum of n independent Bernoulli trials.

- **5.4.2 PMF Derivation** — We derive P(X = k) = C(n,k) × p^k × (1-p)^(n-k) using counting principles.

- **5.4.3 Mean and Variance** — We derive E(X) = np and Var(X) = np(1-p) using properties of sums.

- **5.4.4 Shape and Parameters** — We visualise how n and p affect distribution shape.

- **5.4.5 Implementation from Scratch** — We write dbinom_manual(), pbinom_manual(), qbinom_manual(), rbinom_manual().

- **5.4.6 Applications** — We apply binomial to treatment response rates, genetic inheritance, and quality control.

### 5.5 The Poisson Distribution

- **5.5.1 Definition: Counting Rare Events** — We introduce the Poisson as the distribution of counts in fixed intervals when events occur independently at constant rate.

- **5.5.2 PMF Derivation** — We derive P(X = k) = (λ^k × e^(-λ)) / k! as a limit of the binomial.

- **5.5.3 Mean and Variance** — We prove the remarkable fact that E(X) = Var(X) = λ.

- **5.5.4 Implementation from Scratch** — We implement Poisson functions manually.

- **5.5.5 Applications** — We apply Poisson to mutation counts, hospital admissions, and rare adverse events.

### 5.6 Other Discrete Distributions

- **5.6.1 Geometric Distribution** — We derive the distribution of trials until first success, including the memoryless property.

- **5.6.2 Negative Binomial Distribution** — We derive the distribution of trials until r successes and its use for overdispersed counts.

- **5.6.3 Hypergeometric Distribution** — We derive the distribution for sampling without replacement and its use in Fisher's exact test.

### 5.7 Continuous Probability Distributions

- **5.7.1 Probability Density Function (PDF)** — We define the PDF, explain why P(X = x) = 0, and show that probability is area under the curve.

- **5.7.2 Cumulative Distribution Function (CDF)** — We define F(x) as the integral of the PDF and show how to compute probabilities.

- **5.7.3 Expected Value and Variance** — We extend expectation and variance to continuous variables via integration.

- **5.7.4 Quantile Function (Inverse CDF)** — We define Q(p) = F⁻¹(p) for finding percentiles.

### 5.8 The Uniform Distribution

- **5.8.1 Definition and Properties** — We derive the PDF, CDF, mean, and variance for the uniform distribution.

- **5.8.2 Applications** — We discuss use in random number generation and modelling complete uncertainty.

### 5.9 The Normal (Gaussian) Distribution

- **5.9.1 Definition and Historical Context** — We introduce the normal distribution and explain why it's central to statistics.

- **5.9.2 PDF Derivation** — We present the PDF formula and explain the role of each parameter.

- **5.9.3 Properties** — We prove symmetry, derive the 68-95-99.7 rule, and discuss tail behaviour.

- **5.9.4 The Standard Normal (Z) Distribution** — We define the standard normal and show how to standardise any normal variable.

- **5.9.5 Implementation from Scratch** — We implement normal distribution functions using numerical methods.

- **5.9.6 Why the Normal Is Everywhere** — We preview the Central Limit Theorem as explanation for the normal's ubiquity.

### 5.10 The Exponential Distribution

- **5.10.1 Definition and Properties** — We derive the exponential as the distribution of waiting times in a Poisson process.

- **5.10.2 The Memoryless Property** — We prove and interpret the unique memoryless property.

- **5.10.3 Applications** — We apply to equipment failure, patient arrival times, and survival analysis.

### 5.11 The Gamma Distribution

- **5.11.1 Definition and Properties** — We derive the gamma as the sum of exponentials, explaining shape and rate parameters.

- **5.11.2 Special Cases** — We show how exponential and chi-square are special cases of gamma.

- **5.11.3 Applications** — We apply to waiting times and modelling skewed positive data.

### 5.12 The Beta Distribution

- **5.12.1 Definition and Properties** — We derive the beta as a distribution for probabilities, explaining how shape parameters affect the distribution.

- **5.12.2 Applications** — We apply to modelling success rates and Bayesian inference for proportions.

### 5.13 Distributions Related to the Normal

- **5.13.1 Chi-Square Distribution** — We derive chi-square as the sum of squared standard normals, explaining degrees of freedom.

- **5.13.2 Student's t-Distribution** — We derive the t-distribution as a ratio involving normal and chi-square, explaining its heavier tails.

- **5.13.3 F-Distribution** — We derive the F as a ratio of chi-square variables, used in ANOVA and regression.

### 5.14 Choosing the Right Distribution

- **5.14.1 Decision Flowchart** — We present a systematic approach to selecting distributions based on data characteristics.

- **5.14.2 Visual Assessment of Fit** — We show how to use QQ plots and density overlays to assess distributional fit.

**Communicating to Stakeholders:** Explaining what a probability distribution means in practical terms without mathematical jargon.

**Quick Reference:** Chapter 5 Distribution Summary Table with Formulae and R Functions

---

## Chapter 6: Sampling Distributions and the Central Limit Theorem

*This chapter introduces sampling distributions, the conceptual foundation of statistical inference. We use extensive simulation to build intuition before proving results mathematically.*

### 6.1 The Concept of a Sampling Distribution

- **6.1.1 What Happens When We Sample Repeatedly?** — We introduce the thought experiment of repeated sampling to motivate sampling distributions.

- **6.1.2 Statistics as Random Variables** — We explain that sample statistics vary from sample to sample and thus have their own distributions.

- **6.1.3 Simulating Sampling Distributions in R** — We write simulations to generate empirical sampling distributions.

### 6.2 Sampling Distribution of the Sample Mean

- **6.2.1 Expected Value of the Sample Mean** — We prove E(X̄) = μ, showing the sample mean is unbiased.

- **6.2.2 Variance of the Sample Mean** — We derive Var(X̄) = σ²/n, showing how sample size reduces variability.

- **6.2.3 Standard Error of the Mean** — We define SE(X̄) = σ/√n and carefully distinguish it from standard deviation.

- **6.2.4 Visualising the Effect of Sample Size** — We simulate and visualise how sampling distributions narrow as n increases.

### 6.3 The Central Limit Theorem

- **6.3.1 Statement of the CLT** — We state the theorem precisely: the sampling distribution of the mean approaches normal as n increases.

- **6.3.2 Why the CLT Is Remarkable** — We explain why it's surprising that the result holds regardless of population shape.

- **6.3.3 Visualising the CLT** — We demonstrate the CLT with simulations from uniform, exponential, and bimodal distributions.

- **6.3.4 How Large Is "Large Enough"?** — We discuss when the normal approximation is adequate, examining the n ≥ 30 guideline.

- **6.3.5 Mathematical Intuition** — We provide intuitive reasoning for why the CLT works.

### 6.4 Sampling Distribution of the Sample Proportion

- **6.4.1 Proportion as a Special Mean** — We show that the sample proportion is the mean of Bernoulli random variables.

- **6.4.2 Standard Error of a Proportion** — We derive SE(p̂) = √[p(1-p)/n].

- **6.4.3 Normal Approximation to the Binomial** — We explain when the normal approximation is appropriate (np ≥ 10, n(1-p) ≥ 10).

### 6.5 Sampling Distribution of the Sample Variance

- **6.5.1 Distribution of S²** — We derive the connection between sample variance and chi-square distribution.

- **6.5.2 Why We Divide by n-1** — We prove rigorously why n-1 gives an unbiased estimator.

### 6.6 Sampling Distribution of Differences

- **6.6.1 Difference of Two Sample Means** — We derive the distribution of X̄₁ - X̄₂ for comparing groups.

- **6.6.2 Difference of Two Sample Proportions** — We derive the distribution for comparing proportions.

### 6.7 The t-Distribution in Sampling

- **6.7.1 When σ Is Unknown** — We explain why substituting s for σ changes the sampling distribution.

- **6.7.2 The t-Statistic** — We define t = (X̄ - μ) / (s/√n) and derive its distribution.

- **6.7.3 Degrees of Freedom and Shape** — We explain degrees of freedom and visualise how t approaches normal.

**Communicating to Stakeholders:** Explaining why larger studies are more reliable and what "margin of error" really means.

**Quick Reference:** Chapter 6 Sampling Distribution Formulae

---

## Chapter 7: Point Estimation

*This chapter covers the theory and methods for estimating population parameters. We implement estimators from scratch and rigorously evaluate their properties.*

### 7.1 Introduction to Estimation

- **7.1.1 The Estimation Problem** — We frame the goal: using sample data to learn about unknown population parameters.

- **7.1.2 Estimators vs Estimates** — We distinguish between the formula (estimator) and its value for specific data (estimate).

- **7.1.3 Notation** — We establish θ̂ notation for estimators of θ.

### 7.2 Properties of Good Estimators

- **7.2.1 Bias** — We define bias as E(θ̂) - θ, prove unbiasedness of common estimators, and visualise bias.

- **7.2.2 Variance and Precision** — We define estimator variance and explain why lower variance is desirable.

- **7.2.3 Mean Squared Error** — We derive MSE = Variance + Bias² and explain the bias-variance trade-off.

- **7.2.4 Consistency** — We define consistency as convergence to the true parameter as n → ∞.

- **7.2.5 Efficiency** — We define relative efficiency and introduce the Cramér-Rao lower bound.

- **7.2.6 Sufficiency** — We introduce the concept of sufficient statistics that capture all information about a parameter.

### 7.3 Method of Moments Estimation

- **7.3.1 The Idea** — We explain matching sample moments to population moments to solve for parameters.

- **7.3.2 Population and Sample Moments** — We define moments formally and compute them in R.

- **7.3.3 Examples** — We derive MoM estimators for normal, exponential, and gamma distributions.

- **7.3.4 Properties and Limitations** — We discuss when MoM works well and when it doesn't.

### 7.4 Maximum Likelihood Estimation

- **7.4.1 The Likelihood Function** — We define L(θ|data) as the probability of observed data as a function of the parameter.

- **7.4.2 Log-Likelihood** — We explain why we work with log-likelihood for computational convenience.

- **7.4.3 The Maximum Likelihood Principle** — We explain why maximising likelihood yields sensible estimators.

- **7.4.4 Finding MLEs Analytically** — We derive MLEs for normal, binomial, Poisson, and exponential distributions.

- **7.4.5 Finding MLEs Numerically** — We use optim() to find MLEs when analytical solutions don't exist.

- **7.4.6 Visualising Likelihood Functions** — We plot likelihood surfaces to build intuition.

- **7.4.7 Properties of MLEs** — We prove consistency, asymptotic normality, and efficiency of MLEs.

- **7.4.8 Standard Errors via Fisher Information** — We derive standard errors using the observed and expected information.

### 7.5 Comparing Estimators

- **7.5.1 Simulation Studies** — We compare estimators via Monte Carlo simulation.

- **7.5.2 Efficiency Comparison** — We compute relative efficiency of competing estimators.

### 7.6 Robust Estimation

- **7.6.1 Sensitivity to Outliers** — We demonstrate how outliers affect classical estimators.

- **7.6.2 Breakdown Point** — We define robustness formally as the proportion of data that can be corrupted.

- **7.6.3 Robust Alternatives** — We introduce trimmed means, winsorised estimators, and M-estimators.

**Communicating to Stakeholders:** Reporting estimates with appropriate precision and uncertainty quantification.

**Quick Reference:** Chapter 7 Estimation Methods Summary

---

## Chapter 8: Interval Estimation — Confidence Intervals

*This chapter covers the construction and interpretation of confidence intervals, providing ranges of plausible values for population parameters.*

### 8.1 The Need for Interval Estimation

- **8.1.1 Limitations of Point Estimates** — We explain why a single number is insufficient to characterise what we know.

- **8.1.2 What Is a Confidence Interval?** — We define CIs as intervals constructed to contain the parameter with specified probability.

- **8.1.3 The Confidence Level** — We explain what "95% confidence" means and doesn't mean.

### 8.2 Interpreting Confidence Intervals

- **8.2.1 The Correct Interpretation** — We carefully explain that confidence is about the procedure, not the specific interval.

- **8.2.2 Common Misinterpretations** — We address and correct frequent misconceptions about CIs.

- **8.2.3 Simulation Demonstration** — We simulate many CIs to show that approximately 95% contain the true parameter.

### 8.3 Confidence Intervals for the Mean (σ Known)

- **8.3.1 Derivation** — We derive the z-interval from the sampling distribution of the mean.

- **8.3.2 Margin of Error** — We define and interpret the margin of error.

- **8.3.3 Effects of Confidence Level and Sample Size** — We show how changing these affects interval width.

### 8.4 Confidence Intervals for the Mean (σ Unknown)

- **8.4.1 The Problem** — We explain why using s instead of σ adds uncertainty.

- **8.4.2 The t-Distribution Solution** — We show why the t-distribution is appropriate when σ is estimated.

- **8.4.3 The t-Interval** — We derive the formula and implement it from scratch and with t.test().

### 8.5 Confidence Intervals for Proportions

- **8.5.1 The Wald Interval** — We derive the standard interval and explain its problems with extreme proportions.

- **8.5.2 The Wilson Score Interval** — We derive this improved interval with better coverage properties.

- **8.5.3 The Agresti-Coull Interval** — We present this simple "add 2 successes and 2 failures" approximation.

- **8.5.4 Exact Intervals** — We explain Clopper-Pearson exact intervals and when they're needed.

- **8.5.5 Comparing Methods** — We compare coverage probabilities across methods.

### 8.6 Confidence Intervals for Differences

- **8.6.1 Difference of Two Means (Independent)** — We derive intervals for comparing two independent groups.

- **8.6.2 Difference of Two Means (Paired)** — We derive intervals for paired comparisons.

- **8.6.3 Difference of Two Proportions** — We derive intervals for comparing proportions.

### 8.7 Confidence Intervals for Variance

- **8.7.1 CI for Variance Using Chi-Square** — We derive the interval from the chi-square distribution of sample variance.

- **8.7.2 Asymmetry** — We explain why these intervals are asymmetric.

### 8.8 Sample Size Determination

- **8.8.1 For Estimating a Mean** — We derive the sample size formula given desired margin of error.

- **8.8.2 For Estimating a Proportion** — We derive sample size with conservative and informed approaches.

- **8.8.3 Practical Considerations** — We discuss budget, feasibility, and planning studies.

### 8.9 Bootstrap Confidence Intervals

- **8.9.1 The Bootstrap Principle** — We explain resampling with replacement to estimate sampling distributions.

- **8.9.2 The Percentile Method** — We implement the simple percentile bootstrap.

- **8.9.3 The BCa Method** — We explain bias-correction and acceleration adjustments.

- **8.9.4 When to Use Bootstrap** — We discuss advantages and limitations of bootstrap intervals.

### 8.10 Profile Likelihood Intervals

- **8.10.1 The Profile Likelihood** — We define the profile likelihood for interval estimation.

- **8.10.2 Construction** — We show how to find intervals from the profile likelihood.

**Communicating to Stakeholders:** Presenting confidence intervals in reports so that non-statisticians understand the uncertainty.

**Quick Reference:** Chapter 8 CI Formulae and Method Selection Guide

---

## Chapter 9: Hypothesis Testing — Foundations

*This chapter introduces the logic, mechanics, and interpretation of hypothesis testing. We emphasise proper understanding and address common pitfalls.*

### 9.1 The Logic of Hypothesis Testing

- **9.1.1 Scientific vs Statistical Hypotheses** — We distinguish research questions from testable statistical statements.

- **9.1.2 The "Proof by Contradiction" Framework** — We explain hypothesis testing as assuming H₀ and seeking contradicting evidence.

- **9.1.3 Null and Alternative Hypotheses** — We define H₀ and H₁ and explain how to formulate them correctly.

- **9.1.4 One-Tailed vs Two-Tailed Tests** — We explain when each is appropriate and common mistakes in choosing.

### 9.2 Test Statistics and P-Values

- **9.2.1 What Is a Test Statistic?** — We define test statistics as summaries that measure evidence against H₀.

- **9.2.2 The Null Distribution** — We explain the distribution of the test statistic assuming H₀ is true.

- **9.2.3 P-Values: Definition** — We define the p-value as P(data as extreme or more | H₀ true).

- **9.2.4 What P-Values Mean** — We carefully explain correct interpretation of p-values.

- **9.2.5 Common Misconceptions** — We address and correct frequent misunderstandings about p-values.

### 9.3 Making Decisions

- **9.3.1 The Significance Level (α)** — We define α and explain why it's set before seeing data.

- **9.3.2 Rejecting vs Failing to Reject** — We explain the decision rule and why we don't "accept" H₀.

- **9.3.3 Statistical vs Practical Significance** — We distinguish between statistical detection and meaningful effects.

### 9.4 Errors in Hypothesis Testing

- **9.4.1 Type I Error (False Positive)** — We define rejecting H₀ when it's true and explain α controls this.

- **9.4.2 Type II Error (False Negative)** — We define failing to reject H₀ when H₁ is true.

- **9.4.3 The Error Trade-off** — We explain why reducing one error type increases the other.

- **9.4.4 Consequences in Biomedical Contexts** — We discuss real-world implications of each error type.

### 9.5 Statistical Power

- **9.5.1 Definition** — We define power as P(reject H₀ | H₁ true) = 1 - β.

- **9.5.2 Factors Affecting Power** — We explain how sample size, effect size, α, and variability affect power.

- **9.5.3 Power Analysis** — We demonstrate a priori power analysis for study planning.

- **9.5.4 Power Curves** — We visualise power as a function of effect size and sample size.

### 9.6 Effect Sizes

- **9.6.1 Why Effect Sizes Matter** — We explain why statistical significance alone is insufficient.

- **9.6.2 Effect Sizes for Means** — We define Cohen's d and its interpretation.

- **9.6.3 Effect Sizes for Proportions** — We define risk difference, risk ratio, odds ratio, and NNT.

- **9.6.4 Always Report Effect Sizes** — We argue for routine reporting of effect sizes with CIs.

### 9.7 Confidence Intervals and Hypothesis Tests

- **9.7.1 The Duality** — We prove the equivalence between CIs and two-sided tests.

- **9.7.2 CIs Are Often More Informative** — We explain why CIs convey more than p-values alone.

### 9.8 The Hypothesis Testing Controversy

- **9.8.1 Criticisms of NHST** — We review major criticisms of null hypothesis significance testing.

- **9.8.2 The Reproducibility Crisis** — We explain how misuse of hypothesis testing contributed to the crisis.

- **9.8.3 Best Practices** — We present recommendations for responsible hypothesis testing.

**Communicating to Stakeholders:** Explaining what "statistically significant" means (and doesn't mean) to non-statisticians.

**Quick Reference:** Chapter 9 Hypothesis Testing Checklist

---

## Chapter 10: Hypothesis Tests for Means and Proportions

*This chapter covers the most commonly used hypothesis tests. We implement each test from scratch before using built-in functions.*

### 10.1 One-Sample Z-Test for the Mean

- **10.1.1 When to Use** — We explain this test is for means when σ is known (rare in practice).

- **10.1.2 Test Statistic and Distribution** — We derive Z = (X̄ - μ₀) / (σ/√n).

- **10.1.3 Implementation** — We implement the test from scratch.

### 10.2 One-Sample t-Test for the Mean

- **10.2.1 When to Use** — We explain this is the standard test for means with unknown σ.

- **10.2.2 Test Statistic and Distribution** — We derive t = (X̄ - μ₀) / (s/√n) with n-1 df.

- **10.2.3 Assumptions** — We list assumptions and how to check them.

- **10.2.4 Implementation** — We implement from scratch and with t.test().

### 10.3 Two-Sample t-Test for Independent Means

- **10.3.1 The Research Question** — We frame testing whether two populations have different means.

- **10.3.2 Pooled t-Test** — We derive the test assuming equal variances.

- **10.3.3 Welch's t-Test** — We derive the test not assuming equal variances.

- **10.3.4 Which to Use?** — We recommend Welch's test as default.

- **10.3.5 Implementation** — We implement both versions and demonstrate t.test().

### 10.4 Paired t-Test

- **10.4.1 When to Use** — We explain this test is for matched or repeated measures designs.

- **10.4.2 Reducing to One-Sample** — We show how taking differences reduces to a one-sample problem.

- **10.4.3 Why Pairing Increases Power** — We explain the variance reduction from pairing.

- **10.4.4 Implementation** — We implement from scratch and with t.test(paired = TRUE).

### 10.5 One-Sample Test for a Proportion

- **10.5.1 Z-Test for Proportion** — We derive the test using normal approximation.

- **10.5.2 Exact Binomial Test** — We derive the exact test for small samples.

- **10.5.3 Implementation** — We implement with prop.test() and binom.test().

### 10.6 Two-Sample Test for Proportions

- **10.6.1 Comparing Two Proportions** — We derive the z-test for comparing independent proportions.

- **10.6.2 Pooled Proportion** — We explain why we pool under H₀.

- **10.6.3 Implementation** — We implement with prop.test().

### 10.7 Tests for Variance

- **10.7.1 Chi-Square Test for Single Variance** — We derive the test and note sensitivity to non-normality.

- **10.7.2 F-Test for Two Variances** — We derive the test and its limitations.

- **10.7.3 Levene's Test** — We introduce this robust alternative.

### 10.8 Summary: Choosing the Right Test

- **10.8.1 Decision Flowchart** — We provide a systematic approach to test selection.

- **10.8.2 Common Mistakes** — We address frequent errors in choosing tests.

**Communicating to Stakeholders:** Reporting comparative study results clearly and accurately.

**Quick Reference:** Chapter 10 Test Selection Guide and Formulae

---

## Chapter 11: Chi-Square Tests and Non-Parametric Methods

*This chapter covers tests for categorical data and distribution-free methods when parametric assumptions are violated.*

### 11.1 Chi-Square Goodness-of-Fit Test

- **11.1.1 The Research Question** — We test whether observed frequencies match expected frequencies.

- **11.1.2 Test Statistic Derivation** — We derive χ² = Σ(O - E)² / E and explain why it works.

- **11.1.3 Degrees of Freedom** — We explain how constraints determine df.

- **11.1.4 Implementation** — We implement from scratch and with chisq.test().

### 11.2 Chi-Square Test of Independence

- **11.2.1 The Research Question** — We test whether two categorical variables are associated.

- **11.2.2 Expected Frequencies** — We derive expected counts under independence.

- **11.2.3 Effect Size: Cramér's V** — We introduce a measure of association strength.

- **11.2.4 Implementation** — We implement from scratch and with chisq.test().

### 11.3 Fisher's Exact Test

- **11.3.1 When to Use** — We explain this test is for small samples or sparse tables.

- **11.3.2 The Hypergeometric Logic** — We derive the exact probability calculation.

- **11.3.3 Implementation** — We demonstrate fisher.test().

### 11.4 McNemar's Test

- **11.4.1 Paired Nominal Data** — We explain when McNemar's test is appropriate.

- **11.4.2 Test Statistic** — We derive the test statistic for matched pairs.

- **11.4.3 Implementation** — We demonstrate mcnemar.test().

### 11.5 Tests for Normality

- **11.5.1 Why Test Normality?** — We discuss when normality matters and when it doesn't.

- **11.5.2 Shapiro-Wilk Test** — We explain this powerful test for normality.

- **11.5.3 Visual Assessment** — We emphasise QQ plots over formal tests.

- **11.5.4 What If Data Aren't Normal?** — We discuss transformations and alternatives.

### 11.6 Introduction to Non-Parametric Methods

- **11.6.1 What Are Non-Parametric Tests?** — We define tests that don't assume specific distributions.

- **11.6.2 When to Use Them** — We list situations favouring non-parametric approaches.

- **11.6.3 Advantages and Disadvantages** — We discuss trade-offs with parametric tests.

### 11.7 Sign Test

- **11.7.1 The Simplest Non-Parametric Test** — We introduce this test based only on direction.

- **11.7.2 Implementation** — We implement using the binomial distribution.

### 11.8 Wilcoxon Signed-Rank Test

- **11.8.1 Alternative to t-Test** — We explain this test uses both direction and magnitude.

- **11.8.2 Test Statistic** — We derive the signed-rank statistic.

- **11.8.3 Implementation** — We demonstrate wilcox.test().

### 11.9 Mann-Whitney U Test

- **11.9.1 Alternative to Two-Sample t-Test** — We explain this rank-based test for comparing groups.

- **11.9.2 Test Statistic** — We derive the U statistic from ranks.

- **11.9.3 Implementation** — We demonstrate wilcox.test() for two samples.

### 11.10 Kruskal-Wallis Test

- **11.10.1 Alternative to One-Way ANOVA** — We explain this test for comparing multiple groups.

- **11.10.2 Implementation** — We demonstrate kruskal.test().

### 11.11 Permutation Tests

- **11.11.1 The Logic** — We explain permutation testing as generating null distributions by shuffling.

- **11.11.2 Implementation from Scratch** — We write a complete permutation test.

- **11.11.3 Advantages** — We discuss when permutation tests are preferred.

**Communicating to Stakeholders:** Explaining when and why we use non-standard tests.

**Quick Reference:** Chapter 11 Non-Parametric Test Selection Guide

---

## Chapter 12: Introduction to Linear Regression

*This chapter introduces simple linear regression for understanding relationships between quantitative variables.*

### 12.1 The Regression Problem

- **12.1.1 Predicting One Variable from Another** — We introduce regression as modelling the relationship between variables.

- **12.1.2 Response and Explanatory Variables** — We define dependent and independent variables.

- **12.1.3 Correlation vs Regression** — We distinguish these related but different concepts.

### 12.2 The Simple Linear Regression Model

- **12.2.1 The Model Equation** — We derive Y = β₀ + β₁X + ε and explain each component.

- **12.2.2 Interpreting Parameters** — We explain the intercept and slope in context.

- **12.2.3 Model Assumptions** — We list linearity, independence, homoscedasticity, and normality.

### 12.3 Least Squares Estimation

- **12.3.1 The Least Squares Criterion** — We explain minimising sum of squared residuals.

- **12.3.2 Deriving the Estimators** — We derive β̂₀ and β̂₁ using calculus.

- **12.3.3 Properties** — We prove unbiasedness and derive variances.

- **12.3.4 Implementation** — We implement from scratch and with lm().

### 12.4 Measuring Model Fit

- **12.4.1 Residuals** — We define eᵢ = yᵢ - ŷᵢ and their properties.

- **12.4.2 ANOVA Decomposition** — We partition total variation into regression and residual.

- **12.4.3 R² (Coefficient of Determination)** — We derive R² and explain what it does and doesn't tell us.

- **12.4.4 Residual Standard Error** — We define and interpret the RSE.

### 12.5 Inference for Regression Coefficients

- **12.5.1 Sampling Distribution of β̂₁** — We derive the distribution of the slope estimator.

- **12.5.2 Standard Error of the Slope** — We derive SE(β̂₁).

- **12.5.3 t-Test for the Slope** — We test H₀: β₁ = 0.

- **12.5.4 Confidence Interval for the Slope** — We construct CIs for regression coefficients.

- **12.5.5 Reading lm() Output** — We explain every number in the summary.

### 12.6 Prediction

- **12.6.1 Point Prediction** — We compute predicted values.

- **12.6.2 Confidence vs Prediction Intervals** — We derive and distinguish these two types of intervals.

- **12.6.3 The Dangers of Extrapolation** — We explain why prediction outside the data range is risky.

### 12.7 Regression Diagnostics

- **12.7.1 Residual Plots** — We use residuals vs fitted to check assumptions.

- **12.7.2 Checking Linearity** — We identify non-linear patterns.

- **12.7.3 Checking Homoscedasticity** — We identify heteroscedasticity.

- **12.7.4 Checking Normality** — We use QQ plots of residuals.

- **12.7.5 Identifying Outliers and Influential Points** — We define leverage, Cook's distance, and influence.

- **12.7.6 The plot() Method for lm** — We interpret R's four diagnostic plots.

### 12.8 Transformations

- **12.8.1 When to Transform** — We explain signs that transformation might help.

- **12.8.2 Log Transformations** — We cover log-y, log-x, and log-log transformations with interpretation.

- **12.8.3 Other Transformations** — We introduce square root and Box-Cox approaches.

### 12.9 Correlation and Regression

- **12.9.1 The Relationship** — We show r² = R² in simple regression.

- **12.9.2 Regression to the Mean** — We explain this phenomenon with Galton's original example.

**Communicating to Stakeholders:** Presenting regression results without overinterpreting or misrepresenting.

**Quick Reference:** Chapter 12 Regression Formulae and Diagnostic Checklist

---

## Chapter 13: Analysis of Variance (ANOVA)

*This chapter introduces ANOVA for comparing means across multiple groups.*

### 13.1 The Multiple Comparison Problem

- **13.1.1 Why Not Multiple t-Tests?** — We explain how multiple testing inflates Type I error.

- **13.1.2 Family-Wise Error Rate** — We derive how error accumulates with multiple tests.

### 13.2 One-Way ANOVA: The Idea

- **13.2.1 Comparing Multiple Groups** — We introduce the research question and hypotheses.

- **13.2.2 The ANOVA Model** — We present Yᵢⱼ = μ + αᵢ + εᵢⱼ.

### 13.3 Partitioning Variability

- **13.3.1 Total, Between, and Within Variation** — We derive SST = SSB + SSW.

- **13.3.2 Degrees of Freedom** — We explain df for each component.

- **13.3.3 Mean Squares** — We derive MSB and MSW.

### 13.4 The F-Test

- **13.4.1 The F-Statistic** — We derive F = MSB/MSW and explain its distribution.

- **13.4.2 The ANOVA Table** — We construct and interpret the full ANOVA table.

- **13.4.3 Implementation** — We implement from scratch and with aov().

### 13.5 Assumptions and Checking

- **13.5.1 Normality** — We check normality within groups.

- **13.5.2 Equal Variances** — We use Levene's test.

- **13.5.3 Alternatives When Assumptions Fail** — We introduce Welch's ANOVA and Kruskal-Wallis.

### 13.6 Effect Size

- **13.6.1 η² and Partial η²** — We define and interpret ANOVA effect sizes.

- **13.6.2 ω²** — We introduce this less biased alternative.

### 13.7 Post-Hoc Comparisons

- **13.7.1 The Need for Post-Hoc Tests** — We explain that significant ANOVA doesn't tell us which groups differ.

- **13.7.2 Tukey's HSD** — We derive and implement Tukey's honest significant difference.

- **13.7.3 Bonferroni Correction** — We apply Bonferroni to pairwise comparisons.

- **13.7.4 Dunnett's Test** — We introduce comparisons to a control.

- **13.7.5 Choosing a Method** — We provide guidance on method selection.

### 13.8 Planned Contrasts

- **13.8.1 When You Have Specific Hypotheses** — We explain contrasts as pre-planned comparisons.

- **13.8.2 Orthogonal Contrasts** — We define and implement orthogonal contrasts.

### 13.9 ANOVA as a Linear Model

- **13.9.1 Connection to Regression** — We show ANOVA is regression with dummy variables.

- **13.9.2 Using lm() for ANOVA** — We demonstrate the equivalence in R.

**Communicating to Stakeholders:** Reporting ANOVA results and multiple comparisons clearly.

**Quick Reference:** Chapter 13 ANOVA Formulae and Post-Hoc Decision Guide

---

## Chapter 14: Introduction to Experimental Design

*This chapter covers principles of designing experiments to enable valid causal inference.*

### 14.1 Why Design Matters

- **14.1.1 The Goal: Causal Inference** — We explain that good design enables causal conclusions.

- **14.1.2 Confounding Variables** — We define confounding and show how it prevents causal inference.

### 14.2 Fundamental Principles

- **14.2.1 Randomisation** — We explain why random assignment eliminates confounding.

- **14.2.2 Replication** — We distinguish true replication from pseudoreplication.

- **14.2.3 Blocking** — We explain controlling for known sources of variation.

- **14.2.4 Control Groups** — We discuss types of controls and their importance.

### 14.3 Common Designs

- **14.3.1 Completely Randomised Design** — We present the simplest experimental design.

- **14.3.2 Randomised Block Design** — We explain blocking on a known variable.

- **14.3.3 Paired Designs** — We cover before-after and crossover designs.

- **14.3.4 Factorial Designs** — We introduce studying multiple factors simultaneously.

### 14.4 Blinding

- **14.4.1 Single and Double Blind** — We explain why blinding reduces bias.

- **14.4.2 When Blinding Is Impossible** — We discuss alternatives when blinding can't be done.

### 14.5 Sample Size and Power

- **14.5.1 A Priori Power Analysis** — We demonstrate planning sample size before a study.

- **14.5.2 Using pwr Package** — We show practical power calculations.

### 14.6 Threats to Validity

- **14.6.1 Selection Bias** — We explain how non-random selection threatens validity.

- **14.6.2 Attrition** — We discuss dropout and its consequences.

- **14.6.3 Other Threats** — We cover contamination, Hawthorne effect, and more.

### 14.7 Ethical Considerations

- **14.7.1 Equipoise** — We explain when randomisation is ethical.

- **14.7.2 Informed Consent** — We discuss consent requirements.

- **14.7.3 Stopping Rules** — We explain planned interim analyses.

**Communicating to Stakeholders:** Explaining why proper design matters for trustworthy conclusions.

**Quick Reference:** Chapter 14 Experimental Design Decision Guide

---

## Chapter 15: Multiple Comparisons and Reproducibility

*This chapter addresses multiple testing and the reproducibility crisis in modern science.*

### 15.1 The Multiple Testing Problem

- **15.1.1 Why Many Tests Are Dangerous** — We demonstrate how false positives accumulate.

- **15.1.2 Family-Wise Error Rate** — We define FWER formally.

- **15.1.3 Visualising Error Accumulation** — We simulate to show the problem dramatically.

### 15.2 Controlling Family-Wise Error Rate

- **15.2.1 Bonferroni Correction** — We derive and implement this simple but conservative correction.

- **15.2.2 Holm's Method** — We explain this uniformly more powerful alternative.

- **15.2.3 Other Methods** — We briefly cover Hochberg and Hommel.

- **15.2.4 Using p.adjust()** — We demonstrate R's built-in functions.

### 15.3 False Discovery Rate Control

- **15.3.1 A Different Philosophy** — We explain controlling expected proportion of false discoveries.

- **15.3.2 Benjamini-Hochberg Procedure** — We derive and implement FDR control.

- **15.3.3 q-Values** — We introduce q-values as FDR-adjusted p-values.

- **15.3.4 When to Use FDR vs FWER** — We provide guidance on method selection.

### 15.4 The Reproducibility Crisis

- **15.4.1 What Went Wrong** — We review evidence of widespread non-reproducibility.

- **15.4.2 Causes** — We discuss low power, p-hacking, publication bias, and HARKing.

- **15.4.3 Consequences** — We explain impacts on science and public trust.

### 15.5 Questionable Research Practices

- **15.5.1 P-Hacking** — We demonstrate how flexible analysis inflates false positives.

- **15.5.2 HARKing** — We explain hypothesising after results are known.

- **15.5.3 The Garden of Forking Paths** — We visualise how many researcher choices affect results.

### 15.6 Solutions and Best Practices

- **15.6.1 Pre-Registration** — We explain committing to analyses before seeing data.

- **15.6.2 Registered Reports** — We introduce peer review before data collection.

- **15.6.3 Reporting Guidelines** — We cover CONSORT, STROBE, and other standards.

- **15.6.4 Open Science** — We discuss open data, code, and materials.

- **15.6.5 Statistical Best Practices** — We summarise recommendations for responsible analysis.

### 15.7 Reproducible Research with R

- **15.7.1 R Markdown Basics** — We demonstrate literate programming.

- **15.7.2 Version Control with Git** — We introduce tracking changes to code.

- **15.7.3 Creating Reproducible Reports** — We show a complete reproducible workflow.

**Communicating to Stakeholders:** Being honest about uncertainty, limitations, and what we don't know.

**Quick Reference:** Chapter 15 Multiple Testing Methods and Best Practices Checklist

---

## Appendices

### Appendix A: R Programming for Statistical Computing
Brief descriptions of data structures, vectorised operations, functions, apply family, data.table, and ggplot2.

### Appendix B: Mathematical Foundations
Summation notation, derivatives and integrals for statistics, logarithms and exponentials, basic matrix operations.

### Appendix C: Probability Distribution Reference
Complete tables of discrete and continuous distributions with properties, formulae, and R functions.

### Appendix D: Statistical Tables
Z, t, chi-square, and F tables with note on why we use R instead.

### Appendix E: Datasets Used in This Course
Descriptions of all datasets with sources, variables, and access instructions.

### Appendix F: Glossary of Statistical Terms

### Appendix G: Quick Reference Cards
Compact summaries of formulae for descriptive statistics, probability, distributions, CIs, tests, and R functions.

---

## Data Sources

- **NHANES** — US population health data from CDC
- **{medicaldata} R Package** — 19 curated medical teaching datasets
- **NHLBI Teaching Datasets** — Datasets designed for biostatistics education
- **WHO Global Health Observatory** — International health statistics
- **Simulated Data** — Custom datasets for specific teaching purposes

---

## Notes on Implementation

- All statistical functions are first implemented from scratch
- Built-in functions introduced after manual implementation
- Code prioritises clarity over efficiency
- British Oxford English throughout
- All materials written as R Markdown documents
