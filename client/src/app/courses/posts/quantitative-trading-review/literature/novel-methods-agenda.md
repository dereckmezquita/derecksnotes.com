# Novel Methods — Research Agenda

> The signature contribution of this review is not the survey — it is *doing something new*: taking a method from another field that has not (or barely) been applied to finance and testing it rigorously for tradeable edge. This document is the experimental program: selection, per-method prototype plans, and data/infrastructure specs.

Candidates and their novelty-verification come from the cross-disciplinary scouts ([bio](cross-disciplinary/bio-method-transfers.md), [sciences](cross-disciplinary/sciences-method-transfers.md)); the selection rationale is in the [README executive summary](README.md), section 6.

## How every candidate is judged

Novelty earns nothing on its own. Each method is run through the same honesty machinery the review applies to everyone: a **strong classical baseline**, realistic **transaction costs and capacity**, the **deflated Sharpe ratio** (corrected for the number of variants tried), and **combinatorial purged cross-validation** (no look-ahead). A candidate counts only if its edge survives all four. The deliverable is a cost-net, deflated-Sharpe, purged-CV verdict per method — and being first to publish the honest result, positive or negative. Near-efficiency means most candidates will be marginal; that is expected, not a failure.

## Selection

- **Most interesting (novelty):** entropy production / time-irreversibility; branching-ratio criticality; Box-Least-Squares period search.
- **Most likely to give edge:** cyclostationary / FRESH filtering; lfsr adaptive shrinkage; branching-ratio criticality.
- **Single best bet:** branching-ratio criticality — fascinating *and* practical.

## Phased plan

- **Phase 0 — cheap wins on data we already have** (days each, CPU-only): lfsr shrinkage; covariate-adaptive FDR; LIM/POP; Whittle index.
- **Phase 1 — start the data clock + flagship experiments:** begin crypto tick/LOB capture *now*; build the cyclostationary and criticality pipelines as history accrues.
- **Phase 2 — data-rich, higher effort:** entropy production (order book); Box-Least-Squares.

## Data infrastructure

Crypto is the cheat-code for the data-hungry methods: the in-house exchange wrappers (`binance`, `coinbase`, `kucoin`, `hyperliquid`) pull **free tick and full order-book depth**, so the high-frequency methods are feasible without paying equity-tick vendors. Capture lands in a partitioned columnar store (Parquet → DuckDB/ClickHouse) keyed by symbol and session; the C++ layer (`tradebot-hpfi`) does the heavy numerics; `tradebot-bt` provides cost- and slippage-realistic backtests; `assert`/`roxyassert` guard the pipeline. **Start tick/LOB capture immediately** — this data only accrues going forward, so every day of delay is a day of history we never recover. Equities tick (via `alpaca` or a vendor) is the fallback for generalising beyond crypto.

---

## Phase 0 — cheap wins

### lfsr adaptive shrinkage — *genomics empirical Bayes*
- **Source:** Stephens (2016), *False discovery rates: a new deal*; R package `ashr`.
- **Hypothesis:** sizing positions by the probability the *direction* is correct (local false-sign rate) beats two-sided significance filtering and naive sizing, lifting a market-neutral book's net Sharpe.
- **Mapping:** thousands of genes with noisy effect sizes ↔ a cross-section of names each with an expected-return estimate + standard error; lfsr ↔ P(sign is wrong).
- **Data:** **Low.** Per rebalance, a cross-section of expected returns and their standard errors from the existing signal stack. Daily, hundreds–thousands of names. Megabytes.
- **Prototype:** pipe the current signal's per-name mean + SE into `ashr`; size by posterior mean; trade only names with lfsr below a threshold; compare to current sizing on the *same* signal.
- **Validation:** net-of-cost Sharpe vs current sizing; turnover; deflated Sharpe across thresholds.
- **Effort / risk:** ~days. Lowest risk in the program — a sizing/selection upgrade, not a new alpha.

