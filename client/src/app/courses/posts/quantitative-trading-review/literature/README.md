# Quantitative Trading Review — research hub

Central document for the review. Four research workflows complete; **296 papers + 179 cross-disciplinary method candidates gathered and triaged — not yet deep-read.**

# Executive Summary: Quantitative Trading Literature Review

**Status: papers gathered, not yet deep-read.** What follows is an editor's triage of roughly 150 references across six domains — market efficiency and return distributions; volatility, tail risk and the variance risk premium; covariance estimation and portfolio construction; the cross-section, statistical arbitrage and microstructure; backtest evaluation and the replication crisis; LLMs and foundation models for time series; and cross-disciplinary method transfers from physics, genomics, climate science, neuroscience and engineering. It covers the full pipeline from "is there a signal at all" to "does it survive costs and multiple testing." The headline tension running through every section is that markets are *near*-efficient (Grossman-Stiglitz, not Fama-absolute): there is just enough inefficiency to pay for the arbitrage that removes it, so most published edges are real-but-decaying, capacity-limited, or artifacts of data-snooping — and the honest job is separating the thin durable residue from the hype. These are preliminary characterizations subject to revision on deep reading.

> **Plain English:** Most "ways to beat the market" don't really work once you account for luck, fees, and people quietly trying thousands of ideas until one looks good. Below is our sorted pile: what's junk, what's solid, what's cutting-edge, what's clever, where a little real money might be, and a few odd tricks from other sciences that nobody has tried on markets yet. Each point has a plain-English line under it.

## 1. What is NOT useful (debunked, fragile, or hype)
- **Frozen-LLM zero-shot forecasting** — ablating or removing the frozen language model leaves accuracy unchanged at a fraction of the cost; "language transfers to numbers" fails (Tan et al. 2024; cf. Gruver et al. 2023, Zhou et al. 2023, Jin et al. 2024).
  - *Plain English:* Bolting a ChatGPT-style model onto price prediction adds nothing — pull the AI out and the forecast is just as good. You're paying for a brain that isn't doing the work.
- **LLM trading-agent backtests as reported** — cost-blind and irreproducible; FinMem's +23.26% flips to -22.04% under an equally-defensible window with costs (Xia et al. 2026; cf. Yu et al. 2024).
  - *Plain English:* When an AI "trading bot" brags about big profits, redo the test fairly (with fees, different dates) and the profit becomes a loss. The brag was rigged.
- **The raw factor zoo at t>2** — 65% of 452 anomalies die under NYSE breakpoints/value-weighting; the correct hurdle is ~3.0+ (Hou-Xue-Zhang 2020; Harvey-Liu-Zhu 2016).
  - *Plain English:* Academics have published hundreds of "magic stock-picking signals." Most are just coincidences — raise the standard a notch and they evaporate.
- **Technical trading rules under data-snooping correction** — apparent profitability of ~8,000 rules largely vanishes once you adjust for the search universe (Sullivan-Timmermann-White 1999; Bajgrowicz-Scaillet 2012).
  - *Plain English:* "Buy when the chart makes this squiggle" stops making money once you remember people tried thousands of squiggles and kept the lucky one.
- **Strict/absolute EMH and the infinite-variance stable-Paretian return law** — perfect efficiency is logically impossible and the Lévy-stable α<2 claim is rejected by the inverse-cubic law (tail index ~3, finite variance) (Grossman-Stiglitz 1980; Plerou et al. 1999; Jansen-de Vries 1991).
  - *Plain English:* Two old textbook beliefs — "prices are always perfectly correct" and "crashes are infinitely wild" — are both simply wrong.
- **Single-path historical backtest / walk-forward as primary validation** — one path gives no distribution of outcomes and walk-forward overfits worst in ground-truth tests (López de Prado 2018; Arian-Norouzi-Seco 2024).
  - *Plain English:* Testing a strategy on the one history that happened tells you almost nothing — like calling a coin "lucky" after a single flip.
