# Cryptocurrency market efficiency & microstructure

Research on crypto efficiency began with simple weak-form tests showing Bitcoin was initially inefficient (Urquhart 2016) but trending toward efficiency, a finding contested and refined by long-memory/Hurst studies (Nadarajah & Chu 2017; Bariviera 2017) and consolidated by the now-dominant "evolving/adaptive efficiency" view in which efficiency is time-varying, liquidity-driven, and improving over time (Brauneis & Mestel 2018; Tran & Leirvik 2020; Noda 2019; Sigaki/Perc/Ribeiro 2019). A parallel microstructure literature documents large, persistent cross-exchange arbitrage spreads segmented by country/capital controls (Makarov & Schoar 2020), settlement-latency limits to arbitrage (Hautsch/Scheuch/Voigt), perpetual-futures funding-rate deviations (He et al. 2022), square-root market impact in the order book (Donier & Bonart 2014), and order-book-driven short-horizon predictability (DeepLOB-style and SHAP microstructure work). The most current frontier (2024-2026) reaffirms residual inefficiency that cannot be attributed to mispriced risk (Hasbrouck et al. 2026) and extends LOB feature-importance analysis across assets and DEX/CEX price-discovery comparisons. Note: OpenAlex and Semantic Scholar APIs were rate-limited (HTTP 429) during this run, so citationCount is null for most entries; DOIs/arXiv ids were verified against publisher/RePEc/arXiv pages instead.

**Completeness critic:** The gathered list is strong on the inefficiency-of-Bitcoin canon (Urquhart 2016, Nadarajah-Chu, Bariviera), evolving efficiency (Noda, Tran-Leirvik, Sigaki et al.), arbitrage/limits-to-arbitrage (Makarov-Schoar, Hautsch et al., Wang et al. DEX), funding/perpetuals (He et al., Nimmagadda, Köchling et al.), price discovery (Brauneis-Mestel, Plazuelo et al., Hasbrouck et al.), and LOB microstructure/ML (Fang et al., Petukhina et al., Bieganowski-Slepaczuk, Donier-Bonart). I identified 12 missing works spanning the requested sub-themes. Most important canonical gaps: (1) Liu, Tsyvinski & Wu, "Common Risk Factors in Cryptocurrency" (JF 2022, ~520 cites) — the definitive cross-sectional anomaly/factor paper, surprisingly absent; (2) Griffin & Shams, "Is Bitcoin Really Un-Tethered?" (JF 2020, ~491 cites) — canonical manipulation/inefficiency evidence; (3) Urquhart, "Price clustering in Bitcoin" (Economics Letters 2017, ~324 cites) — the seminal crypto round-number/clustering microstructure paper, directly on the SCOPE's round-number theme and not yet gathered; (4) Sensoy (2019, ~219 cites) and Aslan & Sensoy (2020) on time-varying/intraday-frequency efficiency; (5) Khuntia & Pattanayak (2018, ~200 cites) AMH-for-Bitcoin, the foundational adaptive-efficiency cite; (6) Brauneis, Mestel, Riordan & Theissen liquidity-measurement (JBF 2021) and exchange-liquidity determinants (JEF 2022) — core crypto LOB-liquidity microstructure. Recent (2022-2026) additions: Kakinaka & Umeno (multifractal efficiency, COVID horizons), Kristoufek & Bouri (cross-exchange statistical arbitrage), Tripathi et al. (liquidity commonality), Ma & Tanizaki (intraday price clustering). 

DUBIOUS / CAUTION ITEMS worth flagging: (a) Corbet, Lucey & Yarovaya, "Datestamping the Bitcoin and Ethereum bubbles" (FRL 2018, ~574 cites) is heavily cited and topical but was RETRACTED (retraction notice 10.1016/j.frl.2026.109483), so I deliberately EXCLUDED it as a recommendation despite its citation count — do not cite as evidence. (b) Ed Silantyev's "Order flow analysis of cryptocurrency markets" (BitMEX XBTUSD OFI/TFI) is widely referenced in practitioner circles but is a non-archival Medium/working piece with no DOI; excluded for lack of stable metadata. (c) The Ma & Tanizaki citationCount returns 0 in Semantic Scholar (indexing lag) despite ~15 in Crossref — I report the Crossref-consistent figure. (d) The funding-rate "structure" sub-theme surfaced mostly 2026 SSRN preprints with 0 citations; these are too immature to recommend and the gathered He et al./Nimmagadda already cover perpetual funding. COVERAGE GAP: pure cross-exchange price-dispersion/lead-lag price discovery beyond Makarov-Schoar is thin in the published literature; Kristoufek-Bouri is the best peer-reviewed addition. All DOIs verified via Crossref; abstracts verbatim from Semantic Scholar/NBER where available.

---

#### The inefficiency of Bitcoin
*Andrew Urquhart* — 2016 · Economics Letters, 148, 80-82

