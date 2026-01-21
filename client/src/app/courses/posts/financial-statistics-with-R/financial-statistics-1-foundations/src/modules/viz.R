# =============================================================================
# Module: viz.R
# Purpose: Visualisation utilities for the Algorithmic Trading course
# =============================================================================
# Usage with box::use():
#   box::use(./modules/viz[plot_returns, plot_drawdown, theme_trading])
# =============================================================================

#' @export
box::use(
    ggplot2[
        ggplot, aes, geom_line, geom_area, geom_histogram, geom_density,
        geom_hline, geom_vline, geom_ribbon, geom_point, geom_bar,
        geom_smooth, geom_abline,
        labs, theme_minimal, theme, element_text, element_line, element_blank,
        scale_x_date, scale_y_continuous, scale_color_manual, scale_fill_manual,
        facet_wrap, coord_cartesian, expansion, margin, unit,
        after_stat
    ],
    data.table[data.table, melt, `:=`, copy],
    stats[sd, qnorm, ppoints, cor]
)

# -----------------------------------------------------------------------------
# Theme
# -----------------------------------------------------------------------------

#' Custom theme for trading charts
#' @param base_size Numeric: base font size
#' @return ggplot2 theme object
#' @export
theme_trading <- function(base_size = 11) {
    theme_minimal(base_size = base_size) +
        theme(
            plot.title = element_text(face = "bold", size = base_size * 1.2),
            plot.subtitle = element_text(color = "gray40"),
            axis.title = element_text(face = "bold"),
            axis.text = element_text(color = "gray30"),
            panel.grid.minor = element_blank(),
            panel.grid.major = element_line(color = "gray90"),
            legend.position = "bottom",
            legend.title = element_blank(),
            plot.margin = margin(10, 10, 10, 10)
        )
}

#' Color palette for the course
#' @export
trading_colors <- list(
    primary = "#2E86AB",
    secondary = "#A23B72",
    positive = "#1B998B",
    negative = "#E63946",
    neutral = "#6C757D",
    accent = "#F18F01",
    light = "#E8E8E8",
    dark = "#1D3557"
)

# -----------------------------------------------------------------------------
# Price and Return Plots
# -----------------------------------------------------------------------------

#' Plot price series
#' @param dt data.table with date and price columns
#' @param price_col Character: name of price column
#' @param title Character: plot title
#' @return ggplot object
#' @export
plot_price <- function(dt, price_col = "adjusted", title = "Price Series") {
    ggplot(dt, aes(x = date, y = .data[[price_col]])) +
        geom_line(color = trading_colors$primary, linewidth = 0.5) +
        labs(
            title = title,
            x = NULL,
            y = "Price"
        ) +
        scale_x_date(expand = expansion(mult = c(0.01, 0.01))) +
        scale_y_continuous(labels = scales::comma) +
        theme_trading()
}

#' Plot cumulative returns (wealth index)
#' @param dt data.table with date and returns columns
#' @param returns_col Character: name of returns column
#' @param title Character: plot title
#' @param type Character: "log" or "simple" (how returns were calculated)
#' @return ggplot object
#' @export
plot_cumulative_returns <- function(dt, returns_col = "returns", title = "Cumulative Returns",
                                      type = "log") {
    plot_dt <- data.table::copy(dt)

    # Calculate cumulative returns
    returns <- plot_dt[[returns_col]]
    returns[is.na(returns)] <- 0

    if (type == "log") {
        plot_dt[, cum_ret := exp(cumsum(returns))]
    } else {
        plot_dt[, cum_ret := cumprod(1 + returns)]
    }

    ggplot(plot_dt, aes(x = date, y = cum_ret)) +
        geom_line(color = trading_colors$primary, linewidth = 0.5) +
        geom_hline(yintercept = 1, linetype = "dashed", color = "gray50") +
        labs(
            title = title,
            x = NULL,
            y = "Wealth Index (starting = 1)"
        ) +
        scale_x_date(expand = expansion(mult = c(0.01, 0.01))) +
        theme_trading()
}

