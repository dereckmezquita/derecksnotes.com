# Introduction to Statistics with R  
**(Focusing on Base R and data.table)**

## Preface and Orientation
- 1.1 Purpose and Scope of the Book
- 1.2 Intended Audience and Prerequisites
- 1.3 Structure and Organisation of the Text
- 1.4 Conventions and Notation
- 1.5 Obtaining and Installing R (and RStudio or Other IDEs)
- 1.6 Additional Resources and Suggested Readings

---

## Part I: Foundations

### Chapter 2: Approaches to R Programming
- 2.1 A Brief History of R
- 2.2 Ecosystem Overview: CRAN, Bioconductor, GitHub
- 2.3 R Programming Philosophies  
  - 2.3.1 Base R as a Foundational Tool  
  - 2.3.2 data.table for High-Performance Data Manipulation  
  - 2.3.3 A Note on Tidyverse and Why We Focus on data.table Instead
- 2.4 Coding Practices: Style, Organisation, and Project Structure
- 2.5 File Input/Output and Working Directories
- 2.6 Reproducible Research with R Markdown and Quarto

### Chapter 3: Data Structures and Core Workflow
- 3.1 Vectors, Matrices, and Arrays in Base R
- 3.2 Lists, Data Frames, and Introducing data.table
- 3.3 Factors and Categorical Variables
- 3.4 Dates, Times, and Character Encoding
- 3.5 Data Import and Export: CSV, Excel, Databases, and APIs
- 3.6 Data Cleaning and Transformation with Base R and data.table
- 3.7 Efficient Data Aggregation and Reshaping (melt, dcast in data.table)
- 3.8 Memory and Performance Considerations in Data Wrangling

---

## Part II: Descriptive Statistics and Exploratory Data Analysis

### Chapter 4: Summarising Data
- 4.1 Central Tendency: Mean, Median, Mode
- 4.2 Variability: Variance, Standard Deviation, IQR
- 4.3 Distribution Shape: Skewness, Kurtosis
- 4.4 Summaries by Group and Cross-Tabulations (data.table by-group operations)
- 4.5 Advanced Data Summaries and Custom Functions in data.table

### Chapter 5: Exploratory Data Analysis (EDA)
- 5.1 Principles of EDA
- 5.2 Univariate Exploration: Histograms, Density Plots, Boxplots
- 5.3 Bivariate Exploration: Scatterplots, Correlation Analysis
- 5.4 Multidimensional EDA: Pairwise Plots, Parallel Coordinates
- 5.5 Identifying Outliers, Missing Data, and Anomalies
- 5.6 Exploratory Model Building and Hypothesis Generation

### Chapter 6: Data Visualisation with ggplot2
- 6.1 Understanding the Grammar of Graphics
- 6.2 Core Geometric Objects and Aesthetics
- 6.3 Scales, Coordinate Systems, and Facets for Complex Displays
- 6.4 Themes, Labels, and Custom Formatting for Publication-Quality Graphics
- 6.5 Integrating ggplot2 with data.table for Efficient Data Pipelines
- 6.6 Extending ggplot2 with Additional Layers, Stats, and Packages  
- 6.7 Interactive and Animated Visualisations for Enhanced Communication
- 6.8 Communicating Results Effectively: Visual Best Practices

---

## Part III: Probability and Distributions

### Chapter 7: Probability Fundamentals
- 7.1 Basic Probability Rules and Concepts
- 7.2 Conditional Probability and Bayes’ Theorem
- 7.3 Random Variables, Expectation, and Variance
- 7.4 Joint, Marginal, and Conditional Distributions
- 7.5 The Law of Large Numbers and Central Limit Theorem

### Chapter 8: Probability Distributions
- 8.1 Key Discrete Distributions (Bernoulli, Binomial, Poisson)
- 8.2 Key Continuous Distributions (Uniform, Normal, Exponential, Gamma)
- 8.3 t, Chi-Square, and F Distributions
- 8.4 Working with Distribution Functions in Base R (d/p/q/r Functions)
- 8.5 Mixture Distributions and Advanced Parametric Families
- 8.6 Generating Random Numbers and Simulating Data with Base R

---

## Part IV: Statistical Inference

