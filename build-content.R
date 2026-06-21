#!/usr/bin/env Rscript
# =============================================================================
# Build Script: compile a content work's src/ -> served output
# =============================================================================
#
# One unified build for both courses and dictionary definitions. Finds .Rmd
# (and, for courses, .mdx) sources under a content directory's src/ folder,
# knits the R code, emits figures, and writes .mdx for Next.js/MDX.
#
# The output SHAPE is chosen from the content type, auto-detected from the path:
#
#   COURSES (default; path does NOT contain "dictionaries")
#     - Nested: src/01-chapter/file.Rmd -> built/01-chapter/file.mdx
#     - .mdx sources are copied through verbatim (the R step is skipped)
#     - Output lives in a sibling built/ dir (generated, served, disposable)
#     - Figures: client/public/<section>/<basename(work)>/   (section = the
#       path component before "posts", normally "courses")
#     - fig.path = ""  (chunk names are globally unique within a work)
#     - Folders named data/ or assets/ (or node_modules), and dotfiles, ignored
#
#   DICTIONARIES (path contains "dictionaries")
#     - Flat: src/foo.Rmd -> foo.mdx  (beside src/, the dir the route reads)
#     - .Rmd only
#     - Figures: client/public/dictionaries/<subject>/   (subject = the dir
#       that contains definitions/, e.g. "mathematics")
#     - fig.path = "<basename>-"  (prefix keeps figures unique in the one flat
#       per-subject dir shared by every definition)
#
# USAGE:
#   Rscript build-content.R <content-path> [OPTIONS]
#
#   <content-path>  A directory containing a src/ folder, e.g.
#     client/src/app/courses/posts/<family>/<work>
#     client/src/app/dictionaries/<subject>/definitions
#
# OPTIONS:
#   --clean      Remove this work's prior output and its figures first
#   --dry-run    Show what would be done without doing it
#   --force      Rebuild even if output is newer than src
#   --quiet      Suppress detailed knitr output
#   --help, -h   Show this help message
#
# EXAMPLES:
#   Rscript build-content.R \
#     client/src/app/courses/posts/mathematical-statistics-with-R/mathematical-statistics-1-foundations
#   Rscript build-content.R client/src/app/dictionaries/mathematics/definitions --clean --force
# =============================================================================

FIGURE_DPI <- 250
FIGURE_WIDTH <- 10
FIGURE_HEIGHT <- 7

IGNORED_DIR_NAMES <- c("data", "assets", "node_modules")

# -----------------------------------------------------------------------------
# Args
# -----------------------------------------------------------------------------

show_help <- function() {
  cat(
    "
Usage: Rscript build-content.R <content-path> [OPTIONS]

  <content-path>  A directory containing a src/ folder. Courses build a nested
                  sibling built/ tree; dictionaries build flat .mdx beside src/.

OPTIONS:
  --clean      Remove this work's prior output and its figures first
  --dry-run    Show what would be done without doing it
  --force      Rebuild even if output is newer than src
  --quiet      Suppress detailed knitr output
  --help, -h   Show this help message

EXAMPLES:
  Rscript build-content.R \\
    client/src/app/courses/posts/mathematical-statistics-with-R/mathematical-statistics-1-foundations
  Rscript build-content.R client/src/app/dictionaries/mathematics/definitions --clean --force

"
  )
}

parse_args <- function() {
  args <- commandArgs(trailingOnly = TRUE)
  opts <- list(path = NULL, clean = FALSE, dry_run = FALSE, verbose = TRUE, force = FALSE)

  if (length(args) == 0 || any(args %in% c("--help", "-h"))) {
    show_help()
    quit(status = 0)
  }

  for (arg in args) {
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
      quit(status = 1)
    } else if (is.null(opts$path)) {
      opts$path <- arg
    } else {
      cat("Error: only one content path is allowed.\n")
      quit(status = 1)
    }
  }

  if (is.null(opts$path)) {
    cat("Error: content path is required.\n\n")
    show_help()
    quit(status = 1)
  }

  opts
}

# -----------------------------------------------------------------------------
# Logging
# -----------------------------------------------------------------------------

LOG_FILE <- NULL

log_init <- function(log_path) {
  LOG_FILE <<- log_path
  dir.create(dirname(log_path), showWarnings = FALSE, recursive = TRUE)
  writeLines(
    paste0("Build started: ", format(Sys.time(), "%Y-%m-%d %H:%M:%S"), "\n", strrep("=", 60), "\n"),
    LOG_FILE
  )
}

