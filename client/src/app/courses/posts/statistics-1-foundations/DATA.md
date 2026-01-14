# Statistics with R: Course Data Documentation

This document describes all datasets used throughout the three-level Statistics with R course series. These datasets have been carefully selected to provide cohesive examples that build upon each other across all course levels, with a strong focus on medical, health, and bioinformatics applications.

---

## Data Acquisition

All datasets have been downloaded as CSV files using the `src/data/download_datasets.R` script. This script:

1. Installs required R packages (`NHANES`, `medicaldata`, `palmerpenguins`, `gapminder`, `survival`, `MASS`, `data.table`)
2. Extracts datasets from these packages
3. Saves them as CSV files for offline use and version control
4. Organises files into three subdirectories: `primary/`, `medical/`, and `supplementary/`

**To regenerate all datasets:**

```r
# From the statistics-1-foundations directory
setwd("path/to/statistics-1-foundations")
source("src/data/download_datasets.R")
```

**Dataset Summary:**

| Category | Count | Total Size |
|----------|-------|------------|
| Primary | 5 | ~7.9 MB |
| Medical | 15 | ~2.2 MB |
| Supplementary | 19 | ~0.3 MB |
| **Total** | **39** | **~10.4 MB** |

---

## Primary Datasets (`src/data/primary/`)

### 1. NHANES — National Health and Nutrition Examination Survey

**Files:** `nhanes.csv` (2.6 MB), `nhanes_raw.csv` (5.1 MB)
**Source:** CRAN package `NHANES` (CDC data from 2009-2012)
**Reference:** https://cran.r-project.org/package=NHANES

| Property | nhanes.csv | nhanes_raw.csv |
|----------|------------|----------------|
| Observations | 10,000 | 20,293 |
| Variables | 76 | 78 |
| Population | US civilian non-institutionalised |

**Description:**
A curated subset of data from the US National Health and Nutrition Examination Survey. This comprehensive health survey provides demographic, physical examination, laboratory, and questionnaire data suitable for teaching virtually every statistical concept.

**Key Variables (76 total):**

| Category | Variables |
|----------|-----------|
| Demographics | `ID`, `SurveyYr`, `Gender`, `Age`, `AgeDecade`, `AgeMonths`, `Race1`, `Race3`, `Education`, `MaritalStatus` |
| Socioeconomic | `HHIncome`, `HHIncomeMid`, `Poverty`, `HomeRooms`, `HomeOwn`, `Work` |
| Body Measurements | `Weight`, `Height`, `BMI`, `BMI_WHO`, `BMICatUnder20yrs`, `Length`, `HeadCirc` |
| Blood Pressure | `Pulse`, `BPSysAve`, `BPDiaAve`, `BPSys1`, `BPDia1`, `BPSys2`, `BPDia2`, `BPSys3`, `BPDia3` |
| Lab Values | `Testosterone`, `DirectChol`, `TotChol`, `UrineVol1`, `UrineFlow1`, `UrineVol2`, `UrineFlow2` |
| Health Status | `Diabetes`, `DiabetesAge`, `HealthGen`, `DaysPhysHlthBad`, `DaysMentHlthBad` |
| Mental Health | `LittleInterest`, `Depressed` |
| Reproductive | `nPregnancies`, `nBabies`, `Age1stBaby`, `PregnantNow` |
| Sleep | `SleepHrsNight`, `SleepTrouble` |
| Physical Activity | `PhysActive`, `PhysActiveDays`, `TVHrsDay`, `CompHrsDay` |
| Substance Use | `Alcohol12PlusYr`, `AlcoholDay`, `AlcoholYear`, `SmokeNow`, `Smoke100`, `Smoke100n`, `SmokeAge`, `Marijuana`, `AgeFirstMarij`, `HardDrugs` |
| Sexual Health | `SexEver`, `SexAge`, `SexNumPartnLife`, `SexNumPartYear`, `SameSex`, `SexOrientation` |

**Sample Data:**

