# Market efficiency and the martingale null

This section assembles the null models against which the rest of a quantitative-trading review is tested: the efficient market hypothesis (EMH) in its weak/semi-strong/strong forms (Fama 1970), the martingale / fair-game foundation that "properly anticipated prices fluctuate randomly" (Samuelson 1965), and the random-walk model with its workhorse rejection test, the Lo-MacKinlay variance-ratio statistic (1988, 1990). It pairs these with the canonical reasons efficiency cannot be literal or absolute — the Grossman-Stiglitz information paradox (1980), limits to arbitrage (Shleifer-Vishny 1997), and Lo's evolutionary Adaptive Markets Hypothesis (2004) — plus the predictability/forecasting literature that defines what "beating the null" means out-of-sample (Timmermann-Granger 2004; Pesaran-Timmermann 1995; the sobering Welch-Goyal 2008 equity-premium results). The recent frontier (2012-2026) reframes efficiency as a time-varying state variable estimated with TV-AR / GLS / Kalman-filter and information-theoretic and ML methods (Ito-Noda-Wada, Noda, Moews), and supplies empirical and survival-analysis tests of the AMH's natural-selection claims (Ma et al. 2022). Reputable venues dominate (J. Finance, RFS, JEP, AER, J. Portfolio Mgmt, EJOR); several older AER/JPM canonical works have no DOI and are recorded with JSTOR/stable links instead.

**Completeness critic:** The gathered set is strong on the EMH/AMH conceptual lineage (Fama, Samuelson, Grossman-Stiglitz, Lo, Shleifer-Vishny, Malkiel, Shiller, Cochrane) and unusually deep on the Noda/Ito time-varying-AR AMH strand. But it has four clear coverage gaps. (1) METHODOLOGY: the scope explicitly names "variance-ratio tests (Lo-MacKinlay)" yet only the 1988 RFS paper is present; the actual VR test toolkit the review will use to test the null is missing — Lo-MacKinlay (1989, finite-sample size/power), Chow-Denning (1993, joint/multiple VR), Wright (2000, rank- and sign-based VR), and Kim (2009, automatic/wild-bootstrap VR). These are the workhorse estimators for weak-form tests and are near-mandatory. (2) THEORY OF THE NULL'S FAILURE: De Long-Shleifer-Summers-Waldmann (1990) "Noise Trader Risk" is the canonical model behind limits-to-arbitrage and belongs alongside Shleifer-Vishny (1997); Gromb-Vayanos (2010) is the standard survey. (3) PREDICTABILITY ECONOMETRICS: Stambaugh (1999) "Predictive Regressions" (the Stambaugh small-sample bias) and Campbell-Thompson (2007) and Rapach-Strauss-Zhou (2009) are the direct technical counterparts to the already-gathered Welch-Goyal (2008) and Cochrane (2008) debate; Inoue-Kilian (2005) supplies the in- vs out-of-sample critique. (4) AMH EMPIRICS beyond Japan/crypto: Kim-Shamsuddin-Lim (2011, century-long US), Neely-Weller-Ulrich (2009, FX), and Urquhart-McGroarty (2016) are the most-cited AMH evidence papers and broaden the geography/asset coverage that is currently Noda-heavy. POSSIBLY-DUBIOUS / WATCH ITEMS in the existing list: "On Random Number Generators and Practical Market Efficiency" (Moews, 2023) and "Are the Least Successful Traders Those Most Likely to Exit the Market?" (Ma et al., 2022) are legitimate but niche/lower-citation works — fine as frontier color, but they should not be weighted as canonical. The Noda 2016/2021 and Ito-Noda-Wada cluster is real (reputable authors, peer-reviewed) but the section is over-indexed on this single non-Bayesian time-varying-model school; the additions below rebalance toward the standard cross-author canon. No fabricated/predatory items detected in the gathered list. One metadata caution: Shleifer-Vishny "The Limits of Arbitrage" is often dated 1995 (NBER WP) vs 1997 (J. Finance) — the gathered 1997 date is the correct journal-of-record. Note also DOI 10.1093/rfs/hhm055 (Campbell-Thompson) is sometimes indexed under year 2008 (issue) vs 2007 (online); I report 2007 per RFS volume.

---

#### Efficient Capital Markets: A Review of Theory and Empirical Work
*Eugene F. Fama* — 1970 · The Journal of Finance · cites: 20000

DOI: `10.1111/j.1540-6261.1970.tb00518.x` · [link](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1970.tb00518.x)

`canonical`

**Why:** The canonical statement of the EMH and the weak/semi-strong/strong taxonomy; the central null hypothesis the entire review is constructed to test.

> Fama's foundational synthesis of the efficient market hypothesis. He defines an efficient market as one in which prices 'fully reflect' available information, and organises the empirical literature into three nested information sets: weak-form (past prices/returns), semi-strong (all public information), and strong-form (all information including private). The paper formalises the link between market efficiency and the 'fair game'/martingale and random-walk models of price behaviour, reviews the then-available evidence, and concludes the weak and semi-strong forms are broadly supported. It set the agenda and vocabulary for five decades of subsequent efficiency testing.

**Snowball:** Samuelson (1965), Proof That Properly Anticipated Prices Fluctuate Randomly, Industrial Management Review 6:41-49; Fama, Fisher, Jensen & Roll (1969), The Adjustment of Stock Prices to New Information, International Economic Review (10.2139/ssrn.321524); Fama (1991), Efficient Capital Markets: II, Journal of Finance (10.2307/2328565)

---

#### Proof That Properly Anticipated Prices Fluctuate Randomly
*Paul A. Samuelson* — 1965 · Industrial Management Review · cites: 2400