log_msg <- function(..., level = "INFO") {
  msg <- paste0("[", level, "] ", paste(..., collapse = " "))
  cat(msg, "\n")
  if (!is.null(LOG_FILE)) cat(msg, "\n", file = LOG_FILE, append = TRUE)
}
log_error <- function(...) log_msg(..., level = "ERROR")
log_warn <- function(...) log_msg(..., level = "WARN")
log_success <- function(...) log_msg(..., level = "OK")

# -----------------------------------------------------------------------------
# Content type
# -----------------------------------------------------------------------------

detect_content_type <- function(content_dir) {
  if (grepl("dictionaries", content_dir)) "dictionary" else "course"
}

# -----------------------------------------------------------------------------
# Roots / figures
# -----------------------------------------------------------------------------

find_project_root <- function(start_dir) {
  current <- normalizePath(start_dir, mustWork = TRUE)
  for (i in seq_len(20)) {
    if (dir.exists(file.path(current, "client"))) return(current)
    parent <- dirname(current)
    if (parent == current) return(NULL)
    current <- parent
  }
  NULL
}

# Where figures are written, and the web path baked into the built .mdx.
#   dictionary: public/dictionaries/<subject>/   (subject = parent of definitions/)
#   course:     public/<section>/<basename(work)>/   (section = component before posts/)
get_figure_config <- function(content_dir, content_type, project_root) {
  if (content_type == "dictionary") {
    subject <- basename(dirname(content_dir))
    fig_dir <- file.path(project_root, "client", "public", "dictionaries", subject)
    web_path <- paste0("/dictionaries/", subject, "/")
  } else {
    parts <- strsplit(content_dir, .Platform$file.sep)[[1]]
    posts_idx <- which(parts == "posts")
    section <- if (length(posts_idx) > 0) parts[posts_idx[1] - 1] else "courses"
    work <- basename(content_dir)
    fig_dir <- file.path(project_root, "client", "public", section, work)
    web_path <- paste0("/", section, "/", work, "/")
  }
  dir.create(fig_dir, showWarnings = FALSE, recursive = TRUE)
  list(fig_dir = fig_dir, web_path = web_path)
}

rel_path <- function(child, base) {
  base <- paste0(sub("/+$", "", base), "/")
  sub(paste0("^", gsub("([.|()\\^{}+$*?]|\\[|\\])", "\\\\\\1", base)), "", child)
}

# Courses knit .Rmd and copy .mdx; dictionaries are .Rmd only. Both skip
# data/, assets/, node_modules/, and dotfiles.
discover_sources <- function(src_dir, content_type) {
  pattern <- if (content_type == "dictionary") "\\.Rmd$" else "\\.(Rmd|mdx)$"
  all <- list.files(src_dir, pattern = pattern, full.names = TRUE, recursive = TRUE)
  keep <- vapply(all, function(f) {
    segs <- strsplit(rel_path(f, src_dir), "/")[[1]]
    dirs <- segs[-length(segs)]
    if (any(dirs %in% IGNORED_DIR_NAMES)) return(FALSE)
    if (any(startsWith(segs, "."))) return(FALSE)
    TRUE
  }, logical(1))
  all[keep]
}

# Output location.
#   dictionary: flat basename beside src/ (out_base IS the content dir)
#   course:     mirror the src/ subtree into built/
output_path <- function(src, src_dir, out_base, content_type) {
  if (content_type == "dictionary") {
    mdx_name <- sub("\\.Rmd$", ".mdx", basename(src))
    return(file.path(out_base, mdx_name))
  }
  rel <- sub("\\.Rmd$", ".mdx", rel_path(src, src_dir))
  out <- file.path(out_base, rel)
  dir.create(dirname(out), showWarnings = FALSE, recursive = TRUE)
  out
}

needs_rebuild <- function(src, out, force = FALSE) {
  if (force) return(TRUE)
  if (!file.exists(out)) return(TRUE)
  file.mtime(src) > file.mtime(out)
}

# -----------------------------------------------------------------------------
# Fix figure paths in generated MDX (bare *.png -> <web>/*.png)
# -----------------------------------------------------------------------------

