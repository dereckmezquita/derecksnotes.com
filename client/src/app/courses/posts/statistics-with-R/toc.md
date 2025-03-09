# Statistics with R
## A Comprehensive Guide for the R Practitioner

---

# Statistics with R
## A Comprehensive Guide for the R Practitioner

---

## Preface

This book serves as the definitive compendium for statistical methods implemented in R. Unlike traditional statistics textbooks that merely present theory or elementary R tutorials that scratch the surface of statistical applications, "Statistics with R" assumes proficiency in R programming and focuses exclusively on robust statistical methodology through a computational lens. 

Our aim is to bridge the gap between theoretical statistics and practical implementation, providing a resource that working statisticians, data scientists, researchers, and quantitative analysts can reference daily. Every concept is demonstrated through R code using modern packages like data.table for efficient data manipulation and ggplot2 for publication-quality visualisations. The examples draw from contemporary domains—bioinformatics, finance, environmental science, and social network analysis—reflecting the multidisciplinary nature of modern statistical practice.

This is not merely a book to be read sequentially; it is designed as a comprehensive reference that can be consulted at any stage of statistical analysis. Whether you need to refresh your understanding of mixture models, implement a novel time series approach, or select the appropriate test for complex experimental designs, you will find rigorous explanations accompanied by efficient, production-ready R code.

The statistical landscape continues to evolve rapidly, and this book embraces both classical foundations and cutting-edge methodologies. Our focus remains steadfastly on statistical thinking—understanding when and why particular methods are appropriate—while providing the computational tools to implement these methods with confidence and precision.

---

# Table of Contents

## Chapter 1: Foundations of Statistical Thinking
* 1.1 The Role of Statistics in the Modern Scientific Process
  * 1.1.1 From Data Collection to Inference
  * 1.1.2 Confirmatory vs. Exploratory Analysis
  * 1.1.3 Statistical Paradigms: Frequentist, Bayesian, and Likelihoodist Approaches
* 1.2 Working with Data in R
  * 1.2.1 Efficient Data Structures for Statistical Computing
  * 1.2.2 Data.table for High-Performance Data Manipulation
  * 1.2.3 Tidy Data Principles and Their Implementation
* 1.3 Principles of Statistical Graphics
  * 1.3.1 The Grammar of Graphics Framework
  * 1.3.2 Creating Informative Visualisations with ggplot2
  * 1.3.3 Common Pitfalls in Statistical Visualisation
* 1.4 Reproducible Statistical Analysis
  * 1.4.1 Literate Programming with R Markdown
  * 1.4.2 Version Control for Statistical Projects
  * 1.4.3 Dependency Management and Reproducible Environments

## Chapter 2: Probability Theory and Random Variables
* 2.1 Fundamentals of Probability
  * 2.1.1 Sample Spaces, Events, and Probability Measures
  * 2.1.2 Conditional Probability and Independence
  * 2.1.3 Bayes' Theorem and Applications
* 2.2 Discrete Random Variables
  * 2.2.1 Probability Mass Functions
  * 2.2.2 Common Discrete Distributions and Their R Implementations
    * 2.2.2.1 Bernoulli and Binomial Distributions
    * 2.2.2.2 Poisson Distribution
    * 2.2.2.3 Negative Binomial Distribution
    * 2.2.2.4 Geometric Distribution
    * 2.2.2.5 Hypergeometric Distribution
  * 2.2.3 Simulation Studies with Discrete Distributions
* 2.3 Continuous Random Variables
  * 2.3.1 Probability Density Functions
  * 2.3.2 Cumulative Distribution Functions
  * 2.3.3 Common Continuous Distributions and Their R Implementations
    * 2.3.3.1 Normal Distribution
    * 2.3.3.2 Student's t-Distribution
    * 2.3.3.3 Chi-Square Distribution
    * 2.3.3.4 F-Distribution
    * 2.3.3.5 Exponential and Gamma Distributions
    * 2.3.3.6 Beta Distribution
    * 2.3.3.7 Uniform Distribution
    * 2.3.3.8 Weibull Distribution
  * 2.3.4 Quantile Functions and Their Applications
* 2.4 Multivariate Distributions
  * 2.4.1 Joint, Marginal, and Conditional Distributions
  * 2.4.2 Covariance and Correlation
  * 2.4.3 Multivariate Normal Distribution
  * 2.4.4 Copulas for Dependence Modelling
* 2.5 Moment Generating Functions and Characteristic Functions
  * 2.5.1 Definitions and Properties
  * 2.5.2 Applications in Deriving Distributions
  * 2.5.3 Implementation in R

## Chapter 3: Descriptive Statistics and Exploratory Data Analysis
* 3.1 Measures of Central Tendency
  * 3.1.1 Mean, Median, Mode, and Their Robustness Properties
  * 3.1.2 Weighted Averages and Their Applications
  * 3.1.3 Geometric and Harmonic Means
  * 3.1.4 Efficient Computation with data.table
* 3.2 Measures of Dispersion
  * 3.2.1 Range, Interquartile Range, and Variance
  * 3.2.2 Standard Deviation and Coefficient of Variation
  * 3.2.3 Mean Absolute Deviation
  * 3.2.4 Robust Measures of Scale
* 3.3 Measures of Shape
  * 3.3.1 Skewness and Kurtosis
  * 3.3.2 Quantiles and Percentiles
  * 3.3.3 Empirical Cumulative Distribution Functions
* 3.4 Exploratory Techniques for Univariate Data
  * 3.4.1 Histograms and Density Plots
  * 3.4.2 Box Plots and Violin Plots
  * 3.4.3 QQ Plots for Distribution Assessment
  * 3.4.4 Outlier Detection Methods
