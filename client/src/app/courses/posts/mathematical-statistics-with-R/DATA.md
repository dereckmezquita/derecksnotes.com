# Mathematical Statistics with R — Dataset Documentation

All datasets used across the three books are stored in a shared `data/` directory. We use a combination of real-world CSV files and R package datasets. Real data is preferred; simulated data is used only when a specific distribution or property must be demonstrated.

**Total: 49 CSV files + R package datasets**

---

## Directory Structure

```
mathematical-statistics-with-R/
├── DATA.md                              # This file
├── data/                                # Shared datasets
│   ├── primary/                         # Core teaching datasets (5 files)
│   ├── classic/                         # Classic R/ML datasets (14 files)
│   ├── medical/                         # Clinical trial datasets (14 files)
│   ├── count/                           # Count regression datasets (11 files)
│   ├── survival/                        # Survival analysis datasets (5 files)
│   ├── download_all.R                   # Master download script
│   ├── download_primary.R               # NHANES, penguins, gapminder
│   ├── download_classic.R               # iris, mtcars, Boston, etc.
│   ├── download_medical.R               # medicaldata package
│   ├── download_shared_datasets.R       # Count, time-series, etc.
│   └── download_survival.R              # Survival analysis data
├── mathematical-statistics-1-foundations/
├── mathematical-statistics-2-advanced/   # Planned
└── mathematical-statistics-3-research/   # Planned
```

---

## Usage in Rmd Files

From any Rmd file in the course, load data with relative paths:

```r
box::use(data.table[fread])

# From src/01-describing-data/
nhanes <- fread("../../../data/primary/nhanes.csv")
penguins <- fread("../../../data/primary/penguins.csv")
```

---

## Download Scripts

```bash
# Download everything
Rscript data/download_all.R

# Or individual categories
Rscript data/download_primary.R
Rscript data/download_classic.R
Rscript data/download_medical.R
Rscript data/download_shared_datasets.R
Rscript data/download_survival.R
```

---

## Data Strategy

### Guiding Principles

1. **Real data first** — every chapter uses at least one real dataset with a compelling question
2. **Simulated data for proofs** — when demonstrating a theoretical property (CLT, convergence, sampling distributions), simulate in-chapter with `set.seed()`
3. **Build familiarity** — a few "anchor" datasets recur across chapters so readers build deep familiarity
4. **Diverse domains** — health, ecology, economics, sports — so no reader feels excluded

### Anchor Datasets

These datasets appear in multiple chapters and form the backbone of the course:

| Dataset | Domain | Why it anchors |
|---------|--------|----------------|
| `penguins.csv` | Ecology | Clean, 3 species, continuous + categorical. Descriptive stats through ANOVA |
| `nhanes.csv` | Public health | 10K observations, 76 variables. Estimation through logistic regression |
| `gapminder.csv` | Global development | Country-level, temporal. Regression, visualisation |
| `birthwt.csv` | Medicine | Binary outcome (low birth weight). Logistic regression |
| `insurance_claims.csv` | Actuarial | Count data. Poisson and negative binomial |

### R Package Datasets (No CSV Needed)

Some datasets are best accessed directly from R packages:

| Package | Dataset | Used In |
|---------|---------|---------|
| `datasets` (base R) | `faithful` | Ch.3, 5 — bimodal distribution, estimation |
| `datasets` (base R) | `PlantGrowth` | Ch.18 — one-way ANOVA |
| `datasets` (base R) | `ToothGrowth` | Ch.18 — two-way ANOVA |
| `MASS` | `cats` | Ch.15 — simple linear regression |
| `MASS` | `Insurance` | Ch.21 — count models |

---

# Chapter-Dataset Mapping

## Part I: Foundations

### Chapter 1: Describing Data
| Dataset | File | Purpose |
|---------|------|---------|
| Palmer Penguins | `primary/penguins.csv` | Central tendency, spread, shape for bill/flipper measurements by species |
| NHANES | `primary/nhanes.csv` | Large dataset for visualisation: BMI, blood pressure, age distributions |
| + Simulated | In-chapter | Small crafted examples to show when mean vs median diverge |

### Chapter 2: Probability
| Dataset | File | Purpose |
|---------|------|---------|
| NHANES | `primary/nhanes.csv` | Empirical conditional probability: P(Diabetes | Obese), P(High BP | Age > 60) |
| + Simulated | In-chapter | Dice, cards, urns for counting and Bayes' theorem |

### Chapter 3: Random Variables
| Dataset | File | Purpose |
|---------|------|---------|
| Old Faithful | `datasets::faithful` (R) | Bimodal waiting times — natural example of a non-normal distribution |
| NHANES | `primary/nhanes.csv` | BMI as a continuous RV, demonstrate PDF/CDF empirically |
| + Simulated | In-chapter | Heavily simulated — demonstrating PMFs, PDFs, expectation, MGFs |

