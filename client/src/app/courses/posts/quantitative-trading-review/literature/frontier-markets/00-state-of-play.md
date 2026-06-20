# Frontier markets & market phenotyping — state of play

> Second research spike. Gathered abstracts, not yet deep-read.

Here is the state-of-play.

---

# Market Phenotyping and Cross-Market Strategy Transfer: A State of Play

## What is established

**Clustering markets by structure.** The foundational result is that the empirical correlation matrix of asset returns carries economically meaningful structure that can be filtered, made metric, and clustered without labels. Mantegna (1999) converts correlations into ultrametric distances and extracts a minimum-spanning tree; Onnela et al. (2002) make these trees dynamic; and the Aste/Di Matteo/Mantegna school generalises the filter from trees to richer planar and sparse graphs (Tumminello et al. 2005; Song, Di Matteo & Aste 2012; Massara, Di Matteo & Aste 2017). Random matrix theory (Laloux et al. 1999; Plerou et al. 1999) separates genuine sector structure from sampling noise. The robust empirical finding, surveyed in Tumminello, Lillo & Mantegna (2010) and Marti et al. (2021), is that data-driven groupings recover economic sectors and, at the index level, geographic and developed-versus-emerging structure.

**Regime detection.** The canonical lineage runs from Hamilton's (1989) Markov regime-switching autoregression through asset-allocation applications (Ang & Bekaert 2002; Guidolin & Timmermann 2007) and nonparametric bull/bear dating (Pagan & Sossounov 2003; Bai & Perron 2003), synthesised by Ang & Timmermann (2012). The recent frontier is unsupervised and distributional: Wasserstein clustering of path distributions (Horvath, Issa & Muguruza 2021), realized-covariance regimes (Bucci & Ciciretti 2022), and structural volatility clustering (Prakash et al. 2021), validated through regime-conditioned strategy performance rather than label accuracy.

**Transfer across markets.** QuantNet (Koshiyama et al. 2020) is the pillar: a strategy is factorised into market-specific encoders/decoders plus a shared market-agnostic global model trained over 3,103 assets in 58 markets. It sits alongside the Oxford-MAN deep/spatio-temporal momentum line (Lim, Zohren & Roberts 2019; Tan, Roberts & Zohren 2023) and Gu, Kelly & Xiu (2020), establishing that a single neural model can learn transferable cross-sectional signals. Domain-adaptation and data-scarce variants extend this (Borrageiro, Firoozye & Barucca 2021; Teller, Pigorsch & Pigorsch 2025).

## The recent frontier

Three movements dominate 2019-2026. First, **efficiency as a continuous phenotype**: econophysics indices (Kristoufek & Vosvrda 2013, 2014) and multifractal DFA (Lee & Choi 2023) place developed, emerging and frontier markets on a single efficiency spectrum, operationalising Lo's (2004) Adaptive Markets Hypothesis via time-varying models (Ito, Noda & Wada 2016). Second, **anomaly replication at scale**: large cross-market studies and ML cross-sectional models (Zaremba and coauthors; Hanauer-Kalsbach) show global models often beat purely local ones out-of-sample, while limits-to-arbitrage and decay work (Shleifer & Vishny 1997; McLean & Pontiff 2016; Chen & Velikov 2023) explains why net-of-cost alpha survives unevenly. Third, **manifold phenotyping**: ordinal complexity descriptors (Bandt & Pompe 2002; Zunino et al. 2009) and embeddings (t-SNE, UMAP, diffusion maps) reduce each market to a small feature vector that discriminates by development stage. A recurring caution is that off-the-shelf generic pretraining transfers poorly; finance-native adaptation is what pays.

## What is genuinely under-explored

The literature has each ingredient but almost never connects them into the full loop: **map a market's behavioural profile to which strategy families worked there, then transfer that mapping to frontier markets.** We can phenotype markets (Marti et al. 2021; Zunino et al. 2009; Horvath et al. 2021) and we can transfer models (Koshiyama et al. 2020), but no work systematically *conditions* the transfer on a measured phenotype — i.e. building a supervised map from (efficiency degree, multifractality, regime structure, correlation topology) to (momentum/value/low-vol/technical-rule performance), then using a frontier market's phenotype to predict its viable strategy set *before* deployment. Existing transfer is largely phenotype-agnostic weight-sharing; existing phenotyping is descriptive, not predictive of strategy payoff. The hardest, least-served case is precisely frontier markets, where Zaremba-style anomaly persistence, illiquidity-driven inefficiency (Lim & Brooks 2011), and data scarcity (Teller et al. 2025) intersect. A phenotype-to-strategy transfer engine, validated out-of-sample on frontier markets, is the open prize.

## Must-read papers

- Mantegna (1999) — hierarchical structure / MST taxonomy
- Tumminello, Lillo & Mantegna (2010) — correlations/hierarchies/networks review
- Marti, Nielsen, Binkowski & Donnat (2021) — two-decade clustering review
- Hamilton (1989) — regime-switching foundation
- Ang & Timmermann (2012) — regime review
- Horvath, Issa & Muguruza (2021) — Wasserstein regime/phenotype clustering
- Koshiyama, Flennerhag, Blumberg, Firoozye & Treleaven (2020) — QuantNet cross-market transfer
- Gu, Kelly & Xiu (2020) — empirical asset pricing via ML
- Lo (2004) — Adaptive Markets Hypothesis
- Lee & Choi (2023) — MF-DFA efficiency across development spectrum
- Zunino, Zanin, Tabak, Perez & Rosso (2009) — ordinal complexity / efficiency phenotyping
- McLean & Pontiff (2016) — anomaly decay / transferability ceiling

## Topics

| # | Topic | Papers | File |
|---|---|---|---|
| 01 | Market taxonomy & clustering of markets/assets by structural features | 31 | [01-taxonomy.md](01-taxonomy.md) |
| 02 | Measuring & comparing market efficiency across the development spectrum | 21 | [02-efficiency-spectrum.md](02-efficiency-spectrum.md) |
| 03 | Anomaly persistence in emerging & frontier markets | 27 | [03-frontier-anomalies.md](03-frontier-anomalies.md) |
| 04 | Cross-market transfer learning & meta-learning of trading strategies | 29 | [04-cross-market-transfer.md](04-cross-market-transfer.md) |
| 05 | Market regime & market-state detection and classification | 33 | [05-regimes.md](05-regimes.md) |
| 06 | Manifold learning & complexity measures for financial time series | 28 | [06-manifold-complexity.md](06-manifold-complexity.md) |
| 07 | Cryptocurrency market efficiency & microstructure | 32 | [07-crypto-efficiency.md](07-crypto-efficiency.md) |
| 08 | Limits to arbitrage, crowding & alpha decay across markets | 31 | [08-limits-arbitrage-decay.md](08-limits-arbitrage-decay.md) |