fix_figure_paths <- function(mdx_path, web_fig_path) {
  content <- readLines(mdx_path, warn = FALSE)
  content <- gsub("(!\\[[^]]*\\])\\(([^/)][^)]*\\.png)\\)",
    paste0("\\1(", web_fig_path, "\\2)"), content, perl = TRUE)
  content <- gsub('(<img[^>]*src=")([^/"][^"]*\\.png)(")',
    paste0("\\1", web_fig_path, "\\2\\3"), content, perl = TRUE)
  content <- gsub('(<Figure[^>]*src=")([^/"][^"]*\\.png)(")',
    paste0("\\1", web_fig_path, "\\2\\3"), content, perl = TRUE)
  writeLines(content, mdx_path)
}

# -----------------------------------------------------------------------------
# Build one source file
# -----------------------------------------------------------------------------

build_one <- function(src, src_dir, out_base, content_type, fig_config, opts) {
  out <- output_path(src, src_dir, out_base, content_type)
  name <- rel_path(src, src_dir)

  if (!needs_rebuild(src, out, opts$force)) {
    return(list(status = "skipped", file = name))
  }
  if (opts$dry_run) {
    log_msg("  Would write:", rel_path(out, out_base))
    return(list(status = "dry-run", file = name))
  }

  if (!grepl("\\.Rmd$", src)) {
    file.copy(src, out, overwrite = TRUE)
    log_success("  Copied:", name)
    return(list(status = "copied", file = name))
  }

  # Dictionaries share one flat figure dir per subject, so prefix figures with
  # the file's basename to keep them unique; course chunk names are unique
  # within a work, so no prefix is needed.
  fig_path <- if (content_type == "dictionary") {
    paste0(tools::file_path_sans_ext(basename(src)), "-")
  } else {
    ""
  }

  original_wd <- getwd()
  setwd(fig_config$fig_dir) # knitr writes figures here

  result <- tryCatch({
    knitr::render_markdown()
    knitr::knit_hooks$set(
      plot = function(x, options) {
        cap <- options$fig.cap
        as.character(htmltools::tag(
          "Figure", list(src = x, alt = cap, paste("\n\t", cap, "\n", sep = ""))
        ))
      }
    )
    knitr::opts_chunk$set(
      fig.path = fig_path,
      fig.width = FIGURE_WIDTH,
      fig.height = FIGURE_HEIGHT,
      dpi = FIGURE_DPI,
      dev = "png",
      echo = TRUE,
      results = "hold",
      warning = TRUE,
      message = TRUE,
      error = FALSE
    )
    knitr::opts_knit$set(root.dir = dirname(src))

    knitr::knit(input = src, output = out, quiet = !opts$verbose, envir = new.env())
    fix_figure_paths(out, fig_config$web_path)
    log_success("  Knit:", name)
    list(status = "success", file = name, output = out)
  }, error = function(e) {
    log_error("  Failed:", name, "-", conditionMessage(e))
    list(status = "error", file = name, error = conditionMessage(e))
  })

  setwd(original_wd)
  result
}

# -----------------------------------------------------------------------------
# Clean prior output
#   course:     wipe the whole built/ tree and figure dir (all disposable)
#   dictionary: remove only the .mdx that correspond to .Rmd sources (they sit
#               beside hand-authored files), plus figures in the subject dir
# -----------------------------------------------------------------------------

