#!/usr/bin/env Rscript
# =============================================================================
# Build Script: Compile Rmd files to MDX for derecksnotes.com
# =============================================================================
#
# This script finds all .Rmd files in a course's src/ directory, executes the
# R code chunks using knitr, and outputs .mdx files to the course directory
# for the Next.js/MDX infrastructure to process.
#
# USAGE:
#   Rscript build-courses.R <course-path> [OPTIONS]
#
# REQUIRED:
#   <course-path>    Path to the course directory (must contain src/*.Rmd files)
#
# OPTIONS:
#   --clean          Remove existing MDX files before building
#   --dry-run        Show what would be done without doing it
#   --force          Rebuild even if MDX is newer than Rmd
#   --quiet          Suppress detailed output
#   --help, -h       Show this help message
#
# EXAMPLES:
#   Rscript build-courses.R client/src/app/courses/posts/statistics-1-foundations
#   Rscript build-courses.R ./statistics-1-foundations --clean --force
#   Rscript build-courses.R /full/path/to/course --dry-run
#
# OUTPUT:
#   - MDX files in course directory (e.g., statistics-1-foundations/*.mdx)
#   - Figures in client/public/courses/<course-name>/ for Next.js static serving
#   - Build log in course/rmd-build.log
#
# DIRECTORY STRUCTURE:
#   project-root/
#   ├── client/
#   │   ├── public/
#   │   │   └── courses/
#   │   │       └── <course-name>/    <- Generated figures go here
#   │   └── src/app/courses/posts/
#   │       └── <course-name>/
#   │           ├── src/
#   │           │   ├── 01-chapter/
#   │           │   │   └── *.Rmd     <- Source files (hierarchical)
#   │           │   └── 02-chapter/
#   │           │       └── *.Rmd
#   │           ├── 01-chapter/
#   │           │   └── *.mdx         <- Output files (generated, mirrors src/)
#   │           ├── 02-chapter/
#   │           │   └── *.mdx
#   │           ├── course.mdx        <- Course manifest
#   │           └── rmd-build.log     <- Build log (generated)
#   └── build-courses.R
#
# -----------------------------------------------------------------------------
# HOW IT WORKS:
# -----------------------------------------------------------------------------
#
# The build process has three main challenges:
#   1. Rmd files live in src/ but MDX output goes to the parent course directory
#   2. Figures must be served by Next.js from client/public/courses/<course-name>/
#   3. Figure paths in MDX must use web-absolute paths like /courses/<course-name>/
#
# BUILD STEPS:
#
#   1. FIND PROJECT ROOT
#      Walk up from the course directory to find where client/ lives.
#      This is needed to locate client/public/courses/ for figure output.
#
#   2. CREATE FIGURE OUTPUT DIRECTORY
#      Figures go to: client/public/courses/<course-name>/
#      This directory is served statically by Next.js at /courses/<course-name>/
#
#   3. EXECUTE KNITR
#      - Change working directory to the public figures directory
#      - Set fig.path = "" so figures are created in cwd with just chunk names
#      - Knit the Rmd file, outputting MDX to the course directory
#      - Figures are created as: <chunk-name>-<n>.png (e.g., statistics_essence-1.png)
#
#   4. POST-PROCESS MDX (fix_figure_paths)
#      Knitr outputs relative paths like: <Figure src="statistics_essence-1.png">
#      We transform these to web-absolute paths for Next.js:
#        <Figure src="/courses/statistics-1-foundations/statistics_essence-1.png">
#
#      The post-processor handles three patterns:
#        - Markdown: ![alt](file.png) -> ![alt](/courses/<name>/file.png)
#        - HTML img: <img src="file.png"> -> <img src="/courses/<name>/file.png">
#        - Figure component: <Figure src="file.png"> -> <Figure src="/courses/<name>/file.png">
#
# WHY THIS APPROACH:
#
#   - Knitr's fig.path controls BOTH where files are created AND the path written
#     to markdown. We can't set these independently.
#   - Setting fig.path to an absolute path like "/courses/..." would try to create
#     files at that filesystem path (not what we want).
#   - Solution: Create figures in the correct directory (via cwd), use simple
#     filenames, then post-process the MDX to add the web path prefix.
#
# RMD SETUP CHUNK:
#
#   Each Rmd file should have a setup chunk that defines how figures are rendered.
#   The custom plot hook transforms knitr's default markdown image syntax into
#   a <Figure> JSX component for the MDX/React infrastructure:
#
#     ```{r setup, include=FALSE}
#     knitr::knit_hooks$set(
#         plot = function(x, options) {
#             cap <- options$fig.cap
#             as.character(htmltools::tag(
#                 "Figure", list(src = x, alt = cap, paste("\n\t", cap, "\n", sep = ""))
#             ))
#         }
#     )
#     ```
#
# =============================================================================

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

