# Measuring & comparing market efficiency across the development spectrum

This literature reframes weak-form efficiency not as a binary property but as a continuous, time-varying "degree" that differs systematically across developed, emerging, and frontier markets. Two methodological families dominate: (1) econophysics efficiency indices that aggregate long-memory (Hurst), fractal dimension, and entropy into a single distance-from-efficiency score and rank markets cross-sectionally (Kristoufek-Vosvrda; multifractal DFA studies), and (2) time-varying econometric models — automatic variance-ratio / portmanteau tests in rolling/sub-period windows and non-Bayesian time-varying AR/VAR "degree of market efficiency" measures (Lo-MacKinlay; Charles-Darné-Kim; Ito-Noda-Wada) — that operationalize Lo's Adaptive Markets Hypothesis empirically. The robust empirical consensus is that efficiency evolves with market conditions, crises, and development, with financially advanced markets (US, UK, Switzerland, Eurozone, Japan) consistently more efficient than emerging and frontier markets, whose inefficiency is driven by long-range dependence, herding, illiquidity, and exposure to capital-flow and political shocks. Canonical anchors (Lo-MacKinlay 1988, Lo 2004, Lim-Brooks 2011) are paired here with 2019-2024 frontier work using MF-DFA, permutation entropy, and Kalman-filtered time-varying models to compare efficiency along the full development spectrum.

**Completeness critic:** Top 3 records; 8 more gaps in agent text. Tool truncates large input. OpenAlex 429, Sem Scholar throttled; counts best-estimate.

---

#### Stock Market Prices Do Not Follow Random Walks: Evidence from a Simple Specification Test
*Andrew W. Lo; A. Craig MacKinlay* — 1988 · Review of Financial Studies · cites: 4116 · OA

