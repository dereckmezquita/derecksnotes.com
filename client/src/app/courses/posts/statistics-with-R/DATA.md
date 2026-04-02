# Statistics with R: Dataset Documentation

This document provides comprehensive documentation for all datasets used across the three-part Statistics with R course. All data is consolidated in a shared `data/` directory adjacent to the three course parts.

**Total: 105 CSV files across 14 categories**

---

## Directory Structure

```
statistics-with-R/
├── DATA.md                         # This file
├── data/                           # Shared datasets (105 CSV files)
│   ├── primary/                    # Core teaching datasets (5 files)
│   ├── medical/                    # Clinical trial datasets (14 files)
│   ├── survival/                   # Survival analysis (5 files)
│   ├── classic/                    # Classic R/ML datasets (14 files)
│   ├── bioinformatics/             # Genomics and omics (7 files)
│   ├── microbiome/                 # Microbial ecology (7 files)
│   ├── proteomics/                 # Mass spectrometry (3 files)
│   ├── gwas/                       # Population genetics (4 files)
│   ├── count/                      # Count regression (11 files)
│   ├── time-series/                # Temporal data (11 files)
│   ├── longitudinal/               # Repeated measures (11 files)
│   ├── causal/                     # Causal inference (4 files)
│   ├── network/                    # Graph/network (4 files)
│   ├── spatial/                    # Geospatial (5 files)
│   ├── download_all.R              # Master download script
│   ├── download_primary.R          # NHANES, penguins, gapminder
│   ├── download_medical.R          # medicaldata package
│   ├── download_survival.R         # survival package
│   ├── download_classic.R          # base R, MASS
│   ├── download_bioinformatics.R   # UCI, RNA-seq
│   ├── download_microbiome.R       # phyloseq, simulated
│   ├── download_proteomics.R       # CPTAC spike-in
│   ├── download_gwas.R             # rice, simulated
│   ├── download_shared_datasets.R  # count, time-series, etc.
│   └── download_part2_medical.R    # Part II medical datasets
├── statistics-1-foundations/       # Part I: Foundations (15 chapters)
├── statistics-2-intermediate/      # Part II: Intermediate (10 chapters)
└── statistics-3-advanced/          # Part III: Advanced (8 chapters)
```

---

## Download Scripts

Run individual category scripts or the master script:

```bash
# Download everything
Rscript data/download_all.R

# Or individual categories
Rscript data/download_primary.R        # NHANES, penguins, gapminder
Rscript data/download_medical.R        # Clinical trial data
Rscript data/download_survival.R       # Survival datasets
Rscript data/download_classic.R        # iris, mtcars, Boston, etc.
Rscript data/download_bioinformatics.R # Breast cancer, RNA-seq
Rscript data/download_microbiome.R     # OTU tables, GlobalPatterns
Rscript data/download_proteomics.R     # CPTAC spike-in
Rscript data/download_gwas.R           # Rice, simulated GWAS
Rscript data/download_shared_datasets.R # Count, time-series, causal, etc.
Rscript data/download_part2_medical.R   # Part II medical datasets
```

---

## Usage in Rmd Files

From any Rmd file in the course, load data with relative paths:

```r
# From Part I chapters (e.g., statistics-1-foundations/src/04-probability/)
nhanes <- fread("../../../data/primary/nhanes.csv")
penguins <- fread("../../../data/primary/penguins.csv")
sleepstudy <- fread("../../../data/longitudinal/sleep_deprivation.csv")
```

---

# Primary Datasets

Core datasets used extensively throughout all three parts.

## nhanes.csv / nhanes_raw.csv

**National Health and Nutrition Examination Survey (NHANES)**

| Field | Value |
|-------|-------|
| **File** | `primary/nhanes.csv`, `primary/nhanes_raw.csv` |
| **Rows** | ~10,000 (nhanes), ~20,000 (nhanes_raw) |
| **Variables** | 76 |
| **Source** | NHANES R package (CDC data) |
| **Citation** | CDC/NCHS. National Health and Nutrition Examination Survey |
| **Licence** | Public domain (US government) |

**Key Variables**: Age, Gender, Height, Weight, BMI, Blood Pressure, Cholesterol, Diabetes, Smoking, Race, Education, Income

**Course Usage**: Parts I-III (descriptive stats, probability, inference, regression)

---

## penguins.csv / penguins_raw.csv

**Palmer Penguins**