```
ID,SurveyYr,Gender,Age,AgeDecade,Race1,BMI,BPSysAve,BPDiaAve,Diabetes,...
51624,2009_10,male,34,30-39,White,32.22,113,85,No,...
51625,2009_10,male,4,0-9,Other,15.3,NA,NA,No,...
51630,2009_10,female,49,40-49,White,30.57,112,75,No,...
```

**Course Applications:**
- Level 1: Variable types, descriptive statistics, visualisation, sampling, basic inference
- Level 2: Multiple regression, logistic regression, ANOVA, model diagnostics
- Level 3: Complex survey analysis, multilevel models, machine learning

---

### 2. Palmer Penguins — Penguin Morphometric Data

**Files:** `penguins.csv` (15 KB), `penguins_raw.csv` (51 KB)
**Source:** CRAN package `palmerpenguins`
**Reference:** https://allisonhorst.github.io/palmerpenguins/
**Citation:** Horst AM, Hill AP, Gorman KB (2020)

| Property | penguins.csv | penguins_raw.csv |
|----------|--------------|------------------|
| Observations | 344 | 344 |
| Variables | 8 | 17 |
| Species | 3 (Adelie, Chinstrap, Gentoo) |
| Islands | 3 (Biscoe, Dream, Torgersen) |
| Years | 2007-2009 |

**Description:**
Modern replacement for the iris dataset, containing morphometric measurements of three penguin species from the Palmer Archipelago, Antarctica. Preferred over iris due to better documentation, intuitive variables, realistic missing values, unequal group sizes, and no historical connection to eugenics research.

**Variables (penguins.csv):**

| Variable | Type | Description |
|----------|------|-------------|
| `species` | Factor | Adelie, Chinstrap, Gentoo |
| `island` | Factor | Biscoe, Dream, Torgersen |
| `bill_length_mm` | Numeric | Bill length in millimetres |
| `bill_depth_mm` | Numeric | Bill depth in millimetres |
| `flipper_length_mm` | Integer | Flipper length in millimetres |
| `body_mass_g` | Integer | Body mass in grams |
| `sex` | Factor | male, female |
| `year` | Integer | Year of observation (2007-2009) |

**Sample Data:**

```
species,island,bill_length_mm,bill_depth_mm,flipper_length_mm,body_mass_g,sex,year
Adelie,Torgersen,39.1,18.7,181,3750,male,2007
Adelie,Torgersen,39.5,17.4,186,3800,female,2007
Adelie,Torgersen,40.3,18,195,3250,female,2007
```

**Note:** Contains 19 missing values (realistic for teaching missing data handling).

---

### 3. Gapminder — Global Development Statistics

**File:** `gapminder.csv` (80 KB)
**Source:** CRAN package `gapminder`
**Reference:** https://www.gapminder.org/
**Original Data:** Gapminder.org (Hans Rosling)

| Property | Value |
|----------|-------|
| Observations | 1,704 |
| Variables | 6 |
| Countries | 142 |
| Continents | 5 (Africa, Americas, Asia, Europe, Oceania) |
| Time Span | 1952-2007 (5-year intervals) |

**Description:**
Excerpt of global development data for 142 countries from 1952 to 2007. Made famous by Hans Rosling's TED talks, ideal for teaching data visualisation and longitudinal analysis.

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `country` | Factor | Country name (142 levels) |
| `continent` | Factor | Africa, Americas, Asia, Europe, Oceania |
| `year` | Integer | Year of observation (1952, 1957, ..., 2007) |
| `lifeExp` | Numeric | Life expectancy at birth (years) |
| `pop` | Integer | Population |
| `gdpPercap` | Numeric | GDP per capita (2005 international dollars, PPP) |

**Sample Data:**

```
country,continent,year,lifeExp,pop,gdpPercap
Afghanistan,Asia,1952,28.801,8425333,779.4453145
Afghanistan,Asia,1957,30.332,9240934,820.8530296
Albania,Europe,1952,55.23,1282697,1601.056136
```

---

## Medical Datasets (`src/data/medical/`)