* 3.5 Exploratory Techniques for Multivariate Data
  * 3.5.1 Scatter Plot Matrices
  * 3.5.2 Correlation Matrices and Heatmaps
  * 3.5.3 Parallel Coordinate Plots
  * 3.5.4 Dimensionality Reduction Visualisations
    * 3.5.4.1 Principal Components Analysis
    * 3.5.4.2 t-SNE and UMAP

## Chapter 4: Statistical Inference I: Estimation Theory
* 4.1 Point Estimation
  * 4.1.1 Properties of Estimators
    * 4.1.1.1 Unbiasedness
    * 4.1.1.2 Consistency
    * 4.1.1.3 Efficiency
    * 4.1.1.4 Sufficiency
  * 4.1.2 Method of Moments
  * 4.1.3 Maximum Likelihood Estimation
    * 4.1.3.1 Theoretical Framework
    * 4.1.3.2 Optimisation Algorithms in R
    * 4.1.3.3 Applications with Common Distributions
  * 4.1.4 Restricted Maximum Likelihood (REML)
  * 4.1.5 Bayes Estimators
* 4.2 Interval Estimation
  * 4.2.1 Confidence Intervals
    * 4.2.1.1 Exact Intervals for Normal Data
    * 4.2.1.2 Approximate Intervals Using the Central Limit Theorem
    * 4.2.1.3 Intervals for Proportions and Counts
    * 4.2.1.4 Profile Likelihood Intervals
  * 4.2.2 Bootstrap Methods
    * 4.2.2.1 Non-Parametric Bootstrap
    * 4.2.2.2 Parametric Bootstrap
    * 4.2.2.3 Block Bootstrap for Dependent Data
    * 4.2.2.4 Efficient Implementation in R
  * 4.2.3 Jackknife and Cross-Validation Approaches
  * 4.2.4 Tolerance Intervals and Prediction Intervals
* 4.3 Asymptotic Theory
  * 4.3.1 Convergence in Probability and Distribution
  * 4.3.2 Central Limit Theorem and Its Applications
  * 4.3.3 Delta Method
  * 4.3.4 Asymptotic Properties of Maximum Likelihood Estimators

## Chapter 5: Statistical Inference II: Hypothesis Testing
* 5.1 Fundamentals of Hypothesis Testing
  * 5.1.1 Null and Alternative Hypotheses
  * 5.1.2 Type I and Type II Errors
  * 5.1.3 Power Analysis and Sample Size Determination
  * 5.1.4 Effect Sizes and Practical Significance
* 5.2 Parametric Tests for Single Samples
  * 5.2.1 t-Tests for Means
  * 5.2.2 Z-Tests for Proportions
  * 5.2.3 Chi-Square Tests for Variance
  * 5.2.4 Tests for Normality
    * 5.2.4.1 Shapiro-Wilk Test
    * 5.2.4.2 Kolmogorov-Smirnov Test
    * 5.2.4.3 Anderson-Darling Test
* 5.3 Parametric Tests for Two Samples
  * 5.3.1 Independent Samples t-Test
  * 5.3.2 Paired Samples t-Test
  * 5.3.3 F-Test for Equality of Variances
  * 5.3.4 Z-Test for Equality of Proportions
* 5.4 Parametric Tests for Multiple Samples
  * 5.4.1 One-Way Analysis of Variance (ANOVA)
  * 5.4.2 Factorial ANOVA
  * 5.4.3 Repeated Measures ANOVA
  * 5.4.4 Analysis of Covariance (ANCOVA)
  * 5.4.5 Post-Hoc Tests and Multiple Comparisons
    * 5.4.5.1 Tukey's HSD
    * 5.4.5.2 Bonferroni Correction
    * 5.4.5.3 Scheffé's Method
    * 5.4.5.4 Dunnett's Test
* 5.5 Non-Parametric Tests
  * 5.5.1 Sign Test
  * 5.5.2 Wilcoxon Signed-Rank Test
  * 5.5.3 Mann-Whitney U Test
  * 5.5.4 Kruskal-Wallis Test
  * 5.5.5 Friedman Test
  * 5.5.6 Permutation Tests
* 5.6 Goodness-of-Fit Tests
  * 5.6.1 Chi-Square Test
  * 5.6.2 G-Test
  * 5.6.3 Kolmogorov-Smirnov Test for Distributions
* 5.7 Tests for Independence and Association
  * 5.7.1 Chi-Square Test of Independence
  * 5.7.2 Fisher's Exact Test
  * 5.7.3 McNemar's Test for Paired Nominal Data
  * 5.7.4 Cochran's Q Test
  * 5.7.5 Mantel-Haenszel Test
* 5.8 Modern Approaches to Hypothesis Testing
  * 5.8.1 False Discovery Rate Control
  * 5.8.2 Resampling-Based Testing
  * 5.8.3 Bayesian Hypothesis Testing
  * 5.8.4 Likelihood Ratio Tests

## Chapter 6: Linear Models
* 6.1 Simple Linear Regression
  * 6.1.1 Model Specification and Assumptions
  * 6.1.2 Least Squares Estimation
  * 6.1.3 Properties of Estimators
  * 6.1.4 Inference on Regression Coefficients
  * 6.1.5 Confidence and Prediction Intervals
  * 6.1.6 Coefficient of Determination (R²)
* 6.2 Multiple Linear Regression
  * 6.2.1 Matrix Formulation
  * 6.2.2 Interpretation of Coefficients
  * 6.2.3 Partial Correlation and Semipartial Correlation
  * 6.2.4 Multicollinearity Detection and Remedies
  * 6.2.5 Variable Selection Techniques
    * 6.2.5.1 Stepwise Selection
    * 6.2.5.2 Best Subset Selection
    * 6.2.5.3 Information Criteria (AIC, BIC)
    * 6.2.5.4 Cross-Validation Approaches