### Chapter 4: Discrete Distributions
| Dataset | File | Purpose |
|---------|------|---------|
| Epilepsy Seizures | `count/epilepsy_seizures.csv` | Real count data — compare to Poisson model |
| Insurance Claims | `count/insurance_claims.csv` | Real count data — motivate Poisson |
| + Simulated | In-chapter | Coin flips (binomial), defect counts (Poisson), card draws (hypergeometric) |

### Chapter 5: Continuous Distributions
| Dataset | File | Purpose |
|---------|------|---------|
| NHANES | `primary/nhanes.csv` | Heights ~ normal, blood pressure ~ normal, BMI ~ skewed |
| Air Quality | `classic/airquality.csv` | Ozone ~ right-skewed, motivates log-normal |
| + Simulated | In-chapter | Heavy simulation for deriving chi-square, t, F from normal |

### Chapter 6: Joint Distributions
| Dataset | File | Purpose |
|---------|------|---------|
| Palmer Penguins | `primary/penguins.csv` | Bill length vs flipper length — bivariate, conditional on species |
| NHANES | `primary/nhanes.csv` | Height vs weight — bivariate normal approximation |
| + Simulated | In-chapter | Multivariate normal simulation |

---

## Part II: Inference

### Chapter 7: Convergence and Limit Theorems
| Dataset | File | Purpose |
|---------|------|---------|
| + Simulated | In-chapter | Almost entirely simulation-based: demonstrate LLN, CLT, convergence modes |
| NHANES | `primary/nhanes.csv` | Sample from real population to show CLT with real (non-normal) data |

### Chapter 8: Point Estimation
| Dataset | File | Purpose |
|---------|------|---------|
| NHANES | `primary/nhanes.csv` | Estimate population mean BMI, compare MOM vs MLE |
| Palmer Penguins | `primary/penguins.csv` | MLE for species proportions, flipper length distribution |
| + Simulated | In-chapter | Likelihood surfaces, Cramer-Rao demonstrations |

### Chapter 9: Interval Estimation
| Dataset | File | Purpose |
|---------|------|---------|
| NHANES | `primary/nhanes.csv` | CIs for mean blood pressure, proportion with diabetes |
| Streptomycin TB Trial | `medical/strep_tb.csv` | CI for treatment effect proportion — historic data |
| + Simulated | In-chapter | Coverage simulations, Wald vs Wilson comparison |

### Chapter 10: Hypothesis Testing — Framework
| Dataset | File | Purpose |
|---------|------|---------|
| + Simulated | In-chapter | P-value simulation under null, power curves |
| Scurvy Trial | `medical/scurvy.csv` | The first clinical trial — motivate the testing framework historically |

### Chapter 11: Classical Tests
| Dataset | File | Purpose |
|---------|------|---------|
| Palmer Penguins | `primary/penguins.csv` | Two-sample t-test (Adelie vs Gentoo flipper length) |
| Streptomycin TB Trial | `medical/strep_tb.csv` | Chi-square test of independence (treatment vs outcome) |
| NHANES | `primary/nhanes.csv` | Paired-style comparisons, proportion tests |
| Cats (MASS) | `classic/cats.csv` | F-test for variance (heart weight by sex) |

### Chapter 12: Multiple Testing
| Dataset | File | Purpose |
|---------|------|---------|
| + Simulated | In-chapter | Simulate false discovery accumulation |
| NHANES | `primary/nhanes.csv` | Test 20 health outcomes simultaneously — demonstrate the problem |

### Chapter 13: Nonparametric Methods
| Dataset | File | Purpose |
|---------|------|---------|
| Palmer Penguins | `primary/penguins.csv` | Permutation test and bootstrap for species differences |
| Scurvy Trial | `medical/scurvy.csv` | Small sample — exact/permutation methods more appropriate than t-test |
| + Simulated | In-chapter | Bootstrap distribution demonstrations |

---

## Part III: Modelling

### Chapter 14: Linear Algebra for Statistics
| Dataset | File | Purpose |
|---------|------|---------|
| + Simulated | In-chapter | Small numeric examples for matrix operations, projection |

### Chapter 15: Simple Linear Regression
| Dataset | File | Purpose |
|---------|------|---------|
| Cats (MASS) | `classic/cats.csv` | Heart weight vs body weight — clean simple regression |
| Gapminder | `primary/gapminder.csv` | GDP per capita vs life expectancy — compelling visual |
| Palmer Penguins | `primary/penguins.csv` | Bill length vs bill depth — Simpson's paradox when ignoring species |

