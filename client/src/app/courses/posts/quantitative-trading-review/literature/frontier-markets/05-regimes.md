# Market regime & market-state detection and classification

Market-regime detection sits at the intersection of econometrics and machine learning. The canonical lineage starts with Hamilton's (1989) Markov regime-switching autoregression and matures through asset-allocation applications (Ang & Bekaert 2002; Guidolin & Timmermann 2007), regime-switching dynamic-correlation models (Pelletier 2006), and nonparametric bull/bear and structural-break dating (Pagan & Sossounov 2003; Bai & Perron 2003), all synthesized in the Ang & Timmermann (2012) review. The recent (2019-2026) frontier shifts toward unsupervised and distributional methods that avoid rigid parametric assumptions: Wasserstein and signature-MMD clustering of path distributions (Horvath/Issa/Muguruza), realized-covariance regime detection (Bucci & Ciciretti), change-point-plus-clustering of volatility structure (Prakash et al.), and robust statistical "jump models" that add persistence penalties to clustering (Shu/Mulvey; Nystrup et al.), increasingly fused with text/LLM signals and reinforcement learning for regime-conditioned strategies. A recurring theme is validation through regime-conditioned strategy performance (Sharpe ratio, drawdown, tail-risk hedging) rather than label accuracy alone, since true regimes are latent. For a cross-market-transfer review, the asset-independent and global multi-asset variants (Werge 2021; Fink et al. 2016; Shu & Mulvey 2024) and the persistence-vs-forecastability tension are the most transferable findings.

**Completeness critic:** The existing collection is strong on unsupervised/ML regime detection (clustering, jump models, HMM variants) and Markov-switching asset allocation, but is missing several CANONICAL foundations that nearly every paper in the set cites. The most important gaps are the regime-switching VOLATILITY lineage (Hamilton & Susmel 1994 MS-ARCH; Gray 1996; Haas-Mittnik-Paolella 2004 MS-GARCH) and the bull/bear-market DATING/classification lineage that underpins the already-gathered Pagan-Sossounov (2003): Bry & Boschan (1971) algorithmic turning points, Maheu & McCurdy (2000) duration-dependent Markov-switching bull/bear, and Lunde & Timmermann (2004). Also missing is Kritzman, Page & Turkington (2012), the practitioner-canonical "regime shifts for dynamic strategies" paper, and Nystrup, Lindström & Madsen (2020), the foundational statistical jump model that DIRECTLY underpins the already-gathered Shu-Yu-Mulvey (2024), Shu-Mulvey (2024) and Nystrup-Kolm-Lindström (2020) papers — its omission is a notable lineage gap. I added three of the strongest recent (2026) arXiv works for frontier coverage. CAVEATS: (1) Bry & Boschan (1971) is an NBER monograph with no clean journal DOI; I set DOI null (Crossref only surfaces review articles citing it). (2) The three 2026 arXiv items (Geometric Observables; multi-regime TVTP Treasury; HMM+RL allocation) are very recent preprints, not yet peer-reviewed, and citation counts are ~0; included for frontier value, flagged accordingly. (3) Two already-gathered papers (Nystrup-Kolm-Lindström 2020; Oelschläger-Adam 2023) appeared in my searches and were correctly excluded as duplicates. Several other 2026 arXiv hits (PandaAI, MarketSenseAI, FinStressTS) only touch regime detection tangentially and were excluded for low topical fit.

---

#### A New Approach to the Economic Analysis of Nonstationary Time Series and the Business Cycle
*James D. Hamilton* — 1989 · Econometrica · cites: 9892

