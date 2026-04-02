# =============================================================================
# Module: stats.R
# Purpose: Statistical functions for return analysis
# =============================================================================
# Usage with box::use():
#   box::use(./modules/stats[sharpe_ratio, calc_returns, rolling_vol])
# =============================================================================

#' @export
box::use(
    data.table[data.table, setnames, copy, `:=`, .SD, .N, shift],
    stats[sd, var, cor, cov, qnorm, pnorm, quantile, ppoints, lm, coef]
)

# -----------------------------------------------------------------------------
# Return Calculations
# -----------------------------------------------------------------------------

#' Calculate returns from prices
#' @param prices Numeric vector of prices
#' @param type Character: "log" (default) or "simple"
#' @return Numeric vector of returns (first element is NA)
#' @export
calc_returns <- function(prices, type = "log") {
    n <- length(prices)
    if (n < 2) return(NA_real_)

    if (type == "log") {
        returns <- c(NA_real_, diff(log(prices)))
    } else if (type == "simple") {
        returns <- c(NA_real_, diff(prices) / prices[-n])
    } else {
        stop("type must be 'log' or 'simple'")
    }

    return(returns)
}

#' Calculate cumulative returns
#' @param returns Numeric vector of returns
#' @param type Character: "log" or "simple" (must match how returns were calculated)
#' @return Numeric vector of cumulative returns (wealth index starting at 1)
#' @export
cumulative_returns <- function(returns, type = "log") {
    returns <- returns[!is.na(returns)]

    if (type == "log") {
        cum_ret <- exp(cumsum(returns))
    } else {
        cum_ret <- cumprod(1 + returns)
    }

    return(cum_ret)
}

# -----------------------------------------------------------------------------
# Risk Metrics
# -----------------------------------------------------------------------------

#' Calculate annualised volatility
#' @param returns Numeric vector of returns
#' @param periods_per_year Integer: 252 for daily, 12 for monthly
#' @return Annualised volatility
#' @export
annualised_vol <- function(returns, periods_per_year = 252) {
    returns <- returns[!is.na(returns)]
    sd(returns) * sqrt(periods_per_year)
}

#' Calculate annualised return
#' @param returns Numeric vector of returns
#' @param periods_per_year Integer: 252 for daily, 12 for monthly
#' @param type Character: "log" or "simple"
#' @return Annualised return
#' @export
annualised_return <- function(returns, periods_per_year = 252, type = "log") {
    returns <- returns[!is.na(returns)]

    if (type == "log") {
        mean(returns) * periods_per_year
    } else {
        # Geometric mean for simple returns
        ((1 + mean(returns))^periods_per_year) - 1
    }
}

#' Calculate Sharpe ratio
#' @param returns Numeric vector of excess returns (or returns if rf=0)
#' @param rf Numeric: risk-free rate (annualised), default 0
#' @param periods_per_year Integer: 252 for daily, 12 for monthly
#' @return Sharpe ratio
#' @export
sharpe_ratio <- function(returns, rf = 0, periods_per_year = 252) {
    returns <- returns[!is.na(returns)]
    ann_ret <- mean(returns) * periods_per_year
    ann_vol <- sd(returns) * sqrt(periods_per_year)

    (ann_ret - rf) / ann_vol
}

#' Calculate Sortino ratio (downside deviation)
#' @param returns Numeric vector of returns
#' @param rf Numeric: risk-free rate (annualised), default 0
#' @param periods_per_year Integer: 252 for daily, 12 for monthly
#' @return Sortino ratio
#' @export
sortino_ratio <- function(returns, rf = 0, periods_per_year = 252) {
    returns <- returns[!is.na(returns)]
    ann_ret <- mean(returns) * periods_per_year

    # Downside deviation (only negative returns)
    downside <- returns[returns < 0]
    if (length(downside) == 0) return(Inf)

    downside_dev <- sqrt(mean(downside^2)) * sqrt(periods_per_year)

    (ann_ret - rf) / downside_dev
}

#' Calculate maximum drawdown
#' @param returns Numeric vector of returns
#' @param type Character: "log" or "simple"
#' @return Maximum drawdown (positive number, e.g., 0.20 = 20% drawdown)
#' @export
max_drawdown <- function(returns, type = "log") {
    returns <- returns[!is.na(returns)]
    if (length(returns) == 0) return(NA_real_)

    # Calculate wealth index
    wealth <- cumulative_returns(returns, type)

    # Running maximum
    running_max <- cummax(wealth)

    # Drawdowns
    drawdowns <- (running_max - wealth) / running_max

    max(drawdowns)
}

#' Calculate drawdown series
#' @param returns Numeric vector of returns
#' @param type Character: "log" or "simple"
#' @return Numeric vector of drawdowns at each point
#' @export
drawdown_series <- function(returns, type = "log") {
    returns <- returns[!is.na(returns)]

    wealth <- cumulative_returns(returns, type)
    running_max <- cummax(wealth)
    drawdowns <- (running_max - wealth) / running_max

    return(drawdowns)
}