[link](https://www.proquest.com/scholarly-journals/proof-that-properly-anticipated-prices-fluctuate/docview/1302995663/se-2)

`canonical`

**Why:** The mathematical proof that efficiency implies a martingale (fair game) for prices; the precise null the variance-ratio and predictability tests reject or fail to reject.

> Samuelson's theorem gives the rigorous economic-theory foundation for the martingale/random-walk view of prices. He proves that if a market correctly anticipates future cash flows and discounts them rationally, then the resulting (suitably normalised) price series must follow a martingale: expected future price changes, conditional on all current information, are zero, so price changes are serially unpredictable. Crucially, randomness of price changes is a consequence of informational efficiency, not evidence against rational valuation. This decouples 'unpredictable returns' from 'irrational prices' and supplies the martingale null at the heart of efficiency testing.

**Snowball:** Mandelbrot (1966), Forecasts of Future Prices, Unbiased Markets, and Martingale Models, Journal of Business (10.1086/295016); Fama (1970), Efficient Capital Markets (10.1111/j.1540-6261.1970.tb00518.x)

---

#### On the Impossibility of Informationally Efficient Markets
*Sanford J. Grossman, Joseph E. Stiglitz* — 1980 · The American Economic Review · cites: 16000 · OA

[link](https://www.jstor.org/stable/1805228)

`canonical` · [pdf](https://www.aeaweb.org/aer/top20/70.3.393-408.pdf)

**Why:** The paradox that bounds how efficient markets can be; the theoretical license for the rest of the review's hunt for exploitable signals.

> Grossman and Stiglitz show that perfectly informationally efficient markets are logically impossible. If prices fully reveal all costly private information, no informed trader can be compensated for the cost of acquiring it, so no one gathers information and prices reveal nothing — a contradiction. In equilibrium prices can be only partially informative: an 'equilibrium degree of disequilibrium' must persist to reward information acquisition, with noise (e.g., supply shocks) preventing full revelation. This establishes that some predictability/return to information must remain, providing the theoretical justification for active research and the limits of the strong-form EMH.

**Snowball:** Grossman (1976), On the Efficiency of Competitive Stock Markets Where Traders Have Diverse Information, Journal of Finance (10.1111/j.1540-6261.1976.tb01907.x); Black (1986), Noise, Journal of Finance (10.1111/j.1540-6261.1986.tb04513.x)

---

#### Stock Market Prices Do Not Follow Random Walks: Evidence from a Simple Specification Test
*Andrew W. Lo, A. Craig MacKinlay* — 1988 · The Review of Financial Studies · cites: 4500 · OA

DOI: `10.1093/rfs/1.1.41` · [link](https://academic.oup.com/rfs/article-abstract/1/1/41/1601244)

`method` · [pdf](https://www.nber.org/system/files/working_papers/w2168/w2168.pdf)

**Why:** Defines the variance-ratio test specified in the section scope and is the most-cited rejection of the random walk for stock indices.

> Lo and MacKinlay introduce the variance-ratio test, which exploits the fact that under a random walk the variance of multi-period returns grows linearly with the horizon, so the ratio of (1/q times) the q-period return variance to the one-period variance equals one. Using weekly 1962-1985 U.S. data, they strongly reject the random walk for the value-weighted and equal-weighted CRSP indices and for size-sorted portfolios, driven by large positive autocorrelation especially in small-stock and equal-weighted returns. The rejection is robust to heteroskedasticity, so it is not an artefact of changing volatility. This is the workhorse statistical test of the weak-form/random-walk null.

**Snowball:** Lo & MacKinlay (1990), When Are Contrarian Profits Due to Stock Market Overreaction?, RFS (10.1093/rfs/3.2.175); Poterba & Summers (1988), Mean Reversion in Stock Prices, Journal of Financial Economics (10.1016/0304-405X(88)90021-9); Lo & MacKinlay (1989), The Size and Power of the Variance Ratio Test, Journal of Econometrics (10.1016/0304-4076(89)90004-2)

---

#### When Are Contrarian Profits Due to Stock Market Overreaction?
*Andrew W. Lo, A. Craig MacKinlay* — 1990 · The Review of Financial Studies · cites: 2000 · OA

DOI: `10.1093/rfs/3.2.175` · [link](https://academic.oup.com/rfs/article-abstract/3/2/175/1595488)

`empirical` · [pdf](https://www.nber.org/system/files/working_papers/w2977/w2977.pdf)

**Why:** Shows that violations of the random-walk null have subtle cross-sectional sources, sharpening what predictability does and does not imply about efficiency.

> Lo and MacKinlay decompose the profits of a contrarian (buy-losers/sell-winners) portfolio strategy and show that they need not arise from overreaction in individual stocks. Decomposing weekly portfolio autocovariance, they find that less than half of expected contrarian profits is attributable to negative own-autocorrelation (overreaction); the majority comes from positive cross-autocorrelations across securities — in particular, returns on large stocks lead those of smaller stocks. This shows that apparent return predictability and 'anomalies' can reflect lead-lag/cross-sectional structure rather than individual-stock irrationality, cautioning against naive overreaction interpretations.

**Snowball:** De Bondt & Thaler (1985), Does the Stock Market Overreact?, Journal of Finance (10.1111/j.1540-6261.1985.tb05004.x); Jegadeesh & Titman (1993), Returns to Buying Winners and Selling Losers, Journal of Finance (10.1111/j.1540-6261.1993.tb04702.x)

---

#### The Adaptive Markets Hypothesis: Market Efficiency from an Evolutionary Perspective
*Andrew W. Lo* — 2004 · The Journal of Portfolio Management · cites: 1400

DOI: `10.3905/jpm.2004.442611` · [link](https://jpm.pm-research.com/content/30/5/15)

`canonical`

**Why:** The leading alternative null: efficiency as a dynamic, evolving equilibrium; motivates the time-varying-efficiency frontier and reframes 'anomalies' as adaptation.

> Lo proposes the Adaptive Markets Hypothesis (AMH), reconciling the EMH with behavioural finance by applying evolutionary principles — competition, adaptation, natural selection, and bounded rationality with heuristics — to financial markets. Under the AMH, efficiency is not an all-or-nothing static property but a context- and time-dependent outcome of how many 'species' of market participants compete for finite resources (profit opportunities). Behavioural biases (loss aversion, overconfidence, overreaction) are reframed as once-adaptive heuristics that can become maladaptive when the environment changes. Implications include time-varying risk premia, return predictability that waxes and wanes, the periodic disappearance and reappearance of arbitrage opportunities, and the survival (not optimality) of strategies.

**Snowball:** Lo (2017), Adaptive Markets: Financial Evolution at the Speed of Thought, Princeton University Press; Lo (2005), Reconciling Efficient Markets with Behavioral Finance: The Adaptive Markets Hypothesis, Journal of Investment Consulting; Farmer & Lo (1999), Frontiers of Finance: Evolution and Efficient Markets, PNAS (10.1073/pnas.96.18.9991)

---

#### The Limits of Arbitrage
*Andrei Shleifer, Robert W. Vishny* — 1997 · The Journal of Finance · cites: 8000

DOI: `10.1111/j.1540-6261.1997.tb03807.x` · [link](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1997.tb03807.x)

`canonical`

**Why:** Explains why mispricing can persist even with rational arbitrageurs — the key 'limits to arbitrage' channel in the section scope; bridges EMH and behavioural critiques.

> Textbook arbitrage in financial markets requires no capital and entails no risk. In reality, almost all arbitrage requires capital, and is typically risky. Moreover, professional arbitrage is conducted by a relatively small number of highly specialized investors using other people's capital. Such professional arbitrage has a number of interesting implications for security pricing, including the possibility that arbitrage becomes ineffective in extreme circumstances, when prices diverge far from fundamental values. The model also suggests where anomalies in financial markets are likely to appear, and why arbitrage fails to eliminate them.

**Snowball:** De Long, Shleifer, Summers & Waldmann (1990), Noise Trader Risk in Financial Markets, JPE (10.1086/261703); Gromb & Vayanos (2010), Limits of Arbitrage, Annual Review of Financial Economics (10.1146/annurev-financial-073009-104107)

---

#### The Efficient Market Hypothesis and Its Critics
*Burton G. Malkiel* — 2003 · The Journal of Economic Perspectives · cites: 3500

DOI: `10.1257/089533003321164958` · [link](https://www.aeaweb.org/articles?id=10.1257/089533003321164958)

`review`

**Why:** The articulate defence of the EMH null against the anomalies literature; the skeptical benchmark a critical review must engage before claiming predictability.

> Malkiel reviews the challenges to the EMH from both behavioural economists (psychological/behavioural pricing elements, bubbles) and econometricians (evidence of return predictability from dividend yields, momentum, calendar effects, and short-/long-horizon autocorrelation). He argues many documented 'anomalies' are small, fragile, non-robust out of sample, eliminated by transaction costs, or artefacts of data mining, and that no reliable strategy consistently beats a passive index after costs. His thesis: markets are far more efficient and far less predictable than the recent academic literature implies, even if not perfectly efficient.

**Snowball:** Shiller (2003), From Efficient Markets Theory to Behavioral Finance, JEP (10.1257/089533003321164967); Fama (1998), Market Efficiency, Long-Term Returns, and Behavioral Finance, JFE (10.1016/S0304-405X(98)00026-9)

---

#### Efficient Market Hypothesis and Forecasting
*Allan Timmermann, Clive W. J. Granger* — 2004 · International Journal of Forecasting · cites: 540

DOI: `10.1016/S0169-2070(03)00012-8` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0169207003000128)

`method`

**Why:** Defines what 'beating the martingale null' must mean operationally (real-time, costed, out-of-sample), framing the backtesting/overfitting concerns central to the review.

> Timmermann and Granger connect the EMH to the practice of forecasting, clarifying that the EMH is meaningful only relative to a specified information set, forecasting model class, and search technology available in 'real time.' They stress that genuine tests of efficiency require establishing profitable trading opportunities ex ante, not merely detecting in-sample statistical predictability, and that the hypothesis self-destructs: once a predictable pattern is discovered and exploited, it tends to disappear. They discuss data-snooping, the role of risk adjustment, transaction costs, and why model instability and structural breaks make documented predictability hard to convert into out-of-sample profits.

**Snowball:** White (2000), A Reality Check for Data Snooping, Econometrica (10.1111/1468-0262.00152); Pesaran & Timmermann (1995), Predictability of Stock Returns, Journal of Finance (10.1111/j.1540-6261.1995.tb04055.x)

---

#### Predictability of Stock Returns: Robustness and Economic Significance
*M. Hashem Pesaran, Allan Timmermann* — 1995 · The Journal of Finance · cites: 2000

DOI: `10.1111/j.1540-6261.1995.tb04055.x` · [link](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1995.tb04055.x)

`empirical`

**Why:** Landmark demonstration that return predictability can be economically (not just statistically) significant out of sample — direct evidence against the strict random-walk null.

> Pesaran and Timmermann examine whether the statistically detectable predictability of U.S. stock returns (from dividend yields, interest rates, inflation, and money growth) could have been exploited in real time. Using recursive model-selection that conditions only on information available at each date, they construct out-of-sample trading strategies and find that switching between stocks and bills on the basis of these predictive models would have generated economically significant excess returns over a buy-and-hold benchmark, with better risk-adjusted performance, especially in volatile periods. Predictability is strongest in periods of high market volatility; transaction-cost sensitivity is examined.

**Snowball:** Campbell & Shiller (1988), The Dividend-Price Ratio and Expectations of Future Dividends, RFS (10.1093/rfs/1.3.195); Cochrane (2008), The Dog That Did Not Bark: A Defense of Return Predictability, RFS (10.1093/rfs/hhm046)

---

#### A Comprehensive Look at the Empirical Performance of Equity Premium Prediction
*Ivo Welch, Amit Goyal* — 2008 · The Review of Financial Studies · cites: 3500 · OA

DOI: `10.1093/rfs/hhm014` · [link](https://academic.oup.com/rfs/article-abstract/21/4/1455/1565737)

`empirical` · [pdf](https://www.ivo-welch.info/research/journalcopy/2008-rfs.pdf)

**Why:** The benchmark out-of-sample reality check: most predictors fail vs. the prevailing-mean (random-walk-like) null, making this the methodological standard the predictability literature must clear.

> Economists have suggested a whole range of variables that predict the equity premium: dividend price ratios, dividend yields, earnings-price ratios, dividend payout ratios, corporate or net issuing ratios, book-market ratios, beta premia, interest rates (in various guises), and consumption-based macroeconomic ratios (cay). Our paper comprehensively reexamines the performance of these variables, both in-sample and out-of-sample, as of 2005. We find that [a] over the last 30 years, the prediction models have failed both in-sample and out-of-sample; [b] the models are unstable, in that their out-of-sample predictions have performed unexpectedly poorly; [c] the models would not have helped an investor with access only to information available at the time to time the market.

**Snowball:** Campbell & Thompson (2008), Predicting Excess Stock Returns Out of Sample, RFS (10.1093/rfs/hhm055); Clark & West (2007), Approximately Normal Tests for Equal Predictive Accuracy, Journal of Econometrics (10.1016/j.jeconom.2006.05.023)

---

#### The Evolution of Stock Market Efficiency Over Time: A Survey of the Empirical Literature
*Kian-Ping Lim, Robert Brooks* — 2011 · Journal of Economic Surveys · cites: 420

DOI: `10.1111/j.1467-6419.2009.00611.x` · [link](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-6419.2009.00611.x)

`review`

**Why:** The organising review for weak-form efficiency testing and the time-varying-efficiency idea, mapping the methods and findings the section synthesises.

> Lim and Brooks survey the weak-form efficiency literature that tests return predictability from past prices, with a focus on stock markets. They note most studies ask whether a market is or is not weak-form efficient in an absolute, time-invariant sense, then document the growing body of work allowing for time-varying weak-form efficiency — markets that move through episodes of greater and lesser predictability. They organise the evidence across statistical methods (autocorrelation, runs, variance-ratio, nonlinear, and long-memory tests) and across developed vs. emerging markets, and connect the time-variation to the Adaptive Markets Hypothesis, market liberalisation, and microstructure changes.

**Snowball:** Lo & MacKinlay (1988), Stock Market Prices Do Not Follow Random Walks, RFS (10.1093/rfs/1.1.41); Charles, Darné & Kim (2012), Exchange-Rate Return Predictability and the AMH, JIMF (10.1016/j.jimonfin.2012.03.003)

---

#### The Evolution of Stock Market Efficiency in the US: A Non-Bayesian Time-Varying Model Approach
*Mikio Ito, Akihiko Noda, Tatsuma Wada* — 2016 · Applied Economics · cites: 130 · OA

DOI: `10.1080/00036846.2015.1083532` · arXiv: `1202.0100` · [link](https://arxiv.org/abs/1202.0100)

`frontier` · [pdf](https://arxiv.org/pdf/1202.0100)

**Why:** Operationalises a continuous, time-varying 'degree of market efficiency' for U.S. stocks via TV-AR — a leading frontier method implementing the AMH empirically.

> A non-Bayesian time-varying model is developed by introducing the concept of the degree of market efficiency that varies over time. This model may be seen as a reflection of the idea that continuous technological progress alters the trading environment over time. With new methodologies and a new measure of the degree of market efficiency, we examine whether the US stock market evolves over time. In particular, a time-varying autoregressive (TV-AR) model is employed. Our main findings are: (i) the US stock market has evolved over time and the degree of market efficiency has cyclical fluctuations with a considerably long periodicity, from 30 to 40 years; and (ii) the US stock market has been efficient with the exception of four times in our sample period: during the long-recession of 1873-1879; the recession of 1902-1904; the New Deal era; and the recession of 1957-1958 and soon after it. It is then shown that our results are partly consistent with the view of behavioral finance.

**Snowball:** Lo (2004), The Adaptive Markets Hypothesis, JPM (10.3905/jpm.2004.442611); Ito, Noda & Wada (2014), International Stock Market Efficiency: A Non-Bayesian Time-Varying Model Approach, Applied Economics (1203.5176)

---

#### On the Evolution of Cryptocurrency Market Efficiency
*Akihiko Noda* — 2021 · Applied Economics Letters · cites: 200 · OA

DOI: `10.1080/13504851.2020.1758617` · arXiv: `1904.09403` · [link](https://arxiv.org/abs/1904.09403)

`frontier` · [pdf](https://arxiv.org/pdf/1904.09403)

**Why:** Extends time-varying-efficiency / AMH testing to crypto with a sample-size-robust GLS estimator; a frontier methodological and empirical contribution to the null literature in new markets.

> This study examines whether the efficiency of cryptocurrency markets (Bitcoin and Ethereum) evolve over time based on Lo's (2004) adaptive market hypothesis (AMH). In particular, we measure the degree of market efficiency using a generalized least squares-based time-varying model that does not depend on sample size, unlike previous studies that used conventional methods. The empirical results show that (1) the degree of market efficiency varies with time in the markets, (2) Bitcoin's market efficiency level is higher than that of Ethereum over most periods, and (3) a market with high market liquidity has been evolving. We conclude that the results support the AMH for the most established cryptocurrency market.

**Snowball:** Urquhart (2016), The Inefficiency of Bitcoin, Economics Letters (10.1016/j.econlet.2016.09.019); Ito, Noda & Wada (2016), The Evolution of Stock Market Efficiency in the US, Applied Economics (1202.0100)

---

#### A Test of the Adaptive Market Hypothesis Using a Time-Varying AR Model in Japan
*Akihiko Noda* — 2016 · Finance Research Letters · cites: 130 · OA

DOI: `10.1016/j.frl.2016.01.004` · arXiv: `1207.1842` · [link](https://arxiv.org/abs/1207.1842)

`frontier` · [pdf](https://arxiv.org/pdf/1207.1842)

**Why:** A clean TV-AR implementation of AMH testing on a major non-U.S. market, complementing the U.S. and crypto frontier evidence on time-varying efficiency.

> Noda tests the Adaptive Markets Hypothesis for the Japanese stock market (the first-section TOPIX and the second-section TSE2) by measuring a time-varying degree of market efficiency with a time-varying autoregressive (TV-AR) model. The empirical results show that (1) the degree of market efficiency changes over time in both markets; (2) the market efficiency of the TSE2 is lower than that of the TOPIX in most periods; and (3) the efficiency of the TOPIX has 'evolved' over the sample while that of the TSE2 has not, with the differences related to trading volume/liquidity and market liberalisation. The findings support the AMH view that efficiency is a dynamic, market-specific property.

**Snowball:** Ito, Noda & Wada (2016), The Evolution of Stock Market Efficiency in the US, Applied Economics (1202.0100); Kim, Shamsuddin & Lim (2011), Stock Return Predictability and the AMH: Evidence from Century-of-Data, JEF (10.1016/j.jempfin.2011.08.002)

---

#### On Random Number Generators and Practical Market Efficiency
*Ben Moews* — 2023 · Journal of the Operational Research Society · cites: 5 · OA

DOI: `10.1080/01605682.2023.2219292` · arXiv: `2305.17419` · [link](https://arxiv.org/abs/2305.17419)

`method` · [pdf](https://arxiv.org/pdf/2305.17419)

**Why:** A novel information-theoretic test of the random-walk/martingale null using RNG randomness tests, and an explicit theoretical-vs-practical efficiency distinction relevant to a critical review.

> Modern mainstream financial theory is underpinned by the efficient market hypothesis, which posits the rapid incorporation of relevant information into asset pricing. Limited prior studies in the operational research literature have investigated tests designed for random number generators to check for these informational efficiencies. Treating binary daily returns as a hardware random number generator analogue, tests of overlapping permutations have indicated that these time series feature idiosyncratic recurrent patterns. Contrary to prior studies, we split our analysis into two streams at the annual and company level, and investigate longer-term efficiency over a larger time frame for Nasdaq-listed public companies to diminish the effects of trading noise and allow the market to realistically digest new information. Our results demonstrate that information efficiency varies across years and reflects large-scale market impacts such as financial crises. We also show the proximity to results of a well-tested pseudo-random number generator, discuss the distinction between theoretical and practical market efficiency, and find that the statistical qualification of stock-separated returns in support of the efficient market hypothesis is dependent on the driving factor of small inefficient subsets that skew market assessments.

**Snowball:** Lo & MacKinlay (1988), Stock Market Prices Do Not Follow Random Walks, RFS (10.1093/rfs/1.1.41); Doyne Farmer & Lo (1999), Frontiers of Finance: Evolution and Efficient Markets, PNAS (10.1073/pnas.96.18.9991)

---

#### Are the Least Successful Traders Those Most Likely to Exit the Market? A Survival Analysis Contribution to the Efficient Market Debate
*Tiejun Ma, Peter A. F. Fraser-Mackenzie, Ming-Chien Sung, Amisha P. Kansara, Johnnie E. V. Johnson* — 2022 · European Journal of Operational Research · cites: 25

DOI: `10.1016/j.ejor.2021.08.050` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0377221721007426)

`critique`

**Why:** A rare direct, trader-level empirical test of the AMH's natural-selection mechanism; a frontier critique nuancing the claim that markets self-correct toward efficiency.

> This paper tests a central mechanism of the Adaptive Markets Hypothesis — that natural selection drives 'noise traders' pursuing sub-optimal strategies out of the market, thereby pushing markets toward efficiency. Using survival (hazard) analysis on the complete trading records of 5,164 retail spread-traders from March 2006 to February 2012, the authors find that the least profitable and least disciplined traders do indeed tend to stop trading sooner, consistent with the AMH selection argument. However, they also uncover a V-shaped relationship between trader profitability (Sharpe ratio) and the likelihood of ceasing to trade: highly profitable traders are also disproportionately likely to exit. This complicates the simple selection-toward-efficiency story and suggests the population of survivors is not monotonically more skilled.

**Snowball:** Lo (2004), The Adaptive Markets Hypothesis, JPM (10.3905/jpm.2004.442611); Barber, Lee, Liu & Odean (2014), The Cross-Section of Speculator Skill: Evidence from Day Trading, Journal of Financial Markets (10.1016/j.finmar.2013.05.006)

---

#### From Efficient Markets Theory to Behavioral Finance
*Robert J. Shiller* — 2003 · The Journal of Economic Perspectives · cites: 3000

DOI: `10.1257/089533003321164967` · [link](https://www.aeaweb.org/articles?id=10.1257/089533003321164967)

`canonical`

**Why:** The canonical behavioural counterpoint to the martingale/EMH null (excess volatility, bubbles), pairing with Malkiel and Fama as the symposium that defines the debate.

> Shiller traces the intellectual arc from the EMH's mid-century dominance to behavioural finance. He argues the strongest historical case for the EMH rested on the claim that prices follow random walks and that speculative prices accurately reflect fundamentals, but that excess-volatility evidence — stock prices moving far more than warranted by subsequent dividend changes — undercuts this. He surveys feedback models, herding, and the limits of arbitrage, contending that markets exhibit systematic, sometimes large, departures from fundamentals (bubbles), and that behavioural and psychological factors are essential to understanding price dynamics. He positions behavioural finance as complementary to, not a wholesale rejection of, efficiency.

**Snowball:** Shiller (1981), Do Stock Prices Move Too Much to Be Justified by Subsequent Changes in Dividends?, AER (10.3386/w0456); Campbell & Shiller (1988), The Dividend-Price Ratio and Expectations of Future Dividends, RFS (10.1093/rfs/1.3.195)

---

#### The Dog That Did Not Bark: A Defense of Return Predictability
*John H. Cochrane* — 2008 · The Review of Financial Studies · cites: 1300

DOI: `10.1093/rfs/hhm046` · [link](https://academic.oup.com/rfs/article-abstract/21/4/1533/1565214)

`method`

**Why:** A powerful econometric rehabilitation of return predictability against the random-walk null, sharpening how to test the martingale hypothesis with present-value restrictions.

> Cochrane argues that the apparent weakness of dividend-yield return predictability is misleading once one imposes the present-value identity. Variation in the dividend-price ratio must forecast either future returns or future dividend growth (or be a rational bubble). Empirically, dividend yields do not forecast dividend growth — 'the dog that did not bark' — so by the accounting identity they must forecast returns, even though the direct return-forecasting regression looks statistically marginal. Using this restriction sharply increases the power of predictability tests and overturns the random-walk null for long-horizon returns. The paper reframes the predictability debate around the volatility of expected returns rather than a single regression's t-statistic.

**Snowball:** Campbell & Shiller (1988), Stock Prices, Earnings, and Expected Dividends, Journal of Finance (10.1111/j.1540-6261.1988.tb04598.x); Stambaugh (1999), Predictive Regressions, Journal of Financial Economics (10.1016/S0304-405X(99)00041-0)

---

#### The size and power of the variance ratio test in finite samples: A Monte Carlo investigation
*Andrew W. Lo, A. Craig MacKinlay* — 1989 · Journal of Econometrics · cites: 528 · completeness-add

DOI: `10.1016/0304-4076(89)90083-3` · [link](https://doi.org/10.1016/0304-4076(89)90083-3)

`method`

**Why:** Provides the finite-sample size/power justification for the variance-ratio test named in the scope; the 1988 paper states the test, this one validates it. Essential methods citation.

> Companion to the 1988 RFS paper, this Monte Carlo study establishes the finite-sample behaviour of the variance-ratio (VR) statistic under the random-walk and martingale nulls. The authors show the asymptotic-normal VR test has the correct size and is more powerful than the Dickey-Fuller and Box-Pierce tests against several plausible alternatives (mean-reverting and ARIMA processes), but they document size distortions for very long horizons and small samples and recommend the heteroskedasticity-robust version. It is the reference for the practical reliability of the VR test the review will run.

**Snowball:** Lo & MacKinlay (1988), Stock market prices do not follow random walks (10.1093/rfs/1.1.41); Dickey & Fuller (1979), Distribution of estimators for autoregressive time series with a unit root (10.2307/2286348); Poterba & Summers (1988), Mean reversion in stock prices (10.1016/0304-405X(88)90021-9)

---

#### A simple multiple variance ratio test
*K. Victor Chow, Karen C. Denning* — 1993 · Journal of Econometrics · cites: 501 · completeness-add

DOI: `10.1016/0304-4076(93)90051-6` · [link](https://doi.org/10.1016/0304-4076(93)90051-6)

`method`

**Why:** The multiple-horizon VR test that fixes the joint-size problem in the gathered Lo-MacKinlay paper; standard in modern efficiency testing.

> Lo-MacKinlay test individual holding-period horizons one at a time, inflating the joint size when several horizons are examined. Chow and Denning extend the VR framework to a multiple-comparison test that controls the overall test size across a set of horizons using the Studentized maximum modulus distribution. The resulting joint statistic is the standard way to test the random-walk null against multiple aggregation intervals simultaneously and is widely used in empirical weak-form efficiency studies.

**Snowball:** Lo & MacKinlay (1989), Size and power of the variance ratio test (10.1016/0304-4076(89)90083-3); Richardson & Stock (1989), Drawing inferences from statistics based on multiyear asset returns (10.1016/0304-405X(89)90077-9)

---

#### Alternative variance-ratio tests using ranks and signs
*Jonathan H. Wright* — 2000 · Journal of Business & Economic Statistics · cites: 373 · completeness-add

DOI: `10.1080/07350015.2000.10524842` · [link](https://doi.org/10.1080/07350015.2000.10524842)

`method`

**Why:** Robust, exact-distribution VR tests that the AMH/efficiency papers in this section (e.g. Kim-Shamsuddin-Lim, Urquhart-McGroarty) rely on; complements Lo-MacKinlay.

> Wright proposes non-parametric variance-ratio tests based on the ranks and signs of returns rather than their levels. The rank-based tests are exact under the i.i.d. null, are robust to the heavy tails and conditional heteroskedasticity typical of financial returns, and have higher power than the conventional asymptotic VR test against many alternatives. The sign-based test is exact even under general forms of conditional heteroskedasticity. These tests are now a standard robustness layer in weak-form efficiency and adaptive-markets studies.

**Snowball:** Lo & MacKinlay (1988), Stock market prices do not follow random walks (10.1093/rfs/1.1.41); Chow & Denning (1993), A simple multiple variance ratio test (10.1016/0304-4076(93)90051-6)

---

#### Automatic variance ratio test under conditional heteroskedasticity
*Jae H. Kim* — 2009 · Finance Research Letters · cites: 184 · completeness-add

DOI: `10.1016/j.frl.2009.04.003` · [link](https://doi.org/10.1016/j.frl.2009.04.003)

`method`

**Why:** The modern, parameter-free wild-bootstrap VR test used throughout the rolling/time-varying efficiency literature already in this section; directly operationalises the null tests.

> Kim combines Choi's (1999) data-dependent (automatic) choice of the holding period with a wild-bootstrap procedure to obtain a variance-ratio test that requires no arbitrary horizon choice and remains valid under conditional heteroskedasticity. Monte Carlo evidence shows the automatic, wild-bootstrapped VR test has good size and substantially higher power than alternatives in small samples. It has become the default VR implementation (e.g., the vrtest R package) used in adaptive-markets and rolling-window efficiency studies.

**Snowball:** Choi (1999), Testing the random walk hypothesis for real exchange rates (10.1002/(SICI)1099-1255(199905/06)14:3<293::AID-JAE503>3.0.CO;2-5); Kim (2006), Wild bootstrapping variance ratio tests (10.1016/j.econlet.2006.01.007)

---

#### Noise Trader Risk in Financial Markets
*J. Bradford De Long, Andrei Shleifer, Lawrence H. Summers, Robert J. Waldmann* — 1990 · Journal of Political Economy · cites: 6373 · OA · completeness-add

DOI: `10.1086/261703` · [link](https://doi.org/10.1086/261703)

`canonical` · [pdf](http://www.j-bradford-delong.net/pdf_files/Noise_Traders_Main.pdf)

**Why:** The foundational noise-trader/limits-to-arbitrage model behind the gathered Shleifer-Vishny (1997); explains why the martingale null fails and arbitrage does not enforce efficiency.

> This canonical paper builds an overlapping-generations model in which irrational noise traders with erroneous stochastic beliefs create a systematic, non-diversifiable risk that deters rational arbitrageurs from fully correcting mispricing. Because arbitrageurs are risk-averse and short-horizoned, the unpredictability of noise traders' future beliefs limits arbitrage, and noise traders can earn higher expected returns by bearing the risk they themselves create. The model explains the excess volatility, mean reversion, and closed-end fund discounts that the random-walk/EMH null cannot, and it is the theoretical foundation for 'limits to arbitrage.'

**Snowball:** Shleifer & Vishny (1997), The limits of arbitrage (10.1111/j.1540-6261.1997.tb03807.x); Black (1986), Noise (10.1111/j.1540-6261.1986.tb04513.x); Campbell & Kyle (1993), Smart money, noise trading and stock price behaviour (10.2307/2298113)

---

#### The Limits of Arbitrage
*Denis Gromb, Dimitri Vayanos* — 2010 · Annual Review of Financial Economics · cites: 502 · completeness-add

DOI: `10.1146/annurev-financial-073009-104107` · [link](https://doi.org/10.1146/annurev-financial-073009-104107)

`review`

**Why:** Authoritative review tying together the limits-to-arbitrage strand (Shleifer-Vishny, DSSW) the section uses to motivate departures from efficiency.

> A survey of the theoretical limits-to-arbitrage literature. Gromb and Vayanos organise the models around the idea that specialised, capital-constrained arbitrageurs cannot eliminate mispricing because of funding constraints, margin requirements, agency frictions and the risk that mispricing widens before it corrects. They review implications for asset-price comovement, contagion, liquidity, and the amplification of shocks, linking the micro theory to financial-crisis dynamics. It is the standard reference summarising why real-world arbitrage fails to enforce the efficient-markets null.

**Snowball:** Shleifer & Vishny (1997), The limits of arbitrage (10.1111/j.1540-6261.1997.tb03807.x); Gromb & Vayanos (2002), Equilibrium and welfare in markets with financially constrained arbitrageurs (10.1016/S0304-405X(02)00228-3); Brunnermeier & Pedersen (2009), Market liquidity and funding liquidity (10.1093/rfs/hhn098)

---

#### Predictive Regressions
*Robert F. Stambaugh* — 1999 · Journal of Financial Economics · cites: 1693 · OA · completeness-add

DOI: `10.1016/S0304-405X(99)00041-0` · [link](https://doi.org/10.1016/S0304-405X(99)00041-0)

`method`

**Why:** The canonical small-sample-bias critique that conditions how the gathered Welch-Goyal/Cochrane predictability debate must be read; indispensable methods reference.

> Stambaugh shows that regressions predicting returns with a persistent, endogenous regressor (e.g., the dividend yield) yield biased coefficient estimates and over-rejected significance in finite samples — the 'Stambaugh bias.' Using a Bayesian framework he derives the exact finite-sample distribution and shows the bias has the opposite sign to the predictor's autocorrelation, materially weakening the apparent in-sample evidence for return predictability. This is the central econometric caveat for any predictive-regression test of the EMH null.

**Snowball:** Mankiw & Shapiro (1986), Do we reject too often? (10.1016/0165-1765(86)90107-6); Nelson & Kim (1993), Predictable stock returns: the role of small-sample bias (10.1111/j.1540-6261.1993.tb04711.x); Stambaugh (1986) working paper on bias in regressions with lagged stochastic regressors

---

#### Predicting Excess Stock Returns Out of Sample: Can Anything Beat the Historical Average?
*John Y. Campbell, Samuel B. Thompson* — 2007 · Review of Financial Studies · cites: 2991 · OA · completeness-add

DOI: `10.1093/rfs/hhm055` · [link](https://doi.org/10.1093/rfs/hhm055)

`empirical` · [pdf](http://dash.harvard.edu/bitstream/handle/1/2622619/Campbell_Predicting.pdf)

**Why:** Direct counterpoint to the gathered Welch-Goyal (2008); together with Cochrane (2008) it frames the modern return-predictability-vs-EMH debate.

> Responding to Goyal-Welch's finding that predictor variables fail to beat the historical-mean forecast out of sample, Campbell and Thompson show that imposing weak economic restrictions — sign restrictions on coefficients and on the equity-premium forecast (truncating negative predictions) — restores modest but genuine out-of-sample predictability for many valuation-ratio and interest-rate predictors. The implied gains, though small in R-squared, are economically meaningful for a mean-variance investor. The paper is the principal rebuttal in the in-/out-of-sample predictability debate.

**Snowball:** Goyal & Welch (2008), A comprehensive look at the empirical performance of equity premium prediction (10.1093/rfs/hhm014); Campbell & Shiller (1988), The dividend-price ratio and expectations of future dividends (10.1093/rfs/1.3.195)

---

#### Out-of-Sample Equity Premium Prediction: Combination Forecasts and Links to the Real Economy
*David E. Rapach, Jack K. Strauss, Guofu Zhou* — 2010 · Review of Financial Studies · cites: 1676 · OA · completeness-add

DOI: `10.1093/rfs/hhp063` · [link](https://doi.org/10.1093/rfs/hhp063)

`empirical` · [pdf](https://doi.org/10.2139/ssrn.1257858)

**Why:** Resolves the OOS predictability debate via forecast combination; bridges the Welch-Goyal/Campbell-Thompson dispute already in the section and motivates the ML-forecasting strand.

> Rapach, Strauss and Zhou show that combining individual predictor forecasts (e.g., by simple averaging) delivers statistically and economically significant out-of-sample equity-premium predictability that individual predictors cannot, by reducing forecast variance. Combination forecasts are linked to the real economy: they are countercyclical, forecasting more strongly in recessions. This reconciles the Goyal-Welch pessimism with genuine predictability and is a key reference for forecast-combination approaches against the EMH null.

**Snowball:** Goyal & Welch (2008), A comprehensive look at equity premium prediction (10.1093/rfs/hhm014); Timmermann (2006), Forecast combinations (Handbook chapter) (10.1016/S1574-0706(05)01004-9); Campbell & Thompson (2007), Predicting excess stock returns out of sample (10.1093/rfs/hhm055)

---

#### Stock return predictability and the adaptive markets hypothesis: Evidence from century-long U.S. data
*Jae H. Kim, Abul Shamsuddin, Kian-Ping Lim* — 2011 · Journal of Empirical Finance · cites: 351 · completeness-add

DOI: `10.1016/j.jempfin.2011.08.002` · [link](https://doi.org/10.1016/j.jempfin.2011.08.002)

`empirical`

**Why:** Major cross-author AMH empirical anchor on long US data, broadening the Japan/crypto-heavy AMH evidence currently gathered (Noda, Ito et al.).

> Using more than a century of monthly Dow Jones / US stock data and automatic variance-ratio and generalized-spectral tests applied in moving subsample windows, the authors show that return predictability is strongly time-varying: it is associated with market conditions such as bubbles, crashes, and major institutional and political events rather than being constant. The evidence favours the adaptive-markets hypothesis over both the strict EMH and a fixed-predictability alternative. It is among the most-cited empirical AMH tests on long-run US data.

**Snowball:** Lo (2004), The adaptive markets hypothesis (10.3905/jpm.2004.442611); Kim (2009), Automatic variance ratio test under conditional heteroskedasticity (10.1016/j.frl.2009.04.003); Escanciano & Lobato (2009), An automatic portmanteau test for serial correlation (10.1016/j.jeconom.2009.03.001)

---

#### The Adaptive Markets Hypothesis: Evidence from the Foreign Exchange Market
*Christopher J. Neely, Paul A. Weller, Joshua M. Ulrich* — 2009 · Journal of Financial and Quantitative Analysis · cites: 283 · OA · completeness-add

DOI: `10.1017/S0022109009090103` · [link](https://doi.org/10.1017/S0022109009090103)

`empirical` · [pdf](https://doi.org/10.2139/ssrn.922345)

**Why:** Canonical out-of-equity AMH evidence (FX, technical rules) from reputable authors; complements the gathered crypto/Japan AMH studies and the trading-rule profitability theme.

> The authors test the adaptive-markets hypothesis using the historical performance of technical trading rules in foreign-exchange markets. They find that the excess returns to trend-following rules declined over time and largely disappeared by the early 2000s, consistent with the AMH prediction that profit opportunities are competed away as participants adapt, rather than with either constant efficiency or constant inefficiency. The decline coincides with increased market participation and learning, supporting an evolutionary view of efficiency.

**Snowball:** Lo (2004), The adaptive markets hypothesis (10.3905/jpm.2004.442611); Sullivan, Timmermann & White (1999), Data-snooping, technical trading rule performance, and the bootstrap (10.1111/0022-1082.00163); Olson (2004), Have trading rule profits in the currency markets declined over time? (10.1016/S0378-4266(03)00080-9)

---

#### Are stock markets really efficient? Evidence of the adaptive market hypothesis
*Andrew Urquhart, Frank McGroarty* — 2016 · International Review of Financial Analysis · cites: 182 · OA · completeness-add

DOI: `10.1016/j.irfa.2016.06.011` · [link](https://doi.org/10.1016/j.irfa.2016.06.011)

`empirical`

**Why:** Multi-index AMH evidence with rolling-window dependence tests; rounds out the geographic and methodological breadth of the AMH strand in this section.

> Using long-run data on four major stock indices (S&P 500, FTSE 100, NIKKEI 225, EURO STOXX 50) and a battery of linear and non-linear dependence tests applied over rolling windows, the authors show that the degree of return predictability varies through time and across markets in a way consistent with the adaptive-markets hypothesis rather than with a fixed efficient or inefficient state. Different market conditions (e.g., crises) are associated with episodes of greater predictability. The paper is a widely cited multi-market AMH test.

**Snowball:** Lo (2004), The adaptive markets hypothesis (10.3905/jpm.2004.442611); Kim, Shamsuddin & Lim (2011), Stock return predictability and the AMH (10.1016/j.jempfin.2011.08.002); Hiremath & Kumari (2014), Stock returns predictability and the AMH in emerging markets: India (10.1186/2193-1801-3-428)

---

