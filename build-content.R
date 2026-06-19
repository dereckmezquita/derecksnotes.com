#!/usr/bin/env Rscript
# =============================================================================
# Build Script: compile a recursive content tree (source -> output)
# =============================================================================
#
# The successor to build-rmd.R for the new recursive content layout. Source
# lives under client/content/<section>/...; built output is written to the
# parallel client/content-dist/<section>/... tree. The output tree is fully
# disposable: delete it and rebuild from source with no loss, because every
# hand-edited file (titles, summaries, index pages) lives in source.
#
# Per file, by extension:
#   *.Rmd        -> knit through R (runs code, emits figures)  -> .mdx in dist
#   *.mdx        -> copied through verbatim (the R step is skipped) -> dist
#   index.Rmd/.mdx are handled exactly like any other leaf (a folder's own page).
# Folders named data/ or assets/, and dotfiles, are ignored.
#
# USAGE:
#   Rscript build-content.R <source-path> [OPTIONS]
#
#   <source-path>  A directory under client/content/ (usually one "work", e.g. a
#                  volume). Built recursively.
#
# OPTIONS:
#   --clean        Remove this work's output (dist subtree + figures) first
#   --dry-run      Show what would be done without doing it
#   --force        Rebuild even if output is newer than source
#   --quiet        Suppress detailed knitr output
#   --help, -h     Show this help message
#
# EXAMPLE:
#   Rscript build-content.R \
#     client/content/courses/mathematical-statistics-with-R/mathematical-statistics-1-foundations
#
# Figures are written to client/public/<section>/<basename(source-path)>/ and
# served from /<section>/<basename(source-path)>/ — matching the figure web
# paths already baked into the built .mdx.
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
Usage: Rscript build-content.R <source-path> [OPTIONS]

  <source-path>  A directory under client/content/ (built recursively)

OPTIONS:
  --clean        Remove this work's output (dist subtree + figures) first
  --dry-run      Show what would be done without doing it
  --force        Rebuild even if output is newer than source
  --quiet        Suppress detailed knitr output
  --help, -h     Show this help message

EXAMPLE:
  Rscript build-content.R \\
    client/content/courses/mathematical-statistics-with-R/mathematical-statistics-1-foundations