### Covariate-adaptive FDR (IHW / AdaPT) — *genomics multiple testing*
- **Source:** Ignatiadis et al. (2016) IHW; Lei & Fithian (2018) AdaPT.
- **Hypothesis:** letting an informative covariate (capacity, turnover, theory-backing, data vintage) reweight each strategy's significance hurdle keeps better strategies than a flat *t*-bar at the same FDR.
- **Mapping:** gene tests with informative covariates ↔ candidate strategies with metadata.
- **Data:** **Low.** A table of strategy t-stats / p-values + covariates — outputs already produced.
- **Prototype:** apply `IHW` to strategy-selection p-values with capacity/turnover as covariate; compare the surviving set and its OOS performance to the flat Harvey-Liu-Zhu bar.
- **Validation:** OOS performance of the selected set; realized FDR on held-out strategies.
- **Effort / risk:** ~days. Near-free process upgrade.

### LIM / POP (Linear Inverse Model / Principal Oscillation Patterns) — *ENSO climate forecasting*
- **Source:** Penland & Sardeshmukh (1995).
- **Hypothesis:** a calibration-free linear propagator estimated from one contemporaneous + one lag-1 covariance gives robust multi-horizon forecasts of a factor/return panel, and its "optimal precursor" (fastest-growing initial condition) is a tradeable signal.
- **Mapping:** a sea-surface-temperature field evolving toward El Niño ↔ a return/factor panel evolving toward a regime; optimal precursor ↔ the portfolio most likely to grow.
- **Data:** **Low–med.** Daily/weekly panel of returns or factor returns; hundreds of series × thousands of obs.
- **Prototype:** estimate the propagator on a factor panel; forecast h-step factor returns; build the optimal-precursor portfolio; baseline against VAR(1) and prevailing-mean.
- **Validation:** OOS forecast skill vs VAR/mean; precursor-portfolio Sharpe net of costs.
- **Effort / risk:** ~1–2 weeks. Robust by construction (few parameters), which is exactly why it may survive OOS where fitted models decay.

### Whittle index for restless bandits — *operations research*
- **Source:** Whittle (1988); Akbarzadeh & Mahajan (2022).
- **Hypothesis:** allocating capital/risk budget across many edges whose quality *mean-reverts whether or not you trade them* beats stateless bandit or equal allocation.
- **Mapping:** restless machines whose state drifts when idle ↔ strategies whose alpha decays and regenerates.
- **Data:** **Low.** A panel of per-strategy PnL/Sharpe over time to fit each arm's state dynamics.
- **Prototype:** model each strategy's alpha as a mean-reverting latent state; compute Whittle indices; backtest dynamic budget allocation vs equal-weight and vol-targeting.
- **Validation:** portfolio-of-strategies Sharpe net of switching costs.
- **Effort / risk:** ~1–2 weeks.

---

## Phase 1 — flagship experiments (start data capture now)

### Cyclostationary / FRESH filtering — *radar / communications*
- **Source:** Gardner (1991); Hecq, Laurent & Palm (2006).
- **Hypothesis:** markets are genuinely cyclostationary (open/close, auctions, options expiry, perp funding resets), and cyclic-spectrum / frequency-shift (FRESH) filters are near-optimal linear predictors of the periodic component — an intraday and execution-timing edge that stationary models (ARMA/GARCH) average away.
- **Mapping:** a radio carrier imposing a known period ↔ the trading-session/settlement calendar; cyclic-spectrum peak at cycle frequency ↔ strength of a tradable seasonal; FRESH filter ↔ using phase to predict the conditional mean.
- **Data:** **High.** Multi-year intraday **tick or 1-min** bars, timestamped to session phase, multi-asset; crypto adds 24/7 funding cycles. 1-min across ~50 crypto pairs over 3 yrs ≈ low-GB; tick ≈ tens–hundreds of GB.
- **Prototype:** estimate the cyclic spectrum of returns/volatility per asset; identify significant cycle frequencies; build a FRESH predictor of the periodic conditional mean (Rcpp/FFT); trade and execute against it; baseline against time-of-day dummies and HAR.
- **Validation:** OOS intraday forecast skill and execution-cost reduction vs dummies; deflated Sharpe; capacity.
- **Effort / risk:** ~3–4 weeks once data exists. Real mechanism → most likely genuinely-new signal; capacity-limited.