- **Generic zero-shot TSFMs on price data + benchmark contamination** — off-the-shelf foundation models are matched or beaten by ARIMA/DLinear, and pretraining-corpus overlap inflates "zero-shot" gains from ~0.3-14% to an illusory 47-184% (Shi et al. 2026; Meyer et al. 2025).
  - *Plain English:* Big general-purpose "forecasting AIs" don't beat a simple decades-old formula on market data — and their headline wins came from accidentally practising on the exam.
- **Naive ML cross-sectional alpha at face value** — gross deep-learning Sharpe concentrates in microcaps, distress and high-vol states; net of costs and turnover the edge largely evaporates (Avramov-Cheng-Metzker 2023).
  - *Plain English:* AI stock-picking looks brilliant on paper, but the gains hide in tiny, expensive-to-trade stocks and disappear once you pay the trading costs.
- **Single-series critical-slowing-down crash early-warnings** — no robust critical slowing down before major crashes despite rising variance (Guttal et al. 2016; Diks-Hommes-Wang 2019).
  - *Plain English:* The "physics smoke-alarm" that's supposed to beep before a crash doesn't actually beep before real crashes.
- **Naive t>2 / flat 50% Sharpe haircut** — correct thresholds are ~3.4-3.8 and combining insignificant signals manufactures spurious t-stats (Chordia-Goyal-Saretto 2020; Novy-Marx 2016).
  - *Plain English:* The usual "is this real?" pass-mark is far too easy in finance, and stapling together weak signals can fake a strong one.

## 2. What IS useful (established and works)
- **Multiple-testing backtest spine: Reality Check / SPA / Romano-Wolf stepwise** — if a strategy search doesn't pass one of these, you don't have a result (White 2000; Hansen 2005; Romano-Wolf 2005).
  - *Plain English:* Before believing a strategy, run the test that asks "could this just be the luckiest of all the things I tried?" If it can't pass, you have nothing.
- **Deflated Sharpe Ratio + PBO/CSCV and minimum-backtest-length** — model-free honesty checks that correct Sharpe for trial count, track length and non-normality (Bailey-López de Prado 2014; Bailey-Borwein-López de Prado-Zhu 2014/2016).
  - *Plain English:* Math that lowers your "how good is it?" score to account for how many ideas you tried and how short your test was. An honesty discount.
- **GARCH family + realized-volatility/HAR paradigm** — GARCH(1,1) and HAR-RV are the baselines almost nothing beats out-of-sample (Engle 1982; Bollerslev 1986; Andersen-Bollerslev-Diebold-Labys 2003; Corsi 2009).
  - *Plain English:* Simple, trusted recipes for guessing how wild a price will get. They're so good that fancy methods rarely beat them — use them as the yardstick.
- **Ledoit-Wolf covariance shrinkage (analytical nonlinear default)** — the de facto fix for high-dimensional Markowitz; closed-form, always well-conditioned, ~1000x faster than QuEST (Ledoit-Wolf 2004; 2020).
  - *Plain English:* A reliable way to clean the noisy "how do these assets move together" numbers so a portfolio built on them doesn't blow up.
- **1/N as the bar optimization must clear** — equal-weighting beats most "optimized" portfolios because estimation error swamps optimization gains (DeMiguel-Garlappi-Uppal 2009; El Karoui 2010).
  - *Plain English:* Just splitting your money equally beats most "clever" portfolios. So any clever method has to beat equal-splitting or it's pointless.
- **Fama-MacBeth and FF/Carhart/q-factor benchmarks** — the standard inferential workhorse and the alpha hurdle every signal is tested against (Fama-MacBeth 1973; Fama-French 2015; Hou-Xue-Zhang 2015; Barillas-Shanken 2018).
  - *Plain English:* The standard rulers everyone uses to check whether your stock signal is genuinely special or just ordinary risk in disguise.
- **Cont's stylised facts** — the canonical validation target (fat tails, vol clustering, no return autocorrelation, leverage effect) every return model must reproduce (Cont 2001; Ratliff-Crain et al. 2023).
  - *Plain English:* A checklist of how real markets actually behave (big surprise moves, calm spells then stormy spells). If your model can't reproduce these, it's wrong.