| Field | Value |
|-------|-------|
| **File** | `primary/penguins.csv`, `primary/penguins_raw.csv` |
| **Rows** | 344 |
| **Variables** | 8 |
| **Source** | palmerpenguins R package |
| **Citation** | Gorman KB, et al. (2014). PLoS ONE 9:e90081 |
| **Licence** | CC0 1.0 |

**Key Variables**: species, island, bill_length_mm, bill_depth_mm, flipper_length_mm, body_mass_g, sex

**Course Usage**: Visualisation, t-tests, ANOVA, classification

---

## gapminder.csv

**Gapminder World Development Indicators**

| Field | Value |
|-------|-------|
| **File** | `primary/gapminder.csv` |
| **Rows** | 1,704 (142 countries × 12 years) |
| **Variables** | 6 |
| **Source** | gapminder R package |
| **Citation** | Gapminder Foundation |
| **Licence** | CC-BY |

**Key Variables**: country, continent, year, lifeExp, pop, gdpPercap

**Course Usage**: Time series visualisation, panel data

---

# Medical Datasets

Real clinical trial and medical research data from the medicaldata package.

**Note**: COVID-related datasets are intentionally excluded from this course.

| Dataset | File | n | Description |
|---------|------|---|-------------|
| strep_tb | `medical/strep_tb.csv` | 107 | Streptomycin TB trial (1948, first RCT) |
| scurvy | `medical/scurvy.csv` | 12 | James Lind scurvy trial (1757) |
| blood_storage | `medical/blood_storage.csv` | 316 | Blood storage and cancer outcomes |
| indo_rct | `medical/indo_rct.csv` | 602 | Indomethacin for pancreatitis |
| cytomegalovirus | `medical/cytomegalovirus.csv` | 64 | CMV in bone marrow transplant |
| esoph_ca | `medical/esoph_ca.csv` | 88 | Esophageal cancer case-control |
| laryngoscope | `medical/laryngoscope.csv` | 99 | Video vs direct laryngoscopy |
| licorice_gargle | `medical/licorice_gargle.csv` | 236 | Sore throat prevention |
| opt | `medical/opt.csv` | 130 | Obesity prevention trial |
| polyps | `medical/polyps.csv` | 22 | Polyp prevention trial |
| smartpill | `medical/smartpill.csv` | 87 | GI motility study |
| supraclavicular | `medical/supraclavicular.csv` | 103 | Regional anaesthesia |
| theoph | `medical/theoph.csv` | 132 | Theophylline pharmacokinetics |
| indometh | `medical/indometh.csv` | 66 | Indomethacin pharmacokinetics |

**Citation**: Higgins P (2022). medicaldata R package
**Licence**: CC0 for teaching

---

# Survival Datasets

Classic survival analysis datasets from the survival package.

| Dataset | File | n | Description |
|---------|------|---|-------------|
| lung | `survival/lung.csv` | 228 | NCCTG lung cancer survival |
| pbc | `survival/pbc.csv` | 418 | Primary biliary cholangitis |
| veteran | `survival/veteran.csv` | 137 | Veterans' lung cancer trial |
| colon | `survival/colon.csv` | 1,858 | Colon cancer chemotherapy |
| ovarian | `survival/ovarian.csv` | 26 | Ovarian cancer survival |

**Citation**: Therneau TM (2023). survival R package
**Licence**: LGPL (>= 2)

---

# Classic Datasets

Canonical datasets from base R and MASS package.

## Base R

| Dataset | File | n | Description |
|---------|------|---|-------------|
| iris | `classic/iris.csv` | 150 | Fisher's iris measurements |
| mtcars | `classic/mtcars.csv` | 32 | Motor Trend car data |
| airquality | `classic/airquality.csv` | 153 | NY air quality 1973 |
| toothgrowth | `classic/toothgrowth.csv` | 60 | Guinea pig tooth growth |
| chickweight | `classic/chickweight.csv` | 578 | Chick weight over time |
| usarrests | `classic/usarrests.csv` | 50 | US violent crime rates |

## MASS Package

| Dataset | File | n | Description |
|---------|------|---|-------------|
| boston | `classic/boston.csv` | 506 | Boston housing prices |
| birthwt | `classic/birthwt.csv` | 189 | Birth weight risk factors |
| cats | `classic/cats.csv` | 144 | Cat heart/body weight |
| pima_tr | `classic/pima_tr.csv` | 200 | Pima diabetes (training) |
| pima_te | `classic/pima_te.csv` | 332 | Pima diabetes (test) |
| bacteria | `classic/bacteria.csv` | 220 | Bacteria after treatment |
| diabetes | `classic/diabetes.csv` | 442 | Diabetes progression |
| heart_disease | `classic/heart_disease.csv` | varies | Heart disease (UCI) |

