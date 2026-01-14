# Statistics with R: Course Data Documentation

This document describes all datasets used throughout the three-level Statistics with R course series. These datasets have been carefully selected to provide cohesive examples that build upon each other across all course levels.

---

## Quick Setup

Install all required R packages with a single command:

```r
install.packages(c(
    # Core data packages
    "NHANES",
    "medicaldata",
    "palmerpenguins",
    "gapminder",

    # Additional teaching packages
    "survival",      # Includes veteran, ovarian, lung datasets
    "MASS",          # Includes Boston, birthwt, etc.

    # Required for course code
    "data.table",
    "ggplot2",
    "box"
))
```

Verify installation:

```r
# Test that all datasets load correctly
library(NHANES)
library(medicaldata)
library(palmerpenguins)
library(gapminder)
library(survival)
library(MASS)

# Quick check
cat("NHANES:", nrow(NHANES), "observations,", ncol(NHANES), "variables\n")
cat("penguins:", nrow(penguins), "observations,", ncol(penguins), "variables\n")
cat("gapminder:", nrow(gapminder), "observations,", ncol(gapminder), "variables\n")
```

---

## Primary Datasets

### 1. NHANES (National Health and Nutrition Examination Survey)

**Source:** CRAN package `NHANES`
**Reference:** https://cran.r-project.org/package=NHANES

**Description:**
The NHANES package contains a curated subset of data from the US National Health and Nutrition Examination Survey (2009-2012). This dataset provides a rich collection of health, demographic, and lifestyle variables suitable for teaching virtually every statistical concept.

**Dataset Details:**

| Property | Value |
|----------|-------|
| Observations | 10,000 |
| Variables | 75 |
| Source Years | 2009-2010, 2011-2012 |
| Population | US civilian non-institutionalised population |

**Key Variable Categories:**

1. **Demographics:** Age, Gender, Race1, Race3, Education, MaritalStatus, HHIncome, Poverty
2. **Body Measurements:** Height, Weight, BMI, BMI_WHO, BMICatUnder20yrs, HeadCirc, Length
3. **Blood Pressure:** BPSysAve, BPDiaAve (systolic and diastolic averages)
4. **Lab Values:** TotChol, DirectChol, Diabetes, UrineVol1, UrineFlow1
5. **Lifestyle:** PhysActive, PhysActiveDays, TVHrsDay, CompHrsDay, Alcohol12PlusYr, SmokeNow, Smoke100
6. **Sleep:** SleepHrsNight, SleepTrouble
7. **Sexual Health:** SexEver, SexAge, SexNumPartYear, SexOrientation, PregnantNow

**Usage in Course:**

```r
library(NHANES)
data(NHANES)

# Convert to data.table for course exercises
library(data.table)
nhanes <- as.data.table(NHANES)

# Example: Variable types demonstration
str(nhanes[, .(Age, Gender, Race1, BMI, Diabetes)])
```

**Course Applications:**
- **Level 1 (Foundations):** Variable types, descriptive statistics, visualisation, sampling, basic inference
- **Level 2 (Intermediate):** Multiple regression, logistic regression, ANOVA, model diagnostics
- **Level 3 (Advanced):** Complex survey analysis, multilevel models, machine learning applications

**Important Note:**
This dataset has been adapted for educational purposes and should NOT be used for research publications. For research, download original data from the CDC NHANES website.

---

### 2. medicaldata Package

**Source:** CRAN package `medicaldata`
**Reference:** https://higgi13425.github.io/medicaldata/
**Maintainer:** Peter Higgins (University of Michigan)

**Description:**
A collection of 19 medical datasets specifically curated for teaching biostatistics and reproducible medical research. Includes both historical landmark trials and contemporary clinical data.

#### 2.1 scurvy — James Lind's 1757 Scurvy Trial

**Historical Significance:** The first controlled clinical trial in medical history.

| Property | Value |
|----------|-------|
| Observations | 12 |
| Variables | 8 |
| Year | 1757 |
| Design | Randomised controlled trial |