* 6.3 Regression Diagnostics
  * 6.3.1 Residual Analysis
  * 6.3.2 Leverage and Influence Measures
  * 6.3.3 Detecting Heteroscedasticity
  * 6.3.4 Tests for Normality of Residuals
  * 6.3.5 Detecting Autocorrelation in Residuals
* 6.4 Transformation and Remedial Measures
  * 6.4.1 Box-Cox and Other Power Transformations
  * 6.4.2 Weighted Least Squares
  * 6.4.3 Robust Regression Methods
    * 6.4.3.1 M-Estimation
    * 6.4.3.2 MM-Estimation
    * 6.4.3.3 Least Trimmed Squares
  * 6.4.4 Handling Outliers and Influential Points
* 6.5 Analysis of Variance as a Linear Model
  * 6.5.1 One-Way ANOVA
  * 6.5.2 Two-Way ANOVA
  * 6.5.3 ANOVA with Interactions
  * 6.5.4 Nested Designs
  * 6.5.5 Split-Plot Designs
* 6.6 Analysis of Covariance (ANCOVA)
  * 6.6.1 Model Specification
  * 6.6.2 Testing for Homogeneity of Regression Slopes
  * 6.6.3 Adjusted Means and Multiple Comparisons
* 6.7 Advanced Topics in Linear Models
  * 6.7.1 Polynomial Regression
  * 6.7.2 Splines and Piecewise Regression
  * 6.7.3 Orthogonal Polynomials
  * 6.7.4 High-Dimensional Linear Models
    * 6.7.4.1 Ridge Regression
    * 6.7.4.2 Lasso Regression
    * 6.7.4.3 Elastic Net

## Chapter 7: Generalised Linear Models
* 7.1 Framework of Generalised Linear Models
  * 7.1.1 Exponential Family of Distributions
  * 7.1.2 Link Functions
  * 7.1.3 Maximum Likelihood Estimation
  * 7.1.4 Iteratively Reweighted Least Squares
* 7.2 Logistic Regression
  * 7.2.1 Binary Response Models
  * 7.2.2 Model Fitting and Interpretation
  * 7.2.3 Odds Ratios and Their Interpretation
  * 7.2.4 Prediction and Classification
  * 7.2.5 Model Diagnostics and Goodness-of-Fit
    * 7.2.5.1 Deviance Residuals
    * 7.2.5.2 Hosmer-Lemeshow Test
    * 7.2.5.3 Separation Issues
  * 7.2.6 ROC Curves and AUC
* 7.3 Poisson Regression
  * 7.3.1 Count Data Models
  * 7.3.2 Exposure and Offset Terms
  * 7.3.3 Overdispersion and Zero-Inflation
  * 7.3.4 Negative Binomial Regression
  * 7.3.5 Hurdle Models and Zero-Inflated Models
* 7.4 Other GLM Variants
  * 7.4.1 Gamma Regression for Continuous Positive Data
  * 7.4.2 Inverse Gaussian Regression
  * 7.4.3 Multinomial Logistic Regression
  * 7.4.4 Ordinal Regression Models
    * 7.4.4.1 Proportional Odds Model
    * 7.4.4.2 Continuation Ratio Model
    * 7.4.4.3 Adjacent Category Model
* 7.5 Extensions of GLMs
  * 7.5.1 Quasi-Likelihood Methods
  * 7.5.2 Generalised Additive Models
  * 7.5.3 GEE for Longitudinal Data
  * 7.5.4 Penalised GLMs

## Chapter 8: Time Series Analysis
* 8.1 Time Series Fundamentals
  * 8.1.1 Components: Trend, Seasonality, Cycles, and Irregularity
  * 8.1.2 Autocorrelation and Partial Autocorrelation
  * 8.1.3 Stationarity and Tests for Stationarity
    * 8.1.3.1 Augmented Dickey-Fuller Test
    * 8.1.3.2 KPSS Test
    * 8.1.3.3 Transformations for Stationarity
  * 8.1.4 White Noise and Random Walk Processes
* 8.2 Smoothing Methods
  * 8.2.1 Moving Averages
  * 8.2.2 Exponential Smoothing
    * 8.2.2.1 Simple Exponential Smoothing
    * 8.2.2.2 Holt's Linear Trend Method
    * 8.2.2.3 Holt-Winters Seasonal Method
  * 8.2.3 State Space Models and ETS Framework
* 8.3 ARIMA Models
  * 8.3.1 Autoregressive (AR) Processes
  * 8.3.2 Moving Average (MA) Processes
  * 8.3.3 ARMA and ARIMA Models
  * 8.3.4 Seasonal ARIMA Models
  * 8.3.5 Model Identification and Estimation
  * 8.3.6 Forecasting with ARIMA Models
  * 8.3.7 Diagnostic Checking
* 8.4 Spectral Analysis
  * 8.4.1 Periodogram and Power Spectrum
  * 8.4.2 Fast Fourier Transform
  * 8.4.3 Spectral Density Estimation
  * 8.4.4 Applications in Cyclic Analysis
* 8.5 Multivariate Time Series
  * 8.5.1 Vector Autoregression (VAR)
  * 8.5.2 Vector Error Correction Models (VECM)
  * 8.5.3 Cointegration Analysis
  * 8.5.4 Impulse Response Functions
  * 8.5.5 Forecast Error Variance Decomposition
* 8.6 GARCH Models for Volatility
  * 8.6.1 ARCH Models
  * 8.6.2 GARCH Models
  * 8.6.3 Extensions: EGARCH, GJR-GARCH, TGARCH
  * 8.6.4 Multivariate GARCH Models
  * 8.6.5 Applications in Financial Time Series
* 8.7 State Space Models and Kalman Filtering
  * 8.7.1 State Space Representation
  * 8.7.2 Kalman Filter Algorithm
  * 8.7.3 Kalman Smoother
  * 8.7.4 Applications in Signal Processing
