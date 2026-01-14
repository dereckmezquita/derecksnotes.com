# Course Development Preferences

## Code Style

- **Formatter**: Air formatter style for R code
- **Imports**: Always use `box::use()` for all imports — never use `library()`
- **Script execution**: Always use `Rscript` to run R scripts — never use `source()`
- **File format**: Rmd (R Markdown) compiled to MDX
- **Paradigm**: Old-school C-style coding preferred
- **Data manipulation**: Base R and heavy use of `data.table` — never use tidyverse
- **Visualisation**: Heavy use of `ggplot2` for all graphics

## Target Audience

- **For**: Scientists (from starter to PhD-level statistics)
- **Focus**: Biomedical/bioinformatics applications
- **NOT for**: Beginners learning R — this is a statistics course, not an R course

## Language

- **Spelling**: British Oxford English throughout (e.g., "colour", "randomise", "behaviour", "analyse")
- **Tone**: Professional, academic, but accessible

## File Naming

Pattern: `{number}_{course-name}_{chapter-name}.Rmd`

Examples:
- `0_statistics-1-foundations_preface.Rmd`
- `1_statistics-1-foundations_introduction-to-statistics-and-data.Rmd`
- `2_statistics-1-foundations_descriptive-statistics.Rmd`
- `A_statistics-1-foundations_appendices.Rmd`

## Workflow

1. Write one chapter at a time
2. Submit for user review
3. Proceed to next chapter only after explicit approval

## Teaching Method (Three-Part)

Each concept should follow:
1. **Prose/Intuition**: Plain-language explanation with real-world context
2. **Visualisation**: ggplot2 graphics demonstrating the concept
3. **Mathematical derivation**: Formal notation with step-by-step derivation

## Code Block Requirements

- Implement functions from scratch before showing built-in versions
- Use `set.seed()` for all reproducible examples
- Heavy commenting explaining the logic
- Show intermediate outputs where instructive