- **Microstructure core: Kyle / Glosten-Milgrom / Almgren-Chriss + square-root impact law + OFI** — battle-tested price-formation, spread, execution and short-horizon-prediction infrastructure (Kyle 1985; Glosten-Milgrom 1985; Almgren-Chriss 2001; Toth et al. 2011; Cont-Kukanov-Stoikov 2014).
  - *Plain English:* The proven plumbing for how prices get set, what trading costs you, and how to buy a lot without shoving the price against yourself.
- **Variance-ratio test battery** — the standard random-walk-null machinery; Lo-MacKinlay alone is incomplete, so pair with Chow-Denning, Wright and Kim's wild-bootstrap (Lo-MacKinlay 1988; Chow-Denning 1993; Wright 2000; Kim 2009).
  - *Plain English:* The standard tests for "is this price just drifting randomly, or is there a pattern?" Use several versions together, not only the original.
- **FDR/post-publication-decay discipline** — ~75% of funds have zero net alpha and 97 predictors are 58% weaker post-publication; budget for it before trusting any signal (Barras-Scaillet-Wermers 2010; McLean-Pontiff 2016; Feng-Giglio-Xiu 2020).
  - *Plain English:* Most fund managers have no real skill, and a published edge gets roughly half as strong once everyone knows it. Expect that before trusting anything.

## 3. State of the art
- **End-to-end deep statistical arbitrage with conditional latent factors** — jointly learning factors and the cost-aware trading policy; "Attention Factors" reports OOS Sharpe >4 (2.3 net of costs), subsuming classical PCA/OU statarb (Epstein-Wang-Choi-Pelger 2025; Guijarro-Ordonez-Pelger-Zanotti 2021).
  - *Plain English:* New AI that finds hidden "twin" assets and learns how to trade them apart-and-back-together, fees included — and it reportedly works well even after costs.
- **Economically-disciplined deep asset pricing (SDF + IPCA/autoencoder)** — imposing the no-arbitrage restriction inside flexible nets lowers pricing errors and resolves the characteristics-vs-covariances debate (Chen-Pelger-Zhu 2024; Kelly-Pruitt-Su 2019; Gu-Kelly-Xiu 2021).
  - *Plain English:* AI that's forced to obey the "no free lunch" rule of economics, which makes it both more accurate and more trustworthy.
- **Combinatorial Purged Cross-Validation with PBO/DSR ground-truth benchmarking** — the method to reach for when validating an ML trading model; beats walk-forward/K-fold in a known-edge synthetic shoot-out (Arian-Norouzi-Seco 2024; López de Prado 2018).
  - *Plain English:* The proper way to test an AI strategy so it can't secretly cheat by peeking at the future.
- **Rough volatility** — log-vol as fractional Brownian motion with H~0.1 fits the whole SPX surface with few parameters and the short-maturity skew classical models miss; now tractable (rough Heston, lifted/Markovian approximations, neural calibration) — though the roughness claim is contested as possible microstructure-noise artifact (Gatheral-Jaisson-Rosenbaum 2018; El Euch-Rosenbaum 2019; Horvath-Muguruza-Tomas 2021).
  - *Plain English:* A newer, very accurate model of how "jumpiness" itself wiggles. It matches option prices that older models get wrong.
- **Market-trained financial foundation models (Kronos, FinCast)** — pretrained from scratch on K-line/market data, they beat both general TSFMs and non-pretrained baselines — the only robustly positive LLM-finance signal, though rarely evaluated cost-net and leakage-free (Shi et al. 2026; Zhu-Chen-Qu-Chung 2025).
  - *Plain English:* AI built from scratch on actual price charts (not borrowed from language) is the one flavour of "AI for markets" that genuinely helps.
- **Leakage-free chronologically-consistent LLMs (ChronoBERT/ChronoGPT, DatedGPT)** — strictly time-partitioned training enables provably leakage-free backtests; predictive Sharpe is largely preserved, showing leakage is real but not always dominant (He-Lv-Manela-Wu 2025; Yan et al. 2026).
  - *Plain English:* AIs trained only on the past — never allowed to see the future — prove their results aren't cheating, and they still hold up.
