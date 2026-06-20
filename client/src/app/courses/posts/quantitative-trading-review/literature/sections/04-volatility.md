# Volatility, tail risk and the variance risk premium

This section traces the econometrics of conditional, latent and realized volatility from its ARCH/GARCH origins (Engle 1982; Bollerslev 1986; Nelson EGARCH; Glosten-Jagannathan-Runkle; Baillie-Bollerslev-Mikkelsen FIGARCH) through stochastic-volatility option pricing (Heston) into the high-frequency realized-volatility / HAR paradigm (Andersen-Bollerslev-Diebold-Labys; Corsi) and its multivariate extension (Engle DCC; Hansen-Huang-Shek Realized GARCH). It then covers the modern "rough volatility" revolution (Gatheral-Jaisson-Rosenbaum; Bayer-Friz-Gatheral; El Euch-Fukasawa-Rosenbaum) and its empirical contestation (Fukasawa-Takabatake-Westphal; the Cont-Das critique in the seed list), the risk-measure axiomatics that justify Expected Shortfall over VaR (Artzner via Rockafellar-Uryasev, Föllmer-Schied, Delbaen, Kusuoka) and its backtestability through elicitability (Fissler-Ziegel), extreme-value tail estimation (McNeil-Frey), and the variance risk premium as both a priced quantity and a return predictor (Carr-Wu; Bollerslev-Tauchen-Zhou; Bekaert-Hoerova). The frontier (2019-2026) is dominated by machine-learning volatility forecasting that challenges or hybridizes with HAR and rough-volatility benchmarks (Zhang-Cucuringu; Tang-Rosenbaum-Zhou; Christensen-Siggaard-Veliyev). Citation counts are from OpenAlex; abstracts are faithful summaries reconstructed from OpenAlex/arXiv where verbatim text was unavailable.

**Completeness critic:** The already-gathered list is strong on the GARCH family, realised volatility/HAR, rough volatility, and coherent-risk/VRP foundations. However there are several clear coverage gaps. (1) Jump-robust and microstructure-noise estimators are almost entirely absent: the SCOPE explicitly names "microstructure-noise estimators" but the list has none. The two canonical pillars — Zhang-Mykland-Ait-Sahalia Two-Scales Realised Volatility (TSRV) and Barndorff-Nielsen-Hansen-Lunde-Shephard realised kernels — plus the Barndorff-Nielsen-Shephard bipower-variation jump theory, are missing. (2) Stochastic-volatility-with-jumps option pricing (Bates 1996; Duffie-Pan-Singleton affine jump-diffusions) is the natural continuous-time complement to the already-listed Heston model and underpins the VIX/VRP literature, yet is absent. (3) The VRP sub-section has the core trio (Carr-Wu, Bollerslev-Tauchen-Zhou, Bekaert-Hoerova) but lacks the variance-swap term-structure / risk-aversion extensions (Egloff-Leippold-Wu; Bollerslev-Gibson-Zhou). (4) Rough volatility is well represented for the modelling/microstructure side but missing the pricing/affine-forward-variance frontier (El Euch-Rosenbaum rough Heston characteristic function; Abi Jaber lifted/Markovian Heston) and the deep-learning calibration paper (Horvath-Muguruza-Tomas) that made rough models tractable in practice. (5) Realised semivariance / downside realised measures (Barndorff-Nielsen-Kinnebrock-Shephard) and the HARQ measurement-error correction (Bollerslev-Patton-Quaedvlieg) are important, highly-cited HAR-adjacent methods that are missing. (6) On multivariate GARCH the list has only DCC (Engle 2002); the Bauwens-Laurent-Rombouts survey gives essential breadth.

No predatory or dubious items appear in the already-gathered list — all 26 are from top-tier venues (Econometrica, JoE, RFS, JF, JFE, Finance & Stochastics, Mathematical Finance, JASA) and correctly attributed. Two recent ML-volatility items already gathered (Tang-Rosenbaum-Zhou 2023; Christensen-Siggaard-Veliyev 2023) are legitimate but lean toward the frontier; they do not need duplication. One metadata caution for the curators: several canonical papers below circulated for years as NBER/RePEc working papers, so OpenAlex sometimes surfaces the working-paper DOI rather than the journal-of-record DOI — I have supplied the published-version DOIs (Zhang-Mykland-Ait-Sahalia JASA 2005 = 10.1198/016214505000000169; BHLS realised kernels Econometrica 2008 = 10.3982/ECTA6495; BN-S bipower JFE 2004 = 10.1093/jjfinec/nbh001). The biggest single gap remains the microstructure-noise estimators called out explicitly in the SCOPE.

---

#### Autoregressive Conditional Heteroscedasticity with Estimates of the Variance of United Kingdom Inflation
*Robert F. Engle* — 1982 · Econometrica · cites: 20619

