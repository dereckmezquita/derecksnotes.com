# Algorithmic Trading with R — Master Table of Contents

A rigorous course on building systematic trading strategies. Every concept follows our four-part pedagogical approach:

1. **Prose/Intuition** — Plain language explanation, historical context, what the concept is
2. **Visual Evidence** — Empirical demonstrations, charts, simulations
3. **Mathematical Derivation** — French-style rigorous derivation from first principles, explicit assumptions
4. **Implementation & Application** — R code from scratch, plus practical trading guidance and limitations

Designed for PhD-level practitioners who want rigorous understanding, not just cookbook recipes. We derive every formula so you understand when assumptions break down.

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
  - [ ] 1.1.1 **Prose/Intuition** — Order flow, price discovery, and information aggregation; exchanges vs OTC markets; the role of market makers.
  - [ ] 1.1.2 **Visual Evidence** — Order book dynamics, bid-ask spread over time, trade and quote data.
  - [ ] 1.1.3 **Mathematical Derivation** — Market clearing conditions; Kyle's lambda (price impact) derivation from first principles.
  - [ ] 1.1.4 **Implementation & Application** — Simulating an order book in R; estimating effective spread from trade data.
- [ ] **1.2 Price Data: OHLCV** — What the numbers actually mean.
  - [ ] 1.2.1 **Prose/Intuition** — Open, high, low, close as summary statistics of price path; volume as a measure of activity.
  - [ ] 1.2.2 **Visual Evidence** — Candlestick charts, bar charts, information loss from aggregation.
  - [ ] 1.2.3 **Mathematical Derivation** — OHLC as sufficient statistics for range-based volatility estimators (Parkinson, Garman-Klass).
  - [ ] 1.2.4 **Implementation & Application** — Loading data with `quantmod`, converting to `data.table`; detecting data quality issues (gaps, splits, survivorship).
- [ ] **1.3 Adjusted Prices** — Why raw prices lie.
  - [ ] 1.3.1 **Prose/Intuition** — Corporate actions (splits, dividends) create artificial discontinuities; the need for adjustment.
  - [ ] 1.3.2 **Visual Evidence** — AAPL before/after adjustment showing splits and dividends.
  - [ ] 1.3.3 **Mathematical Derivation** — Adjustment factor calculation, chain multiplication for multiple events.
  - [ ] 1.3.4 **Implementation & Application** — Building an adjustment function from scratch; when to use adjusted vs unadjusted prices.
- [ ] **Quick Reference** — Data loading recipes, quality checks.

### Part 2 (`01-2`): The Mathematics of Returns

- [ ] **1.4 Simple vs Log Returns** — The fundamental choice.
  - [ ] 1.4.1 **Prose/Intuition** — Two valid ways to measure percentage change; historical context and conventions.
  - [ ] 1.4.2 **Visual Evidence** — Divergence at large returns, distribution comparison.
  - [ ] 1.4.3 **Mathematical Derivation** —
    - Simple return: r_simple = (P_t - P_{t-1})/P_{t-1}.
    - Log return: r_log = ln(P_t/P_{t-1}).
    - Taylor series expansion: ln(1+x) ≈ x for small x.
    - Time additivity proof: r_log(t,T) = Σr_log(t,t+1).
    - Cross-sectional additivity: r_portfolio = Σw_i × r_simple,i (not true for log returns).
  - [ ] 1.4.4 **Implementation & Application** — Return calculation functions; handling NA and zero prices; when to use which (backtesting vs portfolio construction).
- [ ] **1.5 Multi-Period Compounding** — From daily to annual.
  - [ ] 1.5.1 **Prose/Intuition** — Geometric growth of wealth; why arithmetic averages mislead.
  - [ ] 1.5.2 **Visual Evidence** — $1 growing at different rates: arithmetic vs geometric average comparison.
  - [ ] 1.5.3 **Mathematical Derivation** —
    - Wealth equation: W_T = W_0 × exp(Σr_log) = W_0 × Π(1 + r_simple).
    - CAGR derivation from terminal wealth.
    - Annualisation under i.i.d. assumption: σ_annual = σ_daily × √252 (derivation from variance of sums).
    - Continuous compounding limit.
  - [ ] 1.5.4 **Implementation & Application** — Annualisation functions; rolling return calculations; reporting returns correctly.
- [ ] **1.6 Excess Returns and Risk-Free Rates** — What you're actually earning.
  - [ ] 1.6.1 **Prose/Intuition** — Separating compensation for time vs risk; what the risk-free rate represents.
  - [ ] 1.6.2 **Visual Evidence** — Excess returns over T-bills, time-varying risk premia through decades.
  - [ ] 1.6.3 **Mathematical Derivation** — Excess return: r_excess = r_asset - r_f; continuous vs discrete subtraction; compounding considerations.
  - [ ] 1.6.4 **Implementation & Application** — Merging with risk-free rate data; handling frequency mismatch; using Fama-French data correctly.
- [ ] **Quick Reference** — Return formulae, annualisation factors.

### Part 3 (`01-3`): Stylised Facts of Financial Returns

- [ ] **1.7 Fat Tails** — Why normal distributions fail.
  - [ ] 1.7.1 **Prose/Intuition** — Information arrives in bursts; herding amplifies moves; extreme events occur more often than Gaussian models predict.
  - [ ] 1.7.2 **Visual Evidence** — S&P 500 returns vs normal: QQ plots, tail probability comparison, histogram overlay.
  - [ ] 1.7.3 **Mathematical Derivation** —
    - Kurtosis: κ = E[(X-μ)⁴]/σ⁴; excess kurtosis = κ - 3.
    - For normal distribution: κ = 3 (derivation from moment generating function).
    - Empirical: S&P 500 daily κ ≈ 25.
    - Tail probability comparison: P(|Z| > 4) under normal vs empirical.
  - [ ] 1.7.4 **Implementation & Application** — Computing kurtosis; comparing to theoretical distributions; implications for VaR and position sizing.
- [ ] **1.8 Volatility Clustering** — Calm and storm periods.
  - [ ] 1.8.1 **Prose/Intuition** — Information cascades; uncertainty propagation; volatility as a persistent state variable.
  - [ ] 1.8.2 **Visual Evidence** — |r_t| time series showing clusters; autocorrelation of squared returns.
  - [ ] 1.8.3 **Mathematical Derivation** —
    - Autocorrelation function: ρ(k) = Cov(X_t, X_{t-k})/Var(X).
    - For returns: ρ(k) ≈ 0 (no linear predictability).
    - For squared returns: ρ(k) > 0 with slow decay (volatility is predictable).
  - [ ] 1.8.4 **Implementation & Application** — ACF plots for returns vs absolute returns vs squared returns; implications for volatility forecasting and regime detection.
- [ ] **1.9 Leverage Effect** — Bad news hits harder.
  - [ ] 1.9.1 **Prose/Intuition** — Falling prices increase firm leverage, amplifying volatility; asymmetric response to news.
  - [ ] 1.9.2 **Visual Evidence** — Asymmetric volatility response to positive vs negative returns; scatter plot of r_t vs σ²_{t+1}.
  - [ ] 1.9.3 **Mathematical Derivation** — Correlation(r_t, σ²_{t+1}) < 0; News Impact Curve derivation; connection to option skew.
  - [ ] 1.9.4 **Implementation & Application** — Measuring leverage effect; asymmetric hedging strategies; put skew explanation.
- [ ] **1.10 Absence of Autocorrelation** — Returns are (nearly) unpredictable.
  - [ ] 1.10.1 **Prose/Intuition** — Efficient markets arbitrage away predictability; what "efficiency" means statistically.
  - [ ] 1.10.2 **Visual Evidence** — ACF of returns: insignificant at most lags; comparison across asset classes.
  - [ ] 1.10.3 **Mathematical Derivation** —
    - Sample autocorrelation: ρ̂(k) = Σ(r_t - r̄)(r_{t-k} - r̄) / Σ(r_t - r̄)².
    - Ljung-Box test: Q = n(n+2)Σρ̂²(k)/(n-k) ~ χ²_K under null of no autocorrelation.
  - [ ] 1.10.4 **Implementation & Application** — Testing for autocorrelation in R; interpreting results; what "weak" predictability means for alpha generation.
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
  - [ ] 2.1.1 **Prose/Intuition** — Sample mean as estimator of population mean; the fundamental difficulty of predicting returns.
  - [ ] 2.1.2 **Visual Evidence** — Rolling mean returns showing instability; estimation uncertainty bands.
  - [ ] 2.1.3 **Mathematical Derivation** —
    - Sample mean: μ̂ = (1/T)Σr_t.
    - Standard error derivation: SE(μ̂) = σ/√T.
    - Confidence interval: 95% CI width for annual return with 10 years of data ≈ ±6%.
  - [ ] 2.1.4 **Implementation & Application** — Bootstrap confidence intervals; why mean estimation is the hardest problem in finance.
- [ ] **2.2 Trade-Level Statistics** — Win rate, average win/loss.
  - [ ] 2.2.1 **Prose/Intuition** — Alternative to return-based analysis for discrete strategies; thinking in terms of bets.
  - [ ] 2.2.2 **Visual Evidence** — Trade P&L distribution, win/loss ratio charts.
  - [ ] 2.2.3 **Mathematical Derivation** —
    - Expectancy: E[trade] = (Win% × Avg Win) - (Loss% × Avg Loss).
    - Relationship to Sharpe: approximate conversion formulae.
  - [ ] 2.2.4 **Implementation & Application** — Trade extraction from position series; using trade stats for strategy diagnosis.
- [ ] **Quick Reference** — Return metrics formulae.

### Part 2 (`02-2`): Measuring Risk

- [ ] **2.3 Volatility** — The standard measure of risk.
  - [ ] 2.3.1 **Prose/Intuition** — Standard deviation captures dispersion around mean; historical context and why it became the standard.
  - [ ] 2.3.2 **Visual Evidence** — High vs low volatility return series, volatility time series.
  - [ ] 2.3.3 **Mathematical Derivation** —
    - Sample variance: σ̂² = (1/(T-1))Σ(r_t - r̄)².
    - Bessel's correction derivation: why T-1? Proof that E[s²] = σ² only with correction.
    - Annualisation derivation: σ_annual = σ_daily × √252 from variance of sums under independence.
  - [ ] 2.3.4 **Implementation & Application** — Rolling volatility, EWMA volatility; volatility targeting for position sizing.
- [ ] **2.4 Downside Risk Measures** — Risk you actually care about.
  - [ ] 2.4.1 **Prose/Intuition** — Upside "risk" is actually good; investors have asymmetric preferences.
  - [ ] 2.4.2 **Visual Evidence** — Return distributions with same σ but different downside profiles.
  - [ ] 2.4.3 **Mathematical Derivation** —
    - Semi-deviation: σ_down = √[E[(min(r-τ, 0))²]].
    - Lower partial moments: LPM_n(τ) = E[(max(τ-r, 0))^n].
    - Connection to utility theory.
  - [ ] 2.4.4 **Implementation & Application** — Downside deviation, LPM in R; comparing strategies with asymmetric returns.
- [ ] **2.5 Drawdown** — The pain you'll actually experience.
  - [ ] 2.5.1 **Prose/Intuition** — Psychological and practical impact of losses from peak; why investors abandon strategies.
  - [ ] 2.5.2 **Visual Evidence** — Drawdown chart, underwater curve, drawdown duration histogram.
  - [ ] 2.5.3 **Mathematical Derivation** —
    - High-water mark: HWM_t = max_{s≤t}(W_s).
    - Drawdown: DD_t = (HWM_t - W_t)/HWM_t.
    - Maximum drawdown: MDD = max_t(DD_t).
    - Expected MDD under random walk (analytical approximation).
  - [ ] 2.5.4 **Implementation & Application** — Drawdown functions from scratch; setting drawdown limits; investor expectations.
- [ ] **2.6 Value-at-Risk (VaR)** — Quantile-based risk measure.
  - [ ] 2.6.1 **Prose/Intuition** — "What's the worst that can happen (95% of the time)?"; regulatory context.
  - [ ] 2.6.2 **Visual Evidence** — VaR on return distribution, exceedances over time.
  - [ ] 2.6.3 **Mathematical Derivation** —
    - Definition: VaR_α = -F^{-1}(α) where F is return CDF.
    - Historical method: empirical quantile.
    - Parametric (normal): VaR = -μ + σ × z_α, derivation from normal CDF.
    - Delta-normal for portfolios.
  - [ ] 2.6.4 **Implementation & Application** — All three VaR methods; backtesting VaR; limitations (not subadditive, ignores tail shape).
- [ ] **2.7 Expected Shortfall (CVaR)** — Average loss in the tail.
  - [ ] 2.7.1 **Prose/Intuition** — "When things go wrong, how bad on average?"; why regulators prefer it.
  - [ ] 2.7.2 **Visual Evidence** — CVaR vs VaR on distribution, tail averaging visualised.
  - [ ] 2.7.3 **Mathematical Derivation** —
    - Definition: ES_α = E[r | r < VaR_α] = (1/α)∫_{-∞}^{VaR} r×f(r)dr.
    - Coherent risk measure properties: subadditivity proof ES(A+B) ≤ ES(A) + ES(B).
    - Closed form under normality.
  - [ ] 2.7.4 **Implementation & Application** — Historical and parametric ES calculation; regulatory applications.
- [ ] **Quick Reference** — Risk metrics formulae, comparison table.

### Part 3 (`02-3`): Risk-Adjusted Performance