**Variables:**
- `study_id`: Subject identifier
- `treatment`: One of six treatments (cider, dilute_sulfuric_acid, vinegar, sea_water, citrus, purgative_mixture)
- `dosing_regimen_for_scurvy`: Dosing instructions
- `gum_rot_d6`: Gum rot severity at day 6 (ordinal: 0-3)
- `skin_sores_d6`: Skin sores severity at day 6 (ordinal: 0-3)
- `weakness_of_knees_d6`: Knee weakness at day 6 (ordinal: 0-3)
- `lassitude_d6`: Fatigue at day 6 (ordinal: 0-3)
- `fit_for_duty_d6`: Fit for duty status (0_no, 1_yes)

**Course Applications:**
- Small sample analysis
- Ordinal data handling
- Historical perspective on clinical trials
- Non-parametric methods

#### 2.2 strep_tb — 1948 Streptomycin Tuberculosis Trial

**Historical Significance:** First double-blind randomised controlled trial (RCT) using modern methodology.

| Property | Value |
|----------|-------|
| Observations | 107 |
| Variables | 13 |
| Year | 1948 |
| Design | Double-blind RCT |

**Variables:**
- `patient_id`: Subject identifier
- `arm`: Treatment arm (Control, Streptomycin)
- `dose_strep_g`: Streptomycin dose in grams
- `dose_PAS_g`: Para-aminosalicylic acid dose
- `gender`: M/F
- `baseline_condition`: Condition at baseline
- `baseline_temp`: Temperature at baseline
- `baseline_esr`: Erythrocyte sedimentation rate
- `baseline_cavitation`: Lung cavitation status
- `strep_resistance`: Developed streptomycin resistance
- `radiologic_6m`: Radiological outcome at 6 months
- `rad_num`: Numeric radiological score
- `improved`: Binary improvement indicator

**Course Applications:**
- Two-sample hypothesis testing
- Chi-square tests
- Binary outcomes
- Treatment effect estimation
- Intention-to-treat analysis

#### 2.3 blood_storage — Prostate Cancer Cohort Study

| Property | Value |
|----------|-------|
| Observations | 316 |
| Variables | 20 |
| Design | Retrospective cohort |

**Description:**
Data from men who underwent radical prostatectomy with blood transfusion. Examines whether RBC storage duration affects cancer recurrence.

**Key Variables:**
- `RBC.Age.Group`: RBC storage duration (Younger, Middle, Older)
- `Recurrence`: PSA recurrence indicator
- `TimeToRecurrence`: Time to biochemical recurrence
- `Age`, `TVol`, `bGS`: Demographic and tumour characteristics
- `PreopPSA`: Preoperative PSA level

**Course Applications:**
- Survival analysis basics
- Cox proportional hazards
- Kaplan-Meier curves
- Multiple regression with time-to-event outcomes

#### 2.4 covid_testing — SARS-CoV2 Testing Data (2020)

| Property | Value |
|----------|-------|
| Observations | ~15,000 |
| Variables | 17 |
| Setting | Pediatric hospital (CHOP) |
| Period | Days 4-107 of pandemic |

**Key Variables:**
- `subject_id`: Patient identifier
- `pan_day`: Pandemic day
- `test_id`: Test identifier
- `age`, `gender`, `demo_group`: Demographics
- `result`: Test result (positive/negative)
- `col_rec_tat`: Collection to result turnaround time
- `rec_ver_tat`: Receipt to verification turnaround time

**Course Applications:**
- Large sample statistics
- Missing data handling
- Time series patterns
- Categorical data analysis
- Real-world messy data experience

#### 2.5 Other medicaldata Datasets

