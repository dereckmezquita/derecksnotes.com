# =============================================================================
# Module: data.R
# Purpose: Data loading utilities for the Algorithmic Trading course
# =============================================================================
# Usage with box::use():
#   box::use(./modules/data[load_market, load_factors, load_economic])
# =============================================================================

#' @export
box::use(
    data.table[fread, data.table, setnames, setorder, setkey, copy, `:=`, haskey],
    stats[complete.cases]
)

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------

#' Get the data directory path
#' @export
get_data_dir <- function() {
    # Try to find data directory relative to this module or working directory
    candidates <- c(
        "src/data",
        "../data",
        "data",
        file.path(getwd(), "src/data"),
        # Try relative to this module file
        file.path(dirname(sys.frame(1)$ofile %||% "."), "../data"),
        # Try using here package if available
        if (requireNamespace("here", quietly = TRUE)) here::here("src/data") else NULL
    )

    # Remove NULLs
    candidates <- candidates[!sapply(candidates, is.null)]

    for (path in candidates) {
        if (!is.null(path) && dir.exists(path)) {
            return(normalizePath(path))
        }
    }

    stop("Data directory not found. Ensure you're in the course root directory.\n",
         "Working directory: ", getwd(), "\n",
         "Tried: ", paste(candidates, collapse = ", "))
}

# Helper for NULL coalescing
`%||%` <- function(x, y) if (is.null(x)) y else x

# -----------------------------------------------------------------------------
# Market Data Loaders
# -----------------------------------------------------------------------------

#' Load market data (stocks, ETFs, indices)
#' @param symbol Character: ticker symbol (e.g., "spy", "aapl", "sp500")
#' @param type Character: "daily" (default)
#' @return data.table with OHLCV data
#' @export
load_market <- function(symbol, type = "daily") {
    data_dir <- get_data_dir()
    filename <- paste0(tolower(symbol), "_", type, ".csv")
    filepath <- file.path(data_dir, "market", filename)

    if (!file.exists(filepath)) {
        stop(sprintf("Market data not found: %s\nExpected path: %s", symbol, filepath))
    }

    dt <- fread(filepath)
    dt[, date := as.Date(date)]
    setkey(dt, date)

    return(dt)
}

#' Load multiple market symbols and return returns
#' @param symbols Character vector of symbols
#' @param date_col Character: name of date column in output
#' @return data.table with date and returns for each symbol
#' @export
load_returns <- function(symbols, date_col = "date") {
    result <- NULL

    for (sym in symbols) {
        dt <- load_market(sym)[, .(date, returns)]
        setnames(dt, "returns", toupper(sym))

        if (is.null(result)) {
            result <- dt
        } else {
            result <- merge(result, dt, by = "date", all = FALSE)
        }
    }

    result <- result[complete.cases(result)]
    setkey(result, date)

    return(result)
}

#' List available market symbols
#' @return Character vector of available symbols
#' @export
list_market_symbols <- function() {
    data_dir <- get_data_dir()
    files <- list.files(file.path(data_dir, "market"), pattern = "_daily\\.csv$")
    symbols <- gsub("_daily\\.csv$", "", files)
    return(sort(symbols))
}

# -----------------------------------------------------------------------------
# Factor Data Loaders
# -----------------------------------------------------------------------------

#' Load Fama-French factor data
#' @param model Character: "ff3", "ff5", "carhart", "momentum"
#' @param freq Character: "daily" or "monthly"
#' @return data.table with factor returns
#' @export
load_factors <- function(model = "ff3", freq = "daily") {
    data_dir <- get_data_dir()

    filename <- switch(model,
        "ff3" = paste0("ff3_factors_", freq, ".csv"),
        "ff5" = paste0("ff5_factors_", freq, ".csv"),
        "carhart" = paste0("carhart_4_factors_", freq, ".csv"),
        "momentum" = paste0("momentum_", freq, ".csv"),
        stop(sprintf("Unknown factor model: %s", model))
    )

    filepath <- file.path(data_dir, "factors", filename)

    if (!file.exists(filepath)) {
        stop(sprintf("Factor data not found: %s", filepath))
    }

    dt <- fread(filepath)

    # Handle date column (may be numeric YYYYMMDD or Date)
    if (is.numeric(dt$date)) {
        dt[, date := as.Date(as.character(date), format = "%Y%m%d")]
    } else {
        dt[, date := as.Date(date)]
    }

    setkey(dt, date)
    return(dt)
}

#' Load industry portfolio data
#' @param n_industries Integer: 10 or 49
#' @param freq Character: "daily" or "monthly"
#' @return data.table with industry returns
#' @export
load_industries <- function(n_industries = 10, freq = "daily") {
    data_dir <- get_data_dir()
    filename <- paste0("industry_", n_industries, "_portfolios_", freq, ".csv")
    filepath <- file.path(data_dir, "factors", filename)

    if (!file.exists(filepath)) {
        stop(sprintf("Industry data not found: %s", filepath))
    }

    dt <- fread(filepath)

    if (is.numeric(dt$date)) {
        dt[, date := as.Date(as.character(date), format = "%Y%m%d")]
    } else {
        dt[, date := as.Date(date)]
    }

    setkey(dt, date)
    return(dt)
}

