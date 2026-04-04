#!/usr/bin/env Rscript
# =============================================================================
# Build Script: Compile Rmd files to MDX for derecksnotes.com
# =============================================================================
#
# Unified build script for both courses and dictionary definitions.
# Finds .Rmd files in a content directory's src/ folder, executes R code
# chunks using knitr, and outputs .mdx files for Next.js/MDX processing.
#
# USAGE:
#   Rscript build-rmd.R <content-path> [OPTIONS]
#
# REQUIRED:
#   <content-path>   Path to the content directory (must contain src/*.Rmd files)
#
# OPTIONS:
#   --clean          Remove existing MDX files before building
#   --dry-run        Show what would be done without doing it
#   --force          Rebuild even if MDX is newer than Rmd
#   --quiet          Suppress detailed output
#   --help, -h       Show this help message
#
# EXAMPLES:
#   # Build dictionary definitions
#   Rscript build-rmd.R client/src/app/dictionaries/mathematics/definitions
#   Rscript build-rmd.R client/src/app/dictionaries/mathematics/definitions --clean --force
#
#   # Build courses
#   Rscript build-rmd.R client/src/app/courses/posts/mathematical-statistics-with-R/mathematical-statistics-1-foundations
#
# CONTENT TYPES (auto-detected from path):
#
#   COURSES (path contains "courses"):
#     - Nested structure: src/01-chapter/file.Rmd → 01-chapter/file.mdx
#     - Figures: client/public/courses/<course-name>/
#     - fig.path = "" (chunks are uniquely named)
#     - Setup chunk in each Rmd provides the <Figure> plot hook
#
#   DICTIONARIES (path contains "dictionaries"):
#     - Flat structure: src/file.Rmd → file.mdx
#     - Figures: client/public/dictionaries/<subject>/
#     - fig.path = "<basename>-" (prefix for uniqueness)
#     - Build script injects the <Figure> plot hook (no setup chunks)
#
# =============================================================================

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

FIGURE_DPI <- 300
FIGURE_WIDTH <- 10
FIGURE_HEIGHT <- 7

# -----------------------------------------------------------------------------
# Parse command line arguments
# -----------------------------------------------------------------------------

parse_args <- function() {
    args <- commandArgs(trailingOnly = TRUE)

    opts <- list(
        content_path = NULL,
        clean = FALSE,
        dry_run = FALSE,
        verbose = TRUE,
        force = FALSE
    )

    if (length(args) == 0 || any(args %in% c("--help", "-h"))) {
        show_help()
        quit(status = 0)
    }

    i <- 1
    while (i <= length(args)) {
        arg <- args[i]

        if (arg == "--clean") {
            opts$clean <- TRUE
        } else if (arg == "--dry-run") {
            opts$dry_run <- TRUE
        } else if (arg == "--quiet") {
            opts$verbose <- FALSE
        } else if (arg == "--force") {
            opts$force <- TRUE
        } else if (startsWith(arg, "--")) {
            cat("Unknown option:", arg, "\n")
            cat("Use --help for usage information.\n")
            quit(status = 1)
        } else {
            if (is.null(opts$content_path)) {
                opts$content_path <- arg
            } else {
                cat("Error: Multiple paths provided. Only one content path allowed.\n")
                quit(status = 1)
            }
        }
        i <- i + 1
    }

    if (is.null(opts$content_path)) {
        cat("Error: Content path is required.\n\n")
        show_help()
        quit(status = 1)
    }

    return(opts)
}