| Dataset | n | Description | Primary Use |
|---------|---|-------------|-------------|
| `cytomegalovirus` | 64 | CMV in bone marrow transplant | Survival analysis |
| `esoph_ca` | 88 | Esophageal cancer case-control | Logistic regression |
| `indo_rct` | 602 | Indomethacin RCT for pancreatitis | Binary outcomes, RCT analysis |
| `laryngoscope` | 99 | Laryngoscope comparison trial | Paired comparisons |
| `licorice_gargle` | 236 | Licorice for sore throat RCT | Continuous outcomes |
| `opt` | 823 | Periodontal treatment in pregnancy | Complex trial designs |
| `polyps` | 22 | Familial adenomatous polyposis | Repeated measures |
| `smartpill` | 428 | GI motility measurements | Multivariate analysis |
| `supraclavicular` | 103 | Nerve block study | Equivalence testing |
| `theoph` | 132 | Theophylline pharmacokinetics | Nonlinear models |
| `indometh` | 66 | Indomethacin pharmacokinetics | Longitudinal data |

**Access All Datasets:**

```r
library(medicaldata)

# List all available datasets
data(package = "medicaldata")

# Load specific datasets
data(scurvy)
data(strep_tb)
data(blood_storage)
data(covid_testing)
```

---

### 3. palmerpenguins — Penguin Morphometric Data

**Source:** CRAN package `palmerpenguins`
**Reference:** https://allisonhorst.github.io/palmerpenguins/
**Citation:** Horst AM, Hill AP, Gorman KB (2020)

**Description:**
Modern replacement for the iris dataset, containing morphometric measurements of three penguin species from the Palmer Archipelago, Antarctica. Preferred over iris due to: better documentation, intuitive variables, presence of missing values (realistic!), unequal group sizes, and no historical connection to eugenics research.

| Property | Value |
|----------|-------|
| Observations | 344 |
| Variables | 8 |
| Species | 3 (Adelie, Chinstrap, Gentoo) |
| Islands | 3 (Biscoe, Dream, Torgersen) |
| Years | 2007-2009 |

**Variables:**
- `species`: Penguin species (Adelie, Chinstrap, Gentoo)
- `island`: Island of collection (Biscoe, Dream, Torgersen)
- `bill_length_mm`: Bill length in millimetres
- `bill_depth_mm`: Bill depth in millimetres
- `flipper_length_mm`: Flipper length in millimetres
- `body_mass_g`: Body mass in grams
- `sex`: Penguin sex (male, female)
- `year`: Year of observation

**Course Applications:**
- **Level 1:** Variable types, descriptive statistics, grouped summaries, basic visualisation
- **Level 2:** ANOVA, regression, classification
- **Level 3:** Clustering, PCA, discriminant analysis

**Usage:**

```r
library(palmerpenguins)

# Two datasets available:
# penguins - curated dataset (recommended)
# penguins_raw - full raw dataset

data(penguins)
str(penguins)

# Note: Contains missing values (realistic!)
sum(is.na(penguins))  # 19 missing values
```

---

### 4. gapminder — Global Development Statistics

**Source:** CRAN package `gapminder`
**Reference:** https://www.gapminder.org/
**Original Data:** Gapminder.org (Hans Rosling)

**Description:**
Excerpt of global development data for 142 countries from 1952 to 2007, including life expectancy, GDP per capita, and population. Famous for Hans Rosling's TED talks and ideal for teaching data visualisation and longitudinal analysis.

| Property | Value |
|----------|-------|
| Observations | 1,704 |
| Variables | 6 |
| Countries | 142 |
| Continents | 5 |
| Time Span | 1952-2007 (5-year intervals) |

**Variables:**
- `country`: Country name (142 levels)
- `continent`: Continent (Africa, Americas, Asia, Europe, Oceania)
- `year`: Year of observation (1952, 1957, ..., 2007)
- `lifeExp`: Life expectancy at birth (years)
- `pop`: Population
- `gdpPercap`: GDP per capita (international dollars, 2005 PPP)

**Course Applications:**
- Time series visualisation
- Panel/longitudinal data
- Grouped analyses
- Animated visualisations
- Simpson's paradox examples

**Usage:**

```r
library(gapminder)
data(gapminder)

# Example: Life expectancy trends
library(ggplot2)
ggplot(gapminder, aes(x = year, y = lifeExp, group = country)) +
    geom_line(alpha = 0.3) +
    facet_wrap(~continent)
```

