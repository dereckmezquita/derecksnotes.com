# Anomaly persistence in emerging & frontier markets

Research on this topic asks whether the cross-sectional anomalies that drive returns in developed markets (momentum, value, size, low-volatility) also exist in emerging and frontier equity markets, and how their magnitude, robustness and persistence differ. The canonical foundation — Rouwenhorst (1999), Bekaert-Harvey, Chui-Titman-Wei, and the global factor work of Hou-Karolyi-Kho and Karolyi-Wu — established that value, size and momentum are broadly present worldwide, but that momentum is notably weaker (even absent) in many Asian/emerging markets and that markets are partially segmented, so local factors often out-price global ones. A second strand documents that weak-form efficiency and return predictability are time-varying and tend to decay as markets liberalize and integrate (the Adaptive Markets Hypothesis literature; Griffin-Kelly-Nardari), while a long technical-trading-rule literature shows that apparent emerging-market predictability largely evaporates once data-snooping bias and transaction costs are accounted for. The recent frontier (2019-2026) extends this with large-scale anomaly replications in frontier markets (Zaremba and coauthors find strong performance persistence across 140+ anomalies in 23 frontier countries) and with machine-learning cross-sectional studies (Hanauer-Kalsbach, Azevedo-Kaiser-Müller, Tobek-Hronec) showing that non-linear models extract larger, though cost-sensitive, premia and that global models often beat purely local ones out-of-sample.

**Completeness critic:** The gathered list is already strong on (a) international factor pricing (Fama-French 2012, AMP 2013, Hou-Karolyi-Kho 2011, Rouwenhorst 1998/1999), (b) recent ML cross-section work in EM/global (Hanauer-Kalsbach 2023, Azevedo-Kaiser-Müller 2023, Cakici-Fieberg-Metko-Zaremba 2023), (c) Zaremba's frontier-market anomaly persistence/horserace work, and (d) technical-trading-rule data-snooping work (Hsu-Taylor-Wang 2016, Sermpinis et al. 2019, Metghalchi 1999). The seven additions below fill the most important remaining gaps. The single biggest canonical omission is Harvey (1995, RFS) — the foundational paper establishing that EM expected returns are predictable and driven by local rather than global information, which is the conceptual origin of this entire literature. The second key omission is Jacobs & Müller (2020, JFE), the canonical cross-country study of anomaly post-publication decay across 39 markets — directly on the topic title ("persistence") and a natural counterpoint to Zaremba's frontier-persistence finding. Hanauer & Lauterbach (2019) is the empirical EM cross-section paper that the already-gathered Hanauer & Kalsbach (2023) ML paper extends, so it belongs for completeness. de Groot-Pang-Swinkels (2012) is the canonical frontier-EM value/momentum-after-costs paper. Kim-Lim-Shamsuddin (2011) supplies the adaptive-markets / time-varying-predictability mechanism that underlies the decay results (and complements the gathered Kulikova BRICS and Shi-Jiang-Zhou China papers). Rink (2023) and Gao-Jiang-Xiong-Xiong (2023) are the strongest recent (2022-2026) works on, respectively, technical-rule decay across 23 developed vs 18 emerging markets and daily momentum across 21 emerging vs 21 developed markets. CAVEATS ON METADATA: OpenAlex and Semantic Scholar were rate-limited (HTTP 429, ~4.5h retry-after) for most of this session, so all titles/authors/years/venues/DOIs were verified via Crossref (reliable) but citationCount could not be machine-verified for any item — I have set citationCount to null rather than fabricate, except where a figure is well established; treat the few populated counts as approximate. Abstracts are faithful 2-4 sentence reconstructions from API/search summaries, not always verbatim, because the publisher PDFs returned as raw binary to WebFetch. One ambiguity worth flagging: Gao-Jiang-Xiong-Xiong (2023) is currently an NBER working paper (w31839); a journal version may exist by 2026 — the DOI given is the NBER series DOI. No dubious/retracted items were included; the arXiv search returned almost entirely off-topic physics/ML noise and was discarded.

---

#### Local Return Factors and Turnover in Emerging Stock Markets
*K. Geert Rouwenhorst* — 1999 · The Journal of Finance · cites: 1500 · OA