These datasets are from the `medicaldata` R package, specifically curated for teaching biostatistics and reproducible medical research. They include both historical landmark trials and contemporary clinical data.

### 1. scurvy — James Lind's 1757 Scurvy Trial

**File:** `scurvy.csv` (1.3 KB)
**Historical Significance:** The first controlled clinical trial in medical history.

| Property | Value |
|----------|-------|
| Observations | 12 |
| Variables | 8 |
| Year | 1757 |
| Design | Randomised controlled trial |

**Description:**
Data from James Lind's famous scurvy trial aboard HMS Salisbury. Twelve sailors with scurvy were divided into six groups of two, each receiving a different treatment. This trial established citrus fruit as a cure for scurvy.

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `study_id` | Character | Subject identifier (001-012) |
| `treatment` | Factor | cider, dilute_sulfuric_acid, vinegar, sea_water, citrus, purgative_mixture |
| `dosing_regimen_for_scurvy` | Character | Detailed dosing instructions |
| `gum_rot_d6` | Ordinal | Gum rot severity at day 6 (0_none to 3_severe) |
| `skin_sores_d6` | Ordinal | Skin sores severity at day 6 |
| `weakness_of_the_knees_d6` | Ordinal | Knee weakness at day 6 |
| `lassitude_d6` | Ordinal | Fatigue at day 6 |
| `fit_for_duty_d6` | Binary | Fit for duty status (0_no, 1_yes) |

**Sample Data:**

```
study_id,treatment,dosing_regimen_for_scurvy,gum_rot_d6,skin_sores_d6,...
001,cider,1 quart per day,2_moderate,2_moderate,...
009,citrus,two lemons and an orange daily,1_mild,1_mild,...
010,citrus,two lemons and an orange daily,0_none,0_none,...
```

**Key Finding:** Only the citrus group showed marked improvement.

---

### 2. strep_tb — 1948 Streptomycin Tuberculosis Trial

**File:** `strep_tb.csv` (13 KB)
**Historical Significance:** First double-blind randomised controlled trial using modern methodology.

| Property | Value |
|----------|-------|
| Observations | 107 |
| Variables | 13 |
| Year | 1948 |
| Design | Double-blind RCT |

**Description:**
Data from the Medical Research Council's landmark trial of streptomycin for pulmonary tuberculosis. This trial established the gold standard for clinical trial methodology.

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `patient_id` | Character | Subject identifier |
| `arm` | Factor | Control, Streptomycin |
| `dose_strep_g` | Numeric | Streptomycin dose in grams |
| `dose_PAS_g` | Numeric | Para-aminosalicylic acid dose |
| `gender` | Factor | M, F |
| `baseline_condition` | Ordinal | 1_Good, 2_Fair, 3_Poor |
| `baseline_temp` | Ordinal | Temperature category |
| `baseline_esr` | Ordinal | Erythrocyte sedimentation rate category |
| `baseline_cavitation` | Binary | Lung cavitation status |
| `strep_resistance` | Ordinal | Developed streptomycin resistance |
| `radiologic_6m` | Ordinal | Radiological outcome at 6 months |
| `rad_num` | Integer | Numeric radiological score (1-6) |
| `improved` | Logical | Binary improvement indicator |

**Sample Data:**

```
patient_id,arm,dose_strep_g,gender,baseline_condition,radiologic_6m,improved
0001,Control,0,M,1_Good,6_Considerable_improvement,TRUE
0002,Control,0,F,1_Good,5_Moderate_improvement,TRUE
```

---

### 3. blood_storage — Prostate Cancer RBC Storage Study

**File:** `blood_storage.csv` (16 KB)

| Property | Value |
|----------|-------|
| Observations | 316 |
| Variables | 20 |
| Design | Retrospective cohort |