# -----------------------------------------------------------------------------
# Economic Data Loaders
# -----------------------------------------------------------------------------

#' Load economic data from FRED
#' @param series Character: series name (e.g., "treasury_10yr", "cpi", "unemployment_rate")
#' @return data.table with date and value
#' @export
load_economic <- function(series) {
    data_dir <- get_data_dir()
    filepath <- file.path(data_dir, "economic", paste0(series, ".csv"))

    if (!file.exists(filepath)) {
        stop(sprintf("Economic data not found: %s\nAvailable series: %s",
                     series, paste(list_economic_series(), collapse = ", ")))
    }

    dt <- fread(filepath)
    dt[, date := as.Date(date)]
    setkey(dt, date)

    return(dt)
}

#' List available economic series
#' @return Character vector of available series
#' @export
list_economic_series <- function() {
    data_dir <- get_data_dir()
    econ_dir <- file.path(data_dir, "economic")

    if (!dir.exists(econ_dir)) {
        return(character(0))
    }

    files <- list.files(econ_dir, pattern = "\\.csv$")
    series <- gsub("\\.csv$", "", files)
    return(sort(series))
}

#' Load Treasury yield curve (term structure)
#' @return data.table with date and yields at different maturities
#' @export
load_yield_curve <- function() {
    load_economic("interest_rate_term_structure")
}

# -----------------------------------------------------------------------------
# Volatility Data Loaders
# -----------------------------------------------------------------------------

#' Load VIX data
#' @param type Character: "vix", "vix9d", "vix3m", "vix6m", "term_structure"
#' @return data.table with VIX data
#' @export
load_vix <- function(type = "vix") {
    data_dir <- get_data_dir()

    filename <- switch(type,
        "vix" = "vix_daily.csv",
        "vix9d" = "vix9d_daily.csv",
        "vix3m" = "vix3m_daily.csv",
        "vix6m" = "vix6m_daily.csv",
        "term_structure" = "vix_term_structure.csv",
        stop(sprintf("Unknown VIX type: %s", type))
    )

    filepath <- file.path(data_dir, "volatility", filename)

    if (!file.exists(filepath)) {
        stop(sprintf("VIX data not found: %s", filepath))
    }

    dt <- fread(filepath)
    dt[, date := as.Date(date)]
    setkey(dt, date)

    return(dt)
}

# -----------------------------------------------------------------------------
# Crypto and Forex Loaders
# -----------------------------------------------------------------------------

#' Load cryptocurrency data
#' @param symbol Character: crypto symbol (e.g., "btc", "eth")
#' @return data.table with OHLCV data
#' @export
load_crypto <- function(symbol) {
    data_dir <- get_data_dir()
    filepath <- file.path(data_dir, "crypto", paste0(tolower(symbol), "_daily.csv"))

    if (!file.exists(filepath)) {
        stop(sprintf("Crypto data not found: %s", symbol))
    }

    dt <- fread(filepath)
    dt[, date := as.Date(date)]
    setkey(dt, date)

    return(dt)
}

#' Load forex data
#' @param pair Character: currency pair (e.g., "eurusd", "usdjpy")
#' @return data.table with OHLC data
#' @export
load_forex <- function(pair) {
    data_dir <- get_data_dir()
    filepath <- file.path(data_dir, "forex", paste0(tolower(pair), "_daily.csv"))

    if (!file.exists(filepath)) {
        stop(sprintf("Forex data not found: %s", pair))
    }

    dt <- fread(filepath)
    dt[, date := as.Date(date)]
    setkey(dt, date)

    return(dt)
}

# -----------------------------------------------------------------------------
# Utility Functions
# -----------------------------------------------------------------------------

#' Merge asset returns with factor data
#' @param asset_returns data.table with date and returns column
#' @param factors data.table with factor returns (from load_factors)
#' @param returns_col Character: name of returns column in asset data
#' @return Merged data.table
#' @export
merge_with_factors <- function(asset_returns, factors, returns_col = "returns") {
    # Ensure both have date keys
    if (!haskey(asset_returns)) setkey(asset_returns, date)
    if (!haskey(factors)) setkey(factors, date)

    # Merge
    result <- merge(asset_returns, factors, by = "date")
    result <- result[complete.cases(result)]

    return(result)
}

#' Filter data to date range
#' @param dt data.table with date column
#' @param start_date Character or Date: start date (inclusive)
#' @param end_date Character or Date: end date (inclusive)
#' @return Filtered data.table
#' @export
filter_dates <- function(dt, start_date = NULL, end_date = NULL) {
    result <- copy(dt)

    if (!is.null(start_date)) {
        result <- result[date >= as.Date(start_date)]
    }

    if (!is.null(end_date)) {
        result <- result[date <= as.Date(end_date)]
    }

    return(result)
}