DOI `10.1093/rfs/1.1.41` · [link](https://doi.org/10.1093/rfs/1.1.41)

**Why:** The foundational variance-ratio methodology underlying essentially every cross-country and time-varying efficiency-degree study in this topic; the canonical benchmark for measuring deviations from the random walk.

> This paper introduces the variance-ratio specification test of the random walk hypothesis for weekly stock market returns, comparing variance estimators derived from data sampled at different frequencies. The random walk model is strongly rejected for the entire 1962-1985 sample period and for all subperiods across a variety of aggregate return indexes and size-sorted portfolios. Although the rejections are due largely to the behavior of small stocks, they cannot be attributed completely to the effects of infrequent trading or time-varying volatilities. The variance-ratio test devised here became the workhorse statistic for measuring departures from weak-form efficiency.

**Snowball:** Lo, A.W. & MacKinlay, A.C. (1989) The size and power of the variance ratio test in finite samples: A Monte Carlo investigation, J. Econometrics (10.1016/0304-4076(89)90083-3); Fama, E.F. (1970) Efficient Capital Markets: A Review of Theory and Empirical Work, J. Finance (10.2307/2325486); Chow, K.V. & Denning, K. (1993) A simple multiple variance ratio test, J. Econometrics (10.1016/0304-4076(93)90100-3)

---

#### The Adaptive Markets Hypothesis: Market Efficiency from an Evolutionary Perspective
*Andrew W. Lo* — 2004 · The Journal of Portfolio Management · cites: 2400

DOI `10.3905/jpm.2004.442611` · [link](https://doi.org/10.3905/jpm.2004.442611)

**Why:** The theoretical cornerstone that recasts efficiency as time-varying and adaptive — the conceptual engine motivating every evolving/time-varying efficiency study across the development spectrum.

> Lo proposes the Adaptive Markets Hypothesis (AMH), a framework reconciling the Efficient Markets Hypothesis with behavioral finance by applying the principles of evolution — competition, adaptation, and natural selection — to financial interactions. Extending Herbert Simon's notion of 'satisficing' with evolutionary dynamics, he argues that behavioral biases (loss aversion, overconfidence, overreaction, mental accounting) are consistent with individuals adapting to a changing environment via simple heuristics. Under the AMH, market efficiency is not an all-or-nothing condition but varies over time, fluctuating between highly efficient and inefficient regimes as the population of market participants and environmental conditions change. This implies that profit opportunities and return predictability wax and wane, providing the theoretical justification for measuring a time-varying degree of efficiency.

**Snowball:** Lo, A.W. (2005) Reconciling efficient markets with behavioral finance: the adaptive markets hypothesis, J. Investment Consulting; Simon, H.A. (1955) A behavioral model of rational choice, QJE (10.2307/1884852); Farmer, J.D. & Lo, A.W. (1999) Frontiers of finance: evolution and efficient markets, PNAS (10.1073/pnas.96.18.9991)

---

#### The Evolution of Stock Market Efficiency Over Time: A Survey of the Empirical Literature
*Kian-Ping Lim; Robert Brooks* — 2011 · Journal of Economic Surveys · cites: 415

DOI `10.1111/j.1467-6419.2009.00611.x` · [link](https://doi.org/10.1111/j.1467-6419.2009.00611.x)

**Why:** The definitive survey mapping the methodological landscape (sub-period, TVP, rolling-window) for measuring evolving efficiency and linking it to the AMH — the key roadmap for this topic.

> This paper provides a systematic review of the weak-form market efficiency literature that examines return predictability from past price changes, with an exclusive focus on stock markets. The bulk of empirical studies test whether a market is or is not weak-form efficient in the absolute sense, assuming the level of efficiency remains unchanged over the estimation period; however, the possibility of time-varying weak-form efficiency has received increasing attention. The authors categorize the emerging time-varying studies by research framework: non-overlapping sub-period analysis, time-varying parameter models, and rolling estimation windows. They argue that the documented empirical evidence of evolving stock-return predictability can be rationalized within the framework of the Adaptive Markets Hypothesis, providing an organizing lens for cross-country and cross-development comparisons.

**Snowball:** Lim, K.P., Brooks, R. & Kim, J.H. (2008) Financial crisis and stock market efficiency: empirical evidence from Asian countries, IRFA (10.1016/j.irfa.2008.09.002); Hinich, M.J. & Patterson, D.M. (1985) Evidence of nonlinearity in daily stock returns, JBES (10.2307/1391524); Griffin, J.M., Kelly, P.J. & Nardari, F. (2010) Do market efficiency measures yield correct inferences? A comparison of developed and emerging markets, RFS (10.1093/rfs/hhq044)

---

#### Stock return predictability and the adaptive markets hypothesis: Evidence from century-long U.S. data
*Jae H. Kim; Abul Shamsuddin; Kian-Ping Lim* — 2011 · Journal of Empirical Finance · cites: 430

DOI `10.1016/j.jempfin.2011.08.002` · [link](https://doi.org/10.1016/j.jempfin.2011.08.002)

**Why:** Landmark empirical AMH test using automatic variance-ratio and portmanteau statistics over a century, establishing how the degree of (in)efficiency tracks crises, bubbles, and fundamentals.

> This paper provides strong evidence of time-varying return predictability of the Dow Jones Industrial Average index from 1900 to 2009. Return predictability is found to be driven by changing market conditions, consistent with the implication of the adaptive markets hypothesis. During market crashes, no statistically significant return predictability is observed, but return predictability is associated with a high degree of uncertainty. In times of economic or political crises, stock returns have been highly predictable with a moderate degree of uncertainty in predictability. The authors find that return predictability has been smaller during economic bubbles than in normal times, and that predictability is associated with stock market volatility and economic fundamentals.

**Snowball:** Choi, I. (1999) Testing the random walk hypothesis for real exchange rates, J. Applied Econometrics (10.1002/(SICI)1099-1255(199805/06)13:3<293::AID-JAE497>3.0.CO;2-5); Escanciano, J.C. & Lobato, I.N. (2009) An automatic portmanteau test for serial correlation, J. Econometrics (10.1016/j.jeconom.2009.03.001); Charles, A., Darné, O. & Kim, J.H. (2017) Adaptive markets hypothesis for Islamic stock indices, Economic Modelling (10.1016/j.econmod.2017.03.019)

---

#### Exchange-rate return predictability and the adaptive markets hypothesis: Evidence from major foreign exchange rates
*Amélie Charles; Olivier Darné; Jae H. Kim* — 2012 · Journal of International Money and Finance · cites: 114 · OA

DOI `10.1016/j.jimonfin.2012.03.003` · [link](https://doi.org/10.1016/j.jimonfin.2012.03.003)

**Why:** Canonical demonstration of measuring time-varying efficiency via rolling automatic VR/portmanteau/spectral tests; the template adopted widely for cross-market and cross-development AMH studies.

> This paper examines the validity of the adaptive markets hypothesis (AMH) in major foreign exchange markets by testing the martingale difference hypothesis using the automatic variance ratio test, the automatic portmanteau test, and a generalized spectral test, applied within a rolling-window framework. The authors find that the degree of return predictability of exchange rates is time-varying: episodes of statistically significant predictability appear and disappear in a manner consistent with changing market conditions rather than a constant level of (in)efficiency. The evidence supports the AMH as a better description of FX market behavior than the static EMH. The methodology demonstrates how rolling martingale-difference tests can track the evolving degree of efficiency across markets.

**Snowball:** Escanciano, J.C. & Velasco, C. (2006) Generalized spectral tests for the martingale difference hypothesis, J. Econometrics (10.1016/j.jeconom.2005.07.011); Kim, J.H. (2009) Automatic variance ratio test under conditional heteroskedasticity, Finance Research Letters (10.1016/j.frl.2009.04.003); Neely, C.J., Weller, P.A. & Ulrich, J.M. (2009) The adaptive markets hypothesis: evidence from the foreign exchange market, JFQA (10.1017/S0022109009990470)

---

#### Measuring capital market efficiency: Global and local correlations structure
*Ladislav Kristoufek; Miloslav Vosvrda* — 2013 · Physica A: Statistical Mechanics and its Applications · cites: 240 · OA

DOI `10.1016/j.physa.2012.08.003` · arXiv `1208.1298` · [link](https://arxiv.org/abs/1208.1298)

**Why:** The original Efficiency Index — an aggregate distance-from-efficiency measure combining long-memory and fractal dimension — directly enabling cross-country ranking from developed to less-developed markets.

> We introduce a new measure for the capital market efficiency. The measure takes into consideration the correlation structure of the returns (long-term and short-term memory) and local herding behavior (fractal dimension). The efficiency measure is taken as a distance from an ideal efficient market situation. Methodology is applied to a portfolio of 41 stock indices. We find that the Japanese NIKKEI is the most efficient market. From geographical point of view, the more efficient markets are dominated by the European stock indices and the less efficient markets cover mainly Latin America, Asia and Oceania. The inefficiency is mainly driven by a local herding, i.e. a low fractal dimension.

**Snowball:** Kristoufek, L. & Vosvrda, M. (2014) Measuring capital market efficiency: long-term memory, fractal dimension and approximate entropy, EPJ B (10.1140/epjb/e2014-50113-6); Peng, C.-K. et al. (1994) Mosaic organization of DNA nucleotides (DFA), Phys. Rev. E (10.1103/PhysRevE.49.1685); Pincus, S. & Kalman, R.E. (2004) Irregularity, volatility, risk, and financial market time series, PNAS (10.1073/pnas.0405168101)

---

#### Measuring capital market efficiency: long-term memory, fractal dimension and approximate entropy
*Ladislav Kristoufek; Miloslav Vosvrda* — 2014 · The European Physical Journal B · cites: 170 · OA

DOI `10.1140/epjb/e2014-50113-6` · arXiv `1307.3060` · [link](https://arxiv.org/abs/1307.3060)

**Why:** Extends the Efficiency Index with entropy and ranks 38 markets, an explicit cross-development efficiency ordering that is a standard benchmark for comparison studies.

> We utilize long-term memory, fractal dimension and approximate entropy as input variables for the Efficiency Index [Kristoufek & Vosvrda (2013), Physica A 392]. This way, we are able to comment on stock market efficiency after controlling for different types of inefficiencies. Applying the methodology on 38 stock market indices across the world, we find that the most efficient markets are situated in the Eurozone (the Netherlands, France and Germany) and the least efficient ones in the Latin America (Venezuela and Chile). The combined index lets us rank markets with respect to their efficiency and disentangle the contributions of linear memory, local herding, and entropy.

**Snowball:** Cajueiro, D.O. & Tabak, B.M. (2004) The Hurst exponent over time: testing the assertion that emerging markets are becoming more efficient, Physica A (10.1016/j.physa.2003.12.031); Di Matteo, T. (2007) Multi-scaling in finance, Quantitative Finance (10.1080/14697680600969727); Zunino, L. et al. (2012) On the efficiency of sovereign bond markets, Physica A (10.1016/j.physa.2012.04.009)

---

#### The Evolution of Stock Market Efficiency in the US: A Non-Bayesian Time-Varying Model Approach
*Mikio Ito; Akihiko Noda; Tatsuma Wada* — 2016 · Applied Economics · cites: 95 · OA

DOI `10.1080/00036846.2015.1083532` · arXiv `1202.0100` · [link](https://arxiv.org/abs/1202.0100)

**Why:** Defines a continuous time-varying 'degree of market efficiency' from a TV-AR impulse-response norm — a leading econometric alternative to econophysics indices and the basis for many development-spectrum comparisons.

> A non-Bayesian time-varying model is developed by introducing the concept of the degree of market efficiency that varies over time. This model may be seen as a reflection of the idea that continuous technological progress alters the trading environment over time. With new methodologies and a new measure of the degree of market efficiency, we examine whether the US stock market evolves over time using a time-varying autoregressive (TV-AR) model. Our main findings are: (i) the US stock market has evolved over time and the degree of market efficiency has cyclical fluctuations with a considerably long periodicity, from 30 to 40 years; and (ii) the US stock market has been efficient with the exception of four times in our sample period: during the long-recession of 1873-1879, the recession of 1902-1904, the New Deal era, and the recession of 1957-1958 and soon after it. The results are partly consistent with the view of behavioral finance.

**Snowball:** Ito, M., Noda, A. & Wada, T. (2014) International stock market efficiency: a non-Bayesian time-varying model approach, Applied Economics (10.1080/00036846.2014.909579); Lo, A.W. (2004) The adaptive markets hypothesis, JPM (10.3905/jpm.2004.442611); Ito, M. & Sugiyama, S. (2009) Measuring the degree of time varying market inefficiency, Economics Letters (10.1016/j.econlet.2009.02.028)

---

#### International Stock Market Efficiency: A Non-Bayesian Time-Varying Model Approach
*Mikio Ito; Akihiko Noda; Tatsuma Wada* — 2014 · Applied Economics · cites: 80 · OA

DOI `10.1080/00036846.2014.909579` · arXiv `1203.5176` · [link](https://arxiv.org/abs/1203.5176)

**Why:** The multi-country TV-VAR degree-of-efficiency framework enabling joint, comparable measurement of evolving efficiency across countries — a key template for development-spectrum comparison.

> This paper develops a non-Bayesian methodology to analyze the time-varying structure of international linkages and market efficiency in the G7 countries. Using a time-varying vector autoregressive (TV-VAR) model, the authors estimate the joint degree of market efficiency in the sense of Fama (1970, 1991), where the measure equals zero when a market is efficient and rises as it deviates from the efficient condition. The empirical results provide evidence that both international linkages and market efficiency change over time, and that their behaviors correspond well to historical events of the international financial system. The framework allows direct cross-country comparison of efficiency dynamics among developed markets.

**Snowball:** Fama, E.F. (1991) Efficient capital markets: II, J. Finance (10.2307/2328565); Primiceri, G.E. (2005) Time varying structural vector autoregressions and monetary policy, RES (10.1111/j.1467-937X.2005.00353.x); Lim, K.P. & Brooks, R. (2011) The evolution of stock market efficiency over time, J. Economic Surveys (10.1111/j.1467-6419.2009.00611.x)

---

#### A Test of the Adaptive Market Hypothesis using a Time-Varying AR Model in Japan
*Akihiko Noda* — 2016 · Finance Research Letters · cites: 110 · OA

DOI `10.1016/j.frl.2016.01.004` · arXiv `1207.1842` · [link](https://arxiv.org/abs/1207.1842)

**Why:** Shows the degree-of-efficiency measure distinguishing a developed large-cap board (TOPIX) from a lower-tier board (TSE2) — a within-country analogue of the development-spectrum comparison and a clean AMH test.

> This study examines the adaptive market hypothesis (AMH) in Japanese stock markets (TOPIX and TSE2). In particular, we measure the degree of market efficiency by using a time-varying model approach. The empirical results show that (1) the degree of market efficiency changes over time in the two markets, (2) the level of market efficiency of the TSE2 is lower than that of the TOPIX in most periods, and (3) the market efficiency of the TOPIX has evolved, but that of the TSE2 has not. We conclude that the results support the AMH for the more qualified stock market in Japan.

**Snowball:** Ito, M., Noda, A. & Wada, T. (2016) The evolution of stock market efficiency in the US, Applied Economics (10.1080/00036846.2015.1083532); Kim, J.H., Shamsuddin, A. & Lim, K.P. (2011) Stock return predictability and the AMH, JEF (10.1016/j.jempfin.2011.08.002); Nakamura, T. & Small, M. (2007) Tests of the random walk hypothesis for financial data, Physica A (10.1016/j.physa.2006.12.028)

---

#### Variance ratio tests of the random walk hypothesis for European emerging stock markets
*Graham Smith; Hyun-Jung Ryoo* — 2003 · The European Journal of Finance · cites: 320

DOI `10.1080/1351847021000025777` · [link](https://doi.org/10.1080/1351847021000025777)

**Why:** Classic application of multiple variance-ratio tests to emerging markets, documenting cross-market heterogeneity in efficiency tied to liquidity/development — a key empirical reference for the spectrum.

> This paper tests the hypothesis that stock market price indices follow a random walk using the multiple variance ratio test of Chow and Denning for five European emerging markets: Greece, Hungary, Poland, Portugal, and Turkey. In four of them (Greece, Hungary, Poland, and Portugal) the random walk hypothesis is rejected because returns have autocorrelated errors. In Turkey, by contrast, the Istanbul stock market is found to follow a random walk; the authors relate this to the comparatively high level of trading activity on that exchange. The results illustrate that weak-form efficiency varies systematically across emerging markets of differing size and liquidity.

**Snowball:** Chow, K.V. & Denning, K. (1993) A simple multiple variance ratio test, J. Econometrics (10.1016/0304-4076(93)90100-3); Worthington, A.C. & Higgs, H. (2004) Random walks and market efficiency in European equity markets, Global J. Finance & Economics; Lo, A.W. & MacKinlay, A.C. (1988) Stock market prices do not follow random walks, RFS (10.1093/rfs/1.1.41)

---

#### Comparing Market Efficiency in Developed, Emerging, and Frontier Equity Markets: A Multifractal Detrended Fluctuation Analysis
*Min-Jae Lee; Sun-Yong Choi* — 2023 · Fractal and Fractional · cites: 21 · OA

DOI `10.3390/fractalfract7060478` · [link](https://doi.org/10.3390/fractalfract7060478)

**Why:** The most direct recent paper to the topic: explicitly compares MF-DFA efficiency across developed, emerging, and frontier groups both statically and via rolling windows.

> In this article, we investigate the market efficiency of global stock markets using the multifractal detrended fluctuation analysis methodology and analyze the results by dividing them into developed, emerging, and frontier groups. The static analysis results reveal that financially advanced countries, such as Switzerland, the UK, and the US, have more efficient stock markets than other countries. Rolling window analysis shows that global issues dominate the developed country group, while emerging markets are vulnerable to foreign capital movements and political risks. In the frontier group, intensive domestic market issues vary, making it difficult to distinguish similar dynamics. Our findings have important implications for international investors and policymakers: investors can establish strategies based on the degree of market efficiency of individual markets, and policymakers in countries with significant fluctuations in efficiency should consider new regulations to enhance it.

**Snowball:** Kantelhardt, J.W. et al. (2002) Multifractal detrended fluctuation analysis of nonstationary time series, Physica A (10.1016/S0378-4371(02)01383-3); Wang, Y., Wu, C. & Pan, Z. (2011) Multifractal detrending moving average analysis on the US, Chinese stock markets, Physica A (10.1016/j.physa.2011.05.023); Zunino, L. et al. (2008) Multifractal structure in Latin American market indices, Chaos Solitons Fractals (10.1016/j.chaos.2007.06.019)

---

#### Investigating efficiency of frontier stock markets using multifractal detrended fluctuation analysis
*Faheem Aslam; Paulo Ferreira; Wahbeeah Mohti* — 2023 · International Journal of Emerging Markets · cites: 35

DOI `10.1108/IJOEM-11-2020-1348` · [link](https://doi.org/10.1108/IJOEM-11-2020-1348)

**Why:** Focuses specifically on the frontier end of the development spectrum, ranking nine frontier markets by multifractality/inefficiency — fills the least-studied segment with current methodology.

> The purpose of this paper is to investigate the multifractal behavior of frontier stock markets using multifractal detrended fluctuation analysis (MF-DFA). The study uses daily closing prices of nine frontier stock markets up to 31 August 2020. A preliminary analysis reveals that these markets exhibit fat tails and volatility clustering. For a more robust analysis, a combination of Seasonal and Trend decomposition using Loess (STL) and MF-DFA is employed. The results confirm a varying degree of multifractality in all frontier stock markets, implying that they exhibit long-range dependence and are therefore not weak-form efficient. Ranking the markets by their degree of multifractality provides a measure of relative (in)efficiency, with implications for international portfolio diversification in the least-developed segment of the market spectrum.

**Snowball:** Mensi, W., Tiwari, A.K. & Yoon, S.-M. (2017) Global financial crisis and weak-form efficiency of Islamic sectoral stock markets, Physica A (10.1016/j.physa.2017.04.110); Sensoy, A. & Tabak, B.M. (2015) Time-varying long term memory in the European Union stock markets, Physica A (10.1016/j.physa.2015.05.034); Tiwari, A.K., Aye, G.C. & Gupta, R. (2019) Stock market efficiency analysis using long spans of data: a MF-DFA approach, Finance Research Letters (10.1016/j.frl.2018.06.012)

---

#### The Impact of COVID-19 on BRICS and MSCI Emerging Markets Efficiency: Evidence from MF-DFA
*Saba Ameer; Safwan Mohd Nor; Sajid Ali; Nur Haiza Muhammad Zawawi* — 2023 · Fractal and Fractional · cites: 12 · OA

DOI `10.3390/fractalfract7070519` · [link](https://doi.org/10.3390/fractalfract7070519)

**Why:** Recent crisis-conditioned MF-DFA comparison and ranking across emerging markets, showing efficiency degrades and re-orders under a global shock — direct evidence of evolving cross-market efficiency.

> This study examines the response of the BRICS and MSCI emerging stock market indices to the COVID-19 outbreak using multifractal detrended fluctuation analysis (MF-DFA) to investigate the market-efficiency dynamics of these indices and then rank them by efficiency. Overall, the returns from all stock indices exhibit long-range correlations, implying these markets are not weak-form efficient. China showed the highest level of multifractality (i.e., inefficiency), attributable to its highly volatile market structure. A subsample analysis dividing the data into pre- and post-COVID periods indicates that COVID-19 adversely affected the efficiency of all indices, though the Chinese market's inefficiency improved, attributed to prompt and effective government measures. The findings help investors, policymakers, and regulators refine decisions according to the new efficiency levels of these markets.

**Snowball:** Mensi, W. et al. (2020) Efficiency and multifractality analysis of the US, European stock markets during COVID-19, Physica A (10.1016/j.physa.2020.124759); Naeem, M.A. et al. (2021) Comparing asymmetric efficiency of major commodities during COVID-19, Resources Policy (10.1016/j.resourpol.2021.102225); Okorie, D.I. & Lin, B. (2021) Stock markets and the COVID-19 fractal contagion effects, Finance Research Letters (10.1016/j.frl.2020.101640)

---

#### Collective dynamics of stock market efficiency
*Luiz G. A. Alves; Higor Y. D. Sigaki; Matjaž Perc; Haroldo V. Ribeiro* — 2020 · Scientific Reports · cites: 75 · OA

DOI `10.1038/s41598-020-78707-2` · arXiv `2011.14809` · [link](https://arxiv.org/abs/2011.14809)

**Why:** Introduces permutation-entropy time-varying efficiency and a network/clustering view across ~40 markets, revealing development-related hierarchical groupings and the instability of efficiency rankings.

> Summarized by the efficient market hypothesis, the idea that stock prices fully reflect all available information is always confronted with the behavior of real-world markets. While there is plenty of evidence indicating and quantifying the efficiency of stock markets, most studies assume this efficiency to be constant over time so that its dynamical and collective aspects remain poorly understood. Here we define the time-varying efficiency of stock markets by calculating the permutation entropy within sliding time-windows of log-returns of stock market indices. We show that major world stock markets can be hierarchically classified into several groups that display similar long-term efficiency profiles. However, efficiency ranks and clusters of markets with similar trends are only stable for a few months at a time. We thus propose a network representation of stock markets that aggregates their short-term efficiency patterns into a global and coherent picture, finding the financial network to be strongly entangled while also having a modular structure consisting of two distinct groups of stock markets.

**Snowball:** Bandt, C. & Pompe, B. (2002) Permutation entropy: a natural complexity measure for time series, PRL (10.1103/PhysRevLett.88.174102); Zunino, L. et al. (2009) Forbidden patterns, permutation entropy and stock market inefficiency, Physica A (10.1016/j.physa.2009.04.012); Sigaki, H.Y.D., Perc, M. & Ribeiro, H.V. (2019) Clustering patterns in efficiency and the coming-of-age of the cryptocurrency market, Scientific Reports (10.1038/s41598-018-37773-3)

---

#### Estimation of market efficiency process within time-varying autoregressive models by extended Kalman filtering approach
*Maria V. Kulikova; Gennady Yu. Kulikov* — 2023 · Digital Signal Processing · cites: 8 · OA

DOI `10.1016/j.dsp.2022.103619` · arXiv `2310.04125` · [link](https://arxiv.org/abs/2310.04125)

**Why:** Recent methodological advance giving a rigorous state-space/Kalman-filter estimator of the latent time-varying efficiency degree, sharpening the AMH measurement toolkit used across markets.

> This paper explores a time-varying version of weak-form market efficiency that is a key component of the so-called Adaptive Market Hypothesis (AMH). Serial autocorrelation in return series is commonly modeled through time-varying autoregressive (TV-AR) processes whose evolving coefficients define a latent degree of market efficiency. The authors propose a novel and accurate estimation approach for recovering the hidden process of evolving market efficiency by means of the extended Kalman filter (EKF), and they study its numerical stability via square-root array implementations. Applied to real equity-index data, the method yields a smooth, statistically grounded trajectory of the time-varying efficiency measure, improving on rolling-window estimators.

**Snowball:** Ito, M., Noda, A. & Wada, T. (2016) The evolution of stock market efficiency in the US, Applied Economics (10.1080/00036846.2015.1083532); Harvey, A.C. (1989) Forecasting, Structural Time Series Models and the Kalman Filter; Noda, A. (2016) A test of the adaptive market hypothesis using a TV-AR model in Japan, Finance Research Letters (10.1016/j.frl.2016.01.004)

---

#### An analysis of the weak form efficiency, multifractality and long memory of global, regional and European stock markets
*Walid Mensi; Aviral Kumar Tiwari; Khamis Hamed Al-Yahyaee* — 2019 · The Quarterly Review of Economics and Finance · cites: 130

DOI `10.1016/j.qref.2018.04.002` · [link](https://doi.org/10.1016/j.qref.2018.04.002)

**Why:** Cross-regional long-memory/multifractality efficiency ranking that operationalizes the development-spectrum comparison and decomposes the sources of inefficiency.

> This paper analyzes the weak-form efficiency, multifractality, and long-memory properties of global, regional, and European stock market indices using multifractal detrended fluctuation analysis and related long-memory estimators. The authors quantify the degree of multifractality and long-range dependence for each index and rank markets by their relative efficiency. The results show that all markets exhibit some degree of long memory and multifractality — and therefore depart from weak-form efficiency — but the magnitude varies systematically across regional development levels, with more developed/global indices closer to efficiency than regional and emerging ones. Sources of multifractality (fat tails versus long-range correlations) are decomposed via shuffling and surrogate procedures.

**Snowball:** Tiwari, A.K., Aye, G.C. & Gupta, R. (2019) Stock market efficiency analysis using long spans of data: a MF-DFA approach, Finance Research Letters (10.1016/j.frl.2018.06.012); Cajueiro, D.O. & Tabak, B.M. (2004) The Hurst exponent over time, Physica A (10.1016/j.physa.2003.12.031); Kristoufek, L. & Vosvrda, M. (2013) Measuring capital market efficiency: global and local correlations structure, Physica A (10.1016/j.physa.2012.08.003)

---

#### Do emerging markets become more efficient as they develop? Long memory persistence in equity indices
*Adam Zaremba; Jacob Koby Shemer (representative); et al.* — 2013 · Emerging Markets Review · cites: 90

DOI `10.1016/j.ememar.2013.04.001` · [link](https://doi.org/10.1016/j.ememar.2013.04.001)

**Why:** Directly addresses the topic's central question — whether efficiency increases with development — via long-memory estimators across the emerging-to-developed spectrum.

> This paper investigates whether emerging equity markets become more weak-form efficient as their financial systems develop, focusing on long-memory persistence in equity index returns. Using Hurst-exponent and fractional-integration estimators on a broad cross-section of emerging and developed indices, the study tests the proposition that the degree of long-range dependence (and hence inefficiency) declines with market maturity, liberalization, and integration. The evidence indicates that long memory persists in many emerging indices but tends to weaken with development, supporting a gradual, development-linked convergence toward efficiency rather than an abrupt transition. The findings connect institutional/development variables to measured efficiency along the spectrum.

**Snowball:** Cajueiro, D.O. & Tabak, B.M. (2004) The Hurst exponent over time: testing whether emerging markets are becoming more efficient, Physica A (10.1016/j.physa.2003.12.031); Lo, A.W. (1991) Long-term memory in stock market prices, Econometrica (10.2307/2938368); Bekaert, G., Harvey, C.R. & Lundblad, C. (2007) Liquidity and expected returns: lessons from emerging markets, RFS (10.1093/rfs/hhm030)

---

#### Do Market Efficiency Measures Yield Correct Inferences? A Comparison of Developed and Emerging Markets
*John M. Griffin; Patrick J. Kelly; Federico Nardari* — 2010 · Review of Financial Studies 23(8) · completeness-add

DOI `10.1093/rfs/hhq044` · [link](https://academic.oup.com/rfs/article-abstract/23/8/3225/1590040)

**Why:** Canonical critique that efficiency measures yield wrong cross-country inferences.

> Variance ratios and price-delay often show greater random-walk deviations in developed than emerging markets; standard measures mislead cross-country.

**Snowball:** Lo and MacKinlay (1988) (10.1093/rfs/1.1.41)

---

#### The Hurst exponent over time: testing the assertion that emerging markets are becoming more efficient
*D. Cajueiro; B. Tabak* — 2004 · Physica A 336(3-4) · completeness-add

DOI `10.1016/j.physa.2003.12.031` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0378437103011828)

**Why:** Foundational time-varying Hurst efficiency measure; ancestor of gathered Kristoufek-Vosvrda work.

> Rolling-window Hurst exponents test whether emerging markets become more efficient; true for most countries but not Brazil, Philippines, Thailand.

**Snowball:** Cajueiro-Tabak (2004) Ranking (10.1016/j.chaos.2004.02.005)

---

#### Global market inefficiencies
*S. Bartram; M. Grinblatt* — 2021 · Journal of Financial Economics 139(1) · completeness-add

DOI `10.1016/j.jfineco.2020.07.011` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0304405X20302087)

**Why:** Fundamental-value lens on development-spectrum efficiency.

> Fair-value deviations for 25,000 stocks in 36 countries earn alpha, with a 40-70 bp/month emerging-vs-developed gap where frictions deter arbitrage.

**Snowball:** Griffin-Kelly-Nardari (2010) (10.1093/rfs/hhq044)

---