**Description:**
Data from men who underwent radical prostatectomy and received blood transfusion. Examines whether red blood cell (RBC) storage duration affects prostate cancer recurrence.

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `RBC.Age.Group` | Integer | RBC storage duration group (1=Younger, 2=Middle, 3=Older) |
| `Median.RBC.Age` | Integer | Median RBC age in days |
| `Age` | Numeric | Patient age |
| `AA` | Binary | African American (0/1) |
| `FamHx` | Binary | Family history of prostate cancer |
| `PVol` | Numeric | Prostate volume |
| `TVol` | Integer | Tumour volume category |
| `T.Stage` | Integer | Tumour stage |
| `bGS` | Integer | Biopsy Gleason score |
| `BN+` | Binary | Bladder neck involvement |
| `OrganConfined` | Binary | Organ confined disease |
| `PreopPSA` | Numeric | Preoperative PSA level |
| `PreopTherapy` | Binary | Received preoperative therapy |
| `Units` | Integer | Units of blood transfused |
| `sGS` | Integer | Surgical Gleason score |
| `AnyAdjTherapy` | Binary | Received adjuvant therapy |
| `AdjRadTherapy` | Binary | Received adjuvant radiation |
| `Recurrence` | Binary | PSA recurrence indicator |
| `Censor` | Binary | Censoring indicator |
| `TimeToRecurrence` | Numeric | Time to biochemical recurrence (months) |

---

### 4. covid_testing — SARS-CoV-2 Testing Data

**File:** `covid_testing.csv` (1.5 MB)

| Property | Value |
|----------|-------|
| Observations | 15,524 |
| Variables | 17 |
| Setting | Children's Hospital of Philadelphia |
| Period | Pandemic days 4-107 (2020) |

**Description:**
De-identified COVID-19 testing data from a paediatric hospital system during the early pandemic period. Names have been replaced with Game of Thrones character names for anonymisation.

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `subject_id` | Integer | Patient identifier |
| `fake_first_name` | Character | Anonymised first name |
| `fake_last_name` | Character | Anonymised last name |
| `gender` | Factor | male, female |
| `pan_day` | Integer | Pandemic day number |
| `test_id` | Character | Test type identifier |
| `clinic_name` | Character | Testing location |
| `result` | Factor | positive, negative |
| `demo_group` | Character | Demographic group |
| `age` | Numeric | Age in years |
| `drive_thru_ind` | Binary | Drive-through test indicator |
| `ct_result` | Numeric | Cycle threshold result |
| `orderset` | Binary | Part of order set |
| `payor_group` | Character | Insurance type |
| `patient_class` | Character | Patient classification |
| `col_rec_tat` | Numeric | Collection to receipt turnaround time |
| `rec_ver_tat` | Numeric | Receipt to verification turnaround time |

---

### 5. indo_rct — Indomethacin for Post-ERCP Pancreatitis RCT

**File:** `indo_rct.csv` (110 KB)

| Property | Value |
|----------|-------|
| Observations | 602 |
| Variables | 33 |
| Design | Double-blind RCT |

**Description:**
Data from a landmark randomised controlled trial testing whether rectal indomethacin prevents post-ERCP pancreatitis. Published in NEJM 2012.

**Key Variables:**
- `rx`: Treatment assignment (0_placebo, 1_indomethacin)
- `outcome`: Post-ERCP pancreatitis (0_no, 1_yes)
- `site`: Study site
- `age`, `gender`, `risk`: Demographics and risk factors
- Multiple procedure-related variables (sphincterotomy, stent placement, etc.)

---

### 6. cytomegalovirus — CMV in Bone Marrow Transplant

**File:** `cytomegalovirus.csv` (6.5 KB)

| Property | Value |
|----------|-------|
| Observations | 64 |
| Variables | 26 |
| Design | Prospective cohort |

**Description:**
Data on cytomegalovirus (CMV) reactivation following bone marrow transplantation. Includes detailed transplant characteristics, CMV status, and outcomes.

**Key Variables:**
- `ID`, `age`, `sex`, `race`: Demographics
- `diagnosis`, `diagnosis.type`: Disease information
- `recipient.cmv`, `donor.cmv`: CMV serostatus
- `cmv`, `time.to.cmv`: CMV reactivation outcome
- `agvhd`, `cgvhd`: Graft-versus-host disease status