DOI `10.2307/1912559` · [link](https://doi.org/10.2307/1912559)

**Why:** The foundational Markov regime-switching model; the statistical bedrock for virtually all parametric market-state detection and the natural baseline (HMM/Hamilton filter) against which newer methods are compared.

> Proposes a tractable approach to modeling changes in regime, in which the parameters of an autoregression are viewed as the outcome of a discrete-state, unobserved Markov process. The paper develops a nonlinear filtering and smoothing algorithm to draw probabilistic inference about the unobserved regime (e.g., recession vs. expansion) and a maximum-likelihood method to estimate the model's population parameters. Applied to postwar U.S. real GNP, the model produces a fully data-based dating of business-cycle turning points and a statistical characterization of the recurrent shifts between contraction and expansion regimes.

**Snowball:** Goldfeld & Quandt (1973), A Markov model for switching regressions, Journal of Econometrics (10.1016/0304-4076(73)90002-X); Hamilton (1990), Analysis of time series subject to changes in regime, Journal of Econometrics (10.1016/0304-4076(90)90093-9)

---

#### International Asset Allocation With Regime Shifts
*Andrew Ang, Geert Bekaert* — 2002 · The Review of Financial Studies · cites: 1588

DOI `10.1093/rfs/15.4.1137` · [link](https://doi.org/10.1093/rfs/15.4.1137)

**Why:** Canonical demonstration that regimes materially change the cross-asset correlation/volatility structure and therefore optimal allocation; the template for regime-conditioned strategy evaluation across markets.

> Solves the dynamic portfolio-choice problem of a U.S. investor facing a time-varying investment opportunity set modeled by a regime-switching process in which correlations and volatilities increase in bad times. Documents a high-volatility, high-correlation 'bear' regime that is persistent and contrasts with a calmer normal regime. Shows that despite the rise in correlations during volatile markets, international diversification remains valuable once regime switching is accounted for, and that currency hedging imparts further benefit. Establishes regime-dependent asset allocation as a core practical use of market-state detection.

**Snowball:** Longin & Solnik (2001), Extreme correlation of international equity markets, Journal of Finance (10.1111/0022-1082.00340); Ang & Bekaert (2002), Regime switches in interest rates, Journal of Business & Economic Statistics (10.1198/073500102317351930)

---

#### Asset Allocation Under Multivariate Regime Switching
*Massimo Guidolin, Allan Timmermann* — 2007 · Journal of Economic Dynamics and Control · cites: 437 · OA

DOI `10.1016/j.jedc.2006.12.004` · [link](https://doi.org/10.1016/j.jedc.2006.12.004)

**Why:** Multivariate, multi-regime extension showing market states are richer than simple bull/bear and that regime detection drives horizon-dependent allocation; central reference for regime-conditioned strategy performance.

> Studies asset-allocation decisions for stocks and bonds in the presence of regime switching in the joint return distribution. Finds that four separate regimes - characterized as crash, slow-growth, bull and recovery states - are required to capture the joint distribution of large-cap stock, small-cap stock and bond returns. Optimal allocations vary considerably across states and change over time as investors revise state-probability estimates; for example, in the crash state buy-and-hold investors allocate more to stocks the longer their horizon, while in bull markets the optimal stock allocation declines with horizon. Demonstrates the economic value of conditioning portfolios on multivariate market states.

**Snowball:** Guidolin & Timmermann (2008), International asset allocation under regime switching, skew and kurtosis preferences, Review of Financial Studies (10.1093/rfs/hhn006); Ang & Bekaert (2002), International Asset Allocation With Regime Shifts, RFS (10.1093/rfs/15.4.1137)

---

#### Regime Changes and Financial Markets
*Andrew Ang, Allan Timmermann* — 2012 · Annual Review of Financial Economics · cites: 478 · OA

DOI `10.1146/annurev-financial-110311-101808` · [link](https://doi.org/10.1146/annurev-financial-110311-101808)

**Why:** The standard review orienting the entire regime-detection literature; ideal anchor citation summarizing methods, pitfalls (number of states, real-time detection) and finance applications.

> Surveys regime-switching models and their use in finance, explaining how such models match the tendency of financial markets to change behavior abruptly and to have the new behavior persist for several periods after a change. Reviews how regimes capture nonlinearities, fat tails, time-varying correlations and skewness that linear models miss, and discusses estimation (the Hamilton filter, EM) and inference challenges including determining the number of regimes. Covers applications to asset allocation, the term structure, and asset pricing, and discusses the economic interpretation and out-of-sample value of regime models.

**Snowball:** Hamilton (1989), A New Approach... Business Cycle, Econometrica (10.2307/1912559); Guidolin (2011), Markov switching models in empirical finance, Advances in Econometrics (10.1108/S0731-9053(2011)000027B005)

---

#### Regime Switching for Dynamic Correlations
*Denis Pelletier* — 2006 · Journal of Econometrics · cites: 600

DOI `10.1016/j.jeconom.2005.01.013` · [link](https://doi.org/10.1016/j.jeconom.2005.01.013)

**Why:** Canonical model for realized/conditional-covariance regimes; directly underpins the modern realized-covariance regime-detection literature and tail-risk hedging applications.

> Proposes a regime-switching dynamic-correlation (RSDC) model in which conditional variances follow univariate GARCH processes while the conditional correlation matrix is constant within each regime but switches between regimes according to a Markov chain. This nests constant-correlation and DCC-type behaviors and lets the entire dependence structure jump between market states (e.g., normal vs. crisis). The model is estimable in two steps and is shown to fit international equity data better than constant-correlation alternatives, providing a covariance-regime characterization of market states.

**Snowball:** Engle (2002), Dynamic conditional correlation, Journal of Business & Economic Statistics (10.1198/073500102288618487); Pelletier & ... covariance forecasts and long-run correlations (2010), Finance Research Letters (10.1016/j.frl.2009.12.001)

---

#### Computation and Analysis of Multiple Structural Change Models
*Jushan Bai, Pierre Perron* — 2003 · Journal of Applied Econometrics · cites: 6500

DOI `10.1002/jae.659` · [link](https://doi.org/10.1002/jae.659)

**Why:** The canonical change-point / structural-break methodology used to delineate market states as locally stationary segments; the partitioning step in many modern volatility-regime clustering pipelines.

> Addresses practical issues for empirical application of structural-change procedures, providing an efficient dynamic-programming algorithm to obtain global minimizers of the sum of squared residuals for models with an unknown number of breaks at unknown dates, requiring at most O(T^2) least-squares operations. Develops tests for the presence and number of structural breaks, methods to estimate the break dates and their confidence intervals, and information-criterion / sequential procedures to select the number of breaks. Provides the standard toolkit for detecting abrupt changes (structural breaks) in time-series parameters.

**Snowball:** Bai & Perron (1998), Estimating and testing linear models with multiple structural changes, Econometrica (10.2307/2998540); Andrews (1993), Tests for parameter instability and structural change with unknown change point, Econometrica (10.2307/2951764)

---

#### A Simple Framework for Analysing Bull and Bear Markets
*Adrian R. Pagan, Kirill A. Sossounov* — 2003 · Journal of Applied Econometrics · cites: 900

DOI `10.1002/jae.664` · [link](https://doi.org/10.1002/jae.664)

**Why:** The reference nonparametric bull/bear dating algorithm; widely used to label 'ground-truth' market states for validating regime-detection methods that lack observable labels.

> Adapts the Bry-Boschan business-cycle turning-point dating algorithm to stock prices to provide a simple, nonparametric (model-free) rule for partitioning a market index into bull and bear phases based on local peaks and troughs subject to minimum-duration and amplitude censoring. Characterizes the empirical features of U.S. bull and bear markets (duration, amplitude, and whether phases exhibit duration dependence) and asks whether standard asset-pricing/return models can reproduce these features. Offers a transparent alternative to Markov-switching for defining market states.

**Snowball:** Bry & Boschan (1971), Cyclical Analysis of Time Series, NBER; Lunde & Timmermann (2004), Duration dependence in stock prices: an analysis of bull and bear markets, JBES (10.1198/073500104000000136)

---

#### Stylized Facts of Financial Time Series and Hidden Semi-Markov Models
*Jan Bulla, Ingo Bulla* — 2006 · Computational Statistics & Data Analysis · cites: 220

DOI `10.1016/j.csda.2006.07.021` · [link](https://doi.org/10.1016/j.csda.2006.07.021)

**Why:** Establishes that state persistence/duration is a first-order modeling issue for market regimes; motivates the persistence-penalized 'jump model' and HSMM approaches that dominate recent work.

> Shows that two- and three-state hidden Markov models reproduce most stylized facts of daily return series but fail to capture the slow decay in the autocorrelation function of squared returns, because the geometric sojourn-time distribution of HMM states is too restrictive. Introduces hidden semi-Markov models (HSMMs), which replace the implicit geometric state-duration with flexible (e.g., negative-binomial) sojourn distributions, and demonstrates that HSMMs better reproduce volatility persistence and the long-memory-like behavior of squared returns. Provides estimation methods and empirical comparison on equity index data.

**Snowball:** Ryden, Terasvirta & Asbrink (1998), Stylized facts of daily return series and the hidden Markov model, Journal of Applied Econometrics (10.1002/(SICI)1099-1255(199805/06)13:3<217::AID-JAE476>3.0.CO;2-V); Bulla (2011), Hidden Markov models with t components, Computational Statistics & Data Analysis (10.1016/j.csda.2010.07.021)

---

#### Markov-Switching Asset Allocation: Do Profitable Strategies Exist?
*Jan Bulla, Sascha Mergner, Ingo Bulla, Andre Sesboue, Christophe Chesneau* — 2011 · Journal of Asset Management · cites: 130

DOI `10.1057/jam.2010.27` · [link](https://doi.org/10.1057/jam.2010.27)

**Why:** Influential demonstration that regime-conditioned (risk-off in high-volatility states) strategies are profitable net of costs across multiple equity markets - directly the 'regime-conditioned strategy performance' use case.

> Proposes a straightforward Markov-switching asset-allocation model that reduces market exposure during periods classified as high-volatility regimes. Using 40 years of daily returns of major equity indices in the U.S., Japan and Germany, it evaluates out-of-sample performance after transaction costs. The strategy proves profitable: across the regional markets considered, volatility falls on average by 41 percent while annualized excess returns of 18.5 to 201.6 basis points are achieved, demonstrating that regime detection can yield practically exploitable, risk-reducing trading rules.

**Snowball:** Hamilton (1989), Econometrica (10.2307/1912559); Ang & Bekaert (2004), How regimes affect asset allocation, Financial Analysts Journal (10.2469/faj.v60.n2.2612)

---

#### Detecting Intraday Financial Market States Using Temporal Clustering
*Dieter Hendricks, Tim Gebbie, Diane Wilcox* — 2016 · Quantitative Finance · cites: 20 · OA

DOI `10.1080/14697688.2016.1171378` · arXiv `1508.04900` · [link](https://arxiv.org/abs/1508.04900)

**Why:** Early unsupervised, correlation-matrix-based intraday state detection; a precursor to the realized-covariance and online clustering regime methods central to this topic.

> Proposes a high-speed maximum-likelihood clustering algorithm to detect temporal financial market states using correlation matrices estimated from intraday market-microstructure features. The method first determines ex-ante intraday temporal cluster configurations to identify recurring market states, then, in an online setting, classifies streaming observations into these states for real-time market monitoring. Applied to high-frequency equity data, it shows that intraday dynamics organize into a small number of identifiable, recurring states, offering a microstructure-based, unsupervised route to market-state classification.

**Snowball:** Munnix et al. (2012), Identifying states of a financial market, Scientific Reports (10.1038/srep00644); Marsili (2002), Dissecting financial markets: sectors and states, Quantitative Finance (10.1088/1469-7688/2/4/301)

---

#### Structural Clustering of Volatility Regimes for Dynamic Trading Strategies
*Arjun Prakash, Nick James, Max Menzies, Gilad Francis* — 2021 · Applied Mathematical Finance · cites: 60 · OA

DOI `10.1080/1350486X.2021.2007146` · arXiv `2004.09963` · [link](https://arxiv.org/abs/2004.09963)

**Why:** Representative modern change-point-plus-clustering pipeline (nonparametric regime detection) that explicitly couples market-state classification to a validated regime-conditioned trading strategy across multiple asset classes.

> Develops a method to determine the number of volatility regimes in a nonstationary financial time series by applying unsupervised learning to its volatility structure. Change-point detection partitions the series into locally stationary segments, a distance matrix is computed between segment distributions, and the segments are clustered into a learned number of discrete volatility regimes via an optimization routine. Applied to indices, large-cap equities, ETFs and currency pairs, it overcomes the rigid assumptions of parametric regime-switching models, and the authors build and validate a dynamic trading strategy that matches the current distribution to past regimes to make online risk-avoidance decisions.

**Snowball:** Bai & Perron (2003), Computation and analysis of multiple structural change models, JAE (10.1002/jae.659); James, Menzies & Chin (2022), Distributional trends/structure in financial time series (10.1063/5.0079217)

---

#### Market Regime Detection via Realized Covariances: A Comparison between Unsupervised Learning and Nonlinear Models
*Andrea Bucci, Vito Ciciretti* — 2022 · Economic Modelling · cites: 35 · OA

DOI `10.1016/j.econmod.2022.105832` · arXiv `2104.03667` · [link](https://arxiv.org/abs/2104.03667)

**Why:** Directly addresses realized-covariance regimes and benchmarks unsupervised clustering against nonlinear transition models, with explicit out-of-sample strategy validation - a core scope item for this topic.

> Identifies market regimes from monthly realized covariance matrices and detects transitions toward highly volatile regimes to improve tail-risk hedging, motivated by the failure of common diversification methods when correlations jump in stressed states. Two approaches are compared: a vector logistic smooth-transition autoregressive (VLSTAR) model and an unsupervised agglomerative hierarchical clustering of the covariance matrices. Because true regimes are unobservable, the methods are validated two ways: on randomly generated data with known regimes (classification accuracy) and via a naive trading strategy filtered by detected switches. The VLSTAR is found to be the best-performing model for labelling market regimes.

**Snowball:** Pelletier (2006), Regime switching for dynamic correlations, Journal of Econometrics (10.1016/j.jeconom.2005.01.013); Lopez de Prado (2018), Advances in Financial Machine Learning (fractional differentiation)

---

#### Clustering Market Regimes Using the Wasserstein Distance
*Blanka Horvath, Zacharia Issa, Aitor Muguruza Gonzalez* — 2021 · arXiv / SSRN · cites: 13 · OA

DOI `10.2139/ssrn.3947905` · arXiv `2110.11848` · [link](https://arxiv.org/abs/2110.11848)

**Why:** A leading distributional/optimal-transport approach to unsupervised regime clustering; influential in the recent quant-ML wave and pairs naturally with the signature-MMD line below.

> Presents an unsupervised learning algorithm for clustering financial time series into a suitable number of temporal segments (market regimes), framing regime detection as a problem on the space of probability measures with finite p-th moment using the p-Wasserstein distance between empirical distributions. The resulting Wasserstein k-means algorithm operates directly on distributions of returns rather than point features, making it sensitive to higher-moment and tail differences between regimes. The authors compare different distance/clustering choices and demonstrate accurate, rapid and automated detection of distinct regimes on synthetic and market data.

**Snowball:** Horvath, Muguruza & Tomas (2021), Deep learning volatility, Quantitative Finance (10.1080/14697688.2020.1817974); Cuturi (2013), Sinkhorn distances: lightspeed computation of optimal transport, NeurIPS

---

#### Non-parametric Online Market Regime Detection and Regime Clustering for Multidimensional and Path-Dependent Data Structures
*Zacharia Issa, Blanka Horvath* — 2023 · arXiv (stat.ML) · OA

DOI `10.48550/arXiv.2306.15835` · arXiv `2306.15835` · [link](https://arxiv.org/abs/2306.15835)

**Why:** State-of-the-art online, path-signature/MMD regime detection; extends the Wasserstein-clustering line to streaming multidimensional data and is highly transferable across markets.

> Presents a non-parametric online market-regime detection method for multidimensional, path-dependent data using a path-wise two-sample test derived from a maximum-mean-discrepancy (MMD) similarity metric on path space, with rough-path signatures used as the feature map. Because signatures faithfully summarize the law of a path, the MMD-on-signatures test can detect when a new window of market data is distributionally different from a reference regime in a fully online, model-free manner, and can be combined with clustering to group regimes. The method handles multivariate and path-dependent structure that point-wise features miss, and is demonstrated on financial data.

**Snowball:** Horvath, Issa & Muguruza (2021), Clustering market regimes using the Wasserstein distance (2110.11848); Chevyrev & Oberhauser (2022), Signature moments to characterize laws of stochastic processes, JMLR (1810.10971)

---

#### A Hybrid Learning Approach to Detecting Regime Switches in Financial Markets
*Peter Akioyamen, Yi Zhou Tang, Hussien Hussien* — 2021 · arXiv (q-fin.ST) · OA

DOI `10.48550/arXiv.2108.05801` · arXiv `2108.05801` · [link](https://arxiv.org/abs/2108.05801)

**Why:** Clear, reproducible PCA + k-means + classification pipeline for regime detection from macro/economic data with strategy-based validation; a useful methodological reference point for unsupervised regime clustering.

> Presents a framework for detecting regime switches in the U.S. financial markets that combines dimensionality reduction with clustering and classification. Principal component analysis reduces publicly available economic indicators, k-means clustering identifies latent regimes, and a supervised classifier learns to assign new observations to regimes in real time. The efficacy of the framework is shown by constructing and assessing two trading strategies based on the detected regimes, linking unsupervised market-state discovery to out-of-sample strategy performance.

**Snowball:** Ang & Timmermann (2012), Regime changes and financial markets, Annu. Rev. Financ. Econ. (10.1146/annurev-financial-110311-101808); Lopez de Prado (2018), Advances in Financial Machine Learning

---

#### Downside Risk Reduction Using Regime-Switching Signals: A Statistical Jump Model Approach
*Yizhan Shu, Chenyu Yu, John M. Mulvey* — 2024 · Journal of Asset Management · cites: 12

DOI `10.1057/s41260-024-00376-x` · arXiv `2402.05272` · [link](https://arxiv.org/abs/2402.05272)

**Why:** Leading recent example of persistence-penalized 'jump model' regime detection benchmarked against HMM with realistic, cross-market regime-conditioned strategy evaluation - directly on-topic.

> Investigates a regime-switching investment strategy that mitigates downside risk by reducing market exposure during anticipated unfavorable regimes, using the statistical jump model (JM) for market-regime identification. The JM differs from traditional Markov-switching models by enhancing regime persistence through a jump penalty applied at each state transition, with features derived solely from the return series and the jump penalty selected via time-series cross-validation that directly optimizes strategy performance. Out-of-sample tests on major equity indices from the U.S., Germany and Japan (1990-2023), including transaction costs and trading delays, show the JM-guided strategy consistently reduces volatility and maximum drawdown and improves the Sharpe ratio relative to both an HMM-guided strategy and buy-and-hold.

**Snowball:** Nystrup, Lindstrom & Madsen (2020), Learning hidden Markov models with persistent states by penalizing jumps, Expert Systems with Applications (10.1016/j.eswa.2020.113307); Bemporad et al. (2018), Fitting jump models, Automatica (10.1016/j.automatica.2018.03.007)

---

#### Greedy Online Classification of Persistent Market States Using Realized Intraday Volatility Features
*Peter Nystrup, Petter N. Kolm, Erik Lindstrom* — 2020 · The Journal of Financial Data Science · cites: 30

DOI `10.3905/jfds.2020.1.030` · [link](https://jfds.pm-research.com/content/2/3/25)

**Why:** Defines the online, persistence-penalized jump-model classifier for realized-volatility market states; the methodological seed for the now-popular statistical jump model regime literature.

> Proposes a greedy online classifier that contemporaneously determines which hidden market state a new observation belongs to, without parsing historical observations and without compromising persistence. The classifier clusters temporal (realized intraday volatility) features while explicitly penalizing jumps between states via a fixed-cost regularization term that can be calibrated to a desired level of persistence. Through return simulations the authors show it often attains higher accuracy than the correctly specified maximum-likelihood estimator and is more robust to misspecification, yielding more persistent state sequences in and out of sample; it is applied to estimate persistent states of the S&P 500.

**Snowball:** Nystrup, Madsen & Lindstrom (2017), Long memory of financial time series and hidden Markov models with time-varying parameters, Journal of Forecasting (10.1002/for.2447); Bemporad et al. (2018), Fitting jump models, Automatica (10.1016/j.automatica.2018.03.007)

---

#### Detecting Bearish and Bullish Markets in Financial Time Series Using Hierarchical Hidden Markov Models
*Lennart Oelschlager, Timo Adam* — 2023 · Statistical Modelling · cites: 30 · OA

DOI `10.1177/1471082X211034048` · arXiv `2007.14874` · [link](https://arxiv.org/abs/2007.14874)

**Why:** Multi-scale (hierarchical) HMM addressing a key practical failure of single-layer HMMs - conflating short-term noise with regime change - relevant to robust market-state classification.

> Argues that basic hidden Markov models cannot simultaneously capture short- and long-term market trends, which can lead to misinterpreting short-term price fluctuations as changes in the long-term regime. The paper develops hierarchical hidden Markov models (HHMMs) with a coarse (e.g., bull/bear) layer governing a finer state layer, allowing simultaneous inference about long-term market phases and short-term dynamics within them. Feasibility is demonstrated on the DAX and S&P 500 indices, where the HHMM cleanly separates bullish from bearish markets while modeling within-regime volatility, supporting more sophisticated regime-aware trading strategies.

**Snowball:** Fine, Singer & Tishby (1998), The hierarchical hidden Markov model, Machine Learning (10.1023/A:1007469218079); Bulla & Bulla (2006), Stylized facts and hidden semi-Markov models, CSDA (10.1016/j.csda.2006.07.021)

---

#### Predicting Risk-Adjusted Returns Using an Asset-Independent Regime-Switching Model
*Nicklas Werge* — 2021 · Expert Systems with Applications · cites: 6 · OA

DOI `10.1016/j.eswa.2021.115576` · arXiv `2107.05535` · [link](https://arxiv.org/abs/2107.05535)

**Why:** Explicitly asset-independent regime model - the most directly relevant piece to cross-market strategy transfer, showing a single regime detector generalizing across asset classes.

> Constructs a regime-switching model based on a hidden Markov model that is independent of the asset class, so the same regime framework can be applied across commodities, currencies, stocks and fixed income. The framework distinguishes bull, bear and high-volatility periods and uses the inferred regimes to predict risk-adjusted returns. Empirical results across multiple asset classes show that the asset-independent regime signal improves risk-adjusted return prediction, supporting the idea that a common latent market-state structure transfers across markets.

**Snowball:** Hamilton (1989), Econometrica (10.2307/1912559); Nystrup et al. (2017), Long memory and HMMs with time-varying parameters, Journal of Forecasting (10.1002/for.2447)

---

#### Regime Switching Vine Copula Models for Global Equity and Volatility Indices
*Holger Fink, Yulia Klimova, Claudia Czado, Jakob Stober* — 2017 · Econometrics (MDPI) · cites: 60 · OA

DOI `10.3390/econometrics5010003` · arXiv `1604.05598` · [link](https://arxiv.org/abs/1604.05598)

**Why:** Detects synchronized global dependence regimes across continents and asset types - directly informative for cross-market regime transfer and joint multi-market state detection.

> Applies Markov-switching R-vine copula models to a global data set of North-American, European and Asian equity and implied-volatility indices to investigate whether distinct global dependence regimes exist. Unlike prior work limited to single regions or asset types, the model allows the entire (possibly non-Gaussian, tail-asymmetric) dependence structure to switch between 'normal' and 'abnormal' states across continents. The results confirm the existence of joint points in time at which global regime switching takes place, providing evidence for synchronized cross-market dependence regimes.

**Snowball:** Aas, Czado, Frigessi & Bakken (2009), Pair-copula constructions of multiple dependence, Insurance: Mathematics and Economics (10.1016/j.insmatheco.2007.02.001); Stober & Czado (2014), Regime switches in the dependence structure of multidimensional financial data, CSDA (10.1016/j.csda.2013.01.024)

---

#### Dynamic Factor Allocation Leveraging Regime-Switching Signals
*Yizhan Shu, John M. Mulvey* — 2024 · arXiv (q-fin.PM) / Journal of Portfolio Management · OA

DOI `10.48550/arXiv.2410.14841` · arXiv `2410.14841` · [link](https://arxiv.org/abs/2410.14841)

**Why:** Recent application of sparse statistical jump models to per-factor regime detection feeding a regime-conditioned multi-factor allocation - strong example of regime-conditioned strategy performance.

> Explores dynamic factor allocation by analyzing the cyclical performance of equity style factors (value, size, momentum, quality, low volatility, growth) through regime analysis. A sparse jump model (SJM) identifies bull and bear regimes for each factor using risk/return features from factor active returns plus broader-market variables; the SJM regimes are shown to be more stable and interpretable than traditional methods. Factor-specific regime inferences are integrated into a Black-Litterman framework to build a fully invested, long-only multi-factor portfolio, improving the information ratio relative to the market from 0.05 for an equal-weight benchmark to roughly 0.4, while improving Sharpe ratio and maximum drawdown.

**Snowball:** Shu, Yu & Mulvey (2024), Downside risk reduction using regime-switching signals: a statistical jump model approach, Journal of Asset Management (10.1057/s41260-024-00376-x); Black & Litterman (1992), Global portfolio optimization, Financial Analysts Journal (10.2469/faj.v48.n5.28)

---

#### Enhancing Regime Shift Detection Using Unstructured Data: A Study on the Treasury Market
*Mingxuan Yi, Vidal Mehra, Jing Chen, John Cartlidge* — 2026 · arXiv (q-fin.CP) · OA

DOI `10.48550/arXiv.2605.30363` · arXiv `2605.30363` · [link](https://arxiv.org/abs/2605.30363)

**Why:** Frontier fusion of unstructured policy text (LLM) with structural-break/regime detectors, with an explicit benchmark and anchor list - representative of the newest 2025-2026 regime-detection direction.

> Proposes a text-enhanced regime-shift detection pipeline that combines large-language-model reasoning over central-bank communications with statistical validation on multivariate financial time series. The framework is detector-agnostic: text-proposed candidate shifts are validated using a bootstrap likelihood-ratio test on a vector autoregression, while data-driven candidates from arbitrary regime detectors are ratified through a lenient LLM text check. Evaluated on 2010-2024 FOMC minutes paired with a 14-variable U.S. Treasury and macroeconomic panel using four interchangeable detectors, the pipeline achieves F1 = 0.82 against a verified anchor list of monetary-policy regime shifts with same-day detection latency, outperforming pure data-driven baselines.

**Snowball:** Bai & Perron (2003), Computation and analysis of multiple structural change models, JAE (10.1002/jae.659); Hansen (1992), The likelihood ratio test under nonstandard conditions (Markov-switching), Journal of Applied Econometrics (10.1002/jae.3950070506)

---

#### Autoregressive Conditional Heteroskedasticity and Changes in Regime
*James D. Hamilton, Raul Susmel* — 1994 · Journal of Econometrics · cites: 1257 · completeness-add

DOI `10.1016/0304-4076(94)90067-1` · [link](https://doi.org/10.1016/0304-4076(94)90067-1)

**Why:** The foundational regime-switching VOLATILITY model (SWARCH); the direct intellectual ancestor of every Markov-switching-volatility paper in the collection and the canonical reference for why a single GARCH overstates persistence.

> The authors propose a Markov-switching ARCH (SWARCH) model in which the scale of the conditional variance process is governed by an unobserved discrete state variable following a Markov chain, combining Hamilton's (1989) regime-switching framework with Engle's ARCH. They argue that occasional discrete shifts in the asymptotic (unconditional) variance of returns can generate the spurious appearance of extremely high volatility persistence found in standard GARCH models. Applied to weekly excess returns on three-month Treasury bills, the model identifies regime shifts associated with the 1974 oil shock and the 1979-1982 Federal Reserve monetary-policy experiment, and produces more sensible volatility-persistence estimates and better out-of-sample forecasts than single-regime ARCH.

**Snowball:** Hamilton (1989) A New Approach to the Economic Analysis of Nonstationary Time Series and the Business Cycle (10.2307/1912559); Engle (1982) Autoregressive Conditional Heteroscedasticity with Estimates of the Variance of U.K. Inflation (10.2307/1912773); Bollerslev (1986) Generalized Autoregressive Conditional Heteroskedasticity (10.1016/0304-4076(86)90063-1); Cai (1994) A Markov Model of Switching-Regime ARCH (10.1080/07350015.1994.10524546)

---

#### Modeling the Conditional Distribution of Interest Rates as a Regime-Switching Process
*Stephen F. Gray* — 1996 · Journal of Financial Economics · cites: 1077 · completeness-add

DOI `10.1016/S0304-405X(96)00875-6` · [link](https://doi.org/10.1016/S0304-405X(96)00875-6)

**Why:** The canonical solution to the path-dependence problem in Markov-switching GARCH; the standard reference for tractable regime-switching volatility estimation that the gathered Bulla and Pelletier papers build on.

> Gray develops a generalized regime-switching (GRS) model of the short-term interest rate in which the conditional mean and conditional variance follow GARCH-type dynamics whose parameters switch between two unobserved Markov regimes, with state-dependent and time-varying transition probabilities. A key contribution is a recursive approximation that makes the path-dependent likelihood of a Markov-switching GARCH model tractable by integrating out the regime path at each step. The model nests pure mean-reversion, GARCH, and CIR-type level effects as special cases, and empirically distinguishes a high-mean-reversion/high-volatility regime from a low-volatility regime, fitting U.S. short-rate data substantially better than single-regime alternatives.

**Snowball:** Hamilton & Susmel (1994) Autoregressive Conditional Heteroskedasticity and Changes in Regime (10.1016/0304-4076(94)90067-1); Cox, Ingersoll & Ross (1985) A Theory of the Term Structure of Interest Rates (10.2307/1911242); Hamilton (1988) Rational-Expectations Econometric Analysis of Changes in Regime (10.1016/0165-1889(88)90048-9)

---

#### A New Approach to Markov-Switching GARCH Models
*Markus Haas, Stefan Mittnik, Marc S. Paolella* — 2004 · Journal of Financial Econometrics · cites: 374 · completeness-add

DOI `10.1093/jjfinec/nbh020` · [link](https://doi.org/10.1093/jjfinec/nbh020)

**Why:** The modern, analytically tractable formulation of Markov-switching GARCH that solves Gray's path-dependence problem; standard reference for regime-conditioned volatility modeling underlying realized-covariance regime work in the set.

> The authors propose a Markov-switching GARCH model in which each regime carries its own self-contained GARCH process, so that the conditional variance in a given state depends only on that state's past variances rather than on the entire latent regime path. This decoupling removes the path-dependence that made earlier MS-GARCH models (e.g. Gray 1996) require approximations, yielding closed-form stationarity conditions, analytic expressions for moments and the autocorrelation of squared returns, and straightforward maximum-likelihood estimation. Applied to stock-index returns, the specification cleanly separates low- and high-volatility regimes and improves both in-sample fit and out-of-sample volatility forecasts relative to single-regime GARCH.

**Snowball:** Gray (1996) Modeling the Conditional Distribution of Interest Rates as a Regime-Switching Process (10.1016/S0304-405X(96)00875-6); Klaassen (2002) Improving GARCH Volatility Forecasts with Regime-Switching GARCH (10.1007/978-3-642-51182-0_10); Hamilton & Susmel (1994) Autoregressive Conditional Heteroskedasticity and Changes in Regime (10.1016/0304-4076(94)90067-1)

---

#### Identifying Bull and Bear Markets in Stock Returns
*John M. Maheu, Thomas H. McCurdy* — 2000 · Journal of Business & Economic Statistics · cites: 280 · completeness-add

DOI `10.1080/07350015.2000.10524851` · [link](https://doi.org/10.1080/07350015.2000.10524851)

**Why:** Canonical model-based (as opposed to algorithmic) bull/bear regime classification; the probabilistic counterpart to the already-gathered Pagan-Sossounov dating rule and a key benchmark for regime-conditioned return/risk analysis.

> This article uses a Markov-switching model that incorporates duration dependence to capture non-linear structure in both the conditional mean and the conditional variance of stock returns. The model sorts returns into a high-return stable state and a low-return volatile state, labeled bull and bear markets respectively. The filter identifies all major stock-market downturns in over 160 years of monthly data. Bull markets have a declining hazard function although the best market gains come at the start of a bull market; volatility increases with duration in bear markets, and allowing volatility to vary with duration captures volatility clustering.

**Snowball:** Hamilton (1989) A New Approach to the Economic Analysis of Nonstationary Time Series and the Business Cycle (10.2307/1912559); Durland & McCurdy (1994) Duration-Dependent Transitions in a Markov Model of U.S. GNP Growth (10.1080/07350015.1994.10524553); Schwert (1989) Why Does Stock Market Volatility Change Over Time? (10.1111/j.1540-6261.1989.tb02647.x)

---

#### Duration Dependence in Stock Prices: An Analysis of Bull and Bear Markets
*Asger Lunde, Allan Timmermann* — 2004 · Journal of Business & Economic Statistics · cites: 190 · completeness-add

DOI `10.1198/073500104000000136` · [link](https://doi.org/10.1198/073500104000000136)

**Why:** Bridges algorithmic turning-point dating (Bry-Boschan/Pagan-Sossounov, gathered) with formal duration-dependence testing; key empirical reference on how bull/bear-state persistence affects strategy timing.

> The authors classify stock-price movements into bull and bear markets using a filtering rule based on the size of cumulative price reversals (a threshold/peak-trough algorithm rather than a parametric switching model), and then test for duration dependence in the resulting phases. Using more than a century of daily U.S. equity prices, they find strong duration dependence in bull markets - the probability of a bull market ending decreases the longer it has lasted - but little duration dependence in bear markets. They show the chosen filtering thresholds materially affect inferred bull/bear durations and document state-dependence in expected returns and volatility that has implications for market-timing and regime-conditioned strategies.

**Snowball:** Maheu & McCurdy (2000) Identifying Bull and Bear Markets in Stock Returns (10.1080/07350015.2000.10524851); Pagan & Sossounov (2003) A Simple Framework for Analysing Bull and Bear Markets (10.1002/jae.664); Bry & Boschan (1971) Cyclical Analysis of Time Series: Selected Procedures and Computer Programs

---

#### Cyclical Analysis of Time Series: Selected Procedures and Computer Programs
*Gerhard Bry, Charlotte Boschan* — 1971 · NBER (National Bureau of Economic Research), Technical Paper 20 / Columbia University Press · OA · completeness-add

[link](https://www.nber.org/books-and-chapters/cyclical-analysis-time-series-selected-procedures-and-computer-programs)

**Why:** The original algorithmic turning-point / market-state dating procedure underlying the gathered Pagan-Sossounov and Lunde-Timmermann work; the canonical non-parametric alternative to Markov-switching regime identification.

> This NBER monograph introduces a fully algorithmic, replicable procedure for dating the turning points (peaks and troughs) of economic time series, automating the NBER reference-cycle methodology of Burns and Mitchell. The Bry-Boschan algorithm identifies local extrema in smoothed series and then enforces censoring rules - minimum phase durations, minimum full-cycle durations, and alternation of peaks and troughs - to produce an objective chronology of expansions and contractions. Originally developed for business cycles, the procedure became the standard mechanical method for identifying bull and bear phases in financial markets and is the direct ancestor of the dating rules used in modern market-state classification.

**Snowball:** Burns & Mitchell (1946) Measuring Business Cycles; Pagan & Sossounov (2003) A Simple Framework for Analysing Bull and Bear Markets (10.1002/jae.664); Harding & Pagan (2002) Dissecting the Cycle: A Methodological Investigation (10.1016/S0304-3932(01)00108-8)

---

#### Regime Shifts: Implications for Dynamic Strategies
*Mark Kritzman, Sebastien Page, David Turkington* — 2012 · Financial Analysts Journal · cites: 110 · completeness-add

DOI `10.2469/faj.v68.n3.3` · [link](https://doi.org/10.2469/faj.v68.n3.3)

**Why:** The practitioner-canonical paper linking Markov-switching regime forecasts to dynamic asset allocation; bridges the academic switching literature and the regime-conditioned strategy-performance theme central to this review.

> Regime shifts present challenges for investors because they cause realized performance to depart significantly from the ranges implied by long-term averages of means and covariances, but they also present opportunities for gain. The authors apply two-state Markov-switching models to forecast regimes in three economically meaningful variables - market turbulence (a Mahalanobis-distance measure of statistically unusual returns), inflation, and economic growth - and use the regime probabilities to drive dynamic asset allocation. In backtests, the dynamic, regime-aware process outperforms static asset allocation, with the largest benefits accruing to investors most concerned with avoiding large losses, demonstrating the practical value of conditioning strategy on inferred market state.

**Snowball:** Kritzman & Li (2010) Skulls, Financial Turbulence, and Risk Management (10.2469/faj.v66.n5.3); Ang & Bekaert (2002) International Asset Allocation With Regime Shifts (10.1093/rfs/15.4.1137); Hamilton (1989) A New Approach to the Economic Analysis of Nonstationary Time Series (10.2307/1912559)

---

#### Learning Hidden Markov Models with Persistent States by Penalizing Jumps
*Peter Nystrup, Erik Lindstrom, Henrik Madsen* — 2020 · Expert Systems with Applications · cites: 31 · completeness-add

DOI `10.1016/j.eswa.2020.113307` · [link](https://doi.org/10.1016/j.eswa.2020.113307)

**Why:** The foundational statistical jump model that DIRECTLY underpins the already-gathered Shu-Yu-Mulvey (2024), Shu-Mulvey (2024) and Nystrup-Kolm-Lindstrom (2020) papers; an omitted lineage anchor for the persistent-state regime-detection thread.

> The authors introduce the statistical jump model, a discrete-state regime-identification framework that fits a clustering-like model to time-series features while adding an explicit penalty on the number of state transitions (jumps), thereby producing more persistent and interpretable regime sequences than a standard hidden Markov model. The jump penalty acts as a tunable bias toward temporal stability, mitigating the spurious rapid switching that plagues HMM estimation on noisy financial data, and the model is fit with an efficient coordinate-descent algorithm that alternates between assigning states and updating cluster parameters. On simulated and empirical return data the jump model recovers regimes more accurately and robustly than the baseline HMM, especially when states are persistent and observation distributions overlap.

**Snowball:** Bemporad et al. (2018) Fitting Jump Models (10.1016/j.automatica.2018.03.007); Nystrup, Madsen & Lindstrom (2015) Stylised Facts of Financial Time Series and Hidden Markov Models in Continuous Time (10.1080/14697688.2015.1004801); Hamilton (1989) A New Approach to the Economic Analysis of Nonstationary Time Series (10.2307/1912559)

---

#### Geometric Observables for Financial Regime Detection
*Will Hammond* — 2026 · arXiv preprint (q-fin.ST) · cites: 0 · OA · completeness-add

arXiv `2605.17117` · [link](https://arxiv.org/abs/2605.17117)

**Why:** Frontier (2026) unsupervised regime-detection method using spectral-geometry of realized covariances; extends the realized-covariance and unsupervised-clustering threads (Bucci-Ciciretti, Horvath-Issa) already in the set with a novel feature family and a large benchmark.

> The paper extracts four geometric observables - Berry Phase Rate, Spectral Entropy, Reduced State Purity, and Hamiltonian Sensitivity - from spectral embeddings of equity return cross-sections and uses them as unsupervised detectors of market regime shifts. Drawing on a quantum-geometric analogy, these scalar observables summarize the curvature and mixing of the return covariance spectrum over time. Evaluated against 46 baselines across 17 historical crises (2000-2024), the Berry Phase Rate detector achieves an effect size of Cohen's d = 0.72 while generating 67% fewer false alarms than a supervised Random Forest, suggesting geometric/spectral structure provides a robust, interpretable, and label-free signal for regime change.

**Snowball:** Horvath, Issa & Muguruza (2021) Clustering Market Regimes Using the Wasserstein Distance (2110.11848); Bucci & Ciciretti (2022) Market Regime Detection via Realized Covariances (2104.03667); Kritzman & Li (2010) Skulls, Financial Turbulence, and Risk Management (10.2469/faj.v66.n5.3)

---

#### Multi-regime Markov-switching Models with Time-varying Transition Probabilities: An Application to U.S. Treasury Yields
*Samuel Modee, Yushu Li, Sjur Westgaard, Stein Andreas Bethuelsen* — 2026 · arXiv preprint (stat.ME / econ.EM / q-fin.ST) · cites: 0 · OA · completeness-add

arXiv `2605.14976` · [link](https://arxiv.org/abs/2605.14976)

**Why:** Recent (2026) methodological advance generalizing Markov-switching with time-varying transition probabilities to many regimes; relevant to fixed-income regime detection and complements the gathered Treasury-market regime work (Yi et al. 2026).

> The authors extend the two-regime generalized autoregressive score (GAS) framework to a K-regime Markov-switching model with time-varying transition probabilities (TVTP), allowing regime-specific means and variances and letting transition probabilities depend on exogenous covariates. They provide identification and estimation procedures, comprehensive Monte Carlo simulations, and an open-source R package. Applied to U.S. Treasury zero-coupon yields from 1961-2024, the model shows that exogenous-covariate TVTP specifications outperform constant and lagged-change transition models in fit and regime characterization, improving inference about persistence and switching dynamics in fixed-income markets.

**Snowball:** Diebold, Lee & Weinbach (1994) Regime Switching with Time-Varying Transition Probabilities; Filardo (1994) Business-Cycle Phases and Their Transitional Dynamics (10.1080/07350015.1994.10524547); Creal, Koopman & Lucas (2013) Generalized Autoregressive Score Models (10.1002/jae.1279)

---

#### Regime-Based Portfolio Allocation Using Hidden Markov Models and Reinforcement Learning
*Ajay Kumar Verma, Nunik Srikandi Putri, Neo Paul Lesupi* — 2026 · arXiv preprint (q-fin.PM / q-fin.ST) · cites: 0 · OA · completeness-add

arXiv `2605.27848` · [link](https://arxiv.org/abs/2605.27848)

**Why:** Recent (2026) example coupling HMM regime detection with reinforcement-learning allocation - the regime-conditioned strategy-performance theme central to this review; complements the gathered Markov-switching allocation papers with a modern RL control layer.

> This paper integrates a three-state Gaussian hidden Markov model with reinforcement learning for dynamic multi-asset allocation across SPY (equities), TLT (Treasuries), and GLD (gold) over 2004-2025. The HMM characterizes low-volatility, transitional, and high-volatility regimes that exhibit strong persistence and clearly state-dependent return distributions, and the inferred regime probabilities are supplied as state inputs to an RL policy that learns regime-conditioned allocation actions. The resulting RL policy achieves the highest risk-adjusted performance among the compared approaches while remaining interpretable through its explicit regime-dependent actions, illustrating how regime inference can be combined with learned control for tactical allocation.

**Snowball:** Guidolin & Timmermann (2007) Asset Allocation Under Multivariate Regime Switching (10.1016/j.jedc.2006.12.004); Nystrup, Hansen, Madsen & Lindstrom (2015) Regime-Based Versus Static Asset Allocation (10.3905/jpm.2015.42.1.103); Bulla et al. (2011) Markov-Switching Asset Allocation: Do Profitable Strategies Exist? (10.1016/j.jempfin.2010.11.009)

---