#' Plot multiple return series
#' @param dt data.table with date and multiple return columns
#' @param title Character: plot title
#' @param type Character: "log" or "simple"
#' @return ggplot object
#' @export
plot_multi_returns <- function(dt, title = "Cumulative Returns Comparison", type = "log") {
    # Get return columns (all except date)
    return_cols <- setdiff(names(dt), "date")

    # Calculate cumulative returns for each
    plot_dt <- data.table::copy(dt)
    for (col in return_cols) {
        returns <- plot_dt[[col]]
        returns[is.na(returns)] <- 0
        if (type == "log") {
            plot_dt[, (paste0(col, "_cum")) := exp(cumsum(returns))]
        } else {
            plot_dt[, (paste0(col, "_cum")) := cumprod(1 + returns)]
        }
    }

    # Melt to long format
    cum_cols <- paste0(return_cols, "_cum")
    plot_long <- melt(plot_dt[, c("date", cum_cols), with = FALSE],
                       id.vars = "date",
                       variable.name = "asset",
                       value.name = "cum_return")
    plot_long[, asset := gsub("_cum$", "", asset)]

    ggplot(plot_long, aes(x = date, y = cum_return, color = asset)) +
        geom_line(linewidth = 0.5) +
        geom_hline(yintercept = 1, linetype = "dashed", color = "gray50") +
        labs(
            title = title,
            x = NULL,
            y = "Wealth Index (starting = 1)"
        ) +
        scale_x_date(expand = expansion(mult = c(0.01, 0.01))) +
        theme_trading()
}

# -----------------------------------------------------------------------------
# Risk Visualisations
# -----------------------------------------------------------------------------

#' Plot drawdown series
#' @param dt data.table with date and returns columns
#' @param returns_col Character: name of returns column
#' @param title Character: plot title
#' @param type Character: "log" or "simple"
#' @return ggplot object
#' @export
plot_drawdown <- function(dt, returns_col = "returns", title = "Drawdown",
                           type = "log") {
    plot_dt <- data.table::copy(dt)

    # Calculate wealth and drawdown
    returns <- plot_dt[[returns_col]]
    returns[is.na(returns)] <- 0

    if (type == "log") {
        wealth <- exp(cumsum(returns))
    } else {
        wealth <- cumprod(1 + returns)
    }

    running_max <- cummax(wealth)
    plot_dt[, drawdown := -((running_max - wealth) / running_max)]

    ggplot(plot_dt, aes(x = date, y = drawdown)) +
        geom_area(fill = trading_colors$negative, alpha = 0.5) +
        geom_line(color = trading_colors$negative, linewidth = 0.3) +
        geom_hline(yintercept = 0, color = "gray30") +
        labs(
            title = title,
            x = NULL,
            y = "Drawdown"
        ) +
        scale_y_continuous(labels = scales::percent) +
        scale_x_date(expand = expansion(mult = c(0.01, 0.01))) +
        theme_trading()
}

#' Plot rolling volatility
#' @param dt data.table with date and returns columns
#' @param returns_col Character: name of returns column
#' @param window Integer: rolling window size
#' @param title Character: plot title
#' @return ggplot object
#' @export
plot_rolling_vol <- function(dt, returns_col = "returns", window = 20,
                              title = "Rolling Volatility (Annualised)") {
    plot_dt <- data.table::copy(dt)

    returns <- plot_dt[[returns_col]]
    n <- nrow(plot_dt)

    # Calculate rolling volatility
    roll_vol <- rep(NA_real_, n)
    for (i in window:n) {
        roll_vol[i] <- sd(returns[(i - window + 1):i], na.rm = TRUE) * sqrt(252)
    }
    plot_dt[, rolling_vol := roll_vol]

    ggplot(plot_dt[!is.na(rolling_vol)], aes(x = date, y = rolling_vol)) +
        geom_line(color = trading_colors$secondary, linewidth = 0.5) +
        labs(
            title = title,
            subtitle = sprintf("%d-day rolling window", window),
            x = NULL,
            y = "Annualised Volatility"
        ) +
        scale_y_continuous(labels = scales::percent) +
        scale_x_date(expand = expansion(mult = c(0.01, 0.01))) +
        theme_trading()
}