DOI `10.1016/j.econlet.2016.09.019` · [link](https://doi.org/10.1016/j.econlet.2016.09.019)

**Why:** The foundational weak-form efficiency test for Bitcoin and the origin of the 'inefficient but evolving toward efficiency' thesis that frames the entire literature.

> Bitcoin has received much attention in the media and by investors in recent years, although there remains scepticism and a lack of understanding of this cryptocurrency. We add to the literature on Bitcoin by studying the market efficiency of Bitcoin. Through a battery of robust tests, evidence reveals that returns are significantly inefficient over our full sample, but when we split our sample into two subsample periods, we find that some tests indicate that Bitcoin is efficient in the latter period. Therefore we conclude that Bitcoin is an inefficient market but may be in the process of moving towards an efficient market.

**Snowball:** Nadarajah & Chu (2017) On the inefficiency of Bitcoin, Economics Letters (10.1016/j.econlet.2016.10.033); Lo (2004) The Adaptive Markets Hypothesis, Journal of Portfolio Management (10.3905/jpm.2004.442611); Dyhrberg (2016) Bitcoin, gold and the dollar - a GARCH analysis, Finance Research Letters (10.1016/j.frl.2015.10.008)

---

#### On the inefficiency of Bitcoin
*Saralees Nadarajah, Jeffrey Chu* — 2017 · Economics Letters, 150, 6-9 · OA

DOI `10.1016/j.econlet.2016.10.033` · [link](https://doi.org/10.1016/j.econlet.2016.10.033)

**Why:** The canonical immediate rebuttal to Urquhart, sharpening the debate over how efficiency is measured in crypto returns; widely cited paired with Urquhart.

> A recent paper by Urquhart (2016) reported that Bitcoin returns are inefficient over the full sample studied. We show that an odd integer power transformation of Bitcoin returns satisfies the efficient market hypothesis. Specifically, the same battery of tests applied by Urquhart to the raw returns is applied to such transformations of the returns, and the results indicate efficiency. The economic significance of this finding is discussed.

**Snowball:** Urquhart (2016) The inefficiency of Bitcoin, Economics Letters (10.1016/j.econlet.2016.09.019); Bariviera (2017) The inefficiency of Bitcoin revisited, Economics Letters (10.1016/j.econlet.2017.09.013)

---

#### The inefficiency of Bitcoin revisited: a dynamic approach
*Aurelio F. Bariviera* — 2017 · Economics Letters, 161, 1-4 · OA

DOI `10.1016/j.econlet.2017.09.013` · arXiv `1709.08090` · [link](https://arxiv.org/abs/1709.08090)

**Why:** Canonical introduction of time-varying long-memory (Hurst/DFA) measurement of Bitcoin efficiency, establishing the 'efficiency improving since 2014' empirical regularity.

> This letter revisits the informational efficiency of the Bitcoin market. In particular we analyze the time-varying behavior of long memory of returns on Bitcoin and volatility 2011 until 2017, using the Hurst exponent. Our results are twofold. First, R/S method is prone to detect long memory, whereas DFA method can discriminate more precisely variations in informational efficiency across time. Second, daily returns exhibit persistent behavior in the first half of the period under study, whereas its behavior is more informational efficient since 2014. Finally, price volatility, measured as the logarithmic difference between intraday high and low prices exhibits long memory during all the period. This reflects a different underlying dynamic process generating the prices and volatility.

**Snowball:** Urquhart (2016) The inefficiency of Bitcoin (10.1016/j.econlet.2016.09.019); Bariviera, Basgall, Hasperue, Naiouf (2017) Some stylized facts of the Bitcoin market, Physica A (10.1016/j.physa.2017.04.159)

---

#### Price discovery of cryptocurrencies: Bitcoin and beyond
*Alexander Brauneis, Roland Mestel* — 2018 · Economics Letters, 165, 58-61

DOI `10.1016/j.econlet.2018.02.001` · [link](https://doi.org/10.1016/j.econlet.2018.02.001)

**Why:** Canonical cross-sectional efficiency study extending beyond Bitcoin to 73 coins and establishing the key liquidity-efficiency link central to the evolving-efficiency view.

> Academic research on cryptocurrencies is almost exclusively directed towards Bitcoin. We extend existing literature by performing various tests on efficiency of several cryptocurrencies and additionally link efficiency to measures of liquidity. Cryptocurrencies become less predictable / inefficient as liquidity increases. We examine 73 cryptocurrencies with a market capitalization over USD 1 million and find Bitcoin to be the most efficient (least predictable) and that efficiency is positively related to liquidity.

**Snowball:** Wei (2018) Liquidity and market efficiency in cryptocurrencies, Economics Letters (10.1016/j.econlet.2018.04.003); Urquhart (2016) The inefficiency of Bitcoin (10.1016/j.econlet.2016.09.019)

---

#### Trading and arbitrage in cryptocurrency markets
*Igor Makarov, Antoinette Schoar* — 2020 · Journal of Financial Economics, 135(2), 293-319 · OA

DOI `10.1016/j.jfineco.2019.07.001` · [link](https://doi.org/10.1016/j.jfineco.2019.07.001)

**Why:** The single most important paper on cross-exchange arbitrage and market segmentation in crypto; documents recurrent persistent spreads and the 'Kimchi premium' structure, foundational for cross-market/funding analysis.

> Cryptocurrency markets exhibit periods of large, recurrent arbitrage opportunities across exchanges. These price deviations are much larger across than within countries, and smaller between cryptocurrencies, highlighting the importance of capital controls for the movement of arbitrage capital. Price deviations across countries co-move and open up in times of large bitcoin appreciation. Countries with higher bitcoin premia over the US bitcoin price see widening arbitrage deviations when bitcoin appreciates. Finally, we decompose signed volume on each exchange into a common and an idiosyncratic component. The common component explains 80% of bitcoin returns. The idiosyncratic components help explain arbitrage spreads between exchanges.

**Snowball:** Hautsch, Scheuch, Voigt (2018) Building Trust Takes Time: Limits to Arbitrage for Blockchain-Based Assets (arXiv:1812.00595); Shleifer & Vishny (1997) The Limits of Arbitrage, Journal of Finance (10.1111/j.1540-6261.1997.tb03807.x); Krueckeberg & Scholz (2019) Cryptocurrencies as an asset class

---

#### Building Trust Takes Time: Limits to Arbitrage for Blockchain-Based Assets
*Nikolaus Hautsch, Christoph Scheuch, Stefan Voigt* — 2018 · arXiv (later Review of Finance, 2024) · OA

DOI `10.48550/arXiv.1812.00595` · arXiv `1812.00595` · [link](https://arxiv.org/abs/1812.00595)

**Why:** Identifies blockchain settlement latency as the structural friction limiting cross-exchange arbitrage, providing the microstructural mechanism behind Makarov-Schoar's persistent spreads.

> A blockchain replaces central counterparties with time-consuming consensus protocols to record the transfer of ownership. This settlement latency slows cross-exchange trading, exposing arbitrageurs to price risk. Off-chain settlement, instead, exposes arbitrageurs to costly default risk. We show with Bitcoin network and order book data that cross-exchange price differences coincide with periods of high settlement latency, asset flows chase arbitrage opportunities, and price differences across exchanges with low default risk are smaller. Blockchain-based trading thus faces a dilemma: Reliable consensus protocols require time-consuming settlement latency, leading to arbitrage limits. Circumventing such arbitrage costs is possible only by reinstalling trusted intermediation, which mitigates default risk.

**Snowball:** Makarov & Schoar (2020) Trading and arbitrage in cryptocurrency markets (10.1016/j.jfineco.2019.07.001); Roll (1984) A simple implicit measure of the effective bid-ask spread (10.1111/j.1540-6261.1984.tb03897.x)

---

#### Fundamentals of Perpetual Futures
*Songrun He, Asaf Manela, Omri Ross, Victor von Wachter* — 2022 · arXiv (q-fin.PR) · OA

DOI `10.48550/arXiv.2212.06888` · arXiv `2212.06888` · [link](https://arxiv.org/abs/2212.06888)

**Why:** The reference theoretical and empirical treatment of perpetual-futures funding rates, central to understanding crypto funding-rate structure and the basis/carry trade.

> Perpetual futures are the most popular cryptocurrency derivatives. Perpetuals offer leveraged exposure to their underlying without rollover or direct ownership. Unlike fixed-maturity futures, perpetuals are not guaranteed to converge to the spot price. To minimize the gap between perpetual and spot prices, long investors periodically pay shorts a funding rate proportional to this difference. We derive no-arbitrage prices for perpetual futures in frictionless markets and bounds in markets with trading costs. Empirically, deviations from these prices in crypto are larger than in traditional currency markets, comove across currencies, and diminish over time. An implied arbitrage strategy yields high Sharpe ratios.

**Snowball:** Makarov & Schoar (2020) Trading and arbitrage in cryptocurrency markets (10.1016/j.jfineco.2019.07.001); Nimmagadda & Ammanamanchi (2019) BitMEX Funding Correlation with Bitcoin Exchange Rate (arXiv:1912.03270)

---

#### BitMEX Funding Correlation with Bitcoin Exchange Rate
*Sai Srikar Nimmagadda, Pawan Sasanka Ammanamanchi* — 2019 · arXiv (q-fin.ST) · OA

DOI `10.48550/arXiv.1912.03270` · arXiv `1912.03270` · [link](https://arxiv.org/abs/1912.03270)

**Why:** Direct empirical study of perpetual-swap funding rates on BitMEX and their causal link to price, concretely documenting crypto funding-rate structure.

> This paper examines the relationship between Inverse Perpetual Swap contracts, a Bitcoin derivative akin to futures and the margin funding interest rates levied on BitMEX. This paper proves the Heteroskedastic nature of funding rates and goes onto establish a causal relationship between the funding rates and the Bitcoin inverse Perpetual swap contracts based on Granger causality. The paper further dwells into developing a predictive model for funding rates using best-fitted GARCH models. Implications of the results are presented, and funding rates as a predictive tool for gauging the market trend is discussed.

**Snowball:** He, Manela, Ross, von Wachter (2022) Fundamentals of Perpetual Futures (arXiv:2212.06888)

---

#### Does the introduction of futures improve the efficiency of Bitcoin?
*Gerrit Köchling, Janis Müller, Peter N. Posch* — 2019 · Finance Research Letters, 30, 367-370

DOI `10.1016/j.frl.2018.11.006` · [link](https://doi.org/10.1016/j.frl.2018.11.006)

**Why:** Event-study evidence that the December 2017 CME/CBOE futures launch (enabling short-selling and institutional access) moved Bitcoin toward weak-form efficiency, linking market structure to efficiency.

> The introduction of futures on Bitcoin eases the access of institutional investors to the market and offers an efficient way to short the cryptocurrency. We investigate the effect of this event on the market's price efficiency and find the Bitcoin market to turn efficient. We conduct commonly used tests for market efficiency and check the robustness of our results by investigating Bitcoin Cash, a hard fork of Bitcoin, where we do not find a change in market's efficiency.

**Snowball:** Urquhart (2016) The inefficiency of Bitcoin (10.1016/j.econlet.2016.09.019); Corbet, Lucey, Peat, Vigne (2018) Bitcoin futures - what use are they?, Economics Letters (10.1016/j.econlet.2018.07.031)

---

#### On the Evolution of Cryptocurrency Market Efficiency
*Akihiko Noda* — 2019 · Applied Economics Letters (arXiv preprint q-fin.ST) · OA

DOI `10.48550/arXiv.1904.09403` · arXiv `1904.09403` · [link](https://arxiv.org/abs/1904.09403)

**Why:** Methodologically careful time-varying (GLS) test of the Adaptive Market Hypothesis for Bitcoin and Ethereum, a key reference for the evolving-efficiency literature.

> This study examines whether the efficiency of cryptocurrency markets (Bitcoin and Ethereum) evolve over time based on Lo's (2004) adaptive market hypothesis (AMH). In particular, we measure the degree of market efficiency using a generalized least squares-based time-varying model that does not depend on sample size, unlike previous studies that used conventional methods. The empirical results show that (1) the degree of market efficiency varies with time in the markets, (2) Bitcoin's market efficiency level is higher than that of Ethereum over most periods, and (3) a market with high market liquidity has been evolving. We conclude that the results support the AMH for the most established cryptocurrency market.

**Snowball:** Lo (2004) The Adaptive Markets Hypothesis (10.3905/jpm.2004.442611); Ito, Noda, Wada (2014) International stock market efficiency: a non-Bayesian time-varying model approach (10.1080/00036846.2014.904491)

---

#### Efficiency in the markets of crypto-currencies
*Vu Le Tran, Thomas Leirvik* — 2020 · Finance Research Letters, 35, 101382

DOI `10.1016/j.frl.2019.101382` · [link](https://doi.org/10.1016/j.frl.2019.101382)

**Why:** Robust longer-sample evidence (Adjusted Market Inefficiency Magnitude) that efficiency is time-varying and improving 2017-2019, a frequently cited anchor for evolving-efficiency claims.

> We show that the level of market-efficiency in the five largest cryptocurrencies is highly time-varying. Specifically, before 2017, cryptocurrency-markets are mostly inefficient. This corroborates recent results on the matter. However, the cryptocurrency-markets become more efficient over time in the period 2017-2019. This contradicts other, more recent, results on the matter. One reason is that we apply a longer sample than previous studies. Another important reason is that we apply a robust measure of efficiency, being directly able to determine if the efficiency is significant or not. On average, Litecoin is the most efficient cryptocurrency, and Ripple being the least efficient cryptocurrency.

**Snowball:** Bariviera (2017) The inefficiency of Bitcoin revisited (10.1016/j.econlet.2017.09.013); Noda (2019) On the Evolution of Cryptocurrency Market Efficiency (arXiv:1904.09403)

---

#### Clustering patterns in efficiency and the coming-of-age of the cryptocurrency market
*Higor Y. D. Sigaki, Matjaz Perc, Haroldo V. Ribeiro* — 2019 · Scientific Reports, 9, 1440 (arXiv q-fin.ST) · OA

DOI `10.1038/s41598-018-37773-3` · arXiv `1901.04967` · [link](https://arxiv.org/abs/1901.04967)

**Why:** Large cross-section (400+ coins) using permutation entropy / statistical complexity to quantify dynamic efficiency; influential econophysics approach and the 'coming-of-age' framing.

> The efficient market hypothesis has far-reaching implications for financial trading and market stability. Whether or not cryptocurrencies are informationally efficient has therefore been the subject of intense recent investigation. Here, we use permutation entropy and statistical complexity over sliding time-windows of price log returns to quantify the dynamic efficiency of more than four hundred cryptocurrencies. We consider that a cryptocurrency is efficient within a time-window when these two complexity measures are statistically indistinguishable from their values obtained on randomly shuffled data. We find that 37% of the cryptocurrencies in our study stay efficient over 80% of the time, whereas 20% are informationally efficient in less than 20% of the time. Our results also show that the efficiency is not correlated with the market capitalization of the cryptocurrencies. A dynamic analysis of informational efficiency over time reveals clustering patterns in which different cryptocurrencies with similar temporal patterns form four clusters, and moreover, younger currencies in each group appear poised to follow the trend of their 'elders'. The cryptocurrency market thus already shows notable adherence to the efficient market hypothesis, although data also reveals that the coming-of-age of digital currencies is in this regard still very much underway.

**Snowball:** Bandt & Pompe (2002) Permutation entropy: a natural complexity measure for time series (10.1103/PhysRevLett.88.174102); Rosso et al. (2007) Distinguishing noise from chaos, PRL (10.1103/PhysRevLett.99.154102)

---

#### The day of the week effect in the cryptocurrency market
*Guglielmo Maria Caporale, Alex Plastun* — 2019 · Finance Research Letters, 31, 258-269

DOI `10.1016/j.frl.2018.11.012` · [link](https://doi.org/10.1016/j.frl.2018.11.012)

**Why:** The most-cited dedicated test of calendar/day-of-the-week anomalies in crypto, providing a careful, trading-simulation-based assessment of a key seasonality effect.

> This paper examines the day of the week effect in the cryptocurrency market using a variety of statistical techniques (average analysis, Student's t-test, ANOVA, the Kruskal-Wallis test, and regression analysis with dummy variables) as well as a trading simulation approach. Most cryptocurrencies (LiteCoin, Ripple, Dash) are found not to exhibit this anomaly. The only exception is Bitcoin, for which returns on Mondays are significantly higher than those on the other days of the week. A trading simulation analysis shows that exploiting the detected anomaly does not generate profits significantly different from the random ones, which is consistent with market efficiency.

**Snowball:** Kurihara & Fukushima (2017) The Market Efficiency of Bitcoin: A Weekly Anomaly Perspective; Caporale, Gil-Alana, Plastun (2018) Persistence in the cryptocurrency market, Research in Int. Business & Finance (10.1016/j.ribaf.2018.01.002)

---

#### A Million Metaorder Analysis of Market Impact on the Bitcoin
*Jonathan Donier, Julius Bonart* — 2014 · Market Microstructure and Liquidity (arXiv q-fin.TR) · OA

DOI `10.1142/S2382626615500082` · arXiv `1412.4503` · [link](https://arxiv.org/abs/1412.4503)

**Why:** Landmark order-book microstructure study confirming the square-root law of market impact on Bitcoin using a complete metaorder dataset; bridges crypto microstructure with general impact theory.

> We present a thorough empirical analysis of market impact on the Bitcoin/USD exchange market using a complete dataset that allows us to reconstruct more than one million metaorders. We empirically confirm the 'square-root law' for market impact, which holds on four decades in spite of the quasi-absence of statistical arbitrage and market making strategies. We show that the square-root impact holds during the whole trajectory of a metaorder and not only for the final execution price. We also attempt to decompose the order flow into an 'informed' and 'uninformed' component, the latter leading to an almost complete long-term decay of impact. This study sheds light on the hypotheses and predictions of several market impact models recently proposed in the literature and promotes heterogeneous agent models as promising candidates to explain price impact on the Bitcoin market - and, we believe, on other markets as well.

**Snowball:** Toth et al. (2011) Anomalous price impact and the critical nature of liquidity, Phys. Rev. X (10.1103/PhysRevX.1.021006); Bouchaud, Farmer, Lillo (2009) How markets slowly digest changes in supply and demand (arXiv:0809.0822)

---

#### Ascertaining price formation in cryptocurrency markets with Deep Learning
*Fan Fang, Waichung Chung, Carmine Ventre, Michail Basios, Leslie Kanthan, Lingbo Li, Fan Wu* — 2020 · arXiv (q-fin.TR / cs.LG) · OA

DOI `10.48550/arXiv.2003.00803` · arXiv `2003.00803` · [link](https://arxiv.org/abs/2003.00803)

**Why:** Demonstrates short-horizon mid-price predictability from limit-order-book features in crypto (DeepLOB-style), evidence of high-frequency microstructure inefficiency.

> The cryptocurrency market is amongst the fastest-growing of all the financial markets in the world. Unlike traditional markets, such as equities, foreign exchange and commodities, cryptocurrency market is considered to have larger volatility and illiquidity. This paper is inspired by the recent success of using deep learning for stock market prediction. In this work, we analyze and present the characteristics of the cryptocurrency market in a high-frequency setting. In particular, we applied a deep learning approach to predict the direction of the mid-price changes on the upcoming tick. We monitored live tick-level data from 8 cryptocurrency pairs and applied both statistical and machine learning techniques to provide a live prediction. We reveal that promising results are possible for cryptocurrencies, and in particular, we achieve a consistent 78% accuracy on the prediction of the mid-price movement on live exchange rate of Bitcoins vs US dollars.

**Snowball:** Zhang, Zohren, Roberts (2019) DeepLOB: Deep convolutional neural networks for limit order books (10.1109/TSP.2019.2907260); Cont, Kukanov, Stoikov (2014) The price impact of order book events (10.1093/jjfinec/nbt003)

---

#### Rise of the Machines? Intraday High-Frequency Trading Patterns of Cryptocurrencies
*Alla A. Petukhina, Raphael C. G. Reule, Wolfgang Karl Härdle* — 2020 · The European Journal of Finance (arXiv q-fin.TR) · OA

DOI `10.48550/arXiv.2009.04200` · arXiv `2009.04200` · [link](https://arxiv.org/abs/2009.04200)

**Why:** Intraday/time-of-day microstructure and HFT patterns in crypto, documenting volatility periodicity and intraday momentum relevant to seasonality and order-book dynamics.

> This research analyses high-frequency data of the cryptocurrency market in regards to intraday trading patterns related to algorithmic trading and its impact on the European cryptocurrency market. We study trading quantitatives such as returns, traded volumes, volatility periodicity, and provide summary statistics of return correlations to CRIX (CRyptocurrency IndeX), as well as respective overall high-frequency based market statistics with respect to temporal aspects. Our results provide mandatory insight into a market, where the grand scale employment of automated trading algorithms and the extremely rapid execution of trades might seem to be a standard based on media reports. Our findings on intraday momentum of trading patterns lead to a new quantitative view on approaching the predictability of economic value in this new digital market.

**Snowball:** Trimborn & Härdle (2018) CRIX an Index for cryptocurrencies, Journal of Empirical Finance (10.1016/j.jempfin.2018.08.004); Andersen & Bollerslev (1997) Intraday periodicity and volatility persistence in financial markets (10.1016/S0927-5398(97)00004-2)

---

#### Explainable Patterns in Cryptocurrency Microstructure
*Bartosz Bieganowski, Robert Ślepaczuk* — 2026 · arXiv (q-fin.TR / q-fin.CP / q-fin.ST) · OA

DOI `10.48550/arXiv.2602.00776` · arXiv `2602.00776` · [link](https://arxiv.org/abs/2602.00776)

**Why:** Recent frontier work showing portable/universal LOB microstructure features across crypto assets and connecting them to adverse-selection theory; directly relevant to cross-market transfer of microstructure signals.

> We document stable cross-asset patterns in cryptocurrency limit-order-book microstructure: the same engineered order book and trade features exhibit remarkably similar predictive importance and SHAP dependence shapes across assets spanning an order of magnitude in market capitalization (BTC, LTC, ETC, ENJ, ROSE). The data covers Binance Futures perpetual contract order books and trades on 1-second frequency starting from January 1st, 2022 up to October 12th, 2025. Using a unified CatBoost modeling pipeline with a direction-aware GMADL objective and time-series cross validation, we show that feature rankings and partial effects are stable across assets despite heterogeneous liquidity and volatility. We connect these SHAP structures to microstructure theory (order flow imbalance, spread, and adverse selection) and validate tradability via a conservative top-of-book taker backtest as well as fixed depth maker backtest. Our primary novelty is a robustness analysis of a major flash crash, where the divergent performance of our taker and maker strategies empirically validates classic microstructure theories of adverse selection and highlights the systemic risks of algorithmic trading.

**Snowball:** Cont, Kukanov, Stoikov (2014) The price impact of order book events (10.1093/jjfinec/nbt003); Lundberg & Lee (2017) A unified approach to interpreting model predictions (SHAP) (arXiv:1705.07874)

---

#### Market Inefficiency in Cryptoasset Markets
*Joel Hasbrouck, Julian Ma, Fahad Saleh, Caspar Schwarz-Schilling* — 2026 · arXiv (q-fin.TR) · OA

DOI `10.48550/arXiv.2602.20771` · arXiv `2602.20771` · [link](https://arxiv.org/abs/2602.20771)

**Why:** Frontier (2026) paper by leading microstructure economist Hasbrouck giving a model-free demonstration of crypto inefficiency robust to risk mispricing, attributing it to capital-reallocation frictions.

> We demonstrate market inefficiency in cryptoasset markets. Our approach examines investments that share a dominant risk factor but differ in their exposure to a secondary risk. We derive equilibrium restrictions that must hold regardless of how investors price either risk. Our empirical results strongly reject these necessary equilibrium restrictions. The rejection implies market inefficiency that cannot be attributed to mispriced risk, suggesting the presence of frictions that impede capital reallocation.

**Snowball:** Makarov & Schoar (2020) Trading and arbitrage in cryptocurrency markets (10.1016/j.jfineco.2019.07.001); Hasbrouck (1995) One security, many markets: determining the contributions to price discovery (10.1111/j.1540-6261.1995.tb05192.x)

---

#### Cyclic Arbitrage in Decentralized Exchanges
*Ye Wang, Yan Chen, Haotian Wu, Liyi Zhou, Shuiguang Deng, Roger Wattenhofer* — 2021 · arXiv (q-fin.TR / cs.CR); WWW 2022 Companion · OA

DOI `10.1145/3487553.3524203` · arXiv `2105.02784` · [link](https://arxiv.org/abs/2105.02784)

**Why:** Documents triangular/cyclic arbitrage and persistent unexploited opportunities on Uniswap, extending cross-market efficiency analysis to decentralized exchange microstructure.

> Decentralized Exchanges (DEXes) enable users to create markets for exchanging any pair of cryptocurrencies. The direct exchange rate of two tokens may not match the cross-exchange rate in the market, and such price discrepancies open up arbitrage possibilities with trading through different cryptocurrencies cyclically. In this paper, we conduct a systematic investigation on cyclic arbitrages in DEXes. We propose a theoretical framework for studying cyclic arbitrage. With our framework, we analyze the profitability conditions and optimal trading strategies of cyclic transactions. We further examine exploitable arbitrage opportunities and the market size of cyclic arbitrages with transaction-level data of Uniswap V2. We find that traders have executed 292,606 cyclic arbitrages over eleven months and exploited more than 138 million USD in revenue. However, the revenue of the most profitable unexploited opportunity is persistently higher than 1 ETH (4,000 USD), which indicates that DEX markets may not be efficient enough.

**Snowball:** Angeris et al. (2019) An analysis of Uniswap markets (arXiv:1911.03380); Daian et al. (2020) Flash Boys 2.0: Frontrunning, Transaction Reordering, and Consensus Instability (MEV) (arXiv:1904.05234)

---

#### Price Discovery in Cryptocurrency Markets
*Juan Plazuelo Pascual, Carlos Tardon Rubio, Juan Toro Cebada, Angel Hernando Veciana* — 2025 · arXiv (q-fin.TR) · OA

DOI `10.48550/arXiv.2506.08718` · arXiv `2506.08718` · [link](https://arxiv.org/abs/2506.08718)

**Why:** Recent CEX-vs-DEX and spot-vs-futures price-discovery study using Hasbrouck information shares; directly addresses cross-market lead-lag structure and efficiency.

> This document analyzes price discovery in cryptocurrency markets by comparing centralized and decentralized exchanges, as well as spot and futures markets. The study focuses first on Ethereum (ETH) and then applies a similar approach to Bitcoin (BTC). It outlines a theoretical framework emphasizing the structural differences between centralized exchanges and decentralized finance mechanisms, especially Automated Market Makers (AMMs), and explains how to construct an order book from a liquidity pool for comparison with centralized exchanges. The methodological tools used are Hasbrouck's Information Share, Gonzalo and Granger's Permanent-Transitory decomposition, and the Hayashi-Yoshida estimator, applied to explore lead-lag dynamics, cointegration, and price discovery across market types. Empirically, for ETH it compares Binance and Uniswap v2 over a one-year period focusing on five key events in 2024; for BTC it analyzes the relationship between spot and futures prices on the CME. Results show that centralized markets typically lead in ETH price discovery, and that futures markets tend to lead overall though high-volatility periods produce mixed outcomes. The findings have implications for liquidity, arbitrage, and market efficiency.

**Snowball:** Hasbrouck (1995) One security, many markets (10.1111/j.1540-6261.1995.tb05192.x); Gonzalo & Granger (1995) Estimation of common long-memory components in cointegrated systems (10.1080/07350015.1995.10524577)

---

#### Common Risk Factors in Cryptocurrency
*Yukun Liu, Aleh Tsyvinski, Xi Wu* — 2022 · The Journal of Finance · cites: 520 · completeness-add

DOI `10.1111/jofi.13119` · [link](https://doi.org/10.1111/jofi.13119)

**Why:** The canonical factor model for the cross-section of crypto returns; documents size, momentum and other tradable anomalies central to any catalogue of crypto inefficiencies. Conspicuously absent from the gathered list.

> We establish that three factors-cryptocurrency market, size, and momentum-capture the cross-sectional expected returns of cryptocurrencies. We construct cryptocurrency counterparts of a large set of price- and market-related characteristics from the equities literature. Nine of these characteristics produce profitable long-short strategies with sizable and statistically significant excess returns, and all of these strategy returns are explained by the three-factor model. The three-factor model substantially outperforms a cryptocurrency capital asset pricing model. The results provide a benchmark factor model for the cross section of cryptocurrency returns.

**Snowball:** Liu & Tsyvinski, Risks and Returns of Cryptocurrency (Review of Financial Studies 2021) (10.1093/rfs/hhaa113); Fama & French, Common risk factors in the returns on stocks and bonds (1993) (10.1016/0304-405X(93)90023-5); Shen, Urquhart & Wang, A three-factor pricing model for cryptocurrencies (2020) (10.1016/j.frl.2019.101248)

---

#### Is Bitcoin Really Untethered?
*John M. Griffin, Amin Shams* — 2020 · The Journal of Finance · cites: 491 · OA · completeness-add

DOI `10.1111/jofi.12903` · [link](https://doi.org/10.1111/jofi.12903)

**Why:** Canonical evidence that crypto prices can be manipulated (supply-driven), with documented round-number clustering and asymmetric autocorrelation anomalies - direct microstructure inefficiency findings.

> This paper investigates whether Tether, a digital currency pegged to the U.S. dollar, influenced Bitcoin and other cryptocurrency prices during the 2017 boom. Using algorithms to analyze blockchain data, we find that purchases with Tether are timed following market downturns and result in sizable increases in Bitcoin prices. The flow is attributable to one entity, clusters below round prices, induces asymmetric autocorrelations in Bitcoin, and suggests insufficient Tether reserves before month-ends. Rather than demand from cash investors, these patterns are most consistent with the supply-based hypothesis of unbacked digital money inflating cryptocurrency prices.

**Snowball:** Gandal, Hamrick, Moore & Oberman, Price manipulation in the Bitcoin ecosystem (J. Monetary Economics 2018) (10.1016/j.jmoneco.2017.12.004); Cong, Li, Tang & Yang, Crypto wash trading (Management Science 2023) (10.1287/mnsc.2021.4310); Makarov & Schoar, Trading and arbitrage in cryptocurrency markets (2020) (10.1016/j.jfineco.2019.07.001)

---

#### Price clustering in Bitcoin
*Andrew Urquhart* — 2017 · Economics Letters · cites: 324 · OA · completeness-add

DOI `10.1016/j.econlet.2017.07.035` · [link](https://doi.org/10.1016/j.econlet.2017.07.035)

**Why:** Seminal crypto price-clustering / round-number microstructure paper, directly on the SCOPE's round-number and order-book themes; the foundational cite for all later crypto clustering work.

> This paper examines price clustering in the Bitcoin market. Using a large sample of intraday and daily data, the study finds significant evidence of price clustering at round numbers, with a notably higher proportion of prices ending in whole-number and 00 decimals than would be expected under no clustering. The degree of clustering increases with volatility, volume and price level, consistent with the negotiation and price-resolution hypotheses. The results document a robust microstructure anomaly and inform understanding of how traders set and read prices in the Bitcoin market.

**Snowball:** Harris, Stock price clustering and discreteness (Review of Financial Studies 1991) (10.1093/rfs/4.3.389); Mbanga, The day-of-the-week pattern of price clustering in Bitcoin (Applied Economics Letters 2019) (10.1080/13504851.2018.1543941); Baig, Blau & Sabah, Price clustering and sentiment in Bitcoin (2019) (10.1016/j.irfa.2019.06.001)

---

#### The inefficiency of Bitcoin revisited: A high-frequency analysis with alternative currencies
*Ahmet Sensoy* — 2019 · Finance Research Letters · cites: 219 · OA · completeness-add

DOI `10.1016/j.frl.2018.04.002` · [link](https://doi.org/10.1016/j.frl.2018.04.002)

**Why:** High-frequency, currency-pair evidence on evolving and frequency-dependent crypto efficiency, linking efficiency to liquidity and volatility - bridges the efficiency and microstructure themes.

> We compare the time-varying weak-form efficiency of Bitcoin prices in terms of US dollars (BTCUSD) and euro (BTCEUR) at a high-frequency level by using permutation entropy. We find that BTCUSD and BTCEUR markets have become more informationally efficient at the intraday level since the beginning of 2016, and BTCUSD market is slightly more efficient than BTCEUR market in the sample period. We also find that higher the frequency, lower the pricing efficiency is. Finally, liquidity (volatility) has a significant positive (negative) effect on the informational efficiency of Bitcoin prices.

**Snowball:** Bandi & Russell, Permutation entropy and informational efficiency; Nadarajah & Chu, On the inefficiency of Bitcoin (2017) (10.1016/j.econlet.2016.10.033); Zargar & Kumar, Informational inefficiency of Bitcoin: high-frequency data (2019) (10.1016/j.ribaf.2018.08.008)

---

#### Adaptive market hypothesis and evolving predictability of bitcoin
*Sashikanta Khuntia, J. K. Pattanayak* — 2018 · Economics Letters · cites: 200 · completeness-add

DOI `10.1016/j.econlet.2018.03.005` · [link](https://doi.org/10.1016/j.econlet.2018.03.005)

**Why:** Foundational paper framing crypto efficiency as time-varying under the Adaptive Market Hypothesis; the standard cite for the 'evolving efficiency' theme alongside Noda and Tran-Leirvik.

> This study evaluates the adaptive market hypothesis (AMH) and evolving return predictability in bitcoin market. We use two robust methods in a rolling-window framework to capture time-varying linear and nonlinear dependence in bitcoin returns. We find that market efficiency evolves with time and validates the AMH in bitcoin market.

**Snowball:** Lo, The adaptive markets hypothesis (Journal of Portfolio Management 2004) (10.3905/jpm.2004.442611); Urquhart, The inefficiency of Bitcoin (2016) (10.1016/j.econlet.2016.09.019); Khuntia & Pattanayak, Adaptive calendar effects and volume of extra returns in the cryptocurrency market (2021) (10.1108/ijoem-06-2020-0682)

---

#### How to measure the liquidity of cryptocurrency markets?
*Alexander Brauneis, Roland Mestel, Ryan Riordan, Erik Theissen* — 2021 · Journal of Banking & Finance · cites: 122 · OA · completeness-add

DOI `10.1016/j.jbankfin.2020.106041` · [link](https://doi.org/10.1016/j.jbankfin.2020.106041)

**Why:** Benchmarks the liquidity/illiquidity estimators (Amihud, Kyle-Obizhaeva, CS, AR) used to study crypto order-book microstructure; essential methodological reference for measuring crypto LOB liquidity.

> We investigate whether low-frequency (transaction-based) liquidity measures capture actual high-frequency liquidity conditions in cryptocurrency markets. The Corwin and Schultz (2012) and Abdi and Ranaldo (2017) estimators demonstrate superior performance in tracking time-series variation across different observation frequencies, venues, benchmarks, and cryptocurrencies, and remain effective during volatile and active trading periods. The Kyle and Obizhaeva (2016) estimator and the Amihud (2002) illiquidity ratio excel at determining absolute liquidity levels and distinguishing between venues. The findings indicate that no single universally optimal measure exists, though several low-frequency approaches prove reasonably effective.

**Snowball:** Corwin & Schultz, A simple way to estimate bid-ask spreads from daily high and low prices (Journal of Finance 2012) (10.1111/j.1540-6261.2012.01729.x); Amihud, Illiquidity and stock returns (Journal of Financial Markets 2002) (10.1016/S1386-4181(01)00024-6); Kyle & Obizhaeva, Market microstructure invariance (Econometrica 2016) (10.3982/ECTA10486)

---

#### Bitcoin unchained: Determinants of cryptocurrency exchange liquidity
*Alexander Brauneis, Roland Mestel, Ryan Riordan, Erik Theissen* — 2022 · Journal of Empirical Finance · cites: 39 · completeness-add

DOI `10.1016/j.jempfin.2022.08.004` · [link](https://doi.org/10.1016/j.jempfin.2022.08.004)

**Why:** Directly addresses cross-exchange microstructure and the determinants of order-book liquidity and fragmentation, a core part of the cross-exchange/structure scope.

> We analyze the determinants of liquidity across multiple cryptocurrency exchanges using order-book data. Liquidity, measured by bid-ask spreads and market depth, varies substantially across venues and cryptocurrencies and is driven by trading volume, volatility, price level, exchange characteristics and competition between venues. We document commonality and fragmentation in liquidity across exchanges and show how exchange-specific frictions shape the cross-exchange structure of cryptocurrency markets. The results have implications for arbitrage, price discovery and the design of crypto trading venues.

**Snowball:** Brauneis, Mestel, Riordan & Theissen, How to measure the liquidity of cryptocurrency markets? (2021) (10.1016/j.jbankfin.2020.106041); Makarov & Schoar, Trading and arbitrage in cryptocurrency markets (2020) (10.1016/j.jfineco.2019.07.001); Chordia, Roll & Subrahmanyam, Commonality in liquidity (2000) (10.1016/S0304-405X(00)00057-7)

---

#### Cryptocurrency market efficiency in short- and long-term horizons during COVID-19: An asymmetric multifractal analysis approach
*Shinji Kakinaka, Ken Umeno* — 2022 · Finance Research Letters · cites: 91 · OA · completeness-add

DOI `10.1016/j.frl.2021.102319` · [link](https://doi.org/10.1016/j.frl.2021.102319)

**Why:** Recent multifractal evidence that crypto efficiency is horizon-dependent and regime-sensitive, refining the 'evolving efficiency' theme with asymmetry and shock (COVID) effects.

> This study investigates asymmetric multifractality and market efficiency of the major cryptocurrencies during the COVID-19 pandemic while accounting for different investment horizons. By applying the asymmetric multifractal detrended fluctuation analysis, we show that the outbreak affected the efficiency property of price behaviors differently between short- and long-term horizons. After the outbreak, the markets exhibited stronger multifractality in the short-term but weaker multifractality in the long-term. We also analyze asymmetric market patterns between upward and downward trends and between small and large price fluctuations and confirm that the outbreak has greatly changed the level of asymmetry in cryptocurrency markets.

**Snowball:** Bariviera, The inefficiency of Bitcoin revisited: a dynamic approach (2017) (10.1016/j.econlet.2017.09.013); Kantelhardt et al., Multifractal detrended fluctuation analysis of nonstationary time series (2002) (10.1016/S0378-4371(02)01383-3); Mensi et al., Efficiency and multifractality of Bitcoin and Ethereum during COVID-19

---

#### Exploring sources of statistical arbitrage opportunities among Bitcoin exchanges
*Ladislav Kristoufek, Elie Bouri* — 2023 · Finance Research Letters · cites: 13 · completeness-add

DOI `10.1016/j.frl.2022.103332` · [link](https://doi.org/10.1016/j.frl.2022.103332)

**Why:** Recent peer-reviewed evidence on cross-exchange price deviations and limits to statistical arbitrage in Bitcoin, the best published addition for the cross-exchange structure sub-theme beyond Makarov-Schoar.

> We examine the sources of statistical arbitrage opportunities arising from price differences of Bitcoin across multiple exchanges. Using high-frequency price data from several venues, we document persistent cross-exchange price deviations and analyze how their magnitude and persistence relate to exchange characteristics, transaction and transfer costs, volatility and liquidity. The results show that arbitrage opportunities, while present, are constrained by frictions specific to crypto markets, and that their dynamics shed light on the cross-exchange structure and partial market integration of Bitcoin trading.

**Snowball:** Makarov & Schoar, Trading and arbitrage in cryptocurrency markets (2020) (10.1016/j.jfineco.2019.07.001); Krückeberg & Scholz, Cryptocurrencies as an asset class? arbitrage and price efficiency; Shanaev, Sharma, Shuraeva & Ghimire, Arbitrage and pricing efficiency in crypto

---

#### Liquidity commonality in the cryptocurrency market
*Abhinava Tripathi, Alok Dixit, Vipul* — 2021 · Applied Economics · cites: 17 · completeness-add

DOI `10.1080/00036846.2021.1982128` · [link](https://doi.org/10.1080/00036846.2021.1982128)

**Why:** Documents systematic (market-wide) liquidity commonality in crypto order books, an order-book microstructure feature with direct implications for liquidity risk and cross-coin structure.

> This study examines commonality in liquidity in the cryptocurrency market. Using order-book and trade data for a cross-section of cryptocurrencies, we document significant common (market-wide) and industry-wide components in individual cryptocurrency liquidity, beyond firm-specific (coin-specific) variation. The commonality is robust across alternative liquidity measures and is stronger during periods of high volatility and market stress. The results indicate that liquidity in crypto markets has a systematic component, with implications for liquidity risk, diversification and microstructure modeling of cryptocurrency order books.

**Snowball:** Chordia, Roll & Subrahmanyam, Commonality in liquidity (2000) (10.1016/S0304-405X(00)00057-7); Korajczyk & Sadka, Pricing the commonality across alternative measures of liquidity (2008) (10.1016/j.jfineco.2007.10.004); Brauneis et al., How to measure the liquidity of cryptocurrency markets? (2021) (10.1016/j.jbankfin.2020.106041)

---

#### Intraday patterns of price clustering in Bitcoin
*Donglian Ma, Hisashi Tanizaki* — 2022 · Financial Innovation · cites: 15 · OA · completeness-add

DOI `10.1186/s40854-021-00307-4` · [link](https://doi.org/10.1186/s40854-021-00307-4)

**Why:** Recent tick-level evidence on intraday round-number clustering in Bitcoin, extending Urquhart with a time-of-day microstructure dimension; open-access with verbatim abstract.

> In this study, an investigation is conducted into the phenomenon of price clustering in Bitcoin (BTC) denominated in the Japanese yen (JPY). It answers two questions using tick-by-tick data. The first is whether price clustering exists in BTC/JPY transactions, and the other is how the scale of price clustering varies throughout a trading day. With the assistance of statistical measures, the last two digits of BTC price were discovered to cluster at the numbers that end with '00'. In addition, the scales of BTC/JPY clustering at '00' tended to decline at the specific hour intervals. This study contributes to the emerging literature on price clustering and investor behavior.

**Snowball:** Urquhart, Price clustering in Bitcoin (2017) (10.1016/j.econlet.2017.07.035); Harris, Stock price clustering and discreteness (1991) (10.1093/rfs/4.3.389); Mbanga, The day-of-the-week pattern of price clustering in Bitcoin (2019) (10.1080/13504851.2018.1543941)

---

#### Intraday efficiency-frequency nexus in the cryptocurrency markets
*Aylin Aslan, Ahmet Sensoy* — 2020 · Finance Research Letters · cites: 63 · completeness-add

DOI `10.1016/j.frl.2019.09.013` · [link](https://doi.org/10.1016/j.frl.2019.09.013)

**Why:** Shows crypto efficiency depends on sampling frequency (U-shaped), tying together the efficiency and high-frequency microstructure themes; complements Sensoy (2019) and the gathered intraday HFT work.

> This research examines the relationship between weak-form market efficiency and intraday trading frequency for the most highly capitalized cryptocurrencies. Using multiple long-memory analytical tools, the authors identify substantial variation in cryptocurrency return predictability across different high-frequency time intervals. The findings reveal that market efficiency follows a U-shaped curve relative to sampling frequency, indicating that an optimal interval exists for achieving maximum efficiency. These results carry implications for portfolio management, risk assessment, regulatory frameworks, and policy decisions affecting cryptocurrency markets.

**Snowball:** Sensoy, The inefficiency of Bitcoin revisited: high-frequency analysis (2019) (10.1016/j.frl.2018.04.002); Bariviera, The inefficiency of Bitcoin revisited: a dynamic approach (2017) (10.1016/j.econlet.2017.09.013); Andrew Lo, Long-term memory in stock market prices (Econometrica 1991) (10.2307/2938368)

---

