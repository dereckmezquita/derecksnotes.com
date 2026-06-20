# Time-series signals and statistical arbitrage

This section assembles the foundational and frontier literature on the three pillars of systematic time-series/relative-value trading: (1) momentum — both the cross-sectional Jegadeesh-Titman effect and the time-series/trend-following momentum of Moskowitz-Ooi-Pedersen, together with their behavioral underpinnings (De Bondt-Thaler overreaction) and modern deep-learning extensions (Deep Momentum Networks); (2) the cointegration and mean-reversion machinery that powers statistical arbitrage — Engle-Granger and Johansen as the econometric bedrock, Gatev-Goetzmann-Rouwenhorst distance pairs trading, Avellaneda-Lee PCA-residual statarb, Ornstein-Uhlenbeck optimal entry/exit (Leung-Li), and Kalman-filter/state-space dynamic hedge ratios; and (3) regime-switching/hidden-Markov dynamics (Hamilton) used to condition signals on market states. The canonical works (mostly 1985-2012, Journal of Finance / Econometrica / JFE / RFS, all extremely highly cited) are paired with the best recent (2016-2025) work that stress-tests profitability after costs (Do-Faff, Huang et al.), surveys the field (Krauss), and replaces hand-built spreads with neural architectures (Krauss-Do-Huck, Guijarro-Ordonez-Pelger-Zanotti, Neufeld et al., Krause-Calliess). Note that many seminal journal articles are closed-access, but green OA preprints (NBER/SSRN/arXiv) exist for most; arXiv frontier papers are uniformly open.