---

# Bioinformatics Datasets

Genomics, transcriptomics, and machine learning benchmarks.

| Dataset | File | n | Description |
|---------|------|---|-------------|
| breast_cancer_wisconsin | `bioinformatics/breast_cancer_wisconsin.csv` | 699 | UCI breast cancer |
| heart_disease_cleveland | `bioinformatics/heart_disease_cleveland.csv` | 303 | UCI heart disease |
| pima_diabetes_full | `bioinformatics/pima_diabetes_full.csv` | 532 | Combined Pima dataset |
| golub_leukemia | `bioinformatics/golub_leukemia.csv` | 72 | Leukemia gene expression |
| rnaseq_influenza | `bioinformatics/rnaseq_influenza.csv` | 48 | Influenza response |
| simulated_rnaseq_degs | `bioinformatics/simulated_rnaseq_degs.csv` | 1,000 | DE analysis teaching |
| simulated_rnaseq_metadata | `bioinformatics/simulated_rnaseq_metadata.csv` | 12 | Sample metadata |

**Citation**: UCI ML Repository; Golub et al. (1999) Science

---

# Microbiome Datasets

16S rRNA and metagenomic data for compositional analysis.

| Dataset | File | n | Description |
|---------|------|---|-------------|
| globalpatterns_otu_table | `microbiome/globalpatterns_otu_table.csv` | 26 | OTU counts |
| globalpatterns_metadata | `microbiome/globalpatterns_metadata.csv` | 26 | Sample info |
| globalpatterns_taxonomy | `microbiome/globalpatterns_taxonomy.csv` | 500 | OTU taxonomy |
| moving_pictures_metadata | `microbiome/moving_pictures_metadata.csv` | 120 | Longitudinal study |
| simulated_otu_table | `microbiome/simulated_otu_table.csv` | 30 | Teaching data |
| simulated_microbiome_metadata | `microbiome/simulated_microbiome_metadata.csv` | 30 | Group info |
| simulated_taxonomy | `microbiome/simulated_taxonomy.csv` | 100 | Taxonomy |

**Citation**: Caporaso et al. (2011) PNAS

---

# Proteomics Datasets

Mass spectrometry and protein quantification data.

| Dataset | File | n | Description |
|---------|------|---|-------------|
| cptac_spike_in_intensities | `proteomics/cptac_spike_in_intensities.csv` | 18 | Protein intensities |
| cptac_spike_in_metadata | `proteomics/cptac_spike_in_metadata.csv` | 18 | Sample info |
| cptac_spike_in_ground_truth | `proteomics/cptac_spike_in_ground_truth.csv` | 48 | True positives |

**Citation**: Paulovich et al. (2010) Mol Cell Proteomics

---

# GWAS Datasets

Genome-wide association study data for population genetics and multiple testing.

| Dataset | File | n | Description |
|---------|------|---|-------------|
| rice_phenotypes | `gwas/rice_phenotypes.csv` | 413 | Rice diversity panel |
| simulated_gwas_phenotypes | `gwas/simulated_gwas_phenotypes.csv` | 1,000 | Teaching GWAS |
| simulated_gwas_genotypes | `gwas/simulated_gwas_genotypes.csv` | 1,000 | Genotype matrix |
| simulated_gwas_snp_info | `gwas/simulated_gwas_snp_info.csv` | 500 | SNP annotation |

**Citation**: Zhao et al. (2011) Nature Communications

---

# Count Data

Overdispersed count data for Poisson/negative binomial regression.

## Medical Count Data (Part II)

| Dataset | File | n | Description | Citation |
|---------|------|---|-------------|----------|
| nmes1988_doctor_visits | `count/nmes1988_doctor_visits.csv` | 4,406 | Physician office visits | Deb & Trivedi (1997) J Applied Econometrics |
| arizona_hospital_los | `count/arizona_hospital_los.csv` | 1,798 | Hospital length of stay | Hilbe (2014) Modeling Count Data |
| german_health_visits | `count/german_health_visits.csv` | 1,127 | German doctor visits | COUNT package |
| rand_health_insurance | `count/rand_health_insurance.csv` | 19,609 | RAND HIE doctor visits | RAND HIE Study |
| medicare_los | `count/medicare_los.csv` | 1,495 | Medicare length of stay | COUNT package |
| clinical_trial_adverse_events | `count/clinical_trial_adverse_events.csv` | 500 | AE counts (simulated) | Simulated for teaching |

