#!/usr/bin/env Rscript
# =============================================================================
# Build Script: compile a course work's src/ -> dist/
# =============================================================================
#
# The successor to build-rmd.R for the recursive course layout. A "work" (a
# book/volume) lives under client/src/app/courses/posts/<family>/<work>/ and
# holds:
#   src/    authored sources (.Rmd + index.mdx)   <- you edit this
#   dist/   built output (.mdx + index.mdx)        <- generated, served, disposable
#
# Per file, by extension:
#   *.Rmd        -> knit through R (runs code, emits figures)  -> .mdx in dist/
#   *.mdx        -> copied through verbatim (the R step is skipped) -> dist/
#   index.Rmd / index.mdx are handled like any other file (a folder's own page).
# Folders named data/ or assets/, and dotfiles, are ignored.
#
# USAGE:
#   Rscript build-content.R <work-path> [OPTIONS]
#
#   <work-path>  A work directory containing a src/ folder, e.g.
#                client/src/app/courses/posts/<family>/<work>
#
# OPTIONS:
#   --clean      Remove this work's dist/ and its figures first
#   --dry-run    Show what would be done without doing it
#   --force      Rebuild even if dist output is newer than src
#   --quiet      Suppress detailed knitr output
#   --help, -h   Show this help message
#
# Figures are written to client/public/<section>/<basename(work)>/ and served
# from /<section>/<basename(work)>/ — matching the paths baked into the .mdx.
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
Usage: Rscript build-content.R <work-path> [OPTIONS]

  <work-path>  A work directory containing a src/ folder

OPTIONS:
  --clean      Remove this work's dist/ and its figures first
  --dry-run    Show what would be done without doing it
  --force      Rebuild even if dist output is newer than src
  --quiet      Suppress detailed knitr output
  --help, -h   Show this help message

EXAMPLE:
  Rscript build-content.R \\
    client/src/app/courses/posts/mathematical-statistics-with-R/mathematical-statistics-1-foundations

"
  )
}

parse_args <- function() {
  args <- commandArgs(trailingOnly = TRUE)
  opts <- list(work = NULL, clean = FALSE, dry_run = FALSE, verbose = TRUE, force = FALSE)

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
    } else if (is.null(opts$work)) {
      opts$work <- arg
    } else {
      cat("Error: only one work path is allowed.\n")
      quit(status = 1)
    }
  }

  if (is.null(opts$work)) {
    cat("Error: work path is required.\n\n")
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

# Figures land in public/<section>/<basename(work)>/, where <section> is the path
# component before "posts" (e.g. "courses").
get_figure_config <- function(work_dir, project_root) {
  parts <- strsplit(work_dir, .Platform$file.sep)[[1]]
  posts_idx <- which(parts == "posts")
  section <- if (length(posts_idx) > 0) parts[posts_idx[1] - 1] else "courses"
  work <- basename(work_dir)
  fig_dir <- file.path(project_root, "client", "public", section, work)
  web_path <- paste0("/", section, "/", work, "/")
  dir.create(fig_dir, showWarnings = FALSE, recursive = TRUE)
  list(fig_dir = fig_dir, web_path = web_path)
}

rel_path <- function(child, base) {
  base <- paste0(sub("/+$", "", base), "/")
  sub(paste0("^", gsub("([.|()\\^{}+$*?]|\\[|\\])", "\\\\\\1", base)), "", child)
}

discover_sources <- function(src_dir) {
  all <- list.files(src_dir, pattern = "\\.(Rmd|mdx)$", full.names = TRUE, recursive = TRUE)
  keep <- vapply(all, function(f) {
    segs <- strsplit(rel_path(f, src_dir), "/")[[1]]
    dirs <- segs[-length(segs)]
    if (any(dirs %in% IGNORED_DIR_NAMES)) return(FALSE)
    if (any(startsWith(segs, "."))) return(FALSE)
    TRUE
  }, logical(1))
  all[keep]
}

output_path <- function(src, src_dir, dist_dir) {
  rel <- sub("\\.Rmd$", ".mdx", rel_path(src, src_dir))
  out <- file.path(dist_dir, rel)
  dir.create(dirname(out), showWarnings = FALSE, recursive = TRUE)
  out
}

needs_rebuild <- function(src, out, force = FALSE) {
  if (force) return(TRUE)
  if (!file.exists(out)) return(TRUE)
  file.mtime(src) > file.mtime(out)
}

# -----------------------------------------------------------------------------
# Fix figure paths in generated MDX (bare *.png -> /<section>/<work>/*.png)
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

build_one <- function(src, src_dir, dist_dir, fig_config, opts) {
  out <- output_path(src, src_dir, dist_dir)
  name <- rel_path(src, src_dir)

  if (!needs_rebuild(src, out, opts$force)) {
    return(list(status = "skipped", file = name))
  }
  if (opts$dry_run) {
    log_msg("  Would write:", rel_path(out, dist_dir))
    return(list(status = "dry-run", file = name))
  }

  if (!grepl("\\.Rmd$", src)) {
    file.copy(src, out, overwrite = TRUE)
    log_success("  Copied:", name)
    return(list(status = "copied", file = name))
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
      fig.path = "",
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
# Main
# -----------------------------------------------------------------------------

main <- function() {
  opts <- parse_args()
  work_dir <- normalizePath(opts$work, mustWork = FALSE)

  if (!dir.exists(work_dir)) {
    cat("Error: directory does not exist:", opts$work, "\n")
    quit(status = 1)
  }
  src_dir <- file.path(work_dir, "src")
  if (!dir.exists(src_dir)) {
    cat("Error: no src/ directory found in:", opts$work, "\n")
    cat("Expected structure: <work>/src/*.Rmd\n")
    quit(status = 1)
  }
  if (!requireNamespace("knitr", quietly = TRUE)) {
    cat("Error: package 'knitr' is required.\n")
    quit(status = 1)
  }

  project_root <- find_project_root(work_dir)
  if (is.null(project_root)) {
    cat("Error: could not find project root (a directory containing client/).\n")
    quit(status = 1)
  }

  dist_dir <- file.path(work_dir, "dist")
  fig_config <- get_figure_config(work_dir, project_root)

  cat("\n", strrep("=", 60), "\n  Content Build\n", strrep("=", 60), "\n\n", sep = "")
  log_init(file.path(dist_dir, ".build.log"))
  log_msg("Work:    ", work_dir)
  log_msg("Source:  ", src_dir)
  log_msg("Output:  ", dist_dir)
  log_msg("Figures: ", fig_config$fig_dir, paste0("(", fig_config$web_path, ")"))

  if (opts$clean) {
    log_msg("Cleaning output...")
    if (opts$dry_run) {
      log_msg("  Would remove:", dist_dir, "and", fig_config$fig_dir)
    } else {
      unlink(dist_dir, recursive = TRUE)
      unlink(fig_config$fig_dir, recursive = TRUE)
      dir.create(fig_config$fig_dir, showWarnings = FALSE, recursive = TRUE)
      log_init(file.path(dist_dir, ".build.log"))
      log_msg("  Removed dist/ and figures")
    }
    cat("\n")
  }

  sources <- discover_sources(src_dir)
  if (length(sources) == 0) {
    log_warn("No .Rmd or .mdx sources found under:", src_dir)
    quit(status = 0)
  }
  log_msg("Found", length(sources), "source file(s)\n")

  results <- lapply(sources, build_one, src_dir = src_dir, dist_dir = dist_dir,
    fig_config = fig_config, opts = opts)

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