**Completeness critic:** The already-gathered list is strong on momentum origins (Jegadeesh-Titman, MOP, Asness et al.), cointegration foundations (Engle-Granger, Johansen), distance pairs trading (Gatev et al., Do-Faff), and the deep-learning stat-arb frontier (Krauss et al., Guijarro-Ordonez-Pelger-Zanotti, Neufeld-Sester-Yin, Krause-Calliess). However there are notable CANONICAL gaps: (1) Elliott, van der Hoek & Malcolm (2005) "Pairs Trading" is THE foundational mean-reverting state-space/Kalman model of the spread (~289 cites) and is the direct antecedent of the gathered de Moura-Pizzinga-Zubelli (2016) Kalman paper — its absence is the single most important omission for the Kalman/state-space sub-scope. (2) The regime-switching/HMM scope cites only Hamilton (1989); the field-standard SURVEY Ang & Timmermann (2012, Annual Review of Financial Economics) is missing. (3) Goyal & Jegadeesh (2018, RFS) is the key methodological critique disentangling time-series vs cross-sectional return predictability and belongs in a CRITICAL review. (4) Rad, Low & Faff (2016, Quantitative Finance) is the most-cited head-to-head empirical comparison of distance/cointegration/copula pairs methods. On data quality: one gathered item, "Statistical Arbitrage Pairs Trading Strategies: Review and Outlook" by Krauss, has a year ambiguity — OpenAlex/SemanticScholar index it as 2016 (Journal of Economic Surveys, online first) while the print issue is 2017; both are correct, not an error. No gathered item appears predatory or mis-attributed. Remaining coverage gaps I filled below: copula pairs methods (Krauss-Stubinger / Liew-Wu), the ML cross-section factor benchmark (Gu-Kelly-Xiu), deep trend-following (Momentum Transformer), trend-following crisis behaviour (Hutchinson-O'Brien), a practitioner TS-vs-CS dissection (Baz et al.), Vidyamurthy's canonical textbook, and the very latest Pelger/Papanicolaou-lineage deep stat-arb (Attention Factors; Rank Space) that extend the gathered Guijarro-Ordonez-Pelger-Zanotti work. Note arXiv ids should be confirmed against the printed versions where journals exist; DOIs left null only where none is confirmed.

---

#### Returns to Buying Winners and Selling Losers: Implications for Stock Market Efficiency
*Narasimhan Jegadeesh, Sheridan Titman* — 1993 · The Journal of Finance · cites: 11479

DOI: `10.1111/j.1540-6261.1993.tb04702.x` · [link](https://doi.org/10.1111/j.1540-6261.1993.tb04702.x)

`canonical`

**Why:** The canonical reference defining cross-sectional momentum; the empirical anchor for the entire momentum-signal literature.

> The foundational cross-sectional momentum paper. Strategies that buy stocks that performed well over the past 3-12 months and sell stocks that performed poorly over the same horizon generate significant positive returns over 3-12 month holding periods. These profits are not explained by systematic risk or by lead-lag effects from delayed stock-price reactions to common factors; part of the abnormal returns generated in the first year after portfolio formation dissipates in the following two years. The result is one of the most robust anomalies in empirical finance and a direct challenge to market efficiency.

**Snowball:** De Bondt & Thaler, Does the Stock Market Overreact? (1985) (10.1111/j.1540-6261.1985.tb05004.x); Fama & French, Multifactor Explanations of Asset Pricing Anomalies (1996) (10.1111/j.1540-6261.1996.tb05202.x); Carhart, On Persistence in Mutual Fund Performance (1997) (10.1111/j.1540-6261.1997.tb03808.x)

---

#### Profitability of Momentum Strategies: An Evaluation of Alternative Explanations
*Narasimhan Jegadeesh, Sheridan Titman* — 2001 · The Journal of Finance · cites: 2565 · OA

DOI: `10.1111/0022-1082.00342` · [link](https://doi.org/10.1111/0022-1082.00342)

`empirical` · [pdf](https://doi.org/10.3386/w7159)

**Why:** Confirms momentum out-of-sample and adjudicates risk vs. behavioral explanations; essential for the 'does the signal survive?' discussion.

> An out-of-sample re-examination of momentum that confirms the strategy remained profitable in the 1990s, ruling out the possibility that the original 1993 finding was a product of data snooping. The paper evaluates competing risk-based and behavioral explanations and documents the post-holding-period return reversal pattern (momentum profits in year 1 partly reverse over years 2-5), which is more consistent with behavioral models of delayed overreaction than with rational risk compensation.

**Snowball:** Daniel, Hirshleifer & Subrahmanyam, Investor Psychology and Security Market Under- and Overreactions (1998) (10.1111/0022-1082.00077); Moskowitz & Grinblatt, Do Industries Explain Momentum? (1999) (10.1111/0022-1082.00146)

---

#### Value and Momentum Everywhere
*Clifford S. Asness, Tobias J. Moskowitz, Lasse Heje Pedersen* — 2013 · The Journal of Finance · cites: 2223 · OA

DOI: `10.1111/jofi.12021` · [link](https://doi.org/10.1111/jofi.12021)

`canonical` · [pdf](https://doi.org/10.2139/ssrn.2174501)

**Why:** Establishes the universality of momentum (and value) across asset classes and the value/momentum diversification that underpins multi-asset systematic strategies.

> Documents consistent value and momentum return premia across eight diverse markets and asset classes (individual stocks across four countries, country equity indices, government bonds, currencies, and commodities). Value and momentum are negatively correlated within and across asset classes, and a global three-factor model of market, value, and momentum captures the comovement. The common factor structure points to shared sources of return (liquidity risk, funding constraints) rather than asset-class-specific stories, providing a powerful diversification rationale for combining the two signals.

**Snowball:** Moskowitz, Ooi & Pedersen, Time Series Momentum (2012) (10.1016/j.jfineco.2011.11.003); Koijen, Moskowitz, Pedersen & Vrugt, Carry (2018) (10.1016/j.jfineco.2017.11.002)

---

#### Time Series Momentum
*Tobias J. Moskowitz, Yao Hua Ooi, Lasse Heje Pedersen* — 2012 · Journal of Financial Economics · cites: 1398 · OA

DOI: `10.1016/j.jfineco.2011.11.003` · [link](https://doi.org/10.1016/j.jfineco.2011.11.003)

`canonical` · [pdf](https://doi.org/10.2139/ssrn.2089463)

**Why:** Defines time-series (trend-following) momentum as distinct from cross-sectional momentum; the academic foundation of the trend-following/CTA industry.

> We document significant 'time series momentum' in equity index, currency, commodity, and bond futures for each of the 58 liquid instruments we consider. We find persistence in returns for one to 12 months that partially reverses over longer horizons, consistent with sentiment theories of initial under-reaction and delayed over-reaction. A diversified portfolio of time series momentum strategies across all asset classes delivers substantial abnormal returns with little exposure to standard asset pricing factors and performs best during extreme markets. Examining the trading activities of speculators and hedgers, we find that speculators profit from time series momentum at the expense of hedgers.

**Snowball:** Jegadeesh & Titman, Returns to Buying Winners and Selling Losers (1993) (10.1111/j.1540-6261.1993.tb04702.x); Asness, Moskowitz & Pedersen, Value and Momentum Everywhere (2013) (10.1111/jofi.12021)

---

#### Time series momentum: Is it there?
*Dashan Huang, Jiangyuan Li, Liyao Wang, Guofu Zhou* — 2019 · Journal of Financial Economics · cites: 122

DOI: `10.1016/j.jfineco.2019.08.004` · [link](https://doi.org/10.1016/j.jfineco.2019.08.004)

`critique`

**Why:** Key replication/critique paper questioning whether time-series momentum predictability is statistically real; central to the section's 'is the signal robust?' theme.

> A critical re-examination of the time-series momentum evidence. The authors show that the standard pooled-regression test of Moskowitz, Ooi and Pedersen (2012) does not actually test for return predictability based on a security's own past return; once a proper test is applied, the statistical significance of time-series momentum at the individual-asset level is far weaker than commonly believed, and a large part of the documented profitability is attributable to the volatility-scaling and aggregation of the trading rule rather than to genuine own-history predictability. The paper cautions against over-interpreting the original pooled t-statistics.

**Snowball:** Moskowitz, Ooi & Pedersen, Time Series Momentum (2012) (10.1016/j.jfineco.2011.11.003)

---

#### Enhancing Time Series Momentum Strategies Using Deep Neural Networks
*Bryan Lim, Stefan Zohren, Stephen Roberts* — 2019 · The Journal of Financial Data Science (arXiv preprint) · cites: 250 · OA

DOI: `10.48550/arXiv.1904.04912` · arXiv: `1904.04912` · [link](https://arxiv.org/abs/1904.04912)

`frontier` · [pdf](https://arxiv.org/pdf/1904.04912)

**Why:** The bridge from classical time-series momentum to deep learning; shows how neural nets jointly learn trend and sizing under a Sharpe objective.

> Introduces Deep Momentum Networks (DMNs), which combine deep learning trade-signal generation with the volatility-scaling framework of time-series momentum. Rather than separating trend estimation and position sizing, DMNs learn both jointly directly from data by optimizing the network on a Sharpe-ratio objective. Across a portfolio of 88 continuous futures contracts, the Sharpe-optimized LSTM more than doubles the Sharpe ratio of traditional time-series momentum benchmarks before costs and retains its advantage at transaction costs of 2-3 basis points; the authors add a turnover-regularization term so the network internalizes trading costs for less liquid assets.

**Snowball:** Moskowitz, Ooi & Pedersen, Time Series Momentum (2012) (10.1016/j.jfineco.2011.11.003); Zhang, Zohren & Roberts, Deep Learning for Portfolio Optimization (2020) (10.48550/arXiv.2005.13665)

---

#### Does the Stock Market Overreact?
*Werner F. M. De Bondt, Richard H. Thaler* — 1985 · The Journal of Finance · cites: 7226

DOI: `10.1111/j.1540-6261.1985.tb05004.x` · [link](https://doi.org/10.1111/j.1540-6261.1985.tb05004.x)

`canonical`

**Why:** Foundational long-horizon mean-reversion/contrarian evidence; the behavioral basis for reversal signals and the horizon-dependence of momentum vs. reversal.

> The seminal long-horizon mean-reversion/contrarian study. Forming portfolios on 3-5 year past returns, prior 'loser' portfolios subsequently outperform prior 'winner' portfolios by substantial margins, consistent with investors systematically overreacting to information and prices reverting once the overreaction corrects. The overreaction effect is asymmetric (larger for losers) and concentrated in January. The paper launched the behavioral-finance literature and provides the mean-reversion counterweight to momentum's short-horizon continuation.

**Snowball:** Lo & MacKinlay, When Are Contrarian Profits Due to Stock Market Overreaction? (1990) (10.1093/rfs/3.2.175)

---

#### Co-Integration and Error Correction: Representation, Estimation, and Testing
*Robert F. Engle, Clive W. J. Granger* — 1987 · Econometrica · cites: 31917

DOI: `10.2307/1913236` · [link](https://doi.org/10.2307/1913236)

`canonical`

**Why:** The econometric bedrock of cointegration-based pairs trading; defines the stationary spread that mean-reversion strategies trade.

> The paper that introduced cointegration: if two or more non-stationary (integrated) time series share a common stochastic trend, a linear combination of them can be stationary, and the series are then 'cointegrated.' Establishes the Granger representation theorem linking cointegration to an error-correction model (ECM), and proposes the two-step residual-based Engle-Granger estimation and testing procedure. This is the econometric foundation for spread construction in pairs trading and statistical arbitrage: a tradable mean-reverting spread is precisely a stationary cointegrating residual.

**Snowball:** Johansen, Estimation and Hypothesis Testing of Cointegration Vectors (1991) (10.2307/2938278); Granger, Some Properties of Time Series Data and Their Use in Econometric Model Specification (1981) (10.1016/0304-4076(81)90079-8)

---

#### Estimation and Hypothesis Testing of Cointegration Vectors in Gaussian Vector Autoregressive Models
*Søren Johansen* — 1991 · Econometrica · cites: 11153

DOI: `10.2307/2938278` · [link](https://doi.org/10.2307/2938278)

`canonical`

**Why:** The multivariate cointegration test used to build hedge ratios and multi-leg mean-reverting baskets beyond simple pairs.

> Develops the maximum-likelihood framework for estimating and testing cointegration in a Gaussian vector autoregression. The Johansen procedure uses reduced-rank regression (canonical correlations) to estimate the number of cointegrating vectors and the cointegrating space, and provides the trace and maximum-eigenvalue likelihood-ratio tests for cointegration rank. Unlike the two-step Engle-Granger approach it treats all variables symmetrically and handles multiple cointegrating relationships, making it the standard tool for constructing multi-asset stationary spreads/baskets in statistical arbitrage.

**Snowball:** Engle & Granger, Co-Integration and Error Correction (1987) (10.2307/1913236); Johansen & Juselius, Maximum Likelihood Estimation and Inference on Cointegration (1990) (10.1111/j.1468-0084.1990.mp52002003.x)

---

#### Pairs Trading: Performance of a Relative-Value Arbitrage Rule
*Evan Gatev, William N. Goetzmann, K. Geert Rouwenhorst* — 2006 · The Review of Financial Studies · cites: 809 · OA

DOI: `10.1093/rfs/hhj020` · [link](https://doi.org/10.1093/rfs/hhj020)

`canonical` · [pdf](http://papers.nber.org/papers/w7032.pdf)

**Why:** The canonical empirical pairs-trading paper and the benchmark distance method against which all later (cointegration, copula, ML) variants are compared.

> The first rigorous large-sample academic study of pairs trading. Using a simple distance rule — match stocks whose normalized price histories are closest (minimum sum of squared deviations), then open a long-short position when the spread diverges by two historical standard deviations and close on convergence — the authors test the strategy on U.S. equities from 1962-2002. Pairs trading earns average annualized excess returns of roughly 11% with low exposure to standard systematic risk factors; profits are robust to conservative transaction-cost assumptions and to controls for short-selling costs and bid-ask bounce, and are interpreted as compensation for a 'relative-value' reversion mechanism rather than known anomalies.

**Snowball:** Do & Faff, Does Simple Pairs Trading Still Work? (2010) (10.2469/faj.v66.n4.1); Vidyamurthy, Pairs Trading: Quantitative Methods and Analysis (2004)

---

#### Statistical Arbitrage Pairs Trading Strategies: Review and Outlook
*Christopher Krauss* — 2017 · Journal of Economic Surveys · cites: 213

DOI: `10.1111/joes.12153` · [link](https://doi.org/10.1111/joes.12153)

`review`

**Why:** The standard taxonomy/literature map for statistical-arbitrage methods; orients the reader across distance, cointegration, OU, and stochastic-control approaches.

> A structured survey of the pairs-trading and statistical-arbitrage literature that organizes the field into five methodological families: the distance approach, the cointegration approach, the time-series (state-space/OU) approach, the stochastic-control approach, and a catch-all 'other' category (copula, PCA, machine-learning, and high-frequency methods). For each family the review summarizes the pair-selection and signal-generation mechanics, the empirical evidence on profitability, and open problems including declining returns, sensitivity to transaction costs, and the need for more rigorous out-of-sample testing.

**Snowball:** Gatev, Goetzmann & Rouwenhorst, Pairs Trading (2006) (10.1093/rfs/hhj020); Avellaneda & Lee, Statistical Arbitrage in the US Equities Market (2010) (10.1080/14697680903124632); Elliott, van der Hoek & Malcolm, Pairs Trading (2005) (10.1080/14697680500149370)

---

#### Does Simple Pairs Trading Still Work?
*Binh Do, Robert Faff* — 2010 · Financial Analysts Journal · cites: 229

DOI: `10.2469/faj.v66.n4.1` · [link](https://doi.org/10.2469/faj.v66.n4.1)

`critique`

**Why:** The key out-of-sample/decay critique of distance pairs trading; evidence that the canonical edge erodes with competition and costs.

> Extends the Gatev-Goetzmann-Rouwenhorst distance pairs-trading study through 2009 and documents a secular decline in profitability: although pairs trading remained marginally profitable, returns fell substantially over time, consistent with increased competition/arbitrage capital and improved market efficiency. Profitability is concentrated in periods of market turbulence and varies strongly across industry sectors, and the strategy's performance is sensitive to the number of pairs traded and to the divergence threshold. A companion result (Do-Faff 2012) shows much of the residual profit is eroded once realistic trading costs are imposed.

**Snowball:** Do & Faff, Are Pairs Trading Profits Robust to Trading Costs? (2012) (10.1111/j.1475-6803.2012.01317.x); Gatev, Goetzmann & Rouwenhorst, Pairs Trading (2006) (10.1093/rfs/hhj020)

---

#### Statistical Arbitrage in the US Equities Market
*Marco Avellaneda, Jeong-Hyun Lee* — 2010 · Quantitative Finance · cites: 337 · OA

DOI: `10.1080/14697680903124632` · [link](https://doi.org/10.1080/14697680903124632)

`canonical` · [pdf](https://www.math.nyu.edu/faculty/avellane/AvellanedaLeeStatArb20090616.pdf)

**Why:** The canonical PCA-residual + Ornstein-Uhlenbeck statistical-arbitrage method; generalizes pairs trading to a high-dimensional factor-residual setting.

> Develops a systematic statistical-arbitrage framework for U.S. equities in which each stock's return is decomposed into systematic components (extracted via principal-component analysis of the return correlation matrix, or via sector ETFs) and an idiosyncratic residual. The residual is modeled as a mean-reverting Ornstein-Uhlenbeck process, and a normalized 's-score' built from the OU process drives contrarian entry/exit signals on the residual portfolio. Backtests over 1997-2007 show statistically significant returns that decay after 2002-2003 as the strategy becomes more widely exploited and as average mean-reversion speeds change, and the paper analyzes the effect of trading volume/illiquidity on signal quality.

**Snowball:** Gatev, Goetzmann & Rouwenhorst, Pairs Trading (2006) (10.1093/rfs/hhj020); Guijarro-Ordonez, Pelger & Zanotti, Deep Learning Statistical Arbitrage (2021) (2106.04028)

---

#### A New Approach to the Economic Analysis of Nonstationary Time Series and the Business Cycle
*James D. Hamilton* — 1989 · Econometrica · cites: 9677

DOI: `10.2307/1912559` · [link](https://doi.org/10.2307/1912559)

`canonical`

**Why:** The foundational regime-switching/hidden-Markov model used to condition mean-reversion and momentum signals on latent market states.

> Introduces the Markov-switching (regime-switching) autoregressive model, in which the parameters of a time-series process are governed by an unobserved discrete state that evolves as a Markov chain. Hamilton derives a recursive nonlinear filter to infer the latent regime probabilities and to evaluate the likelihood for maximum-likelihood estimation, and applies it to U.S. GNP to endogenously date expansions and recessions. The framework is the workhorse for modeling discrete shifts (e.g., bull/bear or high-/low-volatility regimes) and underlies hidden-Markov-model conditioning of trading signals and risk.

**Snowball:** Hamilton, Time Series Analysis (1994); Ang & Bekaert, International Asset Allocation with Regime Shifts (2002) (10.1093/rfs/15.4.1137)

---

#### A pairs trading strategy based on linear state space models and the Kalman filter
*Carlos Eduardo de Moura, Adrian Pizzinga, Jorge Zubelli* — 2016 · Quantitative Finance · cites: 30

DOI: `10.1080/14697688.2016.1164886` · [link](https://doi.org/10.1080/14697688.2016.1164886)

`method`

**Why:** Representative state-space/Kalman-filter treatment of dynamic hedge ratios — the method for adaptive spread estimation named in the section scope.

> Proposes a pairs-trading methodology in which the hedge ratio (cointegration coefficient) between two assets is allowed to vary over time and is estimated recursively with the Kalman filter under a linear state-space (dynamic linear model) representation. Compared with static OLS/cointegration hedge ratios, the time-varying state-space estimate adapts to structural drift in the relationship, producing a cleaner, more genuinely stationary spread for signal generation. Empirical tests on equity pairs show the dynamic Kalman-filter approach improves the stability and risk-adjusted performance of the resulting long-short strategy relative to constant-coefficient benchmarks.

**Snowball:** Elliott, van der Hoek & Malcolm, Pairs Trading (2005) (10.1080/14697680500149370); Engle & Granger, Co-Integration and Error Correction (1987) (10.2307/1913236)

---

#### Optimal Mean Reversion Trading with Transaction Costs and Stop-Loss Exit
*Tim Leung, Xin Li* — 2015 · International Journal of Theoretical and Applied Finance · cites: 39 · OA

DOI: `10.1142/S021902491550020X` · arXiv: `1411.5062` · [link](https://doi.org/10.1142/S021902491550020X)

`method` · [pdf](https://arxiv.org/pdf/1411.5062)

**Why:** The stochastic-control answer to when to enter/exit a mean-reverting (OU) spread under costs; formalizes the threshold rules of statistical arbitrage.

> Solves the optimal timing problem for trading a mean-reverting asset/spread modeled as an Ornstein-Uhlenbeck process, in the presence of proportional transaction costs and a stop-loss constraint. Using an optimal double-stopping (and optimal switching) formulation, the authors derive the value functions and characterize the optimal entry and exit price levels analytically, showing how the trading boundaries depend on the OU mean-reversion speed, volatility, transaction costs, and the stop-loss level. The work provides the rigorous stochastic-control foundation for the entry/exit thresholds used heuristically (e.g., the 2-sigma band) in OU-spread statistical arbitrage.

**Snowball:** Avellaneda & Lee, Statistical Arbitrage in the US Equities Market (2010) (10.1080/14697680903124632); Bertram, Analytic Solutions for Optimal Statistical Arbitrage Trading (2010) (10.1016/j.physa.2010.02.014)

---

#### Deep neural networks, gradient-boosted trees, random forests: Statistical arbitrage on the S&P 500
*Christopher Krauss, Xuan Anh Do, Nicolas Huck* — 2017 · European Journal of Operational Research · cites: 647

DOI: `10.1016/j.ejor.2016.10.031` · [link](https://doi.org/10.1016/j.ejor.2016.10.031)

`frontier`

**Why:** Influential template for ML-based cross-sectional statistical arbitrage; benchmarks deep nets vs. tree ensembles and documents post-2001 alpha decay.

> Recasts statistical arbitrage as a supervised machine-learning problem: for each S&P 500 constituent, lagged cumulative returns are used as features to predict whether a stock will out- or under-perform the cross-sectional median over the next day, and a long-short portfolio is formed from the most extreme predicted winners and losers. The authors benchmark deep neural networks, gradient-boosted trees, random forests, and an equal-weight ensemble over 1992-2015, finding strong daily returns before costs (with the ensemble best), though profitability declines markedly after 2001 as markets become more efficient and is heavily eroded by transaction costs in later years. The study is an influential template for cross-sectional ML statistical-arbitrage research.

**Snowball:** Takeuchi & Lee, Applying Deep Learning to Enhance Momentum Trading Strategies (2013); Gu, Kelly & Xiu, Empirical Asset Pricing via Machine Learning (2020) (10.1093/rfs/hhaa009)

---

#### Deep Learning Statistical Arbitrage
*Jorge Guijarro-Ordonez, Markus Pelger, Greg Zanotti* — 2021 · arXiv preprint (Management Science, forthcoming) · cites: 120 · OA

DOI: `10.48550/arXiv.2106.04028` · arXiv: `2106.04028` · [link](https://arxiv.org/abs/2106.04028)

`frontier` · [pdf](https://arxiv.org/pdf/2106.04028)

**Why:** The state-of-the-art deep-learning statistical-arbitrage paper; unifies factor-residual construction, signal extraction, and cost-aware optimization end-to-end.

> Proposes a unified, fully data-driven end-to-end framework for statistical arbitrage. Arbitrage portfolios are first constructed as the residuals of stocks relative to conditional latent asset-pricing factors (so the residuals are, by construction, low-systematic-risk and mean-reverting), and then the time series of these residual portfolios is processed by a flexible architecture combining CNNs and transformers to extract trading signals, with the network trained directly to optimize an economic objective (Sharpe-style mean-variance utility) including transaction costs. On U.S. equities the method delivers large, stable out-of-sample Sharpe ratios that survive trading costs and are robust across market regimes, substantially outperforming classical PCA/OU statarb and the deep-learning baselines of Krauss et al.

**Snowball:** Avellaneda & Lee, Statistical Arbitrage in the US Equities Market (2010) (10.1080/14697680903124632); Gu, Kelly & Xiu, Autoencoder Asset Pricing Models (2021) (10.1016/j.jeconom.2020.07.009)

---

#### Detecting Data-Driven Robust Statistical Arbitrage Strategies with Deep Neural Networks
*Ariel Neufeld, Julian Sester, Daiying Yin* — 2024 · SIAM Journal on Financial Mathematics (arXiv preprint) · cites: 20 · OA

DOI: `10.48550/arXiv.2203.03179` · arXiv: `2203.03179` · [link](https://arxiv.org/abs/2203.03179)

`frontier` · [pdf](https://arxiv.org/pdf/2203.03179)

**Why:** Frontier robust/model-ambiguity statistical arbitrage with deep nets; sidesteps explicit cointegration and addresses model-misspecification risk.

> We present an approach, based on deep neural networks, that allows identifying robust statistical arbitrage strategies in financial markets. Robust statistical arbitrage strategies refer to trading strategies that enable profitable trading under model ambiguity. The presented novel methodology allows to consider a large amount of underlying securities simultaneously and does not depend on the identification of cointegrated pairs of assets, hence it is applicable on high-dimensional financial markets or in markets where classical pairs trading approaches fail. Moreover, we provide a method to build an ambiguity set of admissible probability measures that can be derived from observed market data, so the strategies are robust with respect to a whole class of plausible models rather than a single estimated model.

**Snowball:** Bondarenko, Statistical Arbitrage and Securities Prices (2003) (10.1093/rfs/hhg028); Guijarro-Ordonez, Pelger & Zanotti, Deep Learning Statistical Arbitrage (2021) (2106.04028)

---

#### End-to-End Policy Learning of a Statistical Arbitrage Autoencoder Architecture
*Fabian Krause, Jan-Peter Calliess* — 2024 · arXiv preprint · cites: 3 · OA

DOI: `10.48550/arXiv.2402.08233` · arXiv: `2402.08233` · [link](https://arxiv.org/abs/2402.08233)

`frontier` · [pdf](https://arxiv.org/pdf/2402.08233)

**Why:** Recent frontier work generalizing the PCA-residual statarb pipeline to nonlinear autoencoders with end-to-end policy learning; illustrates the data-driven trajectory of the field.

> In Statistical Arbitrage (StatArb), classical mean reversion trading strategies typically hinge on asset-pricing or PCA-based models to identify the mean of a synthetic asset; once such a (linear) model is identified, a separate mean-reversion strategy is then devised to generate a trading signal. With a view to generalising such an approach and turning it truly data-driven, the authors study the utility of autoencoder architectures in StatArb, replacing the linear PCA factor model with a (potentially nonlinear) autoencoder to define the synthetic asset and its mean, and then learning the trading policy end-to-end rather than in two disconnected stages. Empirically the end-to-end policy-learned autoencoder is compared against PCA-based and staged baselines.

**Snowball:** Avellaneda & Lee, Statistical Arbitrage in the US Equities Market (2010) (10.1080/14697680903124632); Guijarro-Ordonez, Pelger & Zanotti, Deep Learning Statistical Arbitrage (2021) (2106.04028)

---

#### Pairs Trading
*Robert J. Elliott, John van der Hoek, William P. Malcolm* — 2005 · Quantitative Finance, 5(3), 271-276 · cites: 289 · completeness-add

DOI: `10.1080/14697680500149370` · [link](https://doi.org/10.1080/14697680500149370)

`canonical`

**Why:** THE canonical state-space / Kalman-filter model of the pairs-trading spread and the direct theoretical antecedent of the already-gathered de Moura-Pizzinga-Zubelli (2016) Kalman paper; indispensable for the Kalman/state-space hedge-ratio sub-scope.

> The authors consider a pairs trading strategy in which two similar stocks that trade at some spread are analyzed. They model the spread as a mean-reverting Gaussian Markov chain process observed in Gaussian noise, and estimate the model using a state-space (Kalman filter) framework. Predictions from the calibrated model are compared with subsequent observations of the spread to decide when to open and close positions: if the spread widens beyond its equilibrium one shorts the high asset and buys the low asset, profiting as it narrows. The approach gives analytical tractability, easy parameter estimation via the EM algorithm/Kalman filter, and built-in forecasting and out-of-equilibrium detection.

**Snowball:** Gatev, Goetzmann & Rouwenhorst (2006), Pairs Trading: Performance of a Relative-Value Arbitrage Rule (10.1093/rfs/hhj020); Hamilton (1989), A New Approach to the Economic Analysis of Nonstationary Time Series (10.2307/1912559); Vidyamurthy (2004), Pairs Trading: Quantitative Methods and Analysis

---

#### Regime Changes and Financial Markets
*Andrew Ang, Allan Timmermann* — 2012 · Annual Review of Financial Economics, 4, 313-337 · cites: 700 · OA · completeness-add

DOI: `10.1146/annurev-financial-110311-101808` · [link](https://doi.org/10.1146/annurev-financial-110311-101808)

`review` · [pdf](https://rady.ucsd.edu/_files/faculty-research/timmermann/regime_changes_June_22.pdf)

**Why:** The standard scholarly survey of regime-switching/Markov-switching models in finance; the regime-switching/HMM sub-scope currently cites only Hamilton (1989) and needs this synthesis.

> Regime-switching models can capture the tendency of financial markets to change behaviour abruptly and for the new behaviour to persist for several periods. After a regime change, asset returns can behave very differently from before. The authors review the literature on regime-switching (Markov-switching) models, discuss their estimation, and survey applications to asset allocation, the term structure of interest rates, equity returns, and the empirical evidence for multiple regimes in financial data. They argue regime-switching models provide a tractable, intuitive framework for capturing nonlinearities and time-varying moments such as fat tails, skewness, and time-varying correlations.

**Snowball:** Hamilton (1989), A New Approach to the Economic Analysis of Nonstationary Time Series (10.2307/1912559); Guidolin & Timmermann (2007), Asset allocation under multivariate regime switching (10.1016/j.jedc.2006.12.004); Hamilton (1990), Analysis of time series subject to changes in regime (10.1016/0304-4076(90)90093-9)

---

#### Cross-Sectional and Time-Series Tests of Return Predictability: What Is the Difference?
*Amit Goyal, Narasimhan Jegadeesh* — 2018 · The Review of Financial Studies, 31(5), 1784-1824 · cites: 180 · completeness-add

DOI: `10.1093/rfs/hhx131` · [link](https://doi.org/10.1093/rfs/hhx131)

`critique`

**Why:** Essential methodological CRITIQUE for a critical review: disentangles time-series momentum (MOP) from cross-sectional momentum (Jegadeesh-Titman), both central to the scope, and shows much of TS momentum's edge is a time-varying market exposure.

> The paper compares the performance of time-series (TS) and cross-sectional (CS) strategies based on past returns. CS strategies are zero-net-investment long/short strategies, whereas TS strategies take a time-varying net long investment in risky assets. For individual stocks, the difference in performance between TS and CS strategies is shown to be largely due to this time-varying net-long position rather than to differences in stock selection. With multiple international asset classes that have heterogeneous return distributions, scaled CS strategies significantly outperform similarly scaled TS strategies. The results clarify what TS momentum adds, or fails to add, relative to cross-sectional momentum.

**Snowball:** Moskowitz, Ooi & Pedersen (2012), Time Series Momentum (10.1016/j.jfineco.2011.11.003); Jegadeesh & Titman (1993), Returns to Buying Winners and Selling Losers (10.1111/j.1540-6261.1993.tb04702.x); Asness, Moskowitz & Pedersen (2013), Value and Momentum Everywhere (10.1111/jofi.12021)

---

#### The profitability of pairs trading strategies: distance, cointegration and copula methods
*Hossein Rad, Rand Kwong Yew Low, Robert Faff* — 2016 · Quantitative Finance, 16(10), 1541-1558 · cites: 153 · completeness-add

DOI: `10.1080/14697688.2016.1164337` · [link](https://doi.org/10.1080/14697688.2016.1164337)

`empirical`

**Why:** The most-cited head-to-head empirical horse race of distance vs cointegration vs copula pairs methods, directly tying together the Gatev (distance), Engle-Granger/Johansen (cointegration) threads already gathered and motivating the copula extension.

> The authors perform an empirical comparison of three pairs-trading methods - the distance method, the cointegration method, and the copula method - using a large CRSP sample of US equities from 1962 to 2014. The distance and cointegration methods generate comparable, economically and statistically significant excess returns, but profitability has declined over recent decades, partly attributable to a reduced presence of arbitrageurs. The copula method produces lower returns than the other two methods, though it trades more frequently, suggesting it finds more (but smaller) opportunities. The study evaluates risk-adjusted returns, exposure to systematic risk factors, and robustness to trading costs across methods.

**Snowball:** Gatev, Goetzmann & Rouwenhorst (2006) (10.1093/rfs/hhj020); Krauss (2017), Statistical Arbitrage Pairs Trading: Review and Outlook (10.1111/joes.12153); Liew & Wu (2013), Pairs trading: A copula approach (10.1057/jdhf.2013.1)

---

#### Empirical Asset Pricing via Machine Learning
*Shihao Gu, Bryan Kelly, Dacheng Xiu* — 2020 · The Review of Financial Studies, 33(5), 2223-2273 · cites: 2225 · OA · completeness-add

DOI: `10.1093/rfs/hhaa009` · [link](https://doi.org/10.1093/rfs/hhaa009)

`method` · [pdf](https://dachxiu.chicagobooth.edu/download/ML.pdf)

**Why:** The benchmark paper for machine-learning return prediction in the cross-section; methodological foundation for the deep-learning statistical-arbitrage signals already gathered (Krauss et al.; Guijarro-Ordonez-Pelger-Zanotti) and a key reference for separating signal from noise.

> The authors perform a comparative analysis of machine-learning methods for the canonical problem of empirical asset pricing: measuring asset risk premiums. They demonstrate large economic gains to investors using machine-learning forecasts, in some cases doubling the performance of leading regression-based strategies. The best-performing methods (trees and neural networks) capture nonlinear predictor interactions missed by other methods. A small set of dominant predictive signals - variations on momentum, liquidity, and volatility - drive the gains. The study establishes a benchmark for return prediction across thousands of US stocks using a large panel of firm characteristics.

**Snowball:** Gu, Kelly & Xiu (2021), Autoencoder Asset Pricing Models (10.1016/j.jeconom.2020.07.009); Freyberger, Neuhierl & Weber (2020), Dissecting Characteristics Nonparametrically (10.1093/rfs/hhz123); Kelly, Pruitt & Su (2019), Characteristics are covariances (IPCA) (10.1016/j.jfineco.2019.05.001)

---

#### Trading with the Momentum Transformer: An Intelligent and Interpretable Architecture
*Kieran Wood, Sven Giegerich, Stephen Roberts, Stefan Zohren* — 2022 · arXiv preprint (Oxford-Man Institute); later in Quantitative Finance · cites: 70 · OA · completeness-add

arXiv: `2112.08534` · [link](https://arxiv.org/abs/2112.08534)

`frontier` · [pdf](https://arxiv.org/pdf/2112.08534)

**Why:** The leading deep-learning trend-following architecture and the natural successor to the already-gathered Lim-Zohren-Roberts (2019) deep time-series momentum paper; frontier evidence on regime adaptation for TS momentum.

> The authors introduce the Momentum Transformer, an attention-based deep-learning architecture that outperforms benchmark time-series momentum and mean-reversion trading strategies. The attention-LSTM hybrid learns longer-term dependencies, improves performance net of transaction costs, and adapts naturally to new market regimes such as the SARS-CoV-2 crisis. Unlike black-box LSTM approaches, the model is inherently interpretable, providing insights into which factors drive the momentum strategy over time and how the attention mechanism focuses on different points in the past. The work directly extends deep time-series momentum from LSTM (DMNs) to transformer architectures.

**Snowball:** Lim, Zohren & Roberts (2019), Enhancing Time Series Momentum Strategies Using Deep Neural Networks (arXiv:1904.04912); Moskowitz, Ooi & Pedersen (2012), Time Series Momentum (10.1016/j.jfineco.2011.11.003); Lim, Arik, Loeff & Pfister (2021), Temporal Fusion Transformers (10.1016/j.ijforecast.2021.03.012)

---

#### Statistical Arbitrage in the US Equities Market via Attention Factors
*Elliot L. Epstein, Rose Wang, Jaewon Choi, Markus Pelger* — 2025 · arXiv preprint (q-fin / stat.ML) · OA · completeness-add

arXiv: `2510.11616` · [link](https://arxiv.org/abs/2510.11616)

`frontier` · [pdf](https://arxiv.org/pdf/2510.11616)

**Why:** State-of-the-art (2025) end-to-end deep statistical arbitrage from the Pelger group, directly extending the already-gathered Guijarro-Ordonez-Pelger-Zanotti (2021) deep stat-arb paper and the joint factor + trading-policy idea behind the gathered autoencoder/end-to-end works.

> Statistical arbitrage exploits temporal price differences between similar assets. The authors develop a framework to jointly identify similar assets through factors, identify mispricing, and form a trading policy that maximizes risk-adjusted performance after trading costs. Their Attention Factors are conditional latent factors learned from firm-characteristic embeddings that allow for complex interactions. Time-series signals are extracted from the residual portfolios of these factors using a general sequence model. Estimating factors and the arbitrage trading strategy jointly is crucial to maximizing profitability after costs. Empirically the model achieves an out-of-sample Sharpe ratio above 4 on the largest US equities over 24 years, and an unprecedented Sharpe ratio of 2.3 net of transaction costs; weak factors are shown to be important for arbitrage trading.

**Snowball:** Guijarro-Ordonez, Pelger & Zanotti (2021), Deep Learning Statistical Arbitrage (arXiv:2106.04028); Avellaneda & Lee (2010), Statistical Arbitrage in the US Equities Market (10.1080/14697680903124632); Gu, Kelly & Xiu (2021), Autoencoder Asset Pricing Models (10.1016/j.jeconom.2020.07.009)

---

#### Statistical Arbitrage in Rank Space
*Yi-Fan Li, George Papanicolaou* — 2024 · arXiv preprint (q-fin.TR / stat.ML) · OA · completeness-add

arXiv: `2410.06568` · [link](https://arxiv.org/abs/2410.06568)

`frontier` · [pdf](https://arxiv.org/pdf/2410.06568)

**Why:** Novel 2024 reframing of mean-reverting residual stat-arb in rank (capitalization-ordered) space; connects the Avellaneda-Lee residual approach and deep-learning stat-arb (both gathered) with stochastic-portfolio-theory ideas, a fresh angle for the mean-reversion sub-scope.

> Equity market dynamics are conventionally investigated in name space, where stocks are indexed by company names. By instead indexing stocks based on their ranks in capitalization, the authors gain a different perspective of market dynamics in rank space. They demonstrate the superior performance of statistical arbitrage in rank space over name space, driven by a more robust market representation and enhanced mean-reverting properties of residual returns in rank space. The algorithm features an intraday rebalancing mechanism for converting between name-space and rank-space portfolios. They explore statistical arbitrage with and without neural networks in both spaces and show that rank-space portfolios obtained with neural networks significantly outperform name-space portfolios.

**Snowball:** Avellaneda & Lee (2010), Statistical Arbitrage in the US Equities Market (10.1080/14697680903124632); Fernholz (2002), Stochastic Portfolio Theory (10.1007/978-1-4757-3699-1); Guijarro-Ordonez, Pelger & Zanotti (2021), Deep Learning Statistical Arbitrage (arXiv:2106.04028)

---

#### Non-linear dependence modelling with bivariate copulas: statistical arbitrage pairs trading on the S&P 100
*Christopher Krauss, Johannes Stübinger* — 2017 · Applied Economics, 49(52), 5352-5369 · cites: 60 · completeness-add

DOI: `10.1080/00036846.2017.1305097` · [link](https://doi.org/10.1080/00036846.2017.1305097)

`method`

**Why:** Representative rigorous treatment of the copula pairs-trading method - the third major family alongside distance and cointegration (both heavily gathered) - and complements the empirical comparison by Rad-Low-Faff; from the same Krauss line as gathered works.

> The authors develop a pairs-trading strategy that models the dependence structure between paired assets with bivariate copulas, capturing nonlinear and tail dependence that linear distance/cointegration methods miss. Using vine/bivariate copula families, they generate a mispricing index from the conditional probability of one asset given the other and trade deviations from the modelled dependence. Backtesting on S&P 100 constituents, the copula-based strategy produces statistically and economically significant returns that are robust to transaction costs and exhibit low exposure to systematic risk factors, outperforming the classic distance approach in several configurations.

**Snowball:** Liew & Wu (2013), Pairs trading: A copula approach (10.1057/jdhf.2013.1); Rad, Low & Faff (2016), The profitability of pairs trading strategies (10.1080/14697688.2016.1164337); Krauss (2017), Statistical Arbitrage Pairs Trading: Review and Outlook (10.1111/joes.12153)

---

#### Time series momentum and macroeconomic risk
*Mark C. Hutchinson, John O'Brien* — 2020 · International Review of Financial Analysis, 69, 101469 · cites: 40 · completeness-add

DOI: `10.1016/j.irfa.2020.101469` · [link](https://doi.org/10.1016/j.irfa.2020.101469)

`empirical`

**Why:** Provides the macro-risk and crisis-period evidence on time-series momentum that complements the gathered MOP (2012) and Huang et al. (2019) 'is it there?' debate; important for a critical assessment of whether trend-following premia are risk compensation.

> The authors examine the long-run performance of time-series momentum (trend-following) strategies and its relationship with macroeconomic risk and the business cycle. Using a long historical sample across asset classes, they show that time-series momentum returns vary systematically with the macroeconomic environment and with periods of financial-market stress, performing strongly during crises and recessions and more weakly during stable expansions. The findings connect the celebrated crisis-hedging or 'good in bad times' property of trend following to underlying macroeconomic risk factors, providing a risk-based interpretation of TS-momentum profitability rather than a purely behavioural one.

**Snowball:** Moskowitz, Ooi & Pedersen (2012), Time Series Momentum (10.1016/j.jfineco.2011.11.003); Huang, Li, Wang & Zhou (2019), Time series momentum: Is it there? (10.1016/j.jfineco.2019.09.012); Hutchinson & O'Brien (2014), Is This Time Different? Trend Following and Financial Crises (10.2139/ssrn.2375733)

---

#### Dissecting Investment Strategies in the Cross Section and Time Series
*Jamil Baz, Nicolas Granger, Campbell R. Harvey, Nicolas Le Roux, Sandy Rattray* — 2015 · SSRN Working Paper (Man-AHL / Duke) · cites: 90 · OA · completeness-add

DOI: `10.2139/ssrn.2695101` · [link](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2695101)

`method` · [pdf](https://www.cmegroup.com/education/files/dissecting-investment-strategies-in-the-cross-section-and-time-series.pdf)

**Why:** Practitioner-facing complement to Goyal-Jegadeesh (2018) that operationalizes the time-series vs cross-sectional distinction central to this section across momentum, value and carry; useful bridge between academic and industry framing.

> The authors contrast the time-series and cross-sectional implementations of three popular systematic investment strategies - carry, momentum, and value - across asset classes. They decompose each strategy into a directional (time-series) component and a relative-value (cross-sectional) component and study how each behaves across market conditions and correlation regimes. The analysis offers practical insights on when a time-series versus a cross-sectional setting is preferable, how the two implementations differ in their net market exposure, and how they can be combined. The paper is widely cited by practitioners as the reference framework for the TS-vs-CS distinction in systematic strategies.

**Snowball:** Moskowitz, Ooi & Pedersen (2012), Time Series Momentum (10.1016/j.jfineco.2011.11.003); Asness, Moskowitz & Pedersen (2013), Value and Momentum Everywhere (10.1111/jofi.12021); Koijen, Moskowitz, Pedersen & Vrugt (2018), Carry (10.1016/j.jfineco.2017.11.002)

---

#### Pairs Trading: Quantitative Methods and Analysis
*Ganapathy Vidyamurthy* — 2004 · John Wiley & Sons (Wiley Finance series) · cites: 360 · completeness-add

[link](https://www.wiley.com/en-us/Pairs+Trading%3A+Quantitative+Methods+and+Analysis-p-9780471460671)

`canonical`

**Why:** The most-cited textbook on pairs trading / statistical arbitrage and the standard cointegration-spread reference cited by virtually every gathered pairs-trading paper (Gatev, Do-Faff, Krauss, Avellaneda-Lee); fills the canonical-monograph gap.

> This monograph provides a comprehensive practitioner and quantitative treatment of pairs trading and statistical arbitrage. It develops the cointegration approach to constructing mean-reverting spreads, covers the estimation of the spread, signal generation, and trade construction, and connects pairs trading to arbitrage pricing theory and risk-factor models. The book also discusses the distance/correlation approach, the role of the spread's mean-reversion speed, bands and thresholds for entry/exit, and practical issues of portfolio construction and risk management for relative-value strategies. It remains a standard reference cited throughout the academic pairs-trading literature.

**Snowball:** Engle & Granger (1987), Co-Integration and Error Correction (10.2307/1913236); Gatev, Goetzmann & Rouwenhorst (2006), Pairs Trading (10.1093/rfs/hhj020); Ross (1976), The Arbitrage Theory of Capital Asset Pricing (10.1016/0022-0531(76)90046-6)

---