* 8.8 Modern Time Series Methods
  * 8.8.1 Dynamic Linear Models
  * 8.8.2 Long Memory Models and Fractional Integration
  * 8.8.3 Regime-Switching Models
  * 8.8.4 Neural Networks for Time Series
  * 8.8.5 Prophet and Automated Forecasting

## Chapter 9: Bayesian Statistics
* 9.1 Bayesian Inference Framework
  * 9.1.1 Bayes' Theorem Revisited
  * 9.1.2 Prior Distributions
    * 9.1.2.1 Informative Priors
    * 9.1.2.2 Non-Informative Priors
    * 9.1.2.3 Conjugate Priors
    * 9.1.2.4 Hierarchical Priors
  * 9.1.3 Likelihood Functions
  * 9.1.4 Posterior Distributions
  * 9.1.5 Posterior Predictive Distributions
* 9.2 Bayesian Computation
  * 9.2.1 Analytical Solutions with Conjugate Priors
  * 9.2.2 Numerical Integration Methods
  * 9.2.3 Markov Chain Monte Carlo Methods
    * 9.2.3.1 Metropolis-Hastings Algorithm
    * 9.2.3.2 Gibbs Sampling
    * 9.2.3.3 Hamiltonian Monte Carlo
  * 9.2.4 MCMC Diagnostics
    * 9.2.4.1 Convergence Assessment
    * 9.2.4.2 Effective Sample Size
    * 9.2.4.3 Autocorrelation
  * 9.2.5 Approximate Bayesian Computation
  * 9.2.6 Variational Inference
* 9.3 Bayesian Models in R
  * 9.3.1 Using rstan for Bayesian Modelling
  * 9.3.2 Using brms for Regression Models
  * 9.3.3 Using JAGS via rjags
  * 9.3.4 bayesplot for MCMC Diagnostics and Visualisation
* 9.4 Hierarchical Bayesian Models
  * 9.4.1 Multilevel Structures
  * 9.4.2 Random Effects Models
  * 9.4.3 Applications in Meta-Analysis
  * 9.4.4 Applications in Small Area Estimation
* 9.5 Bayesian Model Selection and Averaging
  * 9.5.1 Bayes Factors
  * 9.5.2 Deviance Information Criterion (DIC)
  * 9.5.3 Widely Applicable Information Criterion (WAIC)
  * 9.5.4 Leave-One-Out Cross-Validation
  * 9.5.5 Bayesian Model Averaging
* 9.6 Advanced Bayesian Topics
  * 9.6.1 Bayesian Non-Parametric Methods
  * 9.6.2 Dirichlet Process Mixtures
  * 9.6.3 Gaussian Processes
  * 9.6.4 Bayesian Networks
  * 9.6.5 Bayesian Structural Equation Models

## Chapter 10: Multivariate Analysis
* 10.1 Matrix Algebra for Multivariate Statistics
  * 10.1.1 Basic Matrix Operations
  * 10.1.2 Eigenvalues and Eigenvectors
  * 10.1.3 Matrix Decompositions
    * 10.1.3.1 Cholesky Decomposition
    * 10.1.3.2 Eigendecomposition
    * 10.1.3.3 Singular Value Decomposition
  * 10.1.4 Multivariate Random Variables
* 10.2 Principal Component Analysis
  * 10.2.1 Derivation and Properties
  * 10.2.2 Interpretation of Principal Components
  * 10.2.3 Scree Plots and Variance Explained
  * 10.2.4 Biplots and Visualisation
  * 10.2.5 Robust and Sparse PCA
* 10.3 Factor Analysis
  * 10.3.1 Exploratory Factor Analysis
  * 10.3.2 Factor Extraction Methods
  * 10.3.3 Factor Rotation
  * 10.3.4 Factor Scores
  * 10.3.5 Confirmatory Factor Analysis
* 10.4 Canonical Correlation Analysis
  * 10.4.1 Theory and Interpretation
  * 10.4.2 Significance Testing
  * 10.4.3 Visualisation Techniques
* 10.5 Discriminant Analysis
  * 10.5.1 Linear Discriminant Analysis
  * 10.5.2 Quadratic Discriminant Analysis
  * 10.5.3 Multiple Discriminant Analysis
  * 10.5.4 Canonical Discriminant Analysis
* 10.6 Cluster Analysis
  * 10.6.1 Distance Measures
  * 10.6.2 Hierarchical Clustering
    * 10.6.2.1 Agglomerative Methods
    * 10.6.2.2 Divisive Methods
    * 10.6.2.3 Dendrograms and Cluster Visualisation
  * 10.6.3 Partitioning Methods
    * 10.6.3.1 K-Means Clustering
    * 10.6.3.2 K-Medoids Clustering
    * 10.6.3.3 Determining Optimal Number of Clusters
  * 10.6.4 Model-Based Clustering
  * 10.6.5 Density-Based Clustering
* 10.7 Multidimensional Scaling
  * 10.7.1 Classical Multidimensional Scaling
  * 10.7.2 Non-Metric Multidimensional Scaling
  * 10.7.3 Applications and Interpretation
* 10.8 Correspondence Analysis
  * 10.8.1 Simple Correspondence Analysis
  * 10.8.2 Multiple Correspondence Analysis
  * 10.8.3 Visualisation and Interpretation

## Chapter 11: Longitudinal and Mixed-Effects Models
* 11.1 Introduction to Longitudinal Data
  * 11.1.1 Data Structures and Visualisation
  * 11.1.2 Correlation Structures in Repeated Measures
  * 11.1.3 Missing Data Mechanisms and Handling