---

## Supplementary Datasets (Built-in R Packages)

### 5. survival Package Datasets

**Source:** Base R package `survival`

These datasets are essential for teaching survival analysis in Level 2 and Level 3:

#### 5.1 veteran — Veterans' Administration Lung Cancer

| Property | Value |
|----------|-------|
| Observations | 137 |
| Variables | 8 |
| Design | Randomised trial |

**Variables:** trt, celltype, time, status, karno, diagtime, age, prior

**Course Use:** Cox regression, Kaplan-Meier, proportional hazards

#### 5.2 ovarian — Ovarian Cancer Survival

| Property | Value |
|----------|-------|
| Observations | 26 |
| Variables | 6 |
| Design | Clinical trial |

**Course Use:** Small sample survival analysis, parametric survival models

#### 5.3 lung — NCCTG Lung Cancer

| Property | Value |
|----------|-------|
| Observations | 228 |
| Variables | 10 |

**Course Use:** Survival analysis with covariates, model building

**Access:**

```r
library(survival)
data(veteran)
data(ovarian)
data(lung)
```

---

### 6. MASS Package Datasets

**Source:** Base R package `MASS` (Modern Applied Statistics with S)

#### 6.1 birthwt — Risk Factors for Low Birth Weight

| Property | Value |
|----------|-------|
| Observations | 189 |
| Variables | 10 |

**Variables:** low, age, lwt, race, smoke, ptl, ht, ui, ftv, bwt

**Course Use:** Logistic regression, risk factors analysis

#### 6.2 Boston — Housing Values in Boston Suburbs

| Property | Value |
|----------|-------|
| Observations | 506 |
| Variables | 14 |

**Course Use:** Multiple regression, multicollinearity, model selection

#### 6.3 cats — Anatomical Data from Domestic Cats

| Property | Value |
|----------|-------|
| Observations | 144 |
| Variables | 3 |

**Course Use:** Simple linear regression, correlation

---

## Dataset Usage by Course Level

### Level 1: Foundations

| Chapter | Primary Dataset(s) | Alternative |
|---------|-------------------|-------------|
| 1. Introduction | NHANES | penguins |
| 2. Descriptive Numerical | NHANES, blood_storage | gapminder |
| 3. Visualisation | NHANES, gapminder, penguins | covid_testing |
| 4. Probability | Simulated, scurvy | strep_tb |
| 5. Distributions | Simulated, NHANES | - |
| 6. Sampling/CLT | Simulated from NHANES | - |
| 7. Point Estimation | NHANES | penguins |
| 8. Confidence Intervals | NHANES, strep_tb | - |
| 9-10. Hypothesis Testing | strep_tb, NHANES | indo_rct |
| 11. Chi-square/Non-parametric | scurvy, strep_tb | - |
| 12. Regression | NHANES, penguins | Boston, cats |
| 13. ANOVA | NHANES, penguins | - |
| 14. Experimental Design | scurvy, strep_tb | indo_rct |
| 15. Multiple Testing | covid_testing | - |

### Level 2: Intermediate

| Topic | Primary Dataset(s) |
|-------|-------------------|
| Multiple Regression | NHANES, Boston |
| Logistic Regression | NHANES, birthwt, strep_tb |
| GLMs | NHANES, covid_testing |
| Mixed Effects Models | polyps, smartpill |
| Survival Analysis | blood_storage, veteran, lung |
| Time Series | gapminder, covid_testing |

### Level 3: Advanced

| Topic | Primary Dataset(s) |
|-------|-------------------|
| Bayesian Statistics | NHANES, strep_tb |
| Machine Learning | NHANES, penguins |
| Causal Inference | strep_tb, indo_rct |
| High-dimensional Data | Simulated, NHANES subsets |
| Complex Surveys | NHANESraw (with weights) |

---

## Data Quality Considerations

### Missing Values by Dataset

