# Algorithmic Trading with R — Master Table of Contents

A rigorous course on building systematic trading strategies that generate profit. Every concept follows our five-part pedagogical approach: **Why It Works** (economic/behavioural rationale), **Visual Evidence** (charts, simulations, distributions), **The Mathematics** (intuitive derivations), **Implementation** (R code from scratch), and **Trading Application** (realistic strategy with costs).

Designed for PhD-level practitioners who want to understand *why* strategies work, not just *how* to implement them.

**Prerequisites:** R programming proficiency, basic statistics (probability, regression), familiarity with financial markets.

**Code Style:** `box::use()` for imports, `data.table` for data manipulation, `ggplot2` for visualisation. No tidyverse. Build from scratch first, then use libraries.

---

## Course Structure

| Part | Title | Folder | Chapters | Status |
|------|-------|--------|----------|--------|
| — | Prologue: Finance for Statisticians | `financial-statistics-1-foundations/` | 0 | Not Started |
| I | Foundations and Core Strategies | `financial-statistics-1-foundations/` | 1–12 | Not Started |
| II | Advanced Methods and Specialised Markets | `financial-statistics-2-advanced/` | 13–23 | Not Started |

---

# Prologue: Finance for Statisticians

**File:** `00_financial-statistics-1-foundations_prologue.Rmd`

*A concise bridge for mathematicians and statisticians entering quantitative finance.*

This prologue is for readers who are already proficient in statistics and mathematics but new to finance. We translate financial concepts into statistical language, establish vocabulary, and show how familiar tools apply in markets.

---

## 0.1 Financial Markets as Data Generating Processes

- [ ] **Markets as stochastic processes** — Prices as realisations of random variables.
  - Asset prices: continuous-time stochastic processes (Brownian motion, jump-diffusion).
  - Returns: the differenced/log-differenced series you'll actually model.
  - Why returns, not prices: stationarity, interpretability.
- [ ] **The efficient market hypothesis** — What "unpredictable" means statistically.
  - Weak form: returns are serially uncorrelated (martingale property).
  - Semi-strong: public information instantly priced (conditional expectation).
  - Strong form: all information priced (an idealisation).
  - Implication: E[r_{t+1} | Ω_t] ≈ r_f (risk-free rate).
- [ ] **Market microstructure** — The mechanics of price formation.
  - Bid-ask spread: the cost of immediacy.
  - Order book: a queue of limit orders.
  - Market makers: liquidity providers earning spread.

## 0.2 Vocabulary Translation

- [ ] **Asset classes and instruments**
  - Equity (stocks): ownership claims on firms.
  - Fixed income (bonds): debt instruments with contractual cash flows.
  - Derivatives: contracts deriving value from underlying assets (options, futures).
  - Currencies (FX): exchange rates between monetary units.
  - Commodities: physical goods (oil, gold, wheat).
- [ ] **Return conventions**
  - Simple return: r = (P_t - P_{t-1}) / P_{t-1} — percentage change.
  - Log return: r = ln(P_t / P_{t-1}) — time-additive, approximately equal for small returns.
  - Excess return: r - r_f — return above risk-free rate.
- [ ] **Risk measures in finance vs statistics**
  - Volatility = standard deviation of returns.
  - Sharpe ratio = (mean excess return) / volatility — a t-statistic scaled by √T.
  - Drawdown = peak-to-trough decline — a path-dependent risk measure.
  - VaR/CVaR = quantiles and tail expectations — familiar from extreme value theory.
- [ ] **Common abbreviations**
  - OHLCV: Open, High, Low, Close, Volume.
  - AUM: Assets Under Management.
  - ADV: Average Daily Volume.
  - PnL / P&L: Profit and Loss.
  - HFT: High-Frequency Trading.
  - OTC: Over-The-Counter (not exchange-traded).

## 0.3 Statistical Concepts in Finance Context

- [ ] **Time series in finance**
  - Non-stationarity: prices are I(1), returns are I(0).
  - Heteroskedasticity: volatility clustering (GARCH).
  - Fat tails: kurtosis >> 3, power-law behaviour.
  - Leverage effect: negative correlation between returns and volatility.
- [ ] **Cross-sectional analysis**
  - Factor models: linear models where "factors" are characteristics.
  - Fama-MacBeth regression: two-stage procedure for panel data.
  - Sorting and portfolios: non-parametric signal-return analysis.
- [ ] **Hypothesis testing caveats**
  - Multiple testing: thousands of strategies tested, few reported.
  - Look-ahead bias: using future information in past decisions.
  - Survivorship bias: only successful firms/funds remain in data.
  - Data snooping: overfitting to historical patterns.

## 0.4 The Trading Problem as Statistical Inference

- [ ] **Signal extraction** — Estimating E[r_{t+1} | X_t].
  - Any feature X_t correlated with future returns is a "signal."
  - Signal-to-noise ratio in finance is extremely low (~0.01-0.05 correlation).
- [ ] **Position sizing** — Optimal betting under uncertainty.
  - Kelly criterion: maximise E[log(wealth)].
  - Mean-variance optimisation: maximise E[r] - λVar(r).
- [ ] **Transaction costs** — The friction that destroys theoretical alpha.
  - Bid-ask spread, market impact, slippage.
  - Strategies must overcome costs to be profitable.
- [ ] **Backtesting** — Out-of-sample validation for trading strategies.
  - Walk-forward testing ≈ time-series cross-validation.
  - Train/test splits with temporal ordering.

## 0.5 Quick Reference: Finance-Statistics Dictionary

| Finance Term | Statistical Equivalent |
|--------------|----------------------|
| Alpha | Intercept / unexplained return |
| Beta | Regression coefficient on market |
| Sharpe ratio | t-statistic × √(periods/year) |
| Volatility | Standard deviation |
| Correlation | Pearson correlation |
| Cointegration | Common stochastic trend |
| Mean reversion | Stationarity / OU process |
| Momentum | Positive autocorrelation at lags |
| Factor | Explanatory variable / characteristic |
| Drawdown | Running maximum minus current value |
| VaR | Quantile of loss distribution |
| Greeks (Δ, Γ, θ, ν) | Partial derivatives of option price |

---

# Part I: Foundations and Core Strategies

**Folder:** `financial-statistics-1-foundations/`
**Status:** Not Started (0/12 chapters complete)

A complete, self-contained course. After Part I, you can build and deploy profitable trading strategies. Covers everything from understanding financial data to going live with real capital.

---

## Chapter 1: Financial Data and Returns

*The raw material of all trading strategies.*

**Files:**
- `01-1_financial-statistics-1-foundations_data_market-structure.Rmd`
- `01-2_financial-statistics-1-foundations_data_returns-mathematics.Rmd`
- `01-3_financial-statistics-1-foundations_data_stylised-facts.Rmd`

### Part 1 (`01-1`): Market Structure and Data

- [ ] **1.1 How Markets Work** — The mechanics underlying every trade.
  - [ ] 1.1.1 **Why It Works** — Order flow, price discovery, and information aggregation.
  - [ ] 1.1.2 **Visual Evidence** — Order book dynamics, bid-ask spread over time.
  - [ ] 1.1.3 **The Mathematics** — Market clearing conditions, Kyle's lambda (price impact).
  - [ ] 1.1.4 **Implementation** — Simulating an order book in R from scratch.
  - [ ] 1.1.5 **Trading Application** — Estimating effective spread from trade data.
- [ ] **1.2 Price Data: OHLCV** — What the numbers actually mean.
  - [ ] 1.2.1 **Why It Works** — Open, high, low, close as summary statistics of price path.
  - [ ] 1.2.2 **Visual Evidence** — Candlestick charts, bar charts, information loss from aggregation.
  - [ ] 1.2.3 **The Mathematics** — OHLC as sufficient statistics for range-based volatility.
  - [ ] 1.2.4 **Implementation** — Loading data with `quantmod`, converting to `data.table`.
  - [ ] 1.2.5 **Trading Application** — Detecting data quality issues (gaps, splits, survivorship).
- [ ] **1.3 Adjusted Prices** — Why raw prices lie.
  - [ ] 1.3.1 **Why It Works** — Corporate actions create artificial discontinuities.
  - [ ] 1.3.2 **Visual Evidence** — AAPL before/after adjustment (splits, dividends).
  - [ ] 1.3.3 **The Mathematics** — Adjustment factor calculation, chain multiplication.
  - [ ] 1.3.4 **Implementation** — Building an adjustment function from scratch.
  - [ ] 1.3.5 **Trading Application** — When to use adjusted vs unadjusted prices.
- [ ] **Quick Reference** — Data loading recipes, quality checks.

### Part 2 (`01-2`): The Mathematics of Returns

- [ ] **1.4 Simple vs Log Returns** — The fundamental choice.
  - [ ] 1.4.1 **Why It Works** — Two valid ways to measure percentage change.
  - [ ] 1.4.2 **Visual Evidence** — Divergence at large returns, distribution comparison.
  - [ ] 1.4.3 **The Mathematics** — Derivation: r_simple = (P_t - P_{t-1})/P_{t-1}, r_log = ln(P_t/P_{t-1}).
    - Taylor series: ln(1+x) ≈ x for small x.
    - Time additivity: r_log(t,T) = Σr_log(t,t+1) vs r_simple(t,T) ≠ Σr_simple.
    - Cross-sectional additivity: r_portfolio = Σw_i × r_simple,i.
  - [ ] 1.4.4 **Implementation** — Return calculation functions, handling NA and zero prices.
  - [ ] 1.4.5 **Trading Application** — When to use which (backtesting vs portfolio construction).
- [ ] **1.5 Multi-Period Compounding** — From daily to annual.
  - [ ] 1.5.1 **Why It Works** — Geometric growth of wealth.
  - [ ] 1.5.2 **Visual Evidence** — $1 growing at different rates: arithmetic vs geometric.
  - [ ] 1.5.3 **The Mathematics** — CAGR derivation, √252 annualisation, continuous compounding.
    - Wealth: W_T = W_0 × exp(Σr_log) = W_0 × Π(1 + r_simple).
    - Annualisation: σ_annual = σ_daily × √252 (why √252?).
  - [ ] 1.5.4 **Implementation** — Annualisation functions, rolling return calculations.
  - [ ] 1.5.5 **Trading Application** — Reporting returns correctly, compounding frequency effects.
- [ ] **1.6 Excess Returns and Risk-Free Rates** — What you're actually earning.
  - [ ] 1.6.1 **Why It Works** — Separating compensation for time vs risk.
  - [ ] 1.6.2 **Visual Evidence** — Excess returns over T-bills, time-varying risk premia.
  - [ ] 1.6.3 **The Mathematics** — Excess return: r_excess = r_asset - r_f, continuous vs discrete.
  - [ ] 1.6.4 **Implementation** — Merging with risk-free rate data, handling frequency mismatch.
  - [ ] 1.6.5 **Trading Application** — Using Fama-French RF column correctly.
- [ ] **Quick Reference** — Return formulae, annualisation factors.

### Part 3 (`01-3`): Stylised Facts of Financial Returns

- [ ] **1.7 Fat Tails** — Why normal distributions fail.
  - [ ] 1.7.1 **Why It Works** — Information arrives in bursts, herding amplifies moves.
  - [ ] 1.7.2 **Visual Evidence** — S&P 500 returns vs normal: QQ plots, tail probability comparison.
  - [ ] 1.7.3 **The Mathematics** — Kurtosis derivation: κ = E[(X-μ)⁴]/σ⁴, excess kurtosis = κ - 3.
    - For normal: κ = 3. For S&P 500 daily: κ ≈ 25.
    - Implications: P(|Z| > 4) ≈ 6×10⁻⁵ normal vs ~0.1% observed.
  - [ ] 1.7.4 **Implementation** — Computing kurtosis, comparing to theoretical distributions.
  - [ ] 1.7.5 **Trading Application** — Why VaR understates risk, position sizing implications.
- [ ] **1.8 Volatility Clustering** — Calm and storm periods.
  - [ ] 1.8.1 **Why It Works** — Information cascades, uncertainty propagation.
  - [ ] 1.8.2 **Visual Evidence** — |r_t| time series, autocorrelation of squared returns.
  - [ ] 1.8.3 **The Mathematics** — Autocorrelation function: ρ(k) = Cov(r²_t, r²_{t-k})/Var(r²).
    - Returns: ρ(k) ≈ 0. Squared returns: ρ(k) > 0, slow decay.
  - [ ] 1.8.4 **Implementation** — ACF plots for returns vs absolute returns vs squared returns.
  - [ ] 1.8.5 **Trading Application** — Predicting volatility, regime detection.
- [ ] **1.9 Leverage Effect** — Bad news hits harder.
  - [ ] 1.9.1 **Why It Works** — Falling prices increase leverage, amplifying volatility.
  - [ ] 1.9.2 **Visual Evidence** — Asymmetric volatility response to positive vs negative returns.
  - [ ] 1.9.3 **The Mathematics** — Correlation(r_t, σ²_{t+1}) < 0, News Impact Curve.
  - [ ] 1.9.4 **Implementation** — Measuring leverage effect, asymmetric correlation.
  - [ ] 1.9.5 **Trading Application** — Asymmetric hedging, put skew explanation.
- [ ] **1.10 Absence of Autocorrelation** — Returns are (nearly) unpredictable.
  - [ ] 1.10.1 **Why It Works** — Efficient markets arbitrage away predictability.
  - [ ] 1.10.2 **Visual Evidence** — ACF of returns: insignificant at most lags.
  - [ ] 1.10.3 **The Mathematics** — Ljung-Box test: Q = n(n+2)Σρ²(k)/(n-k) ~ χ²_K.
  - [ ] 1.10.4 **Implementation** — Testing for autocorrelation, Ljung-Box in R.
  - [ ] 1.10.5 **Trading Application** — What "weak" predictability means for alpha.
- [ ] **Quick Reference** — Stylised facts summary, diagnostic tests.

---

## Chapter 2: Risk and Performance Metrics

*The numbers that determine whether you're making money or fooling yourself.*

**Files:**
- `02-1_financial-statistics-1-foundations_metrics_return-measures.Rmd`
- `02-2_financial-statistics-1-foundations_metrics_risk-measures.Rmd`
- `02-3_financial-statistics-1-foundations_metrics_risk-adjusted.Rmd`

### Part 1 (`02-1`): Measuring Returns

- [ ] **2.1 Expected Return Estimation** — What can you realistically expect?
  - [ ] 2.1.1 **Why It Works** — Sample mean as estimator of population mean.
  - [ ] 2.1.2 **Visual Evidence** — Rolling mean returns, estimation uncertainty.
  - [ ] 2.1.3 **The Mathematics** — μ̂ = (1/T)Σr_t, SE(μ̂) = σ/√T.
    - 95% CI width for annual return with 10 years of data: ±~6% (huge!).
    - Implication: You cannot reliably estimate expected returns.
  - [ ] 2.1.4 **Implementation** — Bootstrap confidence intervals for mean return.
  - [ ] 2.1.5 **Trading Application** — Why mean estimation is the hardest problem in finance.
- [ ] **2.2 Trade-Level Statistics** — Win rate, average win/loss.
  - [ ] 2.2.1 **Why It Works** — Alternative to return-based analysis for discrete strategies.
  - [ ] 2.2.2 **Visual Evidence** — Trade P&L distribution, win/loss ratio charts.
  - [ ] 2.2.3 **The Mathematics** — Expectancy = (Win% × Avg Win) - (Loss% × Avg Loss).
    - Relationship to Sharpe: approximate conversion formulae.
  - [ ] 2.2.4 **Implementation** — Trade extraction from position series, statistics calculation.
  - [ ] 2.2.5 **Trading Application** — Using trade stats for strategy diagnosis.
- [ ] **Quick Reference** — Return metrics formulae.

### Part 2 (`02-2`): Measuring Risk

- [ ] **2.3 Volatility** — The standard measure of risk.
  - [ ] 2.3.1 **Why It Works** — Standard deviation captures dispersion around mean.
  - [ ] 2.3.2 **Visual Evidence** — High vs low volatility return series, volatility time series.
  - [ ] 2.3.3 **The Mathematics** — σ² = (1/(T-1))Σ(r_t - r̄)², Bessel's correction derivation.
    - Why T-1? E[s²] = σ² only with correction.
    - Annualisation: σ_annual = σ_daily × √252.
  - [ ] 2.3.4 **Implementation** — Rolling volatility, EWMA volatility.
  - [ ] 2.3.5 **Trading Application** — Volatility targeting, position sizing.
- [ ] **2.4 Downside Risk Measures** — Risk you actually care about.
  - [ ] 2.4.1 **Why It Works** — Upside "risk" is actually good.
  - [ ] 2.4.2 **Visual Evidence** — Return distributions with same σ but different downside.
  - [ ] 2.4.3 **The Mathematics** — Semi-deviation: σ_down = √[E[(min(r-τ, 0))²]].
    - Lower partial moment: LPM_n(τ) = E[(max(τ-r, 0))^n].
  - [ ] 2.4.4 **Implementation** — Downside deviation, lower partial moments in R.
  - [ ] 2.4.5 **Trading Application** — Comparing strategies with asymmetric returns.
- [ ] **2.5 Drawdown** — The pain you'll actually experience.
  - [ ] 2.5.1 **Why It Works** — Psychological and practical impact of losses from peak.
  - [ ] 2.5.2 **Visual Evidence** — Drawdown chart, underwater curve.
  - [ ] 2.5.3 **The Mathematics** — DD_t = (HWM_t - W_t)/HWM_t where HWM_t = max_{s≤t}(W_s).
    - Max drawdown: MDD = max_t(DD_t).
    - Average drawdown, drawdown duration.
  - [ ] 2.5.4 **Implementation** — Drawdown functions from scratch, duration calculation.
  - [ ] 2.5.5 **Trading Application** — Setting drawdown limits, investor expectations.
- [ ] **2.6 Value-at-Risk (VaR)** — Quantile-based risk measure.
  - [ ] 2.6.1 **Why It Works** — "What's the worst that can happen (95% of the time)?"
  - [ ] 2.6.2 **Visual Evidence** — VaR on return distribution, exceedances over time.
  - [ ] 2.6.3 **The Mathematics** — VaR_α = -F^{-1}(α) where F is return CDF.
    - Historical: empirical quantile.
    - Parametric: VaR = -μ + σ × z_α (assuming normal).
    - Monte Carlo: simulate and take quantile.
  - [ ] 2.6.4 **Implementation** — All three VaR methods in R, backtesting VaR.
  - [ ] 2.6.5 **Trading Application** — VaR limitations: not subadditive, ignores tail shape.
- [ ] **2.7 Expected Shortfall (CVaR)** — Average loss in the tail.
  - [ ] 2.7.1 **Why It Works** — "When things go wrong, how bad does it get on average?"
  - [ ] 2.7.2 **Visual Evidence** — CVaR vs VaR on distribution, tail averaging.
  - [ ] 2.7.3 **The Mathematics** — ES_α = E[r | r < VaR_α] = (1/α)∫_{-∞}^{VaR} r×f(r)dr.
    - Coherent risk measure: subadditivity, ES(A+B) ≤ ES(A) + ES(B).
  - [ ] 2.7.4 **Implementation** — Historical and parametric ES calculation.
  - [ ] 2.7.5 **Trading Application** — Why regulators prefer ES to VaR.