- **ML volatility forecasting with cross-sectional pooling** — neural nets on a pooled multi-asset panel beat HAR at longer horizons, though parametric rough-vol can match them — frontier evidence, not a settled win (Zhang-Zhang-Cucuringu-Qian 2024; Christensen-Siggaard-Veliyev 2023).
  - *Plain English:* Train one AI across many assets at once and it predicts "jumpiness" better over longer stretches.
- **High-dimensional alpha testing robust to omitted factors** — valid when number of tests exceeds sample size, the regime real strategy/fund books actually live in (Giglio-Liao-Xiu 2021).
  - *Plain English:* A test that stays honest even when you're checking more strategies than you have data for — which is the situation real trading desks are actually in.

## 4. Potentially innovative
- **Shrinkage SDF / the virtue of complexity** — against the parsimony orthodoxy, a dense L2-regularized combination of many shrunk characteristics describes the cross-section better, and over-parameterization past the interpolation threshold helps OOS (Kozak-Nagel-Santosh 2020; Kelly-Malamud-Zhou 2024).
  - *Plain English:* Against the "keep it simple" rule, throwing in lots of gently-toned-down signals actually predicts better, not worse.
- **Selection-robust new-factor admission tests (double-LASSO / FDR)** — operationalizes the zoo critique into a gate: most newly proposed factors add nothing once the existing zoo and latent factors are controlled (Feng-Giglio-Xiu 2020; Giglio-Liao-Xiu 2021).
  - *Plain English:* A gate that asks "does your new signal add anything the hundreds of known ones didn't?" Usually the answer is no.
- **Patch tokenization + channel independence (PatchTST) and inverted attention (iTransformer)** — patching, not the language model, is the design that made Transformers competitive for time series again (Nie et al. 2023; Liu et al. 2024).
  - *Plain English:* Chopping a price series into little chunks (instead of treating it like sentences) is the actual trick that made AI forecasting good.
- **Hierarchical Risk Parity and its Schur-complement unification with min-variance** — clustering + recursive bisection avoids matrix inversion; HRP and full min-variance are now shown to be two ends of one tunable continuum (Lopez de Prado 2016; Cotton 2024).
  - *Plain English:* Group assets like a family tree to build a sturdier portfolio without fragile math — and it turns out to be the same idea as the classic method, just with a dial.
- **Robust covariance inputs: Gerber statistic and robust-Markowitz = regularized-Markowitz** — outlier-insensitive co-movement counting, and a proof that optimal-transport robustification collapses to Markowitz plus a closed-form regularizer (Gerber-Markowitz et al. 2022; Nguyen-Shafiee-Filipovic-Kuhn 2021).
  - *Plain English:* Ways to measure "do these move together" that shrug off freak one-off spikes instead of being fooled by them.
- **Forking-paths / multiverse analysis (t>8 bar)** — researcher degrees of freedom, not just trial count, inflate t-stats; the true 5% anomaly threshold is ≥8.2 (Coqueret 2023).
  - *Plain English:* Because researchers quietly try many versions of a test, the real bar for "this is a genuine discovery" is much higher than anyone admits.
- **Empirical-Bayes High-Throughput Asset Pricing** — inverts the debate: conservative FWE/FDR throws away genuine signal that EB shrinkage recovers with no look-ahead (Chen-Dim 2023; Chen 2022).
  - *Plain English:* Flips the usual worry: being too strict actually bins real signals; a gentler "nudge toward zero" recovers them without cheating.
- **Retrieval-augmented forecasting via analogue retrieval (RAFT/RAF/RATD)** — retrieve similar historical windows and feed their continuations; cheap and promising, but the financial RAG variant is the most leakage-sensitive (Han et al. 2025; Liu et al. 2024).
  - *Plain English:* Predict by looking up similar moments in history and seeing what happened next. Cheap and clever — but very easy to accidentally cheat with future data.
