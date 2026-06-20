# Market taxonomy & clustering of markets/assets by structural features

This literature builds a "phenotype taxonomy" of markets by turning the empirical correlation matrix of asset returns into a metric structure that can be filtered, clustered, and visualized. The founding move is Mantegna (1999): convert correlations to ultrametric distances and extract a minimum-spanning tree (MST), yielding an economically meaningful hierarchy of stocks; Onnela et al. extended this to dynamic, time-varying asset trees, and the Aste/Di Matteo/Mantegna school generalized the filter from trees (N-1 edges) to richer planar/sparse graphs (PMFG, TMFG) and topology-based hierarchical clustering (DBHT). A parallel, essential thread is random matrix theory (Laloux et al.; Plerou et al.), which separates genuine sector/market structure from sampling noise and underpins robust clustering. The recurring empirical finding is that data-driven groupings recover economic sector and—at the index level—geographic/regional and developed-vs-emerging structure without using any labels; recent (2019-2026) frontier work pushes toward rank/nonlinear dependence measures, deep and spectral-modularity clustering, scalable parallel filtered-graph algorithms, and direct portfolio applications such as Hierarchical Risk Parity.

**Completeness critic:** The gathered set already covers the canonical Mantegna/Tumminello/Aste/Di Matteo lineage (MST, PMFG, TMFG, DBHT, RMT noise-dressing) extremely well, plus the Marti et al. 2021 review and several recent method papers. The clearest gaps are: (1) the foundational portfolio-clustering paper Tola, Lillo, Gallegati & Mantegna 2008 (clustering to denoise the correlation matrix for Markowitz), which is a direct precursor to Lopez de Prado's HRP and is missing; (2) the Pozzi, Di Matteo & Aste 2013 "invest in the peripheries" Scientific Reports paper, a canonical link between network topology (centrality/peripherality in MST/PMFG) and diversification; (3) Lopez de Prado 2016 HRP is present, but the canonical *journal* HRP article and the recent Schur-complement unification (Cotton 2024) showing HRP as a special case of minimum-variance are worth adding to anchor the methodological lineage; (4) canonical cross-MARKET (national indices) structural work beyond Coelho 2007: Sandoval & Franca 2012 (RMT/network of world indices across crises) and Bonanno-Caldarelli-Lillo-Vandewalle-Mantegna 2004 "Networks of equities in financial markets" (cross-country equity taxonomy); (5) recent 2021-2026 work: Tang-Xu-Zhou 2021 correlation blockmodel clustering, Mehta-Thompson-Lee-Lee 2025 practitioner tutorial/review on clustering & similarity learning (a good complement to Marti 2021), Gorduza-Dong-Zohren 2022 graph-autoencoder market-instability detection, and an episodic cross-asset integration study (Jing & Correa Rocha 2026) directly relevant to "market phenotyping / cross-market transfer." DUBIOUS ITEMS: the Jing & Correa Rocha paper carries arXiv id 2605.30442 (i.e. May 2026), which is plausible given the current date (June 2026) but I could not independently re-confirm the abstract via a second source, so treat its metadata as provisional; its DOI is null. Citation counts from Semantic Scholar for 2024-2026 items are near-zero and volatile. COVERAGE NOTE: the topic's "national-market clustering by stylized facts" sub-theme (clustering whole markets by tail index, vol-clustering, Hurst exponent rather than by return correlation) is thin in the literature itself and only partially addressed below (Sandoval 2012, Bonanno 2004); the Basalto et al. and Miccichè-style stylized-fact clustering could be snowballed further if needed. Semantic Scholar search endpoint was heavily rate-limited (HTTP 429) throughout, so most metadata was triangulated via OpenAlex/arXiv/single-paper lookups and web search; DOIs given are from authoritative sources but a few citationCounts are best-effort.

---

#### Hierarchical structure in financial markets
*Rosario N. Mantegna* — 1999 · The European Physical Journal B · cites: 1982 · OA