---

### 7-15. Additional Medical Datasets

| Dataset | File | n | Variables | Description |
|---------|------|---|-----------|-------------|
| `esoph_ca` | esoph_ca.csv | 88 | 5 | Oesophageal cancer case-control study |
| `laryngoscope` | laryngoscope.csv | 99 | 22 | Laryngoscope comparison trial |
| `licorice_gargle` | licorice_gargle.csv | 235 | 19 | Licorice for post-operative sore throat RCT |
| `opt` | opt.csv | 823 | 171 | Periodontal treatment in pregnancy trial |
| `polyps` | polyps.csv | 22 | 7 | Familial adenomatous polyposis treatment |
| `smartpill` | smartpill.csv | 95 | 22 | GI motility measurements |
| `supraclavicular` | supraclavicular.csv | 103 | 17 | Supraclavicular nerve block study |
| `theoph` | theoph.csv | 132 | 5 | Theophylline pharmacokinetics |
| `indometh` | indometh.csv | 66 | 3 | Indomethacin pharmacokinetics |

---

## Supplementary Datasets (`src/data/supplementary/`)

### Survival Analysis Datasets (from `survival` package)

| Dataset | File | n | Variables | Description |
|---------|------|---|-----------|-------------|
| `veteran` | veteran.csv | 137 | 8 | Veterans' Administration lung cancer trial |
| `ovarian` | ovarian.csv | 26 | 6 | Ovarian cancer survival data |
| `lung` | lung.csv | 228 | 10 | NCCTG lung cancer survival |
| `colon` | colon.csv | 1,858 | 16 | Colon cancer chemotherapy trial |
| `pbc` | pbc.csv | 418 | 20 | Primary biliary cirrhosis (Mayo Clinic) |

#### lung — NCCTG Lung Cancer

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `inst` | Integer | Institution code |
| `time` | Integer | Survival time in days |
| `status` | Integer | Censoring status (1=censored, 2=dead) |
| `age` | Integer | Age in years |
| `sex` | Integer | 1=Male, 2=Female |
| `ph.ecog` | Integer | ECOG performance score (0-4) |
| `ph.karno` | Integer | Karnofsky score (physician) |
| `pat.karno` | Integer | Karnofsky score (patient) |
| `meal.cal` | Integer | Calories consumed at meals |
| `wt.loss` | Integer | Weight loss in last 6 months |

#### pbc — Primary Biliary Cirrhosis

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `id` | Integer | Patient ID |
| `time` | Integer | Days between registration and event |
| `status` | Integer | 0=censored, 1=transplant, 2=dead |
| `trt` | Integer | Treatment (1=D-penicillamine, 2=placebo) |
| `age` | Numeric | Age in years |
| `sex` | Factor | m, f |
| `ascites` | Binary | Presence of ascites |
| `hepato` | Binary | Hepatomegaly |
| `spiders` | Binary | Spider angiomata |
| `edema` | Numeric | Edema (0, 0.5, 1) |
| `bili` | Numeric | Serum bilirubin (mg/dl) |
| `chol` | Integer | Serum cholesterol (mg/dl) |
| `albumin` | Numeric | Albumin (gm/dl) |
| `copper` | Integer | Urine copper (ug/day) |
| `alk.phos` | Numeric | Alkaline phosphatase (U/litre) |
| `ast` | Numeric | Aspartate aminotransferase (U/ml) |
| `trig` | Integer | Triglycerides (mg/dl) |
| `platelet` | Integer | Platelet count |
| `protime` | Numeric | Prothrombin time (seconds) |
| `stage` | Integer | Histologic stage (1-4) |

---

### MASS Package Datasets

| Dataset | File | n | Variables | Description |
|---------|------|---|-----------|-------------|
| `birthwt` | birthwt.csv | 189 | 10 | Risk factors for low birth weight |
| `boston` | boston.csv | 506 | 14 | Boston housing values |
| `cats` | cats.csv | 144 | 3 | Anatomical data from domestic cats |
| `pima_tr` | pima_tr.csv | 200 | 8 | Pima Indians diabetes (training) |
| `pima_te` | pima_te.csv | 332 | 8 | Pima Indians diabetes (test) |
| `bacteria` | bacteria.csv | 220 | 6 | Bacteria presence after drug treatment |