"
  )
}

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
    } else if (is.null(opts$content_path)) {
      opts$content_path <- arg
    } else {
      cat("Error: only one source path is allowed.\n")
      quit(status = 1)
    }
  }

  if (is.null(opts$content_path)) {
    cat("Error: source path is required.\n\n")
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
# Roots
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

# Path of `child` relative to `base` (both absolute, normalized).
rel_path <- function(child, base) {
  base <- paste0(sub("/+$", "", base), "/")
  sub(paste0("^", gsub("([.|()\\^{}+$*?]|\\[|\\])", "\\\\\\1", base)), "", child)
}

# -----------------------------------------------------------------------------
# Figure config: /<section>/<basename(source-path)>/ (flat, matches built mdx)
# -----------------------------------------------------------------------------

get_figure_config <- function(content_dir, content_root, project_root) {
  rel <- rel_path(content_dir, content_root) # e.g. courses/<family>/<volume>
  section <- strsplit(rel, "/")[[1]][1]
  work <- basename(content_dir)
  fig_dir <- file.path(project_root, "client", "public", section, work)
  web_path <- paste0("/", section, "/", work, "/")
  dir.create(fig_dir, showWarnings = FALSE, recursive = TRUE)
  list(fig_dir = fig_dir, web_path = web_path)
}

# -----------------------------------------------------------------------------
# Discover source files (.Rmd + .mdx), skipping data/, assets/, dotfiles
# -----------------------------------------------------------------------------

discover_sources <- function(content_dir) {
  all <- list.files(
    content_dir,
    pattern = "\\.(Rmd|mdx)$",
    full.names = TRUE,
    recursive = TRUE
  )
  keep <- vapply(all, function(f) {
    rel <- rel_path(f, content_dir)
    segs <- strsplit(rel, "/")[[1]]
    dirs <- segs[-length(segs)]
    if (any(dirs %in% IGNORED_DIR_NAMES)) return(FALSE)
    if (any(startsWith(segs, "."))) return(FALSE)
    TRUE
  }, logical(1))
  all[keep]
}

output_path <- function(src, content_root, dist_root) {
  rel <- rel_path(src, content_root)
  rel <- sub("\\.Rmd$", ".mdx", rel)
  out <- file.path(dist_root, rel)
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

build_one <- function(src, content_root, dist_root, fig_config, opts) {
  out <- output_path(src, content_root, dist_root)
  name <- rel_path(src, content_root)

  if (!needs_rebuild(src, out, opts$force)) {
    return(list(status = "skipped", file = name))
  }
  if (opts$dry_run) {
    log_msg("  Would write:", rel_path(out, dist_root))
    return(list(status = "dry-run", file = name))
  }

  is_rmd <- grepl("\\.Rmd$", src)

  if (!is_rmd) {
    # Plain MDX: copy through, no R.
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
# Clean this work's output
# -----------------------------------------------------------------------------

clean_output <- function(content_dir, content_root, dist_root, fig_config, dry_run = FALSE) {
  log_msg("Cleaning output...")
  dist_subtree <- file.path(dist_root, rel_path(content_dir, content_root))
  if (dir.exists(dist_subtree)) {
    if (dry_run) {
      log_msg("  Would remove dist subtree:", dist_subtree)
    } else {
      unlink(dist_subtree, recursive = TRUE)
      log_msg("  Removed dist subtree:", dist_subtree)
    }
  }
  if (dir.exists(fig_config$fig_dir)) {
    if (dry_run) {
      log_msg("  Would remove figures:", fig_config$fig_dir)
    } else {
      unlink(fig_config$fig_dir, recursive = TRUE)
      log_msg("  Removed figures:", fig_config$fig_dir)
    }
  }
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

main <- function() {
  opts <- parse_args()
  content_dir <- normalizePath(opts$content_path, mustWork = FALSE)

  if (!dir.exists(content_dir)) {
    cat("Error: directory does not exist:", opts$content_path, "\n")
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

  content_root <- normalizePath(file.path(project_root, "client", "content"), mustWork = TRUE)
  dist_root <- file.path(project_root, "client", "content-dist")

  if (!startsWith(content_dir, content_root)) {
    cat("Error: source path must live under client/content/.\n")
    cat("  source:", content_dir, "\n  content root:", content_root, "\n")
    quit(status = 1)
  }

  fig_config <- get_figure_config(content_dir, content_root, project_root)

  cat("\n", strrep("=", 60), "\n  Content Build\n", strrep("=", 60), "\n\n", sep = "")
  log_init(file.path(dist_root, rel_path(content_dir, content_root), ".build.log"))
  log_msg("Source:    ", content_dir)
  log_msg("Output:    ", file.path(dist_root, rel_path(content_dir, content_root)))
  log_msg("Figures:   ", fig_config$fig_dir, paste0("(", fig_config$web_path, ")"))

  if (opts$clean) {
    clean_output(content_dir, content_root, dist_root, fig_config, opts$dry_run)
    # re-create the build log dir destroyed by clean
    if (!opts$dry_run) log_init(file.path(dist_root, rel_path(content_dir, content_root), ".build.log"))
    cat("\n")
  }

  sources <- discover_sources(content_dir)
  if (length(sources) == 0) {
    log_warn("No .Rmd or .mdx sources found under:", content_dir)
    quit(status = 0)
  }
  log_msg("Found", length(sources), "source file(s)\n")

  results <- lapply(sources, build_one, content_root = content_root,
    dist_root = dist_root, fig_config = fig_config, opts = opts)

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
