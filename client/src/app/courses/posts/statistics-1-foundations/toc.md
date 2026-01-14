# Statistics with R I: Foundations
## A Comprehensive Introduction for R Programmers

---

## Preface

This course provides a rigorous introduction to statistical thinking and methods for those already proficient in R programming. Rather than teaching R basics, we assume you can write functions, manipulate data with data.table, and create visualisations with ggplot2. Our focus is purely on statistics: building deep intuition, understanding the mathematics, and implementing methods from scratch before relying on packages.

Throughout this course, we use biomedical and clinical examples to ground abstract concepts in real-world applications. You will work with publicly available datasets from sources such as NHANES, the {medicaldata} R package, NHLBI teaching datasets, and simulated clinical trial data.

Every concept is presented with:
1. **Intuition first** — visual and conceptual understanding before formulae
2. **Mathematical foundation** — the theory behind the methods
3. **Implementation from scratch** — coding the methods yourself to truly understand them
4. **Practical application** — using built-in functions and packages efficiently

We write in British Oxford English throughout.

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

This chapter establishes the foundational concepts and vocabulary of statistics. We explore what statistics is, why it matters, and how to think statistically about data and uncertainty.

### 1.1 What Is Statistics?
- 1.1.1 Statistics as the Science of Learning from Data
- 1.1.2 A Brief History: From Census to Modern Data Science
- 1.1.3 Descriptive vs Inferential Statistics
- 1.1.4 The Role of Statistics in Biomedical Research
  - *Example: How clinical trials establish drug efficacy*

### 1.2 Populations and Samples
- 1.2.1 Defining the Population of Interest
- 1.2.2 Why We Sample: Practical and Theoretical Reasons
- 1.2.3 Parameters vs Statistics: The Fundamental Distinction
- 1.2.4 The Goal of Inference: Learning About Populations from Samples
- 1.2.5 Notation Conventions (μ vs x̄, σ vs s, π vs p̂)
  - *Example: Estimating average blood pressure in a population from a sample*
  - *Visualisation: Illustrating the relationship between population and sample*

### 1.3 Types of Variables
- 1.3.1 Quantitative Variables
  - 1.3.1.1 Continuous Variables (measurements that can take any value)
  - 1.3.1.2 Discrete Variables (countable values)
- 1.3.2 Qualitative (Categorical) Variables
  - 1.3.2.1 Nominal Variables (categories without order)
  - 1.3.2.2 Ordinal Variables (categories with meaningful order)
- 1.3.3 Scales of Measurement: Nominal, Ordinal, Interval, Ratio
- 1.3.4 Identifying Variable Types in Practice
  - *Example: Classifying variables in a patient dataset (age, sex, disease stage, blood glucose)*
  - *Exercise: Dataset from {medicaldata} — classify each variable*

### 1.4 Data Collection Methods
- 1.4.1 Observational Studies
  - 1.4.1.1 Cross-Sectional Studies
  - 1.4.1.2 Case-Control Studies
  - 1.4.1.3 Cohort Studies (Prospective and Retrospective)
- 1.4.2 Experimental Studies
  - 1.4.2.1 Controlled Experiments
  - 1.4.2.2 Randomised Controlled Trials (RCTs)
- 1.4.3 The Crucial Difference: Association vs Causation
  - *Example: Observational studies on smoking and lung cancer vs RCTs for drug efficacy*

### 1.5 Sampling Methods
- 1.5.1 Probability Sampling Methods
  - 1.5.1.1 Simple Random Sampling
  - 1.5.1.2 Stratified Random Sampling
  - 1.5.1.3 Cluster Sampling
  - 1.5.1.4 Systematic Sampling
- 1.5.2 Non-Probability Sampling Methods
  - 1.5.2.1 Convenience Sampling
  - 1.5.2.2 Quota Sampling
  - 1.5.2.3 Snowball Sampling
- 1.5.3 Sampling Bias and How to Minimise It
- 1.5.4 Implementing Random Sampling in R
  - *Code: Writing a stratified sampling function from scratch*
  - *Example: Sampling patients stratified by age group and sex*

### 1.6 Sources of Bias and Variability
- 1.6.1 Selection Bias
- 1.6.2 Measurement Bias (Systematic Error)
- 1.6.3 Response Bias
- 1.6.4 Survivorship Bias
- 1.6.5 Random Variability vs Systematic Bias
  - *Visualisation: Target diagrams showing accuracy vs precision*
  - *Example: Bias in self-reported health surveys*

### 1.7 Introduction to Statistical Software and Reproducibility
- 1.7.1 Why Reproducibility Matters
- 1.7.2 Setting Seeds for Reproducible Random Processes
- 1.7.3 Organising Statistical Projects
- 1.7.4 Introduction to R Markdown and Quarto for Reproducible Reports

**Communicating to Stakeholders:** Explaining study design and its limitations to collaborators

**Quick Reference:** Chapter 1 Key Terms and Concepts

---

## Chapter 2: Descriptive Statistics — Summarising Data Numerically

This chapter covers the fundamental numerical summaries used to describe datasets. We learn to quantify centre, spread, and shape, implementing each measure from scratch.

### 2.1 Measures of Central Tendency
- 2.1.1 The Arithmetic Mean
  - 2.1.1.1 Definition and Formula
  - 2.1.1.2 Properties of the Mean
  - 2.1.1.3 Sensitivity to Outliers
  - 2.1.1.4 Implementing the Mean from Scratch in R
- 2.1.2 The Median
  - 2.1.2.1 Definition and Calculation (Odd and Even n)
  - 2.1.2.2 Robustness to Outliers
  - 2.1.2.3 When to Prefer Median over Mean
  - 2.1.2.4 Implementing the Median from Scratch
- 2.1.3 The Mode
  - 2.1.3.1 Definition for Discrete and Continuous Data
  - 2.1.3.2 Unimodal, Bimodal, and Multimodal Distributions
  - 2.1.3.3 Implementing Mode Detection
- 2.1.4 Comparing Mean, Median, and Mode
  - *Visualisation: How skewness affects the relationship between mean, median, and mode*
  - *Example: Hospital length of stay data — comparing measures*
- 2.1.5 Other Means
  - 2.1.5.1 Weighted Mean
  - 2.1.5.2 Trimmed Mean
  - 2.1.5.3 Geometric Mean (for ratios and growth rates)
  - 2.1.5.4 Harmonic Mean (for rates and ratios)
  - *Example: Geometric mean for fold-change in gene expression*
  - *Example: Harmonic mean for averaging rates*

### 2.2 Measures of Dispersion (Spread)
- 2.2.1 Range
  - 2.2.1.1 Definition and Calculation
  - 2.2.1.2 Limitations of the Range
- 2.2.2 Interquartile Range (IQR)
  - 2.2.2.1 Definition and Calculation
  - 2.2.2.2 Robustness Properties
- 2.2.3 Variance
  - 2.2.3.1 Population Variance (σ²)
  - 2.2.3.2 Sample Variance (s²) and Bessel's Correction (n-1)
  - 2.2.3.3 Why We Divide by n-1: Degrees of Freedom Intuition
  - 2.2.3.4 Implementing Variance from Scratch
- 2.2.4 Standard Deviation
  - 2.2.4.1 Definition: Square Root of Variance
  - 2.2.4.2 Interpretation in Original Units
  - 2.2.4.3 Population vs Sample Standard Deviation
  - 2.2.4.4 Implementing Standard Deviation from Scratch
- 2.2.5 Coefficient of Variation
  - 2.2.5.1 Definition: CV = s/x̄
  - 2.2.5.2 Comparing Variability Across Different Scales
  - *Example: Comparing variability of different biomarkers*
- 2.2.6 Mean Absolute Deviation
  - 2.2.6.1 Definition and Calculation
  - 2.2.6.2 Comparison with Standard Deviation
- 2.2.7 Robust Measures of Spread
  - 2.2.7.1 Median Absolute Deviation (MAD)
  - 2.2.7.2 Scaling MAD to Estimate σ
  - *Example: Comparing SD and MAD on data with outliers*

### 2.3 Measures of Position
- 2.3.1 Percentiles and Quantiles
  - 2.3.1.1 Definitions and Notation
  - 2.3.1.2 Different Methods for Calculating Quantiles
  - 2.3.1.3 Implementing Quantile Calculation from Scratch
- 2.3.2 Quartiles and the Five-Number Summary
  - 2.3.2.1 Q1, Q2 (Median), Q3
  - 2.3.2.2 Minimum and Maximum
  - 2.3.2.3 The Five-Number Summary
- 2.3.3 Z-Scores (Standard Scores)
  - 2.3.3.1 Definition: z = (x - x̄)/s
  - 2.3.3.2 Interpretation: Number of Standard Deviations from Mean
  - 2.3.3.3 Standardisation and Its Uses
  - *Example: Comparing patient values to reference ranges*
- 2.3.4 Percentile Ranks
  - 2.3.4.1 Definition and Calculation
  - 2.3.4.2 Clinical Reference Ranges and Growth Charts
  - *Example: Child growth percentiles using WHO data*

### 2.4 Measures of Shape
- 2.4.1 Skewness
  - 2.4.1.1 Definition and Formula
  - 2.4.1.2 Positive (Right) Skew vs Negative (Left) Skew
  - 2.4.1.3 Interpreting Skewness Values
  - 2.4.1.4 Implementing Skewness from Scratch
  - *Visualisation: Examples of skewed distributions*
- 2.4.2 Kurtosis
  - 2.4.2.1 Definition and Formula
  - 2.4.2.2 Leptokurtic, Mesokurtic, Platykurtic Distributions
  - 2.4.2.3 Excess Kurtosis (Relative to Normal Distribution)
  - 2.4.2.4 Implementing Kurtosis from Scratch
  - *Visualisation: Distributions with different kurtosis values*
- 2.4.3 Why Shape Matters
  - 2.4.3.1 Implications for Choice of Summary Statistics
  - 2.4.3.2 Implications for Statistical Tests

### 2.5 Summarising Grouped Data
- 2.5.1 Frequency Distributions
  - 2.5.1.1 Creating Frequency Tables
  - 2.5.1.2 Relative Frequency and Cumulative Frequency
- 2.5.2 Computing Statistics from Grouped Data
  - 2.5.2.1 Estimating Mean from Frequency Tables
  - 2.5.2.2 Estimating Variance from Frequency Tables
- 2.5.3 Efficient Grouped Summaries with data.table
  - *Code: Group-wise summary statistics using data.table syntax*
  - *Example: Summarising biomarkers by treatment group*