#### birthwt — Risk Factors for Low Birth Weight

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `low` | Binary | Low birth weight indicator (< 2500g) |
| `age` | Integer | Mother's age |
| `lwt` | Integer | Mother's weight at last menstrual period (pounds) |
| `race` | Factor | 1=White, 2=Black, 3=Other |
| `smoke` | Binary | Smoking status during pregnancy |
| `ptl` | Integer | Number of previous premature labours |
| `ht` | Binary | History of hypertension |
| `ui` | Binary | Presence of uterine irritability |
| `ftv` | Integer | Number of physician visits in first trimester |
| `bwt` | Integer | Birth weight in grams |

#### pima_tr / pima_te — Pima Indians Diabetes

**Variables:**

| Variable | Type | Description |
|----------|------|-------------|
| `npreg` | Integer | Number of pregnancies |
| `glu` | Integer | Plasma glucose concentration |
| `bp` | Integer | Diastolic blood pressure (mm Hg) |
| `skin` | Integer | Triceps skin fold thickness (mm) |
| `bmi` | Numeric | Body mass index |
| `ped` | Numeric | Diabetes pedigree function |
| `age` | Integer | Age in years |
| `type` | Factor | Diabetes status (Yes/No) |

---

### Built-in R Datasets

| Dataset | File | n | Variables | Description |
|---------|------|---|-----------|-------------|
| `mtcars` | mtcars.csv | 32 | 11 | Motor Trend car road tests |
| `iris` | iris.csv | 150 | 5 | Edgar Anderson's iris data |
| `airquality` | airquality.csv | 153 | 6 | New York air quality measurements |
| `chickweight` | chickweight.csv | 578 | 4 | Chick weights by diet |
| `toothgrowth` | toothgrowth.csv | 60 | 3 | Vitamin C effect on tooth growth |
| `usarrests` | usarrests.csv | 50 | 4 | US violent crime rates by state |

---

## Dataset Usage by Course Level

### Level 1: Foundations

| Chapter | Primary Dataset(s) | Alternative |
|---------|-------------------|-------------|
| 1. Introduction | NHANES | penguins |
| 2. Descriptive Numerical | NHANES, blood_storage | gapminder |
| 3. Visualisation | NHANES, gapminder, penguins | covid_testing |
| 4. Probability | Simulated, scurvy | strep_tb |
| 5. Distributions | Simulated, NHANES | pima_tr |
| 6. Sampling/CLT | Simulated from NHANES | lung |
| 7. Point Estimation | NHANES | penguins |
| 8. Confidence Intervals | NHANES, strep_tb | birthwt |
| 9-10. Hypothesis Testing | strep_tb, NHANES | indo_rct |
| 11. Chi-square/Non-parametric | scurvy, strep_tb | cytomegalovirus |
| 12. Regression | NHANES, penguins | cats, birthwt |
| 13. ANOVA | NHANES, penguins | toothgrowth |
| 14. Experimental Design | scurvy, strep_tb | indo_rct |
| 15. Multiple Testing | covid_testing | NHANES |

### Level 2: Intermediate

| Topic | Primary Dataset(s) |
|-------|-------------------|
| Multiple Regression | NHANES, boston |
| Logistic Regression | NHANES, birthwt, pima_tr |
| GLMs | NHANES, covid_testing |
| Mixed Effects Models | polyps, smartpill |
| Survival Analysis | blood_storage, veteran, lung, pbc |
| Time Series | gapminder, covid_testing |

### Level 3: Advanced

| Topic | Primary Dataset(s) |
|-------|-------------------|
| Bayesian Statistics | NHANES, strep_tb |
| Machine Learning | NHANES, penguins, pima_tr |
| Causal Inference | strep_tb, indo_rct |
| High-dimensional Data | Simulated, NHANES subsets |
| Complex Surveys | nhanes_raw (with weights) |

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
| pbc | Several | Multiple imputation exercises |