| Dataset | Missing Values | Strategy |
|---------|---------------|----------|
| NHANES | Many (realistic) | Complete case or imputation |
| penguins | 19 | Teaching opportunity |
| gapminder | None | Clean for beginners |
| scurvy | None | Clean historical data |
| strep_tb | Minimal | Complete case acceptable |
| covid_testing | Present | Real-world messiness |
| blood_storage | Some | Teaching imputation |

### Sample Size Considerations

| Size Category | Datasets | Teaching Purpose |
|---------------|----------|------------------|
| Small (n < 50) | scurvy, ovarian, polyps | Small sample methods |
| Medium (50-500) | strep_tb, blood_storage, penguins, veteran | Standard methods |
| Large (500-5000) | gapminder, indo_rct | Asymptotic theory |
| Very Large (>5000) | NHANES, covid_testing | Computational methods |

---

## Simulated Data Guidelines

For certain teaching purposes, we generate simulated data with controlled properties:

```r
# Example: Simulating data for CLT demonstration
set.seed(42)  # Always set seed for reproducibility

# Population with known parameters
population <- rexp(100000, rate = 0.5)  # Exponential, mean = 2

# Sampling distribution of the mean
n_samples <- 10000
sample_size <- 30
sample_means <- replicate(n_samples, mean(sample(population, sample_size)))

# sample_means should be approximately normal (CLT)
```

**When to Use Simulated Data:**
1. Demonstrating theoretical concepts (CLT, sampling distributions)
2. Creating data with specific properties (exact normality, known parameters)
3. Generating examples with controlled effect sizes
4. Teaching power analysis concepts
5. Creating exam/exercise datasets

---

## Ethical and Legal Considerations

### Data Licensing

| Dataset | License | Attribution Required |
|---------|---------|---------------------|
| NHANES | Public Domain (CDC) | Yes (for publications) |
| medicaldata | MIT | Yes |
| palmerpenguins | CC-0 | Yes (recommended) |
| gapminder | CC-BY | Yes |
| survival (veteran, etc.) | Part of R | Citation recommended |

### Appropriate Use

1. **Educational Use:** All datasets are appropriate for classroom teaching
2. **Research Use:** NHANES (educational version) should NOT be used for research publications; download original data from CDC
3. **Commercial Use:** Check individual package licenses
4. **Student Projects:** All datasets suitable with proper attribution

---

## Troubleshooting

### Common Installation Issues

```r
# If NHANES fails to install
install.packages("NHANES", dependencies = TRUE)

# If medicaldata needs update
install.packages("remotes")
remotes::install_github("higgi13425/medicaldata")

# Check package versions
packageVersion("NHANES")      # Should be >= 2.1.0
packageVersion("medicaldata") # Should be >= 0.2.0
```

### Memory Considerations

```r
# For large datasets, use data.table
library(data.table)
nhanes_dt <- as.data.table(NHANES::NHANES)

# Check object sizes
format(object.size(nhanes_dt), units = "MB")
```

---

## References and Further Reading

### Dataset Documentation

- **NHANES:** https://cran.r-project.org/package=NHANES
- **medicaldata:** https://higgi13425.github.io/medicaldata/
- **palmerpenguins:** https://allisonhorst.github.io/palmerpenguins/
- **gapminder:** https://www.gapminder.org/

### Original Data Sources

- **CDC NHANES:** https://www.cdc.gov/nchs/nhanes/
- **WHO GHO:** https://www.who.int/data/gho
- **NHLBI BioLINCC:** https://biolincc.nhlbi.nih.gov/teaching/

### Teaching Statistics Resources

- CRAN Task View: Teaching Statistics — https://cran.r-project.org/view=TeachingStatistics
- CAUSE Web TSHS Portal — https://causeweb.org/tshs/

---

## Version Information

| Item | Version/Date |
|------|--------------|
| Document Version | 1.0 |
| Last Updated | January 2026 |
| Tested R Version | 4.3+ |
| Course | Statistics with R (Levels 1-3) |

---

*This document was prepared for the Statistics with R course series at derecksnotes.com.*