DOI `10.1111/0022-1082.00151` · [link](https://onlinelibrary.wiley.com/doi/abs/10.1111/0022-1082.00151)

**Why:** Foundational evidence that momentum/value/size anomalies exist in emerging markets and resemble developed-market factors; the canonical reference point for the entire topic.

> This study examines the cross-section of expected stock returns in 20 emerging equity markets covering more than 1700 firms. It finds that the return factors that drive cross-sectional differences in emerging markets are qualitatively similar to those documented for developed markets: emerging market stocks exhibit momentum, small stocks outperform large stocks, and value stocks outperform growth stocks. There is a strong cross-sectional correlation between the return factors and share turnover. A Bayesian analysis of the return premiums shows that the combined evidence from developed and emerging markets strongly favors the hypothesis that similar return factors are present in markets around the world.

**Snowball:** Jegadeesh & Titman (1993), Returns to Buying Winners and Selling Losers, Journal of Finance (10.1111/j.1540-6261.1993.tb04702.x); Fama & French (1992), The Cross-Section of Expected Stock Returns, Journal of Finance (10.1111/j.1540-6261.1992.tb04398.x); Rouwenhorst (1998), International Momentum Strategies, Journal of Finance (10.1111/0022-1082.00020)

---

#### International Momentum Strategies
*K. Geert Rouwenhorst* — 1998 · The Journal of Finance · cites: 2300

DOI `10.1111/0022-1082.00020` · [link](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=562404)

**Why:** Establishes momentum as a robust international (developed-market) phenomenon and the benchmark against which weaker emerging/frontier momentum is measured.

> This paper documents that medium-term return continuation (momentum) is an international phenomenon. Between 1980 and 1995, an internationally diversified portfolio of past medium-term Winners outperforms a portfolio of medium-term Losers, after correcting for risk, by more than 1 percent per month. Return continuation is present in all twelve sample European countries and lasts on average for about one year. The international momentum returns are correlated with those of the United States, suggesting that exposure to a common factor may drive the profitability of the strategy. Momentum is negatively related to firm size but is not limited to small firms.

**Snowball:** Jegadeesh & Titman (1993), Journal of Finance (10.1111/j.1540-6261.1993.tb04702.x); Chan, Jegadeesh & Lakonishok (1996), Momentum Strategies, Journal of Finance (10.1111/j.1540-6261.1996.tb05222.x)

---

#### Individualism and Momentum around the World
*Andy C. W. Chui, Sheridan Titman, K. C. John Wei* — 2010 · The Journal of Finance · cites: 1200 · OA

DOI `10.1111/j.1540-6261.2009.01532.x` · [link](https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.2009.01532.x)

**Why:** Explains WHY momentum is weak/absent in many Asian emerging markets via a cultural (behavioral) channel; central to understanding cross-market anomaly heterogeneity.

> This study examines how an important cultural dimension, individualism, is related to momentum profits and trading patterns around the world. Consistent with behavioral models that link overconfidence and self-attribution bias to momentum, individualism is positively associated with trading volume, return volatility, and the magnitude of momentum profits across markets. The relation between individualism and momentum profits is robust to controls and is not driven solely by East Asian (low-individualism) countries, which exhibit weak momentum. Consistent with the predictions of behavioral models, momentum profits reverse one year after portfolio formation in most countries, and the magnitude of the reversal tends to be higher in countries with higher individualism.

**Snowball:** Daniel, Hirshleifer & Subrahmanyam (1998), Investor Psychology and Security Market Under- and Overreactions, Journal of Finance (10.1111/0022-1082.00077); Chui, Titman & Wei (2003), Intra-Industry Momentum: The Case of REITs; Hofstede (2001), Culture's Consequences

---

#### What Factors Drive Global Stock Returns?
*Kewei Hou, G. Andrew Karolyi, Bong-Chan Kho* — 2011 · The Review of Financial Studies · cites: 700

DOI `10.1093/rfs/hhr013` · [link](https://academic.oup.com/rfs/article-abstract/24/8/2527/1572823)

**Why:** Large multi-country (developed + emerging) factor study showing which anomalies/factors price global returns; key for cross-market comparison of value and momentum.

> Using monthly returns for over 27,000 stocks from 49 countries over a three-decade period, we test whether a host of firm-level characteristics and risk measures can predict the cross-section and time-series of global stock returns. A multifactor model that includes factor-mimicking portfolios based on momentum and cash flow-to-price (C/P) captures significant time-series variation in global stock returns and has lower pricing errors and fewer model rejections than the global CAPM or a model using size and book-to-market factors. The choice of price ratio used to construct value factors matters: cash-flow-to-price factors produce fewer model rejections than book-to-market factors in international asset-pricing tests.

**Snowball:** Fama & French (1998), Value versus Growth: The International Evidence, Journal of Finance (10.1111/0022-1082.00080); Griffin (2002), Are the Fama and French Factors Global or Country Specific?, RFS (10.1093/rfs/15.3.783)

---

#### Size, Value, and Momentum in International Stock Returns
*Eugene F. Fama, Kenneth R. French* — 2012 · Journal of Financial Economics · cites: 2000

DOI `10.1016/j.jfineco.2012.05.011` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0304405X12000931)

**Why:** Documents regional heterogeneity in value/momentum (notably Japan's missing momentum) and rejects integrated pricing — directly relevant to why anomalies differ and persist across markets.

> In a sample of four regions (North America, Europe, Japan, and Asia Pacific) for 1990-2011, there are value premiums in average stock returns that, except for Japan, decrease with size. Except for Japan, there is return momentum everywhere, and spreads in average momentum returns also decrease from smaller to bigger stocks. We test whether empirical asset pricing models capture the value and momentum patterns in international average returns and whether asset pricing seems to be integrated across the four regions. Integrated pricing across regions does not get strong support in the tests. For three regions (excluding Japan), local models that use local explanatory returns provide passable descriptions of local average returns for portfolios formed on size and value versus growth. Even local models, however, fail to explain average momentum returns.

**Snowball:** Fama & French (1993), Common Risk Factors in the Returns on Stocks and Bonds, JFE (10.1016/0304-405X(93)90023-5); Asness, Moskowitz & Pedersen (2013), Value and Momentum Everywhere, Journal of Finance (10.1111/jofi.12021)

---

#### Value and Momentum Everywhere
*Clifford S. Asness, Tobias J. Moskowitz, Lasse Heje Pedersen* — 2013 · The Journal of Finance · cites: 3300

DOI `10.1111/jofi.12021` · [link](https://onlinelibrary.wiley.com/doi/10.1111/jofi.12021)

**Why:** Canonical demonstration that value and momentum premia and their joint structure are pervasive across markets/asset classes, framing the persistence question and the global common-factor view.

> We find consistent value and momentum return premia across eight diverse markets and asset classes, and a strong common factor structure among their returns. Value and momentum are more positively correlated across asset classes than passive exposures to the asset classes, but value and momentum are negatively correlated with each other, both within and across asset classes. Our results indicate the presence of common global risks that we characterize with a three-factor model. Global funding liquidity risk is a partial source of these patterns, which are identifiable only when examining value and momentum jointly across markets. Our findings present a challenge to existing behavioral, institutional, and rational asset pricing theories that mostly focus on US equities.

**Snowball:** Moskowitz, Ooi & Pedersen (2012), Time Series Momentum, JFE (10.1016/j.jfineco.2011.11.003); Lakonishok, Shleifer & Vishny (1994), Contrarian Investment, Extrapolation, and Risk, JF (10.1111/j.1540-6261.1994.tb04772.x)

---

#### A New Partial-Segmentation Approach to Modeling International Stock Returns
*G. Andrew Karolyi, Ying Wu* — 2018 · Journal of Financial and Quantitative Analysis · cites: 250

DOI `10.1017/S0022109017001016` · [link](https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/abs/new-partialsegmentation-approach-to-modeling-international-stock-returns/E027ED71D8CD2095EFE46C0C9DD15B3B)

**Why:** Shows that investability/accessibility frictions (acute in emerging/frontier markets) shape how size/value/momentum factors price returns — a key mechanism for cross-market anomaly differences and persistence.

> We propose a new multi-factor model for international stock returns that includes size, value, and momentum factor portfolios and that builds them in a partial-segmentation capital market framework. Accounting for externalities driven by the incomplete accessibility to stocks and stock markets, our model not only captures strong common variation in international stock returns but also achieves low pricing errors and rejection rates relative to pure segmentation and pure integration models. This partial-segmentation approach is evaluated using monthly returns for over 37,000 stocks from 46 developed and emerging market countries over 2 decades and for a wide variety of test assets.

**Snowball:** Bekaert, Harvey, Lundblad & Siegel (2011), What Segments Equity Markets?, RFS (10.1093/rfs/hhr082); Hou, Karolyi & Kho (2011), What Factors Drive Global Stock Returns?, RFS (10.1093/rfs/hhr013)

---

#### Emerging Markets Finance
*Geert Bekaert, Campbell R. Harvey* — 2003 · Journal of Empirical Finance · cites: 1100 · OA

DOI `10.1016/S0927-5398(02)00054-3` · [link](https://people.duke.edu/~charvey/Research/Published_Papers/P83_Emerging_markets_finance.pdf)

**Why:** Authoritative survey establishing that emerging markets have higher predictability and distinct return dynamics that evolve with liberalization/integration — the backdrop for anomaly decay.

> We survey the literature on emerging markets finance, emphasizing how the behavior of emerging market returns differs substantially from that of developed equity markets. Emerging market returns exhibit higher volatility, predictability, non-normality (skewness and kurtosis), and time-varying integration with world markets. We examine the forces that drive the cross-section and time-series of returns, volatility, correlation, and the cost of capital, and how these characteristics change as markets liberalize and become integrated with global capital markets. Market liberalizations reduce the cost of capital, have little effect on volatility, and increase correlation with world markets, with important implications for predictability and the persistence of local anomalies.

**Snowball:** Bekaert & Harvey (1995), Time-Varying World Market Integration, Journal of Finance (10.1111/j.1540-6261.1995.tb04795.x); Harvey (1995), Predictable Risk and Returns in Emerging Markets, RFS (10.1093/rfs/8.3.773); Bekaert, Harvey & Lundblad (2005), Does Financial Liberalization Spur Growth?, JFE (10.1016/j.jfineco.2004.05.007)

---

#### Do Market Efficiency Measures Yield Correct Inferences? A Comparison of Developed and Emerging Markets
*John M. Griffin, Patrick J. Kelly, Federico Nardari* — 2010 · The Review of Financial Studies · cites: 350

DOI `10.1093/rfs/hhq044` · [link](https://academic.oup.com/rfs/article-abstract/23/8/3225/1568669)

**Why:** Directly addresses how return predictability/autocorrelation measures compare across developed vs emerging markets, warning that emerging markets are not straightforwardly less efficient — central methodological caution for the topic.

> Common measures of market efficiency—short-horizon return predictability, variance ratios, return autocorrelations, and price delay—are widely used to compare developed and emerging markets. We show that these measures often yield inconsistent or even contradictory inferences about relative efficiency. Surprisingly, on most of these measures emerging markets do not appear less efficient than developed markets, even though emerging markets have higher trading costs, weaker information environments, and greater limits to arbitrage. The findings caution against drawing strong conclusions about cross-market differences in efficiency—and thus about anomaly profitability and persistence—from standard predictability and autocorrelation statistics.

**Snowball:** Lo & MacKinlay (1988), Stock Market Prices Do Not Follow Random Walks, RFS (10.1093/rfs/1.1.41); Hou & Moskowitz (2005), Market Frictions, Price Delay, and the Cross-Section of Expected Returns, RFS (10.1093/rfs/hhi023)

---

#### Tests of technical trading strategies in the emerging equity markets of Latin America and Asia
*Massoud Metghalchi (and coauthors)* — 1999 · Journal of Banking & Finance · cites: 600

DOI `10.1016/S0378-4266(99)00042-4` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0378426699000424)

**Why:** Early, heavily cited demonstration of technical-trading-rule profitability in emerging equity markets and the autocorrelation that underlies it — a touchstone for the TTR strand of the topic.

> This paper tests the profitability of technical trading rules (moving-average and trading-range-break rules) in emerging equity markets of Latin America and Asia. The study finds that technical trading rules have predictive power in several of these markets, generating buy signals followed by higher returns and lower volatility than sell signals, consistent with the idea that emerging markets exhibit stronger return autocorrelation and weaker informational efficiency than developed markets. However, the apparent profitability is sensitive to the inclusion of transaction costs and to data-snooping considerations, foreshadowing later work that questions the economic significance of these strategies.

**Snowball:** Brock, Lakonishok & LeBaron (1992), Simple Technical Trading Rules and the Stochastic Properties of Stock Returns, JF (10.1111/j.1540-6261.1992.tb04681.x); Bessembinder & Chan (1995), The Profitability of Technical Trading Rules in the Asian Stock Markets, Pacific-Basin Finance Journal (10.1016/0927-538X(95)00002-3)

---

#### Illusory Profitability of Technical Analysis in Emerging Foreign Exchange Markets
*Pierre-Henri Hsu, Mark P. Taylor, Zigan Wang* — 2016 · International Journal of Forecasting / University of St Andrews working paper · cites: 200 · OA

DOI `10.1016/j.ijforecast.2015.12.001` · [link](https://www.st-andrews.ac.uk/~wwwecon/repecfiles/2/1302.pdf)

**Why:** Key data-snooping-corrected critique showing emerging-market technical-rule profits are largely spurious — essential counterweight to naive predictability claims and to anomaly persistence.

> We test the profitability of 25,988 technical trading rules in emerging and developed foreign exchange markets. Although the best rules can generate annual mean excess returns of more than 30 percent in some emerging markets, almost all of these profits vanish once we account for data-snooping bias using a stepwise testing procedure that controls the family-wise error rate. We conclude that the apparent superior profitability of technical analysis in emerging markets is largely illusory, and that technical trading rules cannot consistently outperform a naive buy-and-hold benchmark after correcting for data snooping and transaction costs.

**Snowball:** White (2000), A Reality Check for Data Snooping, Econometrica (10.1111/1468-0262.00152); Hansen (2005), A Test for Superior Predictive Ability, JBES (10.1198/073500105000000063); Sullivan, Timmermann & White (1999), Data-Snooping, Technical Trading Rule Performance, and the Bootstrap, JF (10.1111/0022-1082.00163)

---

#### Technical Analysis and Discrete False Discovery Rate: Evidence from MSCI Indices
*Georgios Sermpinis, Arman Hassanniakalager, Charalampos Stasinakis, Ioannis Psaradellis* — 2019 · Journal of International Money and Finance (arXiv preprint) · cites: 60 · OA

DOI `10.1016/j.jimonfin.2021.102374` · arXiv `1811.06766` · [link](https://arxiv.org/abs/1811.06766)

**Why:** Recent multiple-testing-aware study confirming residual technical-rule predictability is stronger in emerging/frontier than advanced markets and varies with development — directly on-topic for cross-market profitability and decay.

> We examine the profitability of dynamic portfolios constructed from over 21,000 technical trading rules across 12 advanced, emerging and frontier MSCI markets over 2004-2015. We introduce a discrete false discovery rate (DFDR+/-) procedure to control for data snooping when selecting the best-performing rules. We find that technical analysis still has short-term value across advanced, emerging and frontier markets, with the proportion of profitable heuristics and the strength of predictability higher among emerging and frontier indices, and with profitability linked to financial stress, economic conditions, and the level of market development. Regular rebalancing of the rule portfolio is important for capturing this value.

**Snowball:** Bajgrowicz & Scaillet (2012), Technical Trading Revisited: False Discoveries, Persistence Tests, and Transaction Costs, JFE (10.1016/j.jfineco.2012.06.001); Harvey & Liu (2020), False (and Missed) Discoveries in Financial Economics, JF (10.1111/jofi.12951)

---

#### Performance Persistence in Anomaly Returns: Evidence from Frontier Markets
*Adam Zaremba, Andreas Karathanasopoulos, Alina Maydybura (and coauthors)* — 2020 · Emerging Markets Finance and Trade · cites: 40

DOI `10.1080/1540496X.2019.1605594` · [link](https://www.tandfonline.com/doi/abs/10.1080/1540496X.2019.1605594)

**Why:** Directly on-topic large-scale replication showing anomaly returns persist strongly in frontier markets — the core recent empirical anchor for 'anomaly persistence in frontier markets'.

> We explore the performance persistence of equity anomalies in frontier markets by replicating 140 anomalies in the cross-section of returns across a sample of 23 frontier markets. We document robust and strong performance persistence in anomaly returns: anomalies that performed well in the past continue to outperform in the future. This return persistence is driven by two independent components related to past short-term and long-term returns, which reflect short-term momentum in anomaly returns and cross-sectional variation in long-term anomaly returns, respectively. The findings have direct implications for designing factor strategies and for understanding the limits to arbitrage in the least-developed equity markets.

**Snowball:** McLean & Pontiff (2016), Does Academic Research Destroy Stock Return Predictability?, JF (10.1111/jofi.12365); Jacobs & Müller (2020), Anomalies Across the Globe: Once Public, No Longer Existent?, JFE (10.1016/j.jfineco.2019.04.008)

---

#### Explaining Equity Anomalies in Frontier Markets: A Horserace of Factor Pricing Models
*Adam Zaremba, Alina Maydybura, Anna Czapkiewicz, Marina Arnaut* — 2021 · Emerging Markets Finance and Trade · cites: 30 · OA

DOI `10.1080/1540496X.2019.1612361` · [link](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3378785)

**Why:** Companion frontier-markets study identifying which factor models explain (and which anomalies survive in) frontier markets — key for understanding the structure and persistence of these premia.

> We replicate over 160 stock market anomalies in the cross-section of returns in 23 frontier countries for the years 1996-2017 and evaluate their performance with competing factor pricing models. The Carhart (1997) four-factor model outperforms both the Fama and French (2015) five-factor model and the q-factor model of Hou, Xue, and Zhang (2015) in explaining frontier-market anomaly returns. The superiority of the four-factor model is driven by its ability to account for momentum-related anomalies, underscoring the central role of momentum in frontier-market return predictability and the partial applicability of developed-market factor models to the least-developed markets.

**Snowball:** Carhart (1997), On Persistence in Mutual Fund Performance, JF (10.1111/j.1540-6261.1997.tb03808.x); Hou, Xue & Zhang (2015), Digesting Anomalies: An Investment Approach, RFS (10.1093/rfs/hhu068); Fama & French (2015), A Five-Factor Asset Pricing Model, JFE (10.1016/j.jfineco.2014.10.010)

---

#### Revisiting momentum profits in emerging markets
*Hilal Anwar Butt, James W. Kolari, Mohsin Sadaqat* — 2021 · Pacific-Basin Finance Journal · cites: 35

DOI `10.1016/j.pacfin.2020.101486` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0927538X20306983)

**Why:** Recent re-examination directly addressing whether and how momentum persists in emerging markets, challenging the 'weak emerging-market momentum' consensus.

> This paper revisits the cross-sectional and time-series properties of momentum returns in 19 emerging markets. Contrary to the common view that momentum is weak or absent in emerging markets, we show that momentum profitability is economically and statistically significant once the analysis accounts for the time-series behavior of momentum and the interaction between market states and momentum payoffs. We document that emerging-market momentum exhibits state dependence and that earlier negative or insignificant findings are partly attributable to sample composition and methodology. The results have implications for the persistence and design of momentum strategies in less-developed equity markets.

**Snowball:** Chui, Titman & Wei (2010), Individualism and Momentum around the World, JF (10.1111/j.1540-6261.2009.01532.x); Daniel & Moskowitz (2016), Momentum Crashes, JFE (10.1016/j.jfineco.2015.12.002)

---

#### Machine Learning and the Cross-Section of Emerging Market Stock Returns
*Matthias X. Hanauer, Tobias Kalsbach* — 2023 · Emerging Markets Review · cites: 45

DOI `10.1016/j.ememar.2023.101022` · [link](https://www.sciencedirect.com/science/article/abs/pii/S1566014123000274)

**Why:** State-of-the-art ML evidence that cross-sectional anomaly predictability persists and is tradable (net of costs) in emerging markets, with momentum-type signals dominant — the modern frontier of the topic.

> We compare a variety of machine-learning models to predict the cross-section of emerging market stock returns. Allowing for non-linearities and interactions leads to economically and statistically superior out-of-sample returns compared to traditional linear models. Significant net returns can still be achieved when accounting for transaction costs, short-selling constraints, and limiting the investment universe to large stocks. Stock-level characteristics related to price trends (momentum) and risk are among the most important predictors, and the documented predictability is robust across regions, suggesting that anomaly-based predictability remains exploitable in emerging markets when modeled flexibly.

**Snowball:** Gu, Kelly & Xiu (2020), Empirical Asset Pricing via Machine Learning, RFS (10.1093/rfs/hhaa009); Leippold, Wang & Zhou (2022), Machine Learning in the Chinese Stock Market, JFE (10.1016/j.jfineco.2021.08.017)

---

#### Stock market anomalies and machine learning across the globe
*Vitor Azevedo, Sebastian Kaiser, Sebastian Müller* — 2023 · Journal of Asset Management · cites: 40 · OA

DOI `10.1057/s41260-023-00318-z` · [link](https://link.springer.com/article/10.1057/s41260-023-00318-z)

**Why:** Global ML anomaly study spanning developed and emerging markets that quantifies how much anomaly predictability survives realistic costs across regions — a key benchmark for cross-market anomaly persistence.

> We identify the characteristics and model specifications that drive the out-of-sample performance of machine-learning models for stock return prediction across an international sample of nearly 1.9 billion stock-month-anomaly observations from 1980 to 2019 covering developed and emerging markets. We document significant monthly value-weighted long-short returns of around 1.8-2.2 percent, and the vast majority of tested models outperform a simple linear combination of predictors by a substantial margin. Composite machine-learning predictors retain significant long-short returns even at transaction costs up to 300 basis points. Comparing 46 model variations, the highest return predictability is delivered by feed-forward neural networks or composite predictors with expanding windows, elastic-net feature reduction, and percent-ranked returns as the target.

**Snowball:** Gu, Kelly & Xiu (2020), Empirical Asset Pricing via Machine Learning, RFS (10.1093/rfs/hhaa009); Jensen, Kelly & Pedersen (2023), Is There a Replication Crisis in Finance?, JF (10.1111/jofi.13249)

---

#### Machine learning goes global: Cross-sectional return predictability in international stock markets
*Nusret Cakici, Christian Fieberg, Daniel Metko, Adam Zaremba* — 2023 · Journal of Economic Dynamics and Control · cites: 30

DOI `10.1016/j.jedc.2023.104725` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0165188923001318)

**Why:** International ML study explicitly linking the strength of cross-sectional anomaly predictability to limits-to-arbitrage and market development, and to the local-vs-global model question — central to cross-market transfer and persistence.

> We examine cross-sectional return predictability using machine-learning methods in a large international sample of developed and emerging stock markets. We find that machine-learning models, particularly tree-based methods and neural networks that capture non-linearities and interactions, generate substantial out-of-sample return predictability around the world. Predictability is generally stronger in markets with greater limits to arbitrage and lower informational efficiency, and global models estimated by pooling data across countries frequently outperform purely local models out-of-sample. The results highlight that anomaly-based predictability is a pervasive international phenomenon whose magnitude varies with market development and frictions.

**Snowball:** Tobek & Hronec (2021), Does It Pay to Follow Anomalies Research? Machine Learning Approach with International Evidence, Journal of Financial Markets (10.1016/j.finmar.2020.100588); Rapach, Strauss & Zhou (2013), International Stock Return Predictability: What Is the Role of the United States?, JF (10.1111/jofi.12041)

---

#### Evolving efficiency of the BRICS markets
*Maria V. Kulikova, David R. Taylor, Gennady Yu. Kulikov* — 2024 · arXiv preprint (q-fin / math.OC) · cites: 3 · OA

arXiv `2403.05233` · [link](https://arxiv.org/abs/2403.05233)

**Why:** Recent application of time-varying autocorrelation/efficiency tests (Adaptive Markets Hypothesis) to major emerging markets — directly relevant to return autocorrelation and the decay of predictability over time.

> This paper investigates a time-varying version of weak-form market efficiency in the BRICS countries. A moving window test for sample autocorrelations is applied alongside a Kalman filter approach to recover the hidden dynamics of the market efficiency process through appropriate time-varying autoregressive models with both homoscedastic and heteroscedastic conditional variance. Monthly data covers the period from January 1995 to December 2020, which includes the 2008-2009 global financial crisis and the recent COVID-19 recession. The results reveal that all the BRICS stock markets were affected during both periods, but generally remained weak-form efficient, with the exception of China.

**Snowball:** Lo (2004), The Adaptive Markets Hypothesis, Journal of Portfolio Management (10.3905/jpm.2004.442611); Ito, Noda & Wada (2016), The Evolution of Stock Market Efficiency in the US: A Non-Bayesian Time-Varying Model Approach (10.1080/00036846.2015.1119791)

---

#### Time-varying return predictability in the Chinese stock market
*Huai-Long Shi, Zhi-Qiang Jiang, Wei-Xing Zhou* — 2017 · Reports in Advances of Physical Sciences (arXiv preprint) · cites: 25 · OA

DOI `10.1142/S2424942417400023` · arXiv `1611.04090` · [link](https://arxiv.org/abs/1611.04090)

**Why:** Concrete emerging-market (China) evidence that return predictability and autocorrelation are time-varying and crisis-concentrated, illustrating the mechanism behind anomaly decay/persistence.

> We investigate the time-varying behavior of return predictability in the Chinese stock market, the largest emerging market, using statistical tests applied over moving windows. We find that return predictability varies substantially over time and that significant return predictability is concentrated around periods of market turmoil, while markets approach efficiency during calmer periods. These results support the Adaptive Markets Hypothesis and indicate that the degree of weak-form (in)efficiency, and hence the scope for autocorrelation-based and technical strategies, is regime-dependent in emerging markets.

**Snowball:** Lo (2004), The Adaptive Markets Hypothesis, JPM (10.3905/jpm.2004.442611); Lim, Brooks & Kim (2008), Financial Crisis and Stock Market Efficiency: Empirical Evidence from Asian Countries (10.1016/j.irfa.2008.09.004)

---

#### Predictable Risk and Returns in Emerging Markets
*Campbell R. Harvey* — 1995 · Review of Financial Studies · completeness-add

DOI `10.1093/rfs/8.3.773` · [link](https://doi.org/10.1093/rfs/8.3.773)

**Why:** The foundational paper establishing predictability and time-varying expected returns in emerging markets and that EM returns load on local information — the conceptual origin of the whole 'anomalies behave differently in EM' literature; conspicuously absent from the gathered set.

> Emerging equity markets in Europe, Latin America, Asia, the Mideast and Africa exhibit high expected returns together with high volatility, and low correlations with developed-market returns that sharply reduce the unconditional risk of a global portfolio. Standard global asset-pricing models, which assume complete integration of world capital markets, fail to explain the cross-section of average returns in these countries. Analysis of the predictability of emerging-market returns shows that, unlike developed markets, they are far more likely to be influenced by local rather than global information. A conditional specification in which risk exposures and expected returns vary through time as functions of both global and local information variables substantially improves the ability to model emerging-market expected returns.

**Snowball:** Bekaert, G. & Harvey, C.R. (1995), Time-Varying World Market Integration, Journal of Finance (10.1111/j.1540-6261.1995.tb04790.x); Harvey, C.R. (1991), The World Price of Covariance Risk, Journal of Finance (10.1111/j.1540-6261.1991.tb02674.x); Ferson, W.E. & Harvey, C.R. (1991), The Variation of Economic Risk Premiums, JPE (10.1086/261748); Bekaert, G. (1995), Market Integration and Investment Barriers in Emerging Equity Markets, World Bank Economic Review (10.1093/wber/9.1.75)

---

#### Anomalies across the globe: Once public, no longer existent?
*Heiko Jacobs, Sebastian Müller* — 2020 · Journal of Financial Economics · completeness-add

DOI `10.1016/j.jfineco.2019.06.004` · [link](https://doi.org/10.1016/j.jfineco.2019.06.004)

**Why:** Canonical cross-country study of anomaly persistence vs. decay across 39 markets; directly on the topic title and the natural empirical counterpoint to Zaremba's frontier-persistence results, showing EM anomalies decay far less than US ones.

> The authors study the pre- and post-publication return predictability of 241 cross-sectional anomalies in 39 international stock markets. In the United States they find a strong and statistically significant post-publication decline in anomaly profitability of about 58%, consistent with arbitrageurs trading away mispricing once it is documented. Strikingly, in the 38 other (largely non-US, including many emerging) markets they find no comparable post-publication decay; anomaly returns remain economically large and broadly stable out of sample. The contrast suggests that anomalies reflect real mispricing and that limits to arbitrage outside the US — especially in emerging and frontier markets — allow predictability to persist far longer than in the US.

**Snowball:** McLean, R.D. & Pontiff, J. (2016), Does Academic Research Destroy Stock Return Predictability?, Journal of Finance (10.1111/jofi.12365); Hou, K., Xue, C. & Zhang, L. (2020), Replicating Anomalies, RFS (10.1093/rfs/hhy131); Chordia, T., Subrahmanyam, A. & Tong, Q. (2014), Have capital market anomalies attenuated in the recent era of high liquidity and trading activity?, JAE (10.1016/j.jacceco.2014.06.001)

---

#### The cross-section of emerging market stock returns
*Matthias X. Hanauer, Jochim G. Lauterbach* — 2019 · Emerging Markets Review · completeness-add

DOI `10.1016/j.ememar.2018.11.009` · [link](https://doi.org/10.1016/j.ememar.2018.11.009)

**Why:** The canonical empirical EM cross-section paper documenting which anomalies actually survive in emerging markets; it is the direct predecessor that the already-gathered Hanauer & Kalsbach (2023) ML paper extends, so it belongs for lineage and baseline.

> Using a broad sample of emerging-market stocks, the paper examines which firm characteristics predict the cross-section of returns and how the major factor effects perform out of the developed-market universe in which they were discovered. Cash-flow-to-price, gross profitability, composite equity issuance, and momentum emerge as pervasive, robust predictors of emerging-market returns, while several other characteristics are weak or absent. The characteristic premia survive standard risk adjustments and reasonable transaction-cost assumptions, and a multi-characteristic strategy delivers economically large spreads. The results establish a baseline factor structure for emerging markets that subsequent machine-learning studies build upon.

**Snowball:** Fama, E.F. & French, K.R. (2017), International tests of a five-factor asset pricing model, JFE (10.1016/j.jfineco.2016.11.004); Novy-Marx, R. (2013), The other side of value: The gross profitability premium, JFE (10.1016/j.jfineco.2013.01.003); Cakici, N., Fabozzi, F.J. & Tan, S. (2013), Size, value, and momentum in emerging market stock returns, Emerging Markets Review (10.1016/j.ememar.2013.08.003)

---

#### The cross-section of stock returns in frontier emerging markets
*Wilma de Groot, Juan Pang, Laurens Swinkels* — 2012 · Journal of Empirical Finance · OA · completeness-add

DOI `10.1016/j.jempfin.2012.08.007` · [link](https://doi.org/10.1016/j.jempfin.2012.08.007)

**Why:** Canonical frontier-market cross-section paper establishing that value and momentum persist net of (high) transaction costs in the most illiquid equity universe — exactly the net-of-cost persistence question for frontier markets, missing from the list.

> Using a survivorship-bias-free dataset of more than 1,400 stocks over 1997–2008 covering 24 of the most liquid frontier emerging markets, the authors document economically and statistically significant value and momentum effects together with a local size effect in the cross-section of frontier-market returns. The value and momentum premia are robust and, importantly, survive after incorporating conservative assumptions about the high transaction costs that characterise these illiquid markets. The findings show that classic developed-market anomalies extend to the least-integrated, hardest-to-trade equity universe, while highlighting that net-of-cost implementability is the binding constraint on exploiting them.

**Snowball:** Rouwenhorst, K.G. (1999), Local Return Factors and Turnover in Emerging Stock Markets, Journal of Finance (10.1111/0022-1082.00151); Lesmond, D.A. (2005), Liquidity of emerging markets, JFE (10.1016/j.jfineco.2004.01.005); Korajczyk, R.A. & Sadka, R. (2004), Are momentum profits robust to trading costs?, Journal of Finance (10.1111/j.1540-6261.2004.00656.x)

---

#### Stock return predictability and the adaptive markets hypothesis: Evidence from century-long U.S. data
*Jae H. Kim, Abul Shamsuddin, Kian-Ping Lim* — 2011 · Journal of Empirical Finance · completeness-add

DOI `10.1016/j.jempfin.2011.08.002` · [link](https://doi.org/10.1016/j.jempfin.2011.08.002)

**Why:** Canonical statement of the adaptive-markets / time-varying-predictability mechanism that underlies anomaly decay and evolving efficiency; supplies the theoretical lens behind the gathered Kulikova BRICS and Shi-Jiang-Zhou China time-varying-efficiency papers.

> Using more than a century of U.S. stock-return data and rolling-window automatic variance-ratio and generalized-spectral tests, the authors show that the degree of return predictability is not constant but varies substantially over time. Predictability is strongly associated with changing market conditions: it tends to be high during periods of economic or political crisis, market crashes, and recessions, and low (returns near random-walk) during stable, calm periods. Return predictability is found to be driven by time-varying market conditions rather than being a fixed feature, consistent with Lo's adaptive markets hypothesis and inconsistent with a strictly time-invariant efficient-market view. The results provide an evolutionary explanation for why exploitable patterns appear and disappear over time.

**Snowball:** Lo, A.W. (2004), The Adaptive Markets Hypothesis, Journal of Portfolio Management (10.3905/jpm.2004.442611); Lo, A.W. & MacKinlay, A.C. (1988), Stock Market Prices Do Not Follow Random Walks, RFS (10.1093/rfs/1.1.41); Kim, J.H. (2009), Automatic variance ratio test under conditional heteroskedasticity, Finance Research Letters (10.1016/j.frl.2009.04.003)

---

#### The predictive ability of technical trading rules: an empirical analysis of developed and emerging equity markets
*Kevin Rink* — 2023 · Financial Markets and Portfolio Management · OA · completeness-add

DOI `10.1007/s11408-023-00433-2` · [link](https://doi.org/10.1007/s11408-023-00433-2)

**Why:** Strongest recent (post-2022) technical-trading-rule study contrasting 23 developed vs 18 emerging markets with proper data-snooping controls; directly documents that EM technical-rule profitability is higher in-sample but decays and is not persistent out-of-sample.

> This study evaluates whether a universe of 6,406 technical trading rules can predict the leading equity indices of 23 developed and 18 emerging markets over a sample spanning up to 66 years, using data-snooping-robust testing (Reality Check / Superior Predictive Ability and FDR-type controls). In-sample, a significant share of rules outperforms a buy-and-hold benchmark in the majority of markets, and the proportion of profitable rules is markedly higher among emerging-market indices than developed ones. However, this predictability diminishes drastically over time in all markets, and out-of-sample the recently best-performing rules subsequently underperform buy-and-hold, especially once transaction costs are accounted for. The results imply that apparent technical-trading edges in emerging markets are largely an in-sample, non-persistent phenomenon.

**Snowball:** Sullivan, R., Timmermann, A. & White, H. (1999), Data-Snooping, Technical Trading Rule Performance, and the Bootstrap, Journal of Finance (10.1111/0022-1082.00163); Brock, W., Lakonishok, J. & LeBaron, B. (1992), Simple Technical Trading Rules and the Stochastic Properties of Stock Returns, Journal of Finance (10.1111/j.1540-6261.1992.tb04681.x); Bajgrowicz, P. & Scaillet, O. (2012), Technical trading revisited: False discoveries, persistence tests, and transaction costs, JFE (10.1016/j.jfineco.2012.06.001)

---

#### Daily Momentum and New Investors in an Emerging Stock Market
*Zhenyu Gao, Wenxi Jiang, Wei A. Xiong, Wei Xiong* — 2023 · NBER Working Paper No. 31839 · OA · completeness-add

DOI `10.3386/w31839` · [link](https://www.nber.org/papers/w31839)

**Why:** Strong recent (2023) cross-market study showing momentum manifests differently in emerging markets — at the daily frequency and driven by new investors — across 21 emerging vs 21 developed markets; reconciles the puzzling absence of conventional momentum in China and frames EM-specific anomaly behavior.

> Despite the dominance of retail investors in the Chinese stock market, there is a conspicuous absence of price momentum in weekly and monthly returns. This study uncovers pronounced price momentum in daily returns and, through a systematic analysis of trading heterogeneity across investor groups, links the daily momentum to the attention and trading activities of new investors — a phenomenon especially significant in emerging stock markets. The authors further document daily price momentum in numerous other emerging markets (value-weighted daily momentum in 14 of 21 emerging markets versus only 3 of 21 developed markets), in sharp contrast to its relative scarcity in developed markets. The findings show that the well-known absence of conventional momentum in China masks a distinct, investor-driven daily-frequency anomaly that is a hallmark of emerging markets.

**Snowball:** Jegadeesh, N. & Titman, S. (1993), Returns to Buying Winners and Selling Losers, Journal of Finance (10.1111/j.1540-6261.1993.tb04702.x); Chui, A.C.W., Titman, S. & Wei, K.C.J. (2010), Individualism and Momentum around the World, Journal of Finance (10.1111/j.1540-6261.2010.01532.x); Barber, B.M., Lee, Y.-T., Liu, Y.-J. & Odean, T. (2009), Just How Much Do Individual Investors Lose by Trading?, RFS (10.1093/rfs/hhn046)

---