- [ ] **Quick Reference** — Risk metrics formulae, comparison table.

### Part 3 (`02-3`): Risk-Adjusted Performance

- [ ] **2.8 Sharpe Ratio** — The industry standard.
  - [ ] 2.8.1 **Why It Works** — Return per unit of risk, comparable across strategies.
  - [ ] 2.8.2 **Visual Evidence** — Iso-Sharpe lines, Sharpe distribution under null.
  - [ ] 2.8.3 **The Mathematics** — SR = (μ - r_f)/σ.
    - Annualisation: SR_annual = SR_daily × √252 (why?).
    - Standard error: SE(SR) ≈ √[(1 + SR²/2)/T] (Lo's formula).
    - Distribution: SR ~ N(SR_true, SE) approximately.
  - [ ] 2.8.4 **Implementation** — Sharpe calculation, confidence intervals.
  - [ ] 2.8.5 **Trading Application** — What Sharpe to expect (1.0 = good, 2.0 = excellent).
- [ ] **2.9 Sortino and Calmar Ratios** — Downside-focused alternatives.
  - [ ] 2.9.1 **Why It Works** — Penalise downside volatility, not upside.
  - [ ] 2.9.2 **Visual Evidence** — Comparing strategies with same Sharpe but different Sortino.
  - [ ] 2.9.3 **The Mathematics** — Sortino = (μ - r_f)/σ_downside, Calmar = CAGR/MDD.
  - [ ] 2.9.4 **Implementation** — Sortino and Calmar calculation from scratch.
  - [ ] 2.9.5 **Trading Application** — When to prefer Sortino/Calmar over Sharpe.
- [ ] **2.10 Information Ratio and Tracking Error** — Active management metrics.
  - [ ] 2.10.1 **Why It Works** — Measuring skill relative to a benchmark.
  - [ ] 2.10.2 **Visual Evidence** — Active returns distribution, tracking error over time.
  - [ ] 2.10.3 **The Mathematics** — IR = (r_p - r_b)/σ(r_p - r_b), TE = σ(r_p - r_b).
  - [ ] 2.10.4 **Implementation** — IR calculation, benchmark alignment.
  - [ ] 2.10.5 **Trading Application** — IR targets for institutional managers.
- [ ] **2.11 Alpha and Beta** — Decomposing returns.
  - [ ] 2.11.1 **Why It Works** — Separating market exposure from skill.
  - [ ] 2.11.2 **Visual Evidence** — Scatter plot of returns vs benchmark, regression line.
  - [ ] 2.11.3 **The Mathematics** — r_p = α + β × r_m + ε, OLS derivation.
    - β = Cov(r_p, r_m)/Var(r_m).
    - α = E[r_p] - β × E[r_m].
  - [ ] 2.11.4 **Implementation** — Rolling alpha/beta estimation, significance testing.
  - [ ] 2.11.5 **Trading Application** — Is your "alpha" just hidden beta?
- [ ] **Quick Reference** — Risk-adjusted metrics summary, interpretation benchmarks.

---

## Chapter 3: Backtesting — Building the Engine

*Your strategy is worthless until it survives a proper backtest.*

**Files:**
- `03-1_financial-statistics-1-foundations_backtest_architecture.Rmd`
- `03-2_financial-statistics-1-foundations_backtest_transaction-costs.Rmd`
- `03-3_financial-statistics-1-foundations_backtest_implementation.Rmd`

### Part 1 (`03-1`): Backtest Architecture

- [ ] **3.1 The Backtesting Pipeline** — From data to P&L.
  - [ ] 3.1.1 **Why It Works** — Systematic simulation of historical trading.
  - [ ] 3.1.2 **Visual Evidence** — Flowchart: data → signals → positions → returns → metrics.
  - [ ] 3.1.3 **The Mathematics** — Formalising the backtest: P&L_t = position_{t-1} × return_t - costs_t.
  - [ ] 3.1.4 **Implementation** — Minimal vectorised backtester in R (50 lines).
  - [ ] 3.1.5 **Trading Application** — When vectorised vs event-driven backtesting.
- [ ] **3.2 Signal Generation** — From data to trading signals.
  - [ ] 3.2.1 **Why It Works** — Signals encode beliefs about future returns.
  - [ ] 3.2.2 **Visual Evidence** — Signal time series, signal-return scatter.
  - [ ] 3.2.3 **The Mathematics** — Signal as function: s_t = f(information set at time t).
    - Point-in-time constraint: s_t depends only on data available at t.
  - [ ] 3.2.4 **Implementation** — Signal generation with proper lagging.
  - [ ] 3.2.5 **Trading Application** — Signal normalisation, z-scoring.
- [ ] **3.3 Position Mapping** — From signals to positions.
  - [ ] 3.3.1 **Why It Works** — Converting predictions to tradeable positions.
  - [ ] 3.3.2 **Visual Evidence** — Different mapping functions: linear, threshold, rank-based.
  - [ ] 3.3.3 **The Mathematics** — Position sizing: w_t = g(s_t) subject to constraints.
    - Long-only: w_t ≥ 0.
    - Long-short: Σw_t = 0 (dollar neutral).
  - [ ] 3.3.4 **Implementation** — Position mapping functions, constraint handling.
  - [ ] 3.3.5 **Trading Application** — Capacity constraints, maximum position size.
- [ ] **Quick Reference** — Backtest architecture checklist.

### Part 2 (`03-2`): Transaction Costs

- [ ] **3.4 Bid-Ask Spread** — The immediate cost of trading.
  - [ ] 3.4.1 **Why It Works** — Market makers charge for immediacy.
  - [ ] 3.4.2 **Visual Evidence** — Spread over time, intraday patterns.
  - [ ] 3.4.3 **The Mathematics** — Half-spread cost per trade: c = spread/(2 × mid).
    - Round-trip cost: 2c.
    - Effective spread from trade data.
  - [ ] 3.4.4 **Implementation** — Incorporating spread in backtest.
  - [ ] 3.4.5 **Trading Application** — Spread estimates for different asset classes.
- [ ] **3.5 Market Impact** — Moving the price against yourself.
  - [ ] 3.5.1 **Why It Works** — Large orders signal information, move prices.
  - [ ] 3.5.2 **Visual Evidence** — Price impact curves, temporary vs permanent impact.
  - [ ] 3.5.3 **The Mathematics** — Square-root impact: impact = σ × √(Q/ADV).
    - Almgren-Chriss framework.
  - [ ] 3.5.4 **Implementation** — Market impact models in R.
  - [ ] 3.5.5 **Trading Application** — Capacity limits from impact.
- [ ] **3.6 Slippage and Execution** — The difference between plan and reality.
  - [ ] 3.6.1 **Why It Works** — Prices move between signal and execution.
  - [ ] 3.6.2 **Visual Evidence** — Implementation shortfall decomposition.
  - [ ] 3.6.3 **The Mathematics** — Total cost = spread + impact + timing + opportunity.
  - [ ] 3.6.4 **Implementation** — Slippage models, random execution noise.
  - [ ] 3.6.5 **Trading Application** — Conservative cost assumptions.
- [ ] **3.7 Borrowing Costs** — The hidden cost of shorting.
  - [ ] 3.7.1 **Why It Works** — Shorting requires borrowing shares.
  - [ ] 3.7.2 **Visual Evidence** — Short interest vs borrow cost, hard-to-borrow stocks.
  - [ ] 3.7.3 **The Mathematics** — Annualised borrow cost, rebate rates.
  - [ ] 3.7.4 **Implementation** — Incorporating borrow costs for short positions.
  - [ ] 3.7.5 **Trading Application** — When shorting destroys alpha.
- [ ] **Quick Reference** — Transaction cost estimates by asset class.

### Part 3 (`03-3`): Building a Complete Backtester

- [ ] **3.8 Event-Driven Backtesting** — For complex strategies.
  - [ ] 3.8.1 **Why It Works** — Some strategies can't be vectorised.
  - [ ] 3.8.2 **Visual Evidence** — Event queue, state machine diagram.
  - [ ] 3.8.3 **The Mathematics** — Event-driven simulation, discrete event systems.
  - [ ] 3.8.4 **Implementation** — R6-based event-driven backtester.
  - [ ] 3.8.5 **Trading Application** — When to use event-driven vs vectorised.
- [ ] **3.9 Portfolio-Level Backtesting** — Multiple assets, rebalancing.
  - [ ] 3.9.1 **Why It Works** — Real strategies trade portfolios, not single assets.
  - [ ] 3.9.2 **Visual Evidence** — Portfolio weights over time, turnover.
  - [ ] 3.9.3 **The Mathematics** — Portfolio return: r_p = Σw_i × r_i, weight normalisation.
  - [ ] 3.9.4 **Implementation** — Multi-asset backtester with rebalancing.
  - [ ] 3.9.5 **Trading Application** — Rebalancing frequency trade-offs.
- [ ] **3.10 Monte Carlo Validation** — Statistical significance of results.
  - [ ] 3.10.1 **Why It Works** — One equity curve tells you almost nothing.
  - [ ] 3.10.2 **Visual Evidence** — Confidence bands, distribution of outcomes.
  - [ ] 3.10.3 **The Mathematics** — Permutation tests, bootstrap resampling.
    - Null hypothesis: strategy has no edge.
    - p-value from random signal permutations.
  - [ ] 3.10.4 **Implementation** — Monte Carlo significance testing in R.
  - [ ] 3.10.5 **Trading Application** — How many simulations? 10,000 minimum.
- [ ] **Quick Reference** — Backtester implementation checklist.

---

## Chapter 4: Backtesting — Biases and Validation

*The ways your backtest lies to you, and how to catch it.*

**Files:**
- `04-1_financial-statistics-1-foundations_backtest_biases.Rmd`
- `04-2_financial-statistics-1-foundations_backtest_validation.Rmd`
- `04-3_financial-statistics-1-foundations_backtest_interpretation.Rmd`

### Part 1 (`04-1`): Backtesting Biases

- [ ] **4.1 Look-Ahead Bias** — Using future information.
  - [ ] 4.1.1 **Why It Works** — The most common and deadly bias.
  - [ ] 4.1.2 **Visual Evidence** — Before/after fixing look-ahead: dramatic difference.
  - [ ] 4.1.3 **The Mathematics** — Information set formalisation: Ω_t = {data available at t}.
  - [ ] 4.1.4 **Implementation** — Detecting look-ahead with lag analysis.
  - [ ] 4.1.5 **Trading Application** — Common sources: point-in-time data, index composition.
- [ ] **4.2 Survivorship Bias** — Only winners remain.
  - [ ] 4.2.1 **Why It Works** — Databases drop delisted stocks.
  - [ ] 4.2.2 **Visual Evidence** — S&P 500 with vs without dead companies.
  - [ ] 4.2.3 **The Mathematics** — Selection bias formalisation, expected magnitude (~1-2% annual).
  - [ ] 4.2.4 **Implementation** — Survivorship-free databases, point-in-time constituents.
  - [ ] 4.2.5 **Trading Application** — Why "buy index components" backtests are inflated.
- [ ] **4.3 Overfitting** — Fitting noise, not signal.
  - [ ] 4.3.1 **Why It Works** — More parameters = better in-sample, worse out-of-sample.
  - [ ] 4.3.2 **Visual Evidence** — In-sample vs out-of-sample Sharpe as function of complexity.
  - [ ] 4.3.3 **The Mathematics** — Bias-variance trade-off, effective degrees of freedom.
    - Bailey et al. deflated Sharpe: adjusting for trials.
  - [ ] 4.3.4 **Implementation** — Measuring overfitting, complexity penalties.
  - [ ] 4.3.5 **Trading Application** — Rule of thumb: max parameters = √(sample size).
- [ ] **4.4 Selection Bias and Data Mining** — Cherry-picking winners.
  - [ ] 4.4.1 **Why It Works** — Test 1000 strategies, some will "work" by chance.
  - [ ] 4.4.2 **Visual Evidence** — Multiple testing: expected best result under null.
  - [ ] 4.4.3 **The Mathematics** — Multiple hypothesis correction: Bonferroni, FDR.
    - Harvey et al.: t-stat threshold of 3.0 for new factors.
  - [ ] 4.4.4 **Implementation** — Tracking all tests, deflating for multiplicity.
  - [ ] 4.4.5 **Trading Application** — Keeping a research log of all tested ideas.
- [ ] **Quick Reference** — Bias detection checklist.

### Part 2 (`04-2`): Validation Methods

- [ ] **4.5 Train/Test Split** — The simplest validation.
  - [ ] 4.5.1 **Why It Works** — Reserve data you never touch until final test.
  - [ ] 4.5.2 **Visual Evidence** — Split timeline, in-sample vs out-of-sample.
  - [ ] 4.5.3 **The Mathematics** — Statistical power trade-off: train size vs test reliability.
  - [ ] 4.5.4 **Implementation** — Proper splitting, embargo periods.
  - [ ] 4.5.5 **Trading Application** — 70/30 split as starting point.
- [ ] **4.6 Walk-Forward Optimisation** — Rolling out-of-sample.
  - [ ] 4.6.1 **Why It Works** — Multiple out-of-sample tests, parameter adaptation.
  - [ ] 4.6.2 **Visual Evidence** — Rolling windows, anchored vs sliding.
  - [ ] 4.6.3 **The Mathematics** — Expanding window vs rolling window trade-offs.
  - [ ] 4.6.4 **Implementation** — Walk-forward framework in R.
  - [ ] 4.6.5 **Trading Application** — Optimal retraining frequency.
- [ ] **4.7 Cross-Validation for Time Series** — Respecting temporal structure.
  - [ ] 4.7.1 **Why It Works** — Standard k-fold CV violates time ordering.
  - [ ] 4.7.2 **Visual Evidence** — Blocked CV, purged CV diagrams.
  - [ ] 4.7.3 **The Mathematics** — Purging to prevent leakage, embargo periods.
  - [ ] 4.7.4 **Implementation** — Time-series cross-validation in R.
  - [ ] 4.7.5 **Trading Application** — Choosing gap length between train and test.
- [ ] **4.8 Combinatorial Purged Cross-Validation** — The gold standard.
  - [ ] 4.8.1 **Why It Works** — Multiple test paths through data.
  - [ ] 4.8.2 **Visual Evidence** — CPCV path generation, coverage.
  - [ ] 4.8.3 **The Mathematics** — de Prado's CPCV framework, path count.
  - [ ] 4.8.4 **Implementation** — CPCV in R.
  - [ ] 4.8.5 **Trading Application** — When CPCV is worth the computational cost.
- [ ] **Quick Reference** — Validation method comparison table.

### Part 3 (`04-3`): Interpreting Backtest Results

- [ ] **4.9 Statistical Significance** — Is your Sharpe real?
  - [ ] 4.9.1 **Why It Works** — Distinguishing skill from luck.
  - [ ] 4.9.2 **Visual Evidence** — Sharpe ratio distribution under null, confidence intervals.
  - [ ] 4.9.3 **The Mathematics** — t-test for Sharpe: t = SR × √T.
    - Required track record for significance.
  - [ ] 4.9.4 **Implementation** — Significance tests, Sharpe confidence intervals.
  - [ ] 4.9.5 **Trading Application** — Why 3 years is rarely enough.
- [ ] **4.10 Regime Analysis** — Does it work everywhere?
  - [ ] 4.10.1 **Why It Works** — Strategies may only work in certain conditions.
  - [ ] 4.10.2 **Visual Evidence** — Performance by regime: bull/bear, high/low vol.
  - [ ] 4.10.3 **The Mathematics** — Conditional performance: E[r | regime].
  - [ ] 4.10.4 **Implementation** — Regime classification, conditional analysis.
  - [ ] 4.10.5 **Trading Application** — Regime-dependent position sizing.
- [ ] **4.11 Stability Analysis** — How sensitive to parameters?
  - [ ] 4.11.1 **Why It Works** — Robust strategies work across parameter ranges.
  - [ ] 4.11.2 **Visual Evidence** — Parameter sensitivity heatmaps.
  - [ ] 4.11.3 **The Mathematics** — Stability metrics, parameter sensitivity.
  - [ ] 4.11.4 **Implementation** — Parameter sweep visualisation.
  - [ ] 4.11.5 **Trading Application** — Choosing robust over optimal parameters.
- [ ] **4.12 Decay Analysis** — Has the edge eroded?
  - [ ] 4.12.1 **Why It Works** — Alpha decays as strategies become crowded.
  - [ ] 4.12.2 **Visual Evidence** — Rolling Sharpe over time, structural breaks.
  - [ ] 4.12.3 **The Mathematics** — Chow test for structural breaks, cumsum tests.
  - [ ] 4.12.4 **Implementation** — Decay detection, rolling performance metrics.
  - [ ] 4.12.5 **Trading Application** — When to retire a strategy.
- [ ] **Quick Reference** — Backtest interpretation checklist.

---

## Chapter 5: Position Sizing and Money Management

*The difference between a winning strategy and a winning trader.*

**Files:**
- `05-1_financial-statistics-1-foundations_sizing_kelly.Rmd`
- `05-2_financial-statistics-1-foundations_sizing_volatility.Rmd`
- `05-3_financial-statistics-1-foundations_sizing_risk.Rmd`

### Part 1 (`05-1`): Kelly Criterion and Optimal Betting

- [ ] **5.1 The Kelly Criterion** — Mathematically optimal position sizing.
  - [ ] 5.1.1 **Why It Works** — Maximises long-term geometric growth rate.
  - [ ] 5.1.2 **Visual Evidence** — Growth curves for different bet fractions.
  - [ ] 5.1.3 **The Mathematics** — Kelly derivation: f* = (p × b - q) / b = edge / odds.
    - For continuous returns: f* = μ/σ² (Sharpe ratio matters!).
    - Log utility: maximising E[log(W)].
  - [ ] 5.1.4 **Implementation** — Kelly calculation from win rate and payoff ratio.
  - [ ] 5.1.5 **Trading Application** — Why full Kelly is too aggressive.
- [ ] **5.2 Fractional Kelly** — Trading off growth for survival.
  - [ ] 5.2.1 **Why It Works** — Full Kelly has brutal drawdowns.
  - [ ] 5.2.2 **Visual Evidence** — Growth vs drawdown for Kelly fractions.
  - [ ] 5.2.3 **The Mathematics** — Half-Kelly: f = 0.5 × f*, growth penalty vs drawdown reduction.
    - Drawdown distribution under Kelly betting.
  - [ ] 5.2.4 **Implementation** — Fractional Kelly sizing.
  - [ ] 5.2.5 **Trading Application** — Quarter-Kelly as practical default.
- [ ] **5.3 Multi-Asset Kelly** — Portfolio-level optimal sizing.
  - [ ] 5.3.1 **Why It Works** — Correlations matter for aggregate risk.
  - [ ] 5.3.2 **Visual Evidence** — Optimal weights vs naive equal weight.
  - [ ] 5.3.3 **The Mathematics** — Multi-asset Kelly: f* = Σ^{-1} × μ.
    - Matrix formulation, constraint handling.
  - [ ] 5.3.4 **Implementation** — Multi-asset Kelly optimisation in R.
  - [ ] 5.3.5 **Trading Application** — When covariance estimation fails.
- [ ] **Quick Reference** — Kelly formulae summary.

### Part 2 (`05-2`): Volatility-Based Sizing

- [ ] **5.4 Volatility Targeting** — Consistent risk exposure.
  - [ ] 5.4.1 **Why It Works** — Keep risk constant despite changing volatility.
  - [ ] 5.4.2 **Visual Evidence** — Raw returns vs vol-targeted returns.
  - [ ] 5.4.3 **The Mathematics** — Position = target_vol / forecast_vol.
    - Inverse volatility weighting.
  - [ ] 5.4.4 **Implementation** — Volatility targeting with rolling estimates.
  - [ ] 5.4.5 **Trading Application** — Choosing target volatility (10-15% typical).
- [ ] **5.5 ATR-Based Position Sizing** — Range-normalised exposure.
  - [ ] 5.5.1 **Why It Works** — ATR captures realistic price movement.
  - [ ] 5.5.2 **Visual Evidence** — ATR over time, position size variation.
  - [ ] 5.5.3 **The Mathematics** — ATR = EMA(max(H-L, |H-C_{-1}|, |L-C_{-1}|)).
    - Risk per share = ATR × multiplier.
  - [ ] 5.5.4 **Implementation** — ATR calculation, position sizing.
  - [ ] 5.5.5 **Trading Application** — Turtle trading position sizing.
- [ ] **5.6 Risk Parity** — Equal risk contribution.
  - [ ] 5.6.1 **Why It Works** — All assets contribute equally to portfolio risk.
  - [ ] 5.6.2 **Visual Evidence** — Risk contributions before/after parity.
  - [ ] 5.6.3 **The Mathematics** — MRC_i = w_i × (Σw)_i / σ_p, equal MRC.
    - Iterative solution, Newton-Raphson.
  - [ ] 5.6.4 **Implementation** — Risk parity optimisation in R.
  - [ ] 5.6.5 **Trading Application** — Risk parity across asset classes.
- [ ] **Quick Reference** — Volatility-based sizing formulae.

### Part 3 (`05-3`): Risk Management and Stops

- [ ] **5.7 Stop-Loss Orders** — Limiting downside.
  - [ ] 5.7.1 **Why It Works** — Cutting losses before they compound.
  - [ ] 5.7.2 **Visual Evidence** — Stop-loss impact on return distribution.
  - [ ] 5.7.3 **The Mathematics** — Stop-loss option analogy, expected cost.
    - Optimal stop placement (Kaminski).
  - [ ] 5.7.4 **Implementation** — Stop-loss in backtesting framework.
  - [ ] 5.7.5 **Trading Application** — When stops help vs hurt.
- [ ] **5.8 Position Limits and Leverage Constraints** — Staying alive.
  - [ ] 5.8.1 **Why It Works** — Preventing catastrophic concentration.
  - [ ] 5.8.2 **Visual Evidence** — Leverage vs blow-up probability.
  - [ ] 5.8.3 **The Mathematics** — Gross leverage, net exposure, concentration metrics.
  - [ ] 5.8.4 **Implementation** — Constraint checking, position limiting.
  - [ ] 5.8.5 **Trading Application** — Typical institutional limits.
- [ ] **5.9 Drawdown Control** — Managing the pain.
  - [ ] 5.9.1 **Why It Works** — Investors can't tolerate unlimited drawdowns.
  - [ ] 5.9.2 **Visual Evidence** — Drawdown-triggered deleveraging.
  - [ ] 5.9.3 **The Mathematics** — Constant Proportion Portfolio Insurance (CPPI).
    - Drawdown-based position reduction rules.
  - [ ] 5.9.4 **Implementation** — Dynamic position sizing based on drawdown.
  - [ ] 5.9.5 **Trading Application** — Setting max drawdown limits.
- [ ] **Quick Reference** — Risk management rules summary.

---

## Chapter 6: Technical Indicators and Signal Generation

*Rigorous treatment of price-based signals — when they work and when they don't.*

**Files:**
- `06-1_financial-statistics-1-foundations_indicators_trend.Rmd`
- `06-2_financial-statistics-1-foundations_indicators_momentum-oscillators.Rmd`
- `06-3_financial-statistics-1-foundations_indicators_volume-volatility.Rmd`

### Part 1 (`06-1`): Trend Indicators

- [ ] **6.1 Moving Averages** — The foundation of trend following.
  - [ ] 6.1.1 **Why It Works** — Smoothing noise to reveal trend.
  - [ ] 6.1.2 **Visual Evidence** — SMA, EMA, WMA on price series.
  - [ ] 6.1.3 **The Mathematics** — SMA = (1/n)Σp_i, EMA = αp_t + (1-α)EMA_{t-1}.
    - Lag analysis: SMA lag = (n-1)/2, EMA effective lag.
    - Frequency response: what periods are filtered.
  - [ ] 6.1.4 **Implementation** — MA functions from scratch, optimising lookback.
  - [ ] 6.1.5 **Trading Application** — MA crossover performance by market regime.
- [ ] **6.2 MACD** — Momentum from moving averages.
  - [ ] 6.2.1 **Why It Works** — Captures trend acceleration/deceleration.
  - [ ] 6.2.2 **Visual Evidence** — MACD line, signal line, histogram.
  - [ ] 6.2.3 **The Mathematics** — MACD = EMA_12 - EMA_26, Signal = EMA_9(MACD).
    - MACD as approximation to rate of change.
  - [ ] 6.2.4 **Implementation** — MACD calculation, divergence detection.
  - [ ] 6.2.5 **Trading Application** — MACD standalone: ~50% win rate. Combined signals improve to 70%+.
- [ ] **6.3 ADX and DMI** — Trend strength measurement.
  - [ ] 6.3.1 **Why It Works** — Separating trending from ranging markets.
  - [ ] 6.3.2 **Visual Evidence** — ADX with price action, regime identification.
  - [ ] 6.3.3 **The Mathematics** — +DI, -DI calculation, ADX = smoothed(|+DI - -DI|/(+DI + -DI)).
  - [ ] 6.3.4 **Implementation** — ADX calculation from scratch.
  - [ ] 6.3.5 **Trading Application** — Using ADX to filter trend-following signals.
- [ ] **Quick Reference** — Trend indicator formulae.

### Part 2 (`06-2`): Momentum and Oscillators

- [ ] **6.4 RSI** — Relative strength measurement.
  - [ ] 6.4.1 **Why It Works** — Measures buying vs selling pressure.
  - [ ] 6.4.2 **Visual Evidence** — RSI with overbought/oversold levels.
  - [ ] 6.4.3 **The Mathematics** — RSI = 100 - 100/(1 + RS), RS = avg_gain/avg_loss.
    - Statistical properties: bounded [0, 100], mean-reverting.
  - [ ] 6.4.4 **Implementation** — RSI calculation, parameter optimisation.
  - [ ] 6.4.5 **Trading Application** — RSI alone: poor. RSI + MACD confirmation: 84-86% win rates in studies.
- [ ] **6.5 Stochastic Oscillator** — Price position in range.
  - [ ] 6.5.1 **Why It Works** — Where price sits relative to recent range.
  - [ ] 6.5.2 **Visual Evidence** — %K, %D lines, divergences.
  - [ ] 6.5.3 **The Mathematics** — %K = (C - L_n)/(H_n - L_n) × 100, %D = SMA(%K).
  - [ ] 6.5.4 **Implementation** — Stochastic calculation, signal generation.
  - [ ] 6.5.5 **Trading Application** — Works better in ranging markets.
- [ ] **6.6 Bollinger Bands** — Volatility-adjusted channels.
  - [ ] 6.6.1 **Why It Works** — Dynamic support/resistance from volatility.
  - [ ] 6.6.2 **Visual Evidence** — Band width expansion/contraction.
  - [ ] 6.6.3 **The Mathematics** — Upper = SMA + k×σ, Lower = SMA - k×σ.
    - %B = (price - lower)/(upper - lower).
    - Bandwidth = (upper - lower)/middle.
  - [ ] 6.6.4 **Implementation** — Bollinger Bands calculation, squeeze detection.
  - [ ] 6.6.5 **Trading Application** — Bollinger squeeze as volatility breakout predictor.
- [ ] **6.7 Combining Indicators** — Multi-signal confirmation.
  - [ ] 6.7.1 **Why It Works** — Reducing false signals through consensus.
  - [ ] 6.7.2 **Visual Evidence** — Confirmation rates: single vs combined.
  - [ ] 6.7.3 **The Mathematics** — Signal combination: voting, weighted averaging, ML.
    - Optimal combination weights via regression.
  - [ ] 6.7.4 **Implementation** — Multi-indicator signal generation.
  - [ ] 6.7.5 **Trading Application** — MACD + RSI + volume confirmation system.
- [ ] **Quick Reference** — Oscillator formulae, combination rules.

### Part 3 (`06-3`): Volume and Volatility Indicators

- [ ] **6.8 Volume Analysis** — Confirming price moves.
  - [ ] 6.8.1 **Why It Works** — Volume validates conviction.
  - [ ] 6.8.2 **Visual Evidence** — Price-volume relationship, divergences.
  - [ ] 6.8.3 **The Mathematics** — OBV = cumsum(sign(Δp) × volume).
    - Volume-price trend, money flow.
  - [ ] 6.8.4 **Implementation** — OBV, VWAP calculation.
  - [ ] 6.8.5 **Trading Application** — Volume confirmation filters.
- [ ] **6.9 ATR and Volatility Indicators** — Measuring market nervousness.
  - [ ] 6.9.1 **Why It Works** — Volatility precedes direction.
  - [ ] 6.9.2 **Visual Evidence** — ATR expansion before breakouts.
  - [ ] 6.9.3 **The Mathematics** — True Range = max(H-L, |H-C_{-1}|, |L-C_{-1}|), ATR = smoothed TR.
  - [ ] 6.9.4 **Implementation** — ATR calculation, volatility breakout signals.
  - [ ] 6.9.5 **Trading Application** — ATR-based stop placement.
- [ ] **6.10 Indicator Optimisation** — Finding robust parameters.
  - [ ] 6.10.1 **Why It Works** — Default parameters are arbitrary.
  - [ ] 6.10.2 **Visual Evidence** — Parameter sensitivity surfaces.
  - [ ] 6.10.3 **The Mathematics** — Grid search, genetic algorithms, Bayesian optimisation.
    - Overfitting risk: parameter count vs data.
  - [ ] 6.10.4 **Implementation** — Walk-forward parameter optimisation.
  - [ ] 6.10.5 **Trading Application** — Robust parameter selection: median over top 10%.
- [ ] **Quick Reference** — Volume/volatility indicators, optimisation guidelines.

---

## Chapter 7: Trend Following Strategies

*Riding the momentum — systematic approaches to capturing trends.*

**Files:**
- `07-1_financial-statistics-1-foundations_trend_time-series-momentum.Rmd`
- `07-2_financial-statistics-1-foundations_trend_breakout.Rmd`
- `07-3_financial-statistics-1-foundations_trend_managed-futures.Rmd`

### Part 1 (`07-1`): Time-Series Momentum

- [ ] **7.1 The Momentum Anomaly** — Why trends persist.
  - [ ] 7.1.1 **Why It Works** — Behavioural: underreaction, herding, confirmation bias.
  - [ ] 7.1.2 **Visual Evidence** — 12-month momentum portfolios, crisis performance.
  - [ ] 7.1.3 **The Mathematics** — TSMOM signal: sign(r_{t-12:t}) or scaled by volatility.
    - Moskowitz, Ooi, Pedersen (2012) framework.
  - [ ] 7.1.4 **Implementation** — Time-series momentum strategy from scratch.
  - [ ] 7.1.5 **Trading Application** — 12-1 momentum across asset classes.
- [ ] **7.2 Moving Average Crossovers** — Classic trend signals.
  - [ ] 7.2.1 **Why It Works** — Fast MA crossing slow MA indicates trend change.
  - [ ] 7.2.2 **Visual Evidence** — Golden cross, death cross, whipsaws.
  - [ ] 7.2.3 **The Mathematics** — Signal = sign(MA_fast - MA_slow), position smoothing.
    - Optimal lookback: Levine and Pedersen (2016).
  - [ ] 7.2.4 **Implementation** — MA crossover strategy, parameter selection.
  - [ ] 7.2.5 **Trading Application** — 50/200 crossover on equity indices.
- [ ] **7.3 Position Sizing for Trend Following** — Volatility-scaling returns.
  - [ ] 7.3.1 **Why It Works** — Trend strength varies, position should scale.
  - [ ] 7.3.2 **Visual Evidence** — Raw vs vol-scaled trend following.
  - [ ] 7.3.3 **The Mathematics** — Position = signal × target_vol / asset_vol.
  - [ ] 7.3.4 **Implementation** — Volatility-scaled positions.
  - [ ] 7.3.5 **Trading Application** — 40% vol target for diversified trend.
- [ ] **Quick Reference** — Time-series momentum formulae.

### Part 2 (`07-2`): Breakout Strategies

- [ ] **7.4 Donchian Channel Breakouts** — Turtle trading foundation.
  - [ ] 7.4.1 **Why It Works** — New highs/lows signal trend initiation.
  - [ ] 7.4.2 **Visual Evidence** — Channel breakouts, entries and exits.
  - [ ] 7.4.3 **The Mathematics** — Upper = max(H_{t-n:t-1}), Lower = min(L_{t-n:t-1}).
    - Entry on breakout, exit on opposite channel.
  - [ ] 7.4.4 **Implementation** — Donchian channel strategy.
  - [ ] 7.4.5 **Trading Application** — Original Turtle 20/10 system.
- [ ] **7.5 Volatility Breakouts** — Trading range expansion.
  - [ ] 7.5.1 **Why It Works** — Low volatility precedes directional moves.
  - [ ] 7.5.2 **Visual Evidence** — ATR squeeze then expansion.
  - [ ] 7.5.3 **The Mathematics** — Breakout = price > yesterday's close ± k × ATR.
  - [ ] 7.5.4 **Implementation** — Volatility breakout strategy.
  - [ ] 7.5.5 **Trading Application** — Opening range breakouts.
- [ ] **7.6 Trend Filters** — Avoiding whipsaws.
  - [ ] 7.6.1 **Why It Works** — Not all breakouts lead to trends.
  - [ ] 7.6.2 **Visual Evidence** — Filtered vs unfiltered breakout performance.
  - [ ] 7.6.3 **The Mathematics** — ADX filter, MA filter, regime classification.
  - [ ] 7.6.4 **Implementation** — Multi-filter trend confirmation.
  - [ ] 7.6.5 **Trading Application** — When to trade breakouts.
- [ ] **Quick Reference** — Breakout system rules.

### Part 3 (`07-3`): Multi-Asset Trend Following

- [ ] **7.7 Managed Futures** — Diversified trend following.
  - [ ] 7.7.1 **Why It Works** — Trends exist across all asset classes.
  - [ ] 7.7.2 **Visual Evidence** — CTA performance, crisis alpha.
  - [ ] 7.7.3 **The Mathematics** — Portfolio: many assets × trend signal × vol scaling.
    - Correlation structure, diversification benefit.
  - [ ] 7.7.4 **Implementation** — Multi-asset trend following system.
  - [ ] 7.7.5 **Trading Application** — Asset class selection, rebalancing.
- [ ] **7.8 Trend Following in Different Regimes** — When it works and fails.
  - [ ] 7.8.1 **Why It Works** — Trend following struggles in reversals.
  - [ ] 7.8.2 **Visual Evidence** — Performance by regime, drawdowns.
  - [ ] 7.8.3 **The Mathematics** — Regime detection, conditional performance.
  - [ ] 7.8.4 **Implementation** — Regime-conditional trend following.
  - [ ] 7.8.5 **Trading Application** — Blending trend with other strategies.
- [ ] **Quick Reference** — Multi-asset trend following guidelines.

---

## Chapter 8: Mean Reversion and Pairs Trading

*Betting on prices returning to equilibrium — from single assets to statistical arbitrage.*

**Files:**
- `08-1_financial-statistics-1-foundations_meanrev_single-asset.Rmd`
- `08-2_financial-statistics-1-foundations_meanrev_pairs.Rmd`
- `08-3_financial-statistics-1-foundations_meanrev_stat-arb.Rmd`

### Part 1 (`08-1`): Single-Asset Mean Reversion

- [ ] **8.1 Mean Reversion Foundations** — Why prices revert.
  - [ ] 8.1.1 **Why It Works** — Overreaction, liquidity provision, inventory effects.
  - [ ] 8.1.2 **Visual Evidence** — Ornstein-Uhlenbeck process simulation.
  - [ ] 8.1.3 **The Mathematics** — OU process: dp = θ(μ - p)dt + σdW.
    - Half-life: t_{1/2} = ln(2)/θ.
    - Variance ratio test for mean reversion.
  - [ ] 8.1.4 **Implementation** — OU parameter estimation, half-life calculation.
  - [ ] 8.1.5 **Trading Application** — Identifying mean-reverting series.
- [ ] **8.2 RSI and Bollinger Band Strategies** — Classic mean reversion.
  - [ ] 8.2.1 **Why It Works** — Extreme readings predict reversals.
  - [ ] 8.2.2 **Visual Evidence** — Entry/exit points on oscillators.
  - [ ] 8.2.3 **The Mathematics** — Z-score: z = (p - μ)/σ, threshold entry.
  - [ ] 8.2.4 **Implementation** — Bollinger Band mean reversion strategy.
  - [ ] 8.2.5 **Trading Application** — Works in ranging markets, fails in trends.
- [ ] **8.3 Short-Term Reversals** — Intraday mean reversion.
  - [ ] 8.3.1 **Why It Works** — Microstructure effects, inventory rebalancing.
  - [ ] 8.3.2 **Visual Evidence** — Intraday return autocorrelation.
  - [ ] 8.3.3 **The Mathematics** — Return reversal: r_t = α + β × r_{t-1} + ε, β < 0.
  - [ ] 8.3.4 **Implementation** — Short-term reversal strategy.
  - [ ] 8.3.5 **Trading Application** — High-frequency mean reversion.
- [ ] **Quick Reference** — Mean reversion tests and thresholds.

### Part 2 (`08-2`): Pairs Trading

- [ ] **8.4 Pairs Selection** — Finding related assets.
  - [ ] 8.4.1 **Why It Works** — Economic relationships create co-movement.
  - [ ] 8.4.2 **Visual Evidence** — Price series of pairs, spread time series.
  - [ ] 8.4.3 **The Mathematics** — Correlation vs cointegration.
    - Distance method: SSD of normalised prices.
    - Cointegration: common stochastic trend.
  - [ ] 8.4.4 **Implementation** — Pairs screening, distance calculation.
  - [ ] 8.4.5 **Trading Application** — Sector-based pair selection.
- [ ] **8.5 Cointegration** — The proper statistical foundation.
  - [ ] 8.5.1 **Why It Works** — Cointegration implies mean-reverting spread.
  - [ ] 8.5.2 **Visual Evidence** — Cointegrated vs correlated pairs.
  - [ ] 8.5.3 **The Mathematics** — Engle-Granger two-step: y_t = α + βx_t + ε_t, test ε_t ~ I(0).
    - Johansen test for multiple series.
    - ADF test on spread.
  - [ ] 8.5.4 **Implementation** — Cointegration testing in R, hedge ratio estimation.
  - [ ] 8.5.5 **Trading Application** — Cointegration-based pairs achieve 3.82% monthly returns in studies.
- [ ] **8.6 Trading the Spread** — Entry, exit, and sizing.
  - [ ] 8.6.1 **Why It Works** — Long cheap, short expensive when spread widens.
  - [ ] 8.6.2 **Visual Evidence** — Spread z-score, entry/exit signals.
  - [ ] 8.6.3 **The Mathematics** — Spread = y - β × x, z = (spread - μ)/σ.
    - Entry at |z| > 2, exit at |z| < 0.5 (example).
    - Optimal thresholds from OU model.
  - [ ] 8.6.4 **Implementation** — Pairs trading strategy with dynamic hedge ratio.
  - [ ] 8.6.5 **Trading Application** — Rebalancing frequency, transaction costs.
- [ ] **Quick Reference** — Pairs trading checklist.

### Part 3 (`08-3`): Statistical Arbitrage

- [ ] **8.7 Portfolio-Based Stat Arb** — Beyond pairs to baskets.
  - [ ] 8.7.1 **Why It Works** — More assets = more diversification.
  - [ ] 8.7.2 **Visual Evidence** — Basket spread, principal components.
  - [ ] 8.7.3 **The Mathematics** — PCA: find eigenvectors of return covariance.
    - Eigenportfolios: trading principal components.
    - Mean-reverting combinations.
  - [ ] 8.7.4 **Implementation** — PCA-based statistical arbitrage.
  - [ ] 8.7.5 **Trading Application** — Trading first vs higher eigenportfolios.
- [ ] **8.8 ETF Arbitrage** — Trading index vs components.
  - [ ] 8.8.1 **Why It Works** — ETF price should equal NAV.
  - [ ] 8.8.2 **Visual Evidence** — ETF premium/discount over time.
  - [ ] 8.8.3 **The Mathematics** — NAV calculation, creation/redemption mechanism.
  - [ ] 8.8.4 **Implementation** — ETF arbitrage strategy.
  - [ ] 8.8.5 **Trading Application** — Trading SPY vs basket of stocks.
- [ ] **8.9 Risk Management for Stat Arb** — When pairs diverge.
  - [ ] 8.9.1 **Why It Works** — Pairs can permanently diverge.
  - [ ] 8.9.2 **Visual Evidence** — Spread blow-ups, regime changes.
  - [ ] 8.9.3 **The Mathematics** — Stop-loss rules, spread half-life monitoring.
    - Dynamic cointegration testing.
  - [ ] 8.9.4 **Implementation** — Pair break detection, stop-loss implementation.
  - [ ] 8.9.5 **Trading Application** — When to abandon a pair.
- [ ] **Quick Reference** — Statistical arbitrage guidelines.

---

## Chapter 9: Factor-Based Strategies

*Systematic exposure to characteristics that earn risk premia.*

**Files:**
- `09-1_financial-statistics-1-foundations_factors_foundations.Rmd`
- `09-2_financial-statistics-1-foundations_factors_construction.Rmd`
- `09-3_financial-statistics-1-foundations_factors_implementation.Rmd`

### Part 1 (`09-1`): Factor Foundations

- [ ] **9.1 What Are Factors?** — Characteristics that predict returns.
  - [ ] 9.1.1 **Why It Works** — Risk-based vs behavioural explanations.
  - [ ] 9.1.2 **Visual Evidence** — Factor cumulative returns, Fama-French factors.
  - [ ] 9.1.3 **The Mathematics** — Factor model: r_i = α + Σβ_{ik}f_k + ε_i.
    - Pricing vs characteristic factors.
  - [ ] 9.1.4 **Implementation** — Loading Fama-French data in R.
  - [ ] 9.1.5 **Trading Application** — Factor exposure as active choice.
- [ ] **9.2 Value Factor** — Buying cheap, selling expensive.
  - [ ] 9.2.1 **Why It Works** — Risk (distress) or behavioural (overreaction).
  - [ ] 9.2.2 **Visual Evidence** — HML cumulative returns, value spreads.
  - [ ] 9.2.3 **The Mathematics** — B/M ratio, E/P ratio, composite value.
    - Long cheap, short expensive deciles.
  - [ ] 9.2.4 **Implementation** — Value factor construction from scratch.
  - [ ] 9.2.5 **Trading Application** — Value works better in emerging markets (0.41-2.34% monthly in BRIC).
- [ ] **9.3 Momentum Factor** — Winners keep winning.
  - [ ] 9.3.1 **Why It Works** — Underreaction, herding, slow information diffusion.
  - [ ] 9.3.2 **Visual Evidence** — UMD cumulative returns, momentum crashes.
  - [ ] 9.3.3 **The Mathematics** — 12-1 month return, cross-sectional ranking.
    - Long winners (top decile), short losers (bottom decile).
  - [ ] 9.3.4 **Implementation** — Momentum factor construction.
  - [ ] 9.3.5 **Trading Application** — Momentum is WEAKER in emerging markets (opposite of developed!).
- [ ] **9.4 Size, Quality, and Low Volatility** — Other established factors.
  - [ ] 9.4.1 **Why It Works** — Various risk/behavioural explanations.
  - [ ] 9.4.2 **Visual Evidence** — SMB, QMJ, BAB cumulative returns.
  - [ ] 9.4.3 **The Mathematics** — Size: market cap. Quality: profitability, growth, safety. Low vol: betting against beta.
  - [ ] 9.4.4 **Implementation** — Multi-factor construction.
  - [ ] 9.4.5 **Trading Application** — Quality premium during downturns.
- [ ] **Quick Reference** — Factor definitions, data sources.

### Part 2 (`09-2`): Factor Portfolio Construction

- [ ] **9.5 Sorting and Ranking** — From characteristics to portfolios.
  - [ ] 9.5.1 **Why It Works** — Non-parametric, robust signal extraction.
  - [ ] 9.5.2 **Visual Evidence** — Decile portfolios, monotonic returns.
  - [ ] 9.5.3 **The Mathematics** — Cross-sectional ranking, quantile breakpoints.
    - Univariate vs bivariate sorts.
  - [ ] 9.5.4 **Implementation** — Sorting functions, long-short construction.
  - [ ] 9.5.5 **Trading Application** — Quintiles vs deciles trade-offs.
- [ ] **9.6 Factor Weighting Schemes** — Equal, value, risk-weighted.
  - [ ] 9.6.1 **Why It Works** — Weighting affects factor exposure and risk.
  - [ ] 9.6.2 **Visual Evidence** — Equal vs value-weighted factor returns.
  - [ ] 9.6.3 **The Mathematics** — Equal weight, value weight, z-score weight.
    - Capacity considerations.
  - [ ] 9.6.4 **Implementation** — Different weighting schemes in R.
  - [ ] 9.6.5 **Trading Application** — Signal-weighted for stronger exposure.
- [ ] **9.7 Multi-Factor Portfolios** — Combining factors.
  - [ ] 9.7.1 **Why It Works** — Diversification across factors.
  - [ ] 9.7.2 **Visual Evidence** — Single vs multi-factor performance.
  - [ ] 9.7.3 **The Mathematics** — Factor orthogonalisation, composite scores.
    - Optimised vs naive combination.
  - [ ] 9.7.4 **Implementation** — Multi-factor portfolio construction.
  - [ ] 9.7.5 **Trading Application** — Value + momentum + quality combination.
- [ ] **Quick Reference** — Factor construction guidelines.

### Part 3 (`09-3`): Factor Implementation

- [ ] **9.8 Rebalancing and Turnover** — Practical trading considerations.
  - [ ] 9.8.1 **Why It Works** — Factors change slowly, don't over-trade.
  - [ ] 9.8.2 **Visual Evidence** — Turnover by rebalancing frequency.
  - [ ] 9.8.3 **The Mathematics** — Turnover calculation, cost-adjusted returns.
  - [ ] 9.8.4 **Implementation** — Rebalancing with turnover constraints.
  - [ ] 9.8.5 **Trading Application** — Monthly vs quarterly rebalancing.
- [ ] **9.9 Factor Timing** — When to increase/decrease exposure.
  - [ ] 9.9.1 **Why It Works** — Factor premia are time-varying.
  - [ ] 9.9.2 **Visual Evidence** — Factor spreads, sentiment indicators.
  - [ ] 9.9.3 **The Mathematics** — Valuation spreads, macro conditions.
    - Momentum timing: avoid after crashes.
  - [ ] 9.9.4 **Implementation** — Factor timing signals.
  - [ ] 9.9.5 **Trading Application** — When to reduce momentum exposure.
- [ ] **9.10 Factor Crowding** — When everyone uses the same strategy.
  - [ ] 9.10.1 **Why It Works** — Crowding reduces future returns.
  - [ ] 9.10.2 **Visual Evidence** — Factor crowding measures, performance decay.
  - [ ] 9.10.3 **The Mathematics** — Short interest, valuation spreads as crowding signals.
  - [ ] 9.10.4 **Implementation** — Crowding indicators.
  - [ ] 9.10.5 **Trading Application** — Avoiding crowded factors.
- [ ] **Quick Reference** — Factor implementation checklist.

---

## Chapter 10: Volatility Trading

*Trading the second moment — from GARCH to VIX.*

**Files:**
- `10-1_financial-statistics-1-foundations_volatility_modelling.Rmd`
- `10-2_financial-statistics-1-foundations_volatility_forecasting.Rmd`
- `10-3_financial-statistics-1-foundations_volatility_trading.Rmd`

### Part 1 (`10-1`): Volatility Modelling

- [ ] **10.1 Historical Volatility Estimators** — From simple to sophisticated.
  - [ ] 10.1.1 **Why It Works** — Different estimators use different information.
  - [ ] 10.1.2 **Visual Evidence** — Close-to-close vs range-based volatility.
  - [ ] 10.1.3 **The Mathematics** — Close-to-close: σ² = Var(log returns).
    - Parkinson: σ² = (1/4ln2)(H-L)².
    - Garman-Klass: uses OHLC.
    - Yang-Zhang: adds overnight jumps.
  - [ ] 10.1.4 **Implementation** — Volatility estimators from scratch.
  - [ ] 10.1.5 **Trading Application** — Choosing estimator by data availability.
- [ ] **10.2 GARCH Models** — Conditional volatility modelling.
  - [ ] 10.2.1 **Why It Works** — Captures volatility clustering.
  - [ ] 10.2.2 **Visual Evidence** — GARCH fitted vs realised volatility.
  - [ ] 10.2.3 **The Mathematics** — GARCH(1,1): σ²_t = ω + α×ε²_{t-1} + β×σ²_{t-1}.
    - Unconditional variance: σ² = ω/(1-α-β).
    - Persistence: α + β.
  - [ ] 10.2.4 **Implementation** — GARCH estimation using `rugarch`.
  - [ ] 10.2.5 **Trading Application** — GARCH for volatility forecasting.
- [ ] **10.3 EGARCH and GJR-GARCH** — Asymmetric volatility.
  - [ ] 10.3.1 **Why It Works** — Leverage effect: negative returns increase vol more.
  - [ ] 10.3.2 **Visual Evidence** — News impact curves, asymmetry.
  - [ ] 10.3.3 **The Mathematics** — EGARCH: log(σ²_t) = ω + α×g(z_{t-1}) + β×log(σ²_{t-1}).
    - GJR: σ²_t = ω + (α + γ×I_{ε<0})×ε²_{t-1} + β×σ²_{t-1}.
  - [ ] 10.3.4 **Implementation** — Asymmetric GARCH models in R.
  - [ ] 10.3.5 **Trading Application** — Better downside risk forecasting.
- [ ] **Quick Reference** — Volatility model comparison.

### Part 2 (`10-2`): Volatility Forecasting

- [ ] **10.4 Realised Volatility** — High-frequency measurement.
  - [ ] 10.4.1 **Why It Works** — More data = better measurement.
  - [ ] 10.4.2 **Visual Evidence** — Realised vs GARCH volatility.
  - [ ] 10.4.3 **The Mathematics** — RV = Σr²_{i,t} (intraday returns).
    - Microstructure noise, optimal sampling frequency.
    - Realised kernels, two-scale estimators.
  - [ ] 10.4.4 **Implementation** — Realised volatility calculation.
  - [ ] 10.4.5 **Trading Application** — Using RV as volatility forecast.
- [ ] **10.5 Implied Volatility** — Market expectations.
  - [ ] 10.5.1 **Why It Works** — Option prices embed volatility forecasts.
  - [ ] 10.5.2 **Visual Evidence** — VIX vs realised volatility.
  - [ ] 10.5.3 **The Mathematics** — Black-Scholes inversion for IV.
    - VIX calculation from SPX options.
    - Variance risk premium: IV - RV.
  - [ ] 10.5.4 **Implementation** — IV extraction, VIX replication.
  - [ ] 10.5.5 **Trading Application** — IV as best volatility forecast.
- [ ] **10.6 HAR Models** — Heterogeneous autoregressive volatility.
  - [ ] 10.6.1 **Why It Works** — Different traders have different horizons.
  - [ ] 10.6.2 **Visual Evidence** — HAR forecasts vs realised.
  - [ ] 10.6.3 **The Mathematics** — RV_t = α + β_d×RV_{t-1} + β_w×RV_{week} + β_m×RV_{month} + ε.
  - [ ] 10.6.4 **Implementation** — HAR model estimation and forecasting.
  - [ ] 10.6.5 **Trading Application** — HAR for multi-horizon forecasting.
- [ ] **Quick Reference** — Volatility forecasting methods comparison.

### Part 3 (`10-3`): Volatility Trading Strategies

- [ ] **10.7 Variance Risk Premium** — Selling volatility insurance.
  - [ ] 10.7.1 **Why It Works** — Investors pay premium for downside protection.
  - [ ] 10.7.2 **Visual Evidence** — VRP over time, strategy returns.
  - [ ] 10.7.3 **The Mathematics** — VRP = E[IV] - E[RV], typically positive.
    - Selling variance swaps, straddles.
  - [ ] 10.7.4 **Implementation** — VRP strategy using VIX futures.
  - [ ] 10.7.5 **Trading Application** — Carry trade in volatility.
- [ ] **10.8 VIX Trading** — Trading fear.
  - [ ] 10.8.1 **Why It Works** — VIX mean-reverts, contango roll yield.
  - [ ] 10.8.2 **Visual Evidence** — VIX term structure, futures curve.
  - [ ] 10.8.3 **The Mathematics** — Roll yield = (F_1 - F_2)/F_2 × (252/days).
    - VIX futures basis, contango vs backwardation.
  - [ ] 10.8.4 **Implementation** — VIX futures strategies (short vol, roll).
  - [ ] 10.8.5 **Trading Application** — XIV/SVXY strategies (and their risks!).
- [ ] **10.9 Volatility Arbitrage** — Implied vs realised mismatch.
  - [ ] 10.9.1 **Why It Works** — Market misprices volatility.
  - [ ] 10.9.2 **Visual Evidence** — IV/RV ratio, strategy signals.
  - [ ] 10.9.3 **The Mathematics** — Gamma scalping: delta-hedge option, profit from actual > implied vol.
  - [ ] 10.9.4 **Implementation** — Simple volatility arbitrage strategy.
  - [ ] 10.9.5 **Trading Application** — When to go long vs short volatility.
- [ ] **Quick Reference** — Volatility trading strategy summary.

---

## Chapter 11: Portfolio Construction and Risk Management

*Combining strategies into a coherent portfolio.*

**Files:**
- `11-1_financial-statistics-1-foundations_portfolio_optimisation.Rmd`
- `11-2_financial-statistics-1-foundations_portfolio_constraints.Rmd`
- `11-3_financial-statistics-1-foundations_portfolio_risk-management.Rmd`

### Part 1 (`11-1`): Portfolio Optimisation

- [ ] **11.1 Mean-Variance Optimisation** — The Markowitz framework.
  - [ ] 11.1.1 **Why It Works** — Maximise return for given risk.
  - [ ] 11.1.2 **Visual Evidence** — Efficient frontier, capital market line.
  - [ ] 11.1.3 **The Mathematics** — min w'Σw s.t. w'μ ≥ r_target, w'1 = 1.
    - Lagrangian solution, two-fund theorem.
  - [ ] 11.1.4 **Implementation** — Mean-variance optimisation in R.
  - [ ] 11.1.5 **Trading Application** — Why MVO often fails in practice.
- [ ] **11.2 The Estimation Problem** — Garbage in, garbage out.
  - [ ] 11.2.1 **Why It Works** — Covariance is estimable, mean is not.
  - [ ] 11.2.2 **Visual Evidence** — Estimation error impact on weights.
  - [ ] 11.2.3 **The Mathematics** — Estimation error: μ̂ ~ N(μ, σ²/T).
    - Small samples, extreme weights.
  - [ ] 11.2.4 **Implementation** — Demonstrating MVO instability.
  - [ ] 11.2.5 **Trading Application** — Why equal weight often wins.
- [ ] **11.3 Shrinkage Estimators** — Taming estimation error.
  - [ ] 11.3.1 **Why It Works** — Shrink towards structured target.
  - [ ] 11.3.2 **Visual Evidence** — Shrunk vs sample covariance.
  - [ ] 11.3.3 **The Mathematics** — Ledoit-Wolf: Σ_shrunk = δ×F + (1-δ)×S.
    - Optimal shrinkage intensity.
  - [ ] 11.3.4 **Implementation** — Ledoit-Wolf shrinkage in R.
  - [ ] 11.3.5 **Trading Application** — Better out-of-sample performance.
- [ ] **11.4 Black-Litterman** — Combining views with equilibrium.
  - [ ] 11.4.1 **Why It Works** — Start from market, adjust for views.
  - [ ] 11.4.2 **Visual Evidence** — Implied returns, view-adjusted weights.
  - [ ] 11.4.3 **The Mathematics** — μ_BL = [(τΣ)^{-1} + P'Ω^{-1}P]^{-1} × [(τΣ)^{-1}Π + P'Ω^{-1}Q].
  - [ ] 11.4.4 **Implementation** — Black-Litterman in R.
  - [ ] 11.4.5 **Trading Application** — Expressing trading views.
- [ ] **Quick Reference** — Portfolio optimisation methods comparison.

### Part 2 (`11-2`): Practical Constraints

- [ ] **11.5 Long-Only and Box Constraints** — Real-world limitations.
  - [ ] 11.5.1 **Why It Works** — Many investors can't short.
  - [ ] 11.5.2 **Visual Evidence** — Constrained vs unconstrained frontier.
  - [ ] 11.5.3 **The Mathematics** — min w'Σw s.t. l ≤ w ≤ u, w'1 = 1.
    - Quadratic programming.
  - [ ] 11.5.4 **Implementation** — Constrained optimisation with `quadprog`.
  - [ ] 11.5.5 **Trading Application** — Typical institutional constraints.
- [ ] **11.6 Transaction Cost-Aware Optimisation** — Rebalancing costs matter.
  - [ ] 11.6.1 **Why It Works** — Costs eat into performance.
  - [ ] 11.6.2 **Visual Evidence** — Trade-off: tracking vs costs.
  - [ ] 11.6.3 **The Mathematics** — min w'Σw + λ×costs(w - w_0).
    - Linear (proportional) vs quadratic (impact) costs.
  - [ ] 11.6.4 **Implementation** — Transaction cost-aware rebalancing.
  - [ ] 11.6.5 **Trading Application** — Optimal rebalancing bands.
- [ ] **11.7 Turnover Constraints** — Limiting trading activity.
  - [ ] 11.7.1 **Why It Works** — High turnover destroys returns.
  - [ ] 11.7.2 **Visual Evidence** — Returns before/after costs by turnover.
  - [ ] 11.7.3 **The Mathematics** — Constraint: Σ|w_i - w_{i,0}| ≤ T_max.
  - [ ] 11.7.4 **Implementation** — Turnover-constrained optimisation.
  - [ ] 11.7.5 **Trading Application** — Typical turnover targets.
- [ ] **Quick Reference** — Constraint handling techniques.

### Part 3 (`11-3`): Portfolio Risk Management

- [ ] **11.8 Risk Decomposition** — Understanding portfolio risk.
  - [ ] 11.8.1 **Why It Works** — Know where risk comes from.
  - [ ] 11.8.2 **Visual Evidence** — Risk contribution pie chart.
  - [ ] 11.8.3 **The Mathematics** — Marginal risk contribution: MRC_i = (Σw)_i / σ_p.
    - Total risk contribution: TRC_i = w_i × MRC_i.
  - [ ] 11.8.4 **Implementation** — Risk decomposition in R.
  - [ ] 11.8.5 **Trading Application** — Identifying risk concentrations.
- [ ] **11.9 Factor Risk Decomposition** — Systematic vs idiosyncratic.
  - [ ] 11.9.1 **Why It Works** — Separate diversifiable from non-diversifiable.
  - [ ] 11.9.2 **Visual Evidence** — Factor vs residual risk over time.
  - [ ] 11.9.3 **The Mathematics** — Var(r_p) = β'Var(f)β + Var(ε_p).
  - [ ] 11.9.4 **Implementation** — Factor risk decomposition.
  - [ ] 11.9.5 **Trading Application** — Hedging factor exposures.
- [ ] **11.10 Stress Testing and Scenario Analysis** — What if?
  - [ ] 11.10.1 **Why It Works** — History may not repeat exactly.
  - [ ] 11.10.2 **Visual Evidence** — Portfolio P&L under scenarios.
  - [ ] 11.10.3 **The Mathematics** — Historical scenarios, hypothetical shocks.
    - Sensitivity analysis: ΔP&L / Δfactor.
  - [ ] 11.10.4 **Implementation** — Scenario analysis framework in R.
  - [ ] 11.10.5 **Trading Application** — Stress testing before deployment.
- [ ] **Quick Reference** — Risk management checklist.

---

## Chapter 12: From Backtest to Live Trading

*The final step — deploying strategies in the real world.*

**Files:**
- `12-1_financial-statistics-1-foundations_live_infrastructure.Rmd`
- `12-2_financial-statistics-1-foundations_live_execution.Rmd`
- `12-3_financial-statistics-1-foundations_live_monitoring.Rmd`

### Part 1 (`12-1`): Trading Infrastructure

- [ ] **12.1 System Architecture** — Building a trading system.
  - [ ] 12.1.1 **Why It Works** — Reliability, latency, maintainability.
  - [ ] 12.1.2 **Visual Evidence** — System architecture diagrams.
  - [ ] 12.1.3 **The Mathematics** — Not applicable (engineering focus).
  - [ ] 12.1.4 **Implementation** — R-based trading system skeleton.
  - [ ] 12.1.5 **Trading Application** — Component choices for different strategies.
- [ ] **12.2 Data Feeds and APIs** — Getting market data.
  - [ ] 12.2.1 **Why It Works** — Timely, accurate data is essential.
  - [ ] 12.2.2 **Visual Evidence** — Data pipeline diagram.
  - [ ] 12.2.3 **The Mathematics** — Not applicable (engineering focus).
  - [ ] 12.2.4 **Implementation** — Connecting to data providers (Interactive Brokers, Alpaca).
  - [ ] 12.2.5 **Trading Application** — Data quality checks, backup sources.
- [ ] **12.3 Order Management** — From signals to orders.
  - [ ] 12.3.1 **Why It Works** — Systematic execution prevents errors.
  - [ ] 12.3.2 **Visual Evidence** — Order flow diagram.
  - [ ] 12.3.3 **The Mathematics** — Order types: market, limit, stop, algorithmic.
  - [ ] 12.3.4 **Implementation** — Order management system in R.
  - [ ] 12.3.5 **Trading Application** — Handling partial fills, rejections.
- [ ] **Quick Reference** — Infrastructure checklist.

### Part 2 (`12-2`): Execution

- [ ] **12.4 Paper Trading** — Testing without risk.
  - [ ] 12.4.1 **Why It Works** — Find bugs before they cost money.
  - [ ] 12.4.2 **Visual Evidence** — Paper vs live execution comparison.
  - [ ] 12.4.3 **The Mathematics** — Paper trading P&L calculation.
  - [ ] 12.4.4 **Implementation** — Paper trading mode with realistic fills.
  - [ ] 12.4.5 **Trading Application** — Minimum paper trading period.
- [ ] **12.5 Execution Algorithms** — Reducing market impact.
  - [ ] 12.5.1 **Why It Works** — Large orders move prices.
  - [ ] 12.5.2 **Visual Evidence** — TWAP, VWAP execution paths.
  - [ ] 12.5.3 **The Mathematics** — TWAP: split order evenly over time.
    - VWAP: weight by expected volume profile.
    - Implementation shortfall minimisation.
  - [ ] 12.5.4 **Implementation** — Simple execution algorithms in R.
  - [ ] 12.5.5 **Trading Application** — When to use which algorithm.
- [ ] **12.6 Slippage Analysis** — Measuring execution quality.
  - [ ] 12.6.1 **Why It Works** — Backtest assumes perfect execution.
  - [ ] 12.6.2 **Visual Evidence** — Expected vs actual fills, slippage distribution.
  - [ ] 12.6.3 **The Mathematics** — Slippage = actual_price - signal_price.
    - Implementation shortfall decomposition.
  - [ ] 12.6.4 **Implementation** — Slippage tracking and analysis.
  - [ ] 12.6.5 **Trading Application** — Updating backtest assumptions from live data.
- [ ] **Quick Reference** — Execution best practices.

### Part 3 (`12-3`): Monitoring and Maintenance

- [ ] **12.7 Real-Time Monitoring** — Watching the system.
  - [ ] 12.7.1 **Why It Works** — Catch problems before they grow.
  - [ ] 12.7.2 **Visual Evidence** — Monitoring dashboard example.
  - [ ] 12.7.3 **The Mathematics** — Anomaly detection, P&L attribution.
  - [ ] 12.7.4 **Implementation** — Monitoring dashboard with Shiny.
  - [ ] 12.7.5 **Trading Application** — What to monitor, alert thresholds.
- [ ] **12.8 Performance Attribution** — Why did we make/lose money?
  - [ ] 12.8.1 **Why It Works** — Understanding sources of P&L.
  - [ ] 12.8.2 **Visual Evidence** — Attribution charts, factor contribution.
  - [ ] 12.8.3 **The Mathematics** — Brinson attribution, factor attribution.
  - [ ] 12.8.4 **Implementation** — Daily performance attribution.
  - [ ] 12.8.5 **Trading Application** — Identifying when strategy breaks.
- [ ] **12.9 Strategy Lifecycle** — When to scale, modify, or retire.
  - [ ] 12.9.1 **Why It Works** — Strategies have finite life.
  - [ ] 12.9.2 **Visual Evidence** — Strategy performance decay, capacity limits.
  - [ ] 12.9.3 **The Mathematics** — Structural break tests, cumulative performance.
    - Capacity estimation from market impact.
  - [ ] 12.9.4 **Implementation** — Strategy health monitoring.
  - [ ] 12.9.5 **Trading Application** — Decision framework for strategy changes.
- [ ] **Quick Reference** — Live trading maintenance checklist.

---

# Part II: Advanced Methods and Specialised Markets

**Folder:** `financial-statistics-2-advanced/`
**Status:** Not Started (0/11 chapters complete)

Advanced techniques and specialised applications. Extends Part I with statistical learning, alternative data sources, derivatives, and strategies for less efficient markets. Each chapter assumes mastery of Part I foundations.

---

## Chapter 13: Statistical Learning for Trading

*Demystifying "machine learning" — it's just statistics with more parameters.*

**Files:**
- `13-1_financial-statistics-2-advanced_ml_foundations.Rmd`
- `13-2_financial-statistics-2-advanced_ml_supervised.Rmd`
- `13-3_financial-statistics-2-advanced_ml_practical.Rmd`

This chapter strips away the mystique from ML. Neural networks are function approximators. Gradient descent is iterative optimisation. Regularisation is Bayesian priors. We derive everything from first principles as a statistician would, then show when these methods beat simpler approaches (rarely) and when they don't (often).

### Part 1 (`13-1`): Foundations

- [ ] **13.1 What ML Actually Is** — Regression and classification, rebranded.
  - [ ] 13.1.1 **Why It Works** — Flexible function approximation.
  - [ ] 13.1.2 **Visual Evidence** — Linear vs nonlinear decision boundaries.
  - [ ] 13.1.3 **The Mathematics** — Supervised learning: find f such that y ≈ f(X).
    - Loss functions: MSE for regression, cross-entropy for classification.
    - Empirical risk minimisation.
  - [ ] 13.1.4 **Implementation** — Simple ML workflow in R.
  - [ ] 13.1.5 **Trading Application** — When ML beats linear models (rarely!).
- [ ] **13.2 Bias-Variance Trade-off** — The fundamental tension.
  - [ ] 13.2.1 **Why It Works** — Complexity costs generalisation.
  - [ ] 13.2.2 **Visual Evidence** — Training vs test error curves.
  - [ ] 13.2.3 **The Mathematics** — E[(y-f̂)²] = Bias²(f̂) + Var(f̂) + σ².
    - Optimal complexity minimises test error.
  - [ ] 13.2.4 **Implementation** — Demonstrating overfitting in financial data.
  - [ ] 13.2.5 **Trading Application** — Finance has low signal: prefer simple models.
- [ ] **13.3 Regularisation** — Constraining complexity.
  - [ ] 13.3.1 **Why It Works** — Shrinkage prevents overfitting.
  - [ ] 13.3.2 **Visual Evidence** — Coefficient paths for Lasso/Ridge.
  - [ ] 13.3.3 **The Mathematics** — Ridge: min Σ(y-Xβ)² + λΣβ².
    - Lasso: min Σ(y-Xβ)² + λΣ|β| (sparsity).
    - Elastic net: combines both.
    - Bayesian interpretation: priors on coefficients.
  - [ ] 13.3.4 **Implementation** — `glmnet` for regularised regression.
  - [ ] 13.3.5 **Trading Application** — Lasso for feature selection.
- [ ] **Quick Reference** — ML foundations summary.

### Part 2 (`13-2`): Supervised Methods

- [ ] **13.4 Tree-Based Methods** — Recursive partitioning.
  - [ ] 13.4.1 **Why It Works** — Non-parametric, handles interactions.
  - [ ] 13.4.2 **Visual Evidence** — Decision tree splits, feature importance.
  - [ ] 13.4.3 **The Mathematics** — Greedy splitting: min Σ_{regions} Σ(y_i - ȳ_region)².
    - Gini impurity, information gain for classification.
    - Pruning: complexity penalty.
  - [ ] 13.4.4 **Implementation** — `rpart` for trees, visualisation.
  - [ ] 13.4.5 **Trading Application** — Trees for regime detection.
- [ ] **13.5 Random Forests and Gradient Boosting** — Ensemble methods.
  - [ ] 13.5.1 **Why It Works** — Combining weak learners reduces variance/bias.
  - [ ] 13.5.2 **Visual Evidence** — Error reduction with ensemble size.
  - [ ] 13.5.3 **The Mathematics** — RF: bootstrap aggregating + feature subsampling.
    - GBM: sequential residual fitting, learning rate.
    - XGBoost: regularised boosting.
  - [ ] 13.5.4 **Implementation** — `randomForest`, `xgboost` in R.
  - [ ] 13.5.5 **Trading Application** — Feature importance for factor discovery.
- [ ] **13.6 Neural Networks** — Function approximation machines.
  - [ ] 13.6.1 **Why It Works** — Universal approximation theorem.
  - [ ] 13.6.2 **Visual Evidence** — Network architecture, learned representations.
  - [ ] 13.6.3 **The Mathematics** — Forward pass: h = σ(Wx + b), stacked layers.
    - Backpropagation: chain rule for gradients.
    - Gradient descent: w ← w - η∂L/∂w.
    - Activation functions: ReLU, sigmoid, tanh.
  - [ ] 13.6.4 **Implementation** — `keras` for neural networks in R.
  - [ ] 13.6.5 **Trading Application** — When deep learning helps (high-frequency, alternative data).
- [ ] **Quick Reference** — Supervised method comparison.

### Part 3 (`13-3`): Practical ML for Trading

- [ ] **13.7 Feature Engineering** — The real skill.
  - [ ] 13.7.1 **Why It Works** — Good features matter more than algorithms.
  - [ ] 13.7.2 **Visual Evidence** — Feature importance rankings.
  - [ ] 13.7.3 **The Mathematics** — Technical features, fundamental features, cross-sectional features.
    - Feature standardisation, missing data handling.
  - [ ] 13.7.4 **Implementation** — Feature engineering pipeline.
  - [ ] 13.7.5 **Trading Application** — Avoiding look-ahead in features.
- [ ] **13.8 Time-Series Cross-Validation** — Proper validation for trading.
  - [ ] 13.8.1 **Why It Works** — Financial data is non-iid.
  - [ ] 13.8.2 **Visual Evidence** — Purged K-fold, walk-forward validation.
  - [ ] 13.8.3 **The Mathematics** — Embargo periods, purging to prevent leakage.
  - [ ] 13.8.4 **Implementation** — Time-series CV framework.
  - [ ] 13.8.5 **Trading Application** — Preventing overfitting in ML strategies.
- [ ] **13.9 When ML Doesn't Work** — The reality check.
  - [ ] 13.9.1 **Why It Works** — Signal-to-noise in finance is tiny.
  - [ ] 13.9.2 **Visual Evidence** — Simple vs complex model performance.
  - [ ] 13.9.3 **The Mathematics** — Required sample size for complex models.
    - Curse of dimensionality in finance.
  - [ ] 13.9.4 **Implementation** — Benchmarking ML against simple models.
  - [ ] 13.9.5 **Trading Application** — Default to simple, use ML when justified.
- [ ] **Quick Reference** — ML for trading checklist.

---

## Chapter 14: Market Microstructure and Execution

*Understanding how markets actually work at the millisecond level.*

**Files:**
- `14-1_financial-statistics-2-advanced_micro_order-books.Rmd`
- `14-2_financial-statistics-2-advanced_micro_price-impact.Rmd`
- `14-3_financial-statistics-2-advanced_micro_optimal-execution.Rmd`

### Part 1 (`14-1`): Order Book Dynamics

- [ ] **14.1 Limit Order Books** — The battlefield of trading.
  - [ ] 14.1.1 **Why It Works** — Price discovery through order interaction.
  - [ ] 14.1.2 **Visual Evidence** — Order book visualisation, depth charts.
  - [ ] 14.1.3 **The Mathematics** — Order book as queue, price-time priority.
    - Bid-ask spread, depth, imbalance.
  - [ ] 14.1.4 **Implementation** — Order book simulation from scratch.
  - [ ] 14.1.5 **Trading Application** — Reading order flow for signals.
- [ ] **14.2 Order Types and Execution** — How orders work.
  - [ ] 14.2.1 **Why It Works** — Different orders for different purposes.
  - [ ] 14.2.2 **Visual Evidence** — Order execution examples.
  - [ ] 14.2.3 **The Mathematics** — Market orders: immediate, pay spread.
    - Limit orders: patient, earn spread, execution risk.
    - Stop orders, iceberg orders.
  - [ ] 14.2.4 **Implementation** — Order type simulation.
  - [ ] 14.2.5 **Trading Application** — Choosing order types strategically.
- [ ] **14.3 Market Making** — Providing liquidity.
  - [ ] 14.3.1 **Why It Works** — Earning spread, managing inventory.
  - [ ] 14.3.2 **Visual Evidence** — Market maker P&L, inventory over time.
  - [ ] 14.3.3 **The Mathematics** — Avellaneda-Stoikov framework.
    - Optimal quotes: mid ± δ(inventory, volatility).
  - [ ] 14.3.4 **Implementation** — Simple market making simulation.
  - [ ] 14.3.5 **Trading Application** — Understanding market maker behaviour.
- [ ] **Quick Reference** — Order book terminology.

### Part 2 (`14-2`): Price Impact and Trading Costs

- [ ] **14.4 Measuring Price Impact** — How orders move prices.
  - [ ] 14.4.1 **Why It Works** — Large orders signal information.
  - [ ] 14.4.2 **Visual Evidence** — Price impact curves by order size.
  - [ ] 14.4.3 **The Mathematics** — Temporary vs permanent impact.
    - Square-root law: impact ∝ √(size/ADV).
    - Kyle's lambda: permanent impact coefficient.
  - [ ] 14.4.4 **Implementation** — Estimating price impact from trade data.
  - [ ] 14.4.5 **Trading Application** — Strategy capacity limits.
- [ ] **14.5 Transaction Cost Analysis (TCA)** — Measuring execution quality.
  - [ ] 14.5.1 **Why It Works** — What you measure improves.
  - [ ] 14.5.2 **Visual Evidence** — TCA reports, slippage distribution.
  - [ ] 14.5.3 **The Mathematics** — Implementation shortfall = decision price - execution price.
    - Decomposition: delay, spread, impact, timing.
  - [ ] 14.5.4 **Implementation** — TCA framework in R.
  - [ ] 14.5.5 **Trading Application** — Broker evaluation, execution improvement.
- [ ] **14.6 Hidden Costs** — What you don't see hurts you.
  - [ ] 14.6.1 **Why It Works** — Many costs are invisible.
  - [ ] 14.6.2 **Visual Evidence** — Total cost breakdown.
  - [ ] 14.6.3 **The Mathematics** — Opportunity cost, information leakage.
    - Market impact vs opportunity cost trade-off.
  - [ ] 14.6.4 **Implementation** — Comprehensive cost analysis.
  - [ ] 14.6.5 **Trading Application** — True strategy capacity.
- [ ] **Quick Reference** — Transaction cost components.

### Part 3 (`14-3`): Optimal Execution

- [ ] **14.7 Execution Algorithms** — Minimising trading costs.
  - [ ] 14.7.1 **Why It Works** — Algorithmic execution reduces impact.
  - [ ] 14.7.2 **Visual Evidence** — TWAP, VWAP, POV execution paths.
  - [ ] 14.7.3 **The Mathematics** — TWAP: equal time slices.
    - VWAP: weight by volume profile.
    - POV: participate at percentage of volume.
  - [ ] 14.7.4 **Implementation** — Execution algorithms in R.
  - [ ] 14.7.5 **Trading Application** — Choosing the right algorithm.
- [ ] **14.8 Optimal Execution Theory** — Almgren-Chriss framework.
  - [ ] 14.8.1 **Why It Works** — Trade off urgency vs impact.
  - [ ] 14.8.2 **Visual Evidence** — Optimal trajectories for different risk aversion.
  - [ ] 14.8.3 **The Mathematics** — min E[cost] + λ×Var[cost].
    - Optimal trajectory: front-load if risk-averse.
    - Closed-form solution for linear impact.
  - [ ] 14.8.4 **Implementation** — Almgren-Chriss optimal execution.
  - [ ] 14.8.5 **Trading Application** — Practical optimal execution.
- [ ] **14.9 Adaptive Execution** — Responding to market conditions.
  - [ ] 14.9.1 **Why It Works** — Markets change, execution should adapt.
  - [ ] 14.9.2 **Visual Evidence** — Adaptive vs static execution.
  - [ ] 14.9.3 **The Mathematics** — Reinforcement learning for execution.
    - State: remaining inventory, time, market conditions.
    - Action: trade size, limit price.
  - [ ] 14.9.4 **Implementation** — Simple adaptive execution algorithm.
  - [ ] 14.9.5 **Trading Application** — When to adapt execution.
- [ ] **Quick Reference** — Execution algorithm comparison.

---

## Chapter 15: Alternative Data I — Satellite and Geospatial

*Seeing the economy from space.*

**Files:**
- `15-1_financial-statistics-2-advanced_altdata_satellite-intro.Rmd`
- `15-2_financial-statistics-2-advanced_altdata_satellite-methods.Rmd`
- `15-3_financial-statistics-2-advanced_altdata_satellite-strategies.Rmd`

### Part 1 (`15-1`): Introduction to Satellite Data

- [ ] **15.1 The Alternative Data Revolution** — Beyond price and fundamentals.
  - [ ] 15.1.1 **Why It Works** — Information advantage from non-traditional sources.
  - [ ] 15.1.2 **Visual Evidence** — Alternative data ecosystem, sources.
  - [ ] 15.1.3 **The Mathematics** — Information theory: data as entropy reduction.
    - Alpha decay: alternative data decays faster.
  - [ ] 15.1.4 **Implementation** — Alternative data pipeline architecture.
  - [ ] 15.1.5 **Trading Application** — Alternative data due diligence checklist.
- [ ] **15.2 Satellite Imagery Fundamentals** — How it works.
  - [ ] 15.2.1 **Why It Works** — Observe economic activity directly.
  - [ ] 15.2.2 **Visual Evidence** — Satellite images: parking lots, shipping, agriculture.
  - [ ] 15.2.3 **The Mathematics** — Resolution (spatial, temporal), spectral bands.
    - Revisit frequency, coverage trade-offs.
  - [ ] 15.2.4 **Implementation** — Accessing satellite data (Planet, Maxar, ESA).
  - [ ] 15.2.5 **Trading Application** — Which satellites for which use case.
- [ ] **15.3 Parking Lot Analysis** — Predicting retail earnings.
  - [ ] 15.3.1 **Why It Works** — Cars ∝ shoppers ∝ revenue.
  - [ ] 15.3.2 **Visual Evidence** — Walmart/Target parking lot time series.
  - [ ] 15.3.3 **The Mathematics** — Car counting: object detection models.
    - Regression: revenue ~ f(car_count).
    - Berkeley study: 4-5% returns around earnings.
  - [ ] 15.3.4 **Implementation** — Parking lot analysis pipeline.
  - [ ] 15.3.5 **Trading Application** — Retail earnings prediction strategy.
- [ ] **Quick Reference** — Satellite data providers, specifications.

### Part 2 (`15-2`): Computer Vision Methods

- [ ] **15.4 Image Processing Basics** — From pixels to features.
  - [ ] 15.4.1 **Why It Works** — Extract information from images.
  - [ ] 15.4.2 **Visual Evidence** — Raw image → processed features.
  - [ ] 15.4.3 **The Mathematics** — Image as matrix, convolution, edge detection.
    - Histogram analysis, thresholding.
  - [ ] 15.4.4 **Implementation** — Image processing with R/Python.
  - [ ] 15.4.5 **Trading Application** — Feature engineering from satellite images.
- [ ] **15.5 Object Detection** — Counting things from space.
  - [ ] 15.5.1 **Why It Works** — Automate counting at scale.
  - [ ] 15.5.2 **Visual Evidence** — YOLO/Faster R-CNN detections on satellite imagery.
  - [ ] 15.5.3 **The Mathematics** — CNN architectures for detection.
    - Bounding box regression, class probabilities.
    - Transfer learning from pre-trained models.
  - [ ] 15.5.4 **Implementation** — Object detection using pre-trained models.
  - [ ] 15.5.5 **Trading Application** — Car counting, ship tracking, construction monitoring.
- [ ] **15.6 Change Detection** — Tracking activity over time.
  - [ ] 15.6.1 **Why It Works** — Change indicates economic activity.
  - [ ] 15.6.2 **Visual Evidence** — Before/after images, change maps.
  - [ ] 15.6.3 **The Mathematics** — Image differencing, anomaly detection.
    - NDVI for vegetation, brightness for construction.
  - [ ] 15.6.4 **Implementation** — Change detection pipeline.
  - [ ] 15.6.5 **Trading Application** — Construction progress, crop health.
- [ ] **Quick Reference** — Computer vision techniques for satellite imagery.

### Part 3 (`15-3`): Satellite Trading Strategies

- [ ] **15.7 Oil Storage Analysis** — Tracking crude inventory.
  - [ ] 15.7.1 **Why It Works** — Floating roof tanks reveal inventory.
  - [ ] 15.7.2 **Visual Evidence** — Tank shadow analysis.
  - [ ] 15.7.3 **The Mathematics** — Volume = πr² × height, shadow geometry.
    - Aggregation across facilities.
  - [ ] 15.7.4 **Implementation** — Oil storage estimation pipeline.
  - [ ] 15.7.5 **Trading Application** — Crude oil trading signals.
- [ ] **15.8 Agricultural Monitoring** — Predicting crop yields.
  - [ ] 15.8.1 **Why It Works** — NDVI correlates with crop health.
  - [ ] 15.8.2 **Visual Evidence** — NDVI maps, crop stress detection.
  - [ ] 15.8.3 **The Mathematics** — NDVI = (NIR - Red)/(NIR + Red).
    - Yield models, weather integration.
  - [ ] 15.8.4 **Implementation** — Agricultural monitoring pipeline.
  - [ ] 15.8.5 **Trading Application** — Commodity trading from crop forecasts.
- [ ] **15.9 Shipping and Trade Flow** — Global commerce from space.
  - [ ] 15.9.1 **Why It Works** — Ships carry goods, visible from space.
  - [ ] 15.9.2 **Visual Evidence** — Ship tracking, port congestion.
  - [ ] 15.9.3 **The Mathematics** — AIS data fusion, cargo estimation.
    - Trade flow modelling.
  - [ ] 15.9.4 **Implementation** — Ship tracking and analysis.
  - [ ] 15.9.5 **Trading Application** — Supply chain disruption signals.
- [ ] **Quick Reference** — Satellite trading strategy summary.

---

## Chapter 16: Alternative Data II — Social Media and Sentiment

*Trading the crowd's mood.*

**Files:**
- `16-1_financial-statistics-2-advanced_altdata_sentiment-sources.Rmd`
- `16-2_financial-statistics-2-advanced_altdata_sentiment-methods.Rmd`
- `16-3_financial-statistics-2-advanced_altdata_sentiment-strategies.Rmd`

### Part 1 (`16-1`): Sentiment Data Sources

- [ ] **16.1 Twitter/X for Trading** — Real-time market mood.
  - [ ] 16.1.1 **Why It Works** — Traders share views, sentiment precedes price.
  - [ ] 16.1.2 **Visual Evidence** — Twitter volume spikes around events.
  - [ ] 16.1.3 **The Mathematics** — Volume metrics, user weighting (followers, verified).
    - Cashtag ($AAPL) extraction.
  - [ ] 16.1.4 **Implementation** — Twitter API access, data collection.
  - [ ] 16.1.5 **Trading Application** — Real-time sentiment monitoring.
- [ ] **16.2 Reddit and WallStreetBets** — Retail investor signals.
  - [ ] 16.2.1 **Why It Works** — Retail flows can move prices, especially small caps.
  - [ ] 16.2.2 **Visual Evidence** — GameStop saga, Reddit mention spikes.
  - [ ] 16.2.3 **The Mathematics** — Mention counting, upvote weighting.
    - Unusual activity detection.
  - [ ] 16.2.4 **Implementation** — Reddit API, subreddit monitoring.
  - [ ] 16.2.5 **Trading Application** — Meme stock early detection.
- [ ] **16.3 StockTwits and Finance-Specific Platforms** — Concentrated signals.
  - [ ] 16.3.1 **Why It Works** — Purpose-built for trading discussion.
  - [ ] 16.3.2 **Visual Evidence** — StockTwits sentiment indicators.
  - [ ] 16.3.3 **The Mathematics** — Bullish/bearish labels, message volume.
  - [ ] 16.3.4 **Implementation** — StockTwits API integration.
  - [ ] 16.3.5 **Trading Application** — Twitter + StockTwits combined improves Long/Short returns by 20%+.
- [ ] **Quick Reference** — Social media data sources comparison.

### Part 2 (`16-2`): Sentiment Analysis Methods

- [ ] **16.4 Lexicon-Based Sentiment** — Word counting approaches.
  - [ ] 16.4.1 **Why It Works** — Simple, interpretable, fast.
  - [ ] 16.4.2 **Visual Evidence** — Positive/negative word clouds.
  - [ ] 16.4.3 **The Mathematics** — Sentiment = (positive_words - negative_words) / total_words.
    - Financial lexicons: Loughran-McDonald.
  - [ ] 16.4.4 **Implementation** — Lexicon-based sentiment in R.
  - [ ] 16.4.5 **Trading Application** — Earnings call tone analysis.
- [ ] **16.5 Machine Learning Sentiment** — Learning from labelled data.
  - [ ] 16.5.1 **Why It Works** — Captures context, sarcasm, domain specifics.
  - [ ] 16.5.2 **Visual Evidence** — Model performance comparison.
  - [ ] 16.5.3 **The Mathematics** — Text classification: bag-of-words, TF-IDF, word embeddings.
    - Naive Bayes, SVM, neural classifiers.
  - [ ] 16.5.4 **Implementation** — Sentiment classifier training.
  - [ ] 16.5.5 **Trading Application** — Custom sentiment models for finance.
- [ ] **16.6 Aggregating Sentiment** — From posts to signals.
  - [ ] 16.6.1 **Why It Works** — Individual posts are noisy, aggregates are signals.
  - [ ] 16.6.2 **Visual Evidence** — Raw vs aggregated sentiment time series.
  - [ ] 16.6.3 **The Mathematics** — Volume-weighted sentiment, exponential decay.
    - Cross-sectional normalisation, z-scoring.
  - [ ] 16.6.4 **Implementation** — Sentiment aggregation pipeline.
  - [ ] 16.6.5 **Trading Application** — Daily sentiment factor construction.
- [ ] **Quick Reference** — Sentiment analysis method comparison.

### Part 3 (`16-3`): Sentiment Trading Strategies

- [ ] **16.7 Sentiment Momentum** — Trading with the crowd.
  - [ ] 16.7.1 **Why It Works** — Positive sentiment predicts short-term returns.
  - [ ] 16.7.2 **Visual Evidence** — Sentiment quintile returns.
  - [ ] 16.7.3 **The Mathematics** — Long high sentiment, short low sentiment.
    - Holding period optimisation.
  - [ ] 16.7.4 **Implementation** — Sentiment momentum strategy.
  - [ ] 16.7.5 **Trading Application** — Combining sentiment with price momentum.
- [ ] **16.8 Sentiment Reversals** — Fading the crowd.
  - [ ] 16.8.1 **Why It Works** — Extreme sentiment predicts reversals.
  - [ ] 16.8.2 **Visual Evidence** — Extreme sentiment vs subsequent returns.
  - [ ] 16.8.3 **The Mathematics** — Contrarian signals from sentiment extremes.
  - [ ] 16.8.4 **Implementation** — Sentiment reversal strategy.
  - [ ] 16.8.5 **Trading Application** — When to go with vs against sentiment.
- [ ] **16.9 Event-Driven Sentiment** — Earnings and news.
  - [ ] 16.9.1 **Why It Works** — Sentiment spikes around events are informative.
  - [ ] 16.9.2 **Visual Evidence** — Sentiment around earnings announcements.
  - [ ] 16.9.3 **The Mathematics** — Abnormal sentiment, pre-earnings drift.
  - [ ] 16.9.4 **Implementation** — Event-driven sentiment strategy.
  - [ ] 16.9.5 **Trading Application** — Earnings season sentiment trading.
- [ ] **Quick Reference** — Sentiment strategy summary.

---

## Chapter 17: Alternative Data III — Web Scraping and Transaction Data

*Mining the internet for alpha.*

**Files:**
- `17-1_financial-statistics-2-advanced_altdata_web-scraping.Rmd`
- `17-2_financial-statistics-2-advanced_altdata_transaction.Rmd`
- `17-3_financial-statistics-2-advanced_altdata_integration.Rmd`

### Part 1 (`17-1`): Web Scraping for Trading

- [ ] **17.1 Web Scraping Fundamentals** — Extracting data from the web.
  - [ ] 17.1.1 **Why It Works** — Public information not yet in databases.
  - [ ] 17.1.2 **Visual Evidence** — Scraped data examples.
  - [ ] 17.1.3 **The Mathematics** — Not applicable (engineering focus).
  - [ ] 17.1.4 **Implementation** — `rvest` for web scraping in R.
  - [ ] 17.1.5 **Trading Application** — Legal and ethical considerations.
- [ ] **17.2 Job Postings** — Company growth signals.
  - [ ] 17.2.1 **Why It Works** — Hiring indicates expansion, layoffs indicate trouble.
  - [ ] 17.2.2 **Visual Evidence** — Job posting trends vs earnings.
  - [ ] 17.2.3 **The Mathematics** — Role categorisation, growth rate calculation.
    - Sector-relative hiring.
  - [ ] 17.2.4 **Implementation** — Job posting scraping pipeline.
  - [ ] 17.2.5 **Trading Application** — Job posting momentum strategy.
- [ ] **17.3 App Rankings and Reviews** — Consumer behaviour signals.
  - [ ] 17.3.1 **Why It Works** — App usage predicts revenue.
  - [ ] 17.3.2 **Visual Evidence** — App Store rankings vs company performance.
  - [ ] 17.3.3 **The Mathematics** — Ranking changes, download estimates.
    - Review sentiment, rating trends.
  - [ ] 17.3.4 **Implementation** — App Store data collection.
  - [ ] 17.3.5 **Trading Application** — Tech company earnings signals.
- [ ] **17.4 E-commerce and Pricing Data** — Competitive intelligence.
  - [ ] 17.4.1 **Why It Works** — Prices and inventory indicate demand.
  - [ ] 17.4.2 **Visual Evidence** — Price changes, out-of-stock signals.
  - [ ] 17.4.3 **The Mathematics** — Price index construction, availability metrics.
  - [ ] 17.4.4 **Implementation** — E-commerce monitoring pipeline.
  - [ ] 17.4.5 **Trading Application** — Retail and consumer goods trading.
- [ ] **Quick Reference** — Web scraping best practices.

### Part 2 (`17-2`): Transaction and Consumer Data

- [ ] **17.5 Credit Card Data** — Real-time consumer spending.
  - [ ] 17.5.1 **Why It Works** — Spending data available before earnings.
  - [ ] 17.5.2 **Visual Evidence** — Credit card spend vs reported revenue.
  - [ ] 17.5.3 **The Mathematics** — Panel data, sampling bias correction.
    - Extrapolation to population.
  - [ ] 17.5.4 **Implementation** — Working with credit card data providers.
  - [ ] 17.5.5 **Trading Application** — Retail earnings prediction.
- [ ] **17.6 Point-of-Sale Data** — Transaction-level insights.
  - [ ] 17.6.1 **Why It Works** — SKU-level data, basket analysis.
  - [ ] 17.6.2 **Visual Evidence** — POS trends, category performance.
  - [ ] 17.6.3 **The Mathematics** — Same-store sales calculation.
    - Product mix analysis.
  - [ ] 17.6.4 **Implementation** — POS data analysis.
  - [ ] 17.6.5 **Trading Application** — CPG and retail trading signals.
- [ ] **17.7 Location Data** — Foot traffic analysis.
  - [ ] 17.7.1 **Why It Works** — Physical visits indicate business health.
  - [ ] 17.7.2 **Visual Evidence** — Foot traffic vs revenue.
  - [ ] 17.7.3 **The Mathematics** — Dwell time, visit frequency.
    - Geofencing, device tracking.
  - [ ] 17.7.4 **Implementation** — Location data providers, analysis.
  - [ ] 17.7.5 **Trading Application** — Retail and restaurant trading.
- [ ] **Quick Reference** — Transaction data sources.

### Part 3 (`17-3`): Data Integration and Quality

- [ ] **17.8 Alternative Data Quality** — Garbage in, garbage out.
  - [ ] 17.8.1 **Why It Works** — Bad data destroys strategies.
  - [ ] 17.8.2 **Visual Evidence** — Data quality issues, coverage gaps.
  - [ ] 17.8.3 **The Mathematics** — Completeness, accuracy, timeliness metrics.
    - Backfill detection, survivorship in alternative data.
  - [ ] 17.8.4 **Implementation** — Data quality checks.
  - [ ] 17.8.5 **Trading Application** — Due diligence on data vendors.
- [ ] **17.9 Combining Alternative Data** — Multi-source signals.
  - [ ] 17.9.1 **Why It Works** — Different data captures different information.
  - [ ] 17.9.2 **Visual Evidence** — Combined vs single-source performance.
  - [ ] 17.9.3 **The Mathematics** — Signal combination, ensemble methods.
    - Information coefficient aggregation.
  - [ ] 17.9.4 **Implementation** — Multi-source alternative data strategy.
  - [ ] 17.9.5 **Trading Application** — Building a comprehensive alternative data strategy.
- [ ] **17.10 LLM Tools for Text Processing** — Using AI APIs for analysis.
  - [ ] 17.10.1 **Why It Works** — LLMs understand context, extract structured data.
  - [ ] 17.10.2 **Visual Evidence** — LLM extraction examples.
  - [ ] 17.10.3 **The Mathematics** — Not applicable (tool usage focus).
  - [ ] 17.10.4 **Implementation** — OpenAI/Anthropic API for text analysis.
    - Prompt engineering for financial text.
    - Structured output extraction.
  - [ ] 17.10.5 **Trading Application** — Automating text-to-signal pipelines.
- [ ] **Quick Reference** — Alternative data integration checklist.

---

## Chapter 18: Alternative Data IV — Regulatory Filings and Insider Activity

*What the insiders know, and what they're required to disclose.*

**Files:**
- `18-1_financial-statistics-2-advanced_altdata_sec-filings.Rmd`
- `18-2_financial-statistics-2-advanced_altdata_insider-trading.Rmd`
- `18-3_financial-statistics-2-advanced_altdata_government-data.Rmd`

### Part 1 (`18-1`): SEC Filings and Disclosures

- [ ] **18.1 Parsing SEC Filings** — Mining the EDGAR database.
  - [ ] 18.1.1 **Why It Works** — Legally required disclosures contain material information.
  - [ ] 18.1.2 **Visual Evidence** — Filing frequency, abnormal filing patterns.
  - [ ] 18.1.3 **The Mathematics** — Text analysis: sentiment, readability, similarity.
    - Fog index, cosine similarity between filings.
  - [ ] 18.1.4 **Implementation** — EDGAR API, parsing 10-K, 10-Q, 8-K filings.
  - [ ] 18.1.5 **Trading Application** — Early filing detection, sentiment changes.
- [ ] **18.2 13F Holdings** — What institutions own.
  - [ ] 18.2.1 **Why It Works** — Large investors have research advantages.
  - [ ] 18.2.2 **Visual Evidence** — Hedge fund portfolio changes, crowded trades.
  - [ ] 18.2.3 **The Mathematics** — Position changes, conviction scoring.
    - Overlap analysis, herding detection.
  - [ ] 18.2.4 **Implementation** — 13F parsing, portfolio reconstruction.
  - [ ] 18.2.5 **Trading Application** — Following smart money (with 45-day lag caveat).
- [ ] **18.3 Short Interest Data** — Bearish bets revealed.
  - [ ] 18.3.1 **Why It Works** — Short sellers are often informed.
  - [ ] 18.3.2 **Visual Evidence** — Short interest vs returns, squeeze candidates.
  - [ ] 18.3.3 **The Mathematics** — Days to cover, short interest ratio.
    - Cost to borrow as signal.
  - [ ] 18.3.4 **Implementation** — Short interest data providers, analysis.
  - [ ] 18.3.5 **Trading Application** — Short squeeze detection, contrarian signals.
- [ ] **Quick Reference** — SEC filing types and trading implications.

### Part 2 (`18-2`): Insider Trading Signals

- [ ] **18.4 Form 4 Filings** — When insiders buy and sell.
  - [ ] 18.4.1 **Why It Works** — Insiders know their companies best.
  - [ ] 18.4.2 **Visual Evidence** — Insider buying clusters, CEO purchases.
  - [ ] 18.4.3 **The Mathematics** — Aggregate insider sentiment, role weighting.
    - CEO/CFO trades weighted more heavily.
  - [ ] 18.4.4 **Implementation** — Form 4 parsing, insider database construction.
  - [ ] 18.4.5 **Trading Application** — Insider buying generates 3-5% annual alpha.
- [ ] **18.5 Congressional Trading** — Political information advantage.
  - [ ] 18.5.1 **Why It Works** — Lawmakers have access to non-public policy information.
  - [ ] 18.5.2 **Visual Evidence** — Congressional vs market performance, sector timing.
  - [ ] 18.5.3 **The Mathematics** — Abnormal returns around trades, policy exposure.
  - [ ] 18.5.4 **Implementation** — Capitol Trades, stock watcher APIs.
  - [ ] 18.5.5 **Trading Application** — Following political signals (ethical considerations).
- [ ] **18.6 Executive Compensation Signals** — What pay packages reveal.
  - [ ] 18.6.1 **Why It Works** — Compensation structure affects behaviour.
  - [ ] 18.6.2 **Visual Evidence** — Option grants, bonus targets.
  - [ ] 18.6.3 **The Mathematics** — Incentive alignment, earnings management risk.
  - [ ] 18.6.4 **Implementation** — DEF 14A proxy parsing.
  - [ ] 18.6.5 **Trading Application** — Management incentive analysis.
- [ ] **Quick Reference** — Insider activity signals summary.

### Part 3 (`18-3`): Government and Regulatory Data

- [ ] **18.7 Government Contracts** — Federal spending signals.
  - [ ] 18.7.1 **Why It Works** — Contract awards are material revenue events.
  - [ ] 18.7.2 **Visual Evidence** — Contract announcements vs stock price.
  - [ ] 18.7.3 **The Mathematics** — Contract value, margin estimation.
    - Sector exposure to government spending.
  - [ ] 18.7.4 **Implementation** — USAspending.gov, FPDS data access.
  - [ ] 18.7.5 **Trading Application** — Defence/government contractor signals.
- [ ] **18.8 FDA and Clinical Trial Data** — Biotech event trading.
  - [ ] 18.8.1 **Why It Works** — Drug approvals create binary events.
  - [ ] 18.8.2 **Visual Evidence** — Approval probability, AdCom votes.
  - [ ] 18.8.3 **The Mathematics** — Event probability estimation, option-implied moves.
    - Clinical trial statistics, endpoint analysis.
  - [ ] 18.8.4 **Implementation** — ClinicalTrials.gov, FDA calendar.
  - [ ] 18.8.5 **Trading Application** — Biotech event strategies.
- [ ] **18.9 Patent and IP Data** — Innovation signals.
  - [ ] 18.9.1 **Why It Works** — Patents indicate R&D success.
  - [ ] 18.9.2 **Visual Evidence** — Patent grants vs future returns.
  - [ ] 18.9.3 **The Mathematics** — Citation analysis, patent quality metrics.
    - Technology sector classification.
  - [ ] 18.9.4 **Implementation** — USPTO, Google Patents API.
  - [ ] 18.9.5 **Trading Application** — Innovation factor construction.
- [ ] **Quick Reference** — Government data sources.

---

## Chapter 19: Alternative Data V — ESG, Weather, and Macro Nowcasting

*Sustainability metrics, environmental signals, and real-time economic indicators.*

**Files:**
- `19-1_financial-statistics-2-advanced_altdata_esg.Rmd`
- `19-2_financial-statistics-2-advanced_altdata_weather-commodities.Rmd`
- `19-3_financial-statistics-2-advanced_altdata_macro-nowcasting.Rmd`

### Part 1 (`19-1`): ESG and Sustainability Data

- [ ] **19.1 ESG Ratings and Scores** — Sustainability as signal.
  - [ ] 19.1.1 **Why It Works** — ESG may predict long-term risk and return.
  - [ ] 19.1.2 **Visual Evidence** — ESG scores vs returns, rating disagreement.
  - [ ] 19.1.3 **The Mathematics** — Rating methodologies, factor construction.
    - E, S, G component separation.
  - [ ] 19.1.4 **Implementation** — ESG data providers (MSCI, Sustainalytics).
  - [ ] 19.1.5 **Trading Application** — ESG momentum, rating upgrades.
- [ ] **19.2 Carbon and Emissions Data** — Climate transition risk.
  - [ ] 19.2.1 **Why It Works** — Carbon pricing affects future costs.
  - [ ] 19.2.2 **Visual Evidence** — Carbon intensity vs sector performance.
  - [ ] 19.2.3 **The Mathematics** — Scope 1, 2, 3 emissions, carbon beta.
  - [ ] 19.2.4 **Implementation** — CDP, TCFD data access.
  - [ ] 19.2.5 **Trading Application** — Climate transition factor.
- [ ] **19.3 Controversy and News Sentiment** — Reputational risk.
  - [ ] 19.3.1 **Why It Works** — Controversies predict future problems.
  - [ ] 19.3.2 **Visual Evidence** — Controversy scores, scandal impact.
  - [ ] 19.3.3 **The Mathematics** — Event detection, severity scoring.
  - [ ] 19.3.4 **Implementation** — News API, controversy databases.
  - [ ] 19.3.5 **Trading Application** — ESG controversy avoidance.
- [ ] **Quick Reference** — ESG data providers and metrics.

### Part 2 (`19-2`): Weather and Commodity Signals

- [ ] **19.4 Weather Data for Trading** — Climate affects commerce.
  - [ ] 19.4.1 **Why It Works** — Weather impacts demand, supply, operations.
  - [ ] 19.4.2 **Visual Evidence** — Temperature anomalies, heating degree days.
  - [ ] 19.4.3 **The Mathematics** — Degree day calculation, seasonal adjustment.
    - Weather derivatives: HDD, CDD.
  - [ ] 19.4.4 **Implementation** — NOAA, weather API integration.
  - [ ] 19.4.5 **Trading Application** — Utilities, retail, agriculture signals.
- [ ] **19.5 Agricultural and Commodity Fundamentals** — Supply-side data.
  - [ ] 19.5.1 **Why It Works** — Inventory, production data predicts prices.
  - [ ] 19.5.2 **Visual Evidence** — USDA reports, inventory cycles.
  - [ ] 19.5.3 **The Mathematics** — Supply/demand models, carry signals.
  - [ ] 19.5.4 **Implementation** — USDA, commodity data access.
  - [ ] 19.5.5 **Trading Application** — Commodity fundamental strategies.
- [ ] **19.6 Energy Market Data** — Oil, gas, and electricity.
  - [ ] 19.6.1 **Why It Works** — Energy drives the economy.
  - [ ] 19.6.2 **Visual Evidence** — EIA inventories, rig counts.
  - [ ] 19.6.3 **The Mathematics** — Storage models, crack spreads.
  - [ ] 19.6.4 **Implementation** — EIA, energy data sources.
  - [ ] 19.6.5 **Trading Application** — Energy sector timing.
- [ ] **Quick Reference** — Weather and commodity data sources.

### Part 3 (`19-3`): Macro Nowcasting

- [ ] **19.7 High-Frequency Economic Indicators** — Real-time GDP.
  - [ ] 19.7.1 **Why It Works** — Official data lags, alternative data leads.
  - [ ] 19.7.2 **Visual Evidence** — Nowcast vs official GDP.
  - [ ] 19.7.3 **The Mathematics** — Factor models, Kalman filtering for nowcasting.
    - Mixed-frequency data handling.
  - [ ] 19.7.4 **Implementation** — Building a nowcast model.
  - [ ] 19.7.5 **Trading Application** — Macro regime timing.
- [ ] **19.8 Search Trends and Digital Exhaust** — Google as economic indicator.
  - [ ] 19.8.1 **Why It Works** — Search behaviour reveals intentions.
  - [ ] 19.8.2 **Visual Evidence** — Google Trends vs unemployment, retail.
  - [ ] 19.8.3 **The Mathematics** — Query selection, seasonality adjustment.
  - [ ] 19.8.4 **Implementation** — Google Trends API, query strategies.
  - [ ] 19.8.5 **Trading Application** — Consumer confidence nowcasting.
- [ ] **19.9 Payments and Financial Flow Data** — Real-time spending.
  - [ ] 19.9.1 **Why It Works** — Payment flows are real-time GDP.
  - [ ] 19.9.2 **Visual Evidence** — ACH, wire transfer volumes.
  - [ ] 19.9.3 **The Mathematics** — Seasonal adjustment, trend extraction.
  - [ ] 19.9.4 **Implementation** — Fed data, payment network APIs.
  - [ ] 19.9.5 **Trading Application** — Economic turning point detection.
- [ ] **Quick Reference** — Macro nowcasting data sources.

---

## Chapter 20: Options and Derivatives Trading

*Trading the Greeks — systematic approaches to options.*

**Files:**
- `20-1_financial-statistics-2-advanced_options_foundations.Rmd`
- `20-2_financial-statistics-2-advanced_options_volatility-surface.Rmd`
- `20-3_financial-statistics-2-advanced_options_strategies.Rmd`

### Part 1 (`20-1`): Options Foundations

- [ ] **20.1 Option Pricing Review** — Black-Scholes and beyond.
  - [ ] 20.1.1 **Why It Works** — Risk-neutral pricing, replication.
  - [ ] 20.1.2 **Visual Evidence** — Option payoffs, price surfaces.
  - [ ] 20.1.3 **The Mathematics** — BS formula: C = S×N(d₁) - K×e^{-rT}×N(d₂).
    - Greeks: Δ = ∂C/∂S, Γ = ∂²C/∂S², θ = ∂C/∂t, ν = ∂C/∂σ.
  - [ ] 20.1.4 **Implementation** — BS pricing and Greeks in R.
  - [ ] 20.1.5 **Trading Application** — Understanding what you're trading.
- [ ] **20.2 The Greeks in Practice** — Risk sensitivities.
  - [ ] 20.2.1 **Why It Works** — Greeks decompose option risk.
  - [ ] 20.2.2 **Visual Evidence** — Greek surfaces, P&L attribution.
  - [ ] 20.2.3 **The Mathematics** — Taylor expansion: dC ≈ Δ×dS + ½Γ×dS² + θ×dt + ν×dσ.
  - [ ] 20.2.4 **Implementation** — Greek calculation, portfolio Greeks.
  - [ ] 20.2.5 **Trading Application** — Managing Greek exposures.
- [ ] **20.3 Implied Volatility** — What the market thinks.
  - [ ] 20.3.1 **Why It Works** — IV embeds market expectations.
  - [ ] 20.3.2 **Visual Evidence** — IV term structure, skew.
  - [ ] 20.3.3 **The Mathematics** — BS inversion: σ_imp = BS^{-1}(C_market).
    - Newton-Raphson iteration.
  - [ ] 20.3.4 **Implementation** — IV calculation, IV surface construction.
  - [ ] 20.3.5 **Trading Application** — IV as trading signal.
- [ ] **Quick Reference** — Options formulae, Greek definitions.

### Part 2 (`20-2`): Volatility Surface Trading

- [ ] **20.4 The Volatility Surface** — IV across strikes and maturities.
  - [ ] 20.4.1 **Why It Works** — Surface shape reveals risk preferences.
  - [ ] 20.4.2 **Visual Evidence** — 3D volatility surface, smile/skew.
  - [ ] 20.4.3 **The Mathematics** — Surface parametrisation: SVI, SABR.
    - Smile, skew, term structure.
  - [ ] 20.4.4 **Implementation** — Volatility surface construction.
  - [ ] 20.4.5 **Trading Application** — Surface arbitrage.
- [ ] **20.5 Volatility Skew** — Why puts are expensive.
  - [ ] 20.5.1 **Why It Works** — Crash risk, leverage effect.
  - [ ] 20.5.2 **Visual Evidence** — Skew over time, skew premium.
  - [ ] 20.5.3 **The Mathematics** — Skew = IV(90% moneyness) - IV(110% moneyness).
    - Risk reversal, butterfly.
  - [ ] 20.5.4 **Implementation** — Skew calculation, monitoring.
  - [ ] 20.5.5 **Trading Application** — Selling skew premium.
- [ ] **20.6 Term Structure Trading** — Volatility calendar spreads.
  - [ ] 20.6.1 **Why It Works** — Term structure mean-reverts.
  - [ ] 20.6.2 **Visual Evidence** — Term structure over time.
  - [ ] 20.6.3 **The Mathematics** — Calendar spread: sell near-dated, buy far-dated.
    - VIX futures curve trading.
  - [ ] 20.6.4 **Implementation** — Term structure trading strategies.
  - [ ] 20.6.5 **Trading Application** — VIX term structure mean reversion.
- [ ] **Quick Reference** — Volatility surface metrics.

### Part 3 (`20-3`): Systematic Options Strategies

- [ ] **20.7 Covered Calls and Cash-Secured Puts** — Income strategies.
  - [ ] 20.7.1 **Why It Works** — Harvesting volatility premium.
  - [ ] 20.7.2 **Visual Evidence** — BXM index performance.
  - [ ] 20.7.3 **The Mathematics** — Covered call = long stock + short call.
    - Strike selection, roll timing.
  - [ ] 20.7.4 **Implementation** — Systematic covered call strategy.
  - [ ] 20.7.5 **Trading Application** — Income generation in sideways markets.
- [ ] **20.8 Dispersion Trading** — Index vs single-stock volatility.
  - [ ] 20.8.1 **Why It Works** — Correlation risk premium.
  - [ ] 20.8.2 **Visual Evidence** — Implied correlation, dispersion returns.
  - [ ] 20.8.3 **The Mathematics** — σ²_index = Σw²σ² + ΣΣw_iw_jρ_{ij}σ_iσ_j.
    - Implied correlation > realised correlation (usually).
  - [ ] 20.8.4 **Implementation** — Dispersion trading strategy.
  - [ ] 20.8.5 **Trading Application** — Selling correlation.
- [ ] **20.9 Tail Risk Hedging** — Protecting against crashes.
  - [ ] 20.9.1 **Why It Works** — Convexity when you need it most.
  - [ ] 20.9.2 **Visual Evidence** — Tail hedge performance in 2008, 2020.
  - [ ] 20.9.3 **The Mathematics** — Put spread, VIX call, variance swap.
    - Cost-effective tail protection.
  - [ ] 20.9.4 **Implementation** — Tail hedging strategies.
  - [ ] 20.9.5 **Trading Application** — Portfolio insurance.
- [ ] **Quick Reference** — Systematic options strategy summary.

---

## Chapter 21: Trading Less Efficient Markets

*Where simple strategies still work — emerging markets, frontier markets, and crypto.*

**Files:**
- `21-1_financial-statistics-2-advanced_virgin_market-efficiency.Rmd`
- `21-2_financial-statistics-2-advanced_virgin_emerging-frontier.Rmd`
- `21-3_financial-statistics-2-advanced_virgin_crypto.Rmd`

This chapter explores markets where the strategies that worked in developed markets 20-30 years ago may still generate alpha today. Less competition, worse data, and structural inefficiencies create opportunities for systematic traders.

### Part 1 (`21-1`): Market Efficiency Hierarchy

- [ ] **21.1 The Efficiency Spectrum** — Not all markets are equal.
  - [ ] 21.1.1 **Why It Works** — Efficiency requires competition, data, and capital.
  - [ ] 21.1.2 **Visual Evidence** — Return predictability by market development.
  - [ ] 21.1.3 **The Mathematics** — Variance ratio tests, Hurst exponent.
    - Measuring market efficiency: autocorrelation, return predictability.
  - [ ] 21.1.4 **Implementation** — Efficiency tests in R.
  - [ ] 21.1.5 **Trading Application** — Identifying inefficient markets.
- [ ] **21.2 Why Strategies Decay** — Alpha erosion over time.
  - [ ] 21.2.1 **Why It Works** — Competition arbitrages away predictability.
  - [ ] 21.2.2 **Visual Evidence** — Factor returns over decades, strategy crowding.
  - [ ] 21.2.3 **The Mathematics** — Information diffusion models.
    - Half-life of alpha.
  - [ ] 21.2.4 **Implementation** — Measuring strategy decay.
  - [ ] 21.2.5 **Trading Application** — When to abandon a market.
- [ ] **21.3 Finding Virgin Markets** — Where to look.
  - [ ] 21.3.1 **Why It Works** — Less competition = more opportunity.
  - [ ] 21.3.2 **Visual Evidence** — Map of market efficiency, barriers to entry.
  - [ ] 21.3.3 **The Mathematics** — Screening criteria: liquidity, data quality, access.
  - [ ] 21.3.4 **Implementation** — Market screening framework.
  - [ ] 21.3.5 **Trading Application** — Balancing opportunity vs execution challenges.
- [ ] **Quick Reference** — Market efficiency metrics.

### Part 2 (`21-2`): Emerging and Frontier Markets

- [ ] **21.4 Emerging Market Characteristics** — What makes them different.
  - [ ] 21.4.1 **Why It Works** — Information asymmetry, local factors, barriers.
  - [ ] 21.4.2 **Visual Evidence** — EM vs DM return distributions, correlations.
  - [ ] 21.4.3 **The Mathematics** — Country risk, currency effects.
    - Local vs global factors.
  - [ ] 21.4.4 **Implementation** — EM data access, adjustments.
  - [ ] 21.4.5 **Trading Application** — BRIC, EM ex-China, regional approaches.
- [ ] **21.5 Factor Strategies in Emerging Markets** — What works differently.
  - [ ] 21.5.1 **Why It Works** — Different investor base, different biases.
  - [ ] 21.5.2 **Visual Evidence** — Value, momentum, quality in EM vs DM.
  - [ ] 21.5.3 **The Mathematics** — Value: works BETTER in EM (0.41-2.34% monthly in BRIC).
    - Momentum: works WORSE in EM (opposite of developed!).
    - Quality: strong in EM, especially during crises.
  - [ ] 21.5.4 **Implementation** — EM factor strategies.
  - [ ] 21.5.5 **Trading Application** — Overweight value, underweight momentum in EM.
- [ ] **21.6 Technical Analysis in Less Efficient Markets** — Simple signals work.
  - [ ] 21.6.1 **Why It Works** — Less information processing, slower reaction.
  - [ ] 21.6.2 **Visual Evidence** — MA crossover performance: EM vs DM.
  - [ ] 21.6.3 **The Mathematics** — SMAs outperform oscillators in EM.
    - Optimisation less important than in DM.
  - [ ] 21.6.4 **Implementation** — EM technical strategies.
  - [ ] 21.6.5 **Trading Application** — Simple moving averages work.
- [ ] **21.7 Frontier Markets** — The final frontier.
  - [ ] 21.7.1 **Why It Works** — Minimal institutional presence, local dynamics.
  - [ ] 21.7.2 **Visual Evidence** — Frontier market returns, diversification benefit.
  - [ ] 21.7.3 **The Mathematics** — Lower correlation with global markets.
    - Domestic factors dominate.
  - [ ] 21.7.4 **Implementation** — Frontier market access, data challenges.
  - [ ] 21.7.5 **Trading Application** — Africa, Central Asia, smaller Asian markets.
- [ ] **Quick Reference** — Emerging/frontier market strategy adjustments.

### Part 3 (`21-3`): Cryptocurrency Markets

- [ ] **21.8 Crypto Market Characteristics** — A new asset class.
  - [ ] 21.8.1 **Why It Works** — 24/7 trading, fragmented liquidity, retail-dominated.
  - [ ] 21.8.2 **Visual Evidence** — Crypto return distributions, volatility.
  - [ ] 21.8.3 **The Mathematics** — Exchange fragmentation, price discrepancies.
    - Funding rates, basis.
  - [ ] 21.8.4 **Implementation** — Crypto data access, exchange APIs.
  - [ ] 21.8.5 **Trading Application** — BTC/ETH as majors, altcoin approaches.
- [ ] **21.9 Crypto Inefficiencies** — Where alpha persists.
  - [ ] 21.9.1 **Why It Works** — Immature market structure, information asymmetry.
  - [ ] 21.9.2 **Visual Evidence** — Cross-exchange arbitrage, momentum returns.
  - [ ] 21.9.3 **The Mathematics** — Weekly strategies still work (unlike equities).
    - Momentum strong, mean reversion in short-term.
    - Funding rate carry.
  - [ ] 21.9.4 **Implementation** — Crypto strategy backtesting.
  - [ ] 21.9.5 **Trading Application** — Simple momentum strategies still profitable.
- [ ] **21.10 Cross-Exchange Arbitrage** — Exploiting fragmentation.
  - [ ] 21.10.1 **Why It Works** — Same asset, different prices.
  - [ ] 21.10.2 **Visual Evidence** — Price discrepancies, arbitrage windows.
  - [ ] 21.10.3 **The Mathematics** — Triangular arbitrage, cross-exchange arbitrage.
    - Transaction costs, transfer times.
  - [ ] 21.10.4 **Implementation** — Cross-exchange monitoring.
  - [ ] 21.10.5 **Trading Application** — Latency arbitrage in crypto.
- [ ] **21.11 On-Chain Analytics** — Unique crypto data.
  - [ ] 21.11.1 **Why It Works** — Blockchain is transparent, analysable.
  - [ ] 21.11.2 **Visual Evidence** — Whale movements, exchange flows.
  - [ ] 21.11.3 **The Mathematics** — Network metrics, holder analysis.
    - Exchange inflow/outflow signals.
  - [ ] 21.11.4 **Implementation** — On-chain data providers, analysis.
  - [ ] 21.11.5 **Trading Application** — Supply-side signals.
- [ ] **21.12 Crypto Risk Management** — Unique challenges.
  - [ ] 21.12.1 **Why It Works** — Exchange risk, regulatory risk, technical risk.
  - [ ] 21.12.2 **Visual Evidence** — Exchange failures, flash crashes.
  - [ ] 21.12.3 **The Mathematics** — Counterparty risk assessment, position limits.
  - [ ] 21.12.4 **Implementation** — Risk management for crypto.
  - [ ] 21.12.5 **Trading Application** — Survival in crypto markets.
- [ ] **Quick Reference** — Crypto trading checklist.

---

## Chapter 22: Causal Inference and Model Robustness

*Separating correlation from causation, and building strategies that last.*

**Files:**
- `22-1_financial-statistics-2-advanced_causal_foundations.Rmd`
- `22-2_financial-statistics-2-advanced_causal_methods.Rmd`
- `22-3_financial-statistics-2-advanced_causal_robustness.Rmd`

### Part 1 (`22-1`): Causal Foundations

- [ ] **22.1 Correlation is Not Causation** — Why it matters for trading.
  - [ ] 22.1.1 **Why It Works** — Spurious correlations don't persist.
  - [ ] 22.1.2 **Visual Evidence** — Spurious correlations, data mining examples.
  - [ ] 22.1.3 **The Mathematics** — Confounding, selection bias, reverse causation.
    - DAGs (Directed Acyclic Graphs) for causal reasoning.
  - [ ] 22.1.4 **Implementation** — Identifying potential confounders.
  - [ ] 22.1.5 **Trading Application** — Why understanding mechanism matters.
- [ ] **22.2 The Potential Outcomes Framework** — Formalising causation.
  - [ ] 22.2.1 **Why It Works** — Rigorous definition of causal effect.
  - [ ] 22.2.2 **Visual Evidence** — Treatment/control, counterfactuals.
  - [ ] 22.2.3 **The Mathematics** — Y(1), Y(0), ATE = E[Y(1) - Y(0)].
    - SUTVA, ignorability assumptions.
  - [ ] 22.2.4 **Implementation** — Potential outcomes notation in practice.
  - [ ] 22.2.5 **Trading Application** — Causal effect of signals on returns.
- [ ] **22.3 Natural Experiments in Finance** — Quasi-experimental designs.
  - [ ] 22.3.1 **Why It Works** — Nature provides random variation.
  - [ ] 22.3.2 **Visual Evidence** — Examples: index additions, analyst coverage.
  - [ ] 22.3.3 **The Mathematics** — Difference-in-differences, regression discontinuity.
  - [ ] 22.3.4 **Implementation** — DiD estimation in R.
  - [ ] 22.3.5 **Trading Application** — Testing factor causality.
- [ ] **Quick Reference** — Causal inference concepts.

### Part 2 (`22-2`): Causal Methods

- [ ] **22.4 Instrumental Variables** — Finding exogenous variation.
  - [ ] 22.4.1 **Why It Works** — IV isolates causal effect.
  - [ ] 22.4.2 **Visual Evidence** — IV diagram, instrument validity.
  - [ ] 22.4.3 **The Mathematics** — 2SLS: regress X on Z, then Y on X̂.
    - Relevance and exclusion assumptions.
  - [ ] 22.4.4 **Implementation** — IV regression in R.
  - [ ] 22.4.5 **Trading Application** — Testing signal causality.
- [ ] **22.5 Propensity Score Methods** — Creating comparable groups.
  - [ ] 22.5.1 **Why It Works** — Balance observables between treated/control.
  - [ ] 22.5.2 **Visual Evidence** — Covariate balance before/after matching.
  - [ ] 22.5.3 **The Mathematics** — e(X) = P(T=1|X), matching, IPW.
  - [ ] 22.5.4 **Implementation** — Propensity score matching in R.
  - [ ] 22.5.5 **Trading Application** — Evaluating strategy performance.
- [ ] **22.6 Regression Discontinuity** — Exploiting thresholds.
  - [ ] 22.6.1 **Why It Works** — Sharp cutoffs create quasi-experiments.
  - [ ] 22.6.2 **Visual Evidence** — RD plots, discontinuity detection.
  - [ ] 22.6.3 **The Mathematics** — Local linear regression around cutoff.
  - [ ] 22.6.4 **Implementation** — RD analysis in R.
  - [ ] 22.6.5 **Trading Application** — Index inclusion effects.
- [ ] **Quick Reference** — Causal method comparison.

### Part 3 (`22-3`): Model Robustness

- [ ] **22.7 Regime Detection** — Markets change.
  - [ ] 22.7.1 **Why It Works** — One model doesn't fit all regimes.
  - [ ] 22.7.2 **Visual Evidence** — Regime classification, conditional performance.
  - [ ] 22.7.3 **The Mathematics** — Hidden Markov Models, Markov switching regression.
    - Regime probability estimation.
  - [ ] 22.7.4 **Implementation** — Regime detection with HMM in R.
  - [ ] 22.7.5 **Trading Application** — Regime-adaptive strategies.
- [ ] **22.8 Structural Breaks** — When relationships change.
  - [ ] 22.8.1 **Why It Works** — Past performance doesn't guarantee future.
  - [ ] 22.8.2 **Visual Evidence** — Break detection, rolling coefficients.
  - [ ] 22.8.3 **The Mathematics** — Chow test, CUSUM, Bai-Perron.
  - [ ] 22.8.4 **Implementation** — Structural break tests in R.
  - [ ] 22.8.5 **Trading Application** — When to retrain, when to stop.
- [ ] **22.9 Model Uncertainty** — How wrong are you?
  - [ ] 22.9.1 **Why It Works** — All models are wrong, some are useful.
  - [ ] 22.9.2 **Visual Evidence** — Prediction intervals, model comparison.
  - [ ] 22.9.3 **The Mathematics** — Bayesian model averaging, ensemble methods.
    - Confidence intervals vs prediction intervals.
  - [ ] 22.9.4 **Implementation** — Model uncertainty quantification.
  - [ ] 22.9.5 **Trading Application** — Sizing positions by confidence.
- [ ] **22.10 Building Robust Strategies** — Surviving regime changes.
  - [ ] 22.10.1 **Why It Works** — Robustness beats optimisation.
  - [ ] 22.10.2 **Visual Evidence** — Robust vs optimised strategy performance.
  - [ ] 22.10.3 **The Mathematics** — Worst-case optimisation, minimax.
    - Diversification across regimes.
  - [ ] 22.10.4 **Implementation** — Robust strategy construction.
  - [ ] 22.10.5 **Trading Application** — Checklist for strategy robustness.
- [ ] **Quick Reference** — Robustness testing checklist.

---

## Chapter 23: Research Workflow and Practical Considerations

*Putting it all together — the complete trading research process.*

**Files:**
- `23-1_financial-statistics-2-advanced_workflow_research.Rmd`
- `23-2_financial-statistics-2-advanced_workflow_production.Rmd`
- `23-3_financial-statistics-2-advanced_workflow_career.Rmd`

### Part 1 (`23-1`): Research Process

- [ ] **23.1 Idea Generation** — Where do strategies come from?
  - [ ] 23.1.1 **Why It Works** — Systematic approach to finding edges.
  - [ ] 23.1.2 **Visual Evidence** — Idea funnel, success rates.
  - [ ] 23.1.3 **The Mathematics** — Not applicable (process focus).
  - [ ] 23.1.4 **Implementation** — Research log, idea tracking.
  - [ ] 23.1.5 **Trading Application** — Sources of trading ideas.
- [ ] **23.2 Research Hygiene** — Avoiding self-deception.
  - [ ] 23.2.1 **Why It Works** — Biases are everywhere.
  - [ ] 23.2.2 **Visual Evidence** — Common research mistakes.
  - [ ] 23.2.3 **The Mathematics** — Pre-registration, multiple testing correction.
  - [ ] 23.2.4 **Implementation** — Research protocol template.
  - [ ] 23.2.5 **Trading Application** — The research log discipline.
- [ ] **23.3 Documentation and Reproducibility** — Your future self will thank you.
  - [ ] 23.3.1 **Why It Works** — Code and results need to be reproducible.
  - [ ] 23.3.2 **Visual Evidence** — Good vs bad documentation.
  - [ ] 23.3.3 **The Mathematics** — Not applicable (engineering focus).
  - [ ] 23.3.4 **Implementation** — R Markdown, git, version control.
  - [ ] 23.3.5 **Trading Application** — Documenting strategies for production.
- [ ] **Quick Reference** — Research process checklist.

### Part 2 (`23-2`): Production Considerations

- [ ] **23.4 From Research to Production** — Crossing the divide.
  - [ ] 23.4.1 **Why It Works** — Research code is not production code.
  - [ ] 23.4.2 **Visual Evidence** — Research vs production architecture.
  - [ ] 23.4.3 **The Mathematics** — Not applicable (engineering focus).
  - [ ] 23.4.4 **Implementation** — Code refactoring, testing, deployment.
  - [ ] 23.4.5 **Trading Application** — Phased deployment approach.
- [ ] **23.5 Monitoring and Alerting** — Knowing when things go wrong.
  - [ ] 23.5.1 **Why It Works** — Early detection prevents disaster.
  - [ ] 23.5.2 **Visual Evidence** — Dashboard examples, alert systems.
  - [ ] 23.5.3 **The Mathematics** — Anomaly detection, statistical process control.
  - [ ] 23.5.4 **Implementation** — Monitoring system setup.
  - [ ] 23.5.5 **Trading Application** — What to monitor, when to intervene.
- [ ] **23.6 Continuous Improvement** — The strategy lifecycle.
  - [ ] 23.6.1 **Why It Works** — Markets evolve, strategies must too.
  - [ ] 23.6.2 **Visual Evidence** — Strategy evolution, version history.
  - [ ] 23.6.3 **The Mathematics** — A/B testing, gradual rollout.
  - [ ] 23.6.4 **Implementation** — Continuous improvement framework.
  - [ ] 23.6.5 **Trading Application** — When to update vs when to retire.
- [ ] **Quick Reference** — Production checklist.

### Part 3 (`23-3`): Career and Resources

- [ ] **23.7 Building a Track Record** — Proving your edge.
  - [ ] 23.7.1 **Why It Works** — Track record is the ultimate credential.
  - [ ] 23.7.2 **Visual Evidence** — Track record presentation examples.
  - [ ] 23.7.3 **The Mathematics** — Statistical significance of track records.
  - [ ] 23.7.4 **Implementation** — Track record documentation.
  - [ ] 23.7.5 **Trading Application** — Personal trading as proof of concept.
- [ ] **23.8 Resources and Continued Learning** — The journey continues.
  - [ ] 23.8.1 **Why It Works** — This field evolves rapidly.
  - [ ] 23.8.2 **Visual Evidence** — Resource map, learning paths.
  - [ ] 23.8.3 **The Mathematics** — Not applicable (resource focus).
  - [ ] 23.8.4 **Implementation** — Reading list, conferences, communities.
  - [ ] 23.8.5 **Trading Application** — Staying current.
- [ ] **23.9 Course Summary** — What you've learned.
  - [ ] 23.9.1 **Part I Recap** — Foundations and core strategies.
  - [ ] 23.9.2 **Part II Recap** — Advanced methods and specialised markets.
  - [ ] 23.9.3 **Next Steps** — Where to go from here.
- [ ] **Quick Reference** — Complete course reference card.

---

# Appendix A: LLM API Workflows for Trading

*Practical guide to using LLMs as trading tools — no maths, just APIs.*

**Files:**
- `appendix-a_financial-statistics-2-advanced_llm-workflows.Rmd`

This appendix provides practical recipes for using LLM APIs (OpenAI, Anthropic) to extract trading signals from text. No fine-tuning, no model building — just API calls and prompt engineering.

- [ ] **A.1 Setting Up LLM APIs** — Getting started.
  - [ ] A.1.1 OpenAI API setup, authentication.
  - [ ] A.1.2 Anthropic API setup, authentication.
  - [ ] A.1.3 Cost estimation, rate limits.
  - [ ] A.1.4 Error handling, retries.
- [ ] **A.2 Prompt Engineering for Finance** — Crafting effective prompts.
  - [ ] A.2.1 Sentiment extraction prompts.
  - [ ] A.2.2 Entity extraction (companies, people, events).
  - [ ] A.2.3 Summarisation prompts for earnings calls.
  - [ ] A.2.4 Classification prompts (bullish/bearish/neutral).
- [ ] **A.3 Structured Output** — Getting machine-readable results.
  - [ ] A.3.1 JSON output formatting.
  - [ ] A.3.2 Scoring scales, numeric output.
  - [ ] A.3.3 Validation and error checking.
- [ ] **A.4 Batch Processing** — Scaling to many documents.
  - [ ] A.4.1 Rate limiting strategies.
  - [ ] A.4.2 Parallel processing.
  - [ ] A.4.3 Caching and deduplication.
- [ ] **A.5 Example Workflows** — Complete pipelines.
  - [ ] A.5.1 Earnings call sentiment extraction.
  - [ ] A.5.2 News article classification.
  - [ ] A.5.3 SEC filing analysis.
  - [ ] A.5.4 Social media sentiment aggregation.
- [ ] **Quick Reference** — LLM prompt templates.

---

# Appendix B: R Packages Reference

*Quick reference for all R packages used in this course.*

**Files:**
- `appendix-b_financial-statistics-2-advanced_r-packages.Rmd`

- [ ] **B.1 Data Packages** — `quantmod`, `tidyquant`, `Quandl`.
- [ ] **B.2 Time Series** — `xts`, `zoo`, `data.table`.
- [ ] **B.3 Visualisation** — `ggplot2`, `plotly`, `highcharter`.
- [ ] **B.4 Statistics** — `stats`, `boot`, `sandwich`.
- [ ] **B.5 Econometrics** — `lmtest`, `urca`, `vars`, `rugarch`.
- [ ] **B.6 Machine Learning** — `glmnet`, `randomForest`, `xgboost`, `keras`.
- [ ] **B.7 Portfolio** — `PortfolioAnalytics`, `PerformanceAnalytics`.
- [ ] **B.8 Web Scraping** — `rvest`, `httr`, `jsonlite`.
- [ ] **B.9 Text Analysis** — `quanteda`, `tidytext`, `sentimentr`.

---

# Appendix C: Data Sources and APIs

*Where to get the data you need.*

**Files:**
- `appendix-c_financial-statistics-2-advanced_data-sources.Rmd`

- [ ] **C.1 Free Data Sources** — Yahoo Finance, FRED, Quandl, Alpha Vantage.
- [ ] **C.2 Academic Data** — WRDS, CRSP, Compustat (through university access).
- [ ] **C.3 Broker APIs** — Interactive Brokers, Alpaca, TD Ameritrade.
- [ ] **C.4 Alternative Data Vendors** — Overview of commercial providers.
- [ ] **C.5 Crypto Data** — CoinGecko, CryptoCompare, exchange APIs.

---

*End of Table of Contents*