* 11.2 Linear Mixed-Effects Models
  * 11.2.1 Random Intercepts Models
  * 11.2.2 Random Slopes Models
  * 11.2.3 Crossed Random Effects
  * 11.2.4 Nested Random Effects
  * 11.2.5 Variance Components
  * 11.2.6 Restricted Maximum Likelihood Estimation
* 11.3 Generalised Linear Mixed Models
  * 11.3.1 Binary Outcomes with Random Effects
  * 11.3.2 Count Data with Random Effects
  * 11.3.3 Estimation Methods
    * 11.3.3.1 Penalised Quasi-Likelihood
    * 11.3.3.2 Laplace Approximation
    * 11.3.3.3 Adaptive Gaussian Quadrature
  * 11.3.4 Model Diagnostics
* 11.4 GEE Models
  * 11.4.1 Working Correlation Structures
  * 11.4.2 Robust Standard Errors
  * 11.4.3 Comparison with Mixed-Effects Models
* 11.5 Growth Curve Models
  * 11.5.1 Polynomial Growth Models
  * 11.5.2 Piecewise Growth Models
  * 11.5.3 Latent Growth Curve Models
* 11.6 Survival Analysis for Longitudinal Data
  * 11.6.1 Frailty Models
  * 11.6.2 Joint Models for Longitudinal and Time-to-Event Data
* 11.7 Advanced Topics in Longitudinal Analysis
  * 11.7.1 Transitional Models
  * 11.7.2 Structural Equation Modelling for Longitudinal Data
  * 11.7.3 Dynamic Models

## Chapter 12: Survival Analysis
* 12.1 Survival Data Concepts
  * 12.1.1 Censoring Types
  * 12.1.2 Truncation
  * 12.1.3 Competing Risks
  * 12.1.4 Survival and Hazard Functions
* 12.2 Non-Parametric Methods
  * 12.2.1 Kaplan-Meier Estimator
  * 12.2.2 Nelson-Aalen Estimator
  * 12.2.3 Life Tables
  * 12.2.4 Log-Rank and Related Tests
* 12.3 Parametric Survival Models
  * 12.3.1 Exponential Model
  * 12.3.2 Weibull Model
  * 12.3.3 Log-Normal and Log-Logistic Models
  * 12.3.4 Generalised Gamma Model
  * 12.3.5 Accelerated Failure Time Models
* 12.4 Semi-Parametric Models
  * 12.4.1 Cox Proportional Hazards Model
  * 12.4.2 Stratified Cox Model
  * 12.4.3 Time-Dependent Covariates
  * 12.4.4 Testing Proportional Hazards Assumption
  * 12.4.5 Residuals and Diagnostics
* 12.5 Extensions and Advanced Topics
  * 12.5.1 Frailty Models
  * 12.5.2 Recurrent Event Analysis
  * 12.5.3 Competing Risks Analysis
  * 12.5.4 Multi-State Models
  * 12.5.5 Joint Models for Longitudinal and Survival Data

## Chapter 13: Statistical Learning and Prediction
* 13.1 Foundations of Statistical Learning
  * 13.1.1 Supervised vs. Unsupervised Learning
  * 13.1.2 Training, Validation, and Test Sets
  * 13.1.3 Bias-Variance Tradeoff
  * 13.1.4 Model Assessment and Selection
* 13.2 Resampling Methods
  * 13.2.1 Cross-Validation
    * 13.2.1.1 k-Fold Cross-Validation
    * 13.2.1.2 Leave-One-Out Cross-Validation
    * 13.2.1.3 Repeated k-Fold Cross-Validation
  * 13.2.2 Bootstrap Methods
  * 13.2.3 Permutation Tests
* 13.3 Regularisation Methods
  * 13.3.1 Ridge Regression
  * 13.3.2 Lasso Regression
  * 13.3.3 Elastic Net
  * 13.3.4 Group Lasso
  * 13.3.5 Adaptive Lasso
* 13.4 Tree-Based Methods
  * 13.4.1 Decision Trees
  * 13.4.2 Bagging
  * 13.4.3 Random Forests
  * 13.4.4 Boosting Methods
    * 13.4.4.1 AdaBoost
    * 13.4.4.2 Gradient Boosting
    * 13.4.4.3 XGBoost
  * 13.4.5 Variable Importance Measures
* 13.5 Support Vector Machines
  * 13.5.1 Linear SVMs
  * 13.5.2 Kernel Methods
  * 13.5.3 Multi-Class SVMs
  * 13.5.4 Support Vector Regression
* 13.6 Neural Networks and Deep Learning
  * 13.6.1 Feedforward Neural Networks
  * 13.6.2 Backpropagation
  * 13.6.3 Regularisation in Neural Networks
  * 13.6.4 Convolutional Neural Networks
  * 13.6.5 Recurrent Neural Networks
* 13.7 Unsupervised Learning Methods
  * 13.7.1 Principal Components Analysis
  * 13.7.2 Non-Negative Matrix Factorisation
  * 13.7.3 Independent Component Analysis
  * 13.7.4 t-SNE and UMAP for Visualisation
  * 13.7.5 Self-Organising Maps
* 13.8 Model Evaluation
  * 13.8.1 Classification Metrics
    * 13.8.1.1 Confusion Matrix
    * 13.8.1.2 Precision, Recall, and F1 Score
    * 13.8.1.3 ROC Curves and AUC
    * 13.8.1.4 Lift and Gain Charts
  * 13.8.2 Regression Metrics
    * 13.8.2.1 MSE, RMSE, MAE
    * 13.8.2.2 R² and Adjusted R²
    * 13.8.2.3 Prediction Intervals
  * 13.8.3 Calibration Assessment
  * 13.8.4 Cost-Sensitive Evaluation

## Chapter 14: Causal Inference
* 14.1 Foundational Concepts
  * 14.1.1 The Potential Outcomes Framework
  * 14.1.2 Causal Graphs and Directed Acyclic Graphs
  * 14.1.3 Confounding and Selection Bias
  * 14.1.4 The Backdoor Criterion