### Branching-ratio criticality under subsampling — *neuroscience*
- **Source:** Wilting & Priesemann (2018), *Inferring collective dynamical states from widely unobserved systems*.
- **Hypothesis:** the market's self-excitation (branching ratio *m*) — recoverable even from a *subsampled* view (your own fills, one venue) — gauges distance to criticality; *m* → 1 marks fragile, cascade-prone regimes where you should de-gross and widen market-making.
- **Mapping:** subsampled neuronal avalanches ↔ partially-observed order/trade flow; *m* ↔ how strongly each event begets further events.
- **Data:** **Med.** Event-level trade/fill timestamps. The subsampling-robustness is the point: *your own fills or one venue's trade prints suffice* — the full firehose is not required. Manageable.
- **Prototype:** implement the multistep-regression (MR) estimator in Rcpp on trade-event series; track *m*(t); test whether high *m* predicts realized cascade/volatility and degrades passive market-making PnL; build a de-gross / regime overlay.
- **Validation:** does the overlay improve net Sharpe / reduce drawdown vs always-on; event study around known flash crashes.
- **Effort / risk:** ~3–4 weeks. **Best single bet** — a practical risk/timing edge with a clean mechanism and modest data.

---

## Phase 2 — data-rich

### Entropy production / time-irreversibility — *stochastic thermodynamics*
- **Source:** Flanagan & Lacasa (2016); Gnesotto et al. (2018).
- **Hypothesis:** broken detailed balance (time-irreversibility) in multivariate price/volume or order-book trajectories is a model-free non-equilibrium regime gauge — rising irreversibility favours momentum and is hostile to passive market-making — and is largely decorrelated from realized volatility, so it adds new information.
- **Data:** **Med → High.** Multivariate price+volume (med) up to full LOB snapshots (high, TB-scale). Start coarse, escalate to LOB.
- **Prototype:** estimate entropy production via horizontal-visibility-graph irreversibility (coarse) and trajectory methods (LOB), in Rcpp; test conditioning of momentum vs market-making strategies on the regime; verify decorrelation from RV.
- **Validation:** incremental value when conditioning existing strategies; deflated Sharpe.
- **Effort / risk:** ~4–6 weeks; storage-heavy for LOB. High interest, medium confidence.

### Box-Least-Squares / Transit-Least-Squares — *astrophysics (exoplanets)*
- **Source:** Kovács, Zucker & Mazeh (2002); Hippke & Heller (2019).
- **Hypothesis:** brief, faint, low-duty-cycle recurrences (scheduled-event footprints, recurring liquidity holes) are optimally detected by folding at thousands of trial periods and fitting an inverted top-hat — patterns Fourier / Lomb-Scargle smear away.
- **Data:** **Med–high.** Long intraday history; benefits from years of 1-min/tick.
- **Prototype:** run BLS/TLS over return/volume/spread series at fine period grids; characterise detected "transits"; test forward-return/execution conditioning around them; guard hard against multiple testing (the huge period grid is the trial count — deflated Sharpe is essential).
- **Validation:** OOS recurrence of detected periods; deflated Sharpe with grid size as the trial count.
- **Effort / risk:** ~3–4 weeks; embarrassingly parallel (GPU-friendly). Novel; overfitting is the main hazard, mitigated by DSR.

---

## Also on the bench (lower priority or more established)

- **Random-matrix-theory correlation cleaning** (statistical physics) — powerful but already partly adopted in finance; treat as a portfolio-construction baseline rather than a novel bet.
- **Directed information / Massey** (information theory) — a cleaner causal-flow measure than transfer entropy, with a portfolio-growth theorem (Permuter-Kim-Weissman 2009); promising, but inference is data-hungry.
- **Effective reproduction number Rt / EpiEstim** (epidemiology) — an interpretable cousin of the branching-ratio method; fold in if criticality shows promise.
