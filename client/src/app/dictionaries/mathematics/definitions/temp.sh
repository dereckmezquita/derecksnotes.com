#!/usr/bin/env bash

################################################################################
# This script creates additional `.Rmd` files with definitions that would be
# especially useful for **algorithmic trading** (and related finance concepts).
# We'll place them under the "finance" category (like the previous ones). If
# you'd rather have them in "machine-learning", just adjust "category" as needed.
#
# Usage:
#   1) Save as create-finance-algotrading-definitions.sh
#   2) Make it executable: chmod +x create-finance-algotrading-definitions.sh
#   3) Run: ./create-finance-algotrading-definitions.sh
################################################################################

TARGET_DIR="client/src/app/dictionaries/mathematics/definitions"

# Ensure the target directory exists
mkdir -p "${TARGET_DIR}"

################################################################################
# 1) ALGORITHMIC TRADING
################################################################################
cat <<EOF > "${TARGET_DIR}/mathematics_finance_a_algorithmic-trading.Rmd"
---
letter: 'a'
word: 'algorithmic-trading'
dictionary: 'mathematics'
category: 'finance'
dataSource: 'assistant'
published: true
comments: true

linksTo: ['markov-chain','machine-learning','high-frequency-trading']
linkedFrom: []
output:
  html_document:
    keep_md: true
---

