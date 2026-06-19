# Mathematical Statistics with R — Master Table of Contents

A rigorous treatment of statistical theory using R as a computational laboratory. Every concept is introduced in plain language, formalised with proofs and derivations, implemented from scratch in R, and visualised with ggplot2 and JavaScript animations.

---

## Book Structure

| Book | Title | Folder | Chapters | Status |
|------|-------|--------|----------|--------|
| I | Foundations | `mathematical-statistics-1-foundations/` | 25 | Not Started |
| II | Advanced | `mathematical-statistics-2-advanced/` | TBD | Planned |
| III | Research | `mathematical-statistics-3-research/` | TBD | Planned |

---

# Book I: Foundations

**Folder:** `mathematical-statistics-1-foundations/`

---

## Part I: Foundations

### Chapter 1: Describing Data

*Before we model anything, we must understand what we have.*

| Key | Detail |
|-----|--------|
| R | Build `mean()`, `var()`, `sd()`, `median()` from scratch before using built-ins |
| ggplot2 | Histograms, density plots, boxplots, violin plots, ECDF, scatterplots |
| JS | — |
| LaTeX | Derivation of Bessel's correction (why n-1) |
| Crash course | — |
| Difficulty | Low — accessible entry point |

**Parts:**
- 1.1 Types of data (categorical, ordinal, continuous, discrete)
- 1.2 Measures of central tendency — mean, median, mode
  - Build from scratch in R, then show built-in functions