- **Anytime-valid testing via e-values / test-martingales** — confidence sequences valid under continuous monitoring and optional stopping; quants peek at live PnL constantly, which invalidates fixed-sample tests this fixes (Ramdas-Grünwald-Vovk-Shafer 2023).
  - *Plain English:* A scoreboard you're allowed to stare at constantly without breaking the statistics — perfect for traders who watch profit-and-loss all day.

## 5. Where the money plausibly is (potentially profitable, net of costs)
- **Variance risk premium as a short-horizon equity-premium predictor** — the implied-minus-realized variance gap dominates classic predictors at the quarterly horizon, is model-free and real-time, with a clear economic mechanism; the most credible predictability signal in the haul (Carr-Wu 2009; Bollerslev-Tauchen-Zhou 2009; Bekaert-Hoerova 2014).
  - *Plain English:* Fear is usually overpriced: the "insurance" baked into option prices tends to cost more than the danger it covers, so selling it pays. Our most believable edge.
- **Net-of-cost multi-anomaly combination portfolios** — the average anomaly survives costs but far smaller than in-sample; diversified factor exposure is real and warrants a small allocation (Chen-Velikov 2023; Jensen-Kelly-Pedersen 2023; McLean-Pontiff 2016).
  - *Plain English:* Each known signal is weak after fees, but bundling lots of them together gives a small, real return worth a modest bet.
- **Trend-following / time-series momentum as a crisis-hedging premium** — economically real and "good in bad times" despite the statistical critique of its original t-stats; deep attention/transformer implementations roughly double benchmark gross Sharpe (Moskowitz-Ooi-Pedersen 2012; Wood-Giegerich-Roberts-Zohren 2022; Lim-Zohren-Roberts 2019).
  - *Plain English:* What's been rising tends to keep rising a while, and this especially saves your bacon during crashes — a real, if modest, edge.
- **Out-of-sample equity-premium predictability via restrictions / forecast combination** — sign restrictions and predictor combination clear the prevailing-mean bar that single predictors fail, with countercyclical strength; thin margins, respect Stambaugh bias (Campbell-Thompson 2007; Rapach-Strauss-Zhou 2010; Welch-Goyal 2008).
  - *Plain English:* With careful tricks you can predict the market slightly better than just guessing the average — mostly in bad times. Thin, but real.
- **Domain-pretrained ML signals surviving net of costs** — ~57% of gross ML performance is destroyed by costs/decay, yet LSTM strategies retain net alpha up to ~1.42%/month, and GPT-sentiment long-short earns positive but microcap-bound, capacity-constrained returns (Azevedo-Hoegner-Velikov 2023; Lopez-Lira-Tang 2023; Avramov-Cheng-Metzker 2023).
  - *Plain English:* Fees wipe out about half of AI's paper profits, but a sliver of genuine edge survives — just don't expect to run big money through it.
- **Competing-risks trade-exit modelling (cause-specific & Fine-Gray hazards)** — treating stop / target / time-stop / signal-reversal as competing exits strictly extends triple-barrier labeling and lifts per-trade expectancy via state-conditional exit tuning (Fine-Gray 1999).
  - *Plain English:* Borrow a medical "what kills the patient first" method to decide when to close a trade (stop, target, time, reversal) — squeezing more out of each one.
- **Cointegration/OU statistical arbitrage machinery** — the reliable relative-value toolkit (cointegration spreads, PCA-residual OU, Kalman hedge ratios), but with documented post-2002 alpha decay — a framework, not a guaranteed edge (Engle-Granger 1987; Avellaneda-Lee 2010; Elliott-van der Hoek-Malcolm 2005).
  - *Plain English:* The classic "trade two linked assets when they drift apart, bet they snap back" toolkit — dependable framework, but the easy money has largely faded.