### 2.6 Detecting Outliers
- 2.6.1 What Is an Outlier?
- 2.6.2 The IQR Rule (Tukey's Fences)
  - 2.6.2.1 Inner Fences: Q1 - 1.5×IQR, Q3 + 1.5×IQR
  - 2.6.2.2 Outer Fences: Q1 - 3×IQR, Q3 + 3×IQR
- 2.6.3 Z-Score Method
  - 2.6.3.1 Threshold Selection (|z| > 2, |z| > 3)
  - 2.6.3.2 Limitations with Non-Normal Data
- 2.6.4 Modified Z-Score Using MAD
- 2.6.5 Outliers in Biomedical Data: Error vs True Extreme Values
  - *Example: Identifying outliers in clinical lab measurements*
  - *Discussion: When to remove outliers vs when to investigate*

**Communicating to Stakeholders:** Creating summary tables for clinical reports

**Quick Reference:** Chapter 2 Formulae and R Implementations

---

## Chapter 3: Descriptive Statistics — Visualising Data

This chapter covers graphical methods for exploring and presenting data. We focus on creating effective visualisations and understanding what each plot reveals about the data.

### 3.1 Principles of Statistical Graphics
- 3.1.1 The Grammar of Graphics Philosophy
- 3.1.2 Choosing the Right Plot for Your Data Type
- 3.1.3 Principles of Effective Data Visualisation
  - 3.1.3.1 Maximise Data-Ink Ratio
  - 3.1.3.2 Avoid Chart Junk
  - 3.1.3.3 Use Appropriate Scales
  - 3.1.3.4 Colour and Accessibility
- 3.1.4 Common Visualisation Mistakes and How to Avoid Them
  - *Examples: Misleading axis scales, truncated axes, 3D pie charts*

### 3.2 Visualising Categorical Data
- 3.2.1 Bar Charts
  - 3.2.1.1 Simple Bar Charts for Frequencies
  - 3.2.1.2 Grouped Bar Charts for Comparing Categories
  - 3.2.1.3 Stacked Bar Charts for Composition
  - 3.2.1.4 Implementing with ggplot2
  - *Example: Disease prevalence by demographic group*
- 3.2.2 Pie Charts and Waffle Charts
  - 3.2.2.1 When Pie Charts Are Appropriate (Rarely)
  - 3.2.2.2 Waffle Charts as an Alternative
- 3.2.3 Mosaic Plots for Two Categorical Variables
  - *Example: Treatment outcome by disease stage*

### 3.3 Visualising Quantitative Data — Single Variable
- 3.3.1 Histograms
  - 3.3.1.1 Constructing Histograms: Binning Strategies
  - 3.3.1.2 Choosing Bin Width: Sturges', Scott's, Freedman-Diaconis Rules
  - 3.3.1.3 Interpreting Shape from Histograms
  - 3.3.1.4 Implementing Histogram Binning from Scratch
  - 3.3.1.5 Using geom_histogram() in ggplot2
  - *Example: Distribution of patient ages in a cohort study*
- 3.3.2 Density Plots
  - 3.3.2.1 Kernel Density Estimation (Intuition)
  - 3.3.2.2 Bandwidth Selection
  - 3.3.2.3 Comparing Density Plots to Histograms
  - 3.3.2.4 Using geom_density() in ggplot2
  - *Example: Comparing distributions of biomarkers*
- 3.3.3 Box Plots (Box-and-Whisker Plots)
  - 3.3.3.1 Anatomy of a Box Plot
  - 3.3.3.2 Identifying Outliers in Box Plots
  - 3.3.3.3 Comparing Groups with Side-by-Side Box Plots
  - 3.3.3.4 Using geom_boxplot() in ggplot2
  - *Example: Comparing treatment effects across groups*
- 3.3.4 Violin Plots
  - 3.3.4.1 Combining Density and Box Plot Information
  - 3.3.4.2 When Violin Plots Are More Informative
  - 3.3.4.3 Using geom_violin() in ggplot2
- 3.3.5 Strip Plots and Jittered Dot Plots
  - 3.3.5.1 Showing All Data Points
  - 3.3.5.2 Jittering to Avoid Overplotting
  - 3.3.5.3 Combining with Box Plots
  - *Example: Small sample clinical data visualisation*
- 3.3.6 Stem-and-Leaf Plots
  - 3.3.6.1 Construction and Interpretation
  - 3.3.6.2 Back-to-Back Stem-and-Leaf for Comparison
  - 3.3.6.3 Implementing in R
- 3.3.7 Empirical Cumulative Distribution Function (ECDF) Plots
  - 3.3.7.1 Definition and Interpretation
  - 3.3.7.2 Reading Percentiles from ECDF Plots
  - 3.3.7.3 Using stat_ecdf() in ggplot2
  - *Example: Comparing drug response distributions*

### 3.4 Visualising Relationships Between Two Quantitative Variables
- 3.4.1 Scatter Plots
  - 3.4.1.1 Basic Scatter Plot Construction
  - 3.4.1.2 Identifying Patterns: Linear, Non-Linear, No Relationship
  - 3.4.1.3 Dealing with Overplotting (Alpha, Jittering, Binning)
  - 3.4.1.4 Using geom_point() in ggplot2
  - *Example: Relationship between age and blood pressure*
- 3.4.2 Adding Trend Lines
  - 3.4.2.1 Linear Regression Lines
  - 3.4.2.2 LOESS Smoothers for Non-Linear Trends
  - 3.4.2.3 Using geom_smooth() in ggplot2
- 3.4.3 Scatter Plot Matrices (Pairs Plots)
  - 3.4.3.1 Visualising Multiple Pairwise Relationships
  - 3.4.3.2 Using GGally::ggpairs()
  - *Example: Exploring relationships among multiple biomarkers*

### 3.5 Visualising Relationships Involving Categorical Variables
- 3.5.1 Grouped Box Plots and Violin Plots
- 3.5.2 Faceting (Small Multiples)
  - 3.5.2.1 facet_wrap() for One Categorical Variable
  - 3.5.2.2 facet_grid() for Two Categorical Variables
  - *Example: Drug response by treatment group and sex*
- 3.5.3 Colour and Shape Encoding for Groups
  - *Example: Scatter plot coloured by disease status*

### 3.6 Visualising Correlation
- 3.6.1 Correlation Matrices
  - 3.6.1.1 Calculating Correlation Matrices in R
  - 3.6.1.2 Visualising with Heatmaps
  - 3.6.1.3 Using corrplot and ggcorrplot
  - *Example: Correlation among clinical variables*

### 3.7 Visualising Distributions: QQ Plots
- 3.7.1 The Idea: Comparing Data to a Theoretical Distribution
- 3.7.2 Constructing QQ Plots Step by Step
- 3.7.3 Interpreting Deviations from the Line
  - 3.7.3.1 Skewness Patterns
  - 3.7.3.2 Heavy Tails Patterns
  - 3.7.3.3 Outlier Patterns
- 3.7.4 Implementing QQ Plots from Scratch
- 3.7.5 Using stat_qq() and stat_qq_line() in ggplot2
  - *Example: Checking normality of residuals*

### 3.8 Time Series and Longitudinal Data Visualisation
- 3.8.1 Line Plots for Time Series
- 3.8.2 Spaghetti Plots for Individual Trajectories
- 3.8.3 Summary Trajectories with Confidence Bands
  - *Example: Patient biomarker trajectories over time*

### 3.9 Advanced Visualisation Topics
- 3.9.1 Combining Multiple Plots (patchwork Package)
- 3.9.2 Interactive Visualisation with plotly
- 3.9.3 Annotating Plots for Publication
- 3.9.4 Exporting High-Quality Figures

**Communicating to Stakeholders:** Creating publication-ready figures

**Quick Reference:** Chapter 3 Plot Selection Guide and ggplot2 Syntax

---

## Chapter 4: Probability — Foundations

This chapter introduces the mathematical framework of probability theory, essential for understanding statistical inference. We build intuition through simulation before formalising concepts.

### 4.1 What Is Probability?
- 4.1.1 Probability as Long-Run Frequency (Frequentist Interpretation)
- 4.1.2 Probability as Degree of Belief (Bayesian Interpretation)
- 4.1.3 Probability as a Mathematical System (Axiomatic Approach)
- 4.1.4 Why Probability Matters for Statistics
  - *Example: What does "95% effective" mean for a vaccine?*
  - *Simulation: Demonstrating long-run frequency with coin flips*

### 4.2 Sample Spaces and Events
- 4.2.1 Defining the Sample Space (S or Ω)
  - 4.2.1.1 Discrete Sample Spaces
  - 4.2.1.2 Continuous Sample Spaces
- 4.2.2 Events as Subsets of the Sample Space
- 4.2.3 Simple and Compound Events
- 4.2.4 Visualising Sample Spaces
  - *Example: Sample space for blood type testing*
  - *Example: Sample space for clinical outcomes*

### 4.3 Basic Probability Rules
- 4.3.1 Probability Axioms (Kolmogorov)
  - 4.3.1.1 Non-Negativity: P(A) ≥ 0
  - 4.3.1.2 Normalisation: P(S) = 1
  - 4.3.1.3 Additivity for Mutually Exclusive Events
- 4.3.2 The Complement Rule
  - 4.3.2.1 P(A') = 1 - P(A)
  - 4.3.2.2 Applications: "At Least One" Problems
  - *Example: Probability that at least one patient responds to treatment*
- 4.3.3 The Addition Rule
  - 4.3.3.1 Mutually Exclusive Events: P(A ∪ B) = P(A) + P(B)
  - 4.3.3.2 General Case: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
  - 4.3.3.3 Visualising with Venn Diagrams
  - *Example: Probability of having disease A or disease B*
- 4.3.4 Implementing Probability Calculations in R

### 4.4 Conditional Probability
- 4.4.1 Definition: P(A|B) = P(A ∩ B) / P(B)
- 4.4.2 Intuition: Restricting the Sample Space
- 4.4.3 The Multiplication Rule: P(A ∩ B) = P(A|B) × P(B)
- 4.4.4 Visualising Conditional Probability
  - *Visualisation: Tree diagrams for sequential events*
  - *Visualisation: Venn diagrams showing conditional probability*
- 4.4.5 Medical Screening Example: A Detailed Walkthrough
  - *Example: Disease testing with sensitivity and specificity*

### 4.5 Independence
- 4.5.1 Definition: P(A ∩ B) = P(A) × P(B)
- 4.5.2 Equivalent Definition: P(A|B) = P(A)
- 4.5.3 Testing for Independence
- 4.5.4 Independence vs Mutual Exclusivity (Common Confusion)
- 4.5.5 Independence in Biomedical Contexts
  - *Example: Are two symptoms independent?*
  - *Simulation: Verifying independence empirically*

### 4.6 Bayes' Theorem
- 4.6.1 Derivation from Conditional Probability
- 4.6.2 The Formula: P(A|B) = P(B|A) × P(A) / P(B)
- 4.6.3 Components: Prior, Likelihood, Posterior, Evidence
- 4.6.4 Intuitive Understanding of Bayes' Theorem
  - *Visualisation: How evidence updates beliefs*
- 4.6.5 The Base Rate Fallacy
  - *Example: Why positive test results can be misleading for rare diseases*
- 4.6.6 Diagnostic Testing: Sensitivity, Specificity, PPV, NPV
  - 4.6.6.1 Sensitivity: P(Positive Test | Disease)
  - 4.6.6.2 Specificity: P(Negative Test | No Disease)
  - 4.6.6.3 Positive Predictive Value: P(Disease | Positive Test)
  - 4.6.6.4 Negative Predictive Value: P(No Disease | Negative Test)
  - 4.6.6.5 How Prevalence Affects PPV and NPV
  - *Example: COVID-19 testing interpretation*
  - *Example: Cancer screening programmes*
  - *Interactive calculation: Building a diagnostic calculator in R*
- 4.6.7 The Law of Total Probability
  - 4.6.7.1 Partitioning the Sample Space
  - 4.6.7.2 Computing P(B) as a Weighted Sum
  - *Example: Disease probability across risk groups*

### 4.7 Counting Methods (Combinatorics)
- 4.7.1 The Multiplication Principle
- 4.7.2 Permutations
  - 4.7.2.1 Definition and Formula: n!
  - 4.7.2.2 Permutations of Subsets: nPr = n!/(n-r)!
  - 4.7.2.3 Permutations with Repetition
- 4.7.3 Combinations
  - 4.7.3.1 Definition and Formula: nCr = n!/[r!(n-r)!]
  - 4.7.3.2 The Binomial Coefficient Notation
  - 4.7.3.3 Properties of Combinations
- 4.7.4 Applications in Probability
  - *Example: Probability of specific genotype combinations*
  - *Example: Selecting patients for a clinical trial*
- 4.7.5 Implementing Counting Functions in R
  - *Code: factorial(), choose(), and custom implementations*

### 4.8 Simulation-Based Probability
- 4.8.1 Monte Carlo Methods: The Idea
- 4.8.2 Estimating Probabilities Through Simulation
- 4.8.3 The Importance of Sample Size in Simulation
- 4.8.4 Setting Seeds for Reproducibility
  - *Example: Simulating the birthday problem*
  - *Example: Simulating diagnostic testing scenarios*

**Communicating to Stakeholders:** Explaining diagnostic test results to patients and clinicians

**Quick Reference:** Chapter 4 Probability Rules and Formulae

---

## Chapter 5: Random Variables and Probability Distributions

This chapter formalises the concept of random variables and introduces the major probability distributions used in statistics. We implement distribution functions from scratch to build deep understanding.

### 5.1 Random Variables
- 5.1.1 Definition: Mapping Outcomes to Numbers
- 5.1.2 Discrete Random Variables
- 5.1.3 Continuous Random Variables
- 5.1.4 Notation Conventions (Capital letters for variables, lowercase for values)
  - *Example: Defining random variables for clinical outcomes*

### 5.2 Discrete Probability Distributions
- 5.2.1 Probability Mass Function (PMF)
  - 5.2.1.1 Definition: P(X = x)
  - 5.2.1.2 Properties of PMFs
  - 5.2.1.3 Visualising PMFs as Bar Charts
- 5.2.2 Cumulative Distribution Function (CDF)
  - 5.2.2.1 Definition: F(x) = P(X ≤ x)
  - 5.2.2.2 Properties of CDFs
  - 5.2.2.3 Relationship Between PMF and CDF
  - 5.2.2.4 Visualising CDFs as Step Functions
- 5.2.3 Expected Value (Mean)
  - 5.2.3.1 Definition: E(X) = Σ x × P(X = x)
  - 5.2.3.2 Interpretation as Long-Run Average
  - 5.2.3.3 Properties of Expectation (Linearity)
  - 5.2.3.4 Implementing Expected Value Calculation
- 5.2.4 Variance and Standard Deviation
  - 5.2.4.1 Definition: Var(X) = E[(X - μ)²] = E(X²) - [E(X)]²
  - 5.2.4.2 Properties of Variance
  - 5.2.4.3 Standard Deviation: SD(X) = √Var(X)
  - 5.2.4.4 Implementing Variance Calculation
  - *Example: Expected value and variance of number of responders in a trial*

### 5.3 The Bernoulli Distribution
- 5.3.1 Definition: Single Trial with Two Outcomes
- 5.3.2 PMF: P(X = 1) = p, P(X = 0) = 1 - p
- 5.3.3 Mean and Variance: E(X) = p, Var(X) = p(1-p)
- 5.3.4 Implementing Bernoulli Functions from Scratch
  - *Example: Single patient treatment response*

### 5.4 The Binomial Distribution
- 5.4.1 Definition: Number of Successes in n Independent Trials
- 5.4.2 PMF: P(X = k) = C(n,k) × p^k × (1-p)^(n-k)
- 5.4.3 Derivation of the PMF
- 5.4.4 Mean: E(X) = np
- 5.4.5 Variance: Var(X) = np(1-p)
- 5.4.6 Shape: Effect of n and p on Distribution Shape
  - *Visualisation: Binomial distributions for different n and p values*
- 5.4.7 Implementing Binomial Functions from Scratch
  - *Code: Writing dbinom_manual(), pbinom_manual(), qbinom_manual(), rbinom_manual()*
- 5.4.8 Using Built-in R Functions: dbinom, pbinom, qbinom, rbinom
- 5.4.9 Applications in Biomedical Research
  - *Example: Number of patients responding to treatment*
  - *Example: Number of successful surgeries*
  - *Example: Genetic inheritance patterns*

### 5.5 The Poisson Distribution
- 5.5.1 Definition: Counts of Rare Events in Fixed Intervals
- 5.5.2 PMF: P(X = k) = (λ^k × e^(-λ)) / k!
- 5.5.3 Derivation as Limit of Binomial
- 5.5.4 Mean and Variance: E(X) = Var(X) = λ
- 5.5.5 Shape: Effect of λ on Distribution Shape
  - *Visualisation: Poisson distributions for different λ values*
- 5.5.6 Implementing Poisson Functions from Scratch
- 5.5.7 Using Built-in R Functions: dpois, ppois, qpois, rpois
- 5.5.8 Applications in Biomedical Research
  - *Example: Number of mutations in a DNA sequence*
  - *Example: Hospital admissions per day*
  - *Example: Rare adverse events in drug trials*

### 5.6 Other Discrete Distributions
- 5.6.1 Geometric Distribution
  - 5.6.1.1 Definition: Number of Trials Until First Success
  - 5.6.1.2 PMF, Mean, and Variance
  - 5.6.1.3 The Memoryless Property
  - 5.6.1.4 R Functions: dgeom, pgeom, qgeom, rgeom
  - *Example: Number of patients screened until first eligible patient*
- 5.6.2 Negative Binomial Distribution
  - 5.6.2.1 Definition: Number of Trials Until r Successes
  - 5.6.2.2 PMF, Mean, and Variance
  - 5.6.2.3 Relationship to Geometric Distribution
  - 5.6.2.4 Alternative Parameterisation for Overdispersed Counts
  - 5.6.2.5 R Functions: dnbinom, pnbinom, qnbinom, rnbinom
  - *Example: Modelling overdispersed count data*
- 5.6.3 Hypergeometric Distribution
  - 5.6.3.1 Definition: Sampling Without Replacement
  - 5.6.3.2 PMF, Mean, and Variance
  - 5.6.3.3 Comparison with Binomial (With vs Without Replacement)
  - 5.6.3.4 R Functions: dhyper, phyper, qhyper, rhyper
  - *Example: Fisher's exact test setup*
  - *Example: Gene set enrichment analysis*

### 5.7 Continuous Probability Distributions
- 5.7.1 Probability Density Function (PDF)
  - 5.7.1.1 Definition and Interpretation
  - 5.7.1.2 Why P(X = x) = 0 for Continuous Variables
  - 5.7.1.3 Probability as Area Under the Curve
  - 5.7.1.4 Properties of PDFs
- 5.7.2 Cumulative Distribution Function (CDF)
  - 5.7.2.1 Definition: F(x) = P(X ≤ x) = ∫ f(t)dt from -∞ to x
  - 5.7.2.2 Relationship Between PDF and CDF
  - 5.7.2.3 Using CDF to Calculate Probabilities
- 5.7.3 Expected Value and Variance for Continuous Variables
  - 5.7.3.1 E(X) = ∫ x × f(x) dx
  - 5.7.3.2 Var(X) = ∫ (x - μ)² × f(x) dx
- 5.7.4 Quantile Function (Inverse CDF)
  - 5.7.4.1 Definition: Q(p) = F⁻¹(p)
  - 5.7.4.2 Finding Percentiles

### 5.8 The Uniform Distribution
- 5.8.1 Definition: Equal Probability Across an Interval
- 5.8.2 PDF and CDF
- 5.8.3 Mean and Variance
- 5.8.4 Implementing Uniform Functions from Scratch
- 5.8.5 R Functions: dunif, punif, qunif, runif
- 5.8.6 Applications
  - *Example: Random number generation*
  - *Example: Modelling complete uncertainty*

### 5.9 The Normal (Gaussian) Distribution
- 5.9.1 Definition and Historical Context
- 5.9.2 PDF: f(x) = (1/√(2πσ²)) × exp(-(x-μ)²/(2σ²))
- 5.9.3 Parameters: Mean (μ) and Standard Deviation (σ)
- 5.9.4 Properties of the Normal Distribution
  - 5.9.4.1 Symmetry About the Mean
  - 5.9.4.2 The 68-95-99.7 Rule (Empirical Rule)
  - 5.9.4.3 Tail Behaviour
- 5.9.5 The Standard Normal Distribution (Z-Distribution)
  - 5.9.5.1 Definition: μ = 0, σ = 1
  - 5.9.5.2 Standardisation: Z = (X - μ) / σ
  - 5.9.5.3 Using Z-Tables (Historical Context)
- 5.9.6 Implementing Normal Distribution Functions from Scratch
  - *Code: Approximating dnorm, pnorm using numerical methods*
- 5.9.7 R Functions: dnorm, pnorm, qnorm, rnorm
- 5.9.8 Why the Normal Distribution Is Everywhere
  - 5.9.8.1 Central Limit Theorem (Preview)
  - 5.9.8.2 Natural Phenomena
- 5.9.9 Applications in Biomedical Research
  - *Example: Biological measurements (height, weight, blood pressure)*
  - *Example: Laboratory assay measurements*
  - *Visualisation: Comparing different normal distributions*

### 5.10 The Exponential Distribution
- 5.10.1 Definition: Time Between Events in a Poisson Process
- 5.10.2 PDF and CDF
- 5.10.3 Mean and Variance: E(X) = 1/λ, Var(X) = 1/λ²
- 5.10.4 The Memoryless Property
- 5.10.5 Relationship with Poisson Distribution
- 5.10.6 R Functions: dexp, pexp, qexp, rexp
- 5.10.7 Applications
  - *Example: Time until equipment failure*
  - *Example: Time between patient arrivals*

### 5.11 The Gamma Distribution
- 5.11.1 Definition: Sum of Exponential Random Variables
- 5.11.2 PDF and Parameters (Shape and Rate)
- 5.11.3 Mean and Variance
- 5.11.4 Special Cases: Exponential (α = 1), Chi-Square (α = ν/2, β = 1/2)
- 5.11.5 R Functions: dgamma, pgamma, qgamma, rgamma
- 5.11.6 Applications
  - *Example: Waiting times for multiple events*
  - *Example: Modelling skewed positive data*

### 5.12 The Beta Distribution
- 5.12.1 Definition: Distribution for Probabilities
- 5.12.2 PDF and Parameters (α and β)
- 5.12.3 Mean and Variance
- 5.12.4 Shape Variations with Different Parameters
  - *Visualisation: Beta distributions for different α and β values*
- 5.12.5 R Functions: dbeta, pbeta, qbeta, rbeta
- 5.12.6 Applications
  - *Example: Modelling success probabilities*
  - *Example: Bayesian inference for proportions*

### 5.13 Distributions Related to the Normal
- 5.13.1 Chi-Square Distribution
  - 5.13.1.1 Definition: Sum of Squared Standard Normals
  - 5.13.1.2 Degrees of Freedom
  - 5.13.1.3 Mean and Variance
  - 5.13.1.4 R Functions: dchisq, pchisq, qchisq, rchisq
  - *Visualisation: Chi-square distributions for different df*
- 5.13.2 Student's t-Distribution
  - 5.13.2.1 Definition and Origin (William Sealy Gosset)
  - 5.13.2.2 Relationship to Normal and Chi-Square
  - 5.13.2.3 Degrees of Freedom and Shape
  - 5.13.2.4 Heavy Tails Compared to Normal
  - 5.13.2.5 Convergence to Normal as df → ∞
  - 5.13.2.6 R Functions: dt, pt, qt, rt
  - *Visualisation: t-distributions compared to normal*
- 5.13.3 F-Distribution
  - 5.13.3.1 Definition: Ratio of Two Chi-Square Variables
  - 5.13.3.2 Two Degrees of Freedom Parameters
  - 5.13.3.3 R Functions: df, pf, qf, rf
  - *Visualisation: F-distributions for different df combinations*

### 5.14 Choosing the Right Distribution
- 5.14.1 Decision Flowchart for Distribution Selection
- 5.14.2 Matching Data Characteristics to Distributions
- 5.14.3 Visual Assessment of Distribution Fit
- 5.14.4 Common Mistakes in Distribution Choice
  - *Summary table: When to use each distribution*

**Communicating to Stakeholders:** Explaining probability distributions in lay terms

**Quick Reference:** Chapter 5 Distribution Summary Table with Formulae and R Functions

---

## Chapter 6: Sampling Distributions and the Central Limit Theorem

This chapter introduces the crucial concept of sampling distributions, which forms the foundation of statistical inference. We use extensive simulation to build intuition.

### 6.1 The Concept of a Sampling Distribution
- 6.1.1 What Happens When We Sample Repeatedly?
- 6.1.2 Statistics as Random Variables
- 6.1.3 The Distribution of a Statistic
- 6.1.4 Simulation: Generating Sampling Distributions
  - *Code: Simulating 10,000 sample means*
  - *Visualisation: Histogram of sample means vs population distribution*

### 6.2 Sampling Distribution of the Sample Mean
- 6.2.1 Expected Value: E(X̄) = μ
  - 6.2.1.1 Proof Using Linearity of Expectation
  - 6.2.1.2 Unbiasedness of the Sample Mean
- 6.2.2 Variance: Var(X̄) = σ²/n
  - 6.2.2.1 Derivation
  - 6.2.2.2 Why Variance Decreases with Sample Size
- 6.2.3 Standard Error of the Mean
  - 6.2.3.1 Definition: SE(X̄) = σ/√n
  - 6.2.3.2 Standard Error vs Standard Deviation (Critical Distinction)
  - 6.2.3.3 Estimating Standard Error When σ Is Unknown
- 6.2.4 Visualising the Effect of Sample Size
  - *Simulation: Sampling distributions for n = 5, 10, 30, 100*
  - *Visualisation: Narrowing of distribution as n increases*

### 6.3 The Central Limit Theorem
- 6.3.1 Statement of the CLT
- 6.3.2 Why the CLT Is Remarkable
- 6.3.3 Conditions for the CLT
- 6.3.4 Visualising the CLT in Action
  - *Simulation: Sampling from uniform distribution*
  - *Simulation: Sampling from exponential distribution*
  - *Simulation: Sampling from bimodal distribution*
  - *Visualisation: Convergence to normality*
- 6.3.5 How Large Is "Large Enough"?
  - 6.3.5.1 The n ≥ 30 Rule of Thumb
  - 6.3.5.2 When Larger Samples Are Needed (Highly Skewed Data)
  - 6.3.5.3 When Smaller Samples Suffice (Nearly Normal Data)
- 6.3.6 Mathematical Intuition Behind the CLT
- 6.3.7 Practical Implications for Statistical Inference

### 6.4 Sampling Distribution of the Sample Proportion
- 6.4.1 Sample Proportion as a Special Case of Sample Mean
- 6.4.2 Expected Value: E(p̂) = p
- 6.4.3 Variance: Var(p̂) = p(1-p)/n
- 6.4.4 Standard Error: SE(p̂) = √[p(1-p)/n]
- 6.4.5 Normal Approximation to the Binomial
  - 6.4.5.1 Conditions: np ≥ 10 and n(1-p) ≥ 10
  - 6.4.5.2 Continuity Correction
- 6.4.6 Visualising the Approximation
  - *Simulation: When the approximation works well vs poorly*

### 6.5 Sampling Distribution of the Sample Variance
- 6.5.1 Distribution of S²
- 6.5.2 Connection to Chi-Square Distribution
- 6.5.3 Degrees of Freedom: n - 1
- 6.5.4 Expected Value: E(S²) = σ²
- 6.5.5 Why We Divide by n - 1 (Revisited)
  - *Simulation: Comparing division by n vs n-1*

### 6.6 Sampling Distribution of Differences
- 6.6.1 Difference of Two Sample Means
  - 6.6.1.1 Expected Value: E(X̄₁ - X̄₂) = μ₁ - μ₂
  - 6.6.1.2 Variance: Var(X̄₁ - X̄₂) = σ₁²/n₁ + σ₂²/n₂
  - 6.6.1.3 Standard Error of the Difference
- 6.6.2 Difference of Two Sample Proportions
  - 6.6.2.1 Expected Value and Variance
  - 6.6.2.2 Standard Error
- 6.6.3 Simulation: Visualising Distributions of Differences

### 6.7 The t-Distribution in Sampling
- 6.7.1 When σ Is Unknown: Using S Instead
- 6.7.2 The t-Statistic: (X̄ - μ) / (S/√n)
- 6.7.3 Degrees of Freedom
- 6.7.4 Why t Has Heavier Tails Than Z
- 6.7.5 Convergence of t to Z as n Increases
  - *Visualisation: t-distributions for df = 5, 10, 30, ∞*

### 6.8 Applications and Importance
- 6.8.1 Why Sampling Distributions Matter for Inference
- 6.8.2 Connection to Confidence Intervals (Preview)
- 6.8.3 Connection to Hypothesis Testing (Preview)

**Communicating to Stakeholders:** Explaining why larger samples provide more reliable results

**Quick Reference:** Chapter 6 Sampling Distribution Formulae

---

## Chapter 7: Point Estimation

This chapter covers the theory and methods for estimating population parameters from sample data. We implement estimation methods from scratch and explore their properties.

### 7.1 Introduction to Estimation
- 7.1.1 The Estimation Problem
- 7.1.2 Estimators vs Estimates
- 7.1.3 Notation: θ̂ as an Estimator of θ
- 7.1.4 What Makes a Good Estimator?

### 7.2 Properties of Estimators
- 7.2.1 Bias
  - 7.2.1.1 Definition: Bias(θ̂) = E(θ̂) - θ
  - 7.2.1.2 Unbiased Estimators: E(θ̂) = θ
  - 7.2.1.3 Examples of Biased and Unbiased Estimators
  - *Simulation: Demonstrating bias visually*
- 7.2.2 Variance and Precision
  - 7.2.2.1 Var(θ̂): Spread of the Sampling Distribution
  - 7.2.2.2 Precision as Inverse of Variance
- 7.2.3 Mean Squared Error
  - 7.2.3.1 Definition: MSE(θ̂) = E[(θ̂ - θ)²]
  - 7.2.3.2 Decomposition: MSE = Variance + Bias²
  - 7.2.3.3 The Bias-Variance Trade-off
  - *Visualisation: Bias-variance trade-off diagram*
- 7.2.4 Consistency
  - 7.2.4.1 Definition: θ̂ₙ →ᵖ θ as n → ∞
  - 7.2.4.2 Intuition: Getting Better with More Data
  - *Simulation: Demonstrating consistency*
- 7.2.5 Efficiency
  - 7.2.5.1 Relative Efficiency of Two Estimators
  - 7.2.5.2 The Cramér-Rao Lower Bound (Introduction)
  - 7.2.5.3 Efficient Estimators
- 7.2.6 Sufficiency (Introduction)
  - 7.2.6.1 Intuition: Capturing All Relevant Information
  - 7.2.6.2 Examples

### 7.3 Method of Moments Estimation
- 7.3.1 The Idea: Equating Sample and Population Moments
- 7.3.2 Population Moments
  - 7.3.2.1 First Moment (Mean): μ = E(X)
  - 7.3.2.2 Second Moment: E(X²)
  - 7.3.2.3 Higher Moments
- 7.3.3 Sample Moments
- 7.3.4 The Method of Moments Procedure
- 7.3.5 Examples
  - *Example: Estimating parameters of Normal distribution*
  - *Example: Estimating parameters of Exponential distribution*
  - *Example: Estimating parameters of Gamma distribution*
- 7.3.6 Implementing Method of Moments in R
- 7.3.7 Properties of MoM Estimators
- 7.3.8 Advantages and Limitations

### 7.4 Maximum Likelihood Estimation
- 7.4.1 The Likelihood Function
  - 7.4.1.1 Definition: L(θ|data) = P(data|θ)
  - 7.4.1.2 Likelihood vs Probability
  - 7.4.1.3 The Likelihood Principle
- 7.4.2 Log-Likelihood
  - 7.4.2.1 Why We Use Log-Likelihood
  - 7.4.2.2 Properties of Log-Likelihood
- 7.4.3 The Maximum Likelihood Principle
  - 7.4.3.1 Finding the MLE: Maximising L(θ) or ℓ(θ)
  - 7.4.3.2 Intuition: The Most Plausible Parameter Value
- 7.4.4 Finding MLEs Analytically
  - 7.4.4.1 Taking Derivatives and Setting to Zero
  - 7.4.4.2 Checking Second Derivative Conditions
  - *Example: MLE for Normal distribution (μ and σ²)*
  - *Example: MLE for Binomial distribution (p)*
  - *Example: MLE for Poisson distribution (λ)*
  - *Example: MLE for Exponential distribution (λ)*
- 7.4.5 Finding MLEs Numerically
  - 7.4.5.1 When Analytical Solutions Don't Exist
  - 7.4.5.2 Using optim() in R
  - 7.4.5.3 Using nlm() and other optimisers
  - 7.4.5.4 Starting Values and Convergence Issues
  - *Code: Implementing numerical MLE from scratch*
  - *Example: MLE for Beta distribution*
- 7.4.6 Visualising Likelihood Functions
  - *Visualisation: Likelihood surface for Normal parameters*
  - *Visualisation: Profile likelihood*
- 7.4.7 Properties of MLEs
  - 7.4.7.1 Consistency
  - 7.4.7.2 Asymptotic Normality
  - 7.4.7.3 Asymptotic Efficiency
  - 7.4.7.4 Invariance Property
- 7.4.8 Standard Errors of MLEs
  - 7.4.8.1 Fisher Information
  - 7.4.8.2 Observed Information
  - 7.4.8.3 Computing Standard Errors

### 7.5 Comparing Estimators
- 7.5.1 Simulation Studies for Comparing Estimators
- 7.5.2 Bias Comparison
- 7.5.3 MSE Comparison
- 7.5.4 Efficiency Comparison
  - *Example: Comparing mean vs median as estimators of centre*
  - *Example: Comparing MoM vs MLE estimators*

### 7.6 Robust Estimation
- 7.6.1 Sensitivity to Outliers
- 7.6.2 The Breakdown Point
- 7.6.3 Robust Alternatives
  - 7.6.3.1 Trimmed Mean
  - 7.6.3.2 Winsorised Mean
  - 7.6.3.3 Median
  - 7.6.3.4 M-Estimators (Introduction)
- 7.6.4 When to Use Robust Estimators

**Communicating to Stakeholders:** Reporting point estimates with appropriate precision

**Quick Reference:** Chapter 7 Estimation Methods Summary

---

## Chapter 8: Interval Estimation — Confidence Intervals

This chapter covers the construction and interpretation of confidence intervals, providing a range of plausible values for population parameters.

### 8.1 The Need for Interval Estimation
- 8.1.1 Limitations of Point Estimates
- 8.1.2 Quantifying Uncertainty
- 8.1.3 What Is a Confidence Interval?
- 8.1.4 The Confidence Level
  - *Visualisation: Many confidence intervals, some missing the parameter*

### 8.2 Interpreting Confidence Intervals
- 8.2.1 The Correct Interpretation
  - 8.2.1.1 "95% of similarly constructed intervals contain θ"
  - 8.2.1.2 Pre-Data vs Post-Data Interpretation
- 8.2.2 Common Misinterpretations
  - 8.2.2.1 NOT "95% probability that θ is in this interval"
  - 8.2.2.2 NOT "95% of the data falls in this interval"
- 8.2.3 Frequentist vs Bayesian Intervals
- 8.2.4 Simulation: Demonstrating Confidence Interval Behaviour
  - *Code: Generating 100 CIs and counting coverage*
  - *Visualisation: CI coverage simulation*

### 8.3 Confidence Intervals for the Mean (σ Known)
- 8.3.1 Derivation from the Sampling Distribution
- 8.3.2 The Z-Interval Formula: X̄ ± z* × (σ/√n)
- 8.3.3 Margin of Error
- 8.3.4 Effect of Confidence Level on Interval Width
- 8.3.5 Effect of Sample Size on Interval Width
- 8.3.6 Implementing the Z-Interval from Scratch
  - *Example: CI for mean blood pressure (σ known from historical data)*

### 8.4 Confidence Intervals for the Mean (σ Unknown)
- 8.4.1 The Problem: Using S Introduces Additional Uncertainty
- 8.4.2 The t-Distribution Solution
- 8.4.3 The t-Interval Formula: X̄ ± t* × (s/√n)
- 8.4.4 Degrees of Freedom: n - 1
- 8.4.5 Comparison with Z-Interval
  - *Visualisation: t-interval vs z-interval widths*
- 8.4.6 Implementing the t-Interval from Scratch
- 8.4.7 Using t.test() in R for Confidence Intervals
  - *Example: CI for mean cholesterol level*

### 8.5 Confidence Intervals for Proportions
- 8.5.1 The Wald Interval
  - 8.5.1.1 Formula: p̂ ± z* × √[p̂(1-p̂)/n]
  - 8.5.1.2 Problems with the Wald Interval
  - *Visualisation: Coverage probability of Wald interval*
- 8.5.2 The Wilson Score Interval
  - 8.5.2.1 Derivation
  - 8.5.2.2 Better Coverage Properties
- 8.5.3 The Agresti-Coull Interval
  - 8.5.3.1 The "Add 2 Successes and 2 Failures" Method
  - 8.5.3.2 Simple and Effective
- 8.5.4 Exact (Clopper-Pearson) Interval
  - 8.5.4.1 Definition and Calculation
  - 8.5.4.2 Conservative Coverage
- 8.5.5 Comparing Methods
  - *Visualisation: Coverage comparison across methods*
- 8.5.6 Which Method to Use?
- 8.5.7 Using prop.test() and binom.test() in R
  - *Example: CI for treatment response rate*

### 8.6 Confidence Intervals for Differences
- 8.6.1 Difference of Two Means (Independent Samples)
  - 8.6.1.1 Pooled Variance (Equal Variances Assumed)
  - 8.6.1.2 Welch's Method (Unequal Variances)
  - 8.6.1.3 Implementing Both Methods
  - *Example: Comparing mean blood pressure between treatment groups*
- 8.6.2 Difference of Two Means (Paired Samples)
  - 8.6.2.1 Reducing to One-Sample Problem
  - 8.6.2.2 When to Use Paired Analysis
  - *Example: Before-after treatment comparison*
- 8.6.3 Difference of Two Proportions
  - 8.6.3.1 Wald Interval for Difference
  - 8.6.3.2 Newcombe's Method
  - *Example: Comparing response rates between two drugs*

### 8.7 Confidence Intervals for Variance and Standard Deviation
- 8.7.1 CI for Variance Using Chi-Square Distribution
- 8.7.2 CI for Standard Deviation
- 8.7.3 Asymmetry of These Intervals
- 8.7.4 Sensitivity to Non-Normality
  - *Example: CI for measurement variability*

### 8.8 Sample Size Determination
- 8.8.1 Specifying Desired Margin of Error
- 8.8.2 Sample Size for Estimating a Mean
  - 8.8.2.1 Formula: n = (z* × σ / E)²
  - 8.8.2.2 Dealing with Unknown σ
- 8.8.3 Sample Size for Estimating a Proportion
  - 8.8.3.1 Conservative Approach (p = 0.5)
  - 8.8.3.2 Using Prior Information
- 8.8.4 Sample Size for Comparing Two Groups
- 8.8.5 Practical Considerations
  - *Example: Planning a clinical study sample size*

### 8.9 Bootstrap Confidence Intervals
- 8.9.1 The Bootstrap Principle
  - 8.9.1.1 Resampling with Replacement
  - 8.9.1.2 The Plug-In Principle
- 8.9.2 The Percentile Method
  - 8.9.2.1 Procedure
  - 8.9.2.2 Implementation from Scratch
- 8.9.3 The Basic Bootstrap Interval
- 8.9.4 The BCa (Bias-Corrected and Accelerated) Method
  - 8.9.4.1 Correcting for Bias and Skewness
  - 8.9.4.2 Using the boot Package
- 8.9.5 The Studentised Bootstrap
- 8.9.6 When to Use Bootstrap Intervals
- 8.9.7 Advantages and Limitations
  - *Code: Complete bootstrap CI implementation from scratch*
  - *Example: Bootstrap CI for median survival time*

### 8.10 Profile Likelihood Intervals
- 8.10.1 The Profile Likelihood Function
- 8.10.2 Constructing Intervals from Profile Likelihood
- 8.10.3 Advantages over Wald Intervals
  - *Example: Profile likelihood interval for Gamma parameters*

**Communicating to Stakeholders:** Presenting confidence intervals in reports and papers

**Quick Reference:** Chapter 8 CI Formulae and Method Selection Guide

---

## Chapter 9: Hypothesis Testing — Foundations

This chapter introduces the logic, mechanics, and interpretation of hypothesis testing. We emphasise proper understanding and common pitfalls.

### 9.1 The Logic of Hypothesis Testing
- 9.1.1 Scientific Questions and Statistical Hypotheses
- 9.1.2 The "Proof by Contradiction" Framework
- 9.1.3 Null and Alternative Hypotheses
  - 9.1.3.1 The Null Hypothesis (H₀): Status Quo
  - 9.1.3.2 The Alternative Hypothesis (H₁ or Hₐ): Research Hypothesis
  - 9.1.3.3 Formulating Hypotheses Correctly
- 9.1.4 One-Tailed vs Two-Tailed Tests
  - 9.1.4.1 When to Use Each
  - 9.1.4.2 Common Mistakes in Choosing
  - *Examples: Formulating hypotheses for various research questions*

### 9.2 Test Statistics
- 9.2.1 What Is a Test Statistic?
- 9.2.2 Measuring Evidence Against H₀
- 9.2.3 The Null Distribution of the Test Statistic
- 9.2.4 Common Test Statistics (Z, t, χ², F)
  - *Visualisation: Test statistic under null distribution*

### 9.3 P-Values
- 9.3.1 Definition: Probability of Data as Extreme or More, Given H₀
- 9.3.2 Calculating P-Values
  - 9.3.2.1 One-Tailed P-Values
  - 9.3.2.2 Two-Tailed P-Values
- 9.3.3 Interpreting P-Values
  - 9.3.3.1 Strength of Evidence
  - 9.3.3.2 What P-Values Tell Us
- 9.3.4 What P-Values Are NOT
  - 9.3.4.1 NOT the Probability That H₀ Is True
  - 9.3.4.2 NOT the Probability of Results Being Due to Chance
  - 9.3.4.3 NOT a Measure of Effect Size
- 9.3.5 Common P-Value Misconceptions
  - *Discussion: The ASA Statement on P-Values*
- 9.3.6 Visualising P-Values
  - *Visualisation: P-value as area under the curve*

### 9.4 Making Decisions
- 9.4.1 The Significance Level (α)
  - 9.4.1.1 Pre-Specifying α
  - 9.4.1.2 Common Choices: 0.05, 0.01, 0.10
  - 9.4.1.3 Why 0.05? Historical Context
- 9.4.2 Decision Rule: Reject H₀ if p ≤ α
- 9.4.3 "Rejecting" vs "Failing to Reject" H₀
  - 9.4.3.1 Why We Don't "Accept" H₀
  - 9.4.3.2 Absence of Evidence ≠ Evidence of Absence
- 9.4.4 Critical Values and Rejection Regions
  - *Visualisation: Rejection regions for different α levels*

### 9.5 Errors in Hypothesis Testing
- 9.5.1 Type I Error (False Positive)
  - 9.5.1.1 Definition: Rejecting H₀ When H₀ Is True
  - 9.5.1.2 Probability: α (Significance Level)
  - 9.5.1.3 Consequences in Biomedical Contexts
- 9.5.2 Type II Error (False Negative)
  - 9.5.2.1 Definition: Failing to Reject H₀ When H₁ Is True
  - 9.5.2.2 Probability: β
  - 9.5.2.3 Consequences in Biomedical Contexts
- 9.5.3 The Trade-off Between Type I and Type II Errors
- 9.5.4 Visualising Errors
  - *Visualisation: Two distributions showing α and β*
  - *Table: Error types and consequences*

### 9.6 Statistical Power
- 9.6.1 Definition: Power = 1 - β = P(Reject H₀ | H₁ True)
- 9.6.2 Factors Affecting Power
  - 9.6.2.1 Sample Size (n)
  - 9.6.2.2 Effect Size
  - 9.6.2.3 Significance Level (α)
  - 9.6.2.4 Variability (σ)
- 9.6.3 Power Curves
  - *Visualisation: Power as function of effect size*
  - *Visualisation: Power as function of sample size*
- 9.6.4 A Priori Power Analysis
  - 9.6.4.1 Why Power Analysis Before Data Collection
  - 9.6.4.2 Typical Target: 80% Power
- 9.6.5 Post-Hoc Power Analysis (and Why It's Problematic)
- 9.6.6 Using the pwr Package in R
  - *Code: Power calculations for various tests*

### 9.7 Effect Sizes
- 9.7.1 Why Effect Sizes Matter
  - 9.7.1.1 Statistical Significance ≠ Practical Significance
  - 9.7.1.2 Large Samples Can Make Tiny Effects "Significant"
- 9.7.2 Effect Sizes for Means
  - 9.7.2.1 Raw Difference: X̄₁ - X̄₂
  - 9.7.2.2 Cohen's d: Standardised Difference
  - 9.7.2.3 Interpreting Cohen's d (Small, Medium, Large)
- 9.7.3 Effect Sizes for Proportions
  - 9.7.3.1 Risk Difference
  - 9.7.3.2 Risk Ratio (Relative Risk)
  - 9.7.3.3 Odds Ratio
  - 9.7.3.4 Number Needed to Treat (NNT)
- 9.7.4 Effect Sizes for Correlation
  - 9.7.4.1 Pearson's r as Effect Size
  - 9.7.4.2 r² as Proportion of Variance Explained
- 9.7.5 Always Report Effect Sizes with Confidence Intervals
  - *Example: Interpreting effect sizes in clinical trials*

### 9.8 Relationship Between Confidence Intervals and Hypothesis Tests
- 9.8.1 The Duality of CIs and Tests
- 9.8.2 Using CIs for Hypothesis Testing
  - 9.8.2.1 If CI Excludes θ₀, Reject H₀
  - 9.8.2.2 If CI Includes θ₀, Fail to Reject H₀
- 9.8.3 Why CIs Are Often More Informative
- 9.8.4 Visualising the Connection
  - *Visualisation: CI and hypothesis test equivalence*

### 9.9 The Hypothesis Testing Controversy
- 9.9.1 Criticisms of NHST (Null Hypothesis Significance Testing)
- 9.9.2 The Reproducibility Crisis
- 9.9.3 P-Hacking and HARKing
- 9.9.4 Alternatives and Complements
  - 9.9.4.1 Effect Sizes and CIs
  - 9.9.4.2 Bayesian Approaches
  - 9.9.4.3 Pre-Registration
- 9.9.5 Best Practices for Hypothesis Testing
  - *Discussion: Moving beyond "p < 0.05"*

**Communicating to Stakeholders:** Explaining statistical significance (and non-significance) to non-statisticians

**Quick Reference:** Chapter 9 Hypothesis Testing Checklist

---

## Chapter 10: Hypothesis Tests for Means and Proportions

This chapter covers the most commonly used hypothesis tests in practice. We implement tests from scratch before using built-in functions.

### 10.1 One-Sample Z-Test for the Mean
- 10.1.1 When to Use: σ Known
- 10.1.2 Hypotheses
- 10.1.3 Test Statistic: Z = (X̄ - μ₀) / (σ/√n)
- 10.1.4 P-Value Calculation
- 10.1.5 Implementation from Scratch
- 10.1.6 Decision and Conclusion
  - *Example: Testing whether mean differs from historical value*

### 10.2 One-Sample t-Test for the Mean
- 10.2.1 When to Use: σ Unknown
- 10.2.2 Hypotheses
- 10.2.3 Test Statistic: t = (X̄ - μ₀) / (s/√n)
- 10.2.4 Degrees of Freedom: n - 1
- 10.2.5 P-Value Calculation
- 10.2.6 Assumptions
  - 10.2.6.1 Random Sample
  - 10.2.6.2 Normal Population (or Large n)
- 10.2.7 Checking Assumptions
- 10.2.8 Implementation from Scratch
- 10.2.9 Using t.test() in R
  - *Example: Testing whether mean biomarker differs from reference value*
  - *Example: Using NHANES data*

### 10.3 Two-Sample t-Test for Independent Means
- 10.3.1 The Research Question: Comparing Two Groups
- 10.3.2 Hypotheses
- 10.3.3 Pooled t-Test (Equal Variances)
  - 10.3.3.1 Pooled Variance Estimate
  - 10.3.3.2 Test Statistic
  - 10.3.3.3 Degrees of Freedom: n₁ + n₂ - 2
- 10.3.4 Welch's t-Test (Unequal Variances)
  - 10.3.4.1 Separate Variance Estimates
  - 10.3.4.2 Test Statistic
  - 10.3.4.3 Satterthwaite Degrees of Freedom
- 10.3.5 Which Version to Use? (Generally Welch)
- 10.3.6 Assumptions
- 10.3.7 Implementation from Scratch
- 10.3.8 Using t.test() in R
  - *Example: Comparing treatment vs control group outcomes*
  - *Example: Using {medicaldata} dataset*

### 10.4 Paired t-Test
- 10.4.1 When to Use: Matched or Repeated Measures
- 10.4.2 The Pairing Structure
- 10.4.3 Reducing to One-Sample Test on Differences
- 10.4.4 Hypotheses
- 10.4.5 Test Statistic
- 10.4.6 Assumptions
- 10.4.7 Paired vs Independent: Why Pairing Can Increase Power
- 10.4.8 Implementation from Scratch
- 10.4.9 Using t.test() with paired = TRUE
  - *Example: Before-after treatment comparison*
  - *Example: Matched case-control study*

### 10.5 One-Sample Test for a Proportion
- 10.5.1 The Research Question
- 10.5.2 Hypotheses
- 10.5.3 Test Statistic (Z-Test for Proportion)
- 10.5.4 Exact Binomial Test
- 10.5.5 Conditions for Normal Approximation
- 10.5.6 Implementation from Scratch
- 10.5.7 Using prop.test() and binom.test() in R
  - *Example: Testing whether response rate exceeds a threshold*

### 10.6 Two-Sample Test for Proportions
- 10.6.1 The Research Question: Comparing Two Proportions
- 10.6.2 Hypotheses
- 10.6.3 Pooled Proportion Under H₀
- 10.6.4 Test Statistic
- 10.6.5 Continuity Correction
- 10.6.6 Conditions
- 10.6.7 Implementation from Scratch
- 10.6.8 Using prop.test() in R
  - *Example: Comparing success rates between two treatments*

### 10.7 Tests for Variance
- 10.7.1 Chi-Square Test for Single Variance
  - 10.7.1.1 Test Statistic: χ² = (n-1)s²/σ₀²
  - 10.7.1.2 Sensitivity to Non-Normality
- 10.7.2 F-Test for Comparing Two Variances
  - 10.7.2.1 Test Statistic: F = s₁²/s₂²
  - 10.7.2.2 Limitations
- 10.7.3 Levene's Test (More Robust)
- 10.7.4 Brown-Forsythe Test
  - *Example: Testing equality of variances before t-test*

### 10.8 Summary: Choosing the Right Test
- 10.8.1 Decision Flowchart for Tests on Means
- 10.8.2 Decision Flowchart for Tests on Proportions
- 10.8.3 Common Mistakes and How to Avoid Them
  - *Flowchart: Test selection guide*

**Communicating to Stakeholders:** Reporting results of comparative studies

**Quick Reference:** Chapter 10 Test Selection Guide and Formulae

---

## Chapter 11: Chi-Square Tests and Non-Parametric Methods

This chapter covers tests for categorical data and distribution-free methods that don't assume normality.

### 11.1 Chi-Square Goodness-of-Fit Test
- 11.1.1 The Research Question: Does Data Follow a Specified Distribution?
- 11.1.2 Expected Frequencies Under the Null
- 11.1.3 Test Statistic: χ² = Σ (O - E)² / E
- 11.1.4 Degrees of Freedom
- 11.1.5 Conditions: Expected Frequencies ≥ 5
- 11.1.6 Implementation from Scratch
- 11.1.7 Using chisq.test() in R
  - *Example: Testing whether genotype frequencies follow Hardy-Weinberg equilibrium*
  - *Example: Testing whether admissions are uniform across days*

### 11.2 Chi-Square Test of Independence
- 11.2.1 The Research Question: Are Two Categorical Variables Related?
- 11.2.2 Contingency Tables
- 11.2.3 Expected Frequencies Under Independence
- 11.2.4 Test Statistic
- 11.2.5 Degrees of Freedom: (r-1)(c-1)
- 11.2.6 Conditions
- 11.2.7 Interpreting Results
- 11.2.8 Effect Size: Cramér's V
- 11.2.9 Implementation from Scratch
- 11.2.10 Using chisq.test() in R
  - *Example: Is treatment outcome associated with disease stage?*
  - *Example: Is smoking status associated with lung cancer?*
  - *Visualisation: Mosaic plot of contingency table*

### 11.3 Fisher's Exact Test
- 11.3.1 When to Use: Small Expected Frequencies
- 11.3.2 The Hypergeometric Distribution
- 11.3.3 Computing Exact P-Values
- 11.3.4 Using fisher.test() in R
  - *Example: Small clinical trial with rare outcomes*

### 11.4 McNemar's Test for Paired Nominal Data
- 11.4.1 When to Use: Before-After or Matched Pairs
- 11.4.2 The 2×2 Table for Paired Data
- 11.4.3 Test Statistic
- 11.4.4 Using mcnemar.test() in R
  - *Example: Change in patient classification before and after intervention*

### 11.5 Tests for Normality
- 11.5.1 Why Test for Normality?
- 11.5.2 Shapiro-Wilk Test
  - 11.5.2.1 The Most Powerful Test for Normality
  - 11.5.2.2 Using shapiro.test() in R
- 11.5.3 Kolmogorov-Smirnov Test
- 11.5.4 Anderson-Darling Test
- 11.5.5 Visual Assessment: QQ Plots and Histograms
- 11.5.6 What to Do When Data Aren't Normal
  - *Example: Testing normality of residuals*
  - *Discussion: Normality tests are often too sensitive with large samples*

### 11.6 Introduction to Non-Parametric Methods
- 11.6.1 What Are Non-Parametric Tests?
- 11.6.2 When to Use Non-Parametric Tests
  - 11.6.2.1 Non-Normal Data
  - 11.6.2.2 Ordinal Data
  - 11.6.2.3 Small Samples
  - 11.6.2.4 Outliers Present
- 11.6.3 Advantages and Disadvantages
- 11.6.4 Ranks and Signed Ranks

### 11.7 Sign Test
- 11.7.1 The Simplest Non-Parametric Test
- 11.7.2 Based on Direction of Differences Only
- 11.7.3 Using binom.test() for Sign Test
  - *Example: Did more patients improve than worsen?*

### 11.8 Wilcoxon Signed-Rank Test
- 11.8.1 Alternative to One-Sample or Paired t-Test
- 11.8.2 Using Both Direction and Magnitude of Differences
- 11.8.3 Test Statistic
- 11.8.4 Handling Ties
- 11.8.5 Using wilcox.test() in R
  - *Example: Testing median difference in paired data*

### 11.9 Mann-Whitney U Test (Wilcoxon Rank-Sum Test)
- 11.9.1 Alternative to Two-Sample t-Test
- 11.9.2 Comparing Distributions of Two Groups
- 11.9.3 Test Statistic
- 11.9.4 Interpretation
- 11.9.5 Using wilcox.test() in R
  - *Example: Comparing treatment groups with skewed outcome*

### 11.10 Kruskal-Wallis Test
- 11.10.1 Alternative to One-Way ANOVA
- 11.10.2 Comparing Multiple Groups
- 11.10.3 Test Statistic
- 11.10.4 Post-Hoc Comparisons
- 11.10.5 Using kruskal.test() in R
  - *Example: Comparing three or more treatment groups*

### 11.11 Permutation Tests
- 11.11.1 The Logic of Permutation Testing
- 11.11.2 Generating the Null Distribution by Permutation
- 11.11.3 Computing the P-Value
- 11.11.4 Advantages
- 11.11.5 Implementing Permutation Tests from Scratch
  - *Code: Permutation test for difference in means*
  - *Visualisation: Permutation distribution*
- 11.11.6 Using coin Package in R
  - *Example: Permutation test for clinical trial data*

**Communicating to Stakeholders:** Explaining non-parametric results

**Quick Reference:** Chapter 11 Non-Parametric Test Selection Guide

---

## Chapter 12: Introduction to Linear Regression

This chapter introduces simple linear regression, the foundation for understanding relationships between quantitative variables.

### 12.1 The Regression Problem
- 12.1.1 Predicting One Variable from Another
- 12.1.2 Response (Dependent) and Explanatory (Independent) Variables
- 12.1.3 Correlation vs Regression
- 12.1.4 Uses of Regression: Prediction and Understanding Relationships
  - *Example: Predicting blood pressure from age*
  - *Visualisation: Scatter plot with clear linear trend*

### 12.2 The Simple Linear Regression Model
- 12.2.1 The Population Regression Line: E(Y|X) = β₀ + β₁X
- 12.2.2 The Error Term: Y = β₀ + β₁X + ε
- 12.2.3 Interpreting the Intercept (β₀)
- 12.2.4 Interpreting the Slope (β₁)
- 12.2.5 Model Assumptions
  - 12.2.5.1 Linearity
  - 12.2.5.2 Independence of Errors
  - 12.2.5.3 Constant Variance (Homoscedasticity)
  - 12.2.5.4 Normality of Errors
  - *Visualisation: Graphical representation of the model*

### 12.3 Least Squares Estimation
- 12.3.1 The Idea: Minimising Sum of Squared Residuals
- 12.3.2 Residuals: eᵢ = yᵢ - ŷᵢ
- 12.3.3 The Least Squares Criterion: Minimise Σeᵢ²
- 12.3.4 Deriving the Least Squares Estimators
  - 12.3.4.1 β̂₁ = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²
  - 12.3.4.2 β̂₀ = ȳ - β̂₁x̄
- 12.3.5 Properties of Least Squares Estimators
- 12.3.6 Implementing Least Squares from Scratch
  - *Code: Manual calculation of regression coefficients*
- 12.3.7 Using lm() in R
  - *Example: Fitting a regression line to biomarker data*
  - *Visualisation: Data with fitted line*

### 12.4 Measuring the Fit
- 12.4.1 Residual Sum of Squares (RSS or SSE)
- 12.4.2 Total Sum of Squares (TSS or SST)
- 12.4.3 Regression Sum of Squares (RegSS or SSR)
- 12.4.4 The ANOVA Decomposition: TSS = RegSS + RSS
- 12.4.5 Coefficient of Determination (R²)
  - 12.4.5.1 Definition: R² = RegSS / TSS = 1 - RSS/TSS
  - 12.4.5.2 Interpretation: Proportion of Variance Explained
  - 12.4.5.3 What R² Doesn't Tell You
- 12.4.6 Residual Standard Error (RSE)
  - 12.4.6.1 Definition: s = √[RSS / (n-2)]
  - 12.4.6.2 Interpretation
- 12.4.7 Implementing Fit Measures from Scratch
  - *Example: Calculating and interpreting R² and RSE*

### 12.5 Inference for Regression Coefficients
- 12.5.1 Sampling Distribution of β̂₁
  - 12.5.1.1 E(β̂₁) = β₁ (Unbiasedness)
  - 12.5.1.2 Var(β̂₁) = σ² / Σ(xᵢ - x̄)²
- 12.5.2 Standard Error of the Slope
- 12.5.3 t-Test for the Slope
  - 12.5.3.1 Hypotheses: H₀: β₁ = 0 vs H₁: β₁ ≠ 0
  - 12.5.3.2 Test Statistic: t = β̂₁ / SE(β̂₁)
  - 12.5.3.3 Degrees of Freedom: n - 2
- 12.5.4 Confidence Interval for the Slope
- 12.5.5 Inference for the Intercept
- 12.5.6 Reading lm() Output
  - *Example: Interpreting regression output*

### 12.6 Prediction
- 12.6.1 Point Prediction: ŷ = β̂₀ + β̂₁x
- 12.6.2 Two Sources of Uncertainty
  - 12.6.2.1 Uncertainty in the Regression Line
  - 12.6.2.2 Variability Around the Line
- 12.6.3 Confidence Interval for Mean Response
- 12.6.4 Prediction Interval for Individual Response
- 12.6.5 Why Prediction Intervals Are Wider
- 12.6.6 Using predict() in R
  - *Visualisation: Regression line with confidence and prediction bands*
- 12.6.7 The Dangers of Extrapolation
  - *Example: Predicting beyond the range of data*

### 12.7 Regression Diagnostics
- 12.7.1 Residual Analysis
  - 12.7.1.1 Residual Plot (Residuals vs Fitted Values)
  - 12.7.1.2 Patterns Indicating Model Problems
- 12.7.2 Checking Linearity
  - 12.7.2.1 Scatter Plot of Y vs X
  - 12.7.2.2 Residual Plot
- 12.7.3 Checking Constant Variance (Homoscedasticity)
  - 12.7.3.1 Scale-Location Plot
  - 12.7.3.2 Formal Tests (Breusch-Pagan)
- 12.7.4 Checking Normality of Residuals
  - 12.7.4.1 QQ Plot of Residuals
  - 12.7.4.2 Shapiro-Wilk Test on Residuals
- 12.7.5 Identifying Outliers
  - 12.7.5.1 Standardised Residuals
  - 12.7.5.2 Studentised Residuals
- 12.7.6 Identifying Influential Points
  - 12.7.6.1 Leverage: hᵢᵢ Values
  - 12.7.6.2 Cook's Distance
  - 12.7.6.3 DFFITS and DFBETAS
- 12.7.7 The plot() Method for lm Objects
  - *Visualisation: The four diagnostic plots*
- 12.7.8 What to Do When Assumptions Are Violated
  - *Example: Complete diagnostic analysis of a regression*

### 12.8 Transformations
- 12.8.1 When to Transform
- 12.8.2 Log Transformations
  - 12.8.2.1 Log-Transforming Y
  - 12.8.2.2 Log-Transforming X
  - 12.8.2.3 Log-Log Transformation
  - 12.8.2.4 Interpreting Coefficients After Log Transformation
- 12.8.3 Square Root and Other Power Transformations
- 12.8.4 Box-Cox Transformation (Introduction)
  - *Example: Transforming to achieve linearity and constant variance*

### 12.9 Correlation and Regression
- 12.9.1 The Relationship Between r and R²
- 12.9.2 When Correlation and Regression Give Different Insights
- 12.9.3 Regression Towards the Mean
  - *Example: Galton's original regression to the mean*

**Communicating to Stakeholders:** Presenting regression results clearly and avoiding overinterpretation

**Quick Reference:** Chapter 12 Regression Formulae and Diagnostic Checklist

---

## Chapter 13: Analysis of Variance (ANOVA)

This chapter introduces ANOVA for comparing means across multiple groups, a fundamental technique in experimental design and analysis.

### 13.1 The Problem of Multiple Group Comparisons
- 13.1.1 Why Not Just Do Multiple t-Tests?
- 13.1.2 The Multiple Testing Problem
- 13.1.3 Family-Wise Error Rate Inflation
  - *Visualisation: Error rate inflation with number of comparisons*

### 13.2 One-Way ANOVA: The Idea
- 13.2.1 Comparing Means Across k Groups
- 13.2.2 The Research Question
- 13.2.3 Hypotheses
  - 13.2.3.1 H₀: μ₁ = μ₂ = ... = μₖ
  - 13.2.3.2 H₁: At Least One Mean Differs

### 13.3 The ANOVA Model
- 13.3.1 The Linear Model: Yᵢⱼ = μ + αᵢ + εᵢⱼ
- 13.3.2 Treatment Effects
- 13.3.3 Assumptions
  - 13.3.3.1 Independence
  - 13.3.3.2 Normality Within Groups
  - 13.3.3.3 Equal Variances (Homogeneity)

### 13.4 Partitioning Variability
- 13.4.1 Total Variability (SST)
- 13.4.2 Between-Groups Variability (SSB or SSTreatment)
- 13.4.3 Within-Groups Variability (SSW or SSError)
- 13.4.4 The ANOVA Decomposition: SST = SSB + SSW
  - *Visualisation: Decomposing total variation*

### 13.5 Mean Squares and the F-Statistic
- 13.5.1 Degrees of Freedom
  - 13.5.1.1 df_between = k - 1
  - 13.5.1.2 df_within = N - k
  - 13.5.1.3 df_total = N - 1
- 13.5.2 Mean Squares
  - 13.5.2.1 MSB = SSB / df_between
  - 13.5.2.2 MSW = SSW / df_within
- 13.5.3 The F-Statistic: F = MSB / MSW
- 13.5.4 Distribution of F Under H₀
- 13.5.5 P-Value Calculation

### 13.6 The ANOVA Table
- 13.6.1 Structure of the ANOVA Table
- 13.6.2 Reading and Interpreting the Table
- 13.6.3 Implementing ANOVA from Scratch
  - *Code: Building an ANOVA table step by step*

### 13.7 Using ANOVA in R
- 13.7.1 The aov() Function
- 13.7.2 The anova() Function
- 13.7.3 Reading R Output
  - *Example: Comparing treatment effects across three groups*
  - *Example: Using {medicaldata} or NHANES data*

### 13.8 Effect Size in ANOVA
- 13.8.1 η² (Eta-Squared)
- 13.8.2 Partial η²
- 13.8.3 ω² (Omega-Squared): Less Biased
- 13.8.4 Interpreting Effect Sizes

### 13.9 Checking ANOVA Assumptions
- 13.9.1 Checking Normality
  - 13.9.1.1 Shapiro-Wilk Test by Group
  - 13.9.1.2 QQ Plots of Residuals
- 13.9.2 Checking Equal Variances
  - 13.9.2.1 Levene's Test
  - 13.9.2.2 Bartlett's Test
- 13.9.3 What If Assumptions Are Violated?
  - 13.9.3.1 Welch's ANOVA (Unequal Variances)
  - 13.9.3.2 Kruskal-Wallis Test (Non-Normality)
  - 13.9.3.3 Transformations
  - *Example: Diagnostics for an ANOVA*

### 13.10 Post-Hoc Comparisons
- 13.10.1 The Need for Post-Hoc Tests
- 13.10.2 Controlling Family-Wise Error Rate
- 13.10.3 Tukey's Honest Significant Difference (HSD)
  - 13.10.3.1 The Studentised Range Distribution
  - 13.10.3.2 Using TukeyHSD() in R
- 13.10.4 Bonferroni Correction
- 13.10.5 Scheffé's Method
- 13.10.6 Dunnett's Test (Comparison to Control)
- 13.10.7 Choosing the Right Post-Hoc Method
  - *Example: Post-hoc analysis following significant ANOVA*
  - *Visualisation: Mean differences with confidence intervals*

### 13.11 Planned Contrasts
- 13.11.1 When You Have Specific Hypotheses
- 13.11.2 Orthogonal Contrasts
- 13.11.3 Implementing Contrasts in R
  - *Example: Testing specific group comparisons*

### 13.12 ANOVA as a Linear Model
- 13.12.1 Connection to Regression
- 13.12.2 Dummy Coding for Categorical Variables
- 13.12.3 Using lm() for ANOVA
  - *Example: ANOVA using lm() approach*

**Communicating to Stakeholders:** Reporting ANOVA results in publications

**Quick Reference:** Chapter 13 ANOVA Formulae and Post-Hoc Decision Guide

---

## Chapter 14: Introduction to Experimental Design

This chapter covers principles of designing experiments to enable valid causal inference, essential for biomedical research.

### 14.1 Why Design Matters
- 14.1.1 The Goal: Valid Causal Conclusions
- 14.1.2 Correlation vs Causation
- 14.1.3 Confounding Variables
  - *Example: Confounding in observational studies*
  - *Visualisation: Confounding diagram*

### 14.2 Fundamental Principles of Experimental Design
- 14.2.1 Randomisation
  - 14.2.1.1 Why Randomisation Works
  - 14.2.1.2 Breaking the Confounding Link
  - 14.2.1.3 Methods of Random Assignment
  - 14.2.1.4 Implementing Randomisation in R
- 14.2.2 Replication
  - 14.2.2.1 Within-Treatment Replication
  - 14.2.2.2 Distinguishing True Replication from Pseudoreplication
- 14.2.3 Blocking
  - 14.2.3.1 Controlling for Known Sources of Variation
  - 14.2.3.2 Block What You Can, Randomise What You Cannot
- 14.2.4 Control Groups
  - 14.2.4.1 Negative Controls
  - 14.2.4.2 Positive Controls
  - 14.2.4.3 Placebo Controls
  - *Example: Designing a controlled experiment*

### 14.3 Common Experimental Designs
- 14.3.1 Completely Randomised Design (CRD)
  - 14.3.1.1 When to Use
  - 14.3.1.2 Analysis: One-Way ANOVA
  - *Example: Simple drug comparison study*
- 14.3.2 Randomised Complete Block Design (RCBD)
  - 14.3.2.1 Blocking on a Known Source of Variation
  - 14.3.2.2 Analysis: Two-Way ANOVA Without Interaction
  - *Example: Blocking by hospital site or batch*
- 14.3.3 Paired Designs
  - 14.3.3.1 Natural Pairing (e.g., Twin Studies)
  - 14.3.3.2 Before-After Designs
  - 14.3.3.3 Crossover Designs
  - 14.3.3.4 Analysis: Paired t-Test
- 14.3.4 Factorial Designs (Introduction)
  - 14.3.4.1 Studying Multiple Factors Simultaneously
  - 14.3.4.2 Main Effects and Interactions
  - 14.3.4.3 Efficiency of Factorial Designs
  - *Example: 2×2 Factorial design with drug and dose*
  - *Visualisation: Interaction plots*

### 14.4 Blinding
- 14.4.1 Single-Blind Studies
- 14.4.2 Double-Blind Studies
- 14.4.3 Why Blinding Matters
- 14.4.4 When Blinding Is Not Possible

### 14.5 Sample Size and Power for Designed Experiments
- 14.5.1 A Priori Power Analysis
- 14.5.2 Effect Size Specification
- 14.5.3 Sample Size for Comparing Two Groups
- 14.5.4 Sample Size for ANOVA
- 14.5.5 Using pwr Package
  - *Example: Planning sample size for a clinical trial*

### 14.6 Common Threats to Validity
- 14.6.1 Selection Bias
- 14.6.2 Attrition (Dropout)
- 14.6.3 Contamination
- 14.6.4 Hawthorne Effect
- 14.6.5 How Design Features Address These Threats

### 14.7 Ethical Considerations in Experimental Design
- 14.7.1 Equipoise
- 14.7.2 Informed Consent
- 14.7.3 Stopping Rules and Interim Analyses
- 14.7.4 Ethical Review Boards (IRB/Ethics Committees)

**Communicating to Stakeholders:** Explaining why randomisation and blinding matter

**Quick Reference:** Chapter 14 Experimental Design Decision Guide

---

## Chapter 15: Multiple Comparisons and Reproducibility

This chapter addresses the critical issues of multiple testing and reproducibility in modern statistical practice.

### 15.1 The Multiple Testing Problem
- 15.1.1 Why Testing Many Hypotheses Is Dangerous
- 15.1.2 The Probability of At Least One False Positive
  - 15.1.2.1 FWER = 1 - (1 - α)^m
- 15.1.3 Visualising Error Accumulation
  - *Simulation: False positives with increasing tests*
- 15.1.4 Examples in Biomedical Research
  - *Example: Multiple endpoints in clinical trials*
  - *Example: Genome-wide association studies*

### 15.2 Family-Wise Error Rate Control
- 15.2.1 Definition of FWER
- 15.2.2 Bonferroni Correction
  - 15.2.2.1 Adjusted α = α/m
  - 15.2.2.2 Conservatism and Power Loss
- 15.2.3 Šidák Correction
- 15.2.4 Holm's Step-Down Procedure
  - 15.2.4.1 Improved Power Over Bonferroni
  - 15.2.4.2 Procedure
- 15.2.5 Hochberg's Step-Up Procedure
- 15.2.6 Using p.adjust() in R
  - *Example: Adjusting p-values from multiple tests*

### 15.3 False Discovery Rate Control
- 15.3.1 A Different Philosophy: Controlling the Expected Proportion of False Discoveries
- 15.3.2 Definition of FDR
- 15.3.3 Benjamini-Hochberg (BH) Procedure
  - 15.3.3.1 Step-Up Procedure
  - 15.3.3.2 Implementation
- 15.3.4 q-Values
- 15.3.5 When to Use FDR vs FWER
  - 15.3.5.1 Exploratory vs Confirmatory Research
- 15.3.6 Using p.adjust() for FDR
  - *Example: FDR control in gene expression analysis*
  - *Visualisation: Comparing correction methods*

### 15.4 The Reproducibility Crisis
- 15.4.1 What Is the Reproducibility Crisis?
- 15.4.2 High-Profile Replication Failures
- 15.4.3 Causes of Non-Reproducibility
  - 15.4.3.1 Low Statistical Power
  - 15.4.3.2 Publication Bias
  - 15.4.3.3 Flexible Analysis (P-Hacking)
  - 15.4.3.4 HARKing (Hypothesising After Results Known)
- 15.4.4 Consequences for Science and Society

### 15.5 Questionable Research Practices
- 15.5.1 P-Hacking
  - 15.5.1.1 Definition and Examples
  - 15.5.1.2 The Garden of Forking Paths
  - *Simulation: How easy it is to find p < 0.05*
- 15.5.2 Selective Reporting
- 15.5.3 HARKing
- 15.5.4 Publication Bias and the File Drawer Problem

### 15.6 Solutions and Best Practices
- 15.6.1 Pre-Registration
  - 15.6.1.1 What to Pre-Register
  - 15.6.1.2 Pre-Registration Platforms (OSF, ClinicalTrials.gov)
- 15.6.2 Registered Reports
- 15.6.3 Reporting Guidelines
  - 15.6.3.1 CONSORT for Clinical Trials
  - 15.6.3.2 STROBE for Observational Studies
  - 15.6.3.3 PRISMA for Systematic Reviews
- 15.6.4 Open Science Practices
  - 15.6.4.1 Open Data
  - 15.6.4.2 Open Code
  - 15.6.4.3 Open Materials
- 15.6.5 Statistical Best Practices
  - 15.6.5.1 Report Effect Sizes and Confidence Intervals
  - 15.6.5.2 Distinguish Exploratory from Confirmatory
  - 15.6.5.3 Power Your Studies Adequately
  - 15.6.5.4 Embrace Uncertainty

### 15.7 Reproducible Research with R
- 15.7.1 Literate Programming
- 15.7.2 R Markdown Basics
- 15.7.3 Introduction to Quarto
- 15.7.4 Version Control with Git
- 15.7.5 Creating Reproducible Reports
  - *Code: Template for reproducible analysis*

**Communicating to Stakeholders:** Being honest about uncertainty and limitations

**Quick Reference:** Chapter 15 Multiple Testing Methods and Best Practices Checklist

---

## Appendices

### Appendix A: R Programming for Statistical Computing
- A.1 Data Structures Review
- A.2 Vectorised Operations
- A.3 Writing Efficient Functions
- A.4 The apply Family of Functions
- A.5 Introduction to data.table for Statistical Computing
- A.6 Introduction to ggplot2 for Statistical Graphics
- A.7 Random Number Generation and set.seed()
- A.8 Numerical Optimisation with optim()

### Appendix B: Mathematical Foundations
- B.1 Summation Notation
- B.2 Basic Calculus for Statistics
  - B.2.1 Derivatives
  - B.2.2 Integrals
  - B.2.3 Finding Maxima and Minima
- B.3 Logarithms and Exponentials
- B.4 Basic Matrix Operations
- B.5 Working with Integrals in R (Numerical Integration)

### Appendix C: Probability Distribution Reference
- C.1 Discrete Distributions Summary Table
  - Properties, R functions, and applications for each distribution
- C.2 Continuous Distributions Summary Table
  - Properties, R functions, and applications for each distribution
- C.3 Relationships Between Distributions
  - Diagram showing connections
- C.4 Distribution Selection Flowchart

### Appendix D: Statistical Tables
- D.1 Standard Normal (Z) Distribution
- D.2 Student's t-Distribution Critical Values
- D.3 Chi-Square Distribution Critical Values
- D.4 F-Distribution Critical Values
- D.5 Note: Why We Use R Instead of Tables

### Appendix E: Datasets Used in This Course
- E.1 Description of Each Dataset
- E.2 Data Sources and Citations
  - NHANES Data
  - {medicaldata} Package Datasets
  - NHLBI Teaching Datasets
  - Simulated Clinical Trial Data
- E.3 Loading and Accessing Datasets in R
- E.4 Data Dictionaries

### Appendix F: Glossary of Statistical Terms

### Appendix G: Quick Reference Cards
- G.1 Descriptive Statistics Formulae
- G.2 Probability Rules
- G.3 Discrete Distributions Quick Reference
- G.4 Continuous Distributions Quick Reference
- G.5 Confidence Interval Formulae
- G.6 Hypothesis Test Formulae
- G.7 Test Selection Flowcharts
- G.8 R Function Quick Reference

---

## Data Sources Referenced

Throughout this course, we use publicly available datasets including:

1. **NHANES** (National Health and Nutrition Examination Survey) — Population health data from the US CDC
2. **{medicaldata} R Package** — 19 curated medical datasets for teaching, including clinical trial data
3. **NHLBI Teaching Datasets** — Datasets from the National Heart, Lung, and Blood Institute designed for statistics education
4. **WHO Global Health Observatory** — International health statistics
5. **Simulated Data** — Custom-generated datasets for specific teaching purposes

---

## Notes on Implementation

- All statistical functions are first implemented from scratch to build understanding
- Built-in R functions and packages are introduced after manual implementation
- Code is written for clarity first, efficiency second
- All code follows tidyverse style guidelines where applicable
- British Oxford English spelling is used throughout

---

## Online Resources

- Code repository for all examples
- Additional exercises with solutions
- Datasets in multiple formats
- Errata and updates
