# Manifold learning & complexity measures for financial time series

This collection assembles the methodological canon and the financial applications for two complementary toolkits used to "phenotype" assets and markets. The first is ordinal/entropy/fractal complexity descriptors: Bandt-Pompe permutation entropy, Richman-Moorman sample entropy, Costa et al. multiscale entropy, the Rosso complexity-entropy causality plane, and Kantelhardt MF-DFA / Di Matteo generalized-Hurst multifractality, which turn each price series into a small, model-independent feature vector measuring randomness, persistence and scaling. The second is manifold learning / dimensionality reduction (van der Maaten-Hinton t-SNE, McInnes et al. UMAP, Coifman-Lafon diffusion maps, plus Mantegna's correlation-based hierarchical trees) that embeds high-dimensional asset feature vectors into low-dimensional spaces for clustering, taxonomy and regime detection. The most relevant 2019-2026 frontier work fuses the two: diffusion-map dynamic factor models for stress testing (Baker-Capponi-Sidaoui), t-SNE/UMAP company classification and news-embedding asset pricing, and Zunino-style ordinal informational rankings that discriminate markets by development stage — directly enabling market phenotyping and cross-market strategy transfer. Citation counts are best-effort from Semantic Scholar/Google Scholar snapshots; DOIs and arXiv ids were verified against publisher/arXiv records.

**Completeness critic:** The gathered list already covers the core method papers (Bandt-Pompe permutation entropy, Richman-Moorman sample entropy, Costa multiscale entropy, Kantelhardt MF-DFA, t-SNE, UMAP, diffusion maps, Mantegna MST) and several good recent applications. The clearest gaps are: (1) the canonical complexity-entropy CAUSALITY PLANE application to finance (Zunino et al. 2010) — the list has the related Zunino 2009 forbidden-patterns paper but not the CECP paper that ranks markets by efficiency in a 2D entropy-complexity space, which is the direct conceptual bridge to "market phenotyping"; (2) MF-DCCA (Zhou 2008), the canonical multifractal CROSS-correlation method — the list has MF-DFA (single series) but nothing for pairwise/co-movement multifractality, important for cross-market work; (3) random-matrix-theory geometry of the asset correlation matrix (Plerou et al. 2002), the canonical spectral/eigenvector decomposition underpinning PCA/manifold methods on asset feature vectors; (4) topological data analysis of markets (Gidea & Katz 2018), a major complementary "shape/complexity" descriptor family entirely absent from the list. I added these four canonical works plus six strong recent (2022-2025) papers: a 2-manifold geometry-learning model, two TDA applications (turbulence index; TDA portfolio clustering), a MF-DFA+RCMSE comparative complexity study, the Sigaki-Perc-Ribeiro crypto efficiency-clustering paper (same group as ordpy, and a natural companion to Bariviera 2020), and a multivariate-sample-entropy financial-stress framework. Caveats: (a) Plerou et al. is 2002 in Physical Review E (vol 65, 066126); the arXiv preprint cond-mat/0108023 is 2001 — I report 2002 as the publication year. (b) Citation counts are approximate where shown (Gidea-Katz ~237 per OpenAlex/SemanticScholar; others left null because the metadata APIs (OpenAlex, Semantic Scholar) were rate-limited (HTTP 429) throughout, so I could not pull exact counts for several items — DOIs/arXiv ids were verified directly from arXiv abstract pages, PMC, and publisher records instead. (c) Zunino et al. 2010 has conflicting page/volume metadata across sources (Physica A 389(9):1891-1901 vs other listings); DOI 10.1016/j.physa.2010.01.007 is the reliable identifier. (d) Xiao/Xu/Mandic is filed under eess.SP rather than q-fin but is squarely a financial-complexity paper. TDA is arguably a separate descriptor family from the strict "manifold learning + entropy" scope, but it is the dominant recent complexity-geometry approach to markets and worth flagging as a coverage decision for the reviewer.

---

#### Permutation entropy: a natural complexity measure for time series
*Christoph Bandt, Bernd Pompe* — 2002 · Physical Review Letters 88(17), 174102 · cites: 4062

DOI `10.1103/PhysRevLett.88.174102` · [link](https://doi.org/10.1103/PhysRevLett.88.174102)

**Why:** Foundational definition of permutation entropy — the single most-used model-independent ordinal complexity descriptor for turning a price series into a feature for market/asset phenotyping.

> We introduce complexity parameters for time series based on comparison of neighboring values. The permutation entropy is defined from the relative frequencies of the ordinal patterns (the orderings of consecutive values), and behaves similarly to the Lyapunov exponent. It is particularly simple and robust, fast to compute, and remains meaningful in the presence of dynamical or observational noise, applying to arbitrary real-world (regular, chaotic, noisy) time series.

**Snowball:** Pompe & Runge, Momentary information transfer as a coupling measure of time series (10.1103/PhysRevE.83.051122); Rosso et al., Distinguishing noise from chaos (2007) (10.1103/PhysRevLett.99.154102)

---

#### Physiological time-series analysis using approximate entropy and sample entropy
*Joshua S. Richman, J. Randall Moorman* — 2000 · American Journal of Physiology-Heart and Circulatory Physiology 278(6), H2039-H2049 · cites: 9000 · OA

DOI `10.1152/ajpheart.2000.278.6.H2039` · [link](https://doi.org/10.1152/ajpheart.2000.278.6.H2039)

**Why:** Defines sample entropy, the second most common scalar complexity feature; its length-robustness matters when building per-asset complexity vectors from limited financial data.

> Entropy estimators (approximate entropy, ApEn) used to quantify regularity in physiological time series are biased and depend on record length. The authors introduce sample entropy (SampEn), which excludes self-matches, reducing bias and improving consistency. Using known stochastic and deterministic test signals and clinical cardiovascular data, SampEn agrees better with theory and is more robust to short and noisy records, making it a standard complexity statistic.

**Snowball:** Pincus, Approximate entropy as a measure of system complexity (PNAS 1991) (10.1073/pnas.88.6.2297); Costa, Goldberger, Peng, Multiscale entropy analysis (2002) (10.1103/PhysRevLett.89.068102)

---

#### Multiscale entropy analysis of complex physiologic time series
*Madalena Costa, Ary L. Goldberger, C.-K. Peng* — 2002 · Physical Review Letters 89(6), 068102 · cites: 4500

DOI `10.1103/PhysRevLett.89.068102` · [link](https://doi.org/10.1103/PhysRevLett.89.068102)

**Why:** Multiscale entropy is the standard way to produce a multi-scale complexity profile (a curve, not a scalar) for an asset — richer phenotyping features than single-scale entropy.

> Traditional single-scale entropy measures assign higher complexity to random (uncorrelated) signals than to structured ones, which is counterintuitive for physiologic systems. The authors propose multiscale entropy (MSE), which computes sample entropy over coarse-grained versions of the series at multiple time scales. MSE correctly assigns greater complexity to long-range-correlated signals (e.g., 1/f noise) than to uncorrelated white noise, and discriminates healthy from pathologic dynamics.

**Snowball:** Costa, Goldberger, Peng, Multiscale entropy analysis of biological signals (PRE 2005) (10.1103/PhysRevE.71.021906)

---

#### Distinguishing Noise from Chaos
*Osvaldo A. Rosso, Hilda A. Larrondo, Maria T. Martin, Angelo Plastino, Miguel A. Fuentes* — 2007 · Physical Review Letters 99(15), 154102 · cites: 656

DOI `10.1103/PhysRevLett.99.154102` · [link](https://doi.org/10.1103/PhysRevLett.99.154102)

**Why:** The complexity-entropy plane is the canonical 2D 'phenotype space' for time series — markets/assets become points whose location characterises their stochastic-vs-structured nature.

> Chaotic systems share several properties with stochastic processes that make them almost indistinguishable. The authors introduce a two-dimensional representation, the complexity-entropy causality plane, whose axes are the normalized permutation (Shannon) entropy and an associated statistical complexity measure, both evaluated using the Bandt-Pompe ordinal-pattern probability assignment. Deterministic chaotic and stochastic dynamics occupy distinct regions of this plane, providing an objective criterion to tell them apart.

**Snowball:** Lopez-Ruiz, Mancini, Calbet, A statistical measure of complexity (1995) (10.1016/0375-9601(95)00867-5); Zunino et al., Forbidden patterns, permutation entropy and stock market inefficiency (2009) (10.1016/j.physa.2009.03.042)

---

#### Forbidden patterns, permutation entropy and stock market inefficiency
*Luciano Zunino, Massimiliano Zanin, Benjamin M. Tabak, Dario G. Perez, Osvaldo A. Rosso* — 2009 · Physica A: Statistical Mechanics and its Applications 388(14), 2854-2864 · cites: 380

DOI `10.1016/j.physa.2009.03.042` · [link](https://doi.org/10.1016/j.physa.2009.03.042)

**Why:** Direct prototype of market phenotyping: ordinal-complexity features produce an informational ranking that separates markets by development/efficiency — exactly the cross-market characterisation this review targets.

> The authors introduce two model-independent ordinal quantifiers — the number of forbidden ordinal patterns and the normalized permutation entropy — to measure stock market inefficiency. Applying them to a set of developed and emerging equity indices, they find robust evidence that the degree of inefficiency is positively correlated with the number of forbidden patterns and negatively correlated with permutation entropy. The tools cleanly discriminate the stage of stock market development and are simple to implement.

**Snowball:** Zunino et al., Commodity predictability analysis with a permutation information theory approach (2011) (10.1016/j.physa.2010.11.020); Amigo, Permutation Complexity in Dynamical Systems (book) (10.1007/978-3-642-04084-9)

---

#### Multifractal detrended fluctuation analysis of nonstationary time series
*Jan W. Kantelhardt, Stephan A. Zschiegner, Eva Koscielny-Bunde, Shlomo Havlin, Armin Bunde, H. Eugene Stanley* — 2002 · Physica A: Statistical Mechanics and its Applications 316(1-4), 87-114 · cites: 4400 · OA

DOI `10.1016/S0378-4371(02)01383-3` · arXiv `physics/0202070` · [link](https://doi.org/10.1016/S0378-4371(02)01383-3)

**Why:** The workhorse algorithm for extracting multifractal/Hurst features (h(q), spectrum width) used to characterise persistence and scaling heterogeneity across assets and markets.

> The authors develop multifractal detrended fluctuation analysis (MF-DFA), a generalization of DFA, to determine the multifractal scaling properties of nonstationary time series. The method computes generalized fluctuation functions for a range of moment orders q and detrending polynomial orders, yielding the generalized Hurst exponent h(q), the Renyi exponent tau(q), and the singularity (multifractal) spectrum f(alpha). Comparisons with wavelet-transform modulus-maxima analysis and applications to model and empirical series establish MF-DFA as a robust, easily implemented multifractality estimator.

**Snowball:** Peng et al., Mosaic organization of DNA nucleotides (DFA, 1994) (10.1103/PhysRevE.49.1685); Jiang, Xie, Zhou, Sornette, Multifractal analysis of financial markets (2019) (10.1088/1361-6633/ab42fb)

---

#### Multi-scaling in finance
*T. Di Matteo* — 2007 · Quantitative Finance 7(1), 21-36 · cites: 700 · OA

DOI `10.1080/14697680600969727` · [link](https://doi.org/10.1080/14697680600969727)

**Why:** Canonical review of Hurst/multi-scaling estimators in finance and the generalized-Hurst-exponent feature used to rank/cluster markets by development — a phenotyping descriptor.

> This paper reviews the paradigms and tools for investigating the scaling structure of financial time series. It distinguishes scaling from multi-scaling processes and several definitions of scaling exponents, and reviews methods to estimate such exponents from empirical data. A detailed description of the Generalized Hurst Exponent (GHE) approach is presented and substantiated with an empirical analysis across different markets and assets, showing that the GHE provides a sensitive measure of the degree of development and risk of markets that is less sensitive to outliers than rescaled-range statistics.

**Snowball:** Di Matteo, Aste, Dacorogna, Long-term memories of developed and emerging markets (J. Banking & Finance 2005) (10.1016/j.jbankfin.2004.08.004)

---

#### Multifractal analysis of financial markets: a review
*Zhi-Qiang Jiang, Wen-Jie Xie, Wei-Xing Zhou, Didier Sornette* — 2019 · Reports on Progress in Physics 82(12), 125901 · cites: 430 · OA

DOI `10.1088/1361-6633/ab42fb` · arXiv `1805.04750` · [link](https://arxiv.org/abs/1805.04750)

**Why:** The definitive modern review tying multifractal/Hurst complexity measures to market inefficiency and risk — the conceptual backbone for using fractal features as market phenotypes.

> Multifractality is ubiquitously observed in complex natural and socioeconomic systems. This review surveys the multifractal analysis methods and multifractal models adopted in or invented for financial time series and their subtle properties, applicable also to other disciplines. It compiles the cumulating evidence for multifractality across different markets and time periods, discusses its sources (fat tails vs. nonlinear long-range correlations), and presents the usefulness of multifractal analysis in quantifying market inefficiency, supporting risk management, and other applications, closing with open problems and future directions.

**Snowball:** Calvet & Fisher, Multifractality in asset returns: theory and evidence (2002) (10.1162/003465302760556352); Zhou, Finite-size effect and components of multifractality in financial volatility (10.1016/j.chaos.2011.11.004)

---

#### Visualizing Data using t-SNE
*Laurens van der Maaten, Geoffrey Hinton* — 2008 · Journal of Machine Learning Research 9, 2579-2605 · cites: 50000 · OA

[link](https://www.jmlr.org/papers/v9/vandermaaten08a.html)

**Why:** Canonical nonlinear embedding used throughout finance to project asset complexity/return feature vectors into 2D for clustering and visual phenotyping.

> t-Distributed Stochastic Neighbor Embedding (t-SNE) is a technique for visualizing high-dimensional data by giving each datapoint a location in a two- or three-dimensional map. It is a variation of Stochastic Neighbor Embedding that is easier to optimize and produces significantly better visualizations by reducing the tendency to crowd points in the center; it uses a Student-t distribution in the low-dimensional space to model pairwise similarities. The method outperforms existing techniques at creating single maps that reveal structure at many scales, demonstrated on diverse datasets.

**Snowball:** Hinton & Roweis, Stochastic Neighbor Embedding (NIPS 2002) (https://papers.nips.cc/paper/2276); van der Maaten, Accelerating t-SNE using tree-based algorithms (JMLR 2014)

---

#### UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction
*Leland McInnes, John Healy, James Melville* — 2018 · arXiv preprint (later J. Open Source Software 3(29):861) · cites: 12000 · OA

DOI `10.21105/joss.00861` · arXiv `1802.03426` · [link](https://arxiv.org/abs/1802.03426)

**Why:** The other dominant manifold-learning method; preserves more global structure than t-SNE, increasingly the default for embedding asset feature vectors and detecting regimes/clusters.

> UMAP (Uniform Manifold Approximation and Projection) is a dimension reduction technique constructed from a theoretical framework based on Riemannian geometry and algebraic topology, yielding a practical, scalable algorithm for real-world data. UMAP is competitive with t-SNE for visualization quality and arguably preserves more of the global structure with superior runtime performance. It has no computational restrictions on embedding dimension, making it viable as a general-purpose dimension reduction technique for machine learning.

**Snowball:** Belkin & Niyogi, Laplacian eigenmaps for dimensionality reduction (2003) (10.1162/089976603321780317); McInnes et al., hdbscan: Hierarchical density based clustering (10.21105/joss.00205)

---

#### Diffusion maps
*Ronald R. Coifman, Stephane Lafon* — 2006 · Applied and Computational Harmonic Analysis 21(1), 5-30 · cites: 4500 · OA

DOI `10.1016/j.acha.2006.04.006` · [link](https://doi.org/10.1016/j.acha.2006.04.006)

**Why:** Foundational diffusion-map manifold learning; basis for anisotropic-diffusion factor models and reaction-coordinate-style embeddings used in recent financial regime/factor work.

> The authors provide a framework based on diffusion processes for finding meaningful geometric descriptions of data sets. They show that eigenfunctions of Markov matrices defined on the data can be used to construct diffusion maps that generate efficient low-dimensional representations of the data. The diffusion distance, a metric robust to noise, is shown to be equal to the Euclidean distance in the embedded space, providing a unified probabilistic interpretation linking spectral clustering, dimensionality reduction, and harmonic analysis on graphs.

**Snowball:** Coifman et al., Geometric diffusions as a tool for harmonic analysis (PNAS 2005) (10.1073/pnas.0500334102); Nadler, Lafon, Coifman, Kevrekidis, Diffusion maps, spectral clustering and reaction coordinates (10.1016/j.acha.2005.07.004)

---

#### Hierarchical structure in financial markets
*Rosario N. Mantegna* — 1999 · European Physical Journal B 11(1), 193-197 · cites: 2400 · OA

DOI `10.1007/s100510050929` · arXiv `cond-mat/9802256` · [link](https://doi.org/10.1007/s100510050929)

**Why:** Origin of correlation-based asset taxonomy/clustering — the proto 'phenotyping' of assets into a geometric tree, conceptual ancestor of manifold-embedding asset maps.

> Using the daily time series of logarithmic stock prices, a metric distance between stocks is defined from the correlation coefficient of return pairs. From this distance matrix the minimum spanning tree and the associated hierarchical tree (the subdominant ultrametric) are constructed for a portfolio of major stocks. The resulting topological arrangement provides a meaningful economic taxonomy that groups companies by industrial sector, demonstrating that correlation-based geometry recovers economically interpretable structure.

**Snowball:** Tumminello, Aste, Di Matteo, Mantegna, A tool for filtering information in complex systems (PMFG, PNAS 2005) (10.1073/pnas.0500298102); Onnela et al., Dynamics of market correlations (PRE 2003) (10.1103/PhysRevE.68.056110)

---

#### Data-Driven Dynamic Factor Modeling via Manifold Learning
*Graeme Baker, Agostino Capponi, J. Antonio Sidaoui* — 2025 · arXiv preprint 2506.19945 · OA

arXiv `2506.19945` · [link](https://arxiv.org/abs/2506.19945)

**Why:** State-of-the-art (2025) fusion of diffusion-map manifold learning with factor modeling for cross-scenario/cross-market prediction and stress testing — a direct template for strategy transfer via learned embeddings.

> The authors introduce a data-driven dynamic factor framework modeling the joint evolution of high-dimensional covariates and responses without parametric assumptions, noting that standard factor models on covariates alone lose explanatory power for responses. The approach uses anisotropic diffusion maps to learn low-dimensional embeddings that preserve both the intrinsic geometry of covariates and their predictive relationship with responses. For series from Langevin diffusions they show the graph Laplacian converges to the diffusion generator and bound the approximation error, justifying Kalman filtering in diffusion-map coordinates. Applied to equity-portfolio stress testing with Federal Reserve supervisory scenarios, it achieves mean-absolute-error improvements of up to 55% over classical scenario analysis and 39% over PCA benchmarks.

**Snowball:** Coifman & Lafon, Diffusion maps (2006) (10.1016/j.acha.2006.04.006); Singer & Coifman, Non-linear independent component analysis with diffusion maps (10.1016/j.acha.2007.08.004)

---

#### Company classification using machine learning
*Sven Husmann, Antoniya Shivarova, Rick Steinert* — 2020 · arXiv preprint 2004.01496 (Expert Systems with Applications) · cites: 70 · OA

DOI `10.1016/j.eswa.2021.114998` · arXiv `2004.01496` · [link](https://arxiv.org/abs/2004.01496)

**Why:** Concrete demonstration that manifold-learning (t-SNE) embeddings of company feature vectors yield economically meaningful clusters that improve portfolios — applied asset phenotyping.

> The authors demonstrate that unsupervised machine learning can visualize and classify company data in an economically meaningful way. They apply t-distributed stochastic neighbor embedding (t-SNE) in combination with spectral clustering to derive company groups usable for empirical analysis and decision making. In an out-of-sample portfolio-optimization study, applying t-SNE and spectral clustering improves overall portfolio performance, establishing the approach as a valuable technique for data analysis and company classification in finance.

**Snowball:** van der Maaten & Hinton, Visualizing Data using t-SNE (2008); Ng, Jordan, Weiss, On spectral clustering (NIPS 2001)

---

#### A News-based Machine Learning Model for Adaptive Asset Pricing (News Embedding UMAP Selection)
*Liao Zhu, Haoxuan Wu, Martin T. Wells* — 2021 · arXiv preprint 2106.07103 · cites: 15 · OA

arXiv `2106.07103` · [link](https://arxiv.org/abs/2106.07103)

**Why:** Uses UMAP on news-derived company embeddings to select basis assets — an explicit manifold-learning route to data-driven factors and cross-asset relationships.

> The paper proposes the News Embedding UMAP Selection (NEUS) asset pricing model to explain and predict stock returns from financial news. Using a combination of machine learning algorithms, a company embedding vector is derived for each basis asset from financial news; UMAP is then used to obtain a collection of basis assets from these embeddings, and for each stock the basis assets are selected to explain and predict returns using high-dimensional statistical methods. NEUS shows significantly better fitting and prediction power than the Fama-French 5-factor model.

**Snowball:** McInnes, Healy, Melville, UMAP (2018) (1802.03426); Fama & French, A five-factor asset pricing model (2015) (10.1016/j.jfineco.2014.10.010)

---

#### One model is not enough: heterogeneity in cryptocurrencies' multifractal profiles
*Aurelio F. Bariviera* — 2020 · Finance Research Letters 39, 101649 · cites: 130 · OA

DOI `10.1016/j.frl.2020.101649` · arXiv `2003.09720` · [link](https://arxiv.org/abs/2003.09720)

**Why:** Empirical phenotyping across 84 assets: multifractal profiles partition cryptocurrencies into distinct dynamical classes, showing how complexity features cluster assets and warn against one-size-fits-all models.

> This paper studies the multifractal dynamics of 84 cryptocurrencies using two alternative multi-scaling methodologies, filling a gap in the literature. It finds compelling evidence that cryptocurrencies have different degrees of long-range dependence and, more importantly, follow different stochastic processes: some resemble monofractal fractional Gaussian noises while others exhibit complex multifractal dynamics. Results on the source of multifractality are mixed — shuffling reduces but does not eliminate multifractality — and the authors find an association of kurtosis with multifractality.

**Snowball:** Kantelhardt et al., MF-DFA (2002) (10.1016/S0378-4371(02)01383-3); Di Matteo, Multi-scaling in finance (2007) (10.1080/14697680600969727)

---

#### Systemic Risk Clustering of China Internet Financial Based on t-SNE Machine Learning Algorithm
*Mi Chuanmin, Xu Runjie, Lin Qingtong* — 2019 · arXiv preprint 1909.03808 · cites: 20 · OA

arXiv `1909.03808` · [link](https://arxiv.org/abs/1909.03808)

**Why:** Applies t-SNE to embed and cluster regional financial-risk feature vectors, illustrating manifold-learning-based phenotyping of systemic risk across many sub-markets.

> Motivated by the differing systemic-risk characteristics of internet financial platforms under macroeconomic shocks and internal crises, this paper uses the t-SNE machine learning algorithm to data-mine China's internet-finance development index across 31 provinces and 335 cities/regions. The analysis reveals peak-and-fat-tail characteristics and proposes a three-way classification of internet financial systemic risk, providing regionally targeted recommendations.

**Snowball:** van der Maaten & Hinton, Visualizing Data using t-SNE (2008)

---

#### ordpy: A Python package for data analysis with permutation entropy and ordinal network methods
*Arthur A. B. Pessa, Haroldo V. Ribeiro* — 2021 · Chaos: An Interdisciplinary Journal of Nonlinear Science 31(6), 063110 · cites: 160 · OA

DOI `10.1063/5.0049901` · arXiv `2102.06786` · [link](https://arxiv.org/abs/2102.06786)

**Why:** Practical, citable software/benchmark for computing the ordinal complexity features (permutation entropy, complexity-entropy plane) that define the phenotyping feature vectors in this topic.

> Since Bandt and Pompe's seminal work, permutation entropy has been widely used for time-series analysis and inspired a framework for mapping series into symbolic sequences, giving rise to ordinal networks. Despite growing popularity, computational implementations had been fragmented. ordpy is a pure-Python package implementing permutation entropy, statistical complexity, the complexity-entropy plane, Fisher-Shannon measures, Tsallis/Renyi variants, and ordinal-network methods for both time series and images, providing a unified, documented toolkit with reproducible examples.

**Snowball:** Bandt & Pompe, Permutation entropy (2002) (10.1103/PhysRevLett.88.174102); Pessa & Ribeiro, Characterizing stochastic time series with ordinal networks (PRE 2019) (10.1103/PhysRevE.100.042304)

---

#### Complexity-entropy causality plane: A useful approach to quantify the stock market inefficiency
*Luciano Zunino, Massimiliano Zanin, Benjamin M. Tabak, Dario G. Perez, Osvaldo A. Rosso* — 2010 · Physica A: Statistical Mechanics and its Applications · completeness-add

DOI `10.1016/j.physa.2010.01.007` · [link](https://www.sciencedirect.com/science/article/abs/pii/S0378437110000397)

**Why:** The canonical bridge from permutation entropy to a 2D 'market phenotype' coordinate (entropy x statistical complexity) used to rank/cluster markets by efficiency; directly underpins complexity-descriptor feature vectors. The list has the related Zunino 2009 forbidden-patterns paper but not this CECP-finance paper.

> The complexity-entropy causality plane (the Cartesian representation with normalized permutation entropy on the horizontal axis and Jensen-Shannon statistical complexity on the vertical axis) was recently introduced as a powerful tool for discriminating Gaussian from non-Gaussian processes and different degrees of temporal correlation. Here the authors use this representation space to quantify and rank the informational efficiency of stock markets. Locating each market's daily index in the plane reveals deviations from the ideal random-walk position associated with a totally stochastic (efficient) process, allowing a more refined classification of the stage of stock-market development than entropy alone. Empirical results for a large set of developed and emerging market indices show that the statistical-physics approach distinguishes degrees of inefficiency and orders the markets in a way consistent with their development stage.

**Snowball:** O.A. Rosso, H.A. Larrondo, M.T. Martin, A. Plastino, M.A. Fuentes, Distinguishing noise from chaos, Phys. Rev. Lett. 99 (2007) 154102 (10.1103/PhysRevLett.99.154102); P.W. Lamberti, M.T. Martin, A. Plastino, O.A. Rosso, Intensive entropic non-triviality measure, Physica A 334 (2004) 119-131 (10.1016/j.physa.2003.11.005); L. Zunino, M. Zanin, B.M. Tabak, D.G. Perez, O.A. Rosso, Forbidden patterns, permutation entropy and stock market inefficiency, Physica A 388 (2009) 2854-2864 (10.1016/j.physa.2009.03.042)

---

#### Clustering patterns in efficiency and the coming-of-age of the cryptocurrency market
*Higor Y. D. Sigaki, Matjaz Perc, Haroldo V. Ribeiro* — 2019 · Scientific Reports · OA · completeness-add

DOI `10.1038/s41598-018-37773-3` · [link](https://www.nature.com/articles/s41598-018-37773-3)

**Why:** Phenotyping at scale: ranks 400+ assets in the entropy-complexity plane over sliding windows and CLUSTERS them by efficiency trajectory - exactly the market-phenotyping workflow. Same group as the gathered ordpy package and a natural companion to the gathered Bariviera 2020 multifractal-profile paper.

> The efficient market hypothesis has far-reaching implications for financial trading and market stability. Whether or not cryptocurrencies are informationally efficient has therefore been the subject of intense recent investigation. Here, we use permutation entropy and statistical complexity over sliding time-windows of price log returns to quantify the dynamic efficiency of more than four hundred cryptocurrencies. We consider that a cryptocurrency is efficient within a time-window when these two complexity measures are statistically indistinguishable from their values obtained on randomly shuffled data. We find that 37% of the cryptocurrencies in our study stay efficient over 80% of the time, whereas 20% are informationally efficient in less than 20% of the time. Our results also show that the efficiency is not correlated with the market capitalization of the cryptocurrencies. A dynamic analysis of informational efficiency over time reveals clustering patterns in which different cryptocurrencies with similar temporal patterns form four clusters, and moreover, younger currencies in each group appear poised to follow the trend of their 'elders'. The cryptocurrency market thus already shows notable adherence to the efficient market hypothesis, although data also reveals that the coming-of-age of digital currencies is in this regard still very much underway.

**Snowball:** C. Bandt, B. Pompe, Permutation entropy: a natural complexity measure for time series, Phys. Rev. Lett. 88 (2002) 174102 (10.1103/PhysRevLett.88.174102); A.F. Bariviera, The inefficiency of Bitcoin revisited: a dynamic approach, Economics Letters 161 (2017) 1-4 (10.1016/j.econlet.2017.09.013); L. Zunino et al., Complexity-entropy causality plane: a useful approach to quantify the stock market inefficiency, Physica A 389 (2010) 1891-1901 (10.1016/j.physa.2010.01.007)

---

#### Topological data analysis of financial time series: Landscapes of crashes
*Marian Gidea, Yuri Katz* — 2018 · Physica A: Statistical Mechanics and its Applications · cites: 237 · OA · completeness-add

DOI `10.1016/j.physa.2017.09.028` · arXiv `1703.04385` · [link](https://arxiv.org/abs/1703.04385)

**Why:** The canonical TDA-of-markets paper: persistence landscapes give a complexity/shape descriptor of the joint multivariate market state that complements entropy and manifold-embedding features and serves as an early-warning phenotype.

> We explore the evolution of the daily returns of four major US stock market indices during the technology crash of 2000 and the financial crisis of 2007-2009. Our methodology is based on topological data analysis (TDA). We use persistence homology to detect and quantify topological patterns that appear in a multidimensional time series. Using a sliding window, we extract time-dependent point cloud data sets, to which we associate a topological space. We detect transient loops that appear in this space, and we measure their persistence. This is encoded in real-valued functions referred to as persistence landscapes. We quantify the temporal changes in persistence landscapes via their L^p-norms. We test this procedure on multidimensional time series generated by various non-linear and non-equilibrium models. We find that, in the vicinity of financial meltdowns, the L^p-norms exhibit strong growth prior to the primary peak, which ascends during a crash. Remarkably, the average spectral density at low frequencies of the time series of L^p-norms of the persistence landscapes demonstrates a strong rising trend for 250 trading days prior to either the dotcom crash on 03/10/2000, or the Lehman bankruptcy on 09/15/2008. This is a new type of econometric analysis, which goes beyond the standard statistical measures. It exploits topological data analysis as a tool to encode information embedded in the dynamics of complex time series.

**Snowball:** P. Bubenik, Statistical topological data analysis using persistence landscapes, J. Mach. Learn. Res. 16 (2015) 77-102 (arXiv:1207.6437); H. Edelsbrunner, J. Harer, Computational Topology: An Introduction, AMS (2010); R.N. Mantegna, Hierarchical structure in financial markets, Eur. Phys. J. B 11 (1999) 193-197 (10.1007/s100510050929)

---

#### Multifractal detrended cross-correlation analysis for two nonstationary signals
*Wei-Xing Zhou* — 2008 · Physical Review E · OA · completeness-add

DOI `10.1103/PhysRevE.77.066211` · arXiv `0803.2773` · [link](https://arxiv.org/abs/0803.2773)

**Why:** Canonical method for characterizing PAIRWISE multifractal co-movement between assets - the cross-market analogue of the gathered MF-DFA (Kantelhardt 2002). Essential when building cross-asset complexity feature vectors for phenotyping/strategy transfer.

> It is ubiquitous in natural and social sciences that two variables, recorded temporally or spatially in a complex system, are cross-correlated and possess multifractal features. We propose a new method called multifractal detrended cross-correlation analysis (MF-DXA, also widely cited as MF-DCCA) to investigate the multifractal behaviors in the power-law cross-correlations between two records in one or higher dimensions. The method generalizes detrended fluctuation analysis to pairs of signals by detrending the covariance of their cumulative profiles and extracting a generalized bivariate Hurst exponent and multifractal spectrum. The method is validated with cross-correlated 1D and 2D binomial measures and multifractal random walks. Application to two financial time series is also illustrated, demonstrating that the cross-correlation between price changes and volatilities (or between two asset returns) exhibits multifractal scaling.

**Snowball:** J.W. Kantelhardt et al., Multifractal detrended fluctuation analysis of nonstationary time series, Physica A 316 (2002) 87-114 (10.1016/S0378-4371(02)01383-3); B. Podobnik, H.E. Stanley, Detrended cross-correlation analysis: a new method for analyzing two nonstationary time series, Phys. Rev. Lett. 100 (2008) 084102 (10.1103/PhysRevLett.100.084102); P. Oswiecimka, J. Kwapien, S. Drozdz, Wavelet versus detrended fluctuation analysis of multifractal structures, Phys. Rev. E 74 (2006) 016103 (10.1103/PhysRevE.74.016103)

---

#### Random matrix approach to cross correlations in financial data
*Vasiliki Plerou, Parameswaran Gopikrishnan, Bernd Rosenow, Luis A. Nunes Amaral, Thomas Guhr, H. Eugene Stanley* — 2002 · Physical Review E · OA · completeness-add

DOI `10.1103/PhysRevE.65.066126` · arXiv `cond-mat/0108023` · [link](https://arxiv.org/abs/cond-mat/0108023)

**Why:** Canonical spectral geometry of the asset correlation matrix: separates signal (market mode, sector eigenvectors) from random noise via the Marcenko-Pastur bound - the theoretical foundation for PCA/diffusion-map/manifold methods on asset feature vectors and for denoising before clustering.

> We analyze cross correlations between price fluctuations of different stocks using methods of random matrix theory (RMT). Using two large databases of US stock returns, we compute cross-correlation matrices C of returns constructed from (i) 30-min returns of 1000 US stocks for 1994-1995, (ii) 30-min returns of 881 US stocks for 1996-1997, and (iii) 1-day returns of 422 US stocks for 1962-1996. We test the statistics of the eigenvalues of C against a null hypothesis - a random correlation matrix constructed from mutually uncorrelated time series. We find that a majority of the eigenvalues of C fall within the RMT bounds for the eigenvalues of random correlation matrices, suggesting that the contents of the correlation matrix are largely random. We test the eigenvalues of C within the RMT bounds for universal properties of random matrices and find good agreement with the predictions of the Gaussian orthogonal ensemble, implying a large degree of randomness in the measured cross correlations. The deviating eigenvalues that fall outside the RMT bounds carry genuine market information: the largest eigenvalue corresponds to an influence common to all stocks (the market mode), while the remaining deviating eigenvectors are stable in time and correspond to identifiable business sectors. These deviating eigenvectors can be used to construct portfolios with stable ratios of risk to return.

**Snowball:** L. Laloux, P. Cizeau, J.-P. Bouchaud, M. Potters, Noise dressing of financial correlation matrices, Phys. Rev. Lett. 83 (1999) 1467 (10.1103/PhysRevLett.83.1467); V.A. Marchenko, L.A. Pastur, Distribution of eigenvalues for some sets of random matrices, Math. USSR-Sbornik 1 (1967) 457 (10.1070/SM1967v001n04ABEH001994); R.N. Mantegna, Hierarchical structure in financial markets, Eur. Phys. J. B 11 (1999) 193 (10.1007/s100510050929)

---

#### Complexity of Financial Time Series: Multifractal and Multiscale Entropy Analyses
*Oday Masoudi, Farhad Shahbazi, Mohammad Sharifi* — 2025 · arXiv preprint (q-fin.ST) · OA · completeness-add

DOI `10.48550/arXiv.2507.23414` · arXiv `2507.23414` · [link](https://arxiv.org/abs/2507.23414)

**Why:** Recent worked example that jointly applies MF-DFA and a refined multiscale sample-entropy variant to characterise and COMPARE four cross-asset-class markets - a clean template for building complexity feature vectors that phenotype assets across markets.

> We employed Multifractal Detrended Fluctuation Analysis (MF-DFA) and Refined Composite Multiscale Sample Entropy (RCMSE) to investigate the complexity of Bitcoin, GBP/USD, gold, and natural gas price log-return time series. This study provides a comparative analysis of these markets and offers insights into their predictability and associated risks. Each tool presents a unique method to quantify time series complexity. The RCMSE and MF-DFA methods demonstrate a higher complexity for the Bitcoin time series than others. It is discussed that the increased complexity of Bitcoin may be attributable to the presence of higher nonlinear correlations within its log-return time series.

**Snowball:** M. Costa, A.L. Goldberger, C.-K. Peng, Multiscale entropy analysis of complex physiologic time series, Phys. Rev. Lett. 89 (2002) 068102 (10.1103/PhysRevLett.89.068102); S.-D. Wu, C.-W. Wu, S.-G. Lin, K.-Y. Lee, C.-K. Peng, Analysis of complex time series using refined composite multiscale entropy, Phys. Lett. A 378 (2014) 1369-1374 (10.1016/j.physleta.2014.03.034); J.W. Kantelhardt et al., Multifractal detrended fluctuation analysis of nonstationary time series, Physica A 316 (2002) 87-114 (10.1016/S0378-4371(02)01383-3)

---

#### The Shape of Markets: Machine Learning Modeling and Prediction Using 2-Manifold Geometries
*Panagiotis G. Papaioannou, Athanassios N. Yannacopoulos* — 2025 · arXiv preprint (q-fin.ST) · OA · completeness-add

DOI `10.48550/arXiv.2511.05030` · arXiv `2511.05030` · [link](https://arxiv.org/abs/2511.05030)

**Why:** Frontier manifold-learning work that explicitly infers the latent curvature/geometry of the market data manifold rather than assuming a flat Euclidean embedding - a direct extension of the t-SNE/UMAP/diffusion-map line in the scope toward geometric phenotyping.

> We introduce a Geometry Informed Model for financial forecasting by embedding high-dimensional market data onto constant-curvature 2-manifolds. Guided by the uniformization theorem, we model market dynamics as Brownian motion on spherical S2, Euclidean R2, and hyperbolic H2 geometries. We further include the torus T, a compact, flat manifold admissible as a quotient space of the Euclidean plane, anticipating its relevance for capturing cyclical dynamics. Manifold learning techniques infer the latent curvature from financial data, revealing the torus as the best-performing geometry. We interpret this result through a macroeconomic lens: the torus circular dimensions align with endogenous cycles in output, interest rates, and inflation described by IS-LM theory. Our findings demonstrate the value of integrating differential geometry with data-driven inference for financial modeling.

**Snowball:** R.R. Coifman, S. Lafon, Diffusion maps, Appl. Comput. Harmon. Anal. 21 (2006) 5-30 (10.1016/j.acha.2006.04.006); L. McInnes, J. Healy, J. Melville, UMAP: Uniform Manifold Approximation and Projection, arXiv:1802.03426 (arXiv:1802.03426); N. Boumal, An Introduction to Optimization on Smooth Manifolds, Cambridge Univ. Press (2023) (10.1017/9781009166164)

---

#### A persistent-homology-based turbulence index & some applications of TDA on financial markets
*Miguel A. Ruiz-Ortiz, Jose Carlos Gomez-Larranaga, Jesus Rodriguez-Viorato* — 2022 · arXiv preprint (q-fin.MF) · OA · completeness-add

DOI `10.48550/arXiv.2203.05603` · arXiv `2203.05603` · [link](https://arxiv.org/abs/2203.05603)

**Why:** Recent, partly tutorial paper that both reviews TDA-in-finance and proposes a persistent-homology turbulence/complexity index across multiple indices and crashes - useful as a survey entry point and a concrete cross-market complexity descriptor.

> Topological Data Analysis (TDA) is a modern approach to Data Analysis focusing on the topological features of data; it has been widely studied in recent years and used extensively in Biology, Physics, and many other areas. However, financial markets have been studied slightly through TDA. Here we present a quick review of some recent applications of TDA on financial markets, including applications in the early detection of turbulence periods in financial markets and how TDA can help to get new insights while investing. Also, we propose a new turbulence index based on persistent homology - the fundamental tool for TDA - that seems to capture critical transitions in financial data; we tested our index with different financial time series (S&P500, Russell 2000, S&P/BMV IPC and Nikkei 225) and crash events (Black Monday crash, dot-com crash, 2007-08 crash and COVID-19 crash). Furthermore, we include an introduction to persistent homology so the reader can understand this paper without knowing TDA.

**Snowball:** M. Gidea, Y. Katz, Topological data analysis of financial time series: landscapes of crashes, Physica A 491 (2018) 820-834 (10.1016/j.physa.2017.09.028); M.M. Goodwin et al. (eds.) / Mark Kritzman, Yuanzhen Li, Skulls, Financial Turbulence, and Risk Management, Financial Analysts Journal 66 (2010) 30-41 (10.2469/faj.v66.n5.3); H. Edelsbrunner, D. Letscher, A. Zomorodian, Topological persistence and simplification, Discrete Comput. Geom. 28 (2002) 511-533 (10.1007/s00454-002-2885-2)

---

#### Portfolio Selection via Topological Data Analysis
*Petr Sokerin, Kristian Kuznetsov, Elizaveta Makhneva, Alexey Zaytsev* — 2023 · arXiv preprint (q-fin.PM) · OA · completeness-add

DOI `10.48550/arXiv.2308.07944` · arXiv `2308.07944` · [link](https://arxiv.org/abs/2308.07944)

**Why:** Recent applied paper that turns per-asset TDA features into representations and CLUSTERS them for portfolio construction - a concrete pipeline of complexity-descriptor feature vectors -> clustering, paralleling the t-SNE/UMAP company-classification papers already gathered.

> Portfolio management is an essential part of investment decision-making. However, traditional methods often fail to deliver reasonable performance. This problem stems from the inability of these methods to account for the unique characteristics of multivariate time series data from stock markets. We present a two-stage method for constructing an investment portfolio of common stocks. The method involves the generation of time series representations followed by their subsequent clustering. Our approach utilizes features based on Topological Data Analysis (TDA) for the generation of representations, allowing us to elucidate the topological structure within the data. Experimental results show that our proposed system outperforms other methods. This superior performance is consistent over different time frames, suggesting the viability of TDA as a powerful tool for portfolio selection.

**Snowball:** M. Gidea, Y. Katz, Topological data analysis of financial time series: landscapes of crashes, Physica A 491 (2018) 820-834 (10.1016/j.physa.2017.09.028); M. Lopez de Prado, Building diversified portfolios that outperform out of sample, J. Portfolio Management 42 (2016) 59-69 (10.3905/jpm.2016.42.4.059); S. Husmann, A. Shivarova, R. Steinert, Company classification using machine learning, Expert Systems with Applications 156 (2020) 113455 (10.1016/j.eswa.2020.113455)

---

#### Complexity-based Financial Stress Evaluation
*Hongjian Xiao, Yao Lei Xu, Danilo P. Mandic* — 2022 · arXiv preprint (eess.SP) · OA · completeness-add

DOI `10.48550/arXiv.2212.02281` · arXiv `2212.02281` · [link](https://arxiv.org/abs/2212.02281)

**Why:** Explicitly transfers the bio-signal sample-entropy 'stress' paradigm to markets using MULTIVARIATE sample entropy, and builds a per-asset sensitivity/phenotype map of how each asset responds to crises - directly aligned with cross-asset complexity phenotyping.

> Financial markets typically exhibit dynamically complex properties as they undergo continuous interactions with economic and environmental factors. The Efficient Market Hypothesis indicates a rich difference in the structural complexity of security prices between normal (stable markets) and abnormal (financial crises) situations. Considering the analogy between market undulation of price time series and physical stress of bio-signals, we investigate whether stress indices in bio-systems can be adopted and modified so as to measure 'standard stress' in financial markets. This is achieved by employing structural complexity analysis, based on variants of univariate and multivariate sample entropy, to estimate the stress level of both financial markets on the whole and the performance of the individual financial indices. Further, we propose a novel graphical framework to establish the sensitivity of individual assets and stock markets to financial crises. This is achieved through Catastrophe Theory and entropy-based stress evaluations indicating the unique performance of each index/individual stock in response to different crises. Four major indices and four individual equities with gold prices are considered over the past 32 years from 1991-2021.

**Snowball:** J.S. Richman, J.R. Moorman, Physiological time-series analysis using approximate entropy and sample entropy, Am. J. Physiol. 278 (2000) H2039-H2049 (10.1152/ajpheart.2000.278.6.H2039); M.U. Ahmed, D.P. Mandic, Multivariate multiscale entropy: a tool for complexity analysis of multichannel data, Phys. Rev. E 84 (2011) 061918 (10.1103/PhysRevE.84.061918); M. Costa, A.L. Goldberger, C.-K. Peng, Multiscale entropy analysis of complex physiologic time series, Phys. Rev. Lett. 89 (2002) 068102 (10.1103/PhysRevLett.89.068102)

---