## 6. Novel opportunities — methods from other fields not yet applied to finance
- **Adaptive Shrinkage with local false-sign rate (ash/lfsr)** — *genomics empirical-Bayes.* Feed each name's expected return + standard error into ash to get a shrunk position size and the probability the *direction* is wrong; trade only names below an lfsr threshold. Controls exactly the loss a market-neutral book cares about (long-vs-short wrong), not two-sided significance; cheapest deploy in the haul and verified unused in finance (Stephens 2016).
  - *Plain English:* From gene science: size each bet by "how sure am I which way it goes?" and skip the coin-flips. It targets the only mistake that matters — betting the wrong direction. Cheapest thing here to try.
- **Linear Inverse Model / Principal Oscillation Patterns (LIM/POP)** — *ENSO climate forecasting.* Estimate a linear propagator from one covariance plus one lag-1 covariance of a return/factor panel for calibration-free multi-horizon forecasts plus a maximum-growth "optimal precursor" portfolio. Essentially no hyperparameters to overfit, which is why it is robust OOS where fitted VAR/ML decay (Penland-Sardeshmukh 1995).
  - *Plain English:* From the maths used to forecast El Niño: a near-knob-free way to forecast several steps ahead and to build a "most-likely-to-take-off" portfolio. Few settings means little to overfit.
- **Cyclostationary signal processing & FRESH filtering** — *communications/radar.* Markets are textbook cyclostationary (opens/closes, auctions, funding resets, expiries), yet finance uses only ad-hoc time-of-day dummies; cyclic-spectrum/FRESH filters are near-optimal linear predictors of the periodic component for an intraday/execution edge (Gardner 1991; Hecq-Laurent-Palm 2006).
  - *Plain English:* From radio/radar: markets run on clocks (open, close, expiry day). Proper tools lock onto that rhythm, instead of the crude "what hour is it" flags finance uses now.
- **Branching ratio / distance-to-criticality under subsampling (Wilting-Priesemann)** — *neuroscience criticality.* Recovers the true self-excitation index *m* from a subsampled process (your own fills, one venue), so it survives the partial-observability that biases standard Hawkes endogeneity estimates; m→1 flags flash-crash-prone fragile regimes for market-making (Wilting-Priesemann 2018).
  - *Plain English:* From brain science: measure how "self-feeding" the market is using only your own trades. When it nears the tipping point, it warns you a flash-crash-prone moment is brewing.
- **Effective reproduction number Rt via the renewal equation (EpiEstim)** — *epidemiology.* A real-time Bayesian cascade-intensity readout (Rt>1 self-sustaining, Rt<1 burnout) for liquidations, sector defaults and momentum bursts; sidesteps full Hawkes MLE with credible intervals and a single interpretable momentum-vs-fade signal (Cori et al. 2013).
  - *Plain English:* From epidemics (the "R number" you heard about in COVID): a live "is this selloff spreading or burning out?" gauge for crashes and momentum bursts.
- **Box-Least-Squares / Transit-Least-Squares periodic search** — *exoplanet detection.* Folds noisy irregular series at thousands of trial periods and fits an inverted top-hat, optimally detecting faint, brief, low-duty-cycle recurrences (liquidity holes, scheduled-event footprints) that Fourier/Lomb-Scargle smear; verified genuinely unused in finance (Kovács-Zucker-Mazeh 2002; Hippke-Heller 2019).
  - *Plain English:* The trick astronomers use to spot a planet dimming a star: it finds rare, brief, repeating dips (liquidity holes, scheduled events) that normal tools blur away.
- **Entropy production / time-irreversibility of price paths** — *stochastic thermodynamics.* Measure broken detailed balance in multivariate price-volume/LOB trajectories as a model-free non-equilibrium regime gauge (rising irreversibility favours momentum and is hostile to passive market-making); low-parameter and decorrelated from realized vol (Flanagan-Lacasa 2016; Gnesotto et al. 2018).
  - *Plain English:* From the physics of heat: check whether the "movie of prices" looks different played backwards. More "backwards-looks-wrong" means trend-friendly and dangerous for passive market-makers — a fresh way to read the regime.