* 14.2 Experimental Designs
  * 14.2.1 Randomised Controlled Trials
  * 14.2.2 Blocked and Stratified Designs
  * 14.2.3 Factorial Designs
  * 14.2.4 Crossover Designs
* 14.3 Estimation of Causal Effects
  * 14.3.1 Average Treatment Effects
  * 14.3.2 Conditional Average Treatment Effects
  * 14.3.3 Quantile Treatment Effects
  * 14.3.4 Local Average Treatment Effects
* 14.4 Observational Study Methods
  * 14.4.1 Matching Methods
    * 14.4.1.1 Propensity Score Matching
    * 14.4.1.2 Coarsened Exact Matching
    * 14.4.1.3 Genetic Matching
  * 14.4.2 Inverse Probability Weighting
  * 14.4.3 Doubly Robust Estimation
  * 14.4.4 Regression Discontinuity Design
  * 14.4.5 Difference-in-Differences
  * 14.4.6 Instrumental Variables
  * 14.4.7 Synthetic Control Methods
* 14.5 Mediation Analysis
  * 14.5.1 Baron and Kenny Approach
  * 14.5.2 Causal Mediation Analysis
  * 14.5.3 Multiple Mediators
  * 14.5.4 Sensitivity Analysis
* 14.6 Advanced Topics in Causal Inference
  * 14.6.1 Time-Varying Treatments
  * 14.6.2 Interference and Spillover Effects
  * 14.6.3 Principal Stratification
  * 14.6.4 Sensitivity Analysis for Unobserved Confounding

## Chapter 15: Statistical Applications in Bioinformatics
* 15.1 Statistical Genetics
  * 15.1.1 Linkage Analysis
  * 15.1.2 Genome-Wide Association Studies
    * 15.1.2.1 Multiple Testing Correction
    * 15.1.2.2 Population Stratification
    * 15.1.2.3 Quantile-Quantile Plots
  * 15.1.3 Haplotype Analysis
  * 15.1.4 Gene-Environment Interactions
* 15.2 Next-Generation Sequencing Analysis
  * 15.2.1 Quality Control and Preprocessing
  * 15.2.2 Alignment Statistics
  * 15.2.3 Variant Calling and Annotation
  * 15.2.4 Structural Variant Detection
* 15.3 RNA-Seq Analysis
  * 15.3.1 Count Data Normalisation
  * 15.3.2 Differential Expression Analysis
    * 15.3.2.1 edgeR Methodology
    * 15.3.2.2 DESeq2 Methodology
    * 15.3.2.3 Limma-Voom Methodology
  * 15.3.3 Gene Set Enrichment Analysis
  * 15.3.4 RNA-Seq Visualisation Methods
* 15.4 Single-Cell RNA-Seq Analysis
  * 15.4.1 Quality Control and Filtering
  * 15.4.2 Normalisation Methods
  * 15.4.3 Dimensionality Reduction
  * 15.4.4 Clustering Approaches
  * 15.4.5 Trajectory Inference
  * 15.4.6 Differential Expression in scRNA-Seq
* 15.5 Proteomics and Metabolomics
  * 15.5.1 Mass Spectrometry Data Analysis
  * 15.5.2 Peptide Identification and Quantification
  * 15.5.3 Differential Abundance Analysis
  * 15.5.4 Pathway Analysis
* 15.6 Microbiome Analysis
  * 15.6.1 16S rRNA Sequencing Analysis
  * 15.6.2 Taxonomic Classification
  * 15.6.3 Alpha and Beta Diversity
  * 15.6.4 Differential Abundance Testing
* 15.7 Phylogenetic Analysis
  * 15.7.1 Distance-Based Methods
  * 15.7.2 Maximum Likelihood Methods
  * 15.7.3 Bayesian Phylogenetics
  * 15.7.4 Phylogenetic Comparative Methods

## Chapter 16: Statistical Applications in Finance
* 16.1 Financial Time Series Analysis
  * 16.1.1 Stylised Facts of Financial Returns
  * 16.1.2 ARCH and GARCH Models
  * 16.1.3 Multivariate GARCH Models
  * 16.1.4 Jump Diffusion Models
  * 16.1.5 Stochastic Volatility Models
* 16.2 Asset Pricing Models
  * 16.2.1 Capital Asset Pricing Model
  * 16.2.2 Arbitrage Pricing Theory
  * 16.2.3 Factor Models
  * 16.2.4 Testing Asset Pricing Models
* 16.3 Portfolio Theory
  * 16.3.1 Mean-Variance Optimisation
  * 16.3.2 Efficient Frontier
  * 16.3.3 Risk Measures
    * 16.3.3.1 Value at Risk
    * 16.3.3.2 Expected Shortfall
    * 16.3.3.3 Drawdown Measures
  * 16.3.4 Performance Metrics
    * 16.3.4.1 Sharpe Ratio
    * 16.3.4.2 Sortino Ratio
    * 16.3.4.3 Information Ratio
* 16.4 Option Pricing Models
  * 16.4.1 Black-Scholes-Merton Model
  * 16.4.2 Binomial Trees
  * 16.4.3 Monte Carlo Methods
  * 16.4.4 Implied Volatility Surface
* 16.5 Fixed Income Analysis
  * 16.5.1 Term Structure Models
  * 16.5.2 Yield Curve Fitting
  * 16.5.3 Credit Risk Models
  * 16.5.4 Duration and Convexity Analysis
* 16.6 High-Frequency Trading
  * 16.6.1 Market Microstructure
  * 16.6.2 Order Book Dynamics
  * 16.6.3 Statistical Arbitrage
  * 16.6.4 Pairs Trading