### Sample Size Considerations

| Size Category | Datasets | Teaching Purpose |
|---------------|----------|------------------|
| Small (n < 50) | scurvy, ovarian, polyps, mtcars | Small sample methods, exact tests |
| Medium (50-500) | strep_tb, blood_storage, penguins, veteran, birthwt | Standard parametric methods |
| Large (500-5000) | gapminder, indo_rct, colon, pbc | Asymptotic theory |
| Very Large (>5000) | NHANES, covid_testing | Computational methods, big data |

---

## Loading Data in R

### From CSV Files (Recommended for Course)

```r
library(data.table)

# Set data directory
data_dir <- "src/data"

# Load primary datasets
nhanes <- fread(file.path(data_dir, "primary/nhanes.csv"))
penguins <- fread(file.path(data_dir, "primary/penguins.csv"))
gapminder <- fread(file.path(data_dir, "primary/gapminder.csv"))

# Load medical datasets
scurvy <- fread(file.path(data_dir, "medical/scurvy.csv"))
strep_tb <- fread(file.path(data_dir, "medical/strep_tb.csv"))
blood_storage <- fread(file.path(data_dir, "medical/blood_storage.csv"))

# Load supplementary datasets
lung <- fread(file.path(data_dir, "supplementary/lung.csv"))
birthwt <- fread(file.path(data_dir, "supplementary/birthwt.csv"))
```

### From R Packages (Alternative)

```r
# Install packages
install.packages(c("NHANES", "medicaldata", "palmerpenguins", "gapminder"))

# Load datasets
library(NHANES); data(NHANES)
library(medicaldata); data(scurvy); data(strep_tb)
library(palmerpenguins); data(penguins)
library(gapminder); data(gapminder)
library(survival); data(lung); data(pbc)
library(MASS); data(birthwt)
```

---

## References and Data Sources

### Primary Sources

| Dataset | Source | URL |
|---------|--------|-----|
| NHANES | CDC National Center for Health Statistics | https://www.cdc.gov/nchs/nhanes/ |
| palmerpenguins | Palmer LTER, Antarctica | https://allisonhorst.github.io/palmerpenguins/ |
| gapminder | Gapminder Foundation | https://www.gapminder.org/ |
| medicaldata | Peter Higgins (U. Michigan) | https://higgi13425.github.io/medicaldata/ |

### R Package References

| Package | CRAN URL |
|---------|----------|
| NHANES | https://cran.r-project.org/package=NHANES |
| medicaldata | https://cran.r-project.org/package=medicaldata |
| palmerpenguins | https://cran.r-project.org/package=palmerpenguins |
| gapminder | https://cran.r-project.org/package=gapminder |
| survival | https://cran.r-project.org/package=survival |
| MASS | https://cran.r-project.org/package=MASS |

---

## Ethical and Legal Considerations

### Data Licensing

| Dataset | License | Attribution Required |
|---------|---------|---------------------|
| NHANES | Public Domain (CDC) | Yes (for publications) |
| medicaldata | MIT | Yes |
| palmerpenguins | CC-0 | Yes (recommended) |
| gapminder | CC-BY | Yes |
| survival | GPL-2/3 | Citation recommended |

### Appropriate Use

1. **Educational Use:** All datasets are appropriate for classroom teaching
2. **Research Use:** NHANES (educational version) should NOT be used for research publications; download original data from CDC
3. **Student Projects:** All datasets suitable with proper attribution

---

## Version Information

| Item | Value |
|------|-------|
| Document Version | 2.0 |
| Last Updated | January 2026 |
| Tested R Version | 4.3+ |
| Course | Statistics with R (Levels 1-3) |
| Download Script | `src/data/download_datasets.R` |
| Total Datasets | 39 |

---

*This document was prepared for the Statistics with R course series at derecksnotes.com.*