### Chapter 16: Multiple Linear Regression
| Dataset | File | Purpose |
|---------|------|---------|
| NHANES | `primary/nhanes.csv` | Predict BMI from age, physical activity, income, etc. |
| mtcars | `classic/mtcars.csv` | Classic: predict mpg from weight, cylinders, etc. — multicollinearity |

### Chapter 17: Regression Diagnostics
| Dataset | File | Purpose |
|---------|------|---------|
| NHANES | `primary/nhanes.csv` | Diagnostic plots on the Ch.16 BMI model |
| Boston Housing | `classic/boston.csv` | Heteroscedasticity, influential observations |
| + Simulated | In-chapter | Construct specific violations to show what diagnostics catch |

### Chapter 18: Analysis of Variance
| Dataset | File | Purpose |
|---------|------|---------|
| Palmer Penguins | `primary/penguins.csv` | One-way ANOVA: flipper length by species |
| PlantGrowth | `datasets::PlantGrowth` (R) | Classic one-way ANOVA |
| ToothGrowth | `datasets::ToothGrowth` (R) | Two-way ANOVA: supplement type x dose |
| NHANES | `primary/nhanes.csv` | ANCOVA: blood pressure by age group, adjusting for BMI |

### Chapter 19: GLM Framework
| Dataset | File | Purpose |
|---------|------|---------|
| Birth Weight | `classic/birthwt.csv` | Motivate: binary outcome can't be modelled with linear regression |
| Insurance Claims | `count/insurance_claims.csv` | Motivate: count outcome can't be modelled with linear regression |
| + Simulated | In-chapter | Exponential family demonstrations |

### Chapter 20: Logistic Regression
| Dataset | File | Purpose |
|---------|------|---------|
| Birth Weight | `classic/birthwt.csv` | Low birth weight risk factors — the primary logistic regression dataset |
| Heart Disease | `classic/heart_disease.csv` | Predict heart disease from risk factors |
| Indo RCT | `medical/indo_rct.csv` | RCT with binary outcome — treatment effect estimation |

### Chapter 21: Poisson and Count Models
| Dataset | File | Purpose |
|---------|------|---------|
| Insurance Claims | `count/insurance_claims.csv` | Poisson regression primary example |
| Biochemist Publications | `count/biochemist_publications.csv` | Overdispersion — motivates negative binomial |
| Ships Damage | `count/ships_damage.csv` | Offsets — different exposure periods |
| Epilepsy Seizures | `count/epilepsy_seizures.csv` | Overdispersion, zero-inflation |

---

## Part IV: Bayesian Foundations

### Chapter 22: Bayesian Thinking
| Dataset | File | Purpose |
|---------|------|---------|
| Scurvy Trial | `medical/scurvy.csv` | Bayesian analysis of treatment effect with informative prior |
| NHANES | `primary/nhanes.csv` | Estimate diabetes prevalence with prior from literature |
| + Simulated | In-chapter | Conjugate analysis demonstrations |

### Chapter 23: Computational Bayesian Methods
| Dataset | File | Purpose |
|---------|------|---------|
| Birth Weight | `classic/birthwt.csv` | Bayesian logistic regression via MCMC |
| + Simulated | In-chapter | MCMC convergence demonstrations, Gibbs sampling |

---

## Part V: Design and Practice

### Chapter 24: Experimental Design
| Dataset | File | Purpose |
|---------|------|---------|
| Streptomycin TB Trial | `medical/strep_tb.csv` | Exemplar of a well-designed RCT |
| Scurvy Trial | `medical/scurvy.csv` | The first clinical trial — discuss design principles |
| Licorice Gargle | `medical/licorice_gargle.csv` | Modern RCT design example |

### Chapter 25: Bringing It Together
| Dataset | File | Purpose |
|---------|------|---------|
| NHANES | `primary/nhanes.csv` | Full analysis: exploration → regression → diagnostics → interpretation |
| Framingham (if available) | TBD | Full analysis: logistic regression → ROC → Bayesian comparison |

---

# Dataset Catalogue

## primary/ (5 files)

### penguins.csv / penguins_raw.csv
| Field | Value |
|-------|-------|
| **Rows** | 344 (penguins), 344 (penguins_raw) |
| **Variables** | 8 (species, island, bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g, sex, year) |
| **Source** | palmerpenguins R package (Dr. Kristen Gorman, Palmer Station LTER) |
| **Licence** | CC0 (public domain) |
| **Used in** | Chapters 1, 6, 8, 11, 13, 15, 18 |

### nhanes.csv / nhanes_raw.csv
| Field | Value |
|-------|-------|
| **Rows** | ~10,000 (nhanes), ~20,000 (nhanes_raw) |
| **Variables** | 76 |
| **Source** | NHANES R package (CDC data, cycles 2009-2012) |
| **Licence** | Public domain (US government) |
| **Used in** | Chapters 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 16, 17, 18, 22, 25 |