# -----------------------------------------------------------------------------
# Distribution Plots
# -----------------------------------------------------------------------------

#' Plot return distribution
#' @param dt data.table with returns column
#' @param returns_col Character: name of returns column
#' @param title Character: plot title
#' @param bins Integer: number of histogram bins
#' @return ggplot object
#' @export
plot_return_dist <- function(dt, returns_col = "returns", title = "Return Distribution",
                              bins = 50) {
    ggplot(dt[!is.na(get(returns_col))], aes(x = .data[[returns_col]])) +
        geom_histogram(aes(y = after_stat(density)),
                        bins = bins,
                        fill = trading_colors$primary,
                        color = "white",
                        alpha = 0.7) +
        geom_density(color = trading_colors$secondary, linewidth = 1) +
        geom_vline(xintercept = 0, linetype = "dashed", color = "gray50") +
        labs(
            title = title,
            x = "Return",
            y = "Density"
        ) +
        theme_trading()
}

#' Plot QQ plot for returns
#' @param dt data.table with returns column
#' @param returns_col Character: name of returns column
#' @param title Character: plot title
#' @return ggplot object
#' @export
plot_qq <- function(dt, returns_col = "returns", title = "QQ Plot vs Normal") {
    returns <- dt[[returns_col]]
    returns <- returns[!is.na(returns)]

    # Standardise
    z <- (returns - mean(returns)) / sd(returns)

    # Theoretical quantiles
    n <- length(z)
    theoretical <- qnorm(ppoints(n))

    qq_dt <- data.table(
        theoretical = theoretical,
        sample = sort(z)
    )

    ggplot(qq_dt, aes(x = theoretical, y = sample)) +
        geom_point(color = trading_colors$primary, alpha = 0.5, size = 1) +
        geom_abline(intercept = 0, slope = 1,
                     color = trading_colors$negative, linetype = "dashed") +
        labs(
            title = title,
            x = "Theoretical Quantiles (Normal)",
            y = "Sample Quantiles"
        ) +
        coord_cartesian(xlim = c(-4, 4), ylim = c(-4, 4)) +
        theme_trading()
}

# -----------------------------------------------------------------------------
# Factor and Regression Plots
# -----------------------------------------------------------------------------

#' Plot scatter with regression line
#' @param dt data.table with x and y columns
#' @param x_col Character: name of x column
#' @param y_col Character: name of y column
#' @param title Character: plot title
#' @return ggplot object
#' @export
plot_scatter_regression <- function(dt, x_col, y_col, title = NULL) {
    if (is.null(title)) {
        title <- sprintf("%s vs %s", y_col, x_col)
    }

    ggplot(dt, aes(x = .data[[x_col]], y = .data[[y_col]])) +
        geom_point(color = trading_colors$primary, alpha = 0.3, size = 1) +
        geom_smooth(method = "lm", color = trading_colors$negative,
                     se = TRUE, fill = trading_colors$negative, alpha = 0.2) +
        geom_hline(yintercept = 0, linetype = "dashed", color = "gray50") +
        geom_vline(xintercept = 0, linetype = "dashed", color = "gray50") +
        labs(
            title = title,
            x = x_col,
            y = y_col
        ) +
        theme_trading()
}

# -----------------------------------------------------------------------------
# Combined Dashboard Plots
# -----------------------------------------------------------------------------

#' Create a 4-panel performance summary
#' @param dt data.table with date and returns columns
#' @param returns_col Character: name of returns column
#' @param title Character: overall title
#' @return List of 4 ggplot objects
#' @export
performance_dashboard <- function(dt, returns_col = "returns", title = "Performance Summary") {
    list(
        cumulative = plot_cumulative_returns(dt, returns_col,
                                              title = paste(title, "- Cumulative Returns")),
        drawdown = plot_drawdown(dt, returns_col,
                                  title = paste(title, "- Drawdown")),
        distribution = plot_return_dist(dt, returns_col,
                                         title = paste(title, "- Return Distribution")),
        qq = plot_qq(dt, returns_col,
                      title = paste(title, "- QQ Plot"))
    )
}