clean_output <- function(content_dir, src_dir, out_base, content_type, fig_config, opts) {
  log_msg("Cleaning output...")

  if (content_type != "dictionary") {
    if (opts$dry_run) {
      log_msg("  Would remove:", out_base, "and", fig_config$fig_dir)
    } else {
      unlink(out_base, recursive = TRUE)
      unlink(fig_config$fig_dir, recursive = TRUE)
      dir.create(fig_config$fig_dir, showWarnings = FALSE, recursive = TRUE)
      log_msg("  Removed built/ and figures")
    }
    return(invisible())
  }

  # dictionary: selective removal
  removed <- 0
  rmd_files <- list.files(src_dir, pattern = "\\.Rmd$", recursive = TRUE, full.names = TRUE)
  for (rmd_file in rmd_files) {
    mdx_path <- output_path(rmd_file, src_dir, out_base, content_type)
    if (file.exists(mdx_path)) {
      if (opts$dry_run) {
        log_msg("  Would remove:", mdx_path)
      } else {
        file.remove(mdx_path)
      }
      removed <- removed + 1
    }
  }

  if (dir.exists(fig_config$fig_dir)) {
    png_files <- list.files(fig_config$fig_dir, pattern = "\\.png$", full.names = TRUE)
    if (length(png_files) > 0) {
      if (opts$dry_run) {
        log_msg("  Would remove", length(png_files), "figure(s) from:", fig_config$fig_dir)
      } else {
        file.remove(png_files)
        log_msg("  Removed", length(png_files), "figure(s)")
      }
    }
    # Legacy *_files/ subdirectories (from old rmarkdown::render)
    old_dirs <- list.dirs(fig_config$fig_dir, recursive = FALSE, full.names = TRUE)
    files_dirs <- old_dirs[grepl("_files$", old_dirs)]
    if (length(files_dirs) > 0 && !opts$dry_run) {
      unlink(files_dirs, recursive = TRUE)
    }
  }

  log_msg("Cleaned", removed, "MDX file(s)")
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

main <- function() {
  opts <- parse_args()
  content_dir <- normalizePath(opts$path, mustWork = FALSE)

  if (!dir.exists(content_dir)) {
    cat("Error: directory does not exist:", opts$path, "\n")
    quit(status = 1)
  }
  src_dir <- file.path(content_dir, "src")
  if (!dir.exists(src_dir)) {
    cat("Error: no src/ directory found in:", opts$path, "\n")
    cat("Expected structure: <content-path>/src/*.Rmd\n")
    quit(status = 1)
  }
  if (!requireNamespace("knitr", quietly = TRUE)) {
    cat("Error: package 'knitr' is required.\n")
    quit(status = 1)
  }

  project_root <- find_project_root(content_dir)
  if (is.null(project_root)) {
    cat("Error: could not find project root (a directory containing client/).\n")
    quit(status = 1)
  }

  content_type <- detect_content_type(content_dir)
  fig_config <- get_figure_config(content_dir, content_type, project_root)

  # Courses emit into a sibling built/; dictionaries emit flat into the dir
  # the route reads. The log lives with the output in both cases.
  if (content_type == "dictionary") {
    out_base <- content_dir
    log_path <- file.path(content_dir, "rmd-build.log")
  } else {
    out_base <- file.path(content_dir, "built")
    log_path <- file.path(out_base, ".build.log")
  }

  cat("\n", strrep("=", 60), "\n  Content Build\n", strrep("=", 60), "\n\n", sep = "")
  log_init(log_path)
  log_msg("Content: ", content_dir)
  log_msg("Type:    ", content_type)
  log_msg("Source:  ", src_dir)
  log_msg("Output:  ", out_base)
  log_msg("Figures: ", fig_config$fig_dir, paste0("(", fig_config$web_path, ")"))

  if (opts$clean) {
    clean_output(content_dir, src_dir, out_base, content_type, fig_config, opts)
    # The course log lives inside built/, which clean just wiped: re-open it.
    if (content_type != "dictionary" && !opts$dry_run) log_init(log_path)
    cat("\n")
  }

  sources <- discover_sources(src_dir, content_type)
  if (length(sources) == 0) {
    log_warn("No source files found under:", src_dir)
    quit(status = 0)
  }
  log_msg("Found", length(sources), "source file(s)\n")

  results <- lapply(sources, build_one, src_dir = src_dir, out_base = out_base,
    content_type = content_type, fig_config = fig_config, opts = opts)

  statuses <- vapply(results, function(r) r$status, character(1))
  cat("\n", strrep("=", 60), "\n  Summary\n", strrep("=", 60), "\n\n", sep = "")
  cat("  Knit:   ", sum(statuses == "success"), "\n")
  cat("  Copied: ", sum(statuses == "copied"), "\n")
  cat("  Skipped:", sum(statuses == "skipped"), "\n")
  cat("  Errors: ", sum(statuses == "error"), "\n")
  if (opts$dry_run) cat("  Dry-run:", sum(statuses == "dry-run"), "\n")
  cat("  Total:  ", length(results), "\n\n")

  errors <- results[statuses == "error"]
  if (length(errors) > 0) {
    cat("Failed files:\n")
    for (e in errors) cat("  -", e$file, ":", e$error, "\n")
    quit(status = 1)
  }
  log_msg("Build complete")
}

if (!interactive()) main()