- 1.3 Measures of spread — variance, standard deviation, IQR
  - Build from scratch in R
  - Derive why we divide by n-1 (Bessel's correction proof)
- 1.4 Shape: skewness and kurtosis
  - Moment-based definitions, compute manually
- 1.5 Visualising distributions
  - ggplot2: histograms, density plots, boxplots, violin plots, ECDF
  - Binwidth choices, kernel density estimation (intuition only)
- 1.6 Visualising relationships
  - ggplot2: scatterplots, correlation matrices, heatmaps
  - Simpson's paradox preview
- 1.7 Exercises

---

### Chapter 2: Probability — The Language

*The formal foundation upon which all inference is built.*

| Key | Detail |
|-----|--------|
| R | Simulate sample spaces, verify axioms, frequency-based probability |
| ggplot2 | Probability visualisations, Venn-style diagrams |
| JS | Interactive Venn diagrams for conditional probability; interactive Bayes updating |
| LaTeX | Kolmogorov axioms, inclusion-exclusion, Bayes' theorem derivation |
| Crash course | Set theory notation (unions, intersections, complements, De Morgan's laws); combinatorics (permutations, combinations, multiplication principle) |
| Difficulty | Moderate — counting problems and conditional probability are deceptively hard |

**Parts:**
- 2.1 What is probability? Frequentist and subjective interpretations
- 2.2 Sample spaces and events
  - **Crash course: set theory notation**
- 2.3 Axioms of probability
  - Kolmogorov's three axioms
  - Derive consequences: complement rule, inclusion-exclusion
  - R: verify with simulation
- 2.4 Counting
  - **Crash course: combinatorics**
  - Permutations, combinations, binomial coefficients
  - R: `choose()`, `factorial()`, brute-force enumeration vs formulae
- 2.5 Conditional probability
  - Derivation of multiplication rule
  - R: simulate, frequency tables
  - JS: Venn diagrams that update as you condition
  - Base rate fallacy, prosecutor's fallacy — worked examples
- 2.6 Independence
  - Formal definition, testing via simulation
- 2.7 Bayes' theorem
  - Derive from conditional probability
  - Multiple worked examples
  - R: Bayesian updating
  - JS: interactive prior/likelihood/posterior visualisation
- 2.8 Exercises

---

### Chapter 3: Random Variables

*Formalising uncertainty as mathematical objects.*

| Key | Detail |
|-----|--------|
| R | Simulate random variables, compute expectations numerically and by simulation |
| ggplot2 | PMFs, PDFs, CDFs plotted |
| JS | — |
| LaTeX | Formal definitions, linearity of expectation (proof), LOTUS (proof), Var(X) = E[X^2] - (E[X])^2 (derivation), MGF definitions |
| Crash course | Integration basics (what an integral means, area under curve) |
| Difficulty | Moderate — P(X=x)=0 for continuous RVs confuses many; MGFs feel abstract |

**Parts:**
- 3.1 What is a random variable?
  - Plain English, then formal definition as mapping
  - R: simulate, build intuition
- 3.2 Discrete random variables — PMF, CDF
  - R: create and plot PMFs from scratch
- 3.3 Continuous random variables — PDF, CDF
  - **Crash course: integration basics**
  - Why P(X = x) = 0 — careful explanation
  - R: `integrate()`, plot PDFs and CDFs
- 3.4 Expectation
  - Definitions for discrete and continuous
  - Prove linearity of expectation
  - Prove LOTUS (law of the unconscious statistician)
  - R: compute expectations numerically and by simulation
- 3.5 Variance and standard deviation
  - Derive Var(X) = E[X^2] - (E[X])^2
  - Prove variance of linear transformations
  - R: verify computationally
- 3.6 Higher moments — skewness, kurtosis formalised
  - Connect back to Chapter 1 descriptive measures
- 3.7 Moment generating functions
  - Definition, uniqueness theorem
  - Derive MGFs for simple distributions
  - Motivation: tool for proofs about sums
  - R: numerical MGF approximation
- 3.8 Exercises

---

### Chapter 4: Discrete Distributions

*Each distribution derived from a real situation, not stated as a formula.*

| Key | Detail |
|-----|--------|
| R | `dbinom()`, `rbinom()`, `dpois()`, etc. — but implement PMFs from scratch first |
| ggplot2 | PMF plots for various parameters, family comparison plots |
| JS | Slider: n and p for Binomial -> Poisson convergence |
| LaTeX | Binomial PMF derivation, Poisson as limit of Binomial (full proof), E[X] and Var(X) via MGF for each, memoryless property proof |
| Crash course | — (counting from Ch.2 is sufficient) |
| Difficulty | Moderate — the Poisson limit theorem derivation is a highlight |

**Parts:**
- 4.1 Bernoulli and Binomial
  - Derive binomial PMF from independent Bernoulli trials
  - Prove E[X] and Var(X) directly and via MGF
  - R: implement PMF from scratch, then `dbinom()`
- 4.2 Geometric and Negative Binomial
  - Derive from "waiting for successes"
  - Prove memoryless property of geometric
- 4.3 Hypergeometric
  - Derive from sampling without replacement
  - Compare to binomial — when does it matter?
- 4.4 Poisson
  - **Derive as limit of Binomial (full proof)**
  - Derive E[X] and Var(X)
  - R: demonstrate convergence
  - JS: slider for n and p, watch Binomial morph into Poisson
- 4.5 Relationships between discrete distributions (summary)
- 4.6 Exercises

---

### Chapter 5: Continuous Distributions

*The key continuous distributions, each motivated and derived.*

| Key | Detail |
|-----|--------|
| R | Implement PDFs from scratch, `d/p/q/r` functions, inverse transform method |
| ggplot2 | PDF families with varying parameters, theoretical vs simulated overlays |
| JS | Normal with sliding mu/sigma; Beta with sliding alpha/beta |
| LaTeX | Derive each PDF, prove properties, chi-square/t/F construction proofs |
| Crash course | The Gamma function; change of variables technique (Jacobian) |
| Difficulty | High for 5.5 (chi-square/t/F) — these derivations are critical and dense |

**Parts:**
- 5.1 Uniform — PDF, CDF, moments; inverse transform method (prove it)
  - R: `runif()` as the basis of all simulation
- 5.2 Exponential
  - Derive from Poisson process
  - Prove memoryless property
  - R: simulate Poisson process, measure inter-arrival times
- 5.3 Gamma
  - **Crash course: the Gamma function**
  - Derive as sum of exponentials
  - R: demonstrate sum of exponentials -> Gamma
- 5.4 Normal (Gaussian)
  - Multiple motivations (CLT, maximum entropy, de Moivre-Laplace)
  - Derive moments, MGF
  - Prove linear combinations of normals are normal (via MGF)
  - R: `dnorm()`, `pnorm()`, `qnorm()`
  - JS: normal with sliding mu and sigma
- 5.5 Chi-square, t, and F distributions
  - **Derive chi-square as sum of squared normals**
  - **Derive t as ratio involving chi-square**
  - **Derive F as ratio of chi-squares**
  - R: simulate each construction, compare to theoretical PDFs
  - ggplot2: degrees of freedom changing shape
- 5.6 Beta distribution
  - Connection to order statistics, Bayesian preview
  - JS: alpha/beta sliders
- 5.7 Log-normal and transformations
  - **Crash course: change of variables (Jacobian)**
- 5.8 Distribution relationships (summary diagram)
- 5.9 Exercises

---

### Chapter 6: Joint Distributions and Multivariate Thinking

*Moving from one variable to many.*

| Key | Detail |
|-----|--------|
| R | Bivariate simulations, `mvtnorm` package |
| ggplot2 | 2D histograms, contour plots, 3D perspective, scatterplot matrices |
| JS | Bivariate normal with adjustable correlation |
| LaTeX | Joint/marginal/conditional derivations, Cauchy-Schwarz proof, convolution formula, multivariate normal PDF |
| Crash course | Vectors, matrices, matrix multiplication, transpose, inverse, determinant (enough for multivariate normal) |
| Difficulty | High — multivariate normal requires linear algebra; the crash course is substantial |

**Parts:**
- 6.1 Joint, marginal, and conditional distributions
  - Definitions for discrete and continuous
  - Derive marginals by summation/integration
- 6.2 Independence of random variables
- 6.3 Covariance and correlation
  - Prove Cauchy-Schwarz to show |rho| <= 1
  - Correlation != dependence — counterexamples
- 6.4 Functions of multiple random variables
  - Convolution formula — derive and apply
- 6.5 The multivariate normal
  - **Crash course: vectors, matrices, multiplication, inverse, determinant**
  - The PDF, marginals are normal, conditionals are normal (derive)
  - R: `mvtnorm`, contour plots
  - JS: bivariate normal with adjustable correlation
- 6.6 Exercises

---

## Part II: Inference

### Chapter 7: Convergence and Limit Theorems

*Why statistics works: averages behave predictably in large samples.*

| Key | Detail |
|-----|--------|
| R | Extensive simulation of convergence, sampling distributions |
| ggplot2 | Grid of source distributions and their sampling distributions at various n |
| JS | Running average stabilising; CLT — build sampling distribution in real time |
| LaTeX | Markov's inequality, Chebyshev's inequality, weak LLN proof, CLT proof (MGF method), delta method derivation |
| Crash course | Taylor expansion (for delta method) |
| Difficulty | High — convergence concepts are abstract; CLT proof is dense |

**Parts:**
- 7.1 Why convergence matters — plain English motivation
- 7.2 Types of convergence
  - In probability, in distribution, almost sure
  - R: simulate sequences, visualise different modes
- 7.3 Inequalities
  - Derive Markov's inequality
  - Derive Chebyshev's inequality from Markov
  - R: show bounds are conservative but valid
- 7.4 Law of Large Numbers
  - Prove weak LLN using Chebyshev
  - R: simulate sample means converging
  - JS: running average that stabilises
- 7.5 Central Limit Theorem
  - Prove via MGF method
  - R: sample from non-normal distributions, show normality emerging
  - JS: draw samples, build sampling distribution live, overlay normal
  - ggplot2: grid comparing source distributions to sampling distributions
- 7.6 Delta method
  - **Crash course: first-order Taylor expansion**
  - Derive delta method
  - R: variance-stabilising transformation examples
- 7.7 Exercises

---

### Chapter 8: Point Estimation

*The theory of guessing parameters well.*

| Key | Detail |
|-----|--------|
| R | Implement estimators from scratch, `optim()` for numerical MLE, simulate sampling distributions |
| ggplot2 | Likelihood surfaces, 2D contour plots, sampling distribution comparisons |
| JS | Interactive likelihood — slide parameter, watch likelihood change |
| LaTeX | Unbiasedness proofs, MLE derivations for multiple distributions, Cramer-Rao bound (full proof), factorisation theorem, Rao-Blackwell theorem |
| Crash course | — |
| Difficulty | High — Cramer-Rao and sufficiency are abstract; MLE asymptotics are demanding |

**Parts:**
- 8.1 Estimators vs estimates — the crucial distinction
- 8.2 Properties: unbiasedness, consistency, efficiency
  - Prove sample mean is unbiased for mu
  - Prove sample variance with n-1 is unbiased
  - Prove sample mean is consistent (via LLN)
  - R: simulate and compare estimators
- 8.3 Method of moments
  - Derive estimators for several distributions
- 8.4 Maximum likelihood estimation
  - Define likelihood, log-likelihood
  - Derive MLEs: normal, exponential, Poisson, Bernoulli
  - Prove MLEs are consistent (state regularity conditions)
  - R: implement from scratch, plot likelihood surfaces, `optim()`
  - JS: interactive likelihood visualisation
- 8.5 Fisher information and the Cramer-Rao bound
  - Define Fisher information
  - **Prove the Cramer-Rao lower bound**
  - R: compare estimator variance to bound
- 8.6 Sufficiency
  - Factorisation theorem (prove)
  - Rao-Blackwell theorem (prove)
  - Can be marked optional for first reading
- 8.7 Exercises

---

### Chapter 9: Interval Estimation

*Quantifying uncertainty in our estimates.*

| Key | Detail |
|-----|--------|
| R | Implement CIs from scratch, `t.test()`, coverage simulations |
| ggplot2 | Coverage plots (100 CIs, colour by capture) |
| JS | Repeated sampling animation — intervals appearing, some missing the true value |
| LaTeX | Derive Z-interval, t-interval, Wilson interval, chi-square interval, pivotal quantity method |
| Crash course | — |
| Difficulty | Moderate — the concept of what a CI means is widely misunderstood |

**Parts:**
- 9.1 What a confidence interval IS and IS NOT
  - R: simulate 100 CIs, show ~95 capture the parameter
  - JS: repeated sampling, intervals appearing live
- 9.2 CIs for the mean — Z-interval (known sigma), t-interval (unknown sigma)
  - Derive both
  - R: implement from scratch, compare to `t.test()`
- 9.3 CIs for proportions — Wald vs Wilson
  - Derive both, explain why Wilson is better
  - R: compare coverage via simulation
- 9.4 CIs for variance — chi-square based
- 9.5 General method: pivotal quantities
- 9.6 Sample size determination
  - Derive required n, visualise tradeoffs
- 9.7 Exercises

---

### Chapter 10: Hypothesis Testing — Framework

*The logic and theory of statistical tests.*

| Key | Detail |
|-----|--------|
| R | Simulate p-values under null (show uniform), power curves |
| ggplot2 | P-value distributions under null vs alternative, power curves |
| JS | Slide effect size/n/alpha — watch power change, see null and alternative distributions with rejection regions |
| LaTeX | Formal framework, p-value definition, Type I/II errors, power function derivation, Neyman-Pearson lemma (full proof), LRT framework, Wilks' theorem |
| Crash course | — |
| Difficulty | High — Neyman-Pearson proof is non-trivial; p-value interpretation requires careful handling |

**Parts:**
- 10.1 The logic of hypothesis testing — plain English
- 10.2 Test statistics and rejection regions
- 10.3 P-values — definition, what they are and are NOT
  - R: simulate p-values under null, show uniform distribution
- 10.4 Type I and Type II errors
- 10.5 Power
  - Derive power functions
  - R: compute and plot power curves
  - JS: interactive power visualisation
- 10.6 Neyman-Pearson lemma — **full proof**
- 10.7 Likelihood ratio tests, Wilks' theorem
- 10.8 Exercises

---

### Chapter 11: Classical Tests

*Every test derived from theory, not presented as a recipe.*

| Key | Detail |
|-----|--------|
| R | Implement each test from scratch, then show built-in; diagnostic plots |
| ggplot2 | Q-Q plots explained properly, assumption violation visualisations |
| JS | — |
| LaTeX | Derive test statistics for t-tests, chi-square tests, F-test from distributional theory |
| Crash course | — |
| Difficulty | Moderate — connecting derivations to `t.test()` output |

**Parts:**
- 11.1 One-sample t-test — derive from first principles
- 11.2 Two-sample t-test — equal and unequal variances (Welch)
- 11.3 Paired t-test — show it's a one-sample test on differences
- 11.4 Tests for proportions — Z-test, exact binomial
- 11.5 Chi-square tests — goodness-of-fit, independence (derive both)
- 11.6 F-test for comparing variances
- 11.7 Checking assumptions — what violations look like
  - Q-Q plots explained properly
- 11.8 Exercises

---

### Chapter 12: Multiple Testing and Modern Concerns

*What goes wrong when you run many tests.*

| Key | Detail |
|-----|--------|
| R | Simulate false positive accumulation, implement BH procedure |
| ggplot2 | "Significant by chance" visualisation |
| JS | — |
| LaTeX | Prove P(>= 1 false positive) = 1-(1-alpha)^m, Bonferroni via union bound, FDR definition, BH procedure |
| Crash course | — |
| Difficulty | Moderate — conceptually important, mathematically accessible |

**Parts:**
- 12.1 The multiple testing problem — prove how quickly false positives accumulate
- 12.2 Family-wise error rate — Bonferroni (prove via union bound), Holm's method
- 12.3 False discovery rate — BH procedure
  - R: implement BH, compare to Bonferroni
- 12.4 The replication crisis — pre-registration, effect sizes, reporting practices
- 12.5 Exercises

---

### Chapter 13: Nonparametric Methods

*When you can't or won't assume a distribution.*

| Key | Detail |
|-----|--------|
| R | Implement permutation test and bootstrap from scratch, `boot` package |
| ggplot2 | Bootstrap distributions, power comparisons |
| JS | Resampling with replacement animation — bootstrap distributions forming |
| LaTeX | Permutation test logic, Wilcoxon derivation, bootstrap principle, bias-variance tradeoff |
| Crash course | — |
| Difficulty | Moderate — conceptually elegant, computationally intensive |

**Parts:**
- 13.1 Why nonparametric?
- 13.2 Permutation tests — implement from scratch, compare to t-test
- 13.3 Rank-based tests — Wilcoxon signed-rank, Mann-Whitney U
  - R: `wilcox.test()`, power comparison via simulation
- 13.4 The bootstrap — full treatment
  - Implement from scratch, percentile and BCa intervals
  - JS: resampling animation
- 13.5 Cross-validation — bias-variance tradeoff, k-fold CV
  - R: implement from scratch
- 13.6 Exercises

---

## Part III: Modelling

### Chapter 14: Linear Algebra for Statistics

*The machinery we need for linear models.*

| Key | Detail |
|-----|--------|
| R | Matrix operations, `%*%`, `solve()`, `eigen()` |
| ggplot2 | 2D/3D projection visualisations |
| JS | Vector projected onto a plane — this is literally what OLS does |
| LaTeX | Full definitions and proofs for projection, spectral theorem, quadratic forms |
| Crash course | This entire chapter IS the crash course |
| Difficulty | High — dense, abstract, but every concept pays off in later chapters |

**Parts:**
- 14.1 Vectors and vector spaces
- 14.2 Matrices and operations — multiplication, transpose, trace
- 14.3 Solving linear systems — inverse, existence of solutions
- 14.4 Projection
  - Derive the projection matrix
  - JS: vector projected onto plane — OLS visualised geometrically
- 14.5 Eigenvalues and the spectral theorem
- 14.6 Quadratic forms and positive definiteness
- 14.7 Exercises

---

### Chapter 15: Simple Linear Regression

*One predictor, thoroughly understood.*

| Key | Detail |
|-----|--------|
| R | Implement OLS from scratch (no `lm()`), then compare; `summary(lm())` interpreted line by line |
| ggplot2 | Fitted lines, residual plots, prediction intervals |
| JS | Drag the line, watch sum of squares change, find the minimum |
| LaTeX | Derive estimators by calculus, prove unbiasedness, derive variances, Gauss-Markov (simple case), derive t-test for slope, R-squared |
| Crash course | — |
| Difficulty | Moderate — the entry point to modelling |

**Parts:**
- 15.1 The model — Y = beta0 + beta1*X + epsilon
- 15.2 Least squares estimation — derive by minimising SSR
  - R: implement from scratch
  - JS: interactive line fitting
- 15.3 Properties — prove unbiasedness, derive variances, BLUE
  - R: simulate repeated regressions
- 15.4 Inference — t-test for slope, CIs, prediction vs confidence intervals
  - R: interpret `summary(lm(...))` completely
- 15.5 R-squared — derive, adjusted R-squared, relationship to F-test
- 15.6 Residual analysis
- 15.7 Exercises

---

### Chapter 16: Multiple Linear Regression

*The matrix formulation and its power.*

| Key | Detail |
|-----|--------|
| R | Matrix implementation of OLS, `summary()`, `anova()`, `step()`, VIF |
| ggplot2 | Partial regression plots, added variable plots |
| JS | — |
| LaTeX | Derive beta-hat = (X'X)^{-1}X'Y as projection, **Gauss-Markov theorem (full proof)**, F-test derivation, AIC derivation |
| Crash course | — (Chapter 14 provides the foundation) |
| Difficulty | High — Gauss-Markov proof is the centrepiece; matrix formulation is demanding |

**Parts:**
- 16.1 The matrix formulation — Y = X*beta + epsilon
  - Derive beta-hat as projection (connects to Ch.14)
- 16.2 **Gauss-Markov theorem (full proof)**
- 16.3 Inference — t-tests, F-tests for nested models
- 16.4 Multicollinearity — what happens to (X'X)^{-1}
  - R: VIF, demonstrate with simulation
- 16.5 Model selection — AIC (derive), BIC, adjusted R-squared
- 16.6 Polynomial and interaction terms
- 16.7 Exercises

---

### Chapter 17: Regression Diagnostics

*Verifying that your proofs' assumptions hold in practice.*

| Key | Detail |
|-----|--------|
| R | `plot(lm(...))` explained completely, `sandwich` package, Box-Cox |
| ggplot2 | Systematic diagnostic plot tour, with-and-without influential points |
| JS | — |
| LaTeX | Leverage derivation, Cook's distance derivation, sandwich estimator derivation, Box-Cox |
| Crash course | — |
| Difficulty | Moderate — applied but mathematically motivated |

**Parts:**
- 17.1 Assumptions stated precisely (linearity, independence, homoscedasticity, normality)
- 17.2 Residual diagnostics — all four `plot(lm())` plots explained
- 17.3 Influential observations — leverage, Cook's distance (derive)
- 17.4 Heteroscedasticity — sandwich/robust SEs (derive)
- 17.5 Non-normality — when CLT saves you, when it doesn't; Box-Cox
- 17.6 Non-linearity — detection and remedies
- 17.7 Exercises

---

### Chapter 18: Analysis of Variance

*ANOVA as regression with categorical predictors.*

| Key | Detail |
|-----|--------|
| R | `aov()`, `anova(lm(...))` — show equivalence; `TukeyHSD()` |
| ggplot2 | Interaction plots, group comparison plots |
| JS | — |
| LaTeX | Derive F-test as nested model comparison, connect to Ch.16 |
| Crash course | — |
| Difficulty | Moderate — conceptually simpler once you see it's regression |

**Parts:**
- 18.1 One-way ANOVA — derive as regression with dummy variables
- 18.2 Multiple comparisons — Tukey HSD (connects to Ch.12)
- 18.3 Two-way ANOVA and interactions
- 18.4 ANCOVA — continuous + categorical predictors
- 18.5 Exercises

---

### Chapter 19: Generalised Linear Models — Framework

*Unifying regression for non-normal outcomes.*

| Key | Detail |
|-----|--------|
| R | Implement IRLS from scratch, `glm()` |
| ggplot2 | Visualise the problem (fitting line to binary data), deviance plots |
| JS | — |
| LaTeX | Exponential family definition, derive mean/variance from exponential form, canonical links, IRLS from Fisher scoring, deviance derivation |
| Crash course | — |
| Difficulty | High — exponential family is abstract; IRLS derivation is demanding |

**Parts:**
- 19.1 The problem — why linear regression fails for binary/count outcomes
  - R/ggplot2: demonstrate the failure visually
- 19.2 The exponential family — define, show normal/binomial/Poisson/gamma are members
  - Derive mean and variance relationships
- 19.3 Link functions — three components, canonical links
- 19.4 IRLS — derive from Fisher scoring
  - R: implement from scratch, compare to `glm()`
- 19.5 Deviance and model comparison — LRT for GLMs
- 19.6 Exercises

---

### Chapter 20: Logistic Regression

*The most important GLM in practice.*

| Key | Detail |
|-----|--------|
| R | `glm(..., family=binomial)`, implement from scratch, confusion matrix, ROC |
| ggplot2 | Sigmoid curves, ROC curves, calibration plots |
| JS | Adjust coefficients, watch decision boundary move |
| LaTeX | Derive logistic from exponential family, odds/log-odds interpretation, Wald and LR tests |
| Crash course | Sensitivity, specificity, precision, recall — define carefully |
| Difficulty | Moderate — builds naturally on Ch.19 |

**Parts:**
- 20.1 The model — derive logistic as canonical link for Bernoulli
  - Odds, log-odds, coefficient interpretation
  - JS: interactive decision boundary
- 20.2 Inference — Wald tests, LR tests, profile CIs
- 20.3 Model assessment
  - **Crash course: classification metrics (sensitivity, specificity, precision, recall)**
  - ROC curves, AUC, calibration
- 20.4 Multinomial and ordinal extensions
- 20.5 Exercises

---

### Chapter 21: Poisson and Count Models

*Modelling counts and rates.*

| Key | Detail |
|-----|--------|
| R | `glm(..., family=poisson)`, `MASS::glm.nb()`, `pscl::zeroinfl()` |
| ggplot2 | Fitted rates, overdispersion diagnostics |
| JS | — |
| LaTeX | Log link as canonical for Poisson, rate ratios, Poisson-Gamma mixture derivation for NB |
| Crash course | — |
| Difficulty | Moderate |

**Parts:**
- 21.1 Poisson regression — derive, interpret as rate ratios
- 21.2 Overdispersion — what it means, why it breaks inference, quasi-Poisson
- 21.3 Negative binomial — derive as Poisson-Gamma mixture
- 21.4 Zero-inflated models — two-component logic
- 21.5 Offsets and rate models
- 21.6 Exercises

---

## Part IV: Bayesian Foundations

### Chapter 22: Bayesian Thinking

*A different philosophy of inference.*

| Key | Detail |
|-----|--------|
| R | Compute conjugate posteriors, sensitivity analysis |
| ggplot2 | Prior/likelihood/posterior plots, credible vs confidence intervals |
| JS | Data points arrive one at a time, posterior updates live |
| LaTeX | Posterior derivation from Bayes' theorem, Beta-Binomial/Normal-Normal/Gamma-Poisson conjugate derivations, Bayes factors |
| Crash course | — |
| Difficulty | Moderate — conceptual shift, but maths is accessible with conjugates |

**Parts:**
- 22.1 The framework — posterior proportional to likelihood times prior (derive)
- 22.2 Conjugate priors
  - Derive: Beta-Binomial, Normal-Normal, Gamma-Poisson
  - R: plot priors, likelihoods, posteriors
  - JS: live posterior updating
- 22.3 Prior selection — informative, weakly informative, flat; sensitivity analysis
- 22.4 Credible intervals vs confidence intervals — precise comparison
- 22.5 Bayes factors
- 22.6 Exercises

---

### Chapter 23: Computational Bayesian Methods

*When posteriors don't have closed forms.*

| Key | Detail |
|-----|--------|
| R | Implement MH and Gibbs from scratch, `coda`, `rstanarm`/`brms` intro |
| ggplot2 | Trace plots, good vs bad convergence |
| JS | MCMC chain exploring posterior surface; Gibbs sampler right-angle path |
| LaTeX | Monte Carlo integration (prove via LLN), detailed balance, MH algorithm, Gibbs as special case |
| Crash course | — |
| Difficulty | High — MCMC convergence theory is subtle |

**Parts:**
- 23.1 Why computation? Most posteriors are intractable
- 23.2 Monte Carlo integration — why it works (LLN)
- 23.3 Metropolis-Hastings
  - The algorithm, detailed balance (intuition)
  - R: implement from scratch
  - JS: chain exploring the posterior
- 23.4 Gibbs sampling — derive as special case of MH
  - R: implement for bivariate normal
  - JS: right-angle path animation
- 23.5 Diagnostics — trace plots, ESS, R-hat
- 23.6 Practical modelling — `rstanarm`/`brms` introduction
- 23.7 Exercises

---

## Part V: Design and Practice

### Chapter 24: Experimental Design and Data Collection

*How data is generated determines what analysis is valid.*

| Key | Detail |
|-----|--------|
| R | `pwr` package for sample size calculations |
| ggplot2 | Power curves for design planning |
| JS | — |
| LaTeX | Randomisation theory (why it balances confounders in expectation) |
| Crash course | — |
| Difficulty | Low-moderate — conceptual, less mathematical |

**Parts:**
- 24.1 Observational vs experimental studies — implications for causation
- 24.2 Randomisation — why it works mathematically
- 24.3 Blocking and stratification
- 24.4 Sample size and power revisited — design calculations
- 24.5 Common pitfalls — selection bias, survivorship bias, confounding
- 24.6 Exercises

---

### Chapter 25: Bringing It Together

*Complete analyses from question to conclusion.*

| Key | Detail |
|-----|--------|
| R | Full annotated analyses from raw data to conclusions |
| ggplot2 | Publication-quality figures |
| JS | — |
| LaTeX | — |
| Crash course | — |
| Difficulty | Moderate — integrative, requires all prior knowledge |

**Parts:**
- 25.1 The statistical workflow — question, design, collect, explore, model, check, interpret
- 25.2 Case studies (2-3 full analyses using methods from the entire book)
- 25.3 Where to go next — roadmap to Book II

---

## Summary: Special Features Index

### JavaScript Animations
| Chapter | Animation |
|---------|-----------|
| 2 | Conditional probability Venn diagrams; interactive Bayes updating |
| 4 | Binomial -> Poisson convergence slider |
| 5 | Normal with sliding mu/sigma; Beta with sliding alpha/beta |
| 6 | Bivariate normal with adjustable correlation |
| 7 | Running average (LLN); real-time CLT sampling distribution |
| 8 | Interactive likelihood surface |
| 9 | Repeated sampling CI coverage |
| 10 | Interactive power (effect size, n, alpha sliders) |
| 13 | Bootstrap resampling |
| 14 | OLS as geometric projection |
| 15 | Drag-the-line least squares |
| 20 | Logistic decision boundary |
| 22 | Live Bayesian posterior updating |
| 23 | MCMC chain exploration; Gibbs right-angle path |

### Mathematics Crash Courses
| Chapter | Topic |
|---------|-------|
| 2 | Set theory notation; combinatorics |
| 3 | Integration basics |
| 5 | The Gamma function; change of variables (Jacobian) |
| 6 | Vectors, matrices, basic linear algebra |
| 7 | Taylor expansion |
| 20 | Classification metrics |

### Highest Difficulty Sections
| Section | Why |
|---------|-----|
| 5.5 | Chi-square/t/F derivations — dense, foundational |
| 7.2 | Convergence types — abstract |
| 8.5 | Cramer-Rao bound — hard proof, essential result |
| 10.6 | Neyman-Pearson lemma — non-trivial proof |
| 16.2 | Gauss-Markov theorem — full proof |
| 19.2 | Exponential family — abstract framework |
| 23.3 | MCMC — convergence theory subtle |