### gapminder.csv
| Field | Value |
|-------|-------|
| **Rows** | 1,704 |
| **Variables** | 6 (country, continent, year, lifeExp, pop, gdpPercap) |
| **Source** | gapminder R package (Gapminder Foundation) |
| **Licence** | CC-BY |
| **Used in** | Chapters 15 |

## classic/ (14 files)

| File | Rows | Description | Key chapters |
|------|------|-------------|--------------|
| `airquality.csv` | 153 | New York air quality 1973 | Ch.5 (skewed distributions) |
| `birthwt.csv` | 189 | Low birth weight risk factors | Ch.19, 20, 23 (logistic regression) |
| `boston.csv` | 506 | Boston housing prices | Ch.17 (diagnostics) |
| `cats.csv` | 144 | Cat heart and body weight | Ch.11, 15 (t-test, regression) |
| `heart_disease.csv` | 303 | Heart disease predictors | Ch.20 (logistic regression) |
| `mtcars.csv` | 32 | Motor Trend car data | Ch.16 (multiple regression) |
| `iris.csv` | 150 | Fisher's iris measurements | — (available but penguins preferred) |
| `diabetes.csv` | 442 | Diabetes progression | — (backup) |
| `toothgrowth.csv` | 60 | Vitamin C on tooth growth | Ch.18 (two-way ANOVA) |
| `chickweight.csv` | 578 | Chick weights over time | — (backup) |
| `bacteria.csv` | 220 | Bacteria after drug treatment | — (backup, Book II) |
| `pima_tr.csv` / `pima_te.csv` | 532 | Pima diabetes (use with care) | — (backup) |
| `usarrests.csv` | 50 | US state arrest rates | — (backup, PCA in Book II) |

## medical/ (14 files)

| File | Rows | Description | Key chapters |
|------|------|-------------|--------------|
| `scurvy.csv` | 12 | Lind's 1757 scurvy trial | Ch.10, 13, 22, 24 |
| `strep_tb.csv` | 107 | 1948 streptomycin TB trial | Ch.9, 11, 24 |
| `indo_rct.csv` | 602 | Indomethacin RCT | Ch.20 |
| `licorice_gargle.csv` | 236 | Licorice gargle RCT | Ch.24 |
| `blood_storage.csv` | 316 | Blood storage and cancer | — (Book II, survival) |
| `polyps.csv` | 20 | Colon polyps treatment | — (backup, count models) |
| `laryngoscope.csv` | 99 | Intubation methods RCT | — (backup) |
| Others | — | Additional medical datasets | — (available for exercises) |

## count/ (11 files)

| File | Rows | Description | Key chapters |
|------|------|-------------|--------------|
| `insurance_claims.csv` | 64 | Insurance claims by group | Ch.4, 19, 21 |
| `biochemist_publications.csv` | 915 | Academic publication counts | Ch.21 (overdispersion) |
| `ships_damage.csv` | 34 | Ship damage incidents | Ch.21 (offsets) |
| `epilepsy_seizures.csv` | 236 | Seizure counts, treatment trial | Ch.4, 21 |
| `horseshoe_crabs.csv` | 173 | Crab satellite males | — (backup) |
| Others | — | Additional count datasets | — (exercises) |

## survival/ (5 files)

| File | Rows | Description | Key chapters |
|------|------|-------------|--------------|
| `lung.csv` | 228 | NCCTG lung cancer survival | — (Book II) |
| `colon.csv` | 1,858 | Colon cancer treatment | — (Book II) |
| `pbc.csv` | 418 | Primary biliary cholangitis | — (Book II) |
| `ovarian.csv` | 26 | Ovarian cancer | — (Book II) |
| `veteran.csv` | 137 | Veteran's lung cancer | — (Book II) |

*Note: Survival datasets are included for completeness but are primarily used in Book II (Advanced). They are available for exercises in Book I Chapter 25.*

---

## Ethical Notes

- **Boston Housing (`boston.csv`)**: Contains a variable (B) constructed from racial demographics. We use this dataset for regression diagnostics only, not as an example of good modelling practice. The variable is discussed critically.
- **Pima Diabetes (`pima_tr.csv`, `pima_te.csv`)**: Collected from the Pima people of Arizona. Use with awareness of the context — a community with disproportionately high diabetes rates due to historical and systemic factors.

---

## Licence Summary

| Licence | Datasets |
|---------|----------|
| Public domain (US gov) | NHANES, NHANES raw |
| CC0 | Palmer Penguins |
| CC-BY | Gapminder |
| GPL | MASS datasets (cats, birthwt, Insurance, etc.) |
| Various open | medicaldata package datasets |