* 16.7 Risk Management
  * 16.7.1 Credit Risk Modelling
  * 16.7.2 Operational Risk
  * 16.7.3 Market Risk
  * 16.7.4 Stress Testing and Scenario Analysis

## Chapter 17: Advanced Statistical Topics
* 17.1 Missing Data Methods
  * 17.1.1 Missing Data Mechanisms
  * 17.1.2 Complete Case Analysis
  * 17.1.3 Multiple Imputation
  * 17.1.4 EM Algorithm
  * 17.1.5 Sensitivity Analysis for Missing Data
* 17.2 Spatial Statistics
  * 17.2.1 Spatial Point Processes
  * 17.2.2 Spatial Autocorrelation
  * 17.2.3 Kriging and Spatial Prediction
  * 17.2.4 Spatial Regression Models
  * 17.2.5 Spatiotemporal Models
* 17.3 Functional Data Analysis
  * 17.3.1 Basis Function Representation
  * 17.3.2 Functional Principal Components
  * 17.3.3 Functional Regression
  * 17.3.4 Clustering Functional Data
* 17.4 Extreme Value Theory
  * 17.4.1 Block Maxima Approach
  * 17.4.2 Peaks Over Threshold
  * 17.4.3 Multivariate Extreme Value Theory
  * 17.4.4 Applications in Risk Management
* 17.5 Stochastic Processes
  * 17.5.1 Markov Chains
  * 17.5.2 Poisson Processes
  * 17.5.3 Brownian Motion
  * 17.5.4 Lévy Processes
  * 17.5.5 Hawkes Processes
* 17.6 High-Dimensional Statistics
  * 17.6.1 Multiple Testing Procedures
  * 17.6.2 False Discovery Rate Control
  * 17.6.3 Sparse Estimation
  * 17.6.4 Covariance Estimation
* 17.7 Robust Statistics
  * 17.7.1 Influence Functions
  * 17.7.2 Breakdown Points
  * 17.7.3 M-Estimators
  * 17.7.4 Robust Multivariate Methods
* 17.8 Statistical Process Control
  * 17.8.1 Control Charts
  * 17.8.2 Process Capability Analysis
  * 17.8.3 Multivariate Control Charts
  * 17.8.4 Sequential Change-Point Detection

## Chapter 18: Computational Statistics
* 18.1 Monte Carlo Methods
  * 18.1.1 Monte Carlo Integration
  * 18.1.2 Importance Sampling
  * 18.1.3 Variance Reduction Techniques
  * 18.1.4 Sequential Monte Carlo
* 18.2 Bootstrapping and Resampling
  * 18.2.1 Non-Parametric Bootstrap
  * 18.2.2 Parametric Bootstrap
  * 18.2.3 Block Bootstrap for Dependent Data
  * 18.2.4 Bootstrap Confidence Intervals
    * 18.2.4.1 Percentile Method
    * 18.2.4.2 BCa Method
    * 18.2.4.3 Studentized Bootstrap
  * 18.2.5 Bootstrap Hypothesis Testing
* 18.3 Numerical Optimisation
  * 18.3.1 Gradient-Based Methods
    * 18.3.1.1 Newton-Raphson Method
    * 18.3.1.2 Quasi-Newton Methods
    * 18.3.1.3 Conjugate Gradient
  * 18.3.2 Derivative-Free Methods
    * 18.3.2.1 Nelder-Mead Simplex
    * 18.3.2.2 Simulated Annealing
    * 18.3.2.3 Genetic Algorithms
  * 18.3.3 Constrained Optimisation
  * 18.3.4 Optimisation for Statistical Modelling
* 18.4 Expectation-Maximisation Algorithm
  * 18.4.1 EM for Mixture Models
  * 18.4.2 EM for Hidden Markov Models
  * 18.4.3 EM for Factor Analysis
  * 18.4.4 Convergence Properties and Diagnostics
* 18.5 Approximate Bayesian Computation
  * 18.5.1 Rejection Sampling
  * 18.5.2 MCMC-Based ABC
  * 18.5.3 Sequential ABC
  * 18.5.4 Applications in Complex Models
* 18.6 Particle Filters
  * 18.6.1 Sequential Importance Sampling
  * 18.6.2 Resampling Strategies
  * 18.6.3 Particle Smoothing
  * 18.6.4 Applications in State Space Models
* 18.7 Algorithmic Differentiation
  * 18.7.1 Forward Mode
  * 18.7.2 Reverse Mode
  * 18.7.3 Applications in Optimisation
  * 18.7.4 Implementation in R

## Chapter 19: Statistical Applications in Complex Systems
* 19.1 Network Analysis
  * 19.1.1 Graph Theory Fundamentals
  * 19.1.2 Network Metrics and Centrality Measures
  * 19.1.3 Community Detection Algorithms
  * 19.1.4 Statistical Models for Networks
    * 19.1.4.1 Exponential Random Graph Models
    * 19.1.4.2 Stochastic Block Models
    * 19.1.4.3 Latent Space Models
  * 19.1.5 Temporal Network Analysis
* 19.2 Text Mining and Natural Language Processing
  * 19.2.1 Text Preprocessing and Tokenisation
  * 19.2.2 Term-Document Matrices
  * 19.2.3 Topic Modelling
    * 19.2.3.1 Latent Dirichlet Allocation
    * 19.2.3.2 Structural Topic Models
  * 19.2.4 Sentiment Analysis
  * 19.2.5 Word Embeddings
* 19.3 Spatial Point Processes
  * 19.3.1 Complete Spatial Randomness
  * 19.3.2 Inhomogeneous Poisson Processes
  * 19.3.3 Cluster Processes
  * 19.3.4 Marked Point Processes
  * 19.3.5 Spatiotemporal Point Processes