\`\`\`{r setup, include=FALSE}
if (knitr::is_html_output()){
  knitr::knit_hooks\$set(plot=function(x,options){
    cap<-options\$fig.cap
    as.character(
      htmltools::tag("Figure",
        list(src=x, alt=cap, paste("\\n\\t",cap,"\\n",sep=""))
      )
    )
  })
}
knitr::opts_knit\$set(root.dir="${TARGET_DIR}")
knitr::knit_hooks\$set(optipng=knitr::hook_optipng)
knitr::opts_chunk\$set(dpi=300, fig.width=10, fig.height=7)
\`\`\`

<a id="algorithmic-trading">Algorithmic Trading</a> - **Algorithmic trading** uses computer-driven strategies to execute orders based on predefined rules (e.g. technical indicators, [machine-learning](#machine-learning) models, or risk constraints). Key components include:

- Strategy design (signal generation, risk mgmt).
- Implementation (order routing, execution algorithms).
- Monitoring & backtesting.

**Mathematical aspects**:
- Strategies often rely on time-series analysis, probability models (e.g. [Markov-chain](#markov-chain)), or advanced ML.
- Execution can aim to minimize market impact and transaction costs.

**R demonstration** (A minimal example of a “toy” daily returns strategy):

\`\`\`{r}
library(data.table)
set.seed(123)

# Suppose we have daily returns from a random walk
n <- 200
returns <- rnorm(n, mean=0.0005, sd=0.01)

dt_algo <- data.table(day=1:n, ret=returns)
# A naive “signal”: if ret>0 => “go long next day”, else “stay out”
signal <- sign(dt_algo\$ret)  # +1 or -1 or 0
# We'll track PnL by day (with a 1-day lag in signal if we want)
pnls <- shift(signal, fill=0, type="lag")* dt_algo\$ret
cumulative_pnl <- cumsum(pnls)

dt_algo[, signal := shift(signal,1,0)]
dt_algo[, pnl := pnls]
dt_algo[, cumPNL := cumulative_pnl]
tail(dt_algo)

# Quick plot
plot(dt_algo\$day, dt_algo\$cumPNL, type="l",
     main="Toy Algo Trading Strategy (Sign of Return)",
     xlab="Day", ylab="Cumulative PnL")
\`\`\`

EOF

################################################################################
# 2) SHARPE RATIO
################################################################################
cat <<EOF > "${TARGET_DIR}/mathematics_finance_s_sharpe-ratio.Rmd"
---
letter: 's'
word: 'sharpe-ratio'
dictionary: 'mathematics'
category: 'finance'
dataSource: 'assistant'
published: true
comments: true

linksTo: ['standard-deviation','mean','value-at-risk']
linkedFrom: []
output:
  html_document:
    keep_md: true
---

\`\`\`{r setup, include=FALSE}
if(knitr::is_html_output()){
  knitr::knit_hooks\$set(plot=function(x, options){
    cap<-options\$fig.cap
    as.character(
      htmltools::tag("Figure",
        list(src=x, alt=cap, paste("\\n\\t",cap,"\\n",sep=""))
      )
    )
  })
}
knitr::opts_knit\$set(root.dir="${TARGET_DIR}")
knitr::knit_hooks\$set(optipng=knitr::hook_optipng)
knitr::opts_chunk\$set(dpi=300, fig.width=10, fig.height=7)
\`\`\`

<a id="sharpe-ratio">Sharpe Ratio</a> - In **finance**, the **Sharpe ratio** measures the performance of an investment (or strategy) compared to a risk-free asset, accounting for volatility. 

**Formula**:
'$$'
\\text{Sharpe Ratio} = \\frac{\\mathbb{E}[R - R_f]}{\\sigma_{(R-R_f)}},
'$$'
where
- \\(R\\) is the asset/portfolio return,
- \\(R_f\\) is the risk-free rate,
- \\(\\sigma\\) is the standard deviation of \\(R - R_f\\).

**Key points**:
- Higher is better, but it can be gamed by different return distributions.
- Assumes returns are normally distributed for best interpretability.

**R demonstration** (compute Sharpe for a random returns series):

\`\`\`{r}
library(data.table)
set.seed(123)
Rf <- 0.0005  # risk-free daily, e.g. ~0.12% annual
n <- 200
ret <- rnorm(n, mean=0.001, sd=0.01)

dt_sharpe <- data.table(ret=ret)
excess <- dt_sharpe\$ret - Rf
sr <- mean(excess)/sd(excess)
sr
\`\`\`

EOF

################################################################################
# 3) KELLY CRITERION
################################################################################
cat <<EOF > "${TARGET_DIR}/mathematics_finance_k_kelly-criterion.Rmd"
---
letter: 'k'
word: 'kelly-criterion'
dictionary: 'mathematics'
category: 'finance'
dataSource: 'assistant'
published: true
comments: true

linksTo: ['probability','log-utility','markov-chain']
linkedFrom: []
output:
  html_document:
    keep_md: true
---

\`\`\`{r setup, include=FALSE}
if(knitr::is_html_output()){
  knitr::knit_hooks\$set(
    plot=function(x,options){
      cap<-options\$fig.cap
      as.character(
        htmltools::tag("Figure", list(src=x, alt=cap, paste("\\n\\t",cap,"\\n",sep="")))
      )
    }
  )
}
knitr::opts_knit\$set(root.dir="${TARGET_DIR}")
knitr::knit_hooks\$set(optipng=knitr::hook_optipng)
knitr::opts_chunk\$set(dpi=300, fig.width=10, fig.height=7)
\`\`\`

<a id="kelly-criterion">Kelly Criterion</a> - In **bet sizing** or **portfolio sizing**, the **Kelly criterion** maximizes long-run logarithmic growth of capital. For a simple bet with win probability \\(p\\), lose probability \\(1-p\\), and net win ratio \$b\$ (winning \$b\$ times the bet), the Kelly fraction \\(f^*\\) is:

'$$'
f^* = \\frac{p (b+1) - 1}{b}.
'$$'

**Key points**:
- Extends to multiple assets, though trickier in practice.
- Minimises risk of ruin in the long run but can produce large drawdowns.

**R demonstration** (simulate repeated bets with/without Kelly sizing):

\`\`\`{r}
library(data.table)
library(ggplot2)

set.seed(123)
p <- 0.55  # 55% chance to win
b <- 1     # if we win, we double the bet
f_star <- (p*(b+1)-1)/b
f_star

n <- 200
capital_kelly <- 1
capital_fixed <- 1
f_fixed <- 0.05

dt_kelly <- data.table(round=1:n, cK=NA_real_, cF=NA_real_)
for(i in 1:n){
  # random outcome
  win <- runif(1)<p
  # Kelly bet fraction:
  bet_kelly <- capital_kelly*f_star
  if(win){
    capital_kelly <- capital_kelly + bet_kelly*b
  } else {
    capital_kelly <- capital_kelly - bet_kelly
  }
  # fixed fraction bet
  bet_fixed <- capital_fixed*f_fixed
  if(win){
    capital_fixed <- capital_fixed + bet_fixed*b
  } else {
    capital_fixed <- capital_fixed - bet_fixed
  }
  dt_kelly[i, cK:=capital_kelly]
  dt_kelly[i, cF:=capital_fixed]
}

ggplot(dt_kelly, aes(x=round)) +
  geom_line(aes(y=cK, color="Kelly")) +
  geom_line(aes(y=cF, color="Fixed 5%")) +
  labs(title="Kelly vs Fixed Fraction Bet Sizing", x="Bet Round", y="Capital") +
  scale_color_manual(values=c("Kelly"="blue","Fixed 5%"="red")) +
  theme_minimal()
\`\`\`

EOF

################################################################################
# 4) BACKTESTING
################################################################################
cat <<EOF > "${TARGET_DIR}/mathematics_finance_b_backtesting.Rmd"
---
letter: 'b'
word: 'backtesting'
dictionary: 'mathematics'
category: 'finance'
dataSource: 'assistant'
published: true
comments: true

linksTo: ['algorithmic-trading','markov-chain','monte-carlo-simulation']
linkedFrom: []
output:
  html_document:
    keep_md: true
---

\`\`\`{r setup, include=FALSE}
if(knitr::is_html_output()){
  knitr::knit_hooks\$set(plot=function(x,options){
    cap<-options\$fig.cap
    as.character(htmltools::tag("Figure",
      list(src=x, alt=cap, paste("\\n\\t",cap,"\\n",sep=""))
    ))
  })
}
knitr::opts_knit\$set(root.dir="${TARGET_DIR}")
knitr::knit_hooks\$set(optipng=knitr::hook_optipng)
knitr::opts_chunk\$set(dpi=300, fig.width=10, fig.height=7)
\`\`\`

<a id="backtesting">Backtesting</a> - In **algorithmic trading**, **backtesting** is the process of applying a trading strategy (or model) to historical data to see how it would have performed. This helps gauge performance, risk, and feasibility before live deployment.

**Key steps**:
1. Gather clean historical data.
2. Define entry/exit rules and signal generation.
3. Simulate trades on historical data, accounting for transaction costs, slippage, etc.
4. Collect performance metrics (e.g., returns, drawdowns, Sharpe ratio, max drawdown).

**R demonstration** (toy strategy on synthetic daily data):

\`\`\`{r}
library(data.table)
library(ggplot2)

set.seed(123)
n <- 200
price <- cumsum(rnorm(n, mean=0.01, sd=0.05)) + 100
dt_bt <- data.table(day=1:n, price=price)

# A naive "moving average crossover" strategy:
fast_ma <- 5
slow_ma <- 20

dt_bt[, fast := frollmean(price, fast_ma)]
dt_bt[, slow := frollmean(price, slow_ma)]

# Signal: go long if fast>slow, else flat
dt_bt[, signal := fifelse(fast>slow, 1, 0)]
# lag signal by 1 to avoid lookahead
dt_bt[, signal := shift(signal,1,0)]
# daily return
dt_bt[, ret_day := shift(price,1,NA)/price - 1]
# strategy daily PnL
dt_bt[, strategy_ret := signal*ret_day]
dt_bt[, cumPNL := cumsum(strategy_ret)]

ggplot(dt_bt, aes(x=day)) +
  geom_line(aes(y=cumPNL, color="Strategy PnL")) +
  geom_line(aes(y=(price-100), color="Price-100"), alpha=0.7) +
  labs(title="Backtesting Simple MA Crossover", x="Day", y="PNL / Price(shifted)") +
  scale_color_manual(values=c("Strategy PnL"="blue","Price-100"="red")) +
  theme_minimal()
\`\`\`

EOF

################################################################################
# 5) COINTEGRATION
################################################################################
cat <<EOF > "${TARGET_DIR}/mathematics_finance_c_cointegration.Rmd"
---
letter: 'c'
word: 'cointegration'
dictionary: 'mathematics'
category: 'finance'
dataSource: 'assistant'
published: true
comments: true

linksTo: ['time-series','stationarity','markov-chain']
linkedFrom: []
output:
  html_document:
    keep_md: true
---

\`\`\`{r setup, include=FALSE}
if(knitr::is_html_output()){
  knitr::knit_hooks\$set(plot=function(x,options){
    cap<-options\$fig.cap
    as.character(htmltools::tag("Figure",
      list(src=x, alt=cap, paste("\\n\\t",cap,"\\n",sep="")))
    )
  })
}
knitr::opts_knit\$set(root.dir="${TARGET_DIR}")
knitr::knit_hooks\$set(optipng=knitr::hook_optipng)
knitr::opts_chunk\$set(dpi=300, fig.width=10, fig.height=7)
\`\`\`

<a id="cointegration">Cointegration</a> - In **time-series** analysis, two (or more) series \\(X_t, Y_t\\) are **cointegrated** if a linear combination \\(\\alpha X_t + \\beta Y_t\\) is **stationary**, even if \\(X_t\\) and \\(Y_t\\) themselves are individually non-stationary (e.g., I(1) processes).

**Key formula**:
A common approach is to test:
'$$'
Z_t = X_t - \\beta Y_t
'$$'
for stationarity (via the Engle–Granger two-step method or the Johansen test).

**Finance usage**:
- Pairs trading strategies rely on cointegration between asset prices.
- If they deviate from their equilibrium spread, trade accordingly.

**R demonstration** (synthetic pairs data with partial cointegration):

\`\`\`{r}
library(data.table)
library(egcm) # Engle-Granger cointegration method if installed
set.seed(123)

n <- 300
x <- cumsum(rnorm(n, mean=0.01, sd=0.05)) + 100  # random walk
y <- 0.5*x + cumsum(rnorm(n, mean=0, sd=0.02))  # partially following x + noise

dt_coin <- data.table(time=1:n, X=x, Y=y)

# We'll use 'egcm' if installed, or just do a quick "lm then test residual" approach
if(requireNamespace("egcm", quietly=TRUE)){
  res_egcm <- egcm::egcm(x, y)
  print(res_egcm)
} else {
  cat("Package 'egcm' not installed, skipping direct cointegration test.\n")
}

# We'll do a quick correlation approach
fit_lm <- lm(Y ~ X, data=dt_coin)
summary(fit_lm)
resid <- fit_lm$residuals
# One might do an ADF test on resid for stationarity, skipping code if package not installed

# Plot
library(ggplot2)
dt_coin[, residual := resid]
ggplot(dt_coin, aes(x=time)) +
  geom_line(aes(y=residual)) +
  labs(title="Residual from linear combination X_t - beta*Y_t", x="time", y="residual") +
  theme_minimal()
\`\`\`

EOF

################################################################################
echo "Algorithmic trading definitions (algorithmic-trading, sharpe-ratio, kelly-criterion, backtesting, cointegration) created."
################################################################################