# Figure settings (figures go to client/public/courses/<course-name>/)
FIGURE_DIR <- "figures"  # Legacy location - used for cleanup only
FIGURE_DPI <- 300
FIGURE_WIDTH <- 10
FIGURE_HEIGHT <- 7

# -----------------------------------------------------------------------------
# Parse command line arguments
# -----------------------------------------------------------------------------

parse_args <- function() {
    args <- commandArgs(trailingOnly = TRUE)

    opts <- list(
        course_path = NULL,  # Required: path to course directory
        clean = FALSE,       # Remove existing MDX files before build
        dry_run = FALSE,     # Show what would be done without doing it
        verbose = TRUE,      # Print detailed output
        force = FALSE        # Rebuild even if MDX is newer than Rmd
    )

    # Check for help first
    if (length(args) == 0 || any(args %in% c("--help", "-h"))) {
        show_help()
        quit(status = 0)
    }

    i <- 1
    while (i <= length(args)) {
        arg <- args[i]

        if (arg == "--clean") {
            opts$clean <- TRUE
            i <- i + 1
        } else if (arg == "--dry-run") {
            opts$dry_run <- TRUE
            i <- i + 1
        } else if (arg == "--quiet") {
            opts$verbose <- FALSE
            i <- i + 1
        } else if (arg == "--force") {
            opts$force <- TRUE
            i <- i + 1
        } else if (startsWith(arg, "--")) {
            cat("Unknown option:", arg, "\n")
            cat("Use --help for usage information.\n")
            quit(status = 1)
        } else {
            # Positional argument: course path
            if (is.null(opts$course_path)) {
                opts$course_path <- arg
            } else {
                cat("Error: Multiple paths provided. Only one course path allowed.\n")
                cat("Use --help for usage information.\n")
                quit(status = 1)
            }
            i <- i + 1
        }
    }

    # Validate course path was provided
    if (is.null(opts$course_path)) {
        cat("Error: Course path is required.\n\n")
        show_help()
        quit(status = 1)
    }

    return(opts)
}