### Chapter 9: Estimation Techniques
- 9.1 Populations vs. Samples
- 9.2 Point and Interval Estimation
- 9.3 Bias, Variance, and Efficiency of Estimators
- 9.4 Maximum Likelihood Estimation Using Base R Tools
- 9.5 Method of Moments and Bayesian Estimation (Conceptual Overview)
- 9.6 Resampling Methods: Bootstrap and Jackknife

### Chapter 10: Hypothesis Testing
- 10.1 Null and Alternative Hypotheses
- 10.2 Type I and II Errors, Power, and Sample Size
- 10.3 z-tests, t-tests, Paired Tests, and Non-Parametric Alternatives
- 10.4 ANOVA and Its Non-Parametric Counterparts
- 10.5 Multiple Comparisons, p-Adjustments, and Post-Hoc Analyses
- 10.6 Goodness-of-Fit Tests: Chi-Square, Kolmogorov-Smirnov

---

## Part V: Regression and Linear Models

### Chapter 11: Linear Regression in Base R
- 11.1 The Linear Model Framework (lm)
- 11.2 Ordinary Least Squares Estimation and Interpretation
- 11.3 Model Diagnostics: Residuals, Influential Points
- 11.4 Assessing Model Fit: R², Adjusted R², AIC
- 11.5 Variable Selection and Model Building Strategies
- 11.6 Integrating data.table for Efficient Data Prep in Regression Workflows

### Chapter 12: Generalised Linear Models (GLMs)
- 12.1 Exponential Family Distributions and Link Functions
- 12.2 Logistic Regression for Binary Outcomes
- 12.3 Poisson, Negative Binomial for Count Data
- 12.4 Multinomial and Ordinal Logistic Models
- 12.5 Diagnostics, Residual Checks, and Goodness-of-Fit
- 12.6 data.table Pipelines for Large GLM Datasets

### Chapter 13: Mixed-Effects and Hierarchical Models
- 13.1 Fixed vs. Random Effects: Conceptual Overview
- 13.2 Linear Mixed-Effects Models (lme4 and Base R Approaches)
- 13.3 Generalised Linear Mixed Models
- 13.4 Hierarchical Modelling and Partial Pooling
- 13.5 Efficient Data Preparation for Complex Models (data.table)

---

## Part VI: Advanced Topics in Modelling

### Chapter 14: Nonlinear and Nonparametric Models
- 14.1 Nonlinear Regression (nls)
- 14.2 Smoothing Splines, Local Polynomial Regression (loess)
- 14.3 Kernel Density and Regression Estimators
- 14.4 Quantile Regression and Robust Regression

### Chapter 15: Survival Analysis
- 15.1 Concepts: Censoring, Survival Functions, Hazard Functions
- 15.2 Kaplan-Meier Estimation and Log-Rank Tests
- 15.3 Cox Proportional Hazards Models
- 15.4 Parametric Survival Models (Weibull, Exponential)
- 15.5 Handling Large Survival Datasets with data.table

### Chapter 16: Multivariate Methods
- 16.1 Principal Component Analysis (PCA) and Extensions
- 16.2 Factor Analysis and Dimension Reduction
- 16.3 Cluster Analysis: Hierarchical and K-means
- 16.4 Multidimensional Scaling and Advanced Embedding Methods
- 16.5 data.table for Efficient Data Manipulation in High-Dimensional Settings

### Chapter 17: Bayesian Statistics (Introduction)
- 17.1 Bayesian Concepts: Priors, Posteriors, Credible Intervals
- 17.2 Simple Bayesian Models Using Base R and External Packages
- 17.3 Markov Chain Monte Carlo (MCMC) Basics
- 17.4 Posterior Predictive Checks and Diagnostics
- 17.5 Integrating Bayesian Analysis with data.table Preprocessing

---

## Part VII: Additional Analytical Approaches

### Chapter 18: Time Series Analysis
- 18.1 Stationarity, Autocorrelation, Partial Autocorrelation
- 18.2 ARIMA and Related Models (Base R’s `arima` Function)
- 18.3 Seasonality and Trend Decomposition
- 18.4 Forecasting and Prediction Intervals
- 18.5 Data Handling for Large Time Series with data.table

### Chapter 19: Nonparametric Methods
- 19.1 Nonparametric Density Estimation
- 19.2 Rank-Based Tests (Wilcoxon, Mann-Whitney)
- 19.3 Permutation and Bootstrap Testing
- 19.4 Working with data.table for Efficient Nonparametric Analysis