* 19.4 Complex Survey Analysis
  * 19.4.1 Sampling Designs and Weights
  * 19.4.2 Variance Estimation for Complex Surveys
  * 19.4.3 Poststratification and Calibration
  * 19.4.4 Small Area Estimation
  * 19.4.5 Handling Missing Data in Surveys
* 19.5 Signal Processing
  * 19.5.1 Time-Frequency Analysis
  * 19.5.2 Wavelets
  * 19.5.3 Digital Filters
  * 19.5.4 Change Point Detection
  * 19.5.5 Applications in Physiological Data

## Chapter 20: Statistics for Decision Making
* 20.1 Decision Theory
  * 20.1.1 Loss Functions
  * 20.1.2 Risk and Expected Utility
  * 20.1.3 Minimax and Bayes Decision Rules
  * 20.1.4 Sequential Decision Problems
* 20.2 Bandit Algorithms
  * 20.2.1 Exploration-Exploitation Tradeoff
  * 20.2.2 Multi-Armed Bandit Algorithms
    * 20.2.2.1 Upper Confidence Bound
    * 20.2.2.2 Thompson Sampling
    * 20.2.2.3 Bayesian Bandits
  * 20.2.3 Contextual Bandits
  * 20.2.4 Applications in A/B Testing
* 20.3 Experimental Design for Decision Making
  * 20.3.1 Sequential Experimental Design
  * 20.3.2 Response Surface Methodology
  * 20.3.3 Multi-Objective Optimisation
  * 20.3.4 Batch Bayesian Optimisation
* 20.4 Statistical Process Control and Monitoring
  * 20.4.1 Control Charts and Decision Rules
  * 20.4.2 Multivariate Process Monitoring
  * 20.4.3 Adaptive Sampling Plans
  * 20.4.4 Early Warning Systems
* 20.5 Statistical Analysis for Ethics and Fairness
  * 20.5.1 Quantifying Algorithmic Bias
  * 20.5.2 Fairness Metrics and Tradeoffs
  * 20.5.3 Causal Approaches to Fairness
  * 20.5.4 Transparency and Interpretability Methods

## Appendices
* Appendix A: Mathematical Foundations
  * A.1 Linear Algebra Review
  * A.2 Calculus Review
  * A.3 Optimisation Methods
  * A.4 Numerical Methods

* Appendix B: Probability Distributions
  * B.1 Discrete Distributions
  * B.2 Continuous Distributions
  * B.3 Multivariate Distributions
  * B.4 Sampling from Distributions in R

* Appendix C: Statistical Tables
  * C.1 Standard Normal Distribution
  * C.2 t-Distribution
  * C.3 F-Distribution
  * C.4 Chi-Square Distribution

* Appendix D: R Best Practices
  * D.1 Efficient R Programming
  * D.2 Parallel Computing in R
  * D.3 Big Data Techniques in R
  * D.4 Creating R Packages

* Appendix E: Data Sources
  * E.1 Public Datasets for Statistics
  * E.2 Financial Data Sources
  * E.3 Bioinformatics Data Repositories
  * E.4 Simulating Realistic Data

* Appendix F: Reproducible Research
  * F.1 Literate Programming with R Markdown
  * F.2 Version Control with Git
  * F.3 Docker Containers for Reproducible Environments
  * F.4 Research Compendia Structure
  * F.5 Continuous Integration for Statistical Analysis

* Appendix G: Case Studies
  * G.1 Bioinformatics Case Study: Differential Gene Expression Analysis
    * G.1.1 Data Preprocessing and Quality Control
    * G.1.2 Exploratory Data Analysis
    * G.1.3 Statistical Testing and Multiple Comparison Correction
    * G.1.4 Biological Interpretation
    * G.1.5 Results Reporting and Visualisation
  * G.2 Finance Case Study: Portfolio Optimisation
    * G.2.1 Data Collection and Cleaning
    * G.2.2 Return and Risk Estimation
    * G.2.3 Covariance Matrix Estimation and Shrinkage
    * G.2.4 Optimisation Algorithms
    * G.2.5 Backtesting and Performance Evaluation
  * G.3 Environmental Science Case Study: Climate Data Analysis
    * G.3.1 Spatiotemporal Data Handling
    * G.3.2 Trend Detection and Seasonal Decomposition
    * G.3.3 Extreme Value Analysis
    * G.3.4 Spatial Correlation and Mapping
  * G.4 Social Science Case Study: Survey Data Analysis
    * G.4.1 Survey Design and Sampling Considerations
    * G.4.2 Weighting and Calibration
    * G.4.3 Missing Data Treatment
    * G.4.4 Latent Variable Modelling
    * G.4.5 Multi-level Modelling for Hierarchical Data

* Appendix H: Performance Optimisation
  * H.1 Benchmarking R Code
  * H.2 Memory Management in R
  * H.3 Vectorisation Techniques
  * H.4 Parallel Processing
    * H.4.1 Multicore Processing with parallel
    * H.4.2 Distributed Computing with future
    * H.4.3 GPU Acceleration
  * H.5 C++ Integration with Rcpp
  * H.6 Database Connections for Large Datasets

* Appendix I: Interactive Applications
  * I.1 Shiny for Interactive Statistical Applications
  * I.2 Interactive Visualisations with plotly and htmlwidgets
  * I.3 Interactive Reports with flexdashboard
  * I.4 Deploying Statistical Applications

* Appendix J: Glossary of Statistical Terms

* Appendix K: Statistical Formulae Reference
  * K.1 Descriptive Statistics
  * K.2 Probability Distributions
  * K.3 Statistical Tests
  * K.4 Regression Models
  * K.5 Multivariate Statistics
  * K.6 Time Series Analysis

* Online Resources and Companion Materials
  * Code Repository Access
  * Datasets
  * Additional Exercises and Solutions
  * Updates and Corrections
  * Community Discussion Forum

* Index