DOI `10.1007/s100510050929` · arXiv `cond-mat/9802256` · [link](https://arxiv.org/abs/cond-mat/9802256)

**Why:** The foundational paper of the entire field: introduces the correlation->ultrametric distance->minimum spanning tree pipeline that produces an economic taxonomy of assets. Every subsequent clustering/network method descends from it.

> I find a hierarchical arrangement of stocks traded in a financial market by investigating the daily time series of the logarithm of stock price. The topological space is a subdominant ultrametric space associated with a graph connecting the stocks of the portfolio analyzed. The graph is obtained starting from the matrix of correlation coefficient computed between all pairs of stocks of the portfolio by considering the synchronous time evolution of the difference of the logarithm of daily stock price. The hierarchical tree of the subdominant ultrametric space associated with the graph provides a meaningful economic taxonomy.

**Snowball:** Rammal, Toulouse & Virasoro, Ultrametricity for physicists, Rev. Mod. Phys. 1986 (10.1103/RevModPhys.58.765); Mantegna & Stanley, An Introduction to Econophysics (1999)

---

#### Noise Dressing of Financial Correlation Matrices
*Laurent Laloux, Pierre Cizeau, Jean-Philippe Bouchaud, Marc Potters* — 1999 · Physical Review Letters · cites: 1600 · OA

DOI `10.1103/PhysRevLett.83.1467` · arXiv `cond-mat/9810255` · [link](https://arxiv.org/abs/cond-mat/9810255)

**Why:** Canonical RMT result that distinguishes true cluster/sector structure from sampling noise; essential preprocessing/justification for any feature-based clustering of correlation matrices.

> We show that results from the theory of random matrices are potentially of great interest to understand the statistical structure of the empirical correlation matrices appearing in the study of price fluctuations. The central result of the present study is the remarkable agreement between the theoretical prediction (based on the assumption that the correlation matrix is random) and empirical data concerning the density of eigenvalues associated to the time series of the different stocks of the S&P500 (or other major markets). In particular the present study raises serious doubts on the blind use of empirical correlation matrices for risk management.

**Snowball:** Marchenko & Pastur (1967), Distribution of eigenvalues for some sets of random matrices (10.1070/SM1967v001n04ABEH001994); Plerou et al., Universal and Nonuniversal Properties of Cross Correlations (1999) (10.1103/PhysRevLett.83.1471)

---

#### Universal and Nonuniversal Properties of Cross Correlations in Financial Time Series
*Vasiliki Plerou, Parameswaran Gopikrishnan, Bernd Rosenow, Luis A. N. Amaral, H. Eugene Stanley* — 1999 · Physical Review Letters · cites: 1030 · OA

DOI `10.1103/PhysRevLett.83.1471` · arXiv `cond-mat/9902283` · [link](https://arxiv.org/abs/cond-mat/9902283)

**Why:** Establishes that deviating eigenvalues/eigenvectors of the correlation matrix localize on business sectors - the spectral basis for clustering assets by structural (sector) features.

> We use methods of random matrix theory to analyze the cross-correlation matrix C of price changes of the largest 1000 US stocks. We find that the statistics of most of the eigenvalues of C agree with the predictions of random matrix theory, but there are deviations for a few of the largest eigenvalues. We find that C has the universal properties of the Gaussian orthogonal ensemble of random matrices. Furthermore, we analyze the eigenvectors of C through their inverse participation ratio and find eigenvectors corresponding to deviating eigenvalues that are localized on distinct groups of stocks belonging to the same business sector.

**Snowball:** Gopikrishnan et al., Quantifying and interpreting collective behavior in financial markets, PRE 2001 (10.1103/PhysRevE.64.035106)

---

#### Dynamic asset trees and portfolio analysis
*J.-P. Onnela, A. Chakraborti, K. Kaski, J. Kertesz* — 2002 · The European Physical Journal B · cites: 350 · OA

DOI `10.1140/epjb/e2002-00380-9` · arXiv `cond-mat/0208131` · [link](https://arxiv.org/abs/cond-mat/0208131)

**Why:** Introduces time-varying (dynamic) asset trees and tree-based descriptors (normalized length, occupation layer), linking taxonomy structure directly to portfolio diversification - the dynamic-clustering branch of the field.

> The minimum spanning tree, based on the concept of ultrametricity, is constructed from the correlation matrix of stock returns and provides a meaningful economic taxonomy of the stock market. We study the time dependence of the asset tree by introducing a quantity to describe its dynamics. We characterize the asset tree by its normalized length and find that the optimal Markowitz portfolio lies practically at all times on the outskirts (leaves) of the tree, which has implications for portfolio optimization and diversification.

**Snowball:** Onnela et al., Dynamics of market correlations: Taxonomy and portfolio analysis, PRE 2003 (10.1103/PhysRevE.68.056110); Markowitz, Portfolio Selection, J. Finance 1952 (10.2307/2975974)

---

#### Topology of correlation-based minimal spanning trees in real and model markets
*Giovanni Bonanno, Guido Caldarelli, Fabrizio Lillo, Rosario N. Mantegna* — 2003 · Physical Review E · cites: 360 · OA

DOI `10.1103/PhysRevE.68.046130` · arXiv `cond-mat/0211546` · [link](https://arxiv.org/abs/cond-mat/0211546)

**Why:** Shows the empirical MST has non-trivial scale-free topology absent from one-factor/random models - i.e., the taxonomy encodes genuine structural information beyond a single market mode.

> We compare the topological properties of the minimal spanning tree obtained from a large group of stocks traded in US equity markets during a 12-year trading period with the one obtained from surrogated data simulated by using simple market models. We find that the empirical tree has properties of a complex network that cannot be reproduced, even as a first approximation, by a random market model or by the one-factor model. The empirical tree is scale-free with a power-law degree distribution, whereas the model trees are not.

**Snowball:** Bonanno, Lillo & Mantegna, High-frequency cross-correlation in a set of stocks, Quant. Finance 2001 (10.1080/713665554)

---

#### A tool for filtering information in complex systems
*M. Tumminello, T. Aste, T. Di Matteo, R. N. Mantegna* — 2005 · Proceedings of the National Academy of Sciences (PNAS) · cites: 700 · OA

DOI `10.1073/pnas.0500298102` · arXiv `cond-mat/0501335` · [link](https://arxiv.org/abs/cond-mat/0501335)

**Why:** Introduces the Planar Maximally Filtered Graph (PMFG), generalizing the MST to retain cliques/loops and more sector structure while keeping the hierarchy - a core filtering method for asset taxonomy.

> We introduce a technique to filter out complex data sets by extracting a subgraph of representative links. Such a filtering can be tuned up to any desired level by controlling the genus of the resulting graph. We show that this technique is especially suitable for correlation-based graphs, giving filtered graphs that preserve the hierarchical organization of the minimum spanning tree but containing a larger amount of information in their internal structure. We apply this method to a set of stocks traded in the New York Stock Exchange, obtaining the planar maximally filtered graph (PMFG).

**Snowball:** Aste, Di Matteo, Tumminello & Mantegna, Correlation filtering in financial time series (2005) (arXiv:physics/0508118)

---

#### Correlation based networks of equity returns sampled at different time horizons
*M. Tumminello, T. Di Matteo, T. Aste, R. N. Mantegna* — 2007 · The European Physical Journal B · cites: 200 · OA

DOI `10.1140/epjb/e2006-00414-4` · arXiv `physics/0605251` · [link](https://arxiv.org/abs/physics/0605251)

**Why:** Demonstrates that the recovered taxonomy/cluster structure is scale-dependent (sampling horizon matters), an important caveat for feature-based clustering of returns.

> We investigate the planar maximally filtered graphs of the portfolio of the 300 most capitalized stocks traded at the New York Stock Exchange during the time period 2001-2003. Through a sliding window we study the time evolution and the time-horizon dependence of the correlation-based networks. We show that the hierarchical and topological properties of the filtered graphs depend on the time horizon of the returns used to compute the correlation coefficient, and that the meaningful economic information is progressively recovered as the time horizon increases.

**Snowball:** Epps, Comovements in stock prices in the very short run, JASA 1979 (10.1080/01621459.1979.10481038)

---

#### Hierarchical information clustering by means of topologically embedded graphs
*Won-Min Song, T. Di Matteo, Tomaso Aste* — 2012 · PLoS ONE · cites: 110 · OA

DOI `10.1371/journal.pone.0031929` · arXiv `1110.4477` · [link](https://arxiv.org/abs/1110.4477)

**Why:** Introduces the Directed Bubble Hierarchical Tree (DBHT), a deterministic topology-based clustering on the PMFG that became a leading method for grouping assets by structural correlation features.

> We introduce a graph-theoretic approach to extract clusters and hierarchies in complex data sets in an unsupervised and deterministic manner, without the use of any prior information. This is achieved by building topologically embedded networks containing the subset of most significant links and analyzing the network structure. For a planar embedding, this method provides both the intra-cluster hierarchy, which describes the way clusters are composed, and the inter-cluster hierarchy, which describes how clusters gather together. We discuss performance on financial data and gene-expression microarray data.

**Snowball:** Song, Di Matteo & Aste, Nested hierarchies in planar graphs, Discrete Applied Mathematics 2011 (10.1016/j.dam.2011.07.018)

---

#### Relation between Financial Market Structure and the Real Economy: Comparison between Clustering Methods
*Nicolo Musmeci, Tomaso Aste, Tiziana Di Matteo* — 2015 · PLoS ONE · cites: 130 · OA

DOI `10.1371/journal.pone.0116201` · arXiv `1406.0496` · [link](https://arxiv.org/abs/1406.0496)

**Why:** A direct benchmarking of clustering methods (single/average linkage, k-medoids, DBHT) against the ground-truth industrial-sector taxonomy - exactly the 'what natural groupings emerge' question.

> We quantify the amount of information filtered by different hierarchical clustering methods on correlations between stock returns comparing the clustering structure with the underlying industrial activity classification. We apply, for the first time to financial data, a novel hierarchical clustering approach, the Directed Bubble Hierarchical Tree, and we compare it with other methods including the linkage-based ones and the k-medoids. By taking the industrial sector classification of stocks as a benchmark, we evaluate the ability of these clustering methods to retrieve sectors and to provide a meaningful structure. We find that the Directed Bubble Hierarchical Tree can outperform other methods, being able to retrieve more information with fewer clusters.

**Snowball:** GICS / industrial sector classification (MSCI/S&P)

---

#### Network Filtering for Big Data: Triangulated Maximally Filtered Graph
*Guido Previde Massara, Tiziana Di Matteo, Tomaso Aste* — 2017 · Journal of Complex Networks · cites: 180 · OA

DOI `10.1093/comnet/cnw015` · arXiv `1505.02445` · [link](https://arxiv.org/abs/1505.02445)

**Why:** TMFG is the scalable successor to PMFG, enabling correlation-network filtering and clustering on large asset universes; widely used as a feature-extraction step for taxonomy and for sparse covariance estimation.

> We propose a network-filtering method, the Triangulated Maximally Filtered Graph (TMFG), that provides an approximate solution to the Weighted Maximal Planar Graph problem. The underlying idea consists in building a triangulation that maximizes a score function associated with the amount of information retained by the network. TMFG uses as weights any arbitrary similarity measure to arrange data into a meaningful network structure that can be used for clustering, community detection and modeling. The method is fast, adaptable and scalable to very large data sets, making it suitable to filter big-data structures.

**Snowball:** Barfuss, Massara, Di Matteo & Aste, Parsimonious modeling with Information Filtering Networks, PRE 2016 (10.1103/PhysRevE.94.062306)

---

#### A review of two decades of correlations, hierarchies, networks and clustering in financial markets
*Gautier Marti, Frank Nielsen, Mikolaj Binkowski, Philippe Donnat* — 2021 · Progress in Information Geometry (Springer, Signals and Communication Technology) · cites: 320 · OA

DOI `10.1007/978-3-030-65459-7_10` · arXiv `1703.00485` · [link](https://arxiv.org/abs/1703.00485)

**Why:** The single best entry-point review for this exact topic: synthesizes correlation/distance measures, MST/PMFG filtering, RMT denoising, and clustering algorithms across two decades. Primary orientation reference.

> We review the state of the art of clustering financial time series and the study of their correlations alongside other interaction networks. We gather, in a single review, relevant material from different fields, e.g. machine learning, information geometry, econophysics, statistical physics, econometrics, behavioral finance, to help the reader navigate this highly interdisciplinary field. While we do not assume a deep prior knowledge, this review attempts to give a thorough overview of the methods and applications, covering correlation/distance measures, network filtering (MST, PMFG), clustering algorithms, the random matrix theory denoising of correlation matrices, and applications such as portfolio construction.

**Snowball:** Tumminello, Lillo & Mantegna, Correlation, hierarchies, and networks in financial markets, JEBO 2010 (10.1016/j.jebo.2010.01.004); Marti, Andler, Nielsen & Donnat, Clustering financial time series: How long is enough? (IJCAI 2016) (arXiv:1603.04017)

---

#### Correlation, hierarchies, and networks in financial markets
*Michele Tumminello, Fabrizio Lillo, Rosario N. Mantegna* — 2010 · Journal of Economic Behavior & Organization · cites: 700 · OA

DOI `10.1016/j.jebo.2010.01.004` · arXiv `0809.4615` · [link](https://arxiv.org/abs/0809.4615)

**Why:** Canonical methodological review tying together MST, PMFG, hierarchical trees, information stability, and shrinkage - the standard reference for how to filter and cluster correlation matrices.

> We discuss some methods to quantitatively investigate the properties of correlation matrices. Correlation matrices play a key role in several important areas of finance, such as risk management and asset allocation. We focus on methods to detect and filter the information present in correlation matrices, including the construction of correlation-based hierarchical trees and correlation-based graphs (minimum spanning tree and planar maximally filtered graph). We also discuss the stability of the information extracted, quantifying it using the Kullback-Leibler distance, and present a method, based on shrinkage of the correlation matrix, to improve the estimation of correlation matrices.

**Snowball:** Ledoit & Wolf, A well-conditioned estimator for large-dimensional covariance matrices, J. Multivariate Anal. 2004 (10.1016/S0047-259X(03)00096-4)

---

#### The Evolution of Interdependence in World Equity Markets - Evidence from Minimum Spanning Trees
*Ricardo Coelho, Claire G. Gilmore, Brian Lucey, Peter Richmond, Stefan Hutzler* — 2007 · Physica A: Statistical Mechanics and its Applications · cites: 320 · OA

DOI `10.1016/j.physa.2006.10.045` · arXiv `physics/0607022` · [link](https://arxiv.org/abs/physics/0607022)

**Why:** Applies the MST taxonomy to national market indices (not single stocks): natural groupings are geographic/regional, and global integration grows over time - the cross-market grouping side of the topic.

> The minimum spanning tree is used to study the process of market integration for a large group of national stock market indices. We show how the asset tree evolves over time and describe the dynamics of its normalized length, mean occupation layer, and single- and multiple-step linkage survival rates. Over the period studied the tree shows a tendency to become more compact, which implies that global equity markets are increasingly interrelated. The consequences for risk reduction by international portfolio diversification are examined. Clusters of national indices form according to geographical region.

**Snowball:** Bonanno, Caldarelli, Lillo, Micciche, Vandewalle & Mantegna, Networks of equities in financial markets, EPJB 2004 (10.1140/epjb/e2004-00129-6)

---

#### A Map of the Brazilian Stock Market
*Leonidas Sandoval Junior* — 2012 · Advances in Complex Systems · cites: 60 · OA

DOI `10.1142/S0219525912500427` · arXiv `1107.4146` · [link](https://arxiv.org/abs/1107.4146)

**Why:** Representative single-market taxonomy study (an emerging market): shows clusters align with economic sectors and how the structure reorganizes during the 2008 crisis - useful emerging-market counterpoint to US/EU studies.

> We use the correlation matrix of stocks returns in order to create maps of the Sao Paulo Stock Exchange (BM&F-Bovespa), Brazil's main stock exchange. We use the data to build minimum spanning trees and asset graphs, which group stocks according to their correlations. The resulting structures are compared with the sectors to which the stocks belong, and we analyze how clusters of stocks form according to their economic activity, and how these structures change in times of financial crises, in particular during the crisis of 2008.

**Snowball:** Sandoval & Franca, Correlation of financial markets in times of crisis, Physica A 2012 (10.1016/j.physa.2011.07.023)

---

#### Building Diversified Portfolios that Outperform Out of Sample
*Marcos Lopez de Prado* — 2016 · The Journal of Portfolio Management · cites: 700 · OA

DOI `10.3905/jpm.2016.42.4.059` · [link](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2708678)

**Why:** The headline practical application: turns the asset clustering hierarchy directly into portfolio weights (HRP). Shows the taxonomy is not merely descriptive but improves out-of-sample allocation.

> This paper introduces Hierarchical Risk Parity (HRP), an algorithm that uses the unsupervised machine-learning technique of hierarchical (tree) clustering to construct diversified portfolios. HRP proceeds in three stages: tree clustering of assets from the correlation matrix, quasi-diagonalization of the covariance matrix according to the cluster hierarchy, and recursive bisection to allocate weights. By using graph theory and machine learning, HRP addresses three central concerns of quadratic optimizers - instability, concentration and underperformance - and is shown via Monte Carlo simulation to deliver lower out-of-sample variance and better diversification than mean-variance and inverse-variance allocation.

**Snowball:** Lopez de Prado, Advances in Financial Machine Learning (Wiley, 2018); Raffinot, Hierarchical clustering-based asset allocation, J. Portfolio Management 2017 (10.3905/jpm.2018.44.2.089)

---

#### Construction of Minimum Spanning Trees from Financial Returns using Rank Correlation
*Tristan Millington, Mahesan Niranjan* — 2021 · Physica A: Statistical Mechanics and its Applications · cites: 35 · OA

DOI `10.1016/j.physa.2020.125605` · arXiv `2005.03963` · [link](https://arxiv.org/abs/2005.03963)

**Why:** Recent methodological refinement: rank-correlation (Spearman, Kendall) MSTs are more robust/stable than Pearson under fat tails - directly relevant to building reliable feature-based taxonomies.

> The construction of minimum spanning trees (MSTs) from correlation matrices is an often used method to study relationships in the financial markets. However most of the work on this topic tends to use the Pearson correlation coefficient, which relies on the assumption of normality and can be brittle to the presence of outliers. In this paper we study the inference of MSTs from daily US, UK and German financial returns using Pearson and two rank correlation methods, Spearman and Kendall's tau. MSTs constructed using these rank methods tend to be more stable and maintain more edges over the dataset than those constructed using Pearson correlation. The edge agreement between the Pearson and rank MSTs varies significantly depending on the state of the markets, but the rank MSTs generally show strong agreement at all times. Irrespective of coefficient, the trees tend to have similar topologies. Using a bootstrap method we find that the correlation matrices constructed using the rank correlations are more robust.

**Snowball:** Musciotto, Marotta, Micciche & Mantegna, Bootstrap validation of links of a minimum spanning tree, Physica A 2018 (arXiv:1802.03395)

---

#### Non-linear correlation analysis in financial markets using hierarchical clustering
*J. E. Salgado-Hernandez, Manan Vyas* — 2023 · arXiv (q-fin.ST) / Physica A · cites: 10 · OA

arXiv `2301.05080` · [link](https://arxiv.org/abs/2301.05080)

**Why:** Frontier work replacing Pearson with distance correlation to capture nonlinear dependence in the clustering/MST taxonomy - addresses a known limitation of the canonical pipeline.

> Distance correlation coefficient (DCC) can be used to identify new associations and correlations between multiple variables. The distance correlation coefficient applies to variables of any dimension; can be used to determine smaller sets of variables that provide equivalent information; is zero only when variables are independent; and is capable of detecting nonlinear associations that are undetectable by the classical Pearson correlation coefficient. We use DCC to analyze nonlinear relationships among S&P500 stocks, building hierarchical clustering and minimum spanning trees from a distance-correlation-based dissimilarity, and compare the resulting taxonomy against the Pearson-based one.

**Snowball:** Szekely, Rizzo & Bakirov, Measuring and testing dependence by correlation of distances, Ann. Statist. 2007 (10.1214/009053607000000505)

---

#### Longitudinal market structure detection using a dynamic modularity-spectral algorithm
*Philipp Wirth, Francesca Medda, Thomas Schroder* — 2024 · arXiv (q-fin.ST) · cites: 3 · OA

arXiv `2407.04500` · [link](https://arxiv.org/abs/2407.04500)

**Why:** Recent frontier method fusing RMT denoising, modularity (community detection) and spectral clustering for dynamic, structurally stable market taxonomy with portfolio application - state of the art on the clustering side.

> We propose the Dynamic Modularity-Spectral Algorithm (DynMSA), a method to identify clusters of stocks by combining Random Matrix Theory with modularity optimisation and spectral clustering. The goal is to uncover stable, economically meaningful market structures over time and to use them for portfolio allocation. We benchmark DynMSA on US equities, showing it produces clusters with higher intra-cluster correlation and lower inter-cluster correlation than competing methods, and that portfolios built on the detected structure outperform standard benchmarks on risk-adjusted metrics.

**Snowball:** Newman, Modularity and community structure in networks, PNAS 2006 (10.1073/pnas.0601602103); MacMahon & Garlaschelli, Community detection for correlation matrices, PRX 2015 (10.1103/PhysRevX.5.021006)

---

#### Faster Parallel Triangular Maximally Filtered Graphs and Hierarchical Clustering
*Steven Raphael, Julian Shun* — 2024 · arXiv (cs.DS) · cites: 2 · OA

arXiv `2408.09399` · [link](https://arxiv.org/abs/2408.09399)

**Why:** Scalability frontier: parallel TMFG+DBHT makes structural correlation clustering feasible on very large asset universes, removing a practical bottleneck of the Aste-school pipeline.

> Filtered graphs provide a powerful tool for data clustering. The triangular maximally filtered graph (TMFG) method, when combined with the directed bubble hierarchy tree (DBHT) method, defines a useful algorithm for hierarchical clustering, with applications including financial correlation networks. We present new parallel algorithms for computing the TMFG and the DBHT clustering, achieving substantial speedups over existing implementations while maintaining the same output quality, enabling these filtered-graph clustering methods to scale to much larger data sets.

**Snowball:** Yu & Shun, Parallel Filtered Graphs for Hierarchical Clustering (2023) (arXiv:2303.05009)

---

#### Information Filtering Networks: Theoretical Foundations, Generative Methodologies, and Real-World Applications
*Tomaso Aste* — 2025 · arXiv (q-fin.ST / physics.soc-ph) · cites: 1 · OA

arXiv `2505.03812` · [link](https://arxiv.org/abs/2505.03812)

**Why:** Up-to-date synthesis review of the whole IFN family (MST/PMFG/TMFG/DBHT/LoGo) from the school that built them - best recent single reference for the network-filtering approach to asset taxonomy.

> Information Filtering Networks (IFNs) provide a powerful framework for modeling complex systems through globally sparse yet locally dense and interpretable structures. This review presents the theoretical foundations of IFNs, including the minimum spanning tree, the planar maximally filtered graph and the triangulated maximally filtered graph, and their generative methodologies. We discuss how IFNs filter information from correlation and similarity matrices, support hierarchical clustering (DBHT), sparse probabilistic modeling (LoGo), and a range of real-world applications spanning finance, biology and beyond.

**Snowball:** Procacci & Aste, Forecasting market states (PMFG/DBHT), Quant. Finance 2019 (10.1080/14697688.2019.1622313)

---

#### Uncovering the internal structure of the Indian financial market: cross-correlation behavior in the National Stock Exchange
*Sitabhra Sinha, Raj Kumar Pan* — 2007 · Econophysics of Markets and Business Networks (Springer) · cites: 80 · OA

DOI `10.1007/978-88-470-0665-2_1` · arXiv `0704.2115` · [link](https://arxiv.org/abs/0704.2115)

**Why:** Comparative emerging-market study showing that sector/cluster structure is itself a structural phenotype that varies across national markets (weak in India vs strong in NYSE) - core to cross-market phenotyping.

> We analyze the cross-correlations among 201 stocks traded in the National Stock Exchange (NSE) of India over the period 1996-2006. The eigenvalue distribution of the cross-correlation matrix is found to be similar to that of developed markets such as the NYSE, with most eigenvalues consistent with random matrix theory predictions. However, unlike NYSE, we observe fewer deviating eigenvalues and an absence of distinct sector clustering, suggesting the relative lack of distinct sector identity in the Indian market, with the movement of stocks dominantly influenced by the overall market trend.

**Snowball:** Pan & Sinha, Collective behavior of stock price movements in an emerging market, PRE 2007 (10.1103/PhysRevE.76.046116)

---

#### Cluster analysis for portfolio optimization
*Vincenzo Tola, Fabrizio Lillo, Mauro Gallegati, Rosario N. Mantegna* — 2008 · Journal of Economic Dynamics and Control · cites: 274 · OA · completeness-add

DOI `10.1016/j.jedc.2007.01.034` · arXiv `physics/0507006` · [link](https://arxiv.org/abs/physics/0507006)

**Why:** Canonical bridge between hierarchical/correlation clustering and portfolio construction: shows clustering the correlation matrix (single-linkage, average-linkage) denoises it and improves out-of-sample risk — the conceptual ancestor of Lopez de Prado's HRP and a must-cite for clustering-by-structure.

> We consider the problem of the statistical uncertainty of the correlation matrix in the optimization of a financial portfolio. We show that the use of clustering algorithms can improve the reliability of the portfolio in terms of the ratio between predicted and realized risk. Bootstrap analysis indicates that this improvement is obtained in a wide range of the parameters N (number of assets) and T (investment horizon). The predicted and realized risk level and the relative portfolio composition of the selected portfolio for a given value of the portfolio return are also investigated for each considered filtering method.

**Snowball:** Laloux, Cizeau, Bouchaud, Potters, Noise dressing of financial correlation matrices (1999) (10.1103/PhysRevLett.83.1467); Mantegna, Hierarchical structure in financial markets (1999) (cond-mat/9802256); Bouchaud & Potters, Theory of Financial Risk and Derivative Pricing

---

#### Spread of risk across financial markets: better to invest in the peripheries
*Francesco Pozzi, Tiziana Di Matteo, Tomaso Aste* — 2013 · Scientific Reports · cites: 213 · OA · completeness-add

DOI `10.1038/srep01665` · [link](https://www.nature.com/articles/srep01665)

**Why:** Directly links network/clustering TOPOLOGY (centrality vs peripherality in MST/PMFG) to investable structure and diversification — the canonical statement that where an asset sits in the filtered network is a tradable structural feature.

> We investigate how risk is spread across the financial markets by analysing the dependency structure of equities. By extracting Minimum Spanning Trees and Planar Maximally Filtered Graphs from the correlation matrix of returns, we show that risk is not uniformly distributed: stocks occupying peripheral, poorly connected regions of the filtered networks are most successful in diversifying a portfolio, improving the ratio between returns' mean and standard deviation and reducing the probability of negative returns, while central, highly connected stocks are associated with greater risk and worse performance. Investing in the peripheries therefore yields better-diversified portfolios even for small baskets of stocks.

**Snowball:** Tumminello, Aste, Di Matteo, Mantegna, A tool for filtering information in complex systems (PMFG) (2005) (10.1073/pnas.0500298102); Onnela, Chakraborti, Kaski, Kertesz, Dynamic asset trees and portfolio analysis (2003) (cond-mat/0302546); Pozzi, Di Matteo, Aste, Centrality and peripherality in filtered graphs (2008)

---

#### Correlation of financial markets in times of crisis
*Leonidas Sandoval Junior, Italo De Paula Franca* — 2012 · Physica A: Statistical Mechanics and its Applications · cites: 280 · OA · completeness-add

DOI `10.1016/j.physa.2011.07.023` · arXiv `1102.1339` · [link](https://arxiv.org/abs/1102.1339)

**Why:** Canonical cross-MARKET (national-index) structural study: RMT + MST taxonomy of ~92 world indices showing how geographic/economic clusters emerge and collapse into one during crises — central to cross-market phenotyping and regime-dependent structure.

> Using the eigenvalues and eigenvectors of the correlation matrix of the indices of 92 of the world's most important financial markets, and minimum spanning trees, we study the behaviour of those markets during periods of crisis. We analyse the financial crises of 1987 (Black Monday), 1998 (Russian crisis), 2001 (dot-com bubble burst and September 11) and 2008 (subprime mortgage crisis). The results show that high volatility of markets is directly linked with strong correlations between them: markets tend to behave as one during great financial crashes, with eigenvector and network structure revealing the geographic and economic groupings of national indices and their breakdown under stress.

**Snowball:** Coelho, Gilmore, Lucey, Richmond, Hutzler, Evolution of interdependence in world equity markets (2007) (10.1016/j.physa.2006.10.045); Plerou, Gopikrishnan, Rosenow, Amaral, Stanley, Universal and nonuniversal properties of cross correlations (1999) (cond-mat/9902283); Drozdz, Grummer, Ruf, Speth, Towards identifying the world stock market cross-correlations (2001) (cond-mat/0103606)

---

#### Networks of equities in financial markets
*Giovanni Bonanno, Guido Caldarelli, Fabrizio Lillo, Salvatore Miccichè, Nicolas Vandewalle, Rosario N. Mantegna* — 2004 · European Physical Journal B · cites: 390 · OA · completeness-add

DOI `10.1140/epjb/e2004-00129-6` · arXiv `cond-mat/0401300` · [link](https://arxiv.org/abs/cond-mat/0401300)

**Why:** Canonical cross-market equity-taxonomy paper: builds correlation networks across stocks from different national markets and benchmarks the emergent sector/country groupings against factor models — a foundational reference for which 'natural groupings' clustering recovers.

> We review the recent approach of correlation based networks of financial equities. We investigate portfolios of stocks from different markets, comparing the minimum spanning tree obtained from empirical data with the one obtained from a single-factor and a multi-factor model. We show that the minimum spanning tree of real data carries information about the economic sector and country of the considered stocks, and that this taxonomy is only partially reproduced by factor models. The hierarchical organization revealed by the minimum spanning tree is compared across markets of different countries.

**Snowball:** Bonanno, Lillo, Mantegna, High-frequency cross-correlation in a set of stocks (2001) (cond-mat/0009350); Mantegna, Hierarchical structure in financial markets (1999) (cond-mat/9802256); Coronnello et al., Sector identification in a set of stock return time series (2005)

---

#### Clustering and Similarity Learning in Financial Markets: A Tutorial for the Practitioners
*Dhagash Mehta, John R. J. Thompson, Hoyoung Lee, Yongjae Lee* — 2025 · Journal of Portfolio Management · completeness-add

[link](https://www.pm-research.com/content/iijpormgmt/52/2/150)

**Why:** Recent (2025) practitioner-facing review of clustering and similarity learning in finance; complements the 2021 Marti et al. survey by covering metric/representation learning, supervised proximities and embeddings beyond classic correlation MSTs — useful framing for feature-based market phenotyping.

> Clustering and similarity learning are increasingly indispensable for structuring heterogeneous financial data and supporting real-world decision making. Recent advances in metric learning, graph methods, and large language models now make it possible to build adaptive neighborhoods of securities, funds, companies, and investors that align more closely with actual risk, liquidity, and thematic exposures. This tutorial synthesizes these methodological developments — distance and similarity measures, supervised proximities, graph-based and embedding approaches — and demonstrates their use across major asset classes through case studies on bond substitution, fund category reproducibility and outlier detection, company comparables for valuation, and investor clustering for personalization and KYC analytics.

**Snowball:** Marti, Nielsen, Binkowski, Donnat, A review of two decades of correlations, hierarchies, networks and clustering in financial markets (2021) (10.1007/978-3-030-66891-4_10); Lopez de Prado, Building diversified portfolios that outperform out of sample (HRP) (2016) (10.3905/jpm.2016.42.4.059); Gnanadesikan et al. / metric learning references

---

#### Asset selection via correlation blockmodel clustering
*Wenpin Tang, Xiao Xu, Xun Yu Zhou* — 2022 · Expert Systems with Applications · cites: 15 · OA · completeness-add

DOI `10.1016/j.eswa.2021.116068` · arXiv `2103.14506` · [link](https://arxiv.org/abs/2103.14506)

**Why:** Recent alternative to MST/hierarchical clustering: a stochastic-blockmodel view of the correlation matrix that yields a small representative basket — a structural taxonomy aimed explicitly at diversification, complementing the network filtering papers already gathered.

> We aim to cluster financial assets in order to identify a small set of stocks to approximate the level of diversification of the whole universe of stocks. We develop a data-driven approach to clustering based on a correlation blockmodel in which assets in the same cluster have the same correlations with all other assets. We devise an algorithm (Census) to detect the clusters, with a theoretical analysis and a practical guidance. Finally, we conduct an empirical analysis to attest the performance of the algorithm.

**Snowball:** Tumminello, Lillo, Mantegna, Correlation, hierarchies, and networks in financial markets (2010) (10.1016/j.jebo.2010.01.004); Tola, Lillo, Gallegati, Mantegna, Cluster analysis for portfolio optimization (2008) (10.1016/j.jedc.2007.01.034); Abbe, Community detection and stochastic block models (2017) (1703.10146)

---

#### Schur Complementary Allocation: A Unification of Hierarchical Risk Parity and Minimum Variance Portfolios
*Peter Cotton* — 2024 · arXiv preprint · cites: 3 · OA · completeness-add

arXiv `2411.05807` · [link](https://arxiv.org/abs/2411.05807)

**Why:** Recent (2024) theoretical link showing the clustering-based HRP method (already gathered as Lopez de Prado 2016) is a Schur-complement approximation to minimum variance — important for understanding why structural clustering of the correlation matrix works for allocation.

> We reveal a hidden connection between two seemingly disparate portfolio construction approaches: Hierarchical Risk Parity (HRP), which uses clustering of the correlation matrix, and classical minimum-variance (Markowitz) optimization. Using a Schur complement decomposition of the covariance matrix, we show that HRP's recursive bisection can be viewed as an approximation to minimum-variance allocation, and we introduce a family of Schur complementary allocation methods that interpolate between the two. This clarifies when and why clustering-based allocation matches or improves upon direct optimization.

**Snowball:** Lopez de Prado, Building diversified portfolios that outperform out of sample (HRP) (2016) (10.3905/jpm.2016.42.4.059); Raffinot, Hierarchical clustering-based asset allocation (2017) (10.3905/jpm.2018.44.2.089); Markowitz, Portfolio selection (1952) (10.2307/2975974)

---

#### Understanding stock market instability via graph auto-encoders
*Dragos Gorduza, Xiaowen Dong, Stefan Zohren* — 2022 · arXiv preprint (NeurIPS 2022 Workshop on ML for Economic Policy) · cites: 12 · OA · completeness-add

arXiv `2212.04974` · [link](https://arxiv.org/abs/2212.04974)

**Why:** Recent representation-learning take on market structure: encodes the correlation network with a GNN and uses reconstruction error as a regime/instability signal — a modern, feature-learning counterpart to RMT and filtered-graph structure detection relevant to phenotyping market states.

> Understanding stock market instability is a key question in financial management as practitioners seek to forecast breakdowns in asset co-movements which expose portfolios to rapid and devastating collapses in value. We use graph auto-encoders (GAE) to learn low-dimensional embeddings of the correlation network of equities and show that the reconstruction error of the auto-encoder is a leading indicator of market instability: higher reconstruction-error values correlate with higher subsequent volatility. The approach provides a representation-learning alternative to spectral and filtered-graph methods for monitoring the changing structure of the market.

**Snowball:** Kipf & Welling, Variational graph auto-encoders (2016) (1611.07308); Onnela et al., Dynamic asset trees and portfolio analysis (2003) (cond-mat/0302546); Musmeci, Aste, Di Matteo, Relation between financial market structure and the real economy (2015) (10.1371/journal.pone.0116201)

---

#### When market boundaries weaken: Network reconfiguration and regime-dependent cross-asset spillovers
*Ruixue Jing, Luis Enrique Correa Rocha* — 2026 · arXiv preprint · cites: 0 · OA · completeness-add

arXiv `2605.30442` · [link](https://arxiv.org/abs/2605.30442)

**Why:** Recent (2026) study directly on cross-MARKET / cross-asset-class structure and how clusters (crypto vs FX vs equities) merge under stress — squarely on the market-phenotyping and cross-market-transfer theme, showing structural groupings are regime-dependent. Metadata provisional (single-source).

> We study the integration of cryptocurrencies, fiat currencies, and S&P 500 equities across 381 assets over October 2017 to February 2024. Using rolling correlation networks and VAR-based connectedness (spillover) analysis, we show that cross-asset integration is episodic: markets remain segmented into distinct asset-class clusters during calm periods but the boundaries between clusters weaken and coupling increases sharply under stress. We characterise how the network reconfigures across regimes and which assets bridge clusters, providing a structural account of regime-dependent cross-market transmission.

**Snowball:** Diebold & Yilmaz, Better to give than to receive: forecast-based measurement of volatility spillovers (2012) (10.1016/j.ijforecast.2011.02.006); Sandoval & Franca, Correlation of financial markets in times of crisis (2012) (1102.1339); Coelho et al., Evolution of interdependence in world equity markets (2007) (10.1016/j.physa.2006.10.045)

---

#### Asset-asset interactions and clustering in financial markets
*Gabriele Cuniberti, Markus Porto, H. Eduardo Roman* — 2001 · Physica A: Statistical Mechanics and its Applications · cites: 40 · OA · completeness-add

DOI `10.1016/S0378-4371(01)00304-1` · arXiv `cond-mat/0109026` · [link](https://arxiv.org/abs/cond-mat/0109026)

**Why:** Early physics-based asset-clustering approach (interaction-potential / connectivity rather than MST), one of the alternative structural-feature clustering methods that pre-date and complement the Mantegna-tree program; useful for breadth on how groupings emerge.

> We study the cross-correlations of stock price changes in the New York Stock Exchange by drawing an analogy with an interacting particle system. We define an effective asset-asset interaction potential from the empirical correlation matrix and perform a connectivity analysis of the resulting cluster structure. The method identifies groups of strongly interacting stocks that broadly correspond to economic sectors, offering a physics-based clustering of assets alternative to the minimum spanning tree.

**Snowball:** Mantegna, Hierarchical structure in financial markets (1999) (cond-mat/9802256); Plerou et al., Universal and nonuniversal properties of cross correlations (1999) (cond-mat/9902283); Marsili, Dissecting financial markets: sectors and states (2002) (cond-mat/0207156)

---