### Chapter 20: Machine Learning Methods in Base R
- 20.1 Overview of Supervised and Unsupervised Methods
- 20.2 Regularisation: Ridge, Lasso (glmnet)
- 20.3 Tree-Based Methods: CART, Random Forests, Gradient Boosting
- 20.4 Support Vector Machines and Simple Neural Networks in R
- 20.5 Model Evaluation: Cross-Validation, ROC Curves, AUC
- 20.6 Leveraging data.table for Feature Engineering and Data Prep

---

## Part VIII: Applications, Best Practices, and Extensions

### Chapter 21: Experimental Design and ANOVA Extensions
- 21.1 Principles of Experimental Design
- 21.2 Factorial and Block Designs
- 21.3 Repeated Measures and Mixed-Design ANOVAs
- 21.4 Power Analysis and Sample Size Calculations

### Chapter 22: Handling Large and Complex Data
- 22.1 Memory and Speed Considerations
- 22.2 Parallel Computing and High-Performance R (parallel, future)
- 22.3 Big Data Tools: data.table for Large Datasets, arrow for Disk Storage
- 22.4 Integration with Spark and Other External Systems

### Chapter 23: Simulation Studies and Resampling
- 23.1 Monte Carlo Simulations
- 23.2 Bootstrap Resampling for Inference
- 23.3 Permutation Tests and Randomisation Approaches
- 23.4 Designing Simulation Experiments Efficiently with data.table

### Chapter 24: Reproducible Workflows and Reporting
- 24.1 Version Control (Git, GitHub)
- 24.2 Make-Like Pipelines (drake, targets)
- 24.3 R Markdown and Quarto for Dynamic Documents
- 24.4 Building R Packages for Reproducible Research
- 24.5 Deploying Interactive Apps (Shiny) for Results Communication

---

## Part IX: Special Topics and Emerging Trends

### Chapter 25: Spatial and Spatio-Temporal Analysis
- 25.1 GIS in R: sf and raster Packages
- 25.2 Spatial Autocorrelation, Kriging, and Interpolation
- 25.3 Spatio-Temporal Modelling and Large Spatial Data Handling
- 25.4 Integrating data.table for Efficient Geo-Data Wrangling

### Chapter 26: Functional and Longitudinal Data Analysis
- 26.1 Functional Data Concepts
- 26.2 Functional Regression and Functional PCA
- 26.3 Longitudinal Data Analysis and Mixed Models for Repeated Measures
- 26.4 Handling Time-Dependent Covariates Efficiently

### Chapter 27: Advanced Bayesian Hierarchical Models
- 27.1 Hierarchical GLMs and Partial Pooling
- 27.2 Bayesian Nonparametrics (Dirichlet Processes)
- 27.3 Gaussian Process Regression
- 27.4 Scaling Bayesian Models with data.table for Preprocessing

### Chapter 28: Causal Inference and Policy Evaluation
- 28.1 The Counterfactual Framework
- 28.2 Propensity Score Matching and Weighting
- 28.3 Instrumental Variables and Regression Discontinuity
- 28.4 Difference-in-Differences and Synthetic Control Methods
- 28.5 Using data.table to Prep Large Observational Datasets

---

## Appendices

### Appendix A: Mathematical Foundations
- A.1 Review of Matrix Algebra
- A.2 Calculus and Optimisation for Statistics
- A.3 Core Probability Theory Recap
- A.4 Essentials of Discrete and Continuous Mathematics

### Appendix B: R Essentials
- B.1 Useful Base R Functions and Tips
- B.2 Debugging, Profiling, and Benchmarking R Code
- B.3 Extending R with C++ via Rcpp
- B.4 Fine-Tuning R Environments and Startup Configurations

### Appendix C: Software and Tooling
- C.1 IDEs and Editors (RStudio, VS Code)
- C.2 Automated Reporting and Document Generation
- C.3 Containerisation and Cloud Computing with R (Docker)
- C.4 Working with APIs and Web Data Sources

### Appendix D: Datasets and Data Sources
- D.1 Built-in R Datasets
- D.2 Public Data Repositories and APIs
- D.3 data.table Demonstrations with Large Public Datasets
- D.4 Ethical Considerations, Data Privacy, and Licensing

**Glossary**  
**References**  
**Index**