- [ ] **2.8 Sharpe Ratio** — The industry standard.
  - [ ] 2.8.1 **Prose/Intuition** — Return per unit of risk; comparable across strategies; historical context (William Sharpe).
  - [ ] 2.8.2 **Visual Evidence** — Iso-Sharpe lines in mean-variance space; Sharpe distribution under null hypothesis.
  - [ ] 2.8.3 **Mathematical Derivation** —
    - Definition: SR = (μ - r_f)/σ.
    - Annualisation derivation: SR_annual = SR_daily × √252 (from scaling properties).
    - Standard error (Lo's formula): SE(SR) ≈ √[(1 + SR²/2)/T], full derivation.
    - Asymptotic distribution: SR ~ N(SR_true, SE).
  - [ ] 2.8.4 **Implementation & Application** — Sharpe calculation with confidence intervals; benchmarks (1.0 = good, 2.0 = excellent).
- [ ] **2.9 Sortino and Calmar Ratios** — Downside-focused alternatives.
  - [ ] 2.9.1 **Prose/Intuition** — Penalise downside volatility, not upside; when symmetric measures mislead.
  - [ ] 2.9.2 **Visual Evidence** — Comparing strategies with same Sharpe but different Sortino.
  - [ ] 2.9.3 **Mathematical Derivation** —
    - Sortino: (μ - r_f)/σ_downside.
    - Calmar: CAGR/MDD.
    - Relationship between measures.
  - [ ] 2.9.4 **Implementation & Application** — Calculation from scratch; when to prefer Sortino/Calmar over Sharpe.
- [ ] **2.10 Information Ratio and Tracking Error** — Active management metrics.
  - [ ] 2.10.1 **Prose/Intuition** — Measuring skill relative to a benchmark; institutional context.
  - [ ] 2.10.2 **Visual Evidence** — Active returns distribution, tracking error over time.
  - [ ] 2.10.3 **Mathematical Derivation** —
    - Tracking error: TE = σ(r_p - r_b).
    - Information ratio: IR = E[r_p - r_b]/TE.
    - Relationship to Sharpe of active returns.
  - [ ] 2.10.4 **Implementation & Application** — IR calculation; benchmark alignment; IR targets for institutional managers.
- [ ] **2.11 Alpha and Beta** — Decomposing returns.
  - [ ] 2.11.1 **Prose/Intuition** — Separating market exposure from skill; CAPM context.
  - [ ] 2.11.2 **Visual Evidence** — Scatter plot of returns vs benchmark, regression line, residuals.
  - [ ] 2.11.3 **Mathematical Derivation** —
    - Market model: r_p = α + β × r_m + ε.
    - OLS derivation: β = Cov(r_p, r_m)/Var(r_m).
    - Alpha: α = E[r_p] - β × E[r_m].
    - Standard errors and hypothesis testing.
  - [ ] 2.11.4 **Implementation & Application** — Rolling alpha/beta estimation; significance testing; detecting hidden beta exposures.
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
  - [ ] 3.1.1 **Prose/Intuition** — Systematic simulation of historical trading; what a backtest actually does.
  - [ ] 3.1.2 **Visual Evidence** — Flowchart: data → signals → positions → returns → metrics.
  - [ ] 3.1.3 **Mathematical Derivation** —
    - P&L equation: P&L_t = position_{t-1} × return_t - costs_t.
    - Cumulative return from daily returns.
  - [ ] 3.1.4 **Implementation & Application** — Minimal vectorised backtester in R (~50 lines); when to use vectorised vs event-driven.
- [ ] **3.2 Signal Generation** — From data to trading signals.
  - [ ] 3.2.1 **Prose/Intuition** — Signals encode beliefs about future returns; the core of any strategy.
  - [ ] 3.2.2 **Visual Evidence** — Signal time series, signal-return scatter plots.
  - [ ] 3.2.3 **Mathematical Derivation** —
    - Signal as function: s_t = f(Ω_t) where Ω_t is the information set at time t.
    - Point-in-time constraint: s_t depends only on data available at t (no look-ahead).
  - [ ] 3.2.4 **Implementation & Application** — Signal generation with proper lagging; normalisation and z-scoring.
- [ ] **3.3 Position Mapping** — From signals to positions.
  - [ ] 3.3.1 **Prose/Intuition** — Converting predictions to tradeable positions; the link between signal and portfolio.
  - [ ] 3.3.2 **Visual Evidence** — Different mapping functions: linear, threshold, rank-based.
  - [ ] 3.3.3 **Mathematical Derivation** —
    - Position sizing: w_t = g(s_t) subject to constraints.
    - Long-only constraint: w_t ≥ 0.
    - Dollar neutral: Σw_t = 0.
  - [ ] 3.3.4 **Implementation & Application** — Position mapping functions; constraint handling; capacity considerations.
- [ ] **Quick Reference** — Backtest architecture checklist.

### Part 2 (`03-2`): Transaction Costs

- [ ] **3.4 Bid-Ask Spread** — The immediate cost of trading.
  - [ ] 3.4.1 **Prose/Intuition** — Market makers charge for immediacy; the most visible trading cost.
  - [ ] 3.4.2 **Visual Evidence** — Spread over time, intraday patterns, spread by market cap.
  - [ ] 3.4.3 **Mathematical Derivation** —
    - Half-spread cost: c = spread/(2 × mid).
    - Round-trip cost: 2c.
    - Effective spread estimation from trade data.
  - [ ] 3.4.4 **Implementation & Application** — Incorporating spread in backtest; spread estimates by asset class.
- [ ] **3.5 Market Impact** — Moving the price against yourself.
  - [ ] 3.5.1 **Prose/Intuition** — Large orders signal information, move prices; the invisible cost.
  - [ ] 3.5.2 **Visual Evidence** — Price impact curves, temporary vs permanent impact separation.
  - [ ] 3.5.3 **Mathematical Derivation** —
    - Square-root law: impact = σ × √(Q/ADV), derivation from microstructure theory.
    - Almgren-Chriss framework: optimal execution derivation.
    - Temporary vs permanent impact decomposition.
  - [ ] 3.5.4 **Implementation & Application** — Market impact models; capacity limits from impact analysis.
- [ ] **3.6 Slippage and Execution** — The difference between plan and reality.
  - [ ] 3.6.1 **Prose/Intuition** — Prices move between signal and execution; execution quality matters.
  - [ ] 3.6.2 **Visual Evidence** — Implementation shortfall decomposition chart.
  - [ ] 3.6.3 **Mathematical Derivation** —
    - Implementation shortfall: IS = (paper return) - (actual return).
    - Decomposition: IS = delay + spread + impact + timing + opportunity.
  - [ ] 3.6.4 **Implementation & Application** — Slippage models; conservative cost assumptions for realistic backtests.
- [ ] **3.7 Borrowing Costs** — The hidden cost of shorting.
  - [ ] 3.7.1 **Prose/Intuition** — Shorting requires borrowing shares; costs vary dramatically.
  - [ ] 3.7.2 **Visual Evidence** — Short interest vs borrow cost; hard-to-borrow list examples.
  - [ ] 3.7.3 **Mathematical Derivation** —
    - Annualised borrow cost calculation.
    - Rebate rate mechanics.
  - [ ] 3.7.4 **Implementation & Application** — Incorporating borrow costs for short positions; when shorting destroys alpha.
- [ ] **Quick Reference** — Transaction cost estimates by asset class.

### Part 3 (`03-3`): Building a Complete Backtester

- [ ] **3.8 Event-Driven Backtesting** — For complex strategies.
  - [ ] 3.8.1 **Prose/Intuition** — Some strategies can't be vectorised; path-dependent execution.
  - [ ] 3.8.2 **Visual Evidence** — Event queue diagram, state machine for strategy logic.
  - [ ] 3.8.3 **Mathematical Derivation** —
    - Discrete event simulation formalisation.
    - State transition functions.
  - [ ] 3.8.4 **Implementation & Application** — R6-based event-driven backtester; when to use event-driven vs vectorised.
- [ ] **3.9 Portfolio-Level Backtesting** — Multiple assets, rebalancing.
  - [ ] 3.9.1 **Prose/Intuition** — Real strategies trade portfolios, not single assets; rebalancing mechanics.
  - [ ] 3.9.2 **Visual Evidence** — Portfolio weights over time, turnover charts.
  - [ ] 3.9.3 **Mathematical Derivation** —
    - Portfolio return: r_p = Σw_i × r_i.
    - Weight drift and rebalancing: w_{t+1} = w_t × (1 + r_t) / Σw_t × (1 + r_t).
    - Turnover calculation.
  - [ ] 3.9.4 **Implementation & Application** — Multi-asset backtester with rebalancing; frequency trade-offs.
- [ ] **3.10 Monte Carlo Validation** — Statistical significance of results.
  - [ ] 3.10.1 **Prose/Intuition** — One equity curve tells you almost nothing; quantifying luck vs skill.
  - [ ] 3.10.2 **Visual Evidence** — Confidence bands around equity curve, distribution of outcomes.
  - [ ] 3.10.3 **Mathematical Derivation** —
    - Permutation test: null hypothesis that strategy has no edge.
    - Bootstrap resampling for confidence intervals.
    - p-value calculation from shuffled signals.
  - [ ] 3.10.4 **Implementation & Application** — Monte Carlo significance testing; minimum 10,000 simulations; interpreting results.
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
  - [ ] 4.1.1 **Prose/Intuition** — The most common and deadly bias; using information you wouldn't have had.
  - [ ] 4.1.2 **Visual Evidence** — Before/after fixing look-ahead: dramatic performance difference.
  - [ ] 4.1.3 **Mathematical Derivation** —
    - Information set formalisation: Ω_t = {data available at time t}.
    - Point-in-time requirement: signal s_t ∈ σ(Ω_t).
  - [ ] 4.1.4 **Implementation & Application** — Detecting look-ahead with lag analysis; common sources (point-in-time data, index composition changes).
- [ ] **4.2 Survivorship Bias** — Only winners remain.
  - [ ] 4.2.1 **Prose/Intuition** — Databases drop delisted stocks; you only see the survivors.
  - [ ] 4.2.2 **Visual Evidence** — S&P 500 returns with vs without dead companies.
  - [ ] 4.2.3 **Mathematical Derivation** —
    - Selection bias formalisation.
    - Expected magnitude estimation (~1-2% annual inflation).
  - [ ] 4.2.4 **Implementation & Application** — Survivorship-free databases; point-in-time index constituents; why "buy index components" backtests are inflated.
- [ ] **4.3 Overfitting** — Fitting noise, not signal.
  - [ ] 4.3.1 **Prose/Intuition** — More parameters means better in-sample fit but worse out-of-sample performance.
  - [ ] 4.3.2 **Visual Evidence** — In-sample vs out-of-sample Sharpe as function of model complexity.
  - [ ] 4.3.3 **Mathematical Derivation** —
    - Bias-variance trade-off derivation.
    - Effective degrees of freedom.
    - Bailey et al. deflated Sharpe ratio: adjusting for number of trials.
  - [ ] 4.3.4 **Implementation & Application** — Measuring overfitting; complexity penalties; rule of thumb (max parameters ≈ √T).
- [ ] **4.4 Selection Bias and Data Mining** — Cherry-picking winners.
  - [ ] 4.4.1 **Prose/Intuition** — Test 1000 strategies, some will "work" by chance; publication bias.
  - [ ] 4.4.2 **Visual Evidence** — Multiple testing: expected best result under null hypothesis.
  - [ ] 4.4.3 **Mathematical Derivation** —
    - Multiple hypothesis correction: Bonferroni, Holm, Benjamini-Hochberg (FDR).
    - Harvey et al. result: t-statistic threshold of 3.0 for new factors.
  - [ ] 4.4.4 **Implementation & Application** — Tracking all tests; deflating for multiplicity; keeping a research log of all tested ideas.
- [ ] **Quick Reference** — Bias detection checklist.

### Part 2 (`04-2`): Validation Methods

- [ ] **4.5 Train/Test Split** — The simplest validation.
  - [ ] 4.5.1 **Prose/Intuition** — Reserve data you never touch until final test; the holdout principle.
  - [ ] 4.5.2 **Visual Evidence** — Split timeline, in-sample vs out-of-sample performance comparison.
  - [ ] 4.5.3 **Mathematical Derivation** —
    - Statistical power trade-off: train size vs test reliability.
    - Optimal split ratio derivation.
  - [ ] 4.5.4 **Implementation & Application** — Proper splitting with embargo periods; 70/30 as starting point.
- [ ] **4.6 Walk-Forward Optimisation** — Rolling out-of-sample.
  - [ ] 4.6.1 **Prose/Intuition** — Multiple out-of-sample tests; allows parameter adaptation over time.
  - [ ] 4.6.2 **Visual Evidence** — Rolling windows diagram, anchored vs sliding windows.
  - [ ] 4.6.3 **Mathematical Derivation** —
    - Expanding window vs rolling window bias-variance trade-off.
    - Optimal window length considerations.
  - [ ] 4.6.4 **Implementation & Application** — Walk-forward framework in R; optimal retraining frequency.
- [ ] **4.7 Cross-Validation for Time Series** — Respecting temporal structure.
  - [ ] 4.7.1 **Prose/Intuition** — Standard k-fold CV violates time ordering; future leaks into past.
  - [ ] 4.7.2 **Visual Evidence** — Blocked CV, purged CV diagrams.
  - [ ] 4.7.3 **Mathematical Derivation** —
    - Purging requirement: removing overlap to prevent leakage.
    - Embargo period calculation based on autocorrelation decay.
  - [ ] 4.7.4 **Implementation & Application** — Time-series CV in R; choosing appropriate gap lengths.
- [ ] **4.8 Combinatorial Purged Cross-Validation** — The gold standard.
  - [ ] 4.8.1 **Prose/Intuition** — Multiple independent test paths through the data; de Prado's method.
  - [ ] 4.8.2 **Visual Evidence** — CPCV path generation diagram, coverage illustration.
  - [ ] 4.8.3 **Mathematical Derivation** —
    - CPCV framework: number of paths = C(N, N-k).
    - Probability of false strategy derivation.
  - [ ] 4.8.4 **Implementation & Application** — CPCV in R; when the computational cost is justified.
- [ ] **Quick Reference** — Validation method comparison table.

### Part 3 (`04-3`): Interpreting Backtest Results

- [ ] **4.9 Statistical Significance** — Is your Sharpe real?
  - [ ] 4.9.1 **Prose/Intuition** — Distinguishing skill from luck; the null hypothesis of no edge.
  - [ ] 4.9.2 **Visual Evidence** — Sharpe ratio distribution under null, confidence intervals visualised.
  - [ ] 4.9.3 **Mathematical Derivation** —
    - t-test for Sharpe: t = SR × √T.
    - Required track record length for given power.
    - Sample size calculation for detecting true SR.
  - [ ] 4.9.4 **Implementation & Application** — Significance tests; Sharpe confidence intervals; why 3 years is rarely enough.
- [ ] **4.10 Regime Analysis** — Does it work everywhere?
  - [ ] 4.10.1 **Prose/Intuition** — Strategies may only work in certain market conditions; conditional performance.
  - [ ] 4.10.2 **Visual Evidence** — Performance by regime: bull/bear, high/low volatility, expansion/recession.
  - [ ] 4.10.3 **Mathematical Derivation** —
    - Conditional expectation: E[r | regime = k].
    - Testing for regime dependence.
  - [ ] 4.10.4 **Implementation & Application** — Regime classification methods; conditional analysis; regime-dependent position sizing.
- [ ] **4.11 Stability Analysis** — How sensitive to parameters?
  - [ ] 4.11.1 **Prose/Intuition** — Robust strategies work across parameter ranges; fragile strategies don't.
  - [ ] 4.11.2 **Visual Evidence** — Parameter sensitivity heatmaps, cliff edges vs plateaus.
  - [ ] 4.11.3 **Mathematical Derivation** —
    - Stability metrics: local vs global sensitivity.
    - Parameter neighbourhood analysis.
  - [ ] 4.11.4 **Implementation & Application** — Parameter sweep visualisation; choosing robust over optimal parameters.
- [ ] **4.12 Decay Analysis** — Has the edge eroded?
  - [ ] 4.12.1 **Prose/Intuition** — Alpha decays as strategies become crowded; edges get arbitraged away.
  - [ ] 4.12.2 **Visual Evidence** — Rolling Sharpe over time, structural break points.
  - [ ] 4.12.3 **Mathematical Derivation** —
    - Chow test for structural breaks.
    - CUSUM and CUSUMSQ tests.
    - Bai-Perron multiple breakpoint detection.
  - [ ] 4.12.4 **Implementation & Application** — Decay detection; rolling performance metrics; when to retire a strategy.
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
  - [ ] 5.1.1 **Prose/Intuition** — Maximises long-term geometric growth rate; the gambler's ruin problem.
  - [ ] 5.1.2 **Visual Evidence** — Growth curves for different bet fractions; long-term wealth paths.
  - [ ] 5.1.3 **Mathematical Derivation** —
    - Discrete Kelly: f* = (p × b - q) / b = edge / odds.
    - Continuous Kelly: f* = μ/σ² (derivation from log utility maximisation).
    - Connection to E[log(W)] maximisation.
  - [ ] 5.1.4 **Implementation & Application** — Kelly calculation from win rate and payoff ratio; why full Kelly is too aggressive in practice.
- [ ] **5.2 Fractional Kelly** — Trading off growth for survival.
  - [ ] 5.2.1 **Prose/Intuition** — Full Kelly has brutal drawdowns; practical considerations.
  - [ ] 5.2.2 **Visual Evidence** — Growth rate vs drawdown for different Kelly fractions.
  - [ ] 5.2.3 **Mathematical Derivation** —
    - Half-Kelly growth penalty: (0.5)² × 0.5 = 75% of full Kelly growth.
    - Drawdown distribution under fractional Kelly.
    - Probability of ruin calculations.
  - [ ] 5.2.4 **Implementation & Application** — Fractional Kelly sizing; quarter-Kelly as practical default.
- [ ] **5.3 Multi-Asset Kelly** — Portfolio-level optimal sizing.
  - [ ] 5.3.1 **Prose/Intuition** — Correlations matter for aggregate risk; portfolio context.
  - [ ] 5.3.2 **Visual Evidence** — Optimal weights vs naive equal weight comparison.
  - [ ] 5.3.3 **Mathematical Derivation** —
    - Multi-asset Kelly: f* = Σ^{-1} × μ.
    - Matrix formulation derivation.
    - Constraint handling (no short-selling, leverage limits).
  - [ ] 5.3.4 **Implementation & Application** — Multi-asset Kelly optimisation; when covariance estimation fails.
- [ ] **Quick Reference** — Kelly formulae summary.

### Part 2 (`05-2`): Volatility-Based Sizing

- [ ] **5.4 Volatility Targeting** — Consistent risk exposure.
  - [ ] 5.4.1 **Prose/Intuition** — Keep risk constant despite changing volatility; managed futures approach.
  - [ ] 5.4.2 **Visual Evidence** — Raw returns vs vol-targeted returns; Sharpe improvement.
  - [ ] 5.4.3 **Mathematical Derivation** —
    - Position sizing: w_t = σ_target / σ̂_t.
    - Inverse volatility weighting derivation.
    - Impact on return distribution.
  - [ ] 5.4.4 **Implementation & Application** — Volatility targeting with rolling estimates; choosing target volatility (10-15% typical).
- [ ] **5.5 ATR-Based Position Sizing** — Range-normalised exposure.
  - [ ] 5.5.1 **Prose/Intuition** — ATR captures realistic daily price movement; Turtle trading origins.
  - [ ] 5.5.2 **Visual Evidence** — ATR over time, position size variation.
  - [ ] 5.5.3 **Mathematical Derivation** —
    - True Range: TR = max(H-L, |H-C_{t-1}|, |L-C_{t-1}|).
    - ATR = EMA(TR) or SMA(TR).
    - Position size = (risk budget) / (ATR × point value).
  - [ ] 5.5.4 **Implementation & Application** — ATR calculation; Turtle trading position sizing rules.
- [ ] **5.6 Risk Parity** — Equal risk contribution.
  - [ ] 5.6.1 **Prose/Intuition** — All assets contribute equally to portfolio risk; Bridgewater's approach.
  - [ ] 5.6.2 **Visual Evidence** — Risk contributions before/after parity adjustment.
  - [ ] 5.6.3 **Mathematical Derivation** —
    - Marginal risk contribution: MRC_i = (Σw)_i / σ_p.
    - Total risk contribution: TRC_i = w_i × MRC_i.
    - Equal TRC condition and iterative solution.
  - [ ] 5.6.4 **Implementation & Application** — Risk parity optimisation in R; application across asset classes.
- [ ] **Quick Reference** — Volatility-based sizing formulae.

### Part 3 (`05-3`): Risk Management and Stops

- [ ] **5.7 Stop-Loss Orders** — Limiting downside.
  - [ ] 5.7.1 **Prose/Intuition** — Cutting losses before they compound; behavioural benefits.
  - [ ] 5.7.2 **Visual Evidence** — Stop-loss impact on return distribution; truncated left tail.
  - [ ] 5.7.3 **Mathematical Derivation** —
    - Stop-loss as option: P&L = max(r, -stop).
    - Expected cost of stop (getting stopped out then price reverses).
    - Optimal stop placement (Kaminski framework).
  - [ ] 5.7.4 **Implementation & Application** — Stop-loss in backtesting; when stops help vs hurt.
- [ ] **5.8 Position Limits and Leverage Constraints** — Staying alive.
  - [ ] 5.8.1 **Prose/Intuition** — Preventing catastrophic concentration; institutional requirements.
  - [ ] 5.8.2 **Visual Evidence** — Leverage vs blow-up probability; LTCM example.
  - [ ] 5.8.3 **Mathematical Derivation** —
    - Gross leverage: Σ|w_i|.
    - Net exposure: Σw_i.
    - Concentration metrics (Herfindahl).
  - [ ] 5.8.4 **Implementation & Application** — Constraint checking; typical institutional limits.
- [ ] **5.9 Drawdown Control** — Managing the pain.
  - [ ] 5.9.1 **Prose/Intuition** — Investors can't tolerate unlimited drawdowns; psychological limits.
  - [ ] 5.9.2 **Visual Evidence** — Drawdown-triggered deleveraging; strategy behaviour.
  - [ ] 5.9.3 **Mathematical Derivation** —
    - CPPI: Exposure = m × (W - Floor).
    - Drawdown-based position reduction: w_t = w_0 × (1 - DD_t/DD_max).
  - [ ] 5.9.4 **Implementation & Application** — Dynamic position sizing based on drawdown; setting max drawdown limits.
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
  - [ ] 6.1.1 **Prose/Intuition** — Smoothing noise to reveal trend; the oldest technical tool.
  - [ ] 6.1.2 **Visual Evidence** — SMA, EMA, WMA on price series; lag comparison.
  - [ ] 6.1.3 **Mathematical Derivation** —
    - SMA: (1/n)Σp_i.
    - EMA: recursive form and closed-form derivation.
    - Lag analysis: SMA lag = (n-1)/2; EMA effective lag.
    - Frequency response: low-pass filter interpretation.
  - [ ] 6.1.4 **Implementation & Application** — MA functions from scratch; crossover strategies; performance by market regime.
- [ ] **6.2 MACD** — Momentum from moving averages.
  - [ ] 6.2.1 **Prose/Intuition** — Captures trend acceleration/deceleration; widely used momentum indicator.
  - [ ] 6.2.2 **Visual Evidence** — MACD line, signal line, histogram interpretation.
  - [ ] 6.2.3 **Mathematical Derivation** —
    - MACD = EMA_12 - EMA_26.
    - Signal line = EMA_9(MACD).
    - Histogram = MACD - Signal.
    - MACD as approximate derivative of price.
  - [ ] 6.2.4 **Implementation & Application** — MACD calculation; divergence detection; combining with other indicators.
- [ ] **6.3 ADX and DMI** — Trend strength measurement.
  - [ ] 6.3.1 **Prose/Intuition** — Separating trending from ranging markets; when to apply trend-following.
  - [ ] 6.3.2 **Visual Evidence** — ADX with price action, regime identification.
  - [ ] 6.3.3 **Mathematical Derivation** —
    - Directional movement: +DM, -DM definitions.
    - +DI, -DI normalisation.
    - ADX = smoothed(|+DI - -DI|/(+DI + -DI)) × 100.
  - [ ] 6.3.4 **Implementation & Application** — ADX calculation from scratch; using ADX to filter trend-following signals.
- [ ] **Quick Reference** — Trend indicator formulae.

### Part 2 (`06-2`): Momentum and Oscillators

- [ ] **6.4 RSI** — Relative strength measurement.
  - [ ] 6.4.1 **Prose/Intuition** — Measures buying vs selling pressure; overbought/oversold identification.
  - [ ] 6.4.2 **Visual Evidence** — RSI with traditional levels (30/70), divergences.
  - [ ] 6.4.3 **Mathematical Derivation** —
    - Relative Strength: RS = avg_gain / avg_loss.
    - RSI = 100 - 100/(1 + RS).
    - Statistical properties: bounded [0, 100].
  - [ ] 6.4.4 **Implementation & Application** — RSI calculation; parameter optimisation; combining with MACD for higher accuracy.
- [ ] **6.5 Stochastic Oscillator** — Price position in range.
  - [ ] 6.5.1 **Prose/Intuition** — Where price sits relative to recent range; mean-reversion indicator.
  - [ ] 6.5.2 **Visual Evidence** — %K, %D lines, crossovers, divergences.
  - [ ] 6.5.3 **Mathematical Derivation** —
    - %K = (C - L_n)/(H_n - L_n) × 100.
    - %D = SMA(%K, 3).
    - Fast vs slow stochastic.
  - [ ] 6.5.4 **Implementation & Application** — Stochastic calculation; signal generation; better in ranging markets.
- [ ] **6.6 Bollinger Bands** — Volatility-adjusted channels.
  - [ ] 6.6.1 **Prose/Intuition** — Dynamic support/resistance from volatility; John Bollinger's framework.
  - [ ] 6.6.2 **Visual Evidence** — Band width expansion/contraction cycles.
  - [ ] 6.6.3 **Mathematical Derivation** —
    - Upper = SMA + k×σ, Lower = SMA - k×σ (typically k=2).
    - %B = (price - lower)/(upper - lower).
    - Bandwidth = (upper - lower)/middle.
  - [ ] 6.6.4 **Implementation & Application** — Bollinger Bands calculation; squeeze detection for breakout prediction.
- [ ] **6.7 Combining Indicators** — Multi-signal confirmation.
  - [ ] 6.7.1 **Prose/Intuition** — Reducing false signals through consensus; diversification of signal sources.
  - [ ] 6.7.2 **Visual Evidence** — Confirmation rates: single vs combined indicators.
  - [ ] 6.7.3 **Mathematical Derivation** —
    - Signal combination methods: voting, weighted averaging.
    - Optimal combination weights via regression.
    - Information coefficient aggregation.
  - [ ] 6.7.4 **Implementation & Application** — Multi-indicator signal generation; MACD + RSI + volume systems.
- [ ] **Quick Reference** — Oscillator formulae, combination rules.

### Part 3 (`06-3`): Volume and Volatility Indicators

- [ ] **6.8 Volume Analysis** — Confirming price moves.
  - [ ] 6.8.1 **Prose/Intuition** — Volume validates conviction; "volume precedes price."
  - [ ] 6.8.2 **Visual Evidence** — Price-volume relationship, divergences.
  - [ ] 6.8.3 **Mathematical Derivation** —
    - On-Balance Volume: OBV = cumsum(sign(Δp) × volume).
    - Volume-Weighted Average Price: VWAP = Σ(price × volume) / Σvolume.
    - Money Flow Index derivation.
  - [ ] 6.8.4 **Implementation & Application** — OBV, VWAP calculation; volume confirmation filters.
- [ ] **6.9 ATR and Volatility Indicators** — Measuring market nervousness.
  - [ ] 6.9.1 **Prose/Intuition** — Volatility often precedes direction; useful for stop placement and sizing.
  - [ ] 6.9.2 **Visual Evidence** — ATR expansion before breakouts.
  - [ ] 6.9.3 **Mathematical Derivation** —
    - True Range: TR = max(H-L, |H-C_{t-1}|, |L-C_{t-1}|).
    - ATR = smoothed(TR) via EMA or SMA.
    - Normalised ATR for cross-asset comparison.
  - [ ] 6.9.4 **Implementation & Application** — ATR calculation; volatility breakout signals; ATR-based stop placement.
- [ ] **6.10 Indicator Optimisation** — Finding robust parameters.
  - [ ] 6.10.1 **Prose/Intuition** — Default parameters are arbitrary; finding what works for your market.
  - [ ] 6.10.2 **Visual Evidence** — Parameter sensitivity surfaces, cliff edges vs plateaus.
  - [ ] 6.10.3 **Mathematical Derivation** —
    - Grid search complexity.
    - Genetic algorithm optimisation.
    - Bayesian optimisation with Gaussian processes.
    - Overfitting risk vs parameter count.
  - [ ] 6.10.4 **Implementation & Application** — Walk-forward parameter optimisation; robust selection using median over top performers.
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
  - [ ] 7.1.1 **Prose/Intuition** — Behavioural explanations: underreaction, herding, confirmation bias; risk-based explanations.
  - [ ] 7.1.2 **Visual Evidence** — 12-month momentum portfolios, crisis performance, decade-by-decade returns.
  - [ ] 7.1.3 **Mathematical Derivation** —
    - TSMOM signal: sign(r_{t-12:t}) or scaled by volatility.
    - Moskowitz, Ooi, Pedersen (2012) framework derivation.
    - Expected return under momentum.
  - [ ] 7.1.4 **Implementation & Application** — Time-series momentum strategy; 12-1 momentum across asset classes.
- [ ] **7.2 Moving Average Crossovers** — Classic trend signals.
  - [ ] 7.2.1 **Prose/Intuition** — Fast MA crossing slow MA indicates trend change; historical context.
  - [ ] 7.2.2 **Visual Evidence** — Golden cross, death cross, whipsaw examples.
  - [ ] 7.2.3 **Mathematical Derivation** —
    - Signal = sign(MA_fast - MA_slow).
    - Position smoothing mathematics.
    - Optimal lookback derivation (Levine and Pedersen 2016).
  - [ ] 7.2.4 **Implementation & Application** — MA crossover strategy; parameter selection; 50/200 crossover on equity indices.
- [ ] **7.3 Position Sizing for Trend Following** — Volatility-scaling returns.
  - [ ] 7.3.1 **Prose/Intuition** — Trend strength varies, position should scale accordingly.
  - [ ] 7.3.2 **Visual Evidence** — Raw vs vol-scaled trend following comparison.
  - [ ] 7.3.3 **Mathematical Derivation** —
    - Position = signal × target_vol / asset_vol.
    - Impact on Sharpe ratio derivation.
  - [ ] 7.3.4 **Implementation & Application** — Volatility-scaled positions; typical 40% vol target for diversified trend.
- [ ] **Quick Reference** — Time-series momentum formulae.

### Part 2 (`07-2`): Breakout Strategies

- [ ] **7.4 Donchian Channel Breakouts** — Turtle trading foundation.
  - [ ] 7.4.1 **Prose/Intuition** — New highs/lows signal trend initiation; Richard Dennis and the Turtles.
  - [ ] 7.4.2 **Visual Evidence** — Channel breakouts, entries and exits visualised.
  - [ ] 7.4.3 **Mathematical Derivation** —
    - Upper = max(H_{t-n:t-1}), Lower = min(L_{t-n:t-1}).
    - Entry/exit rule formalisation.
  - [ ] 7.4.4 **Implementation & Application** — Donchian channel strategy; original Turtle 20/10 system.
- [ ] **7.5 Volatility Breakouts** — Trading range expansion.
  - [ ] 7.5.1 **Prose/Intuition** — Low volatility precedes directional moves; Bollinger squeeze concept.
  - [ ] 7.5.2 **Visual Evidence** — ATR squeeze then expansion examples.
  - [ ] 7.5.3 **Mathematical Derivation** —
    - Breakout condition: price > close_{t-1} ± k × ATR.
    - Statistical properties of breakout signals.
  - [ ] 7.5.4 **Implementation & Application** — Volatility breakout strategy; opening range breakouts.
- [ ] **7.6 Trend Filters** — Avoiding whipsaws.
  - [ ] 7.6.1 **Prose/Intuition** — Not all breakouts lead to trends; filtering improves signal quality.
  - [ ] 7.6.2 **Visual Evidence** — Filtered vs unfiltered breakout performance comparison.
  - [ ] 7.6.3 **Mathematical Derivation** —
    - ADX filter threshold derivation.
    - MA filter formalisation.
    - Regime classification methods.
  - [ ] 7.6.4 **Implementation & Application** — Multi-filter trend confirmation; when to trade breakouts.
- [ ] **Quick Reference** — Breakout system rules.

### Part 3 (`07-3`): Multi-Asset Trend Following

- [ ] **7.7 Managed Futures** — Diversified trend following.
  - [ ] 7.7.1 **Prose/Intuition** — Trends exist across all asset classes; CTA industry context.
  - [ ] 7.7.2 **Visual Evidence** — CTA performance, crisis alpha, diversification benefit.
  - [ ] 7.7.3 **Mathematical Derivation** —
    - Portfolio construction: many assets × trend signal × vol scaling.
    - Correlation structure analysis.
    - Diversification benefit derivation.
  - [ ] 7.7.4 **Implementation & Application** — Multi-asset trend following system; asset class selection; rebalancing.
- [ ] **7.8 Trend Following in Different Regimes** — When it works and fails.
  - [ ] 7.8.1 **Prose/Intuition** — Trend following struggles in choppy reversals; regime dependence.
  - [ ] 7.8.2 **Visual Evidence** — Performance by regime, drawdowns during reversals.
  - [ ] 7.8.3 **Mathematical Derivation** —
    - Regime detection methods (HMM, threshold).
    - Conditional performance estimation.
  - [ ] 7.8.4 **Implementation & Application** — Regime-conditional trend following; blending with other strategies.
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
  - [ ] 8.1.1 **Prose/Intuition** — Overreaction, liquidity provision, inventory effects; mean reversion vs random walk.
  - [ ] 8.1.2 **Visual Evidence** — Ornstein-Uhlenbeck process simulation vs random walk.
  - [ ] 8.1.3 **Mathematical Derivation** —
    - OU process: dp = θ(μ - p)dt + σdW.
    - Solution and stationary distribution.
    - Half-life derivation: t_{1/2} = ln(2)/θ.
    - Variance ratio test for mean reversion.
  - [ ] 8.1.4 **Implementation & Application** — OU parameter estimation via regression; half-life calculation; identifying mean-reverting series.
- [ ] **8.2 RSI and Bollinger Band Strategies** — Classic mean reversion.
  - [ ] 8.2.1 **Prose/Intuition** — Extreme readings predict reversals; contrarian logic.
  - [ ] 8.2.2 **Visual Evidence** — Entry/exit points on oscillators and bands.
  - [ ] 8.2.3 **Mathematical Derivation** —
    - Z-score: z = (p - μ)/σ.
    - Threshold entry derivation from OU model.
    - Expected profit per trade.
  - [ ] 8.2.4 **Implementation & Application** — Bollinger Band mean reversion strategy; works in ranging markets, fails in trends.
- [ ] **8.3 Short-Term Reversals** — Intraday mean reversion.
  - [ ] 8.3.1 **Prose/Intuition** — Microstructure effects, inventory rebalancing by market makers.
  - [ ] 8.3.2 **Visual Evidence** — Intraday return autocorrelation patterns.
  - [ ] 8.3.3 **Mathematical Derivation** —
    - Return reversal model: r_t = α + β × r_{t-1} + ε, β < 0.
    - Testing for reversal significance.
  - [ ] 8.3.4 **Implementation & Application** — Short-term reversal strategy; high-frequency considerations.
- [ ] **Quick Reference** — Mean reversion tests and thresholds.

### Part 2 (`08-2`): Pairs Trading

- [ ] **8.4 Pairs Selection** — Finding related assets.
  - [ ] 8.4.1 **Prose/Intuition** — Economic relationships create co-movement; fundamental vs statistical pairs.
  - [ ] 8.4.2 **Visual Evidence** — Price series of pairs, spread time series.
  - [ ] 8.4.3 **Mathematical Derivation** —
    - Correlation vs cointegration distinction.
    - Distance method: SSD of normalised prices.
    - Minimum distance derivation.
  - [ ] 8.4.4 **Implementation & Application** — Pairs screening; sector-based selection; distance calculation.
- [ ] **8.5 Cointegration** — The proper statistical foundation.
  - [ ] 8.5.1 **Prose/Intuition** — Cointegration implies mean-reverting spread; Engle-Granger framework.
  - [ ] 8.5.2 **Visual Evidence** — Cointegrated vs merely correlated pairs comparison.
  - [ ] 8.5.3 **Mathematical Derivation** —
    - Engle-Granger two-step: y_t = α + βx_t + ε_t, test ε_t ~ I(0).
    - ADF test derivation and critical values.
    - Johansen test for multiple series.
    - Hedge ratio estimation (OLS vs TLS).
  - [ ] 8.5.4 **Implementation & Application** — Cointegration testing in R; hedge ratio estimation; empirical performance.
- [ ] **8.6 Trading the Spread** — Entry, exit, and sizing.
  - [ ] 8.6.1 **Prose/Intuition** — Long cheap, short expensive when spread widens; market-neutral construction.
  - [ ] 8.6.2 **Visual Evidence** — Spread z-score, entry/exit signals visualised.
  - [ ] 8.6.3 **Mathematical Derivation** —
    - Spread = y - β × x, z = (spread - μ)/σ.
    - Optimal threshold derivation from OU model.
    - Expected holding time and profit.
  - [ ] 8.6.4 **Implementation & Application** — Pairs trading strategy with dynamic hedge ratio; rebalancing frequency; transaction cost impact.
- [ ] **Quick Reference** — Pairs trading checklist.

### Part 3 (`08-3`): Statistical Arbitrage

- [ ] **8.7 Portfolio-Based Stat Arb** — Beyond pairs to baskets.
  - [ ] 8.7.1 **Prose/Intuition** — More assets means more diversification; reducing idiosyncratic risk.
  - [ ] 8.7.2 **Visual Evidence** — Basket spread, principal components visualised.
  - [ ] 8.7.3 **Mathematical Derivation** —
    - PCA: eigenvector decomposition of return covariance.
    - Eigenportfolio construction.
    - Mean-reverting combinations identification.
  - [ ] 8.7.4 **Implementation & Application** — PCA-based statistical arbitrage; trading different eigenportfolios.
- [ ] **8.8 ETF Arbitrage** — Trading index vs components.
  - [ ] 8.8.1 **Prose/Intuition** — ETF price should equal NAV; arbitrage mechanism.
  - [ ] 8.8.2 **Visual Evidence** — ETF premium/discount over time.
  - [ ] 8.8.3 **Mathematical Derivation** —
    - NAV calculation.
    - Creation/redemption mechanism.
    - Arbitrage bounds derivation.
  - [ ] 8.8.4 **Implementation & Application** — ETF arbitrage strategy; trading SPY vs basket.
- [ ] **8.9 Risk Management for Stat Arb** — When pairs diverge.
  - [ ] 8.9.1 **Prose/Intuition** — Pairs can permanently diverge; regime changes break relationships.
  - [ ] 8.9.2 **Visual Evidence** — Spread blow-ups, structural break examples.
  - [ ] 8.9.3 **Mathematical Derivation** —
    - Stop-loss rules formalisation.
    - Spread half-life monitoring.
    - Dynamic cointegration testing (rolling windows).
  - [ ] 8.9.4 **Implementation & Application** — Pair break detection; stop-loss implementation; when to abandon a pair.
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
  - [ ] 9.1.1 **Prose/Intuition** — Factors as persistent return patterns; Fama-French history; risk-based vs behavioural explanations (neither proven definitive).
  - [ ] 9.1.2 **Visual Evidence** — Factor cumulative returns (HML, SMB, UMD), Fama-French factor time series.
  - [ ] 9.1.3 **Mathematical Derivation** —
    - Factor model: r_i = α + Σβ_{ik}f_k + ε_i.
    - Pricing factors vs characteristic factors distinction.
    - Factor premium estimation: E[f_k] from time series.
    - Alpha as risk-adjusted return: α = r̄ - Σβ_{ik}f̄_k.
  - [ ] 9.1.4 **Implementation & Application** — Loading Fama-French data; computing factor exposures; factor exposure as active investment choice vs passive acceptance.
- [ ] **9.2 Value Factor** — Buying cheap, selling expensive.
  - [ ] 9.2.1 **Prose/Intuition** — Graham and Dodd origins; rationale candidates include distress risk and investor overreaction; factor has experienced long droughts.
  - [ ] 9.2.2 **Visual Evidence** — HML cumulative returns, value spreads over time, value's "decade of death" (2010s).
  - [ ] 9.2.3 **Mathematical Derivation** —
    - Book-to-market ratio: B/M = Book Equity / Market Cap.
    - Earnings yield: E/P = EPS / Price.
    - Composite value: combine multiple metrics.
    - Portfolio construction: long top decile (cheap), short bottom decile (expensive).
  - [ ] 9.2.4 **Implementation & Application** — Value factor construction from scratch; value works differently across markets (stronger in some emerging markets, weaker in recent US data).
- [ ] **9.3 Momentum Factor** — Winners keep winning, losers keep losing.
  - [ ] 9.3.1 **Prose/Intuition** — Jegadeesh-Titman discovery; proposed mechanisms include underreaction, herding, slow information diffusion; subject to crashes.
  - [ ] 9.3.2 **Visual Evidence** — UMD cumulative returns, momentum crashes (2009), crash frequency.
  - [ ] 9.3.3 **Mathematical Derivation** —
    - 12-1 month return: r_{i,mom} = Π(1+r_{i,t}) - 1 for t ∈ [t-12, t-2].
    - Skip most recent month (short-term reversal).
    - Cross-sectional ranking: rank stocks by past return.
    - Long winners (top decile), short losers (bottom decile).
  - [ ] 9.3.4 **Implementation & Application** — Momentum factor construction; momentum behaviour varies by market (weaker in some emerging markets, crash-prone after market rebounds).
- [ ] **9.4 Size, Quality, and Low Volatility** — Other established factors.
  - [ ] 9.4.1 **Prose/Intuition** — Size effect (small caps); quality (profitable, stable companies); low volatility anomaly (contradicts CAPM); varying explanations and performance across time.
  - [ ] 9.4.2 **Visual Evidence** — SMB, QMJ, BAB cumulative returns; factor correlations.
  - [ ] 9.4.3 **Mathematical Derivation** —
    - Size: SMB = Small minus Big market cap portfolios.
    - Quality metrics: ROE, earnings stability, low leverage.
    - BAB (betting against beta): long low-beta, short high-beta, levered to market beta of 1.
  - [ ] 9.4.4 **Implementation & Application** — Multi-factor construction; quality tends to outperform during downturns but relationship isn't guaranteed.
- [ ] **Quick Reference** — Factor definitions, data sources.

### Part 2 (`09-2`): Factor Portfolio Construction

- [ ] **9.5 Sorting and Ranking** — From characteristics to portfolios.
  - [ ] 9.5.1 **Prose/Intuition** — Non-parametric approach to signal extraction; avoids model specification; Fama-French methodology.
  - [ ] 9.5.2 **Visual Evidence** — Decile portfolios, monotonic returns (when they occur), non-monotonic patterns.
  - [ ] 9.5.3 **Mathematical Derivation** —
    - Cross-sectional ranking: rank_i = rank(signal_i) / N.
    - Quantile breakpoints: q_k = F^{-1}(k/K).
    - Univariate sorts: single characteristic.
    - Bivariate sorts: independent or dependent (2x3, 5x5 grids).
  - [ ] 9.5.4 **Implementation & Application** — Sorting functions in R; long-short portfolio construction; quintiles vs deciles trade-offs (granularity vs diversification).
- [ ] **9.6 Factor Weighting Schemes** — Equal, value, risk-weighted.
  - [ ] 9.6.1 **Prose/Intuition** — How you weight positions affects factor exposure, risk, and capacity.
  - [ ] 9.6.2 **Visual Evidence** — Equal vs value-weighted factor returns comparison.
  - [ ] 9.6.3 **Mathematical Derivation** —
    - Equal weight: w_i = 1/N.
    - Value weight: w_i = MCap_i / ΣMCap.
    - Signal weight (z-score): w_i = z_i / Σ|z_i|.
    - Capacity constraint: w_i ≤ c × ADV_i.
  - [ ] 9.6.4 **Implementation & Application** — Different weighting schemes in R; signal-weighted for stronger exposure but lower capacity.
- [ ] **9.7 Multi-Factor Portfolios** — Combining factors.
  - [ ] 9.7.1 **Prose/Intuition** — Diversification across factors; factors have varying correlations over time.
  - [ ] 9.7.2 **Visual Evidence** — Single vs multi-factor performance, factor correlation matrix.
  - [ ] 9.7.3 **Mathematical Derivation** —
    - Composite score: S_i = Σw_k × rank(signal_{ik}).
    - Factor orthogonalisation: regress out other factors.
    - Naive combination vs optimised weights.
    - Multi-factor alpha: α_MF = r - Σβ_k f_k.
  - [ ] 9.7.4 **Implementation & Application** — Multi-factor portfolio construction; value + momentum + quality combination (noting that optimal combination varies by market and period).
- [ ] **Quick Reference** — Factor construction guidelines.

### Part 3 (`09-3`): Factor Implementation

- [ ] **9.8 Rebalancing and Turnover** — Practical trading considerations.
  - [ ] 9.8.1 **Prose/Intuition** — Factors change slowly; frequent rebalancing generates costs; trade-off between signal freshness and transaction costs.
  - [ ] 9.8.2 **Visual Evidence** — Turnover by rebalancing frequency, cost-adjusted returns.
  - [ ] 9.8.3 **Mathematical Derivation** —
    - Turnover: TO = Σ|w_i,t - w_i,t-1| / 2.
    - Cost-adjusted return: r_net = r_gross - c × TO.
    - Optimal rebalancing frequency: balance signal decay vs costs.
  - [ ] 9.8.4 **Implementation & Application** — Rebalancing with turnover constraints; monthly vs quarterly rebalancing trade-offs.
- [ ] **9.9 Factor Timing** — When to increase/decrease exposure.
  - [ ] 9.9.1 **Prose/Intuition** — Factor premia vary over time; timing is difficult and evidence for its success is mixed.
  - [ ] 9.9.2 **Visual Evidence** — Factor spreads over time, factor returns by regime.
  - [ ] 9.9.3 **Mathematical Derivation** —
    - Valuation spread as timing signal: spread_t = characteristic spread.
    - Macro conditions: recession indicators, volatility regimes.
    - Momentum timing signal: avoid after market crashes (crash indicator).
  - [ ] 9.9.4 **Implementation & Application** — Factor timing signals in R; caution that timing adds complexity and may not improve risk-adjusted returns.
- [ ] **9.10 Factor Crowding** — When everyone uses the same strategy.
  - [ ] 9.10.1 **Prose/Intuition** — Popular factors attract capital; crowding can compress future returns and increase crash risk.
  - [ ] 9.10.2 **Visual Evidence** — Factor crowding measures, AUM growth in factor funds, performance decay examples.
  - [ ] 9.10.3 **Mathematical Derivation** —
    - Crowding proxies: short interest concentration, valuation spread compression.
    - Pairwise correlation of factor portfolio stocks.
    - Flow-based measures: ETF flows into factor funds.
  - [ ] 9.10.4 **Implementation & Application** — Crowding indicator construction; monitoring factor popularity; implications for expected returns (crowded factors may underperform).
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
  - [ ] 10.1.1 **Prose/Intuition** — Different estimators extract different information from price data; trade-offs between simplicity, efficiency, and data requirements.
  - [ ] 10.1.2 **Visual Evidence** — Close-to-close vs range-based volatility, estimator comparison on same data.
  - [ ] 10.1.3 **Mathematical Derivation** —
    - Close-to-close: σ² = (1/n) Σ(r_t - r̄)², where r_t = ln(C_t/C_{t-1}).
    - Parkinson (1980): σ² = (1/4ln2) × (1/n) Σ(ln(H_t/L_t))².
    - Garman-Klass: σ² = 0.5(ln(H/L))² - (2ln2-1)(ln(C/O))².
    - Yang-Zhang: combines overnight and intraday components.
    - Efficiency comparison: Parkinson ~5x more efficient than close-to-close.
  - [ ] 10.1.4 **Implementation & Application** — Volatility estimators from scratch; choosing estimator based on data availability (OHLC vs close-only) and desired properties.
- [ ] **10.2 GARCH Models** — Conditional volatility modelling.
  - [ ] 10.2.1 **Prose/Intuition** — Engle (1982) and Bollerslev (1986); volatility clusters — large moves follow large moves; conditional variance differs from unconditional.
  - [ ] 10.2.2 **Visual Evidence** — GARCH fitted volatility vs squared returns, volatility clustering visualisation.
  - [ ] 10.2.3 **Mathematical Derivation** —
    - ARCH(1): σ²_t = ω + α×ε²_{t-1}.
    - GARCH(1,1): σ²_t = ω + α×ε²_{t-1} + β×σ²_{t-1}.
    - Unconditional variance: σ² = ω/(1-α-β), requires α+β < 1.
    - Persistence: α + β measures shock decay rate.
    - Log-likelihood: L = -0.5 Σ[ln(σ²_t) + ε²_t/σ²_t].
  - [ ] 10.2.4 **Implementation & Application** — GARCH estimation using `rugarch`; multi-step forecasting; limitations in crisis periods.
- [ ] **10.3 EGARCH and GJR-GARCH** — Asymmetric volatility.
  - [ ] 10.3.1 **Prose/Intuition** — Leverage effect: negative returns tend to increase volatility more than positive returns of same magnitude; Black (1976) observation.
  - [ ] 10.3.2 **Visual Evidence** — News impact curves showing asymmetry, negative vs positive shock comparison.
  - [ ] 10.3.3 **Mathematical Derivation** —
    - EGARCH (Nelson 1991): log(σ²_t) = ω + α×[|z_{t-1}| - E|z|] + γ×z_{t-1} + β×log(σ²_{t-1}).
    - GJR-GARCH (Glosten et al. 1993): σ²_t = ω + (α + γ×I_{ε<0})×ε²_{t-1} + β×σ²_{t-1}.
    - Leverage parameter γ: typically negative in EGARCH, positive in GJR.
    - News impact curve: plot σ²_t vs ε_{t-1}.
  - [ ] 10.3.4 **Implementation & Application** — Asymmetric GARCH models in R; comparing model fit; better downside risk forecasting but added complexity.
- [ ] **Quick Reference** — Volatility model comparison.

### Part 2 (`10-2`): Volatility Forecasting

- [ ] **10.4 Realised Volatility** — High-frequency measurement.
  - [ ] 10.4.1 **Prose/Intuition** — Higher-frequency data provides more precise volatility measurement; theory of quadratic variation; microstructure complications.
  - [ ] 10.4.2 **Visual Evidence** — Realised volatility vs GARCH forecasts, sampling frequency effects.
  - [ ] 10.4.3 **Mathematical Derivation** —
    - Quadratic variation: [r,r]_T = plim Σr²_{i,t} as Δt → 0.
    - Realised variance: RV_t = Σr²_{i,t} for intraday returns.
    - Microstructure noise: E[RV] = IV + 2n×E[ε²] where ε is noise.
    - Optimal sampling: balance noise vs discretisation.
    - Realised kernels: RK = Σw_h × Σr_{t-h}r_t (noise-robust).
  - [ ] 10.4.4 **Implementation & Application** — Realised volatility calculation; 5-minute vs tick sampling trade-offs; data requirements.
- [ ] **10.5 Implied Volatility** — Market expectations.
  - [ ] 10.5.1 **Prose/Intuition** — Option prices embed market's volatility forecast; IV is forward-looking unlike historical measures; variance risk premium concept.
  - [ ] 10.5.2 **Visual Evidence** — VIX vs subsequent realised volatility, IV typically exceeds RV.
  - [ ] 10.5.3 **Mathematical Derivation** —
    - Black-Scholes: C = S×N(d₁) - K×e^{-rT}×N(d₂).
    - Implied volatility: σ_IV such that BS(σ_IV) = C_market.
    - Newton-Raphson iteration: σ_{n+1} = σ_n - (BS(σ_n) - C)/vega.
    - VIX calculation: σ²_VIX = (2/T) Σ(ΔK_i/K²_i)×e^{rT}×Q(K_i).
    - Variance risk premium: VRP = E[IV²] - E[RV²].
  - [ ] 10.5.4 **Implementation & Application** — IV extraction from option prices; VIX replication; IV as forecast (often biased but informative).
- [ ] **10.6 HAR Models** — Heterogeneous autoregressive volatility.
  - [ ] 10.6.1 **Prose/Intuition** — Corsi (2009); different market participants operate at different horizons (daily, weekly, monthly); captures long memory in volatility.
  - [ ] 10.6.2 **Visual Evidence** — HAR forecasts vs realised, multi-horizon forecast comparison.
  - [ ] 10.6.3 **Mathematical Derivation** —
    - HAR-RV: RV_t^{(d)} = α + β_d×RV_{t-1}^{(d)} + β_w×RV_{t-1}^{(w)} + β_m×RV_{t-1}^{(m)} + ε_t.
    - RV^{(w)} = (1/5)Σ_{i=1}^{5} RV_{t-i} (weekly average).
    - RV^{(m)} = (1/22)Σ_{i=1}^{22} RV_{t-i} (monthly average).
    - Extensions: HAR-J (jumps), HAR-CJ (continuous + jump components).
  - [ ] 10.6.4 **Implementation & Application** — HAR model estimation; multi-horizon forecasting; simple yet competitive with complex models.
- [ ] **Quick Reference** — Volatility forecasting methods comparison.

### Part 3 (`10-3`): Volatility Trading Strategies

- [ ] **10.7 Variance Risk Premium** — Selling volatility insurance.
  - [ ] 10.7.1 **Prose/Intuition** — Investors pay premium for downside protection; VRP has historically been positive on average but with significant tail risk; analogous to insurance premium.
  - [ ] 10.7.2 **Visual Evidence** — VRP over time, strategy cumulative returns, drawdowns.
  - [ ] 10.7.3 **Mathematical Derivation** —
    - VRP definition: VRP_t = IV²_t - E_t[RV²_{t+τ}].
    - Empirical proxy: VRP_t ≈ VIX²_t - RV²_{t-22} (using lagged RV).
    - Variance swap payoff: (RV² - K²) × notional.
    - Straddle approximation: profit ≈ vega × (σ_realised - σ_implied).
  - [ ] 10.7.4 **Implementation & Application** — VRP strategy construction; the strategy earns steady premium but suffers severe drawdowns in crises (2008, 2020).
- [ ] **10.8 VIX Trading** — Trading the fear index.
  - [ ] 10.8.1 **Prose/Intuition** — VIX tends to mean-revert; futures curve usually in contango (upward sloping); roll yield as source of return (and risk).
  - [ ] 10.8.2 **Visual Evidence** — VIX term structure, contango vs backwardation periods, VIX spike history.
  - [ ] 10.8.3 **Mathematical Derivation** —
    - Roll yield: RY = (F_1 - F_2)/F_2 × (252/days_to_roll).
    - Basis: basis = F_1 - VIX_spot.
    - Contango: F_1 > VIX_spot (normal), backwardation: F_1 < VIX_spot (crisis).
    - Short VIX futures return: r ≈ roll_yield - Δ(VIX_spot).
  - [ ] 10.8.4 **Implementation & Application** — VIX futures strategies; XIV/SVXY example of catastrophic risk (XIV went to zero in Feb 2018); sizing and risk management critical.
- [ ] **10.9 Volatility Arbitrage** — Implied vs realised mismatch.
  - [ ] 10.9.1 **Prose/Intuition** — Trade the spread between implied and expected realised volatility; requires view on future volatility; gamma scalping mechanics.
  - [ ] 10.9.2 **Visual Evidence** — IV/RV ratio over time, strategy signal visualisation.
  - [ ] 10.9.3 **Mathematical Derivation** —
    - Gamma scalping P&L: P&L = 0.5 × Γ × S² × (σ²_realised - σ²_implied) × T.
    - Delta-hedging cost: rebalance Δ to maintain delta-neutrality.
    - Discrete hedging: P&L = Σ[0.5 × Γ_t × (ΔS_t)² - θ_t × Δt].
    - Break-even volatility: σ_BE where E[P&L] = 0.
  - [ ] 10.9.4 **Implementation & Application** — Simple vol arb strategy; transaction costs in hedging matter significantly; requires view on volatility direction.
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
  - [ ] 11.1.1 **Prose/Intuition** — Markowitz (1952) Nobel Prize work; maximise expected return for given risk level; foundation of modern portfolio theory; elegant in theory, problematic in practice.
  - [ ] 11.1.2 **Visual Evidence** — Efficient frontier construction, capital market line, individual assets vs portfolios.
  - [ ] 11.1.3 **Mathematical Derivation** —
    - Problem: min w'Σw s.t. w'μ ≥ r_target, w'1 = 1.
    - Lagrangian: L = w'Σw - λ₁(w'μ - r) - λ₂(w'1 - 1).
    - First-order conditions: 2Σw = λ₁μ + λ₂1.
    - Solution: w* = Σ⁻¹[λ₁μ + λ₂1]/normalisation.
    - Two-fund theorem: all efficient portfolios are combinations of two reference portfolios.
  - [ ] 11.1.4 **Implementation & Application** — MVO in R using quadratic programming; MVO often fails in practice due to estimation error amplification.
- [ ] **11.2 The Estimation Problem** — Garbage in, garbage out.
  - [ ] 11.2.1 **Prose/Intuition** — MVO maximises estimation error; covariance somewhat estimable, expected returns nearly impossible to estimate accurately; small input errors produce extreme weights.
  - [ ] 11.2.2 **Visual Evidence** — Weight instability across estimation windows, extreme positions from MVO.
  - [ ] 11.2.3 **Mathematical Derivation** —
    - Mean estimation error: μ̂ ~ N(μ, σ²/T), need ~500 years for 1% precision.
    - Covariance estimation: Σ̂ ~ Wishart, but condition number matters.
    - Weight sensitivity: ∂w/∂μ = Σ⁻¹ (highly sensitive to μ errors).
    - Michaud's "error maximisation": MVO overweights assets with upward-biased μ̂.
  - [ ] 11.2.4 **Implementation & Application** — Demonstrating MVO instability; why equal weight often outperforms MVO out-of-sample.
- [ ] **11.3 Shrinkage Estimators** — Taming estimation error.
  - [ ] 11.3.1 **Prose/Intuition** — James-Stein insight: biased estimators can have lower MSE; shrink towards structured target; Ledoit-Wolf (2004) application to covariance.
  - [ ] 11.3.2 **Visual Evidence** — Sample vs shrunk covariance matrix, eigenvalue distribution.
  - [ ] 11.3.3 **Mathematical Derivation** —
    - Shrinkage: Σ_shrunk = δ×F + (1-δ)×S, where F is target, S is sample.
    - Common targets: identity matrix (spherical), single-factor model, constant correlation.
    - Optimal intensity: δ* = argmin E[||Σ_shrunk - Σ||²].
    - Ledoit-Wolf formula: δ* derived analytically.
  - [ ] 11.3.4 **Implementation & Application** — Ledoit-Wolf shrinkage in R; improves out-of-sample performance; choosing shrinkage target.
- [ ] **11.4 Black-Litterman** — Combining views with equilibrium.
  - [ ] 11.4.1 **Prose/Intuition** — Black and Litterman (1992) at Goldman Sachs; start from market equilibrium, adjust for investor views; solves MVO's extreme weight problem.
  - [ ] 11.4.2 **Visual Evidence** — Implied equilibrium returns, how views shift weights.
  - [ ] 11.4.3 **Mathematical Derivation** —
    - Equilibrium returns: Π = δΣw_mkt (reverse optimisation).
    - Prior: μ ~ N(Π, τΣ).
    - Views: P×μ = Q + ε, ε ~ N(0, Ω).
    - Posterior: μ_BL = [(τΣ)⁻¹ + P'Ω⁻¹P]⁻¹ × [(τΣ)⁻¹Π + P'Ω⁻¹Q].
    - Τ (tau) typically 0.025-0.05; Ω reflects view confidence.
  - [ ] 11.4.4 **Implementation & Application** — Black-Litterman in R; expressing absolute and relative views; tuning τ and Ω.
- [ ] **Quick Reference** — Portfolio optimisation methods comparison.

### Part 2 (`11-2`): Practical Constraints

- [ ] **11.5 Long-Only and Box Constraints** — Real-world limitations.
  - [ ] 11.5.1 **Prose/Intuition** — Most investors cannot short freely; regulatory and mandate constraints; box constraints limit position sizes.
  - [ ] 11.5.2 **Visual Evidence** — Constrained vs unconstrained efficient frontier.
  - [ ] 11.5.3 **Mathematical Derivation** —
    - Long-only: min w'Σw s.t. w ≥ 0, w'1 = 1.
    - Box constraints: l ≤ w ≤ u.
    - Quadratic programming: standard QP solvers handle linear inequality constraints.
    - Active set method: identify binding constraints at optimum.
  - [ ] 11.5.4 **Implementation & Application** — Constrained optimisation with `quadprog`; typical institutional constraints (max 5% single stock, sector limits).
- [ ] **11.6 Transaction Cost-Aware Optimisation** — Rebalancing costs matter.
  - [ ] 11.6.1 **Prose/Intuition** — Every trade has costs (commissions, spread, impact); optimal portfolio must balance tracking vs trading costs.
  - [ ] 11.6.2 **Visual Evidence** — Cost-adjusted frontier, tracking error vs transaction costs.
  - [ ] 11.6.3 **Mathematical Derivation** —
    - Linear costs: TC = c × Σ|w_i - w_{i,0}|.
    - Quadratic (impact) costs: TC = Σλ_i(w_i - w_{i,0})².
    - Cost-aware problem: min w'Σw + TC(w, w_0).
    - No-trade region: |Δw_i| < threshold implies don't trade.
  - [ ] 11.6.4 **Implementation & Application** — Transaction cost-aware rebalancing; optimal rebalancing bands (Leland, Tse).
- [ ] **11.7 Turnover Constraints** — Limiting trading activity.
  - [ ] 11.7.1 **Prose/Intuition** — High turnover destroys returns after costs; explicit turnover limits force patience; common in institutional mandates.
  - [ ] 11.7.2 **Visual Evidence** — Gross returns vs net returns by turnover level.
  - [ ] 11.7.3 **Mathematical Derivation** —
    - Turnover: TO = (1/2) Σ|w_i - w_{i,0}|.
    - Constraint: TO ≤ T_max.
    - Reformulation as linear constraint with auxiliary variables.
    - Rolling turnover budget: spread trading over multiple periods.
  - [ ] 11.7.4 **Implementation & Application** — Turnover-constrained optimisation; typical targets (200-400% annual for active funds).
- [ ] **Quick Reference** — Constraint handling techniques.

### Part 3 (`11-3`): Portfolio Risk Management

- [ ] **11.8 Risk Decomposition** — Understanding portfolio risk.
  - [ ] 11.8.1 **Prose/Intuition** — Portfolio risk is not sum of individual risks; need to understand which positions contribute most to total risk.
  - [ ] 11.8.2 **Visual Evidence** — Risk contribution pie chart, concentration visualisation.
  - [ ] 11.8.3 **Mathematical Derivation** —
    - Portfolio variance: σ²_p = w'Σw.
    - Marginal risk contribution: MRC_i = ∂σ_p/∂w_i = (Σw)_i / σ_p.
    - Component risk contribution: CRC_i = w_i × MRC_i.
    - Risk budget: ΣCRC_i = σ_p (Euler decomposition).
    - Percent contribution: %RC_i = CRC_i / σ_p.
  - [ ] 11.8.4 **Implementation & Application** — Risk decomposition in R; identifying risk concentrations; risk parity portfolios (equalise risk contributions).
- [ ] **11.9 Factor Risk Decomposition** — Systematic vs idiosyncratic.
  - [ ] 11.9.1 **Prose/Intuition** — Separate diversifiable (idiosyncratic) from non-diversifiable (factor) risk; understand which factors drive portfolio risk.
  - [ ] 11.9.2 **Visual Evidence** — Factor vs residual risk over time, factor exposure heatmap.
  - [ ] 11.9.3 **Mathematical Derivation** —
    - Factor model: r_i = α_i + Σβ_{ik}f_k + ε_i.
    - Covariance structure: Σ = BΣ_fB' + D (factor + idiosyncratic).
    - Portfolio variance: Var(r_p) = β'_pΣ_fβ_p + w'Dw.
    - Factor contribution: %Factor = β'_pΣ_fβ_p / σ²_p.
  - [ ] 11.9.4 **Implementation & Application** — Factor risk decomposition using Fama-French; hedging unwanted factor exposures.
- [ ] **11.10 Stress Testing and Scenario Analysis** — What if?
  - [ ] 11.10.1 **Prose/Intuition** — History doesn't repeat exactly; VaR/CVaR capture normal conditions, not crises; need explicit scenario analysis.
  - [ ] 11.10.2 **Visual Evidence** — Portfolio P&L distribution under scenarios, historical drawdown replay.
  - [ ] 11.10.3 **Mathematical Derivation** —
    - Historical scenario: apply past crisis returns to current portfolio.
    - Hypothetical scenario: specify factor shocks, propagate through factor model.
    - Sensitivity: ∂P&L/∂factor (delta approximation).
    - Full revaluation: recompute portfolio value under stressed parameters.
  - [ ] 11.10.4 **Implementation & Application** — Scenario analysis framework in R; standard scenarios (2008, COVID); stress testing before deployment.
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
  - [ ] 12.1.1 **Prose/Intuition** — System components: data ingestion, signal generation, order management, execution; trade-offs between complexity and reliability; R's role in the stack.
  - [ ] 12.1.2 **Visual Evidence** — System architecture diagrams, component interaction flowcharts.
  - [ ] 12.1.3 **Mathematical Derivation** — Primarily engineering focus; latency calculations; queue theory for order flow.
  - [ ] 12.1.4 **Implementation & Application** — R-based trading system skeleton; component choices depend on strategy frequency (daily signals vs intraday).
- [ ] **12.2 Data Feeds and APIs** — Getting market data.
  - [ ] 12.2.1 **Prose/Intuition** — Timely, accurate data is essential; data quality issues cause real losses; redundancy matters.
  - [ ] 12.2.2 **Visual Evidence** — Data pipeline diagram, data flow from source to signal.
  - [ ] 12.2.3 **Mathematical Derivation** — Data timestamp alignment; handling missing data; forward-fill vs interpolation formalisation.
  - [ ] 12.2.4 **Implementation & Application** — Connecting to data providers (Interactive Brokers, Alpaca); data quality checks; backup sources for resilience.
- [ ] **12.3 Order Management** — From signals to orders.
  - [ ] 12.3.1 **Prose/Intuition** — Systematic execution prevents emotional and mechanical errors; state machine for order lifecycle.
  - [ ] 12.3.2 **Visual Evidence** — Order flow diagram, state transitions.
  - [ ] 12.3.3 **Mathematical Derivation** —
    - Order types: market (immediate execution), limit (price constraint), stop (trigger-based).
    - Expected fill: E[fill_price|market] = mid + spread/2 + impact.
    - Limit order fill probability as function of distance from mid.
  - [ ] 12.3.4 **Implementation & Application** — Order management system in R; handling partial fills, rejections, timeouts.
- [ ] **Quick Reference** — Infrastructure checklist.

### Part 2 (`12-2`): Execution

- [ ] **12.4 Paper Trading** — Testing without risk.
  - [ ] 12.4.1 **Prose/Intuition** — Find bugs before they cost money; paper trading differs from backtest (real timing, real data feeds); still not identical to live.
  - [ ] 12.4.2 **Visual Evidence** — Paper vs live execution comparison, divergence examples.
  - [ ] 12.4.3 **Mathematical Derivation** —
    - Paper P&L: assume fill at mid or last price.
    - Realistic paper: model spread and partial fills.
    - Discrepancy sources: fill timing, price staleness.
  - [ ] 12.4.4 **Implementation & Application** — Paper trading mode with realistic fill assumptions; minimum paper trading period before going live (weeks to months depending on strategy frequency).
- [ ] **12.5 Execution Algorithms** — Reducing market impact.
  - [ ] 12.5.1 **Prose/Intuition** — Large orders move prices against you; smart execution reduces this; trade-off between speed and impact.
  - [ ] 12.5.2 **Visual Evidence** — TWAP vs VWAP execution paths, price trajectory comparison.
  - [ ] 12.5.3 **Mathematical Derivation** —
    - TWAP: split order into n slices, execute at regular intervals. Q_slice = Q_total / n.
    - VWAP: weight slices by expected volume. Q_t = Q_total × V_t / V_total.
    - Implementation shortfall: IS = (execution_price - arrival_price) × quantity.
    - Almgren-Chriss: optimal trade-off between risk and impact.
  - [ ] 12.5.4 **Implementation & Application** — Simple execution algorithms in R; when to use TWAP vs VWAP vs immediate execution.
- [ ] **12.6 Slippage Analysis** — Measuring execution quality.
  - [ ] 12.6.1 **Prose/Intuition** — Backtest assumes idealised execution; real execution has slippage; must measure and feed back to backtest assumptions.
  - [ ] 12.6.2 **Visual Evidence** — Expected vs actual fills, slippage distribution by time of day.
  - [ ] 12.6.3 **Mathematical Derivation** —
    - Slippage: s = fill_price - signal_price.
    - Signed slippage: positive = unfavourable for buys.
    - Implementation shortfall decomposition: delay cost + trading cost + opportunity cost.
    - Average slippage as function of order size: s(Q) = a + b×Q^γ.
  - [ ] 12.6.4 **Implementation & Application** — Slippage tracking and analysis; updating backtest cost assumptions from live data.
- [ ] **Quick Reference** — Execution best practices.

### Part 3 (`12-3`): Monitoring and Maintenance

- [ ] **12.7 Real-Time Monitoring** — Watching the system.
  - [ ] 12.7.1 **Prose/Intuition** — Catch problems before they grow; automated alerts for anomalies; human oversight remains essential.
  - [ ] 12.7.2 **Visual Evidence** — Monitoring dashboard example, alert notification flow.
  - [ ] 12.7.3 **Mathematical Derivation** —
    - Anomaly detection: z-score on P&L, position deviation.
    - CUSUM for regime change detection.
    - P&L attribution: decompose returns by factor and position.
  - [ ] 12.7.4 **Implementation & Application** — Monitoring dashboard with Shiny; what to monitor (P&L, positions, fills, system health); alert thresholds.
- [ ] **12.8 Performance Attribution** — Why did we make/lose money?
  - [ ] 12.8.1 **Prose/Intuition** — Understanding P&L sources is essential for improvement; distinguish skill from luck and factor exposure.
  - [ ] 12.8.2 **Visual Evidence** — Attribution charts, factor contribution over time.
  - [ ] 12.8.3 **Mathematical Derivation** —
    - Brinson attribution: allocation effect + selection effect + interaction.
    - Factor attribution: r_p = α + Σβ_k×f_k + ε.
    - P&L decomposition: P&L = Σposition_i × return_i.
  - [ ] 12.8.4 **Implementation & Application** — Daily performance attribution; identifying when strategy breaks vs temporary drawdown.
- [ ] **12.9 Strategy Lifecycle** — When to scale, modify, or retire.
  - [ ] 12.9.1 **Prose/Intuition** — Strategies have finite life; alpha decays as others discover it; capacity limits constrain growth; knowing when to stop is as important as knowing when to start.
  - [ ] 12.9.2 **Visual Evidence** — Strategy performance decay examples, capacity vs returns curve.
  - [ ] 12.9.3 **Mathematical Derivation** —
    - Structural break tests: Chow test, CUSUM.
    - Cumulative performance monitoring: running Sharpe vs threshold.
    - Capacity estimation: impact = k × (Q / ADV)^γ, solve for max Q.
  - [ ] 12.9.4 **Implementation & Application** — Strategy health monitoring; decision framework for scaling up, modifying, or retiring strategies.
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
  - [ ] 13.1.1 **Prose/Intuition** — ML is statistical function approximation; the "learning" is parameter estimation; rebranding of regression/classification for flexible function classes.
  - [ ] 13.1.2 **Visual Evidence** — Linear vs nonlinear decision boundaries, function approximation comparison.
  - [ ] 13.1.3 **Mathematical Derivation** —
    - Supervised learning: find f* = argmin E[L(y, f(X))].
    - Loss functions: MSE L = (y - f(x))² for regression.
    - Cross-entropy: L = -Σy_k log(p_k) for classification.
    - Empirical risk minimisation: f̂ = argmin (1/n)ΣL(y_i, f(x_i)).
  - [ ] 13.1.4 **Implementation & Application** — Simple ML workflow in R; ML rarely beats linear models for daily/weekly return prediction due to low signal-to-noise.
- [ ] **13.2 Bias-Variance Trade-off** — The fundamental tension.
  - [ ] 13.2.1 **Prose/Intuition** — Model complexity has a cost; simple models underfit (high bias), complex models overfit (high variance); optimal is in between.
  - [ ] 13.2.2 **Visual Evidence** — Training vs test error curves, U-shaped test error.
  - [ ] 13.2.3 **Mathematical Derivation** —
    - Expected test error decomposition: E[(y - f̂(x))²] = Bias²(f̂) + Var(f̂) + σ².
    - Bias: E[f̂(x)] - f(x) (systematic error).
    - Variance: E[(f̂(x) - E[f̂(x)])²] (sensitivity to training data).
    - Irreducible error: σ² = Var(ε).
  - [ ] 13.1.4 **Implementation & Application** — Demonstrating overfitting in financial data; finance has low signal (R² ~ 0.01), so prefer simple models.
- [ ] **13.3 Regularisation** — Constraining complexity.
  - [ ] 13.3.1 **Prose/Intuition** — Add penalty for coefficient magnitude; shrinks estimates toward zero; Bayesian interpretation as priors on coefficients.
  - [ ] 13.3.2 **Visual Evidence** — Coefficient paths as λ increases, Lasso sparsity.
  - [ ] 13.3.3 **Mathematical Derivation** —
    - Ridge (L2): β̂_ridge = argmin Σ(y_i - x'_iβ)² + λΣβ²_j.
    - Closed form: β̂_ridge = (X'X + λI)⁻¹X'y.
    - Lasso (L1): β̂_lasso = argmin Σ(y_i - x'_iβ)² + λΣ|β_j|.
    - Lasso induces sparsity (some β_j = 0 exactly).
    - Elastic net: combines L1 + L2 penalties.
    - Bayesian: Ridge ≈ Gaussian prior, Lasso ≈ Laplace prior.
  - [ ] 13.3.4 **Implementation & Application** — `glmnet` for regularised regression; Lasso for feature selection in high-dimensional factor models.
- [ ] **Quick Reference** — ML foundations summary.

### Part 2 (`13-2`): Supervised Methods

- [ ] **13.4 Tree-Based Methods** — Recursive partitioning.
  - [ ] 13.4.1 **Prose/Intuition** — Partition feature space into regions; assign prediction to each region; non-parametric, handles interactions automatically.
  - [ ] 13.4.2 **Visual Evidence** — Decision tree splits visualised, feature importance bar chart.
  - [ ] 13.4.3 **Mathematical Derivation** —
    - Regression tree: minimise Σ_{regions R_j} Σ_{i∈R_j} (y_i - ȳ_{R_j})².
    - Greedy splitting: for each feature, find best split point.
    - Classification: Gini impurity G = Σp_k(1-p_k), entropy H = -Σp_k log(p_k).
    - Pruning: add complexity penalty α×|T| (number of terminal nodes).
  - [ ] 13.4.4 **Implementation & Application** — `rpart` for trees; trees useful for regime detection but prone to overfitting.
- [ ] **13.5 Random Forests and Gradient Boosting** — Ensemble methods.
  - [ ] 13.5.1 **Prose/Intuition** — Combine many weak learners; RF reduces variance through averaging, boosting reduces bias through sequential fitting.
  - [ ] 13.5.2 **Visual Evidence** — Error reduction with ensemble size, variable importance plots.
  - [ ] 13.5.3 **Mathematical Derivation** —
    - Random Forest: f̂_RF = (1/B)Σf̂_b where each tree on bootstrap sample with m random features.
    - Variance reduction: Var(f̂_RF) = ρσ² + (1-ρ)σ²/B (ρ = tree correlation).
    - Gradient Boosting: f̂_m = f̂_{m-1} + γ_m h_m(x), where h_m fits residuals.
    - Learning rate η: f̂_m = f̂_{m-1} + η×h_m(x), smaller η requires more trees.
  - [ ] 13.5.4 **Implementation & Application** — `randomForest`, `xgboost` in R; feature importance for factor discovery; XGBoost competitive for tabular financial data.
- [ ] **13.6 Neural Networks** — Function approximation machines.
  - [ ] 13.6.1 **Prose/Intuition** — Composition of simple nonlinear functions; universal approximation theorem guarantees can approximate any continuous function; not magic, just flexible.
  - [ ] 13.6.2 **Visual Evidence** — Network architecture diagrams, learned representations/embeddings.
  - [ ] 13.6.3 **Mathematical Derivation** —
    - Single layer: h = σ(Wx + b), where σ is activation function.
    - Deep network: f(x) = σ_L(W_L...σ_1(W_1x + b_1)...+ b_L).
    - Backpropagation: ∂L/∂W_l via chain rule, layer by layer.
    - Gradient descent update: W ← W - η×∂L/∂W.
    - Activations: ReLU(x) = max(0,x), sigmoid(x) = 1/(1+e^{-x}).
  - [ ] 13.6.4 **Implementation & Application** — `keras` in R; deep learning helps with high-frequency data or alternative data (images, text); rarely helps for daily return prediction.
- [ ] **Quick Reference** — Supervised method comparison.

### Part 3 (`13-3`): Practical ML for Trading

- [ ] **13.7 Feature Engineering** — The real skill.
  - [ ] 13.7.1 **Prose/Intuition** — Good features matter more than algorithm choice; domain knowledge beats automated feature generation; garbage in, garbage out.
  - [ ] 13.7.2 **Visual Evidence** — Feature importance rankings, feature correlation heatmap.
  - [ ] 13.7.3 **Mathematical Derivation** —
    - Technical features: returns, volatility, momentum, RSI, MACD.
    - Fundamental features: P/E, P/B, ROE, earnings surprise.
    - Cross-sectional: z-scores, ranks, sector-relative measures.
    - Standardisation: z = (x - μ)/σ or min-max scaling.
    - Missing data: imputation, indicator variables, deletion.
  - [ ] 13.7.4 **Implementation & Application** — Feature engineering pipeline; avoid look-ahead bias in feature construction (use only information available at prediction time).
- [ ] **13.8 Time-Series Cross-Validation** — Proper validation for trading.
  - [ ] 13.8.1 **Prose/Intuition** — Financial data is not iid; standard k-fold leaks future information; need temporal structure in validation.
  - [ ] 13.8.2 **Visual Evidence** — Walk-forward validation diagram, purged k-fold illustration.
  - [ ] 13.8.3 **Mathematical Derivation** —
    - Walk-forward: train on [0,t], validate on [t+1, t+h], roll forward.
    - Purging: remove samples near train/test boundary to prevent leakage.
    - Embargo period: gap between training end and test start.
    - Combinatorial purged CV (de Prado): multiple train/test splits with purging.
  - [ ] 13.8.4 **Implementation & Application** — Time-series CV framework in R; prevents overfitting in ML trading strategies; always compare to simple baseline.
- [ ] **13.9 When ML Doesn't Work** — The reality check.
  - [ ] 13.9.1 **Prose/Intuition** — Signal-to-noise in finance is very low; complex models need more data than available; simple models often win out-of-sample.
  - [ ] 13.9.2 **Visual Evidence** — Simple vs complex model OOS performance, complexity vs performance curve.
  - [ ] 13.9.3 **Mathematical Derivation** —
    - Required sample size: n ∝ d/ε² where d = parameters, ε = desired error.
    - Curse of dimensionality: volume grows exponentially with dimension.
    - Finance: R² ~ 0.01, so need huge n for complex models.
    - Degrees of freedom adjustment for model comparison.
  - [ ] 13.9.4 **Implementation & Application** — Always benchmark ML against simple models (linear regression, equal-weight); default to simple, use ML only when justified by data and domain knowledge.
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
  - [ ] 14.1.1 **Prose/Intuition** — Price discovery through order interaction; the order book is where supply meets demand; price-time priority determines execution order.
  - [ ] 14.1.2 **Visual Evidence** — Order book depth visualisation, bid-ask spread dynamics, order flow heatmaps.
  - [ ] 14.1.3 **Mathematical Derivation** —
    - Order book as queue: bid side B(p) = orders at or above price p, ask side A(p) = orders at or below p.
    - Bid-ask spread: s = p_ask - p_bid.
    - Midprice: m = (p_ask + p_bid)/2.
    - Order imbalance: OI = (V_bid - V_ask)/(V_bid + V_ask).
    - Depth: D_k = Σ_{i=1}^{k} V_i (volume within k levels).
  - [ ] 14.1.4 **Implementation & Application** — Order book simulation from scratch; reading order flow for short-term directional signals.
- [ ] **14.2 Order Types and Execution** — How orders work.
  - [ ] 14.2.1 **Prose/Intuition** — Different orders for different purposes; market orders demand immediacy, limit orders provide liquidity; trade-off between execution certainty and price.
  - [ ] 14.2.2 **Visual Evidence** — Order execution examples, fill rates by order type.
  - [ ] 14.2.3 **Mathematical Derivation** —
    - Market order cost: pays spread + impact = m + s/2 + f(Q).
    - Limit order: earns spread if filled, execution probability P(fill|price, time).
    - Stop order: triggered when price crosses threshold.
    - Iceberg: visible portion V_visible, hidden V_hidden, total V = V_visible + V_hidden.
  - [ ] 14.2.4 **Implementation & Application** — Order type simulation; choosing order types based on urgency and information content.
- [ ] **14.3 Market Making** — Providing liquidity.
  - [ ] 14.3.1 **Prose/Intuition** — Market makers earn spread by providing liquidity; manage inventory risk; adverse selection from informed traders.
  - [ ] 14.3.2 **Visual Evidence** — Market maker P&L over time, inventory evolution, spread earned vs adverse selection cost.
  - [ ] 14.3.3 **Mathematical Derivation** —
    - Avellaneda-Stoikov (2008): optimal quotes around midprice.
    - Bid: p_b = m - δ_b(q, σ, T-t), Ask: p_a = m + δ_a(q, σ, T-t).
    - δ depends on inventory q, volatility σ, time remaining T-t.
    - Reservation price: r = m - q×γ×σ², shifts quotes based on inventory.
  - [ ] 14.3.4 **Implementation & Application** — Simple market making simulation; understanding market maker behaviour helps predict short-term price dynamics.
- [ ] **Quick Reference** — Order book terminology.

### Part 2 (`14-2`): Price Impact and Trading Costs

- [ ] **14.4 Measuring Price Impact** — How orders move prices.
  - [ ] 14.4.1 **Prose/Intuition** — Large orders move prices against the trader; impact reflects information content and liquidity consumption; fundamental constraint on strategy capacity.
  - [ ] 14.4.2 **Visual Evidence** — Price impact curves by order size, temporary vs permanent impact decomposition.
  - [ ] 14.4.3 **Mathematical Derivation** —
    - Total impact: ΔP = temporary + permanent.
    - Square-root law (empirical): impact ∝ σ × √(Q/ADV).
    - Kyle's lambda: ΔP = λ × Q (permanent impact coefficient).
    - Almgren model: g(v) = η×v + γ×v² (temporary), h(v) = ε×v (permanent).
    - Decay: temporary impact decays, permanent persists.
  - [ ] 14.4.4 **Implementation & Application** — Estimating price impact from trade data; impact determines strategy capacity limits.
- [ ] **14.5 Transaction Cost Analysis (TCA)** — Measuring execution quality.
  - [ ] 14.5.1 **Prose/Intuition** — What you measure improves; TCA decomposes costs to identify improvement opportunities; benchmark against VWAP, arrival price.
  - [ ] 14.5.2 **Visual Evidence** — TCA reports, slippage distribution, broker comparison.
  - [ ] 14.5.3 **Mathematical Derivation** —
    - Implementation shortfall: IS = (P_execution - P_decision) × Q.
    - Decomposition: IS = delay cost + trading cost + opportunity cost.
    - Delay cost: (P_arrival - P_decision) × Q.
    - Trading cost: (P_execution - P_arrival) × Q_filled.
    - Opportunity cost: (P_final - P_decision) × Q_unfilled.
  - [ ] 14.5.4 **Implementation & Application** — TCA framework in R; broker evaluation; identifying systematic execution problems.
- [ ] **14.6 Hidden Costs** — What you don't see hurts you.
  - [ ] 14.6.1 **Prose/Intuition** — Many costs invisible in standard analysis; opportunity cost of not trading, information leakage, market timing.
  - [ ] 14.6.2 **Visual Evidence** — Total cost breakdown, visible vs hidden costs.
  - [ ] 14.6.3 **Mathematical Derivation** —
    - Opportunity cost: value of trades not executed.
    - Information leakage: price moves against you before execution complete.
    - Trade-off: faster execution → more impact, slower → more opportunity cost + leakage.
    - Total cost: TC = spread + impact + opportunity + timing + commission.
  - [ ] 14.6.4 **Implementation & Application** — Comprehensive cost analysis; true strategy capacity accounting for all costs.
- [ ] **Quick Reference** — Transaction cost components.

### Part 3 (`14-3`): Optimal Execution

- [ ] **14.7 Execution Algorithms** — Minimising trading costs.
  - [ ] 14.7.1 **Prose/Intuition** — Split large orders to reduce impact; different algorithms for different objectives (track VWAP, minimise cost, participate in volume).
  - [ ] 14.7.2 **Visual Evidence** — TWAP, VWAP, POV execution trajectories.
  - [ ] 14.7.3 **Mathematical Derivation** —
    - TWAP: Q_t = Q_total × t/T (equal time slices).
    - VWAP: Q_t = Q_total × V_t/V_total (weight by expected volume).
    - POV (participation): trade at rate r × market_volume.
    - Expected VWAP slippage: E[P_exec - VWAP] as function of order size.
  - [ ] 14.7.4 **Implementation & Application** — Execution algorithms in R; TWAP for predictable cost, VWAP for benchmark tracking, POV for liquidity-seeking.
- [ ] **14.8 Optimal Execution Theory** — Almgren-Chriss framework.
  - [ ] 14.8.1 **Prose/Intuition** — Trade off expected cost vs execution risk; risk-averse traders front-load execution; elegant closed-form solutions for linear impact.
  - [ ] 14.8.2 **Visual Evidence** — Optimal trajectories for different risk aversion levels.
  - [ ] 14.8.3 **Mathematical Derivation** —
    - Almgren-Chriss objective: min E[cost] + λ×Var(cost).
    - Cost: C = Σ[g(n_k)×S_k + h(n_k)×n_k] where n_k = trade at time k.
    - Linear impact: g(n) = η×n, h(n) = γ×n.
    - Optimal trajectory: x_k = X × sinh(κ(T-k))/sinh(κT).
    - Parameter κ = √(λσ²/η) (urgency parameter).
  - [ ] 14.8.4 **Implementation & Application** — Almgren-Chriss optimal execution in R; calibrating impact parameters from data.
- [ ] **14.9 Adaptive Execution** — Responding to market conditions.
  - [ ] 14.9.1 **Prose/Intuition** — Static algorithms ignore changing conditions; adaptive algorithms respond to volatility, spread, volume; reinforcement learning approaches.
  - [ ] 14.9.2 **Visual Evidence** — Adaptive vs static execution performance comparison.
  - [ ] 14.9.3 **Mathematical Derivation** —
    - State space: s = (inventory remaining, time, volatility, spread, volume).
    - Action space: a = (trade size, limit price).
    - RL objective: maximise E[Σγ^t × r_t] where r_t = -cost_t.
    - Q-learning: Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)].
  - [ ] 14.9.4 **Implementation & Application** — Simple adaptive execution algorithm; adapt execution speed based on market conditions.
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
  - [ ] 15.1.1 **Prose/Intuition** — Non-traditional data sources provide information not yet in prices; alternative data alpha decays faster as adoption increases; competitive advantage from data + processing capability.
  - [ ] 15.1.2 **Visual Evidence** — Alternative data ecosystem map, source categories, adoption timeline.
  - [ ] 15.1.3 **Mathematical Derivation** —
    - Information theory: I(signal) = -log₂P(signal) (entropy reduction).
    - Alpha decay model: α(t) = α₀ × e^{-λt} where λ = adoption rate.
    - Information ratio: IR = IC × √BR (fundamental law of active management).
  - [ ] 15.1.4 **Implementation & Application** — Alternative data pipeline architecture; due diligence checklist (coverage, history, backfill, cost, exclusivity).
- [ ] **15.2 Satellite Imagery Fundamentals** — How it works.
  - [ ] 15.2.1 **Prose/Intuition** — Observe economic activity directly from space; trade-off between resolution, coverage, and revisit frequency.
  - [ ] 15.2.2 **Visual Evidence** — Satellite images: parking lots, shipping lanes, agricultural fields.
  - [ ] 15.2.3 **Mathematical Derivation** —
    - Spatial resolution: GSD (ground sample distance) in meters/pixel.
    - Temporal resolution: revisit frequency (days between observations).
    - Spectral bands: visible (RGB), near-infrared (NIR), thermal.
    - Coverage vs resolution trade-off: swath width × GSD relationship.
  - [ ] 15.2.4 **Implementation & Application** — Accessing satellite data (Planet, Maxar, ESA Sentinel); choosing satellite based on use case requirements.
- [ ] **15.3 Parking Lot Analysis** — Predicting retail earnings.
  - [ ] 15.3.1 **Prose/Intuition** — Cars in parking lots proxy for foot traffic and revenue; visible to satellites; academic evidence (RS Metrics/Berkeley study) suggests predictive value.
  - [ ] 15.3.2 **Visual Evidence** — Walmart/Target parking lot time series, correlation with quarterly revenue.
  - [ ] 15.3.3 **Mathematical Derivation** —
    - Car counting: object detection models (YOLO, Faster R-CNN).
    - Relationship: Revenue_t ≈ β₀ + β₁ × CarCount_t + ε.
    - Aggregation: company-level = Σ(location car counts × location weights).
    - Berkeley study finding: ~4-5% returns around earnings for extreme quintiles.
  - [ ] 15.3.4 **Implementation & Application** — Parking lot analysis pipeline; retail earnings prediction (noting alpha has likely decayed since original studies).
- [ ] **Quick Reference** — Satellite data providers, specifications.

### Part 2 (`15-2`): Computer Vision Methods

- [ ] **15.4 Image Processing Basics** — From pixels to features.
  - [ ] 15.4.1 **Prose/Intuition** — Extract quantitative information from images; preprocessing critical for consistent analysis; classical methods still useful.
  - [ ] 15.4.2 **Visual Evidence** — Raw image → preprocessed → features extracted.
  - [ ] 15.4.3 **Mathematical Derivation** —
    - Image as matrix: I ∈ ℝ^{H×W×C} (height, width, channels).
    - Convolution: (I * K)(i,j) = ΣΣI(i+m, j+n)×K(m,n).
    - Edge detection: Sobel operator G_x, G_y, magnitude |G| = √(G_x² + G_y²).
    - Thresholding: binary mask B(i,j) = 1 if I(i,j) > τ.
  - [ ] 15.4.4 **Implementation & Application** — Image processing with R (`imager`) or Python (`OpenCV`); feature engineering from satellite images.
- [ ] **15.5 Object Detection** — Counting things from space.
  - [ ] 15.5.1 **Prose/Intuition** — Automate counting at scale; deep learning enables accurate detection; transfer learning from pre-trained models reduces data requirements.
  - [ ] 15.5.2 **Visual Evidence** — YOLO/Faster R-CNN detections on satellite imagery, bounding boxes.
  - [ ] 15.5.3 **Mathematical Derivation** —
    - CNN feature extraction: convolutional layers learn spatial features.
    - Bounding box regression: predict (x, y, w, h) for each object.
    - Classification: P(class|region) for each proposed region.
    - Non-max suppression: filter overlapping detections by IoU threshold.
    - Transfer learning: fine-tune pre-trained weights on domain-specific data.
  - [ ] 15.5.4 **Implementation & Application** — Object detection using pre-trained models; car counting, ship tracking, construction monitoring applications.
- [ ] **15.6 Change Detection** — Tracking activity over time.
  - [ ] 15.6.1 **Prose/Intuition** — Change between images indicates economic activity; construction, demolition, agricultural changes all visible from space.
  - [ ] 15.6.2 **Visual Evidence** — Before/after images, change magnitude maps.
  - [ ] 15.6.3 **Mathematical Derivation** —
    - Image differencing: D = |I_t2 - I_t1| after alignment.
    - Change threshold: change if D(i,j) > μ_D + k×σ_D.
    - NDVI for vegetation: NDVI = (NIR - Red)/(NIR + Red), range [-1, 1].
    - Brightness index for built-up areas: function of visible bands.
  - [ ] 15.6.4 **Implementation & Application** — Change detection pipeline; tracking construction progress, crop health changes.
- [ ] **Quick Reference** — Computer vision techniques for satellite imagery.

### Part 3 (`15-3`): Satellite Trading Strategies

- [ ] **15.7 Oil Storage Analysis** — Tracking crude inventory.
  - [ ] 15.7.1 **Prose/Intuition** — Floating roof tanks change height with inventory; shadow length reveals fill level; aggregate across facilities for regional/global inventory estimate.
  - [ ] 15.7.2 **Visual Evidence** — Tank shadow analysis, inventory time series vs official data.
  - [ ] 15.7.3 **Mathematical Derivation** —
    - Tank volume: V = πr²h where h = height of oil.
    - Shadow geometry: h = L_shadow × tan(θ_sun) where θ = sun elevation angle.
    - Aggregation: Total_inventory = Σ(V_i × density_i) across tanks.
    - Signal: ΔInventory_satellite vs ΔInventory_official.
  - [ ] 15.7.4 **Implementation & Application** — Oil storage estimation pipeline; crude oil trading signals (noting commercial providers already offer this data).
- [ ] **15.8 Agricultural Monitoring** — Predicting crop yields.
  - [ ] 15.8.1 **Prose/Intuition** — NDVI correlates with plant health and photosynthetic activity; early detection of crop stress; yield forecasts before official reports.
  - [ ] 15.8.2 **Visual Evidence** — NDVI maps, crop stress detection, yield forecasts.
  - [ ] 15.8.3 **Mathematical Derivation** —
    - NDVI = (NIR - Red)/(NIR + Red), healthy vegetation NDVI > 0.6.
    - Yield model: Yield = f(NDVI_integral, weather, soil) + ε.
    - Spatial aggregation: regional yield = Σ(field yield × area weight).
    - Temporal: NDVI curve integral over growing season correlates with final yield.
  - [ ] 15.8.4 **Implementation & Application** — Agricultural monitoring pipeline; commodity trading from crop yield forecasts.
- [ ] **15.9 Shipping and Trade Flow** — Global commerce from space.
  - [ ] 15.9.1 **Prose/Intuition** — Ships carry goods; AIS broadcasts location; satellite-AIS fills gaps; port congestion predicts supply chain issues.
  - [ ] 15.9.2 **Visual Evidence** — Ship tracking maps, port congestion visualisation.
  - [ ] 15.9.3 **Mathematical Derivation** —
    - AIS data: vessel ID, position, speed, heading, destination.
    - Cargo estimation: DWT (deadweight tonnage) × estimated load factor.
    - Trade flow: aggregate shipments by origin-destination, commodity type.
    - Port congestion: waiting time = ships_waiting × average_processing_time.
  - [ ] 15.9.4 **Implementation & Application** — Ship tracking and trade flow analysis; supply chain disruption signals for shipping and logistics companies.
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
  - [ ] 16.1.1 **Prose/Intuition** — Traders share views publicly; aggregated sentiment may precede price moves; real-time nature provides speed advantage over traditional news.
  - [ ] 16.1.2 **Visual Evidence** — Twitter volume spikes around earnings, cashtag activity patterns.
  - [ ] 16.1.3 **Mathematical Derivation** —
    - Volume metric: V_t = count of tweets mentioning $TICKER in period t.
    - User weighting: w_user = f(followers, verified, finance_related).
    - Weighted volume: V_weighted = Σw_i for all tweets.
    - Cashtag extraction: regex pattern \$[A-Z]{1,5} for ticker symbols.
  - [ ] 16.1.4 **Implementation & Application** — Twitter/X API access, data collection pipeline; real-time sentiment monitoring for event detection.
- [ ] **16.2 Reddit and WallStreetBets** — Retail investor signals.
  - [ ] 16.2.1 **Prose/Intuition** — Retail flows can move prices, especially in small/mid caps; coordinated retail activity creates detectable patterns; meme stock phenomenon.
  - [ ] 16.2.2 **Visual Evidence** — GameStop saga timeline, Reddit mention spikes preceding price moves.
  - [ ] 16.2.3 **Mathematical Derivation** —
    - Mention count: M_t = posts + comments mentioning ticker.
    - Engagement weighting: w_post = upvotes - downvotes + comments.
    - Unusual activity: z_score = (M_t - μ_M)/σ_M, flag if z > 2.
    - Velocity: acceleration in mentions ΔM/Δt.
  - [ ] 16.2.4 **Implementation & Application** — Reddit API, subreddit monitoring (r/wallstreetbets, r/stocks); early detection of retail interest spikes.
- [ ] **16.3 StockTwits and Finance-Specific Platforms** — Concentrated signals.
  - [ ] 16.3.1 **Prose/Intuition** — Purpose-built platforms for trading discussion; self-labelled bullish/bearish reduces NLP complexity; concentrated user base.
  - [ ] 16.3.2 **Visual Evidence** — StockTwits sentiment indicators, bull/bear ratio over time.
  - [ ] 16.3.3 **Mathematical Derivation** —
    - Bull ratio: BR = bullish_posts / (bullish_posts + bearish_posts).
    - Message velocity: messages per hour for each ticker.
    - Combined signal: S = α×BR + β×log(volume) + γ×velocity.
  - [ ] 16.3.4 **Implementation & Application** — StockTwits API integration; combining Twitter + StockTwits may improve long/short strategy returns (though effects vary).
- [ ] **Quick Reference** — Social media data sources comparison.

### Part 2 (`16-2`): Sentiment Analysis Methods

- [ ] **16.4 Lexicon-Based Sentiment** — Word counting approaches.
  - [ ] 16.4.1 **Prose/Intuition** — Simple word counting with pre-defined positive/negative lists; fast, interpretable, no training required; financial-specific lexicons (Loughran-McDonald) outperform generic.
  - [ ] 16.4.2 **Visual Evidence** — Word clouds, lexicon comparison on financial text.
  - [ ] 16.4.3 **Mathematical Derivation** —
    - Sentiment score: S = (Σpos_words - Σneg_words) / total_words.
    - Loughran-McDonald categories: positive, negative, uncertainty, litigious, strong modal, weak modal.
    - Negation handling: flip sentiment in window after negation words.
    - Document sentiment: weighted average of sentence sentiments.
  - [ ] 16.4.4 **Implementation & Application** — Lexicon-based sentiment in R (`tidytext`, `sentimentr`); earnings call tone analysis using Loughran-McDonald.
- [ ] **16.5 Machine Learning Sentiment** — Learning from labelled data.
  - [ ] 16.5.1 **Prose/Intuition** — Learn sentiment from examples; captures context, sarcasm, domain-specific language; requires labelled training data.
  - [ ] 16.5.2 **Visual Evidence** — Model performance comparison (accuracy, F1), confusion matrices.
  - [ ] 16.5.3 **Mathematical Derivation** —
    - Text representation: bag-of-words x ∈ ℝ^V (vocabulary size V).
    - TF-IDF: tfidf(t,d) = tf(t,d) × log(N/df(t)).
    - Naive Bayes: P(class|text) ∝ P(class) × Πp(word_i|class).
    - SVM: find hyperplane maximising margin in feature space.
    - Word embeddings: word2vec, map words to dense vectors.
  - [ ] 16.5.4 **Implementation & Application** — Sentiment classifier training; custom models for financial domain text.
- [ ] **16.6 Aggregating Sentiment** — From posts to signals.
  - [ ] 16.6.1 **Prose/Intuition** — Individual posts are noisy; aggregation across many posts provides cleaner signal; temporal decay weights recent more than old.
  - [ ] 16.6.2 **Visual Evidence** — Raw vs aggregated sentiment time series, noise reduction.
  - [ ] 16.6.3 **Mathematical Derivation** —
    - Volume-weighted: S_agg = Σ(S_i × v_i) / Σv_i where v = engagement.
    - Exponential decay: S_t = Σ_{k=0}^{T} λ^k × S_{t-k}, λ < 1.
    - Cross-sectional z-score: z_i = (S_i - μ_S) / σ_S (normalise across stocks).
    - Sentiment change: ΔS = S_t - S_{t-1} (momentum in sentiment).
  - [ ] 16.6.4 **Implementation & Application** — Sentiment aggregation pipeline; daily sentiment factor construction for cross-sectional strategies.
- [ ] **Quick Reference** — Sentiment analysis method comparison.

### Part 3 (`16-3`): Sentiment Trading Strategies

- [ ] **16.7 Sentiment Momentum** — Trading with the crowd.
  - [ ] 16.7.1 **Prose/Intuition** — Positive sentiment may predict short-term returns; information diffuses through social media; momentum effect in sentiment.
  - [ ] 16.7.2 **Visual Evidence** — Sentiment quintile returns, cumulative performance.
  - [ ] 16.7.3 **Mathematical Derivation** —
    - Long/short: long top sentiment quintile, short bottom quintile.
    - Holding period: returns decay after 1-5 days typically.
    - Combined signal: S_combined = α×sentiment + β×price_momentum.
    - Rebalancing: daily or weekly based on sentiment refresh rate.
  - [ ] 16.7.4 **Implementation & Application** — Sentiment momentum strategy backtesting; combining sentiment with price momentum.
- [ ] **16.8 Sentiment Reversals** — Fading the crowd.
  - [ ] 16.8.1 **Prose/Intuition** — Extreme sentiment may predict reversals; overreaction followed by correction; contrarian opportunity at extremes.
  - [ ] 16.8.2 **Visual Evidence** — Extreme sentiment quintile returns over longer horizons.
  - [ ] 16.8.3 **Mathematical Derivation** —
    - Extreme detection: flag if |z_sentiment| > 2 (2 standard deviations).
    - Reversal signal: short if extremely positive, long if extremely negative.
    - Lookback: measure extremeness over rolling window.
    - Holding period: longer than momentum (5-20 days).
  - [ ] 16.8.4 **Implementation & Application** — Sentiment reversal strategy; determining when to go with vs against sentiment based on magnitude.
- [ ] **16.9 Event-Driven Sentiment** — Earnings and news.
  - [ ] 16.9.1 **Prose/Intuition** — Sentiment spikes around events may contain information; pre-announcement sentiment drift; post-announcement reaction.
  - [ ] 16.9.2 **Visual Evidence** — Sentiment around earnings announcements, event study format.
  - [ ] 16.9.3 **Mathematical Derivation** —
    - Abnormal sentiment: AS_t = S_t - E[S_t|normal period].
    - Pre-earnings drift: cumulative AS in [-5, -1] days before earnings.
    - Event window returns: CAR[-1,+1] regressed on pre-event sentiment.
    - Surprise interaction: sentiment × earnings_surprise effect.
  - [ ] 16.9.4 **Implementation & Application** — Event-driven sentiment strategy; earnings season sentiment trading.
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
  - [ ] 17.1.1 **Prose/Intuition** — Public information on websites not yet in structured databases; first-mover advantage in data collection; automation enables scale.
  - [ ] 17.1.2 **Visual Evidence** — Scraped data examples, HTML structure to data table.
  - [ ] 17.1.3 **Mathematical Derivation** — Engineering focus; primarily procedural (XPath/CSS selectors, pagination, rate limiting); no statistical derivations.
  - [ ] 17.1.4 **Implementation & Application** — `rvest` for web scraping in R; legal and ethical considerations (robots.txt, terms of service, rate limiting).
- [ ] **17.2 Job Postings** — Company growth signals.
  - [ ] 17.2.1 **Prose/Intuition** — Hiring indicates expansion plans; specific role types signal strategic direction; layoffs indicate trouble.
  - [ ] 17.2.2 **Visual Evidence** — Job posting trends vs subsequent earnings growth.
  - [ ] 17.2.3 **Mathematical Derivation** —
    - Growth rate: g_jobs = (Jobs_t - Jobs_{t-1}) / Jobs_{t-1}.
    - Role categorisation: engineering, sales, operations buckets.
    - Sector-relative: z_company = (g_company - μ_sector) / σ_sector.
    - Lead time: hiring often leads revenue by 3-6 months.
  - [ ] 17.2.4 **Implementation & Application** — Job posting data collection (LinkedIn, company sites, aggregators); job posting momentum strategy.
- [ ] **17.3 App Rankings and Reviews** — Consumer behaviour signals.
  - [ ] 17.3.1 **Prose/Intuition** — App downloads and engagement correlate with revenue for digital companies; reviews reveal product quality and customer satisfaction.
  - [ ] 17.3.2 **Visual Evidence** — App Store rankings vs company stock performance.
  - [ ] 17.3.3 **Mathematical Derivation** —
    - Ranking change: ΔRank = Rank_t - Rank_{t-1} (lower = better).
    - Download estimates: from rank using power-law relationship.
    - Review sentiment: average star rating, sentiment of text reviews.
    - Trend: rolling average of metrics over time.
  - [ ] 17.3.4 **Implementation & Application** — App Store data collection (App Annie, Sensor Tower); tech company earnings signal construction.
- [ ] **17.4 E-commerce and Pricing Data** — Competitive intelligence.
  - [ ] 17.4.1 **Prose/Intuition** — Prices and inventory indicate supply/demand; out-of-stock signals strong demand; price changes signal competitive dynamics.
  - [ ] 17.4.2 **Visual Evidence** — Price index time series, out-of-stock rates by retailer.
  - [ ] 17.4.3 **Mathematical Derivation** —
    - Price index: P_index = Σ(p_i × w_i) / Σw_i where w = sales weight.
    - Availability: A = in_stock_SKUs / total_SKUs.
    - Price elasticity: ε = (ΔQ/Q) / (ΔP/P).
    - Competitive position: relative price vs competitors.
  - [ ] 17.4.4 **Implementation & Application** — E-commerce monitoring pipeline; retail and consumer goods trading signals.
- [ ] **Quick Reference** — Web scraping best practices.

### Part 2 (`17-2`): Transaction and Consumer Data

- [ ] **17.5 Credit Card Data** — Real-time consumer spending.
  - [ ] 17.5.1 **Prose/Intuition** — Aggregated credit card spend available weeks before earnings reports; panel data extrapolated to population; leading indicator of revenue.
  - [ ] 17.5.2 **Visual Evidence** — Credit card spend vs reported revenue correlation.
  - [ ] 17.5.3 **Mathematical Derivation** —
    - Panel extrapolation: Revenue_est = (Panel_spend / Panel_share) × coverage_adj.
    - Sampling bias correction: weight by demographics, geography.
    - Same-store growth: g_SSS = (S_t,same_stores - S_{t-1,same_stores}) / S_{t-1,same_stores}.
    - Seasonal adjustment: remove recurring calendar patterns.
  - [ ] 17.5.4 **Implementation & Application** — Working with credit card data providers (Second Measure, Earnest); retail earnings prediction.
- [ ] **17.6 Point-of-Sale Data** — Transaction-level insights.
  - [ ] 17.6.1 **Prose/Intuition** — SKU-level transaction data provides granular view; basket analysis reveals consumer behaviour; product mix affects margins.
  - [ ] 17.6.2 **Visual Evidence** — POS trends by category, basket composition over time.
  - [ ] 17.6.3 **Mathematical Derivation** —
    - Same-store sales: compare identical store set period-over-period.
    - Basket size: average transaction value = total_sales / num_transactions.
    - Product mix: category_share = category_sales / total_sales.
    - Market share: company_sales / total_market_sales.
  - [ ] 17.6.4 **Implementation & Application** — POS data analysis; CPG and retail company trading signals.
- [ ] **17.7 Location Data** — Foot traffic analysis.
  - [ ] 17.7.1 **Prose/Intuition** — Physical visits indicate business health; mobile device location data scaled to population; leading indicator of sales.
  - [ ] 17.7.2 **Visual Evidence** — Foot traffic time series vs revenue, store-level variation.
  - [ ] 17.7.3 **Mathematical Derivation** —
    - Visit count: devices detected at location × scaling factor.
    - Dwell time: average time spent at location.
    - Visit frequency: visits per device per period.
    - Geofencing: define polygon around store, count entries/exits.
  - [ ] 17.7.4 **Implementation & Application** — Location data providers (SafeGraph, Placer.ai); retail and restaurant trading signals.
- [ ] **Quick Reference** — Transaction data sources.

### Part 3 (`17-3`): Data Integration and Quality

- [ ] **17.8 Alternative Data Quality** — Garbage in, garbage out.
  - [ ] 17.8.1 **Prose/Intuition** — Bad data destroys strategies; quality issues include coverage gaps, backfill, survivorship; due diligence critical before use.
  - [ ] 17.8.2 **Visual Evidence** — Data quality issues visualised, coverage maps.
  - [ ] 17.8.3 **Mathematical Derivation** —
    - Completeness: % of expected observations present.
    - Accuracy: |reported - actual| / actual.
    - Timeliness: lag between event and data availability.
    - Backfill detection: compare point-in-time vs current data history.
    - Survivorship: track coverage over time, note dropouts.
  - [ ] 17.8.4 **Implementation & Application** — Data quality check framework; vendor due diligence checklist.
- [ ] **17.9 Combining Alternative Data** — Multi-source signals.
  - [ ] 17.9.1 **Prose/Intuition** — Different data sources capture different aspects; combination may improve signal quality; diminishing returns to adding sources.
  - [ ] 17.9.2 **Visual Evidence** — Combined vs single-source IC, performance comparison.
  - [ ] 17.9.3 **Mathematical Derivation** —
    - Signal combination: S_combined = Σw_i × S_i / Σw_i.
    - IC aggregation: IC_combined ≈ √(Σρ_{ij}IC_iIC_j) where ρ = correlation.
    - Optimal weights: proportional to IC × √(1 - R²_{others}).
    - Ensemble methods: average predictions across models.
  - [ ] 17.9.4 **Implementation & Application** — Multi-source alternative data strategy; building comprehensive fundamental signals.
- [ ] **17.10 LLM Tools for Text Processing** — Using AI APIs for analysis.
  - [ ] 17.10.1 **Prose/Intuition** — LLMs understand context and nuance; extract structured data from unstructured text; prompt engineering is key skill.
  - [ ] 17.10.2 **Visual Evidence** — LLM extraction examples (earnings call → structured sentiment, SEC filing → key metrics).
  - [ ] 17.10.3 **Mathematical Derivation** — Tool usage focus; no statistical derivations; emphasis on prompt design and output validation.
  - [ ] 17.10.4 **Implementation & Application** — OpenAI/Anthropic API integration; prompt engineering for financial text; structured output extraction with validation; automating text-to-signal pipelines.
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
  - [ ] 18.1.1 **Prose/Intuition** — Legally required disclosures contain material information; text changes between filings may signal risk; readability and sentiment have predictive content.
  - [ ] 18.1.2 **Visual Evidence** — Filing frequency patterns, sentiment time series, abnormal 8-K clusters.
  - [ ] 18.1.3 **Mathematical Derivation** —
    - Sentiment score: S = (pos_words - neg_words) / total using Loughran-McDonald.
    - Fog index: FOG = 0.4 × (words/sentences + 100 × complex_words/words).
    - Cosine similarity: sim(A,B) = (A·B) / (||A|| × ||B||) for document comparison.
    - Change detection: |S_t - S_{t-1}| > threshold flags abnormal change.
  - [ ] 18.1.4 **Implementation & Application** — EDGAR API access, parsing 10-K/10-Q/8-K filings; early filing detection; sentiment change trading signals.
- [ ] **18.2 13F Holdings** — What institutions own.
  - [ ] 18.2.1 **Prose/Intuition** — Large investors (>$100M AUM) required to disclose holdings; may have information advantage; 45-day reporting lag limits timeliness.
  - [ ] 18.2.2 **Visual Evidence** — Hedge fund portfolio changes, crowded trade identification.
  - [ ] 18.2.3 **Mathematical Derivation** —
    - Position change: ΔShares = Shares_t - Shares_{t-1}.
    - Conviction score: w_stock / max(w_stock) for each fund.
    - Crowding: C = Σfunds_holding / total_funds, concentration in top holders.
    - Herding: count of funds with same direction change.
  - [ ] 18.2.4 **Implementation & Application** — 13F parsing, portfolio reconstruction; following "smart money" (noting 45-day lag reduces signal value).
- [ ] **18.3 Short Interest Data** — Bearish bets revealed.
  - [ ] 18.3.1 **Prose/Intuition** — Short sellers often informed; high short interest may signal overvaluation or impending bad news; also creates squeeze risk.
  - [ ] 18.3.2 **Visual Evidence** — Short interest vs subsequent returns, squeeze candidate identification.
  - [ ] 18.3.3 **Mathematical Derivation** —
    - Short interest ratio: SIR = short_shares / shares_outstanding.
    - Days to cover: DTC = short_shares / avg_daily_volume.
    - Cost to borrow: higher = harder to short = more conviction required.
    - Squeeze risk: high SIR × high DTC × declining borrow availability.
  - [ ] 18.3.4 **Implementation & Application** — Short interest data sources; short squeeze detection; contrarian signals from extreme short interest.
- [ ] **Quick Reference** — SEC filing types and trading implications.

### Part 2 (`18-2`): Insider Trading Signals

- [ ] **18.4 Form 4 Filings** — When insiders buy and sell.
  - [ ] 18.4.1 **Prose/Intuition** — Insiders have superior information about their companies; insider buying historically associated with subsequent outperformance; selling less informative (diversification, liquidity needs).
  - [ ] 18.4.2 **Visual Evidence** — Insider buying clusters, CEO purchases vs returns.
  - [ ] 18.4.3 **Mathematical Derivation** —
    - Aggregate insider sentiment: IS = (buys - sells) / (buys + sells).
    - Role weighting: w_CEO > w_director > w_officer.
    - Size-adjusted: normalise by typical transaction size for role.
    - Cluster detection: multiple insiders buying within short window.
  - [ ] 18.4.4 **Implementation & Application** — Form 4 parsing from EDGAR; insider database construction; insider buying signals (historical alpha estimates vary, commonly cited as 3-5% annually).
- [ ] **18.5 Congressional Trading** — Political information advantage.
  - [ ] 18.5.1 **Prose/Intuition** — Lawmakers have access to non-public policy information; STOCK Act requires disclosure; trades may signal upcoming regulatory changes.
  - [ ] 18.5.2 **Visual Evidence** — Congressional trading patterns, sector timing around legislation.
  - [ ] 18.5.3 **Mathematical Derivation** —
    - Abnormal returns: AR = r_stock - r_benchmark around trade date.
    - Policy exposure: β_policy = sensitivity of stock to policy sector.
    - Committee assignment relevance: trades in sectors overseen by committees.
  - [ ] 18.5.4 **Implementation & Application** — Capitol Trades, stock watcher APIs; following political signals (noting ethical considerations and potential future restrictions).
- [ ] **18.6 Executive Compensation Signals** — What pay packages reveal.
  - [ ] 18.6.1 **Prose/Intuition** — Compensation structure affects behaviour; option-heavy comp may encourage risk-taking; bonus metrics reveal management priorities.
  - [ ] 18.6.2 **Visual Evidence** — Compensation structure breakdown, metric targets.
  - [ ] 18.6.3 **Mathematical Derivation** —
    - Equity sensitivity: Δwealth / Δstock_price.
    - Incentive alignment: % pay tied to shareholder value.
    - Earnings management risk: high bonus threshold + near-threshold performance.
  - [ ] 18.6.4 **Implementation & Application** — DEF 14A proxy parsing; management incentive analysis.
- [ ] **Quick Reference** — Insider activity signals summary.

### Part 3 (`18-3`): Government and Regulatory Data

- [ ] **18.7 Government Contracts** — Federal spending signals.
  - [ ] 18.7.1 **Prose/Intuition** — Contract awards are material revenue events; government spending is significant for defence, healthcare, IT sectors.
  - [ ] 18.7.2 **Visual Evidence** — Contract announcements vs stock price reaction.
  - [ ] 18.7.3 **Mathematical Derivation** —
    - Contract value: total potential value, funded amount.
    - Revenue impact: contract_value / annual_revenue.
    - Margin estimation: contract type (cost-plus vs fixed price) affects profitability.
    - Sector exposure: government_revenue / total_revenue.
  - [ ] 18.7.4 **Implementation & Application** — USAspending.gov, FPDS data access; defence/government contractor trading signals.
- [ ] **18.8 FDA and Clinical Trial Data** — Biotech event trading.
  - [ ] 18.8.1 **Prose/Intuition** — Drug approvals create binary events with large price impacts; approval probability can be estimated from trial data and precedent.
  - [ ] 18.8.2 **Visual Evidence** — Approval probability distributions, AdCom vote patterns.
  - [ ] 18.8.3 **Mathematical Derivation** —
    - Prior approval rate: base rate by therapeutic area and trial phase.
    - Trial statistics: p-value, effect size, safety profile.
    - Option-implied move: σ_implied × √(days_to_event/252) = expected % move.
    - Event risk/reward: if P(approval) > option_implied_probability → opportunity.
  - [ ] 18.8.4 **Implementation & Application** — ClinicalTrials.gov, FDA calendar tracking; biotech event strategies (noting complexity and specialist knowledge required).
- [ ] **18.9 Patent and IP Data** — Innovation signals.
  - [ ] 18.9.1 **Prose/Intuition** — Patents indicate successful R&D; patent quality varies; citations as measure of importance.
  - [ ] 18.9.2 **Visual Evidence** — Patent grant rates, citation-weighted patents vs returns.
  - [ ] 18.9.3 **Mathematical Derivation** —
    - Patent count: raw count of patents granted in period.
    - Citation weighting: patent_value ≈ Σforward_citations.
    - Technology classification: IPC codes → sector mapping.
    - Innovation score: citation_weighted_patents / R&D_expense.
  - [ ] 18.9.4 **Implementation & Application** — USPTO, Google Patents API; innovation factor construction.
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
  - [ ] 19.1.1 **Prose/Intuition** — ESG may capture long-term risk not in traditional metrics; rating agency disagreement is substantial; academic evidence on returns mixed.
  - [ ] 19.1.2 **Visual Evidence** — ESG scores vs returns, rating disagreement across providers.
  - [ ] 19.1.3 **Mathematical Derivation** —
    - Rating methodologies vary: MSCI uses 1000+ metrics, Sustainalytics focuses on risk.
    - Component scores: E (environmental), S (social), G (governance).
    - Composite: ESG = w_E × E + w_S × S + w_G × G.
    - Cross-sectional: z_ESG = (ESG_i - μ) / σ normalised by sector.
  - [ ] 19.1.4 **Implementation & Application** — ESG data providers (MSCI, Sustainalytics); ESG momentum strategy; rating upgrade/downgrade trading.
- [ ] **19.2 Carbon and Emissions Data** — Climate transition risk.
  - [ ] 19.2.1 **Prose/Intuition** — Carbon pricing affects future costs; transition risk as companies adapt; physical risk from climate events.
  - [ ] 19.2.2 **Visual Evidence** — Carbon intensity by sector, emissions trends.
  - [ ] 19.2.3 **Mathematical Derivation** —
    - Scope 1: direct emissions from owned sources.
    - Scope 2: indirect from purchased energy.
    - Scope 3: upstream/downstream value chain emissions.
    - Carbon intensity: CI = emissions / revenue (or per unit output).
    - Carbon beta: β_carbon = sensitivity of returns to carbon price changes.
  - [ ] 19.2.4 **Implementation & Application** — CDP, TCFD data access; climate transition factor construction.
- [ ] **19.3 Controversy and News Sentiment** — Reputational risk.
  - [ ] 19.3.1 **Prose/Intuition** — Controversies may signal operational, governance, or ethical problems; news sentiment tracks reputational shifts.
  - [ ] 19.3.2 **Visual Evidence** — Controversy scores, scandal timeline vs stock impact.
  - [ ] 19.3.3 **Mathematical Derivation** —
    - Event detection: NLP to identify controversy from news.
    - Severity scoring: s = f(magnitude, persistence, media coverage).
    - Controversy index: CI_t = Σseverity × decay^(t - event_date).
    - Sentiment change: ΔS = S_t - rolling_mean(S).
  - [ ] 19.3.4 **Implementation & Application** — News API, controversy databases; ESG controversy avoidance strategy.
- [ ] **Quick Reference** — ESG data providers and metrics.

### Part 2 (`19-2`): Weather and Commodity Signals

- [ ] **19.4 Weather Data for Trading** — Climate affects commerce.
  - [ ] 19.4.1 **Prose/Intuition** — Weather impacts demand (heating/cooling), supply (agriculture, energy), and operations (construction, retail foot traffic).
  - [ ] 19.4.2 **Visual Evidence** — Temperature anomalies, degree day charts.
  - [ ] 19.4.3 **Mathematical Derivation** —
    - Heating Degree Days: HDD = max(0, 65°F - T_avg) per day.
    - Cooling Degree Days: CDD = max(0, T_avg - 65°F) per day.
    - Seasonal adjustment: actual vs normal for period.
    - Weather derivatives: payoff based on cumulative HDD or CDD.
  - [ ] 19.4.4 **Implementation & Application** — NOAA, weather API integration; utilities, retail, agriculture sector trading signals.
- [ ] **19.5 Agricultural and Commodity Fundamentals** — Supply-side data.
  - [ ] 19.5.1 **Prose/Intuition** — Inventory levels and production forecasts drive commodity prices; USDA reports create event risk; carry vs spot spreads signal scarcity.
  - [ ] 19.5.2 **Visual Evidence** — USDA WASDE reports, inventory cycles.
  - [ ] 19.5.3 **Mathematical Derivation** —
    - Supply/demand balance: Ending_stocks = Beginning + Production + Imports - Consumption - Exports.
    - Stocks-to-use ratio: S/U = Ending_stocks / Total_use.
    - Carry: F_1 - S = cost of storage + interest - convenience yield.
    - Backwardation signal: F < S implies scarcity.
  - [ ] 19.5.4 **Implementation & Application** — USDA data access; commodity fundamental strategies based on supply/demand imbalances.
- [ ] **19.6 Energy Market Data** — Oil, gas, and electricity.
  - [ ] 19.6.1 **Prose/Intuition** — Energy underlies economic activity; inventory reports create weekly event risk; rig counts signal future production.
  - [ ] 19.6.2 **Visual Evidence** — EIA inventory charts, Baker Hughes rig counts.
  - [ ] 19.6.3 **Mathematical Derivation** —
    - Inventory surprise: ΔI_actual - ΔI_expected (vs consensus).
    - Crack spread: Gasoline + Heating_Oil - 3×Crude (3-2-1 crack).
    - Storage capacity utilisation: current_storage / max_capacity.
    - Rig count → production lead: drilling precedes production by months.
  - [ ] 19.6.4 **Implementation & Application** — EIA data access; energy sector timing based on inventory cycles.
- [ ] **Quick Reference** — Weather and commodity data sources.

### Part 3 (`19-3`): Macro Nowcasting

- [ ] **19.7 High-Frequency Economic Indicators** — Real-time GDP.
  - [ ] 19.7.1 **Prose/Intuition** — Official economic data lags weeks to months; alternative data provides real-time estimates; "nowcasting" fills the gap.
  - [ ] 19.7.2 **Visual Evidence** — Nowcast vs official GDP releases, tracking accuracy.
  - [ ] 19.7.3 **Mathematical Derivation** —
    - Dynamic factor model: y_t = Λf_t + ε_t, f_t = Φf_{t-1} + η_t.
    - Kalman filter: state estimation from partial observations.
    - Mixed-frequency: combine monthly, weekly, daily indicators.
    - Nowcast update: revise estimate as new data arrives.
  - [ ] 19.7.4 **Implementation & Application** — Building a nowcast model in R; macro regime timing for tactical allocation.
- [ ] **19.8 Search Trends and Digital Exhaust** — Google as economic indicator.
  - [ ] 19.8.1 **Prose/Intuition** — Search behaviour reveals consumer intentions; "jobs" searches predict unemployment claims; retail-related queries predict sales.
  - [ ] 19.8.2 **Visual Evidence** — Google Trends vs official unemployment, retail sales.
  - [ ] 19.8.3 **Mathematical Derivation** —
    - Query index: Google normalises to 0-100 for each term.
    - Seasonal adjustment: remove calendar effects (weekly, monthly, holiday).
    - Aggregation: combine multiple queries into composite index.
    - Lead relationship: cross-correlation at various lags.
  - [ ] 19.8.4 **Implementation & Application** — Google Trends API; query selection strategies; consumer confidence nowcasting.
- [ ] **19.9 Payments and Financial Flow Data** — Real-time spending.
  - [ ] 19.9.1 **Prose/Intuition** — Payment flows are real-time measure of economic activity; ACH and wire volumes reflect transactions; Fed data provides aggregate view.
  - [ ] 19.9.2 **Visual Evidence** — ACH volume trends, wire transfer patterns.
  - [ ] 19.9.3 **Mathematical Derivation** —
    - Seasonal adjustment: X-13ARIMA-SEATS or STL decomposition.
    - Trend extraction: Hodrick-Prescott filter or local regression.
    - Growth rate: g = (V_t - V_{t-12}) / V_{t-12} (year-over-year).
    - Turning point detection: deviations from trend.
  - [ ] 19.9.4 **Implementation & Application** — Fed data, payment network APIs; economic turning point detection.
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
  - [ ] 20.1.1 **Prose/Intuition** — Options as conditional claims; Black-Scholes assumes log-normal prices and constant volatility; risk-neutral pricing via replication; model is wrong but useful.
  - [ ] 20.1.2 **Visual Evidence** — Option payoff diagrams, call/put price surfaces.
  - [ ] 20.1.3 **Mathematical Derivation** —
    - Black-Scholes call: C = S×N(d₁) - K×e^{-rT}×N(d₂).
    - d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T), d₂ = d₁ - σ√T.
    - Put-call parity: C - P = S - K×e^{-rT}.
    - Derivation via risk-neutral expectation: C = e^{-rT} × E^Q[max(S_T - K, 0)].
  - [ ] 20.1.4 **Implementation & Application** — BS pricing and Greeks in R; understanding what you're trading.
- [ ] **20.2 The Greeks in Practice** — Risk sensitivities.
  - [ ] 20.2.1 **Prose/Intuition** — Greeks decompose option risk into manageable components; Delta = directional, Gamma = convexity, Theta = time decay, Vega = volatility sensitivity.
  - [ ] 20.2.2 **Visual Evidence** — Greek surfaces across strike and time, P&L attribution.
  - [ ] 20.2.3 **Mathematical Derivation** —
    - Delta: Δ = ∂C/∂S = N(d₁) for call.
    - Gamma: Γ = ∂²C/∂S² = n(d₁)/(S×σ√T).
    - Theta: θ = ∂C/∂t = -Sn(d₁)σ/(2√T) - rKe^{-rT}N(d₂).
    - Vega: ν = ∂C/∂σ = S√T × n(d₁).
    - Taylor expansion: dC ≈ Δ×dS + ½Γ×dS² + θ×dt + ν×dσ.
  - [ ] 20.2.4 **Implementation & Application** — Greek calculation; portfolio Greeks aggregation; managing Greek exposures.
- [ ] **20.3 Implied Volatility** — What the market thinks.
  - [ ] 20.3.1 **Prose/Intuition** — IV is the volatility that makes BS price equal market price; embeds market's volatility expectation (plus risk premium); IV ≠ forecast but related.
  - [ ] 20.3.2 **Visual Evidence** — IV term structure, IV smile/skew patterns.
  - [ ] 20.3.3 **Mathematical Derivation** —
    - IV definition: σ_IV such that BS(S, K, T, r, σ_IV) = C_market.
    - No closed form; solve numerically.
    - Newton-Raphson: σ_{n+1} = σ_n - (BS(σ_n) - C_market) / vega(σ_n).
    - Convergence typically in 3-5 iterations with good initial guess.
  - [ ] 20.3.4 **Implementation & Application** — IV calculation in R; IV surface construction; IV as trading signal.
- [ ] **Quick Reference** — Options formulae, Greek definitions.

### Part 2 (`20-2`): Volatility Surface Trading

- [ ] **20.4 The Volatility Surface** — IV across strikes and maturities.
  - [ ] 20.4.1 **Prose/Intuition** — IV varies with strike and maturity; smile = higher IV for OTM; skew = puts more expensive than calls; surface shape reveals risk preferences.
  - [ ] 20.4.2 **Visual Evidence** — 3D volatility surface, smile and skew visualisation.
  - [ ] 20.4.3 **Mathematical Derivation** —
    - SVI parametrisation: w(k) = a + b(ρ(k-m) + √((k-m)² + σ²)).
    - SABR model: dF = αF^β dW₁, dα = να dW₂, correlation ρ.
    - Moneyness: k = ln(K/F) or K/S.
    - Arbitrage constraints: butterfly spread ≥ 0, calendar spread ≥ 0.
  - [ ] 20.4.4 **Implementation & Application** — Volatility surface construction and fitting; surface arbitrage detection.
- [ ] **20.5 Volatility Skew** — Why puts are expensive.
  - [ ] 20.5.1 **Prose/Intuition** — OTM puts trade at higher IV than OTM calls; reflects crash risk aversion; 1987 crash changed market permanently; leverage effect.
  - [ ] 20.5.2 **Visual Evidence** — Skew evolution over time, skew premium realisation.
  - [ ] 20.5.3 **Mathematical Derivation** —
    - Skew = IV(90% moneyness) - IV(110% moneyness).
    - Risk reversal: buy call, sell put at same delta (long skew).
    - Butterfly: long wing strikes, short body (long vol-of-vol).
    - Skew premium: E[realised skew] < implied skew (usually).
  - [ ] 20.5.4 **Implementation & Application** — Skew calculation and monitoring; trading skew premium.
- [ ] **20.6 Term Structure Trading** — Volatility calendar spreads.
  - [ ] 20.6.1 **Prose/Intuition** — Term structure is upward-sloping normally; inverts during stress; calendar spreads trade term structure shape.
  - [ ] 20.6.2 **Visual Evidence** — IV term structure over time, VIX futures curve.
  - [ ] 20.6.3 **Mathematical Derivation** —
    - Calendar spread: sell near-dated option, buy far-dated option (same strike).
    - P&L: profit if near-dated theta > far-dated theta (typical).
    - VIX term structure: VIX_1M < VIX_2M < VIX_3M (contango) usually.
    - Roll yield: (F_near - F_far) / F_far annualised.
  - [ ] 20.6.4 **Implementation & Application** — Term structure trading strategies; VIX curve mean reversion (with significant tail risk).
- [ ] **Quick Reference** — Volatility surface metrics.

### Part 3 (`20-3`): Systematic Options Strategies

- [ ] **20.7 Covered Calls and Cash-Secured Puts** — Income strategies.
  - [ ] 20.7.1 **Prose/Intuition** — Harvest volatility risk premium by selling options; covered call = long stock + short call; limits upside in exchange for premium income.
  - [ ] 20.7.2 **Visual Evidence** — BXM index (buy-write) performance vs S&P 500.
  - [ ] 20.7.3 **Mathematical Derivation** —
    - Covered call payoff: S_T + max(0, K - S_T) - premium = min(S_T, K) + premium.
    - Cash-secured put payoff: max(K - S_T, 0) - premium.
    - Equivalent: covered call = cash-secured put (at same strike) by put-call parity.
    - Strike selection: delta-based (30-delta, ATM) or fixed % OTM.
  - [ ] 20.7.4 **Implementation & Application** — Systematic covered call strategy; roll timing rules; income generation in sideways markets (underperforms in strong rallies).
- [ ] **20.8 Dispersion Trading** — Index vs single-stock volatility.
  - [ ] 20.8.1 **Prose/Intuition** — Index options reflect correlation among constituents; implied correlation typically exceeds realised; dispersion trades sell index vol, buy single-stock vol.
  - [ ] 20.8.2 **Visual Evidence** — Implied vs realised correlation, dispersion strategy returns.
  - [ ] 20.8.3 **Mathematical Derivation** —
    - Index variance: σ²_I = Σw_i²σ_i² + ΣΣw_iw_jρ_{ij}σ_iσ_j.
    - Implied correlation: ρ_impl = (σ²_I - Σw_i²σ_i²) / (ΣΣw_iw_jσ_iσ_j) for i≠j.
    - Dispersion P&L: profit when realised correlation < implied correlation.
    - Vega-neutral construction: match index vega with constituent vega sum.
  - [ ] 20.8.4 **Implementation & Application** — Dispersion trading strategy construction; selling correlation premium.
- [ ] **20.9 Tail Risk Hedging** — Protecting against crashes.
  - [ ] 20.9.1 **Prose/Intuition** — Convex payoff when you need it most; tail hedges are negative carry but provide protection; permanent allocation vs tactical.
  - [ ] 20.9.2 **Visual Evidence** — Tail hedge performance in 2008, 2020; cost of protection over time.
  - [ ] 20.9.3 **Mathematical Derivation** —
    - OTM put: high gamma, negative theta, positive vega.
    - Put spread: buy put at K₁, sell put at K₂ < K₁ (limits cost, limits protection).
    - VIX call: profits from vol spike, limited downside.
    - Variance swap: P&L = (realised variance - strike variance) × notional.
  - [ ] 20.9.4 **Implementation & Application** — Tail hedging strategies; cost-benefit analysis; portfolio insurance allocation.
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
  - [ ] 21.1.1 **Prose/Intuition** — Efficiency requires competition, capital, and information infrastructure; developed markets most efficient; efficiency is relative, not absolute.
  - [ ] 21.1.2 **Visual Evidence** — Return predictability by market development level.
  - [ ] 21.1.3 **Mathematical Derivation** —
    - Variance ratio test: VR(q) = Var(r_t + ... + r_{t+q}) / [q × Var(r_t)], should equal 1 under random walk.
    - Hurst exponent: H > 0.5 indicates persistence, H < 0.5 indicates mean reversion.
    - Autocorrelation: ρ_k = Cov(r_t, r_{t-k}) / Var(r_t).
    - Predictive R²: from return forecasting regressions.
  - [ ] 21.1.4 **Implementation & Application** — Efficiency tests in R; identifying inefficient markets for strategy deployment.
- [ ] **21.2 Why Strategies Decay** — Alpha erosion over time.
  - [ ] 21.2.1 **Prose/Intuition** — Competition arbitrages away predictability; capital flows to profitable strategies; information diffuses over time.
  - [ ] 21.2.2 **Visual Evidence** — Factor returns over decades, strategy crowding metrics.
  - [ ] 21.2.3 **Mathematical Derivation** —
    - Alpha decay: α(t) = α₀ × e^{-λt} where λ = decay rate.
    - Information diffusion: adoption follows S-curve, profits peak mid-cycle.
    - Half-life: t_{1/2} = ln(2) / λ, time for alpha to halve.
    - Capacity limit: α × AUM = constant, more capital → less alpha per dollar.
  - [ ] 21.2.4 **Implementation & Application** — Measuring strategy decay in backtests; deciding when to abandon a market.
- [ ] **21.3 Finding Virgin Markets** — Where to look.
  - [ ] 21.3.1 **Prose/Intuition** — Less competition means more opportunity; trade-off against execution challenges, data quality, and access barriers.
  - [ ] 21.3.2 **Visual Evidence** — Global map of market efficiency, barriers to entry by market.
  - [ ] 21.3.3 **Mathematical Derivation** —
    - Screening criteria: liquidity (ADV), data quality (history, coverage), access (legal, operational).
    - Opportunity score: f(inefficiency, liquidity, access).
    - Execution cost estimate: spread + impact + opportunity cost.
  - [ ] 21.3.4 **Implementation & Application** — Market screening framework in R; balancing opportunity vs execution challenges.
- [ ] **Quick Reference** — Market efficiency metrics.

### Part 2 (`21-2`): Emerging and Frontier Markets

- [ ] **21.4 Emerging Market Characteristics** — What makes them different.
  - [ ] 21.4.1 **Prose/Intuition** — Information asymmetry, local investor base, currency effects, political risk, capital controls; lower correlation with DM during normal times.
  - [ ] 21.4.2 **Visual Evidence** — EM vs DM return distributions, correlation dynamics.
  - [ ] 21.4.3 **Mathematical Derivation** —
    - Country risk premium: r_EM = r_f + β_global × ERP_global + country_risk.
    - Currency effect: r_USD = r_local + Δ(exchange_rate).
    - Local vs global factors: r_i = α + β_global × f_global + β_local × f_local + ε.
  - [ ] 21.4.4 **Implementation & Application** — EM data access and adjustments; BRIC, EM ex-China, regional approaches.
- [ ] **21.5 Factor Strategies in Emerging Markets** — What works differently.
  - [ ] 21.5.1 **Prose/Intuition** — Same factors, different behaviour; value historically stronger in EM; momentum historically weaker and more crash-prone; quality provides downside protection.
  - [ ] 21.5.2 **Visual Evidence** — Factor returns in EM vs DM comparison.
  - [ ] 21.5.3 **Mathematical Derivation** —
    - Value in EM: some studies show stronger returns (varies by period and market).
    - Momentum in EM: often weaker than in DM; higher crash risk.
    - Quality in EM: may provide downside protection in crises.
    - Regional variation: factors perform differently across EM regions.
  - [ ] 21.5.4 **Implementation & Application** — EM factor strategies; adjusting factor weights by market characteristics.
- [ ] **21.6 Technical Analysis in Less Efficient Markets** — Simple signals work.
  - [ ] 21.6.1 **Prose/Intuition** — Slower information processing; less algorithmic competition; simple rules may have more persistent value.
  - [ ] 21.6.2 **Visual Evidence** — MA crossover performance comparison: EM vs DM.
  - [ ] 21.6.3 **Mathematical Derivation** —
    - Moving average: SMA_n = (1/n) Σ_{i=0}^{n-1} P_{t-i}.
    - Crossover signal: buy when SMA_short > SMA_long, sell when opposite.
    - Performance in EM: simple SMAs may outperform complex indicators.
    - Over-optimisation risk: less relevant in inefficient markets.
  - [ ] 21.6.4 **Implementation & Application** — EM technical strategies; simple moving averages as baseline.
- [ ] **21.7 Frontier Markets** — The final frontier.
  - [ ] 21.7.1 **Prose/Intuition** — Minimal institutional presence; domestic factors dominate; diversification benefit but with liquidity challenges.
  - [ ] 21.7.2 **Visual Evidence** — Frontier market returns, correlation with global markets.
  - [ ] 21.7.3 **Mathematical Derivation** —
    - Correlation: frontier markets typically have lower β to global factors.
    - Diversification: Var_portfolio lower with frontier allocation.
    - Local factor dominance: most variance explained by local, not global, factors.
  - [ ] 21.7.4 **Implementation & Application** — Frontier market access; data challenges; Africa, Central Asia, smaller Asian markets.
- [ ] **Quick Reference** — Emerging/frontier market strategy adjustments.

### Part 3 (`21-3`): Cryptocurrency Markets

- [ ] **21.8 Crypto Market Characteristics** — A new asset class.
  - [ ] 21.8.1 **Prose/Intuition** — 24/7 trading; fragmented liquidity across exchanges; retail-dominated; high volatility; rapid evolution of market structure.
  - [ ] 21.8.2 **Visual Evidence** — Crypto return distributions, volatility comparison with traditional assets.
  - [ ] 21.8.3 **Mathematical Derivation** —
    - Exchange fragmentation: price_i ≠ price_j across exchanges.
    - Funding rate: perpetual futures pay/receive funding = (perp_price - spot_price) × rate.
    - Basis: F - S = cost_of_carry in fiat-settled futures.
    - Realised vol: typically 50-100% annualised for BTC.
  - [ ] 21.8.4 **Implementation & Application** — Crypto data access via exchange APIs; BTC/ETH as majors; altcoin approaches.
- [ ] **21.9 Crypto Inefficiencies** — Where alpha persists.
  - [ ] 21.9.1 **Prose/Intuition** — Immature market structure; information asymmetry; less sophisticated participants; inefficiencies may persist longer than in traditional markets.
  - [ ] 21.9.2 **Visual Evidence** — Cross-exchange price discrepancies, momentum returns in crypto.
  - [ ] 21.9.3 **Mathematical Derivation** —
    - Momentum: past 1-week return predicts future 1-week return (higher autocorrelation than equities).
    - Mean reversion: short-term (intraday) mean reversion stronger.
    - Funding rate carry: collect funding by arbitraging perp vs spot.
    - Autocorrelation decay: slower than in developed equity markets.
  - [ ] 21.9.4 **Implementation & Application** — Crypto strategy backtesting with realistic costs; momentum strategies.
- [ ] **21.10 Cross-Exchange Arbitrage** — Exploiting fragmentation.
  - [ ] 21.10.1 **Prose/Intuition** — Same asset trades at different prices on different exchanges; arbitrage constrained by transfer times and counterparty risk.
  - [ ] 21.10.2 **Visual Evidence** — Price discrepancies over time, arbitrage opportunity windows.
  - [ ] 21.10.3 **Mathematical Derivation** —
    - Simple arb: buy on exchange A, sell on exchange B when P_B - P_A > costs.
    - Triangular arb: BTC/USD → ETH/BTC → ETH/USD cycle.
    - Costs: trading fees + withdrawal fees + spread + opportunity cost of capital lockup.
    - Transfer time: blockchain confirmation time limits arb capacity.
  - [ ] 21.10.4 **Implementation & Application** — Cross-exchange monitoring; latency considerations.
- [ ] **21.11 On-Chain Analytics** — Unique crypto data.
  - [ ] 21.11.1 **Prose/Intuition** — Blockchain is public ledger; transaction flows, wallet balances, smart contract activity all visible; unique data source not available in traditional finance.
  - [ ] 21.11.2 **Visual Evidence** — Whale wallet movements, exchange inflows/outflows.
  - [ ] 21.11.3 **Mathematical Derivation** —
    - Exchange flow: net_flow = inflow_to_exchange - outflow_from_exchange.
    - Whale activity: large transaction count, concentration in top wallets.
    - Active addresses: count of unique addresses transacting.
    - MVRV: Market Value / Realised Value (cost basis) as valuation metric.
  - [ ] 21.11.4 **Implementation & Application** — On-chain data providers (Glassnode, Coin Metrics); supply-side signals.
- [ ] **21.12 Crypto Risk Management** — Unique challenges.
  - [ ] 21.12.1 **Prose/Intuition** — Exchange risk (hacks, insolvency); regulatory risk; technical risk (smart contract bugs); operational complexity.
  - [ ] 21.12.2 **Visual Evidence** — Exchange failures (Mt. Gox, FTX), flash crash examples.
  - [ ] 21.12.3 **Mathematical Derivation** —
    - Counterparty risk: limit exposure per exchange.
    - Position sizing: account for higher volatility, wider tails.
    - Liquidity risk: slippage models for crypto markets.
    - Cold storage vs hot wallet trade-off: security vs operational flexibility.
  - [ ] 21.12.4 **Implementation & Application** — Risk management framework for crypto; survival in crypto markets requires operational discipline.
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
  - [ ] 22.1.1 **Prose/Intuition** — Spurious correlations don't persist; understanding mechanism improves prediction; data mining finds patterns that don't generalise.
  - [ ] 22.1.2 **Visual Evidence** — Spurious correlation examples (Nicholas Cage movies vs drownings), data mining illustrations.
  - [ ] 22.1.3 **Mathematical Derivation** —
    - Confounding: Z affects both X and Y, creates spurious correlation.
    - Selection bias: conditioning on a collider creates spurious association.
    - Reverse causation: Y may cause X, not vice versa.
    - DAGs: X → Y vs X ← Z → Y, graphical representation of causal structure.
  - [ ] 22.1.4 **Implementation & Application** — Identifying potential confounders; why understanding mechanism improves strategy persistence.
- [ ] **22.2 The Potential Outcomes Framework** — Formalising causation.
  - [ ] 22.2.1 **Prose/Intuition** — Rubin causal model; define causal effect as comparison of potential outcomes; fundamental problem: only observe one outcome per unit.
  - [ ] 22.2.2 **Visual Evidence** — Treatment/control comparison, counterfactual visualisation.
  - [ ] 22.2.3 **Mathematical Derivation** —
    - Potential outcomes: Y_i(1) = outcome if treated, Y_i(0) = outcome if not treated.
    - Individual treatment effect: τ_i = Y_i(1) - Y_i(0) (unobservable).
    - Average treatment effect: ATE = E[Y(1) - Y(0)].
    - SUTVA: no interference, no hidden variations of treatment.
    - Ignorability: (Y(0), Y(1)) ⊥ T | X (conditional on X, treatment is as good as random).
  - [ ] 22.2.4 **Implementation & Application** — Potential outcomes notation; estimating causal effect of signals on returns.
- [ ] **22.3 Natural Experiments in Finance** — Quasi-experimental designs.
  - [ ] 22.3.1 **Prose/Intuition** — Nature sometimes provides random variation; exploit institutional rules, threshold effects; stronger causal claims than pure correlations.
  - [ ] 22.3.2 **Visual Evidence** — Index addition event studies, analyst coverage discontinuities.
  - [ ] 22.3.3 **Mathematical Derivation** —
    - Difference-in-differences: τ = (Y_treat,post - Y_treat,pre) - (Y_control,post - Y_control,pre).
    - Parallel trends assumption: absent treatment, groups would have evolved similarly.
    - Event study: Y_t = α + Σβ_τ × 1(t = event + τ) + ε.
  - [ ] 22.3.4 **Implementation & Application** — DiD estimation in R; testing factor causality vs correlation.
- [ ] **Quick Reference** — Causal inference concepts.

### Part 2 (`22-2`): Causal Methods

- [ ] **22.4 Instrumental Variables** — Finding exogenous variation.
  - [ ] 22.4.1 **Prose/Intuition** — Find variable Z that affects X but only affects Y through X; isolates causal effect; instrument must be relevant and exogenous.
  - [ ] 22.4.2 **Visual Evidence** — IV diagram, first-stage strength, exclusion restriction.
  - [ ] 22.4.3 **Mathematical Derivation** —
    - Model: Y = α + βX + ε, where X is endogenous.
    - Instrument requirements: Cov(Z, X) ≠ 0 (relevance), Cov(Z, ε) = 0 (exclusion).
    - 2SLS: Stage 1: X̂ = γZ, Stage 2: Y = α + βX̂ + u.
    - IV estimator: β_IV = Cov(Z, Y) / Cov(Z, X).
    - Weak instrument: F-statistic in first stage should be > 10.
  - [ ] 22.4.4 **Implementation & Application** — IV regression in R (`ivreg`); testing signal causality.
- [ ] **22.5 Propensity Score Methods** — Creating comparable groups.
  - [ ] 22.5.1 **Prose/Intuition** — Balance observable characteristics between treated and control; propensity score summarises confounders in single number; enables comparison of "similar" units.
  - [ ] 22.5.2 **Visual Evidence** — Covariate balance before/after matching.
  - [ ] 22.5.3 **Mathematical Derivation** —
    - Propensity score: e(X) = P(T = 1 | X), probability of treatment given covariates.
    - Matching: pair treated unit with control unit with similar e(X).
    - IPW (inverse probability weighting): weight by 1/e(X) for treated, 1/(1-e(X)) for control.
    - Doubly robust: combine regression and IPW for protection against misspecification.
  - [ ] 22.5.4 **Implementation & Application** — Propensity score matching in R (`MatchIt`); evaluating strategy performance controlling for confounders.
- [ ] **22.6 Regression Discontinuity** — Exploiting thresholds.
  - [ ] 22.6.1 **Prose/Intuition** — Sharp cutoffs in assignment rules create quasi-experiments; compare units just above vs just below threshold; index inclusion is classic finance example.
  - [ ] 22.6.2 **Visual Evidence** — RD plots, discontinuity at threshold.
  - [ ] 22.6.3 **Mathematical Derivation** —
    - Sharp RD: treatment determined by X > c (running variable crosses threshold).
    - Effect: τ = lim_{x↓c} E[Y|X=x] - lim_{x↑c} E[Y|X=x].
    - Local linear regression: fit separate lines on each side of cutoff.
    - Bandwidth selection: trade-off bias vs variance.
  - [ ] 22.6.4 **Implementation & Application** — RD analysis in R (`rdrobust`); index inclusion effects; Russell 2000 reconstitution.
- [ ] **Quick Reference** — Causal method comparison.

### Part 3 (`22-3`): Model Robustness

- [ ] **22.7 Regime Detection** — Markets change.
  - [ ] 22.7.1 **Prose/Intuition** — Market behaviour differs across regimes (bull/bear, high/low vol); single model may not fit all regimes; detecting regime is valuable but difficult.
  - [ ] 22.7.2 **Visual Evidence** — Regime classification over time, conditional performance by regime.
  - [ ] 22.7.3 **Mathematical Derivation** —
    - Hidden Markov Model: observed Y_t depends on hidden state S_t.
    - Transition matrix: P(S_t = j | S_{t-1} = i) = p_{ij}.
    - Emission: P(Y_t | S_t = k) = f_k(Y_t).
    - Forward-backward algorithm: compute P(S_t = k | Y_1, ..., Y_T).
    - Markov switching regression: β_t depends on unobserved regime.
  - [ ] 22.7.4 **Implementation & Application** — Regime detection with HMM in R (`depmixS4`); regime-adaptive strategy sizing.
- [ ] **22.8 Structural Breaks** — When relationships change.
  - [ ] 22.8.1 **Prose/Intuition** — Past performance doesn't guarantee future; relationships can break; need to detect when parameters have changed.
  - [ ] 22.8.2 **Visual Evidence** — Break detection visualisation, rolling coefficient plots.
  - [ ] 22.8.3 **Mathematical Derivation** —
    - Chow test: F-test comparing SSR of pooled vs separate regressions.
    - CUSUM: cumulative sum of recursive residuals, detect departure from stability.
    - Bai-Perron: multiple structural break detection, allows unknown break dates.
    - Test statistic: sup_τ |test(τ)| over possible break points.
  - [ ] 22.8.4 **Implementation & Application** — Structural break tests in R (`strucchange`); deciding when to retrain or stop a strategy.
- [ ] **22.9 Model Uncertainty** — How wrong are you?
  - [ ] 22.9.1 **Prose/Intuition** — All models are wrong, some are useful; quantify uncertainty about model itself, not just parameters; model averaging hedges model risk.
  - [ ] 22.9.2 **Visual Evidence** — Prediction intervals, model comparison, posterior model probabilities.
  - [ ] 22.9.3 **Mathematical Derivation** —
    - Bayesian model averaging: P(Y|data) = Σ_k P(Y|M_k, data) × P(M_k|data).
    - Posterior model probability: P(M_k|data) ∝ P(data|M_k) × P(M_k).
    - Ensemble methods: average predictions across multiple models.
    - Prediction interval vs confidence interval: CI for E[Y], PI for Y itself.
  - [ ] 22.9.4 **Implementation & Application** — Model uncertainty quantification; sizing positions by confidence level.
- [ ] **22.10 Building Robust Strategies** — Surviving regime changes.
  - [ ] 22.10.1 **Prose/Intuition** — Robustness often beats in-sample optimisation; simple, diversified strategies survive longer; avoid over-fitting to specific regimes.
  - [ ] 22.10.2 **Visual Evidence** — Robust vs optimised strategy OOS performance comparison.
  - [ ] 22.10.3 **Mathematical Derivation** —
    - Worst-case optimisation: max_w min_scenario E[U(w, scenario)].
    - Minimax regret: min_w max_scenario [best_return(scenario) - return(w, scenario)].
    - Regime diversification: performance across multiple historical regimes.
    - Sensitivity analysis: ∂performance/∂parameter for key parameters.
  - [ ] 22.10.4 **Implementation & Application** — Robust strategy construction; checklist for strategy robustness testing.
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
  - [ ] 23.1.1 **Prose/Intuition** — Systematic approach to finding edges; academic literature, practitioner insights, data exploration; idea funnel with high rejection rate.
  - [ ] 23.1.2 **Visual Evidence** — Idea funnel diagram, success rates by source.
  - [ ] 23.1.3 **Mathematical Derivation** — Process focus; expected value framework for research time allocation; prior probability of idea success.
  - [ ] 23.1.4 **Implementation & Application** — Research log template; idea tracking system; sources of trading ideas (academic papers, market anomalies, data patterns).
- [ ] **23.2 Research Hygiene** — Avoiding self-deception.
  - [ ] 23.2.1 **Prose/Intuition** — Biases are everywhere; confirmation bias, overfitting, selection bias; discipline required to avoid self-deception.
  - [ ] 23.2.2 **Visual Evidence** — Common research mistakes illustrated.
  - [ ] 23.2.3 **Mathematical Derivation** —
    - Multiple testing correction: Bonferroni p_adj = p × m, FDR control.
    - Pre-registration: specify hypothesis before looking at data.
    - Holdout sample: never touch until final validation.
    - Deflation factor: expect OOS performance to be fraction of IS.
  - [ ] 23.2.4 **Implementation & Application** — Research protocol template; the research log discipline.
- [ ] **23.3 Documentation and Reproducibility** — Your future self will thank you.
  - [ ] 23.3.1 **Prose/Intuition** — Code and results need to be reproducible; documentation enables collaboration and debugging; version control tracks changes.
  - [ ] 23.3.2 **Visual Evidence** — Good vs bad documentation examples.
  - [ ] 23.3.3 **Mathematical Derivation** — Engineering focus; no statistical derivations; emphasis on workflow and tooling.
  - [ ] 23.3.4 **Implementation & Application** — R Markdown for reproducible research; git for version control; documenting strategies for production handoff.
- [ ] **Quick Reference** — Research process checklist.

### Part 2 (`23-2`): Production Considerations

- [ ] **23.4 From Research to Production** — Crossing the divide.
  - [ ] 23.4.1 **Prose/Intuition** — Research code is not production code; different requirements (reliability, speed, monitoring); phased deployment reduces risk.
  - [ ] 23.4.2 **Visual Evidence** — Research vs production architecture diagrams.
  - [ ] 23.4.3 **Mathematical Derivation** — Engineering focus; reliability metrics (uptime, MTBF); latency requirements by strategy type.
  - [ ] 23.4.4 **Implementation & Application** — Code refactoring checklist; unit testing; phased deployment (paper → small capital → full size).
- [ ] **23.5 Monitoring and Alerting** — Knowing when things go wrong.
  - [ ] 23.5.1 **Prose/Intuition** — Early detection prevents disaster; automated alerts for anomalies; human judgment for intervention decisions.
  - [ ] 23.5.2 **Visual Evidence** — Dashboard examples, alert notification flow.
  - [ ] 23.5.3 **Mathematical Derivation** —
    - Anomaly detection: flag if metric deviates > k standard deviations.
    - Control charts: upper/lower control limits UCL = μ + 3σ.
    - CUSUM: cumulative deviation from expected value.
    - P&L attribution: decompose returns by factor, position, timing.
  - [ ] 23.5.4 **Implementation & Application** — Monitoring system setup (Shiny dashboard); what to monitor (P&L, positions, fills, system health); intervention thresholds.
- [ ] **23.6 Continuous Improvement** — The strategy lifecycle.
  - [ ] 23.6.1 **Prose/Intuition** — Markets evolve, strategies must too; continuous improvement vs stability trade-off; knowing when to update vs retire.
  - [ ] 23.6.2 **Visual Evidence** — Strategy evolution timeline, version comparison.
  - [ ] 23.6.3 **Mathematical Derivation** —
    - A/B testing: run old and new versions simultaneously.
    - Statistical significance: need enough trades to detect difference.
    - Gradual rollout: increase allocation to new version as confidence grows.
  - [ ] 23.6.4 **Implementation & Application** — Continuous improvement framework; when to update parameters vs retire strategy entirely.
- [ ] **Quick Reference** — Production checklist.

### Part 3 (`23-3`): Career and Resources

- [ ] **23.7 Building a Track Record** — Proving your edge.
  - [ ] 23.7.1 **Prose/Intuition** — Track record is the ultimate credential; real money > paper trading > backtest; statistical significance of short track records is limited.
  - [ ] 23.7.2 **Visual Evidence** — Track record presentation formats, what allocators look for.
  - [ ] 23.7.3 **Mathematical Derivation** —
    - Required track length: n ≥ (z²σ²) / ε² for desired precision.
    - Sharpe significance: t = SR × √n, need t > 2 for statistical significance.
    - Probability of luck: P(SR > observed | true_SR = 0).
  - [ ] 23.7.4 **Implementation & Application** — Track record documentation; personal trading as proof of concept; presenting to allocators.
- [ ] **23.8 Resources and Continued Learning** — The journey continues.
  - [ ] 23.8.1 **Prose/Intuition** — This field evolves rapidly; continuous learning required; academic and practitioner resources complement each other.
  - [ ] 23.8.2 **Visual Evidence** — Resource landscape, learning paths by specialty.
  - [ ] 23.8.3 **Mathematical Derivation** — Resource focus; no statistical derivations.
  - [ ] 23.8.4 **Implementation & Application** — Curated reading list; conferences and communities; staying current with research.
- [ ] **23.9 Course Summary** — What you've learned.
  - [ ] 23.9.1 **Part I Recap** — Foundations: data, returns, risk metrics, backtesting, position sizing, core strategies (trend, mean reversion, factors, volatility), portfolio construction, live trading.
  - [ ] 23.9.2 **Part II Recap** — Advanced: ML, microstructure, alternative data (satellite, sentiment, transaction, regulatory, ESG), options, less efficient markets, causal inference, robustness.
  - [ ] 23.9.3 **Next Steps** — Specialisation paths; building your own research programme; continuous improvement mindset.
- [ ] **Quick Reference** — Complete course reference card.

---

# Appendix A: LLM API Workflows for Trading

*Practical guide to using LLMs as trading tools — no maths, just APIs.*

**Files:**
- `appendix-a_financial-statistics-2-advanced_llm-workflows.Rmd`

This appendix provides practical recipes for using LLM APIs (OpenAI, Anthropic) to extract trading signals from text. Implementation-focused — API calls, prompt engineering, and workflow automation.

- [ ] **A.1 Setting Up LLM APIs** — Getting started.
  - [ ] A.1.1 **Prose/Intuition** — LLMs as text processing tools; API-based approach avoids ML complexity.
  - [ ] A.1.2 **Implementation** — OpenAI and Anthropic API setup, authentication, cost estimation.
  - [ ] A.1.3 **Application** — Error handling, retries, rate limit management.
- [ ] **A.2 Prompt Engineering for Finance** — Crafting effective prompts.
  - [ ] A.2.1 **Prose/Intuition** — Prompt design principles; specificity, examples, output format specification.
  - [ ] A.2.2 **Implementation** — Sentiment extraction, entity extraction, summarisation prompts.
  - [ ] A.2.3 **Application** — Earnings call analysis, news classification, SEC filing parsing.
- [ ] **A.3 Structured Output** — Getting machine-readable results.
  - [ ] A.3.1 **Prose/Intuition** — JSON formatting enables automation; validation catches errors.
  - [ ] A.3.2 **Implementation** — JSON schema specification, scoring scales, numeric output.
  - [ ] A.3.3 **Application** — Validation pipelines, error handling, fallback strategies.
- [ ] **A.4 Batch Processing** — Scaling to many documents.
  - [ ] A.4.1 **Prose/Intuition** — Rate limits and costs constrain throughput; caching reduces redundancy.
  - [ ] A.4.2 **Implementation** — Rate limiting strategies, parallel processing, caching.
  - [ ] A.4.3 **Application** — Processing earnings call transcripts, news feeds, filing batches.
- [ ] **A.5 Example Workflows** — Complete pipelines.
  - [ ] A.5.1 **Earnings call sentiment** — Transcript → prompt → structured sentiment.
  - [ ] A.5.2 **News classification** — Article → bullish/bearish/neutral with confidence.
  - [ ] A.5.3 **SEC filing analysis** — 10-K → key metrics and risk factors.
  - [ ] A.5.4 **Social media aggregation** — Tweets → company-level sentiment scores.
- [ ] **Quick Reference** — LLM prompt templates.

---

# Appendix B: R Packages Reference

*Quick reference for all R packages used in this course.*

**Files:**
- `appendix-b_financial-statistics-2-advanced_r-packages.Rmd`

Each section lists packages with brief descriptions and common use cases. Code follows course conventions: `box::use()`, `data.table`, `ggplot2`.

- [ ] **B.1 Data Packages** — `quantmod` (Yahoo Finance), `Quandl` (various sources), `fredr` (FRED).
- [ ] **B.2 Time Series** — `xts`/`zoo` (time series objects), `data.table` (efficient manipulation), `lubridate` (dates).
- [ ] **B.3 Visualisation** — `ggplot2` (static plots), `plotly` (interactive), `highcharter` (financial charts).
- [ ] **B.4 Statistics** — `stats` (base), `boot` (bootstrapping), `sandwich` (robust SEs).
- [ ] **B.5 Econometrics** — `lmtest` (hypothesis tests), `urca` (unit roots), `vars` (VAR models), `rugarch` (GARCH).
- [ ] **B.6 Machine Learning** — `glmnet` (regularised regression), `randomForest`, `xgboost`, `keras` (neural nets).
- [ ] **B.7 Portfolio** — `PortfolioAnalytics` (optimisation), `PerformanceAnalytics` (risk metrics).
- [ ] **B.8 Web/API** — `rvest` (scraping), `httr`/`httr2` (HTTP), `jsonlite` (JSON parsing).
- [ ] **B.9 Text Analysis** — `quanteda` (text processing), `tidytext` (tidy text), `sentimentr` (sentiment).

---

# Appendix C: Data Sources and APIs

*Where to get the data you need.*

**Files:**
- `appendix-c_financial-statistics-2-advanced_data-sources.Rmd`

Comprehensive reference of data sources for quantitative trading research, with access details and limitations.

- [ ] **C.1 Free Data Sources** — Yahoo Finance (equities, ETFs), FRED (macro), Alpha Vantage (API-based), OpenBB (open-source terminal).
- [ ] **C.2 Academic Data** — WRDS (aggregator), CRSP (US equities), Compustat (fundamentals), TAQ (tick data) — university access required.
- [ ] **C.3 Broker APIs** — Interactive Brokers (TWS API), Alpaca (commission-free), Tradier — live trading integration.
- [ ] **C.4 Alternative Data Vendors** — Satellite (Planet, Orbital Insight), Sentiment (RavenPack, Alexandria), Transaction (Second Measure, Earnest).
- [ ] **C.5 Crypto Data** — CoinGecko (free), CryptoCompare (historical), exchange APIs (Binance, Coinbase) — live and historical.

---

*End of Table of Contents*