#' Calculate Value at Risk (VaR)
#' @param returns Numeric vector of returns
#' @param alpha Numeric: confidence level (default 0.05 for 95% VaR)
#' @param method Character: "historical" or "parametric"
#' @return VaR (positive number representing potential loss)
#' @export
var_risk <- function(returns, alpha = 0.05, method = "historical") {
    returns <- returns[!is.na(returns)]

    if (method == "historical") {
        -quantile(returns, alpha)
    } else if (method == "parametric") {
        # Assume normal distribution
        -qnorm(alpha, mean = mean(returns), sd = sd(returns))
    } else {
        stop("method must be 'historical' or 'parametric'")
    }
}

#' Calculate Conditional VaR (Expected Shortfall)
#' @param returns Numeric vector of returns
#' @param alpha Numeric: confidence level (default 0.05)
#' @return CVaR (positive number)
#' @export
cvar_risk <- function(returns, alpha = 0.05) {
    returns <- returns[!is.na(returns)]
    var <- quantile(returns, alpha)
    -mean(returns[returns <= var])
}

# -----------------------------------------------------------------------------
# Higher Moments and Distribution
# -----------------------------------------------------------------------------

#' Calculate skewness
#' @param returns Numeric vector of returns
#' @return Skewness
#' @export
skewness <- function(returns) {
    returns <- returns[!is.na(returns)]
    n <- length(returns)
    m <- mean(returns)
    s <- sd(returns)

    (n / ((n - 1) * (n - 2))) * sum(((returns - m) / s)^3)
}

#' Calculate excess kurtosis
#' @param returns Numeric vector of returns
#' @return Excess kurtosis (normal distribution = 0)
#' @export
kurtosis <- function(returns) {
    returns <- returns[!is.na(returns)]
    n <- length(returns)
    m <- mean(returns)
    s <- sd(returns)

    kurt <- (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sum(((returns - m) / s)^4)
    excess_kurt <- kurt - (3 * (n - 1)^2 / ((n - 2) * (n - 3)))

    return(excess_kurt)
}

# -----------------------------------------------------------------------------
# Rolling Statistics
# -----------------------------------------------------------------------------

#' Calculate rolling volatility
#' @param returns Numeric vector of returns
#' @param window Integer: rolling window size
#' @param periods_per_year Integer: for annualisation
#' @return Numeric vector of rolling annualised volatility
#' @export
rolling_vol <- function(returns, window = 20, periods_per_year = 252) {
    n <- length(returns)
    result <- rep(NA_real_, n)

    for (i in window:n) {
        result[i] <- sd(returns[(i - window + 1):i], na.rm = TRUE) * sqrt(periods_per_year)
    }

    return(result)
}

#' Calculate rolling Sharpe ratio
#' @param returns Numeric vector of returns
#' @param window Integer: rolling window size
#' @param rf Numeric: risk-free rate (annualised)
#' @param periods_per_year Integer: for annualisation
#' @return Numeric vector of rolling Sharpe ratios
#' @export
rolling_sharpe <- function(returns, window = 252, rf = 0, periods_per_year = 252) {
    n <- length(returns)
    result <- rep(NA_real_, n)

    for (i in window:n) {
        win_returns <- returns[(i - window + 1):i]
        result[i] <- sharpe_ratio(win_returns, rf, periods_per_year)
    }

    return(result)
}

#' Calculate rolling correlation
#' @param x Numeric vector
#' @param y Numeric vector
#' @param window Integer: rolling window size
#' @return Numeric vector of rolling correlations
#' @export
rolling_cor <- function(x, y, window = 60) {
    n <- length(x)
    stopifnot(length(y) == n)

    result <- rep(NA_real_, n)

    for (i in window:n) {
        result[i] <- cor(x[(i - window + 1):i], y[(i - window + 1):i], use = "complete.obs")
    }

    return(result)
}

# -----------------------------------------------------------------------------
# Summary Statistics
# -----------------------------------------------------------------------------

#' Generate comprehensive return statistics
#' @param returns Numeric vector of returns
#' @param periods_per_year Integer: 252 for daily, 12 for monthly
#' @param rf Numeric: risk-free rate (annualised)
#' @return Named list of statistics
#' @export
return_summary <- function(returns, periods_per_year = 252, rf = 0) {
    returns <- returns[!is.na(returns)]

    list(
        n_obs = length(returns),
        ann_return = annualised_return(returns, periods_per_year),
        ann_vol = annualised_vol(returns, periods_per_year),
        sharpe = sharpe_ratio(returns, rf, periods_per_year),
        sortino = sortino_ratio(returns, rf, periods_per_year),
        max_dd = max_drawdown(returns),
        var_95 = var_risk(returns, 0.05),
        cvar_95 = cvar_risk(returns, 0.05),
        skewness = skewness(returns),
        kurtosis = kurtosis(returns),
        min_return = min(returns),
        max_return = max(returns),
        pct_positive = mean(returns > 0)
    )
}

#' Format return summary as a data.table
#' @param summary_list Output from return_summary()
#' @param name Character: optional name for the asset
#' @return data.table with formatted statistics
#' @export
format_summary <- function(summary_list, name = NULL) {
    dt <- data.table(
        metric = names(summary_list),
        value = unlist(summary_list)
    )

    if (!is.null(name)) {
        setnames(dt, "value", name)
    }

    return(dt)
}