- **Covariate-adaptive FDR (IHW / AdaPT)** — *genomics multiple testing.* Let an informative side-covariate (turnover, capacity, theory-backing, data vintage) reweight each strategy's significance hurdle at fixed overall FDR; strictly dominates the flat Harvey-Liu-Zhu t-bar as pure post-processing on t-stats you already compute (Ignatiadis et al. 2016; Lei-Fithian 2018).
  - *Plain English:* From gene science: let helpful side-info (is it tradeable? is there a theory?) bend each strategy's pass-mark, instead of one flat bar for all. Free upgrade on numbers you already have.
- **Random-matrix-theory correlation cleaning** — *statistical physics.* Most empirical-correlation eigenvalues are Marchenko-Pastur noise; clean them via rotationally-invariant estimators to stop noisy small eigenvalues corrupting optimal weights — a foundational transplant with live frontier extensions (Laloux-Cizeau-Bouchaud-Potters 1999; Bun-Bouchaud-Potters 2017).
  - *Plain English:* From physics: most of your "how assets move together" numbers are pure noise. Scrub the noise out so your portfolio isn't built on static.
- **Whittle index for restless multi-armed bandits** — *operations research scheduling.* Allocate a constrained capital/attention/risk budget across many opportunities whose edge decays/regenerates whether or not you hold them; the "restless" formulation uniquely models the mean-reversion of alpha-quality and decomposes to one 1-D subproblem per arm — finance MAB work is uniformly stateless UCB/Thompson (Whittle 1988; Akbarzadeh-Mahajan 2022).
  - *Plain English:* From scheduling math: split limited money across many edges that fade (and recover) whether or not you're using them. Nobody in finance models that fading — they should.

---

## Research outputs

### Core finance literature — by section

| # | Section | Papers | File |
|---|---|---|---|
| 01 | Market efficiency and the martingale null | 31 | [sections/01-efficiency.md](sections/01-efficiency.md) |
| 02 | Asset returns: stylised facts and heavy-tailed distributions | 31 | [sections/02-returns.md](sections/02-returns.md) |
| 03 | Backtest evaluation, multiple testing and the replication crisis | 31 | [sections/03-evaluation.md](sections/03-evaluation.md) |
| 04 | Volatility, tail risk and the variance risk premium | 39 | [sections/04-volatility.md](sections/04-volatility.md) |
| 05 | Covariance estimation and portfolio construction | 35 | [sections/05-portfolio.md](sections/05-portfolio.md) |
| 06 | The cross-section of returns and the factor zoo | 34 | [sections/06-factors.md](sections/06-factors.md) |
| 07 | Time-series signals and statistical arbitrage | 32 | [sections/07-statarb.md](sections/07-statarb.md) |
| 08 | Machine learning and foundation models for markets | 31 | [sections/08-ml.md](sections/08-ml.md) |
| 09 | Market microstructure and optimal execution | 32 | [sections/09-microstructure.md](sections/09-microstructure.md) |

### Research agenda

- [`novel-methods-agenda.md`](novel-methods-agenda.md) — prototype plans + data specs for the cross-disciplinary methods we will actually test

### Thematic deep-dive

- [`llm-and-time-series.md`](llm-and-time-series.md) — base-truth verdict: LLMs / foundation models for financial time series

### Cross-disciplinary method transfers

- [`cross-disciplinary/bio-method-transfers.md`](cross-disciplinary/bio-method-transfers.md) — 103 candidates (bioinformatics / genomics)
- [`cross-disciplinary/sciences-method-transfers.md`](cross-disciplinary/sciences-method-transfers.md) — 76 candidates (physics, signal processing, epidemiology, ecology, astrophysics, OR, climate, neuroscience)

### Reference & retrieval

- [`reviews.md`](reviews.md) — survey-of-surveys narrative + seed reviews
- [`download-arxiv.sh`](download-arxiv.sh) — 171 open-access arXiv PDFs (run it)
- [`to-fetch-manually.md`](to-fetch-manually.md) — 142 paywalled items (DOIs)
- [`snowball-to-chase.md`](snowball-to-chase.md) — 487 referenced works to chase next

## Totals

- 296 papers across 9 sections · 179 cross-disciplinary candidates
- 171 arXiv PDFs ready · 142 to fetch manually · 487 snowball refs
