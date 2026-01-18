# Course Development Guidelines

Universal guidelines for creating courses on Dereck's Notes.

---

## Pedagogical Approach

Every concept MUST be presented using the **four-part teaching method**:

### 1. Prose and Intuition
Explain the concept in plain language with analogies and context:
- What is this?
- Why does it matter?
- When would you use it?

Build intuition before formalism. Make complex topics accessible.

### 2. Visualisation
Demonstrate concepts visually using `ggplot2`. Graphs and diagrams bridge intuition and mathematics.

### 3. Mathematical Derivation
Present formal mathematics following the French educational tradition — *derive* formulae, don't just state them:
- How the formula was discovered
- Why it takes the form it does
- What each component means

### 4. Communicating to Stakeholders
Teach how to explain the concept to non-specialists:
- Plain language reporting
- Common misunderstandings to avoid
- How to answer questions from collaborators

After the four-part introduction, implement methods **from scratch**, then show built-in functions.

---

## Chapter Structure

1. **Opening** — Brief introduction (1-2 paragraphs)
2. **Sections** — Each follows the four-part pedagogical approach
3. **Communicating to Stakeholders** — End-of-chapter guidance for non-specialists
4. **Quick Reference** — Compact summary of formulae and code

---

## Language and Style

### Spelling
**British Oxford English** throughout:
- colour, analyse, summarise, behaviour, randomise, organisation, centre, metre

### Tone
- Professional, academic, but accessible
- Build intuition before formalism
- Avoid unnecessarily complex language
- Use active voice where possible
- Define terms when first introduced
- Use concrete examples before abstract definitions

---

## Code Style

### Package Management
```r
# ALWAYS use box::use() — NEVER use library()
box::use(
    data.table,
    ggplot2
)

# Access with namespace prefix
dt <- data.table$data.table(x = 1:10, y = rnorm(10))
ggplot2$ggplot(dt, ggplot2$aes(x = x, y = y)) + ggplot2$geom_point()

# Only import individual functions when 1-3 are needed
box::use(
    data.table[as.data.table, .N]
)
```

### Core Packages
| Package | Purpose |
|---------|---------|
| `data.table` | Data manipulation (NEVER tidyverse) |
| `ggplot2` | Visualisation |
| `box` | Package imports |

### Coding Paradigm
- Old-school C-style coding preferred
- Base R for simple operations
- Heavy use of `data.table` for data manipulation
- Implement functions from scratch BEFORE showing built-in versions
- Use `Rscript` to run scripts — never use `source()`

### Reproducibility
- Include `set.seed()` for all random examples
- Use consistent seeds across related examples
- Heavy commenting explaining logic
- Show intermediate outputs where instructive

---

## File Format

### Rmd Header Template
```yaml
---
title: "Course Title"
chapter: "Chapter N: Chapter Name"
coverImage: 13
author: "Dereck Mezquita"
date: YYYY-MM-DD
tags: [relevant, tags, here]
published: true
comments: true
output:
  html_document:
    keep_md: true
---
```

### Setup Chunk Template
````r
```{r setup, include=FALSE}
if (knitr::is_html_output()) knitr::knit_hooks$set(
    plot = function(x, options) {
        cap  <- options$fig.cap
        as.character(htmltools::tag(
            "Figure", list(src = x, alt = cap, paste("\n\t", cap, "\n", sep = ""))
        ))
    }
)

knitr::knit_hooks$set(optipng = knitr::hook_optipng)
knitr::opts_chunk$set(dpi = 300, fig.width = 10, fig.height = 7)
```
````

### File Naming Convention
Pattern: `{number}-{part}_{course-name}_{chapter-name}_{section-name}.Rmd`

Example: `01-1_course-name_introduction_getting-started.Rmd`

---

## Directory Structure

```
Course-Name/                        # Organisational folder
├── _passthrough                    # Marker file (content system skips, promotes children)
├── TOC.md                          # Master table of contents
├── COURSE-GUIDE.md                 # Course-specific development guide
├── course-1-part-name/
│   ├── _series.mdx                 # Course manifest
│   ├── src/                        # Source files (ignored by content system)
│   │   ├── data/                   # Datasets
│   │   └── *.Rmd                   # R Markdown source files
│   └── 01-chapter-name/            # Chapter folders (compiled content)
│       └── 01-1_....mdx
└── course-2-part-name/
    └── _series.mdx
```

### Key Files
- **`_passthrough`**: Empty marker file. Folders containing this are skipped; their subdirectories are promoted to the top level.
- **`_series.mdx`**: Required manifest for each course/part.
- **`src/`**: Source files, ignored by the content system.

---

## Quality Checklist

Before submitting any chapter:

- [ ] British Oxford English spelling verified
- [ ] Four-part method used for each concept
- [ ] Mathematical derivations shown, not just formulae stated
- [ ] Code implemented from scratch before built-in functions shown
- [ ] `set.seed()` used for all random examples
- [ ] Visualisations have clear titles, labels, and captions
- [ ] "Communicating to Stakeholders" section included
- [ ] "Quick Reference" section included
- [ ] Rmd file knits without errors
- [ ] All code chunks run and produce expected output

---

## Workflow

1. Write one chapter at a time
2. Follow the four-part pedagogical approach for each concept
3. Submit for review
4. Proceed to next chapter only after explicit approval