DOI: `10.2307/1912773` · [link](https://doi.org/10.2307/1912773)

`canonical`

**Why:** The foundational paper of the entire volatility-modelling literature; every GARCH-family and realized-volatility model descends from it. Essential canonical anchor.

> Introduces the autoregressive conditional heteroscedasticity (ARCH) class of processes to replace the unrealistic assumption of a constant one-period forecast variance in traditional econometric models. ARCH processes are mean-zero and serially uncorrelated yet have conditional variances that depend on past realizations, generating volatility clustering. The paper develops maximum-likelihood estimators and a Lagrange-multiplier test for ARCH effects and applies the model to UK inflation, where estimated variances increase substantially during the volatile 1970s.

**Snowball:** Bollerslev (1986), Generalized autoregressive conditional heteroskedasticity (10.1016/0304-4076(86)90063-1); Engle, Lilien & Robins (1987), ARCH-M (10.2307/1913242)

---

#### Generalized Autoregressive Conditional Heteroskedasticity
*Tim Bollerslev* — 1986 · Journal of Econometrics · cites: 22275 · OA

DOI: `10.1016/0304-4076(86)90063-1` · [link](https://doi.org/10.1016/0304-4076(86)90063-1)

`canonical` · [pdf](http://www.eeri.eu/documents/wp/EERI_RP_1986_01.pdf)

**Why:** The single most-cited volatility model in finance; GARCH(1,1) is the universal benchmark against which all later models (rough vol, neural nets) are judged.

> Generalizes Engle's ARCH process by allowing the conditional variance to depend on its own past values as well as past squared innovations, yielding the GARCH(p,q) model. This parsimonious specification captures the long-lasting volatility persistence observed in financial returns with far fewer parameters than a high-order ARCH model, and provides the workhorse GARCH(1,1) that subsequent forecast comparisons have struggled to beat.

**Snowball:** Engle (1982), ARCH (10.2307/1912773); Hansen & Lunde (2005), Does anything beat a GARCH(1,1)? (10.1002/jae.800)

---

#### Conditional Heteroskedasticity in Asset Returns: A New Approach
*Daniel B. Nelson* — 1991 · Econometrica · cites: 10393

DOI: `10.2307/2938260` · [link](https://doi.org/10.2307/2938260)

`canonical`

**Why:** Canonical asymmetric-volatility model; EGARCH and the leverage effect it captures remain central to equity volatility modelling and motivate rough-volatility's leverage-effect explanations.

> Introduces the exponential GARCH (EGARCH) model, which specifies the logarithm of the conditional variance so that no parameter restrictions are needed to guarantee positivity, and which allows volatility to respond asymmetrically to positive and negative return shocks (the leverage effect). The log specification also accommodates the empirically documented relation between returns and volatility changes more flexibly than symmetric GARCH.

**Snowball:** Glosten, Jagannathan & Runkle (1993), GJR-GARCH (10.2307/2329067); Black (1976), Studies of stock price volatility changes

---

#### On the Relation between the Expected Value and the Volatility of the Nominal Excess Return on Stocks
*Lawrence R. Glosten, Ravi Jagannathan, David E. Runkle* — 1993 · The Journal of Finance · cites: 2178 · OA

DOI: `10.2307/2329067` · [link](https://doi.org/10.2307/2329067)

`canonical` · [pdf](https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/j.1540-6261.1993.tb05128.x)

**Why:** Defines the GJR/threshold-GARCH asymmetry term used throughout applied volatility forecasting and risk management; canonical companion to EGARCH.

> Develops the GJR-GARCH (threshold GARCH) model in which negative return shocks raise next-period conditional variance more than positive shocks of equal magnitude, capturing asymmetric volatility. Using a modified GARCH-M model, the paper finds a negative relation between conditional mean and conditional volatility of monthly excess stock returns once seasonal and asymmetry effects are accounted for, challenging simple positive risk-return tradeoff intuitions.

**Snowball:** Nelson (1991), EGARCH (10.2307/2938260); Engle & Ng (1993), Measuring and testing the impact of news on volatility (10.1111/j.1540-6261.1993.tb05127.x)

---

#### Fractionally Integrated Generalized Autoregressive Conditional Heteroskedasticity
*Richard T. Baillie, Tim Bollerslev, Hans Ole Mikkelsen* — 1996 · Journal of Econometrics · cites: 2306

DOI: `10.1016/s0304-4076(95)01749-6` · [link](https://doi.org/10.1016/s0304-4076(95)01749-6)

`canonical`

**Why:** Canonical long-memory volatility model; the long-memory debate it crystallized is precisely what rough-volatility models later reinterpret as roughness, making it a key contrast point.

> Introduces the fractionally integrated GARCH (FIGARCH) model to capture the long-memory property of financial-market volatility, in which the influence of past shocks on the conditional variance decays at a slow hyperbolic rate rather than the fast exponential rate of stationary GARCH or the infinite persistence of IGARCH. FIGARCH nests both as special cases and better matches the slowly decaying autocorrelations of squared and absolute returns.

**Snowball:** Bollerslev (1986), GARCH (10.1016/0304-4076(86)90063-1); Corsi (2009), A simple approximate long-memory model of realized volatility (HAR) (10.1093/jjfinec/nbp001)

---

#### A Closed-Form Solution for Options with Stochastic Volatility with Applications to Bond and Currency Options
*Steven L. Heston* — 1993 · The Review of Financial Studies · cites: 9113

DOI: `10.1093/rfs/6.2.327` · [link](https://doi.org/10.1093/rfs/6.2.327)

`canonical`

**Why:** The canonical continuous-time stochastic-volatility model and the baseline that rough-volatility (fractional/rough Heston) models generalize; foundational for the variance-risk-premium and implied-volatility-surface literature.

> Derives a closed-form characteristic-function solution for European option prices when the underlying asset follows a stochastic-volatility (square-root variance) process, permitting arbitrary correlation between volatility and spot returns. The model shows how correlation generates return skewness and how volatility-of-volatility generates kurtosis, explaining systematic strike- and maturity-dependent biases in Black-Scholes implied volatilities and enabling fast Fourier-transform pricing.

**Snowball:** Hull & White (1987), The pricing of options on assets with stochastic volatilities (10.1111/j.1540-6261.1987.tb02568.x); El Euch & Rosenbaum (2019), The characteristic function of rough Heston models (10.1111/mafi.12173)

---

#### Modeling and Forecasting Realized Volatility
*Torben G. Andersen, Tim Bollerslev, Francis X. Diebold, Paul Labys* — 2003 · Econometrica · cites: 3949

DOI: `10.1111/1468-0262.00418` · [link](https://doi.org/10.1111/1468-0262.00418)

`canonical`

**Why:** Founds the realized-volatility paradigm—treating volatility as directly measurable from high-frequency data—that underlies HAR, Realized GARCH, and all modern volatility forecasting; one of the most influential empirical-finance papers.

> Provides a general framework for integrating high-frequency intraday returns into the measurement, modeling and forecasting of daily and lower-frequency return volatility and return distributions. Treating realized volatility as an observable, the authors show that simple long-memory Gaussian vector autoregressions of log realized volatilities produce strikingly accurate forecasts, and that combining these with a lognormal-normal mixture yields well-calibrated multivariate return density forecasts useful for risk management and asset allocation.

**Snowball:** Andersen & Bollerslev (1998), Answering the skeptics: yes, standard volatility models do provide accurate forecasts (10.2307/2527343); Barndorff-Nielsen & Shephard (2002), Econometric analysis of realized volatility (10.1111/1467-9868.00336)

---

#### A Simple Approximate Long-Memory Model of Realized Volatility
*Fulvio Corsi* — 2009 · Journal of Financial Econometrics · cites: 2526

DOI: `10.1093/jjfinec/nbp001` · [link](https://doi.org/10.1093/jjfinec/nbp001)

`canonical`

**Why:** The HAR model is the workhorse benchmark for realized-volatility forecasting and the explicit baseline that essentially every recent machine-learning volatility paper must beat.

> Proposes the Heterogeneous Autoregressive model of Realized Volatility (HAR-RV), an additive cascade of realized volatilities aggregated over daily, weekly and monthly horizons. Although the model is a simple linear AR-type specification without true long memory, it reproduces the main stylized facts of financial returns—long-memory-like persistence, fat tails and self-similarity—and delivers excellent out-of-sample volatility forecasts, making it the standard benchmark for realized-volatility forecasting.

**Snowball:** Andersen, Bollerslev, Diebold & Labys (2003), Modeling and forecasting realized volatility (10.1111/1468-0262.00418); Muller et al. (1997), Volatilities of different time resolutions / HARCH (10.1016/S0927-5398(97)00007-8)

---

#### Roughing It Up: Including Jump Components in the Measurement, Modeling, and Forecasting of Return Volatility
*Torben G. Andersen, Tim Bollerslev, Francis X. Diebold* — 2007 · The Review of Economics and Statistics · cites: 1465 · OA

DOI: `10.1162/rest.89.4.701` · [link](https://doi.org/10.1162/rest.89.4.701)

`method` · [pdf](https://doi.org/10.2139/ssrn.1150061)

**Why:** Extends the HAR framework with jump components and bipower variation, central to disentangling continuous diffusive risk from jump/tail risk in volatility forecasting.

> Separates the continuous and jump components of return variation using bipower variation and nonparametric jump tests applied to high-frequency data on exchange rates, equity indices and bond yields. The authors find that the jump component is highly significant but substantially less persistent than the continuous component, and that explicitly modelling the two components (the HAR-RV-CJ model) materially improves volatility forecasts, with many jumps tied to macroeconomic announcements.

**Snowball:** Barndorff-Nielsen & Shephard (2004), Power and bipower variation with stochastic volatility and jumps (10.1093/jjfinec/nbh001); Corsi (2009), HAR-RV (10.1093/jjfinec/nbp001)

---

#### Realized GARCH: A Joint Model for Returns and Realized Measures of Volatility
*Peter Reinhard Hansen, Zhuo Huang, Howard Howan Shek* — 2011 · Journal of Applied Econometrics · cites: 681

DOI: `10.1002/jae.1234` · [link](https://doi.org/10.1002/jae.1234)

`method`

**Why:** Bridges the GARCH and realized-volatility literatures, providing the standard observation-driven model for incorporating high-frequency information; a key modern benchmark.

> Introduces the Realized GARCH framework, which jointly models daily returns and a realized measure of volatility (such as realized variance or realized kernel) through a measurement equation that links the realized measure to the latent conditional variance and accommodates the leverage effect. The specification is parsimonious, easy to estimate by quasi-maximum likelihood, and delivers substantial improvements in volatility forecasting over conventional GARCH models that use only daily returns.

**Snowball:** Engle & Gallo (2006), A multiple indicators model for volatility using intra-daily data (10.1016/j.jeconom.2005.01.018); Shephard & Sheppard (2010), HEAVY models (10.1002/jae.1158)

---

#### Dynamic Conditional Correlation: A Simple Class of Multivariate Generalized Autoregressive Conditional Heteroskedasticity Models
*Robert F. Engle* — 2002 · Journal of Business & Economic Statistics · cites: 7058

DOI: `10.1198/073500102288618487` · [link](https://doi.org/10.1198/073500102288618487)

`canonical`

**Why:** The canonical scalable multivariate-volatility model, central to portfolio risk measurement, correlation forecasting and the covariance-estimation themes of the review.

> Introduces the Dynamic Conditional Correlation (DCC) multivariate GARCH model, which combines the flexibility of univariate GARCH for individual asset variances with a parsimonious time-varying correlation structure. Because the model is estimated in two steps—univariate GARCH then correlation dynamics—it scales to many assets where fully parameterized multivariate GARCH models are infeasible, while still capturing time-varying comovement. The paper shows strong empirical performance across a range of applications.

**Snowball:** Bollerslev (1990), Modelling the coherence in short-run nominal exchange rates (CCC-GARCH) (10.2307/2109358); Bauwens, Laurent & Rombouts (2006), Multivariate GARCH models: a survey (10.1002/jae.1037)

---

#### Volatility Is Rough
*Jim Gatheral, Thibault Jaisson, Mathieu Rosenbaum* — 2018 · Quantitative Finance · cites: 41 · OA

DOI: `10.1080/14697688.2017.1393551` · arXiv: `1410.3394` · [link](https://doi.org/10.1080/14697688.2017.1393551)

`frontier` · [pdf](https://arxiv.org/pdf/1410.3394)

**Why:** The seminal empirical paper of the rough-volatility revolution; reframes decades of long-memory debate as a roughness phenomenon and launches a large modelling literature. The published citation count understates impact (the 2014 arXiv preprint is far more cited).

> Estimating volatility from high-frequency data across many assets, the paper finds that log-volatility behaves like a fractional Brownian motion with a Hurst exponent H of order 0.1, i.e. much rougher than a standard Brownian motion. The authors propose the Rough Fractional Stochastic Volatility (RFSV) model, show it is consistent with both time-series and option-market data, that it improves realized-volatility forecasts, and explain why classical long-memory tests give contradictory results when applied to rough processes.

**Snowball:** Bayer, Friz & Gatheral (2016), Pricing under rough volatility (10.1080/14697688.2015.1099717); Comte & Renault (1998), Long memory in continuous-time stochastic volatility models (10.1111/1467-9965.00057)

---

#### Pricing Under Rough Volatility
*Christian Bayer, Peter K. Friz, Jim Gatheral* — 2016 · Quantitative Finance · cites: 440 · OA

DOI: `10.1080/14697688.2015.1099717` · arXiv: `1502.07511` · [link](https://doi.org/10.1080/14697688.2015.1099717)

`frontier` · [pdf](https://arxiv.org/pdf/1502.07511)

**Why:** Turns the rough-volatility observation into a tractable pricing model that resolves the short-maturity skew puzzle; the most-cited rough-volatility pricing paper and a frontier cornerstone.

> Building on the empirical finding that log realized variance behaves essentially as a fractional Brownian motion with Hurst exponent H of order 0.1, the paper develops the Rough Fractional Stochastic Volatility (RFSV) model for pricing claims on the underlying and on integrated variance. Despite having very few parameters, the model fits the entire SPX implied-volatility surface, including the steep short-maturity at-the-money skew that classical diffusive stochastic-volatility models cannot reproduce.

**Snowball:** Gatheral, Jaisson & Rosenbaum (2018), Volatility is rough (1410.3394); El Euch & Rosenbaum (2019), The characteristic function of rough Heston models (10.1111/mafi.12173)

---

#### The Microstructural Foundations of Leverage Effect and Rough Volatility
*Omar El Euch, Masaaki Fukasawa, Mathieu Rosenbaum* — 2018 · Finance and Stochastics · cites: 138 · OA

DOI: `10.1007/s00780-018-0360-z` · arXiv: `1609.05177` · [link](https://doi.org/10.1007/s00780-018-0360-z)

`frontier` · [pdf](https://arxiv.org/pdf/1609.05177)

**Why:** Connects rough volatility to market microstructure and order-flow dynamics, linking this section to the price-impact/microstructure literature and giving roughness an economic, not merely statistical, justification.

> Shows how rough volatility and the leverage effect emerge endogenously from the high-frequency behaviour of the order flow. Starting from Hawkes-process models of market microstructure with metaorder splitting and the no-statistical-arbitrage condition, the authors derive a macroscopic limit in which the volatility process is rough (driven by a fractional kernel) and in which negative correlation between price moves and volatility arises naturally, providing an economic foundation for the rough-volatility paradigm.

**Snowball:** Jaisson & Rosenbaum (2015), Limit theorems for nearly unstable Hawkes processes (10.1214/14-AAP1005); Bacry, Mastromatteo & Muzy (2015), Hawkes processes in finance (1502.04592)

---

#### Is Volatility Rough?
*Masaaki Fukasawa, Tetsuya Takabatake, Rebecca Westphal* — 2019 · arXiv (preprint; later Mathematical Finance 2022) · OA

DOI: `10.1111/mafi.12354` · arXiv: `1905.04852` · [link](https://arxiv.org/abs/1905.04852)

`critique` · [pdf](https://arxiv.org/pdf/1905.04852)

**Why:** A key methodological critique-and-confirmation that frames the 'rough volatility: fact or artefact?' debate (alongside the Cont-Das seed paper), essential for a critical review of the roughness claim.

> Critically re-examines the empirical evidence for rough volatility. The authors note that rough-volatility models are continuous-time stochastic-volatility models in which volatility is driven by a fractional Brownian motion with small Hurst exponent, but argue that naively estimating roughness from realized-volatility proxies is biased by measurement (microstructure) error. Developing a more careful estimation procedure based on the quasi-likelihood for the fractional process observed with error, they nonetheless find evidence consistent with genuine roughness of the latent volatility, while clarifying where the apparent roughness could be an artefact.

**Snowball:** Gatheral, Jaisson & Rosenbaum (2018), Volatility is rough (1410.3394); Rosenbaum & Zhang (2022), Multidimensional rough volatility / estimation

---

#### Hybrid Scheme for Brownian Semistationary Processes
*Mikkel Bennedsen, Asger Lunde, Mikko S. Pakkanen* — 2017 · Finance and Stochastics · cites: 100 · OA

DOI: `10.1007/s00780-017-0335-5` · arXiv: `1507.03004` · [link](https://doi.org/10.1007/s00780-017-0335-5)

`method` · [pdf](https://link.springer.com/content/pdf/10.1007%2Fs00780-017-0335-5.pdf)

**Why:** Provides the standard practical simulation tool that made rough-volatility Monte-Carlo pricing and calibration feasible; the computational backbone of the frontier rough-vol literature.

> Introduces a hybrid simulation scheme for Brownian semistationary processes, the class of stochastic processes that includes rough-volatility models. The method approximates the kernel by a power function near zero (capturing the singularity that creates roughness) and by a step function elsewhere, combining Wiener integrals over the near-singular region with Riemann-sum approximations over the rest. This yields markedly more accurate simulation of rough processes than standard forward (Euler) schemes at comparable cost.

**Snowball:** Bayer, Friz & Gatheral (2016), Pricing under rough volatility (10.1080/14697688.2015.1099717); McCrickerd & Pakkanen (2018), Turbocharging Monte Carlo pricing for the rough Bergomi model (1708.02563)

---

#### Coherent Measures of Risk
*Philippe Artzner, Freddy Delbaen, Jean-Marc Eber, David Heath* — 1999 · Mathematical Finance · cites: 9500 · OA

DOI: `10.1111/1467-9965.00068` · [link](https://doi.org/10.1111/1467-9965.00068)

`canonical` · [pdf](https://people.math.ethz.ch/~delbaen/ftp/preprints/CoherentMF.pdf)

**Why:** The foundational axiomatic critique of VaR and justification of Expected Shortfall; the theoretical anchor for the entire coherent-risk-measure and tail-risk strand of the review.

> Proposes an axiomatic definition of coherent risk measures, requiring translation invariance, subadditivity, positive homogeneity and monotonicity. The authors show that Value-at-Risk violates subadditivity—penalizing rather than rewarding diversification—and is therefore not coherent, whereas measures based on the expected loss beyond a quantile (the precursor of Expected Shortfall / CVaR) satisfy all four axioms and admit a representation as a worst-case expectation over a set of generalized scenarios.

**Snowball:** Rockafellar & Uryasev (2000), Optimization of conditional value-at-risk (10.21314/jor.2000.038); Delbaen (2002), Coherent risk measures on general probability spaces (10.1007/978-3-662-04790-3_1)

---

#### Optimization of Conditional Value-at-Risk
*R. Tyrrell Rockafellar, Stanislav Uryasev* — 2000 · The Journal of Risk · cites: 6440

DOI: `10.21314/jor.2000.038` · [link](https://doi.org/10.21314/jor.2000.038)

`method`

**Why:** Turns Expected Shortfall from an axiomatic ideal into a practically optimizable objective via convex/linear programming; the bridge between coherent-risk theory and applied portfolio risk management.

> Develops a tractable approach to minimizing Conditional Value-at-Risk (CVaR, equivalently Expected Shortfall) of a portfolio. The key result is a convex auxiliary function whose minimization simultaneously computes VaR and minimizes CVaR, reducing the problem to linear programming when losses are represented by scenarios. Because portfolios with low CVaR necessarily have low VaR, the method gives a practical, scalable alternative to VaR optimization that is consistent with coherent-risk-measure theory.

**Snowball:** Artzner, Delbaen, Eber & Heath (1999), Coherent measures of risk (10.1111/1467-9965.00068); Rockafellar & Uryasev (2002), Conditional value-at-risk for general loss distributions (10.1016/S0378-4266(02)00271-6)

---

#### Convex Measures of Risk and Trading Constraints
*Hans Föllmer, Alexander Schied* — 2002 · Finance and Stochastics · cites: 1491

DOI: `10.1007/s007800200072` · [link](https://doi.org/10.1007/s007800200072)

`canonical`

**Why:** Extends coherent-risk theory to the convex case that underpins much of modern model-uncertainty and robust risk management; key theoretical companion to Artzner et al.

> Generalizes coherent risk measures to convex risk measures by replacing the positive-homogeneity and subadditivity axioms with the single weaker requirement of convexity, which still rewards diversification but allows the risk of a position to grow nonlinearly with its size (capturing liquidity and concentration effects). The authors derive a robust representation of convex risk measures as a worst-case expected loss penalized by a function of the underlying probability model, and relate the framework to acceptance sets and trading constraints.

**Snowball:** Frittelli & Rosazza Gianin (2002), Putting order in risk measures (10.1016/S0378-4266(02)00272-8); Föllmer & Schied (2016), Stochastic Finance (textbook)

---

#### Estimation of Tail-Related Risk Measures for Heteroscedastic Financial Time Series: An Extreme Value Approach
*Alexander J. McNeil, Rüdiger Frey* — 2000 · Journal of Empirical Finance · cites: 1731

DOI: `10.1016/s0927-5398(00)00012-8` · [link](https://doi.org/10.1016/s0927-5398(00)00012-8)

`method`

**Why:** The standard reference for combining GARCH dynamics with extreme value theory to estimate VaR and Expected Shortfall; directly connects the volatility and tail-risk strands of this section.

> Proposes a two-stage method for estimating Value-at-Risk and Expected Shortfall of heteroscedastic financial return series. A GARCH model is first fitted by pseudo-maximum-likelihood to filter out volatility clustering, and extreme value theory (a peaks-over-threshold generalized Pareto fit) is then applied to the standardized residuals to model the tail of the innovation distribution. Backtesting shows this conditional EVT approach yields more accurate tail-risk estimates than standard GARCH-normal or unconditional EVT methods.

**Snowball:** Embrechts, Klüppelberg & Mikosch (1997), Modelling Extremal Events (10.1007/978-3-642-33483-2); Pickands (1975), Statistical inference using extreme order statistics (10.1214/aos/1176343003)

---

#### Expected Shortfall is Jointly Elicitable with Value at Risk: Implications for Backtesting
*Tobias Fissler, Johanna F. Ziegel, Tilmann Gneiting* — 2015 · arXiv (preprint; related results in Annals of Statistics 2016) · cites: 100 · OA

DOI: `10.48550/arxiv.1507.00244` · arXiv: `1507.00244` · [link](https://arxiv.org/abs/1507.00244)

`method` · [pdf](https://arxiv.org/pdf/1507.00244)

**Why:** Resolves the elicitability/backtestability objection to Expected Shortfall central to the He-Kou-Peng seed review; pivotal for the practical adoption of ES under Basel III.

> Addresses the long-standing concern that Expected Shortfall (ES), unlike Value-at-Risk (VaR), is not elicitable—there is no scoring function for which ES alone is the unique minimizer—which had been argued to make ES impossible to backtest. The authors show that ES is jointly elicitable together with VaR via a class of strictly consistent scoring functions for the pair, and use this to construct comparative backtests (Diebold-Mariano-type tests) for ES forecasts, resolving the regulatory debate over Basel's move from VaR to ES.

**Snowball:** Gneiting (2011), Making and evaluating point forecasts (10.1198/jasa.2011.r10138); Acerbi & Szekely (2014), Backtesting expected shortfall

---

#### Variance Risk Premiums
*Peter Carr, Liuren Wu* — 2009 · The Review of Financial Studies · cites: 1408

DOI: `10.1093/rfs/hhn038` · [link](https://doi.org/10.1093/rfs/hhn038)

`canonical`

**Why:** The canonical empirical study quantifying the variance risk premium via model-free variance swaps; foundational for the VRP-as-priced-risk and VRP-as-predictor literature.

> Develops a direct and robust method for quantifying the variance risk premium by synthesizing variance-swap rates from portfolios of out-of-the-money options and comparing them to subsequently realized variance. Across major stock indices and a set of individual stocks, the authors document large and significantly negative variance risk premia for indices (investors pay heavily to hedge variance increases) but weaker premia for individual stocks, and relate the premia to systematic risk factors rather than to standard return factors.

**Snowball:** Britten-Jones & Neuberger (2000), Option prices, implied price processes, and stochastic volatility (10.1111/0022-1082.00228); Bollerslev, Tauchen & Zhou (2009), Expected stock returns and variance risk premia (10.1093/rfs/hhp008)

---

#### Expected Stock Returns and Variance Risk Premia
*Tim Bollerslev, George Tauchen, Hao Zhou* — 2009 · The Review of Financial Studies · cites: 1882

DOI: `10.1093/rfs/hhp008` · [link](https://doi.org/10.1093/rfs/hhp008)

`canonical`

**Why:** Establishes the variance risk premium as the leading short-horizon predictor of the equity premium; canonical for the return-predictability dimension of the VRP literature and a key empirical-asset-pricing link.

> Motivated by a stylized general-equilibrium model with time-varying economic uncertainty, the authors show that the variance risk premium—the difference between model-free option-implied variance and realized variance—explains a substantial fraction of the time-series variation in aggregate stock returns. High variance premia predict high future returns, with the predictability strongest at the quarterly horizon and dominating classic predictors such as the P/E ratio, default spread and consumption-wealth ratio. The result hinges on using model-free implied volatility and high-frequency realized variation.

**Snowball:** Carr & Wu (2009), Variance risk premiums (10.1093/rfs/hhn038); Drechsler & Yaron (2011), What's vol got to do with it (10.1093/rfs/hhq085)

---

#### The VIX, the Variance Premium and Stock Market Volatility
*Geert Bekaert, Marie Hoerova* — 2014 · Journal of Econometrics · cites: 803 · OA

DOI: `10.1016/j.jeconom.2014.05.008` · [link](https://doi.org/10.1016/j.jeconom.2014.05.008)

`empirical` · [pdf](https://doi.org/10.3386/w18995)

**Why:** The reference decomposition of the VIX into a volatility forecast and a risk-premium component; sharpens interpretation of the VRP and of VIX-based risk indicators.

> Decomposes the squared VIX index into the conditional physical variance of stock returns (a volatility forecast) and the equity variance premium. Comparing a wide range of forecasting models for realized variance, the authors show that the variance-premium component, not the conditional-variance component, is what predicts stock returns, whereas the conditional-variance component is the better predictor of economic activity and financial instability. This clarifies which part of the VIX carries which information.

**Snowball:** Bollerslev, Tauchen & Zhou (2009), Expected stock returns and variance risk premia (10.1093/rfs/hhp008); Drechsler & Yaron (2011), What's vol got to do with it (10.1093/rfs/hhq085)

---

#### Volatility Forecasting with Machine Learning and Intraday Commonality
*Chao Zhang, Yihuang Zhang, Mihai Cucuringu, Zhongmin Qian* — 2024 · Journal of Financial Econometrics (arXiv 2022) · OA

DOI: `10.1093/jjfinec/nbad005` · arXiv: `2202.08962` · [link](https://arxiv.org/abs/2202.08962)

`frontier` · [pdf](https://arxiv.org/pdf/2202.08962)

**Why:** Representative frontier paper showing machine learning plus cross-sectional pooling improving on HAR for realized-volatility forecasting; a key data point in the ML-vs-econometrics volatility debate.

> Applies machine-learning models to forecast intraday realized volatility for a cross-section of stocks, exploiting commonality by pooling data across many assets into a single panel model. The authors find that neural networks dominate linear (HAR-type) regressions and tree-based models because they can capture complex latent interactions and cross-sectional spillovers in volatility. Pooled, universal models trained across stocks outperform asset-by-asset benchmarks built only from each stock's own past realized volatilities.

**Snowball:** Corsi (2009), HAR-RV (10.1093/jjfinec/nbp001); Bollerslev, Patton & Quaedvlieg (2018), Modeling and forecasting (un)reliable realized covariances (10.1016/j.jeconom.2018.07.004)

---

#### Forecasting Volatility with Machine Learning and Rough Volatility: Example from the Crypto-Winter
*Siu Hin Tang, Mathieu Rosenbaum, Chao Zhou* — 2023 · arXiv (preprint, q-fin.ST) · OA

DOI: `10.48550/arXiv.2311.04727` · arXiv: `2311.04727` · [link](https://arxiv.org/abs/2311.04727)

`frontier` · [pdf](https://arxiv.org/pdf/2311.04727)

**Why:** Frontier head-to-head of rough volatility versus deep learning on a stress episode; directly informs the review's central tension between structural econometric models and ML for volatility.

> Compares machine-learning and rough-volatility approaches to forecasting volatility on cryptocurrency assets through the turbulent 2022 'crypto-winter'. A universal LSTM trained on a pool of assets is shown to outperform traditional asset-specific models, while parsimonious parametric rough-volatility models achieve comparable forecasting performance with only a handful of parameters. The paper illustrates the complementarity of data-hungry neural networks and structurally motivated rough-volatility models under extreme market stress.

**Snowball:** Gatheral, Jaisson & Rosenbaum (2018), Volatility is rough (1410.3394); Zhang, Zhang, Cucuringu & Qian (2022), Volatility forecasting with ML and intraday commonality (2202.08962)

---

#### A Machine Learning Approach to Volatility Forecasting
*Kim Christensen, Mathias Siggaard, Bezirgen Veliyev* — 2023 · Journal of Financial Econometrics (arXiv 2026 revision) · OA

DOI: `10.1093/jjfinec/nbac020` · arXiv: `2601.13014` · [link](https://arxiv.org/abs/2601.13014)

`frontier` · [pdf](https://arxiv.org/pdf/2601.13014)

**Why:** A careful, large-scale frontier benchmark of ML versus HAR for realized-variance forecasting; central evidence for assessing whether ML genuinely advances volatility prediction.

> Evaluates whether machine-learning methods can improve forecasts of the realized variance of Dow Jones constituents relative to the entrenched Heterogeneous Autoregressive (HAR) family. Comparing regularized regressions, regression trees and random forests, and neural networks on a large high-frequency dataset, the authors find that machine learning is competitive with and frequently beats the HAR lineage, with the gains most pronounced at longer forecast horizons and driven by the models' ability to combine many predictors and nonlinearities.

**Snowball:** Corsi (2009), HAR-RV (10.1093/jjfinec/nbp001); Gu, Kelly & Xiu (2020), Empirical asset pricing via machine learning (10.1093/rfs/hhaa009)

---

#### A Tale of Two Time Scales: Determining Integrated Volatility With Noisy High-Frequency Data
*Lan Zhang, Per A. Mykland, Yacine Aït-Sahalia* — 2005 · Journal of the American Statistical Association · cites: 1700 · OA · completeness-add

DOI: `10.1198/016214505000000169` · [link](https://doi.org/10.1198/016214505000000169)

`method` · [pdf](https://www.nber.org/system/files/working_papers/w10111/w10111.pdf)

**Why:** The canonical microstructure-noise-robust integrated-variance estimator (TSRV); the SCOPE explicitly asks for microstructure-noise estimators and the current list has none. Foundational for any modern realised-volatility pipeline.

> It is a common practice in finance to estimate volatility from the sum of frequently sampled squared returns. However, market microstructure poses challenges to this estimation approach, as evidenced by recent empirical studies in finance. This work attempts to lay out theoretical grounds that reconcile continuous-time modeling and discrete-time samples. We propose an estimation approach that takes advantage of the rich sources in tick-by-tick data while preserving the continuous-time assumption on the underlying returns. Under our framework, it becomes clear why and where the 'usual' volatility estimator fails when the returns are sampled at the highest frequencies. If the noise is asymptotically small, our work provides a way of finding the optimal sampling frequency. A better approach, which we call 'two-scales realized volatility' (TSRV), uses the entire data and corrects for the bias using subsampling. TSRV is consistent, asymptotically unbiased, and efficient.

**Snowball:** Barndorff-Nielsen, Hansen, Lunde, Shephard, 'Designing realised kernels...' (Econometrica 2008) (10.3982/ECTA6495); Aït-Sahalia, Mykland, Zhang, 'How often to sample a continuous-time process in the presence of market microstructure noise' (RFS 2005) (10.1093/rfs/hhi016); Bandi & Russell, 'Separating microstructure noise from volatility' (JFE 2006) (10.1016/j.jfineco.2005.10.002)

---

#### Designing Realized Kernels to Measure the Ex Post Variation of Equity Prices in the Presence of Noise
*Ole E. Barndorff-Nielsen, Peter Reinhard Hansen, Asger Lunde, Neil Shephard* — 2008 · Econometrica · cites: 1400 · completeness-add

DOI: `10.3982/ECTA6495` · [link](https://doi.org/10.3982/ECTA6495)

`method`

**Why:** The other canonical noise-robust realised-variance estimator (realised kernels); together with TSRV it fills the explicit microstructure-noise gap, and its multivariate extension underpins high-frequency covariance estimation for DCC-type models.

> This paper shows how to use realized kernels to estimate the quadratic variation of an asset's price process in a fundamentally robust way. The methods are robust to market frictions/microstructure noise and can be applied to high-frequency returns. We derive the large-sample properties of our estimators and show that, under suitable assumptions on the kernel weights, the estimators are consistent for the increments of quadratic variation, are asymptotically mixed Gaussian, and converge at the optimal rate. We also discuss how to make the estimator robust to endogenous and serially dependent noise and to non-synchronous trading, and provide an extensive empirical analysis using equity transaction data.

**Snowball:** Barndorff-Nielsen, Hansen, Lunde, Shephard, 'Multivariate realised kernels...' (JoE 2011) (10.1016/j.jeconom.2010.07.009); Hansen & Lunde, 'Realized variance and market microstructure noise' (JBES 2006) (10.1198/073500106000000071)

---

#### Power and Bipower Variation with Stochastic Volatility and Jumps
*Ole E. Barndorff-Nielsen, Neil Shephard* — 2004 · Journal of Financial Econometrics · cites: 1700 · completeness-add

DOI: `10.1093/jjfinec/nbh001` · [link](https://doi.org/10.1093/jjfinec/nbh001)

`method`

**Why:** Foundational jump/continuous decomposition of quadratic variation; the theoretical basis for the jump-component HAR models already in the list (Andersen-Bollerslev-Diebold 2007) and for measuring the contribution of jumps to volatility.

> This paper shows that realized power variation and its extension, realized bipower variation, are somewhat robust to rare jumps. We demonstrate that in special cases, realized bipower variation estimates integrated variance in stochastic volatility models, thus providing a model-free and consistent alternative to realized variance. Its robustness to jumps means that the difference between realized variance and realized bipower variation consistently estimates the contribution of jumps to the quadratic variation of the price process. Limit theorems, building on the work of Jacod and others, are used to justify these results and to give the asymptotic distributions. The theory is illustrated using exchange rate data.

**Snowball:** Barndorff-Nielsen & Shephard, 'Econometrics of testing for jumps in financial economics using bipower variation' (JFE 2006) (10.1093/jjfinec/nbi022); Huang & Tauchen, 'The relative contribution of jumps to total price variance' (JFE 2005) (10.1093/jjfinec/nbi004)

---

#### Jumps and Stochastic Volatility: Exchange Rate Processes Implicit in Deutsche Mark Options
*David S. Bates* — 1996 · Review of Financial Studies · cites: 2400 · completeness-add

DOI: `10.1093/rfs/9.1.69` · [link](https://doi.org/10.1093/rfs/9.1.69)

`canonical`

**Why:** Canonical stochastic-volatility-plus-jumps option-pricing model (SVJ); the direct extension of the already-gathered Heston (1993) model and the empirical motivation for jumps that the rough-volatility and VRP literatures respond to.

> An efficient method is developed for pricing American options on stochastic volatility/jump-diffusion processes under systematic jump and volatility risk. The parameters implicit in Deutsche mark (DM) options of the model and various submodels are estimated over the period 1984 to 1991 via nonlinear generalized least squares, and are tested for consistency with the $/DM futures market and the implicit volatility sample path. The stochastic volatility submodel cannot explain the 'volatility smile' evidence of implicit excess kurtosis, except under parameters implausible given the time series properties of implicit volatilities. Jump fears can explain the smile, but are inconsistent with the time series.

**Snowball:** Duffie, Pan, Singleton, 'Transform analysis and asset pricing for affine jump-diffusions' (Econometrica 2000) (10.1111/1468-0262.00164); Bakshi, Cao, Chen, 'Empirical performance of alternative option pricing models' (JF 1997) (10.1111/j.1540-6261.1997.tb02749.x)

---

#### Transform Analysis and Asset Pricing for Affine Jump-Diffusions
*Darrell Duffie, Jun Pan, Kenneth J. Singleton* — 2000 · Econometrica · cites: 3000 · completeness-add

DOI: `10.1111/1468-0262.00164` · [link](https://doi.org/10.1111/1468-0262.00164)

`canonical`

**Why:** The unifying transform/characteristic-function framework for affine jump-diffusion pricing; underpins both classical SV+jump models (Heston, Bates) and the affine structure later mirrored by rough Heston, and is the engine for VIX/variance-swap valuation.

> In the setting of affine jump-diffusion state processes, this paper provides an analytical treatment of a class of transforms, including various Laplace and Fourier transforms as special cases, that allow an analytical treatment of a range of valuation and econometric problems. Example applications include fixed-income pricing models, with a role for intensity-based models of default, as well as a wide range of option-pricing applications. An illustrative example examines the implications of stochastic volatility and jumps for option valuation. This example highlights the impact on option 'smirks' of the joint distribution of jumps in volatility and jumps in the underlying asset price, through their respective amplitude and timing.

**Snowball:** Heston, 'A closed-form solution for options with stochastic volatility' (RFS 1993) (10.1093/rfs/6.2.327); Carr & Madan, 'Option valuation using the fast Fourier transform' (J. Comp. Finance 1999)

---

#### The Characteristic Function of Rough Heston Models
*Omar El Euch, Mathieu Rosenbaum* — 2019 · Mathematical Finance · cites: 340 · OA · completeness-add

DOI: `10.1111/mafi.12173` · arXiv: `1609.02108` · [link](https://arxiv.org/abs/1609.02108)

`frontier` · [pdf](https://arxiv.org/pdf/1609.02108)

**Why:** Solves the pricing problem for rough volatility by deriving a semi-closed-form characteristic function (fractional Riccati), making the already-gathered rough-volatility models tractable for option pricing and VIX modelling. Key bridge from the modelling papers in the list to practical pricing.

> It has been recently shown that rough volatility models, where the volatility is driven by a fractional Brownian motion with small Hurst parameter, provide very relevant dynamics in order to reproduce the behavior of both historical and implied volatilities. However, due to the non-Markovian nature of the fractional Brownian motion, they raise new issues when it comes to derivatives pricing. Using an original link between nearly unstable Hawkes processes and fractional volatility models, we compute the characteristic function of the log-price in rough Heston models. In the classical Heston model, the characteristic function is expressed in terms of the solution of a Riccati equation. Here we show that rough Heston models exhibit quite a similar structure, the Riccati equation being replaced by a fractional Riccati equation.

**Snowball:** El Euch, Gatheral, Rosenbaum, 'Roughening Heston' (Risk 2019); Gatheral, Jaisson, Rosenbaum, 'Volatility is rough' (Quant. Finance 2018) (10.1080/14697688.2017.1393551)

---

#### Lifting the Heston Model
*Eduardo Abi Jaber* — 2019 · Quantitative Finance · cites: 150 · OA · completeness-add

DOI: `10.1080/14697688.2019.1615113` · arXiv: `1810.04868` · [link](https://arxiv.org/abs/1810.04868)

`frontier` · [pdf](https://arxiv.org/pdf/1810.04868)

**Why:** Bridges classical and rough Heston via a finite-dimensional Markovian (multi-factor) approximation, addressing the central practical obstacle of rough models (non-Markovianity/slow simulation). Important recent methodological advance for the rough-volatility strand already in the list.

> How to reconcile the classical Heston model with its rough counterpart? We introduce a lifted version of the Heston model with n multi-factors, sharing the same Brownian motion but mean reverting at different speeds. Our model nests as extreme cases the classical Heston model (when n=1), and the rough Heston model (when n goes to infinity). We show that the lifted model enjoys the best of both worlds: Markovianity and satisfactory fits of implied volatility smiles for short maturities with very few parameters. Further, our approach speeds up the calibration time and opens the door to time-efficient simulation schemes.

**Snowball:** Abi Jaber, El Euch, 'Multifactor approximation of rough volatility models' (SIAM J. Fin. Math. 2019) (10.1137/18M1170236); Bayer, Friz, Gatheral, 'Pricing under rough volatility' (Quant. Finance 2016) (10.1080/14697688.2015.1099717)

---

#### Deep Learning Volatility: A Deep Neural Network Perspective on Pricing and Calibration in (Rough) Volatility Models
*Blanka Horvath, Aitor Muguruza, Mehdi Tomas* — 2021 · Quantitative Finance · cites: 300 · OA · completeness-add

DOI: `10.1080/14697688.2020.1817974` · arXiv: `1901.09647` · [link](https://arxiv.org/abs/1901.09647)

`frontier` · [pdf](https://arxiv.org/pdf/1901.09647)

**Why:** The paper that made rough-volatility calibration industrially feasible (millisecond full-surface calibration via neural-network pricing surrogates). Connects the rough-volatility and ML-forecasting strands already in the list and is the most-cited deep-calibration reference.

> We present a neural network based calibration method that performs the calibration task within a few milliseconds for the full implied volatility surface. The framework is consistently applicable throughout a range of volatility models -including the rough volatility family- and a range of derivative contracts. The aim of neural networks in this work is an off-line approximation of complex pricing functions, which are difficult to represent or time-consuming to evaluate by other means. We highlight how this perspective opens new horizons for quantitative modelling: The calibration bottleneck posed by a slow pricing of derivative contracts is lifted. This brings several numerical pricers and model families (such as rough volatility models) within the scope of applicability in industry practice. The form in which information from available data is extracted and stored influences network performance: This approach is inspired by representing the implied volatility and option prices as a collection of pixels. In a number of applications we demonstrate the prowess of this modelling approach regarding accuracy, speed, robustness and generality and also its potentials towards model recognition.

**Snowball:** Bayer, Stemper, 'Deep calibration of rough stochastic volatility models' (arXiv 2018) (1810.03399); Buehler, Gonon, Teichmann, Wood, 'Deep hedging' (Quant. Finance 2019) (10.1080/14697688.2019.1571683)

---

#### Measuring Downside Risk: Realised Semivariance
*Ole E. Barndorff-Nielsen, Silja Kinnebrock, Neil Shephard* — 2010 · Volatility and Time Series Econometrics: Essays in Honor of Robert F. Engle (Oxford University Press) · cites: 500 · OA · completeness-add

DOI: `10.1093/acprof:oso/9780199549498.003.0007` · [link](https://doi.org/10.2139/ssrn.1262194)

`method` · [pdf](https://papers.ssrn.com/sol3/Delivery.cfm?abstractid=1262194)

**Why:** Introduces the downside/signed realised measures (semivariance) that decompose volatility by the sign of returns; central to modern leverage-aware HAR forecasting and directly relevant to tail-risk/VaR-ES applications in the SCOPE.

> We introduce downside realised semivariance, defined as a sum of squared high-frequency negative returns, and study its behaviour in theory and practice. Using the theory of quadratic variation we show that, in the presence of jumps, realised semivariance asymptotically separates the variation due to negative jumps from the continuous component of quadratic variation, while ordinary realised variance does not. We derive its limit theory and demonstrate empirically that realised semivariance and the associated signed-jump measures carry important and asymmetric information for forecasting future volatility and for understanding the leverage effect, over and above realised variance.

**Snowball:** Patton & Sheppard, 'Good volatility, bad volatility: signed jumps and the persistence of volatility' (REStat 2015) (10.1162/REST_a_00503); Barndorff-Nielsen & Shephard, 'Power and bipower variation...' (JFE 2004) (10.1093/jjfinec/nbh001)

---

#### Exploiting the Errors: A Simple Approach for Improved Volatility Forecasting
*Tim Bollerslev, Andrew J. Patton, Rogier Quaedvlieg* — 2016 · Journal of Econometrics · cites: 600 · OA · completeness-add

DOI: `10.1016/j.jeconom.2015.10.007` · [link](https://doi.org/10.1016/j.jeconom.2015.10.007)

`method` · [pdf](https://public.econ.duke.edu/~boller/Published_Papers/joe_16.pdf)

**Why:** The HARQ extension of the already-gathered Corsi HAR model: corrects for time-varying measurement error in realised volatility and is now a standard benchmark in volatility forecasting (including the ML papers already in the list).

> We propose a new family of easy-to-implement realized volatility based forecasting models. The models exploit the asymptotic theory for high-frequency realized volatility estimation to improve the accuracy of the forecasts by explicitly accounting for the temporal variation in the magnitude of the measurement errors in the realized volatilities. We refer to this new class of models as HARQ models. The HARQ models, which allow the autoregressive parameters to vary with the (estimated) degree of measurement error, generally outperform the standard HAR model and a wide range of competing models both in- and out-of-sample. Our results carry over to multi-step and multivariate forecasting situations, and are remarkably robust.

**Snowball:** Corsi, 'A simple approximate long-memory model of realized volatility' (JFE 2009) (10.1093/jjfinec/nbp001); Andersen, Bollerslev, Meddahi, 'Realized volatility forecasting and market microstructure noise' (JoE 2011) (10.1016/j.jeconom.2010.03.029)

---

#### Dynamic Estimation of Volatility Risk Premia and Investor Risk Aversion from Option-Implied and Realized Volatilities
*Tim Bollerslev, Michael Gibson, Hao Zhou* — 2011 · Journal of Econometrics · cites: 500 · OA · completeness-add

DOI: `10.1016/j.jeconom.2010.03.033` · [link](https://doi.org/10.1016/j.jeconom.2010.03.033)

`empirical` · [pdf](https://www.federalreserve.gov/pubs/feds/2004/200456/200456pap.pdf)

**Why:** Provides the model-free construction of the variance/volatility risk premium and a time-varying risk-aversion index, complementing the already-gathered Carr-Wu and Bollerslev-Tauchen-Zhou VRP papers and linking realised to option-implied (VIX) measures.

> This paper proposes a method for constructing a volatility risk premium, or investor risk aversion, index. The method is intuitive and simple to implement, relying on the sample analogue of the conditional moments restricting the difference between the ex ante (or risk-neutral) expectation and the realized integrated return volatility. The procedure does not require any particular auxiliary model for the volatility dynamics, and only involves direct estimation of the conditional moments based on standard time-series methods. Our empirical implementation, based on monthly model-free realized and option-implied volatilities for the S&P500 market index, results in a highly significant positive volatility risk premium that varies importantly over time and is strongly negatively correlated with both the level of returns and the realized volatility.

**Snowball:** Carr & Wu, 'Variance risk premiums' (RFS 2009) (10.1093/rfs/hhn038); Britten-Jones & Neuberger, 'Option prices, implied price processes, and stochastic volatility' (JF 2000) (10.1111/0022-1082.00228)

---

#### Multivariate GARCH Models: A Survey
*Luc Bauwens, Sébastien Laurent, Jeroen V. K. Rombouts* — 2006 · Journal of Applied Econometrics · cites: 2100 · completeness-add

DOI: `10.1002/jae.842` · [link](https://doi.org/10.1002/jae.842)

`review`

**Why:** The standard reference survey for multivariate GARCH (VEC, BEKK, CCC, DCC, factor models); gives the breadth around the single DCC paper (Engle 2002) currently in the list, directly serving the SCOPE's 'multivariate GARCH / DCC' item.

> This paper surveys the most important developments in multivariate ARCH-type modelling. It reviews the model specifications, the inference methods, and the main applications of the large number of multivariate GARCH models available in the literature. We classify the models into three categories: generalizations of the univariate GARCH model (e.g. VEC and BEKK), linear combinations of univariate GARCH models (e.g. factor models), and nonlinear combinations of univariate GARCH models (e.g. CCC and DCC). For each category we discuss the formulation, the estimation, the stationarity and other theoretical properties, and we review the empirical applications. Issues of model specification testing are also addressed.

**Snowball:** Engle & Kroner, 'Multivariate simultaneous generalized ARCH' (Econometric Theory 1995) (10.1017/S0266466600009063); Bollerslev, 'Modelling the coherence in short-run nominal exchange rates: a multivariate generalized ARCH model' (REStat 1990) (10.2307/2109358)

---