## Classic Count Data

| Dataset | File | n | Description | Citation |
|---------|------|---|-------------|----------|
| epilepsy_seizures | `count/epilepsy_seizures.csv` | 236 | Seizure counts | Thall & Vail (1990) |
| ships_damage | `count/ships_damage.csv` | 40 | Ship damage incidents | McCullagh & Nelder (1989) |
| insurance_claims | `count/insurance_claims.csv` | 64 | Insurance claims | MASS package |
| horseshoe_crabs | `count/horseshoe_crabs.csv` | 54 | Crab satellite counts | Brockmann (1996) |
| biochemist_publications | `count/biochemist_publications.csv` | 915 | PhD publications | Long et al. (1990) |

---

# Time Series Data

Temporal data with trend, seasonality, and cycles.

## Medical/Epidemiological Time Series (Part II)

| Dataset | File | n | Description | Citation |
|---------|------|---|-------------|----------|
| salmonella_germany_weekly | `time-series/salmonella_germany_weekly.csv` | 312 | Salmonella agona weekly | surveillance package |
| influenza_germany_weekly | `time-series/influenza_germany_weekly.csv` | 416 | Flu in Bavaria/Baden-Württemberg | surveillance package |
| hepatitis_a_berlin_weekly | `time-series/hepatitis_a_berlin_weekly.csv` | 208 | Hepatitis A in Berlin | surveillance package |
| hospital_admissions_monthly | `time-series/hospital_admissions_monthly.csv` | 120 | Hospital admissions (simulated) | Simulated for teaching |

## Classic Time Series

| Dataset | File | n | Description |
|---------|------|---|-------------|
| air_passengers | `time-series/air_passengers.csv` | 144 | Airline passengers 1949-1960 |
| us_accidental_deaths | `time-series/us_accidental_deaths.csv` | 72 | Accidental deaths 1973-1978 |
| nottingham_temperature | `time-series/nottingham_temperature.csv` | 240 | Nottingham temp 1920-1939 |
| mauna_loa_co2 | `time-series/mauna_loa_co2.csv` | 468 | CO2 concentration 1959-1997 |
| sunspots_annual | `time-series/sunspots_annual.csv` | 289 | Sunspot numbers 1700-1988 |
| us_economics | `time-series/us_economics.csv` | 574 | US economic indicators |
| us_economics_long | `time-series/us_economics_long.csv` | 2,870 | Long format |

**Citation**: Box & Jenkins (1976); ggplot2 package; surveillance package

---

# Longitudinal / Mixed-Effects Data

Repeated measures data for mixed-effects modelling.

## Clinical Longitudinal Data (Part II)

| Dataset | File | n | Description | Citation |
|---------|------|---|-------------|----------|
| aids_cd4_longitudinal | `longitudinal/aids_cd4_longitudinal.csv` | 1,405 | AIDS CD4 repeated measures | Goldman et al. (1996); JM package |
| aids_cd4_baseline | `longitudinal/aids_cd4_baseline.csv` | 467 | AIDS CD4 baseline data | Goldman et al. (1996); JM package |
| prothrombin_liver | `longitudinal/prothrombin_liver.csv` | 2,968 | Liver disease prothrombin ratio | JM package |
| multisite_clinical_trial | `longitudinal/multisite_clinical_trial.csv` | 2,300 | Multi-site RCT (simulated) | Simulated for teaching |

## Classic Longitudinal Data

| Dataset | File | n | Description | Citation |
|---------|------|---|-------------|----------|
| sleep_deprivation | `longitudinal/sleep_deprivation.csv` | 180 | Sleep study | Belenky et al. (2003) |
| orthodont_growth | `longitudinal/orthodont_growth.csv` | 108 | Orthodontic growth | Potthoff & Roy (1964) |
| pixel_intensity | `longitudinal/pixel_intensity.csv` | 102 | Pixel intensity | nlme package |
| machines_productivity | `longitudinal/machines_productivity.csv` | 54 | Machine productivity | nlme package |
| rat_bodyweight | `longitudinal/rat_bodyweight.csv` | 176 | Rat weight by diet | nlme package |
| paste_strength | `longitudinal/paste_strength.csv` | 60 | Paste strength | lme4 package |
| instructor_evaluations | `longitudinal/instructor_evaluations.csv` | 73,421 | Teaching evaluations | lme4 package |