show_help <- function() {
    cat("
Usage: Rscript build-rmd.R <content-path> [OPTIONS]

REQUIRED:
  <content-path>   Path to content directory (must contain src/*.Rmd files)

OPTIONS:
  --clean          Remove existing MDX files before building
  --dry-run        Show what would be done without doing it
  --force          Rebuild even if MDX is newer than Rmd
  --quiet          Suppress detailed output
  --help, -h       Show this help message

EXAMPLES:
  Rscript build-rmd.R client/src/app/dictionaries/mathematics/definitions
  Rscript build-rmd.R client/src/app/dictionaries/mathematics/definitions --clean --force
  Rscript build-rmd.R client/src/app/courses/posts/.../course-name

")
}

# -----------------------------------------------------------------------------
# Logging
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
# Content type detection
# -----------------------------------------------------------------------------

detect_content_type <- function(content_dir) {
    if (grepl("dictionaries", content_dir)) return("dictionary")
    return("course")
}

# -----------------------------------------------------------------------------
# Find project root (directory containing client/)
# -----------------------------------------------------------------------------

find_project_root <- function(start_dir) {
    current <- normalizePath(start_dir, mustWork = TRUE)
    max_depth <- 20

    for (i in seq_len(max_depth)) {
        client_dir <- file.path(current, "client")
        if (dir.exists(client_dir)) return(current)

        parent <- dirname(current)
        if (parent == current) return(NULL)
        current <- parent
    }

    return(NULL)
}

# -----------------------------------------------------------------------------
# Figure configuration
# -----------------------------------------------------------------------------

get_figure_config <- function(content_dir, content_type, project_root) {
    if (content_type == "dictionary") {
        # content_dir = .../dictionaries/mathematics/definitions
        subject <- basename(dirname(content_dir))  # "mathematics"
        fig_dir <- file.path(project_root, "client", "public", "dictionaries", subject)
        web_path <- paste0("/dictionaries/", subject, "/")
    } else {
        course_name <- basename(content_dir)
        fig_dir <- file.path(project_root, "client", "public", "courses", course_name)
        web_path <- paste0("/courses/", course_name, "/")
    }

    dir.create(fig_dir, showWarnings = FALSE, recursive = TRUE)
    list(fig_dir = fig_dir, web_path = web_path)
}

# -----------------------------------------------------------------------------
# Find Rmd files
# -----------------------------------------------------------------------------

find_rmd_files <- function(content_dir) {
    src_dir <- file.path(content_dir, "src")

    if (!dir.exists(src_dir)) {
        log_error("No src/ directory found in:", content_dir)
        return(character(0))
    }

    list.files(src_dir, pattern = "\\.Rmd$", full.names = TRUE, recursive = TRUE)
}

# -----------------------------------------------------------------------------
# Output path: courses (nested) vs dictionaries (flat)
# -----------------------------------------------------------------------------

get_output_path <- function(rmd_path, content_dir, content_type) {
    if (content_type == "dictionary") {
        # Flat: src/foo.Rmd → content_dir/foo.mdx
        mdx_name <- sub("\\.Rmd$", ".mdx", basename(rmd_path))
        return(file.path(content_dir, mdx_name))
    }

    # Course: preserve subdirectory structure from src/
    src_dir <- file.path(content_dir, "src")
    rel_path <- sub(
        paste0("^", gsub("([.|()\\^{}+$*?]|\\[|\\])", "\\\\\\1", src_dir), "/?"),
        "", rmd_path
    )
    mdx_rel_path <- sub("\\.Rmd$", ".mdx", rel_path)
    output_path <- file.path(content_dir, mdx_rel_path)

    output_dir <- dirname(output_path)
    if (!dir.exists(output_dir)) {
        dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)
    }

    return(output_path)
}

# -----------------------------------------------------------------------------
# Check if rebuild needed
# -----------------------------------------------------------------------------

needs_rebuild <- function(rmd_path, mdx_path, force = FALSE) {
    if (force) return(TRUE)
    if (!file.exists(mdx_path)) return(TRUE)
    file.mtime(rmd_path) > file.mtime(mdx_path)
}

# -----------------------------------------------------------------------------
# Post-process MDX to fix figure paths
# -----------------------------------------------------------------------------

fix_figure_paths <- function(mdx_path, web_fig_path) {
    content <- readLines(mdx_path, warn = FALSE)

    # Markdown images: ![alt](file.png) → ![alt](/path/file.png)
    md_pattern <- "(!\\[[^]]*\\])\\(([^/)][^)]*\\.png)\\)"
    content <- gsub(md_pattern, paste0("\\1(", web_fig_path, "\\2)"), content, perl = TRUE)

    # HTML img: <img src="file.png"> → <img src="/path/file.png">
    html_pattern <- '(<img[^>]*src=")([^/"][^"]*\\.png)(")'
    content <- gsub(html_pattern, paste0("\\1", web_fig_path, "\\2\\3"), content, perl = TRUE)

    # Figure component: <Figure src="file.png"> → <Figure src="/path/file.png">
    fig_pattern <- '(<Figure[^>]*src=")([^/"][^"]*\\.png)(")'
    content <- gsub(fig_pattern, paste0("\\1", web_fig_path, "\\2\\3"), content, perl = TRUE)

    writeLines(content, mdx_path)
}

# -----------------------------------------------------------------------------
# Build a single Rmd file
# -----------------------------------------------------------------------------

build_rmd <- function(rmd_path, content_dir, content_type, fig_config, opts) {
    mdx_path <- get_output_path(rmd_path, content_dir, content_type)
    rmd_name <- basename(rmd_path)
    rmd_basename <- tools::file_path_sans_ext(rmd_name)

    log_msg("Building:", rmd_name)

    if (!needs_rebuild(rmd_path, mdx_path, opts$force)) {
        log_msg("  Skipping (up to date):", basename(mdx_path))
        return(list(status = "skipped", file = rmd_name))
    }

    if (opts$dry_run) {
        log_msg("  Would create:", mdx_path)
        return(list(status = "dry-run", file = rmd_name))
    }

    original_wd <- getwd()

    # Change to figure output directory so knitr creates figures there
    setwd(fig_config$fig_dir)

    result <- tryCatch({
        # Ensure knitr produces proper markdown output (fenced code blocks etc.)
        knitr::render_markdown()

        # Always inject the <Figure> plot hook
        # For courses, the Rmd's own setup chunk overrides this
        # For dictionaries (no setup chunk), this is the only hook
        knitr::knit_hooks$set(
            plot = function(x, options) {
                cap <- options$fig.cap
                as.character(htmltools::tag(
                    "Figure",
                    list(src = x, alt = cap, paste("\n\t", cap, "\n", sep = ""))
                ))
            }
        )

        # Set figure path based on content type
        fig_path <- if (content_type == "dictionary") {
            paste0(rmd_basename, "-")
        } else {
            ""
        }

        knitr::opts_chunk$set(
            fig.path = fig_path,
            fig.width = FIGURE_WIDTH,
            fig.height = FIGURE_HEIGHT,
            dpi = FIGURE_DPI,
            dev = "png",
            echo = TRUE,
            warning = TRUE,
            message = TRUE,
            error = FALSE
        )

        # Set root.dir to the Rmd file's directory so relative paths
        # in code chunks (like "../data/file.csv") work correctly
        knitr::opts_knit$set(root.dir = dirname(rmd_path))

        md_output <- knitr::knit(
            input = rmd_path,
            output = mdx_path,
            quiet = !opts$verbose,
            envir = new.env()
        )

        log_success("  Created:", basename(mdx_path))

        fix_figure_paths(mdx_path, fig_config$web_path)
        log_msg("  Fixed figure paths in MDX")

        list(status = "success", file = rmd_name, output = mdx_path)

    }, error = function(e) {
        log_error("  Failed:", rmd_name)
        log_error("  Error:", conditionMessage(e))
        list(status = "error", file = rmd_name, error = conditionMessage(e))
    })

    setwd(original_wd)
    return(result)
}

# -----------------------------------------------------------------------------
# Clean existing MDX files and figures
# -----------------------------------------------------------------------------

clean_output <- function(content_dir, content_type, project_root, dry_run = FALSE) {
    log_msg("Cleaning existing output...")

    src_dir <- file.path(content_dir, "src")
    if (!dir.exists(src_dir)) return()

    removed <- 0

    # Remove MDX files that correspond to Rmd sources
    rmd_files <- list.files(src_dir, pattern = "\\.Rmd$", recursive = TRUE, full.names = TRUE)
    for (rmd_file in rmd_files) {
        mdx_path <- get_output_path(rmd_file, content_dir, content_type)
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
    fig_config <- get_figure_config(content_dir, content_type, project_root)
    if (dir.exists(fig_config$fig_dir)) {
        png_files <- list.files(fig_config$fig_dir, pattern = "\\.png$", full.names = TRUE)
        if (length(png_files) > 0) {
            if (dry_run) {
                log_msg("  Would remove", length(png_files), "figure(s) from:", fig_config$fig_dir)
            } else {
                file.remove(png_files)
                log_msg("  Removed", length(png_files), "figure(s) from:", fig_config$fig_dir)
            }
        }

        # Clean old *_files/ subdirectories (legacy from rmarkdown::render)
        old_dirs <- list.dirs(fig_config$fig_dir, recursive = FALSE, full.names = TRUE)
        files_dirs <- old_dirs[grepl("_files$", old_dirs)]
        if (length(files_dirs) > 0) {
            if (dry_run) {
                log_msg("  Would remove", length(files_dirs), "legacy *_files/ dir(s)")
            } else {
                unlink(files_dirs, recursive = TRUE)
                log_msg("  Removed", length(files_dirs), "legacy *_files/ dir(s)")
            }
        }
    }

    log_msg("Cleaned", removed, "MDX file(s)")
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

main <- function() {
    opts <- parse_args()
    content_dir <- normalizePath(opts$content_path, mustWork = FALSE)

    if (!dir.exists(content_dir)) {
        cat("Error: Directory does not exist:", opts$content_path, "\n")
        quit(status = 1)
    }

    src_dir <- file.path(content_dir, "src")
    if (!dir.exists(src_dir)) {
        cat("Error: No src/ directory found in:", opts$content_path, "\n")
        cat("Expected structure: content-dir/src/*.Rmd\n")
        quit(status = 1)
    }

    content_type <- detect_content_type(content_dir)

    cat("\n")
    cat(strrep("=", 60), "\n")
    cat("  Rmd to MDX Build Script\n")
    cat(strrep("=", 60), "\n\n")

    log_init(file.path(content_dir, "rmd-build.log"))

    log_msg("Content directory:", content_dir)
    log_msg("Content type:", content_type)
    log_msg("Source directory:", src_dir)

    if (!requireNamespace("knitr", quietly = TRUE)) {
        log_error("Package 'knitr' is required. Install with: install.packages('knitr')")
        quit(status = 1)
    }

    project_root <- find_project_root(content_dir)
    if (is.null(project_root)) {
        log_error("Could not find project root (directory containing client/)")
        quit(status = 1)
    }
    log_msg("Project root:", project_root)

    fig_config <- get_figure_config(content_dir, content_type, project_root)
    log_msg("Figures output:", fig_config$fig_dir)
    log_msg("Figure web path:", fig_config$web_path)

    if (opts$clean) {
        clean_output(content_dir, content_type, project_root, opts$dry_run)
        cat("\n")
    }

    rmd_files <- find_rmd_files(content_dir)

    if (length(rmd_files) == 0) {
        log_warn("No Rmd files found in:", src_dir)
        quit(status = 0)
    }

    log_msg("Found", length(rmd_files), "Rmd file(s) to process\n")

    results <- list()
    for (rmd_file in rmd_files) {
        result <- build_rmd(rmd_file, content_dir, content_type, fig_config, opts)
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

    errors <- results[statuses == "error"]
    if (length(errors) > 0) {
        cat("Failed files:\n")
        for (err in errors) {
            cat("  -", err$file, ":", err$error, "\n")
        }
        cat("\n")
    }

    log_msg("Build complete")

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