show_help <- function() {
    cat("
Usage: Rscript build-courses.R <course-path> [OPTIONS]

REQUIRED:
  <course-path>    Path to the course directory (must contain src/*.Rmd files)

OPTIONS:
  --clean          Remove existing MDX files before building
  --dry-run        Show what would be done without doing it
  --force          Rebuild even if MDX is newer than Rmd

  --quiet          Suppress detailed output
  --help, -h       Show this help message

EXAMPLES:
  Rscript build-courses.R client/src/app/courses/posts/statistics-1-foundations
  Rscript build-courses.R ./statistics-1-foundations --clean --force
  Rscript build-courses.R /full/path/to/course --dry-run

DIRECTORY STRUCTURE:
  The course directory must have this structure:
    course-dir/
    ├── src/
    │   └── *.Rmd          <- Source files (required)
    ├── *.mdx              <- Output files (generated)
    └── figures/           <- Generated figures (generated)

")
}

# -----------------------------------------------------------------------------
# Logging utilities
# -----------------------------------------------------------------------------

LOG_FILE <- NULL

log_init <- function(log_path) {
    LOG_FILE <<- log_path
    timestamp <- format(Sys.time(), "%Y-%m-%d %H:%M:%S")
    writeLines(
        paste0("Build started: ", timestamp, "\n", strrep("=", 60), "\n"),
        LOG_FILE
    )
}

log_msg <- function(..., level = "INFO") {
    msg <- paste0("[", level, "] ", paste(..., collapse = " "))
    cat(msg, "\n")

    if (!is.null(LOG_FILE)) {
        cat(msg, "\n", file = LOG_FILE, append = TRUE)
    }
}

log_error <- function(...) log_msg(..., level = "ERROR")
log_warn <- function(...) log_msg(..., level = "WARN")
log_success <- function(...) log_msg(..., level = "OK")

# -----------------------------------------------------------------------------
# Find project root (directory containing client/)
# -----------------------------------------------------------------------------

find_project_root <- function(start_dir) {
    # Walk up from start_dir looking for a directory that contains client/
    current <- normalizePath(start_dir, mustWork = TRUE)

    # Maximum depth to search (prevent infinite loops)
    max_depth <- 20

    for (i in seq_len(max_depth)) {
        client_dir <- file.path(current, "client")
        if (dir.exists(client_dir)) {
            return(current)
        }

        parent <- dirname(current)
        if (parent == current) {
            # Reached filesystem root
            return(NULL)
        }
        current <- parent
    }

    return(NULL)
}

# -----------------------------------------------------------------------------
# Find Rmd files to build
# -----------------------------------------------------------------------------

find_rmd_files <- function(course_dir) {
    src_dir <- file.path(course_dir, "src")

    if (!dir.exists(src_dir)) {
        log_error("No src/ directory found in:", course_dir)
        return(character(0))
    }

    # Find all Rmd files recursively (supports nested chapter structure)
    rmd_files <- list.files(
        src_dir,
        pattern = "\\.Rmd$",
        full.names = TRUE,
        recursive = TRUE
    )

    return(rmd_files)
}

# -----------------------------------------------------------------------------
# Determine output path for MDX file
# -----------------------------------------------------------------------------

get_output_path <- function(rmd_path, course_dir) {
    # Input:  .../course/src/01-introduction/01-1_foo.Rmd
    # Output: .../course/01-introduction/01-1_foo.mdx
    #
    # The src/ subdirectory structure is preserved in the output.

    src_dir <- file.path(course_dir, "src")

    # Get relative path from src directory (preserves subdirectory structure)
    rel_path <- sub(paste0("^", gsub("([.|()\\^{}+$*?]|\\[|\\])", "\\\\\\1", src_dir), "/?"), "", rmd_path)

    # Change extension to .mdx
    mdx_rel_path <- sub("\\.Rmd$", ".mdx", rel_path)

    # Output path is course_dir + relative path (without src/)
    output_path <- file.path(course_dir, mdx_rel_path)

    # Ensure output directory exists
    output_dir <- dirname(output_path)
    if (!dir.exists(output_dir)) {
        dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
    }

    return(output_path)
}

# -----------------------------------------------------------------------------
# Check if rebuild is needed
# -----------------------------------------------------------------------------

needs_rebuild <- function(rmd_path, mdx_path, force = FALSE) {
    if (force) return(TRUE)
    if (!file.exists(mdx_path)) return(TRUE)

    rmd_mtime <- file.mtime(rmd_path)
    mdx_mtime <- file.mtime(mdx_path)

    return(rmd_mtime > mdx_mtime)
}

# -----------------------------------------------------------------------------
# Post-process MDX to fix figure paths
# -----------------------------------------------------------------------------

fix_figure_paths <- function(mdx_path, web_fig_path) {
    # Read the MDX content
    content <- readLines(mdx_path, warn = FALSE)

    # Pattern 1: Standard markdown image syntax ![alt](path)
    # Matches images like: ![caption](chunk_name-1.png)
    # Replaces with: ![caption](/courses/course-name/chunk_name-1.png)
    md_img_pattern <- "(!\\[[^]]*\\])\\(([^/)][^)]*\\.png)\\)"
    md_img_replacement <- paste0("\\1(", web_fig_path, "\\2)")
    content <- gsub(md_img_pattern, md_img_replacement, content, perl = TRUE)

    # Pattern 2: HTML img tags <img src="path" ...>
    # Matches: <img src="chunk_name-1.png" ...>
    # Replaces with: <img src="/courses/course-name/chunk_name-1.png" ...>
    html_img_pattern <- '(<img[^>]*src=")([^/"][^"]*\\.png)(")'
    html_img_replacement <- paste0("\\1", web_fig_path, "\\2\\3")
    content <- gsub(html_img_pattern, html_img_replacement, content, perl = TRUE)

    # Pattern 3: Custom Figure component <Figure src="path" ...>
    # Matches: <Figure src="chunk_name-1.png" ...>
    # Replaces with: <Figure src="/courses/course-name/chunk_name-1.png" ...>
    figure_pattern <- '(<Figure[^>]*src=")([^/"][^"]*\\.png)(")'
    figure_replacement <- paste0("\\1", web_fig_path, "\\2\\3")
    content <- gsub(figure_pattern, figure_replacement, content, perl = TRUE)

    # Write back
    writeLines(content, mdx_path)
}

# -----------------------------------------------------------------------------
# Build a single Rmd file
# -----------------------------------------------------------------------------

build_rmd <- function(rmd_path, course_dir, opts) {
    mdx_path <- get_output_path(rmd_path, course_dir)
    rmd_name <- basename(rmd_path)
    rmd_basename <- tools::file_path_sans_ext(rmd_name)

    log_msg("Building:", rmd_name)

    # Check if rebuild needed
    if (!needs_rebuild(rmd_path, mdx_path, opts$force)) {
        log_msg("  Skipping (up to date):", basename(mdx_path))
        return(list(status = "skipped", file = rmd_name))
    }

    if (opts$dry_run) {
        log_msg("  Would create:", mdx_path)
        return(list(status = "dry-run", file = rmd_name))
    }

    # Extract course name from directory path
    course_name <- basename(course_dir)

    # Find project root by looking for client/ directory
    project_root <- find_project_root(course_dir)
    if (is.null(project_root)) {
        log_error("  Could not find project root (client/ directory)")
        return(list(status = "error", file = rmd_name, error = "Could not find project root"))
    }

    # Figures go to client/public/courses/<course-name>/
    public_fig_dir <- file.path(project_root, "client", "public", "courses", course_name)
    dir.create(public_fig_dir, showWarnings = FALSE, recursive = TRUE)
    log_msg("  Figures output:", public_fig_dir)

    # The web path that will appear in the MDX for Next.js static serving
    web_fig_path <- paste0("/courses/", course_name, "/")

    # Save original working directory
    original_wd <- getwd()

    # Change to the public figures directory so figures are created there
    setwd(public_fig_dir)

    # Build using knitr with custom options
    result <- tryCatch({
        # Set knitr options for this document
        # fig.path is empty string so figures are created in cwd with just chunk name
        # We'll post-process the MDX to add the correct web path
        knitr::opts_chunk$set(
            fig.path = "",
            fig.width = FIGURE_WIDTH,
            fig.height = FIGURE_HEIGHT,
            dpi = FIGURE_DPI,
            echo = TRUE,
            warning = TRUE,
            message = TRUE,
            error = FALSE
        )

        # IMPORTANT: Set root.dir to the Rmd file's directory so relative paths
        # in code chunks (like "../data/primary/nhanes.csv") work correctly.
        # Without this, paths would be relative to public_fig_dir (the cwd).
        knitr::opts_knit$set(root.dir = dirname(rmd_path))

        # Knit the document
        md_output <- knitr::knit(
            input = rmd_path,
            output = mdx_path,
            quiet = !opts$verbose,
            envir = new.env()
        )

        log_success("  Created:", basename(mdx_path))

        # Post-process MDX to fix figure paths
        fix_figure_paths(mdx_path, web_fig_path)
        log_msg("  Fixed figure paths in MDX")

        list(status = "success", file = rmd_name, output = mdx_path)

    }, error = function(e) {
        log_error("  Failed:", rmd_name)
        log_error("  Error:", conditionMessage(e))
        list(status = "error", file = rmd_name, error = conditionMessage(e))
    })

    # Restore working directory
    setwd(original_wd)

    return(result)
}

# -----------------------------------------------------------------------------
# Clean existing MDX files and figures
# -----------------------------------------------------------------------------

clean_mdx_files <- function(course_dir, dry_run = FALSE) {
    log_msg("Cleaning existing MDX files and figures...")

    src_dir <- file.path(course_dir, "src")
    if (!dir.exists(src_dir)) return()

    course_name <- basename(course_dir)
    removed <- 0

    # Find all Rmd files recursively and remove corresponding MDX files
    rmd_files <- list.files(src_dir, pattern = "\\.Rmd$", recursive = TRUE, full.names = TRUE)
    for (rmd_file in rmd_files) {
        # Get the output path that would be generated for this Rmd
        mdx_path <- get_output_path(rmd_file, course_dir)

        if (file.exists(mdx_path)) {
            if (dry_run) {
                log_msg("  Would remove:", mdx_path)
            } else {
                file.remove(mdx_path)
                log_msg("  Removed:", mdx_path)
            }
            removed <- removed + 1
        }
    }

    # Clean figures from public directory
    project_root <- find_project_root(course_dir)
    if (!is.null(project_root)) {
        public_fig_dir <- file.path(project_root, "client", "public", "courses", course_name)
        if (dir.exists(public_fig_dir)) {
            # Only remove PNG files (figures), not the directory itself in case other files exist
            png_files <- list.files(public_fig_dir, pattern = "\\.png$", full.names = TRUE)
            if (length(png_files) > 0) {
                if (dry_run) {
                    log_msg("  Would remove", length(png_files), "figure(s) from:", public_fig_dir)
                } else {
                    file.remove(png_files)
                    log_msg("  Removed", length(png_files), "figure(s) from:", public_fig_dir)
                }
            }
        }
    }

    # Also clean old figures directory in course dir (legacy location)
    fig_dir <- file.path(course_dir, FIGURE_DIR)
    if (dir.exists(fig_dir)) {
        if (dry_run) {
            log_msg("  Would remove legacy figures:", fig_dir)
        } else {
            unlink(fig_dir, recursive = TRUE)
            log_msg("  Removed legacy figures:", fig_dir)
        }
    }

    log_msg("Cleaned", removed, "MDX file(s)")
}

# -----------------------------------------------------------------------------
# Main build function
# -----------------------------------------------------------------------------

main <- function() {
    opts <- parse_args()

    # Resolve course path to absolute path
    course_dir <- normalizePath(opts$course_path, mustWork = FALSE)

    # Validate course directory exists
    if (!dir.exists(course_dir)) {
        cat("Error: Course directory does not exist:", opts$course_path, "\n")
        quit(status = 1)
    }

    # Validate src/ directory exists
    src_dir <- file.path(course_dir, "src")
    if (!dir.exists(src_dir)) {
        cat("Error: No src/ directory found in:", opts$course_path, "\n")
        cat("Expected structure: course-dir/src/*.Rmd\n")
        quit(status = 1)
    }

    cat("\n")
    cat(strrep("=", 60), "\n")
    cat("  Rmd to MDX Build Script\n")
    cat(strrep("=", 60), "\n\n")

    # Initialize logging in the course directory
    log_init(file.path(course_dir, "rmd-build.log"))

    log_msg("Course directory:", course_dir)
    log_msg("Source directory:", src_dir)

    # Check for knitr
    if (!requireNamespace("knitr", quietly = TRUE)) {
        log_error("Package 'knitr' is required. Install with: install.packages('knitr')")
        quit(status = 1)
    }

    # Clean if requested
    if (opts$clean) {
        clean_mdx_files(course_dir, opts$dry_run)
        cat("\n")
    }

    # Find Rmd files
    rmd_files <- find_rmd_files(course_dir)

    if (length(rmd_files) == 0) {
        log_warn("No Rmd files found in:", src_dir)
        quit(status = 0)
    }

    log_msg("Found", length(rmd_files), "Rmd file(s) to process\n")

    # Build each file
    results <- list()
    for (rmd_file in rmd_files) {
        result <- build_rmd(rmd_file, course_dir, opts)
        results[[length(results) + 1]] <- result
    }

    # Summary
    cat("\n")
    cat(strrep("=", 60), "\n")
    cat("  Build Summary\n")
    cat(strrep("=", 60), "\n\n")

    statuses <- sapply(results, function(r) r$status)
    cat("  Success:", sum(statuses == "success"), "\n")
    cat("  Skipped:", sum(statuses == "skipped"), "\n")
    cat("  Errors: ", sum(statuses == "error"), "\n")
    if (opts$dry_run) {
        cat("  Dry-run:", sum(statuses == "dry-run"), "\n")
    }
    cat("  Total:  ", length(results), "\n\n")

    # Report errors
    errors <- results[statuses == "error"]
    if (length(errors) > 0) {
        cat("Failed files:\n")
        for (err in errors) {
            cat("  -", err$file, ":", err$error, "\n")
        }
        cat("\n")
    }

    log_msg("Build complete")

    # Exit with error if any builds failed
    if (sum(statuses == "error") > 0) {
        quit(status = 1)
    }
}

# -----------------------------------------------------------------------------
# Run
# -----------------------------------------------------------------------------

if (!interactive()) {
    main()
}