---

# Causal Inference Data

Data for propensity scores, matching, DiD, and RDD.

| Dataset | File | n | Description | Citation |
|---------|------|---|-------------|----------|
| lalonde_job_training | `causal/lalonde_job_training.csv` | 614 | LaLonde NSW study | LaLonde (1986); Dehejia & Wahba (1999) |
| card_krueger_minwage | `causal/card_krueger_minwage.csv` | 410 | Minimum wage NJ/PA | Card & Krueger (1994) |
| close_elections_rdd | `causal/close_elections_rdd.csv` | 1,000 | Close elections RDD | Lee (2008) |
| did_policy_panel | `causal/did_policy_panel.csv` | 800 | DiD panel data | Simulated |

---

# Network Data

Graph and social network data.

| Dataset | File | n | Description |
|---------|------|---|-------------|
| karate_club_edges | `network/karate_club_edges.csv` | 78 edges | Zachary's karate club |
| karate_club_nodes | `network/karate_club_nodes.csv` | 34 nodes | Node attributes |
| us_airports_edges | `network/us_airports_edges.csv` | ~190 edges | US airport routes |
| us_airports_nodes | `network/us_airports_nodes.csv` | 20 nodes | Airport info |

**Citation**: Zachary (1977) J Anthropological Research

---

# Spatial Data

Geospatial data for disease mapping, geostatistics, and spatial regression.

| Dataset | File | n | Description | Citation |
|---------|------|---|-------------|----------|
| nc_sids | `spatial/nc_sids.csv` | 100 | NC SIDS mortality | Cressie (1991) |
| meuse_heavy_metals | `spatial/meuse_heavy_metals.csv` | 155 | Meuse river metals | Burrough & McDonnell (1998) |
| meuse_prediction_grid | `spatial/meuse_prediction_grid.csv` | 3,103 | Kriging grid | sp package |
| boston_housing_spatial | `spatial/boston_housing_spatial.csv` | 506 | Boston + coords | Harrison & Rubinfeld (1978) |
| california_housing_spatial | `spatial/california_housing_spatial.csv` | 500 | CA housing blocks | Simulated |

---

# Dataset Usage by Course Part

## Part I: Foundations (15 chapters)
- **Primary**: nhanes, penguins, gapminder
- **Medical**: strep_tb, scurvy
- **Survival**: lung
- **Classic**: iris
- **Bioinformatics**: breast_cancer_wisconsin
- **Time Series**: air_passengers

## Part II: Intermediate (10 chapters)
- **Count**: nmes1988_doctor_visits, arizona_hospital_los, medicare_los, clinical_trial_adverse_events, epilepsy_seizures
- **Time Series**: salmonella_germany_weekly, influenza_germany_weekly, hospital_admissions_monthly, us_accidental_deaths
- **Longitudinal**: aids_cd4_longitudinal, prothrombin_liver, multisite_clinical_trial, sleep_deprivation

## Part III: Advanced (8 chapters)
- **Causal**: lalonde_job_training, card_krueger_minwage, close_elections_rdd
- **Network**: karate_club, us_airports
- **Spatial**: nc_sids, meuse_heavy_metals, boston_housing_spatial
- **GWAS**: simulated_gwas

---

# Ethical Considerations

Some datasets require awareness of historical and ethical context:

- **Boston Housing**: Contains a variable (B) based on racial demographics. Use with discussion of algorithmic fairness.
- **Pima Diabetes**: Collected from a specific indigenous population. Discuss consent and representation.
- **NHANES**: Weighted survey data; proper analysis requires survey methods.

---

# Licence Summary

| Category | Licence |
|----------|---------|
| US Government (NHANES, CDC) | Public Domain |
| Palmer Penguins | CC0 1.0 |
| Gapminder | CC-BY |
| medicaldata package | CC0 (teaching) |
| UCI ML Repository | CC BY 4.0 |
| Base R datasets | GPL (R Core) |
| MASS, survival, nlme, lme4 | GPL |
| Simulated datasets | Course materials (unrestricted) |

All datasets are freely available for educational purposes.

---

# Version History

- **2025-01-19**: Added 14 new biomedical datasets for Part II (count, longitudinal, time series); created download_part2_medical.R script
- **2025-01-18**: Consolidated all data into shared `data/` directory; removed COVID datasets; created modular download scripts; updated all Rmd paths
- **2025-01-17**: Initial data collection for Part I

---

*Statistics with R Course — Dereck Mezquita*
