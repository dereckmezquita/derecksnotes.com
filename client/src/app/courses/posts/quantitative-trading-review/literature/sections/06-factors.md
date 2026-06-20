# The cross-section of returns and the factor zoo

This section traces the arc from the foundational risk-return paradigm (CAPM tests via Fama-MacBeth 1973; the Fama-French size/value factors and the three- and five-factor models; Carhart momentum) through the proliferation of hundreds of "anomaly" factors—the "factor zoo"—and the multiple-testing and data-snooping crisis it provoked (Harvey-Liu-Zhu, Cochrane's "Discount Rates" address, Hou-Xue-Zhang's q-factor model and replication work). The modern frontier reframes the problem statistically: shrinkage/SDF estimation on the cross-section (Kozak-Nagel-Santosh), characteristics-vs-covariances via instrumented PCA (Kelly-Pruitt-Su), nonparametric and machine-learning return prediction (Freyberger-Neuhierl-Weber; Gu-Kelly-Xiu; Chen-Pelger-Zhu; the autoencoder and "virtue of complexity" papers; Bryzgalova-Pelger-Zhu trees), and latent-factor/omitted-factor inference (Giglio-Xiu). Reproducible benchmarks—above all Chen-Zimmermann's Open Source Asset Pricing dataset—now anchor the debate over which predictors survive out of sample. The throughline is a tension between economically motivated factor models and a data-driven, high-dimensional view in which characteristics jointly map to expected returns and most published factors are fragile. The seed reviews (Giglio-Kelly-Xiu 2022; Nagel 2021; Hou-Xue-Zhang 2020; Harvey-Liu-Zhu 2016; Feng-Giglio-Xiu 2020) tie these threads together; the works below are the canonical primary sources and the strongest 2019-2026 methodological advances.

**Completeness critic:** The gathered list is strong and reputable — no predatory or mis-attributed items. One minor metadata note: the gathered "... and the Cross-Section of Expected Returns" (Harvey, Liu, Zhu, 2016) is sometimes listed with the third author as "Caroline Zhu" vs "Heqing Zhu" in different indices; the published RFS version (DOI 10.1093/rfs/hhv059) uses Heqing Zhu — the gathered attribution is correct. The set is well-balanced between canonical (Fama-French, Fama-MacBeth, Carhart, Hou-Xue-Zhang, Cochrane) and ML/zoo frontier (Gu-Kelly-Xiu, Kozak-Nagel-Santosh, Freyberger-Neuhierl-Weber, Kelly-Pruitt-Su, Feng-Giglio-Xiu, Chen-Zimmermann).

Coverage GAPS I identified and filled: (1) The "replication/data-snooping crisis" debate is under-represented — the scope names Harvey-Liu-Zhu (gathered) but is missing the two landmark replication papers that frame the entire modern controversy: Hou-Xue-Zhang "Replicating Anomalies" (the pessimistic 65% fail rate) and Jensen-Kelly-Pedersen "Is There a Replication Crisis in Finance?" (the Bayesian optimistic rebuttal). These are essential as a paired controversy. (2) The publication-and-decay literature (McLean-Pontiff; Chen-Velikov on trading costs) is absent — central to whether the zoo survives out-of-sample/net of costs. (3) The classic methodological critiques that motivated the modern toolkit are missing: Lewellen-Nagel-Shanken "Skeptical Appraisal" (the R²/test-asset critique) and Daniel-Titman (the original characteristics-vs-covariances paper, explicitly named in the scope but not gathered — the historical anchor for the IPCA/KPS debate). (4) Multiple-testing methods beyond Harvey-Liu-Zhu: Harvey-Liu "Lucky Factors" and Giglio-Liao-Xiu "Thousands of Alpha Tests" (FDR). (5) Model-comparison: Barillas-Shanken. (6) q-factor extension Hou-Mo-Xue-Zhang "q5". (7) ML critiques (Avramov-Cheng-Metzker: limits-to-arbitrage/costs) and a survey (Kelly-Xiu "Financial Machine Learning"). I prioritized these 12. Lower-priority items not included for space: Chordia-Goyal-Saretto p-hacking, Pukthuanthong-Roll-Subrahmanyam protocol, and a textbook (Cochrane's "Asset Pricing").

---

#### The Cross-Section of Expected Stock Returns
*Eugene F. Fama, Kenneth R. French* — 1992 · The Journal of Finance · cites: 15095 · OA

DOI: `10.1111/j.1540-6261.1992.tb04398.x` · [link](https://doi.org/10.1111/j.1540-6261.1992.tb04398.x)

`canonical`

**Why:** The empirical bombshell that dethroned the single-factor CAPM and established characteristic-based (size, value) cross-sectional return prediction; the origin point of the entire factor literature.

> Fama and French show that two easily measured firm characteristics, size (market equity) and the book-to-market equity ratio, jointly capture the cross-sectional variation in average U.S. stock returns associated with market beta, leverage, and earnings-to-price. Strikingly, when these two variables are included, the relation between market beta and average return is flat over 1963-1990, contradicting the central prediction of the Sharpe-Lintner-Black CAPM. Size is negatively related and book-to-market positively related to average returns. The paper concludes that beta alone does not explain the cross-section and that size and book-to-market proxy for risk dimensions priced by the market.

**Snowball:** Sharpe, W. F. (1964), 'Capital Asset Prices: A Theory of Market Equilibrium under Conditions of Risk', Journal of Finance (10.1111/j.1540-6261.1964.tb02865.x); Banz, R. W. (1981), 'The relationship between return and market value of common stocks', JFE (10.1016/0304-405X(81)90018-0); Rosenberg, Reid, Lanstein (1985), 'Persuasive evidence of market inefficiency', J. Portfolio Management (10.3905/jpm.1985.409007)

---

#### Common risk factors in the returns on stocks and bonds
*Eugene F. Fama, Kenneth R. French* — 1993 · Journal of Financial Economics · cites: 27672

DOI: `10.1016/0304-405X(93)90023-5` · [link](https://doi.org/10.1016/0304-405X(93)90023-5)

`canonical`

**Why:** Defines the canonical Fama-French 3-factor model (mkt, SMB, HML) and the factor-mimicking-portfolio construction methodology used for virtually every subsequent factor; the benchmark every 'anomaly' is tested against.

> Fama and French identify five common risk factors in the returns on stocks and bonds. For stocks, three factors—an overall market factor (excess market return), a size factor (SMB, small-minus-big), and a book-to-market factor (HML, high-minus-low)—capture the cross-section of average equity returns. Two bond-market factors (term and default premia) capture variation in bond returns. The three stock-market factors absorb essentially all of the size and book-to-market patterns in average returns and explain the common time-series variation in returns, providing a parsimonious factor model that became the workhorse benchmark of empirical asset pricing.

**Snowball:** Fama & French (1992), 'The Cross-Section of Expected Stock Returns' (10.1111/j.1540-6261.1992.tb04398.x); Chan, Chen, Hsieh (1985), 'An exploratory investigation of the firm size effect', JFE (10.1016/0304-405X(85)90050-1)

---

#### Risk, Return, and Equilibrium: Empirical Tests
*Eugene F. Fama, James D. MacBeth* — 1973 · Journal of Political Economy · cites: 15080

DOI: `10.1086/260061` · [link](https://doi.org/10.1086/260061)

`method`

**Why:** Introduces the Fama-MacBeth two-pass cross-sectional regression—the standard inferential tool for estimating factor risk premia and testing whether a characteristic is priced; cited in essentially every factor-zoo paper.

> Fama and MacBeth test the two-parameter CAPM using a month-by-month cross-sectional regression procedure: in each period, asset (portfolio) returns are regressed on estimated betas, and the time series of the resulting slope coefficients is used to test whether average risk premia are positive and whether beta is the only priced characteristic. Using NYSE stocks 1926-1968, they find a positive trade-off between average return and risk (beta) consistent with an efficient market and the two-parameter model, and no systematic role for nonlinearity in beta or for non-beta risk. The rolling cross-sectional regression with time-series standard errors is the procedure's lasting contribution.

**Snowball:** Black, Jensen, Scholes (1972), 'The capital asset pricing model: Some empirical tests'; Shanken, J. (1992), 'On the estimation of beta-pricing models', RFS (10.1093/rfs/5.1.1)

---

#### On Persistence in Mutual Fund Performance
*Mark M. Carhart* — 1997 · The Journal of Finance · cites: 16993 · OA

DOI: `10.1111/j.1540-6261.1997.tb03808.x` · [link](https://doi.org/10.1111/j.1540-6261.1997.tb03808.x)

`canonical`

**Why:** Source of the Carhart momentum (UMD) factor and the four-factor model; momentum is the most robust anomaly and a core member of the factor benchmark set.

> Carhart constructs a four-factor model by adding a one-year momentum factor (PR1YR / UMD, up-minus-down) to the Fama-French three factors and uses it to explain persistence in mutual-fund returns. He shows that common factors in stock returns and differences in fund expenses and transaction costs explain almost all of the predictability in mutual-fund returns; persistent performance is largely driven by the momentum effect and by cost differences rather than manager skill. The momentum factor introduced here became the fourth pillar of the standard factor benchmark.

**Snowball:** Jegadeesh & Titman (1993), 'Returns to buying winners and selling losers' (10.1111/j.1540-6261.1993.tb04702.x); Fama & French (1993), 'Common risk factors...' (10.1016/0304-405X(93)90023-5)

---

#### A five-factor asset pricing model
*Eugene F. Fama, Kenneth R. French* — 2015 · Journal of Financial Economics · cites: 6055

DOI: `10.1016/j.jfineco.2014.10.010` · [link](https://doi.org/10.1016/j.jfineco.2014.10.010)

`canonical`

**Why:** Defines the Fama-French 5-factor model and brings investment/profitability into the canonical benchmark, directly engaging the q-factor literature (Hou-Xue-Zhang); standard modern benchmark.

> Fama and French augment their three-factor model with profitability (RMW, robust-minus-weak operating profitability) and investment (CMA, conservative-minus-aggressive) factors, motivated by the dividend-discount-model implication that profitability and investment should predict returns. The resulting five-factor model performs better than the three-factor model in describing average returns on portfolios formed on size, B/M, profitability, and investment. A notable result is that the value factor HML becomes redundant for describing average returns once profitability and investment are included, and the model's main failure is low average returns on small stocks that invest heavily despite low profitability.

**Snowball:** Novy-Marx, R. (2013), 'The other side of value: The gross profitability premium', JFE (10.1016/j.jfineco.2013.01.003); Aharoni, Grundy, Zeng (2013), 'Stock returns and the Miller Modigliani valuation formula', JFE (10.1016/j.jfineco.2013.04.005)

---

#### Digesting Anomalies: An Investment Approach
*Kewei Hou, Chen Xue, Lu Zhang* — 2015 · The Review of Financial Studies · cites: 2633

DOI: `10.1093/rfs/hhu068` · [link](https://doi.org/10.1093/rfs/hhu068)

`canonical`

**Why:** Introduces the q-factor model (an alternative to FF5 grounded in investment theory) and systematically 'digests' the anomaly zoo, showing most anomalies collapse into investment and profitability; a pillar of the factor-zoo debate.

> Hou, Xue, and Zhang propose an empirical q-factor model—market, size, investment (low-minus-high), and profitability (high-minus-low return on equity)—motivated by investment-based (q-theory) asset pricing. They show this four-factor model summarizes the cross-section of average returns well: it largely subsumes the Fama-French and Carhart models and explains the magnitude of most of nearly 80 significant anomalies, with insignificant alphas where the FF/Carhart models fail. The investment and ROE factors are the economic workhorses, linking firm investment policy and profitability to expected returns through q-theory.

**Snowball:** Fama & French (2015), 'A five-factor asset pricing model' (10.1016/j.jfineco.2014.10.010); Cochrane, J. (1991), 'Production-based asset pricing and the link between stock returns and economic fluctuations' (10.1111/j.1540-6261.1991.tb02674.x)

---

#### Presidential Address: Discount Rates
*John H. Cochrane* — 2011 · The Journal of Finance · cites: 2285

DOI: `10.1111/j.1540-6261.2011.01671.x` · [link](https://doi.org/10.1111/j.1540-6261.2011.01671.x)

`review`

**Why:** Agenda-setting address that named the 'multidimensional challenge' of the factor zoo and motivated dimension-reduction and ML approaches; the conceptual bridge from classic factors to the modern high-dimensional cross-section.

> Cochrane's AFA presidential address argues that discount-rate variation, not cash-flow variation, drives most asset-price movement, and surveys how time-varying expected returns pervade equities, bonds, credit, and currencies. He frames the explosion of cross-sectional return predictors as a pressing problem: 'we are going to have to repeat Fama and French's anomaly digestion, but with many more dimensions.' He calls for a multivariate, dimension-reduced approach to the 'multidimensional cross-section' and questions which characteristics provide independent information about average returns, anticipating the high-dimensional and machine-learning turn in asset pricing.

**Snowball:** Fama & French (2008), 'Dissecting anomalies', Journal of Finance (10.1111/j.1540-6261.2008.01371.x); Campbell & Shiller (1988), 'The dividend-price ratio and expectations of future dividends and discount factors', RFS (10.1093/rfs/1.3.195)

---

#### Empirical Asset Pricing via Machine Learning
*Shihao Gu, Bryan T. Kelly, Dacheng Xiu* — 2020 · The Review of Financial Studies · cites: 2225 · OA

DOI: `10.1093/rfs/hhaa009` · [link](https://doi.org/10.1093/rfs/hhaa009)

`frontier`

**Why:** The landmark ML-for-cross-section paper; establishes neural nets/trees as superior return predictors and a standardized comparison framework. Central to the 'characteristics as a high-dimensional prediction problem' frontier.

> Gu, Kelly, and Xiu perform a comparative analysis of machine-learning methods—linear models, generalized linear models with penalties, dimension reduction (PCR, PLS), regression trees, random forests, gradient boosting, and neural networks—for measuring equity risk premia, using ~30,000 stocks, 94 characteristics, interactions, and macro predictors. The best methods (trees and especially neural networks) roughly double the out-of-sample Sharpe ratio of a leading regression-based strategy and improve out-of-sample R-squared, with gains attributable to allowing nonlinear predictor interactions. They find broad agreement across methods on the most informative predictors—price-trend (momentum), liquidity, and volatility variables dominate—providing a unified ML benchmark for return prediction.

**Snowball:** Kozak, Nagel, Santosh (2020), 'Shrinking the cross-section', JFE (10.1016/j.jfineco.2019.06.008); Freyberger, Neuhierl, Weber (2020), 'Dissecting characteristics nonparametrically', RFS (10.1093/rfs/hhz123); Harvey, Liu, Zhu (2016), '...and the Cross-Section of Expected Returns', RFS (10.1093/rfs/hhv059)

---

#### ... and the Cross-Section of Expected Returns
*Campbell R. Harvey, Yan Liu, Heqing Zhu* — 2016 · The Review of Financial Studies · cites: 2039 · OA

DOI: `10.1093/rfs/hhv059` · [link](https://doi.org/10.1093/rfs/hhv059)

`critique`

**Why:** The defining 'factor zoo' / multiple-testing critique; reframes factor discovery as a data-snooping problem and sets the t>3 hurdle. (Seed review—included as the canonical primary source for the data-snooping theme.)

> Harvey, Liu, and Zhu catalog over 300 factors proposed in top journals to explain the cross-section of returns and argue that, because of extensive data mining, the conventional t-statistic threshold of 2.0 is far too low. Applying multiple-testing frameworks (Bonferroni, Holm, Benjamini-Hochberg-Yekutieli) they argue a newly proposed factor today should clear a hurdle of about t > 3.0. They conclude that most claimed research findings in financial economics are likely false, and provide a chronologically adjusted benchmark for evaluating future factor discoveries.

**Snowball:** Benjamini & Hochberg (1995), 'Controlling the false discovery rate', JRSS-B (10.1111/j.2517-6161.1995.tb02031.x); McLean & Pontiff (2016), 'Does academic research destroy stock return predictability?', Journal of Finance (10.1111/jofi.12365)

---

#### Shrinking the cross-section
*Serhiy Kozak, Stefan Nagel, Shrihari Santosh* — 2020 · Journal of Financial Economics · cites: 738

DOI: `10.1016/j.jfineco.2019.06.008` · [link](https://doi.org/10.1016/j.jfineco.2019.06.008)

`method`

**Why:** Key methodological reframing: the cross-section as SDF estimation with shrinkage; argues against sparse factor models and for dense, regularized characteristic combinations—directly opposing the 'few true factors' view.

> Kozak, Nagel, and Santosh build a robust stochastic discount factor (SDF) summarizing the joint explanatory power of a large set of cross-sectional stock-return predictors. They argue that an 'economically reasonable' SDF must load on a relatively small number of principal components of candidate characteristic-based factors, but that sparsity in the space of individual characteristics is implausible because near-arbitrage opportunities would otherwise arise. Their Bayesian/shrinkage estimator (an L2/ridge-type prior on SDF coefficients in PC space) substantially outperforms L1 (lasso) sparse models and standard factor models out of sample, showing the cross-section is better described by a dense combination of many characteristics than by a few.

**Snowball:** Kozak, Nagel, Santosh (2018), 'Interpreting factor models', Journal of Finance (10.1111/jofi.12612); Gu, Kelly, Xiu (2020), 'Empirical Asset Pricing via Machine Learning', RFS (10.1093/rfs/hhaa009)

---

#### Dissecting Characteristics Nonparametrically
*Joachim Freyberger, Andreas Neuhierl, Michael Weber* — 2020 · The Review of Financial Studies · cites: 603

DOI: `10.1093/rfs/hhz123` · [link](https://doi.org/10.1093/rfs/hhz123)

`method`

**Why:** Brings principled model selection (adaptive group lasso) and nonlinearity to the 'which characteristics are independently priced' question; a bridge between classic Fama-MacBeth and full ML, identifying a parsimonious robust set.

> Freyberger, Neuhierl, and Weber propose a nonparametric method using the adaptive group LASSO to select firm characteristics and estimate how they jointly and flexibly map into expected returns, allowing nonlinearities while guarding against overfitting and data snooping. Out of about 60 characteristics, they find roughly a dozen provide independent information about average returns, with several entering nonlinearly. Variables such as past return measures (momentum, short-term reversal), profitability, and certain valuation ratios are robustly important, while many characteristics are redundant once others are included.

**Snowball:** Green, Hand, Zhang (2017), 'The characteristics that provide independent information about average U.S. monthly stock returns', RFS (10.1093/rfs/hhx019); Fama & French (2008), 'Dissecting anomalies' (10.1111/j.1540-6261.2008.01371.x)

---

#### Characteristics are covariances: A unified model of risk and return
*Bryan T. Kelly, Seth Pruitt, Yinan Su* — 2019 · Journal of Financial Economics · cites: 780

DOI: `10.1016/j.jfineco.2019.05.001` · [link](https://doi.org/10.1016/j.jfineco.2019.05.001)

`method`

**Why:** The IPCA framework operationalizing the 'characteristics vs. covariances' debate; shows characteristics' predictive power is largely a compensation-for-risk (loading) story. A core modern method.

> Kelly, Pruitt, and Su develop Instrumented Principal Components Analysis (IPCA), a conditional latent-factor model in which firm characteristics instrument for time-varying factor loadings (betas). This lets the data decide whether characteristics line up with expected returns because they proxy for risk exposures (covariances) or because of anomalous (alpha) mispricing. Estimated on U.S. equities, a low-dimensional IPCA model with characteristic-driven loadings prices the cross-section far better than leading observable-factor models and drives intercepts (anomaly alphas) to economically small, statistically insignificant values—supporting the view that characteristics predict returns chiefly through their association with factor loadings.

**Snowball:** Daniel & Titman (1997), 'Evidence on the characteristics of cross sectional variation in stock returns', Journal of Finance (10.1111/j.1540-6261.1997.tb01700.x); Kelly, Pruitt, Su (2017), 'Instrumented Principal Component Analysis', SSRN (10.2139/ssrn.2983919)

---

#### Deep Learning in Asset Pricing
*Luyang Chen, Markus Pelger, Jason Zhu* — 2024 · Management Science · cites: 407

DOI: `10.1287/mnsc.2023.4695` · arXiv: `1904.00745` · [link](https://doi.org/10.1287/mnsc.2023.4695)

`frontier`

**Why:** Imposes the no-arbitrage SDF restriction inside a deep network with an adversarial (GAN-style) construction of test assets; a leading economically-disciplined deep-learning asset-pricing model.

> We use deep neural networks to estimate an asset pricing model for individual stock returns that takes advantage of the vast amount of conditioning information, while keeping a fully flexible form and accounting for time-variation. The key innovations are to use the fundamental no-arbitrage condition as criterion function, to construct the most informative test assets with an adversarial approach and to extract the states of the economy from many macroeconomic time series. Our asset pricing model outperforms out-of-sample all benchmark approaches in terms of Sharpe ratio, explained variation and pricing errors and identifies the key factors that drive asset prices.

**Snowball:** Gu, Kelly, Xiu (2020), 'Empirical Asset Pricing via Machine Learning', RFS (10.1093/rfs/hhaa009); Gu, Kelly, Xiu (2021), 'Autoencoder asset pricing models', J. Econometrics (10.1016/j.jeconom.2020.07.009)

---

#### Autoencoder asset pricing models
*Shihao Gu, Bryan T. Kelly, Dacheng Xiu* — 2021 · Journal of Econometrics · cites: 426

DOI: `10.1016/j.jeconom.2020.07.009` · [link](https://doi.org/10.1016/j.jeconom.2020.07.009)

`frontier`

**Why:** Nonlinear generalization of IPCA/PCA latent-factor models via autoencoders; a key entry in the neural-network conditional-factor-model frontier.

> Gu, Kelly, and Xiu propose a new latent-factor conditional asset-pricing model using a neural-network autoencoder. Their architecture generalizes linear conditional factor models such as IPCA: firm characteristics enter through the network to determine factor loadings (betas), while the latent factors themselves are estimated from returns, and the no-arbitrage restriction is imposed so that loadings, not intercepts, explain expected returns. The nonlinear autoencoder model delivers substantially lower out-of-sample pricing errors and higher Sharpe ratios than leading linear factor models and PCA-based alternatives, demonstrating gains from nonlinearity in the loading function.

**Snowball:** Kelly, Pruitt, Su (2019), 'Characteristics are covariances', JFE (10.1016/j.jfineco.2019.05.001); Kozak, Nagel, Santosh (2020), 'Shrinking the cross-section', JFE (10.1016/j.jfineco.2019.06.008)

---

#### The Virtue of Complexity in Return Prediction
*Bryan T. Kelly, Semyon Malamud, Kangying Zhou* — 2024 · The Journal of Finance · cites: 196 · OA

DOI: `10.1111/jofi.13298` · [link](https://doi.org/10.1111/jofi.13298)

`frontier`

**Why:** Challenges the parsimony orthodoxy of the factor-zoo critique by showing over-parameterized models predict returns better out of sample (double descent); a provocative recent frontier result reshaping the overfitting debate.

> Kelly, Malamud, and Zhou study return prediction in the high-complexity regime where the number of model parameters exceeds the number of training observations. Drawing on the machine-learning 'double descent' phenomenon and random-feature regressions, they show theoretically and empirically that expected out-of-sample performance can be monotonically increasing in model complexity—even far beyond the interpolation threshold—contradicting the conventional parsimony principle. Highly parameterized (over-parameterized) market-timing models achieve higher out-of-sample Sharpe ratios and predictive accuracy, with ridge shrinkage controlling variance, suggesting that 'big' models are virtuous rather than overfit for return prediction.

**Snowball:** Belkin, Hsu, Ma, Mandal (2019), 'Reconciling modern machine-learning practice and the classical bias-variance trade-off', PNAS (10.1073/pnas.1903070116); Gu, Kelly, Xiu (2020), 'Empirical Asset Pricing via Machine Learning', RFS (10.1093/rfs/hhaa009)

---

#### Forest Through the Trees: Building Cross-Sections of Stock Returns
*Svetlana Bryzgalova, Markus Pelger, Jason Zhu* — 2025 · The Journal of Finance · cites: 14 · OA

DOI: `10.1111/jofi.13477` · [link](https://doi.org/10.1111/jofi.13477)

`frontier`

**Why:** A tree-based, interpretable way to construct informative test assets and SDFs that capture nonlinear characteristic interactions; advances how the cross-section itself is built and how factor models are tested.

> Bryzgalova, Pelger, and Zhu propose a method to build a small set of test-asset portfolios ('Asset Pricing Trees') that capture the rich information in many firm characteristics by recursively splitting stocks on characteristics into decision-tree-based portfolios, then pruning and combining them into a low-dimensional cross-section. These conditional, interaction-rich basis portfolios provide a powerful and economically interpretable set of test assets that are much harder for candidate factor models to price than conventional sorts, exposing the failures of standard models. The framework yields stochastic discount factors and managed portfolios with high out-of-sample Sharpe ratios while preserving interpretability through the tree structure.

**Snowball:** Kozak, Nagel, Santosh (2020), 'Shrinking the cross-section', JFE (10.1016/j.jfineco.2019.06.008); Gu, Kelly, Xiu (2020), 'Empirical Asset Pricing via Machine Learning', RFS (10.1093/rfs/hhaa009)

---

#### Asset Pricing with Omitted Factors
*Stefano Giglio, Dacheng Xiu* — 2021 · Journal of Political Economy · cites: 356

DOI: `10.1086/714090` · [link](https://doi.org/10.1086/714090)

`method`

**Why:** Provides econometrically robust risk-premium estimation under omitted-factor bias—directly addresses why many factor-zoo claims are fragile; key inference tool linking latent-factor methods to the multiple-testing critique.

> Giglio and Xiu develop a three-pass estimator to consistently estimate the risk premium of an observable factor even when the true asset-pricing model has omitted (unobservable) factors and when test-asset returns are subject to measurement error. The procedure combines principal-components extraction of latent factors from a large panel of returns with cross-sectional regressions, exploiting the rotation invariance of risk premia. They show standard two-pass (Fama-MacBeth) estimates are biased when relevant factors are omitted, and apply the method to obtain robust risk-premium estimates for many proposed factors, several of which lose significance once latent factors are accounted for.

**Snowball:** Fama & MacBeth (1973), 'Risk, Return, and Equilibrium: Empirical Tests' (10.1086/260061); Kelly, Pruitt, Su (2019), 'Characteristics are covariances', JFE (10.1016/j.jfineco.2019.05.001)

---

#### Mispricing Factors
*Robert F. Stambaugh, Yu Yuan* — 2017 · The Review of Financial Studies · cites: 923 · OA

DOI: `10.1093/rfs/hhw107` · [link](https://doi.org/10.1093/rfs/hhw107)

`empirical`

**Why:** A leading behavioral/mispricing alternative to risk-factor models; clusters the anomaly zoo into two interpretable mispricing dimensions and competes head-to-head with FF5 and q-factors.

> Stambaugh and Yuan construct a four-factor model in which two of the factors are 'mispricing' factors, MGMT (management-related) and PERF (performance-related), built by combining 11 prominent anomalies into two clusters based on the underlying firm behavior they reflect. Combined with the market and a size factor (constructed to be cleaner of mispricing), this behaviorally-motivated model prices a wide range of anomalies better than the Fama-French and q-factor models, with smaller pricing errors. The factors load on the time-varying degree of market-wide mispricing (proxied by an investor-sentiment index), supporting a mispricing rather than purely risk-based interpretation of the cross-section.

**Snowball:** Stambaugh, Yu, Yuan (2012), 'The short of it: Investor sentiment and anomalies', JFE (10.1016/j.jfineco.2011.12.001); Baker & Wurgler (2006), 'Investor sentiment and the cross-section of stock returns', Journal of Finance (10.1111/j.1540-6261.2006.00885.x)

---

#### The Cross-Section of Expected Stock Returns
*Jonathan Lewellen* — 2015 · Critical Finance Review · cites: 354

DOI: `10.1561/104.00000024` · [link](https://doi.org/10.1561/104.00000024)

`empirical`

**Why:** A careful multivariate Fama-MacBeth benchmark for how much of the cross-section many characteristics jointly predict out of sample; reference point against which ML methods are judged.

> Lewellen studies how well firm characteristics, in combination, predict the cross-section of expected stock returns using Fama-MacBeth regressions on a large set of (up to ~15) characteristics. He finds that a multivariate model has significant out-of-sample predictive power: cross-sectional predicted returns line up well with realized average returns, and a handful of characteristics (e.g., size, book-to-market, momentum, accruals, profitability, asset growth) capture most of the predictability. The exercise quantifies the joint, marginal predictive content of characteristics and provides a practical out-of-sample benchmark for the cross-section.

**Snowball:** Fama & MacBeth (1973), 'Risk, Return, and Equilibrium' (10.1086/260061); Haugen & Baker (1996), 'Commonality in the determinants of expected stock returns', JFE (10.1016/0304-405X(96)00875-1)

---

#### Open Source Cross-Sectional Asset Pricing
*Andrew Y. Chen, Tom Zimmermann* — 2022 · Critical Finance Review · cites: 370 · OA

DOI: `10.1561/104.00000112` · [link](https://doi.org/10.1561/104.00000112)

`data` · [pdf](https://www.openassetpricing.com/)

**Why:** The de facto open benchmark dataset for the factor zoo; enables reproducible cross-section/ML research and supplies direct replication evidence on which anomalies survive. Essential data resource for this section.

> Chen and Zimmermann provide open-source data and code that reproduce the cross-sectional stock-return predictors ('anomalies') documented in the academic literature, covering more than 200 characteristics with transparent construction choices and replication of original published results. They document that the large majority of predictors replicate—mean returns in their data are close to those originally reported—pushing back against claims that anomalies are largely the product of data mining or coding errors. The accompanying Open Source Asset Pricing dataset has become a standard, openly available benchmark for factor-zoo and machine-learning research.

**Snowball:** Hou, Xue, Zhang (2020), 'Replicating Anomalies', RFS (10.1093/rfs/hhy131); Jensen, Kelly, Pedersen (2023), 'Is There a Replication Crisis in Finance?', Journal of Finance (10.1111/jofi.13249)

---

#### Taming the Factor Zoo: A Test of New Factors
*Guanhao Feng, Stefano Giglio, Dacheng Xiu* — 2020 · The Journal of Finance · cites: 600 · OA

DOI: `10.1111/jofi.12883` · [link](https://doi.org/10.1111/jofi.12883)

`method`

**Why:** Directly 'tames the factor zoo' with a regularized, selection-robust test for incremental factor contribution; a methodological cornerstone for the data-snooping section. (Seed review—included as the canonical method paper for new-factor testing.)

> Feng, Giglio, and Xiu propose a model-selection method to evaluate the contribution of a newly proposed factor to asset pricing, given the hundreds of factors already discovered. Using a double-machine-learning (double-selection LASSO) procedure on a high-dimensional set of existing factors, they construct a robust test of whether a new factor's risk premium is significant after controlling for the factor zoo, correcting for the omitted-variable and selection biases that plague standard tests. Applied to recently proposed factors, most add little once existing factors are accounted for, providing a disciplined protocol for admitting new factors.

**Snowball:** Harvey, Liu, Zhu (2016), '...and the Cross-Section of Expected Returns', RFS (10.1093/rfs/hhv059); Belloni, Chernozhukov, Hansen (2014), 'Inference on treatment effects after selection among high-dimensional controls', REStud (10.1093/restud/rdt044)

---

#### Interpreting Factor Models
*Serhiy Kozak, Stefan Nagel, Shrihari Santosh* — 2018 · The Journal of Finance · cites: 320 · OA

DOI: `10.1111/jofi.12612` · [link](https://doi.org/10.1111/jofi.12612)

`method`

**Why:** Conceptually important: shows low-dimensional factor structure is consistent with both risk and mispricing, sharpening interpretation of every factor model; theoretical backbone for the Kozak-Nagel-Santosh shrinkage program.

> Kozak, Nagel, and Santosh argue that the success of reduced-form factor models in pricing the cross-section provides little evidence in favor of rational, risk-based explanations over behavioral ones. They show that absence of near-arbitrage opportunities implies that a stochastic discount factor must be well approximated by a small number of dominant principal components of returns—and that this holds whether expected returns arise from risk premia or from sentiment-driven mispricing. Consequently, finding a low-dimensional factor model that prices assets cannot, by itself, discriminate between rational and behavioral accounts of the cross-section.

**Snowball:** Kozak, Nagel, Santosh (2020), 'Shrinking the cross-section', JFE (10.1016/j.jfineco.2019.06.008); Cochrane, J. (2011), 'Presidential Address: Discount Rates', Journal of Finance (10.1111/j.1540-6261.2011.01671.x)

---

#### Replicating Anomalies
*Kewei Hou, Chen Xue, Lu Zhang* — 2020 · The Review of Financial Studies · cites: 791 · OA · completeness-add

DOI: `10.1093/rfs/hhy131` · [link](https://academic.oup.com/rfs/article-abstract/33/5/2019/5236964)

`critique` · [pdf](https://www.nber.org/system/files/working_papers/w23394/w23394.pdf)

**Why:** The landmark 'pessimistic' replication study: most of the published factor zoo dies once microcaps are controlled, directly framing the data-snooping debate the section centers on. Pairs with Harvey-Liu-Zhu and the q-factor model (both same authors' lineage).

> Most anomalies fail to hold up to currently acceptable standards for empirical finance. With microcaps mitigated via NYSE breakpoints and value-weighted returns, 65% of the 452 anomalies in our extensive data library, including 96% of the trading frictions category, cannot clear the single test hurdle of the absolute t-value of 1.96. Imposing the higher multiple test hurdle of 2.78 at the 5% significance level raises the failure rate to 82%. Even for replicated anomalies, their economic magnitudes are much smaller than originally reported. In all, capital markets are more efficient than previously recognized.

**Snowball:** Harvey, Liu, Zhu, '... and the Cross-Section of Expected Returns' (2016) (10.1093/rfs/hhv059); Harvey & Liu, 'Lucky Factors' (2021) (10.1016/j.jfineco.2021.04.014); McLean & Pontiff, 'Does Academic Research Destroy Stock Return Predictability?' (2016) (10.1111/jofi.12365)

---

#### Is There a Replication Crisis in Finance?
*Theis Ingerslev Jensen, Bryan T. Kelly, Lasse Heje Pedersen* — 2023 · The Journal of Finance · cites: 443 · OA · completeness-add

DOI: `10.1111/jofi.13249` · [link](https://onlinelibrary.wiley.com/doi/full/10.1111/jofi.13249)

`critique` · [pdf](https://research-api.cbs.dk/ws/portalfiles/portal/95651880/theis_ingerslev_jensen_et_al_is_there_a_replication_crisis_in_finance_publishersversion.pdf)

**Why:** The 'optimistic' Bayesian rebuttal to Hou-Xue-Zhang and Harvey-Liu-Zhu; introduces the 13-theme taxonomy and the jkpfactors global dataset now standard in the literature. Essential counterpoint in the factor-zoo controversy.

> Several papers argue that financial economics faces a replication crisis because the majority of studies cannot be replicated or are the result of multiple testing of too many factors. We develop and estimate a Bayesian model of factor replication that leads to different conclusions. The majority of asset pricing factors (i) can be replicated; (ii) can be clustered into 13 themes, the majority of which are significant parts of the tangency portfolio; (iii) work out-of-sample in a new large data set covering 93 countries; and (iv) have evidence that is strengthened (not weakened) by the large number of observed factors.

**Snowball:** Hou, Xue, Zhang, 'Replicating Anomalies' (2020) (10.1093/rfs/hhy131); Chen & Zimmermann, 'Open Source Cross-Sectional Asset Pricing' (2022); Harvey, Liu, Zhu (2016) (10.1093/rfs/hhv059)

---

#### Does Academic Research Destroy Stock Return Predictability?
*R. David McLean, Jeffrey Pontiff* — 2016 · The Journal of Finance · cites: 1532 · OA · completeness-add

DOI: `10.1111/jofi.12365` · [link](https://onlinelibrary.wiley.com/doi/10.1111/jofi.12365)

`empirical`

**Why:** Canonical publication-and-decay paper: distinguishes data-mining from genuine-but-arbitraged-away predictability, quantifying how much of the zoo survives out-of-sample and post-publication. Core to assessing factor-zoo robustness.

> We study the out-of-sample and post-publication return predictability of 97 variables shown to predict cross-sectional stock returns. Portfolio returns are 26% lower out-of-sample and 58% lower post-publication. The out-of-sample decline is an upper bound estimate of data mining effects. We estimate a 32% (58% minus 26%) lower return from publication-informed trading. Post-publication declines are greater for predictors with higher in-sample returns, and returns are higher for portfolios concentrated in stocks with high idiosyncratic risk and low liquidity. Predictor portfolios exhibit post-publication increases in correlations with other published-predictor portfolios. These findings suggest that investors learn about mispricing from academic publications.

**Snowball:** Schwert, 'Anomalies and Market Efficiency' (2003) (10.3386/w9277); Chen & Velikov, 'Zeroing In on the Expected Returns of Anomalies' (2023) (10.1017/s0022109022000874); Stambaugh, Yu, Yuan, 'Arbitrage Asymmetry...' (2015) (10.1111/jofi.12286)

---

#### A skeptical appraisal of asset pricing tests
*Jonathan Lewellen, Stefan Nagel, Jay Shanken* — 2010 · Journal of Financial Economics · cites: 1262 · OA · completeness-add

DOI: `10.1016/j.jfineco.2009.09.001` · [link](https://www.sciencedirect.com/science/article/pii/S0304405X09001950)

`method` · [pdf](http://papers.nber.org/papers/w12360.pdf)

**Why:** Foundational methodological critique showing that high cross-sectional R-squared on FF size/BM test assets is uninformative; reshaped how factor models are tested (Fama-MacBeth, GLS, test-asset choice). Directly relevant to the Fama-MacBeth and factor-testing scope.

> It has become standard practice in the cross-sectional asset pricing literature to evaluate models based on how well they explain average returns on size and book-to-market portfolios, often ignoring other portfolios and the time-series predictions of the model. We show, by example, that the size and B/M portfolios alone are unable to provide an adequate test: because of the tight factor structure of those portfolios, even seriously flawed models will produce high cross-sectional R2 and small pricing errors. We outline a number of changes to the way tests are conducted, including: imposing the theoretical restrictions on the cross-sectional slopes, using a wide range of portfolios, and reporting confidence intervals for various statistics. The improved tests provide much weaker support for the asset pricing models considered, illustrating the importance of careful empirical work.

**Snowball:** Fama & MacBeth, 'Risk, Return, and Equilibrium' (1973) (10.1086/260061); Daniel & Titman, 'Evidence on the Characteristics...' (1997) (10.1111/j.1540-6261.1997.tb03806.x); Kan & Zhang, 'Two-Pass Tests of Asset Pricing Models with Useless Factors' (1999) (10.1111/0022-1082.00102)

---

#### Evidence on the Characteristics of Cross Sectional Variation in Stock Returns
*Kent Daniel, Sheridan Titman* — 1997 · The Journal of Finance · cites: 2107 · OA · completeness-add

DOI: `10.1111/j.1540-6261.1997.tb03806.x` · [link](https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6261.1997.tb03806.x)

`canonical` · [pdf](http://papers.nber.org/papers/w5604.pdf)

**Why:** The original 'characteristics vs covariances' paper explicitly named in the section scope but not yet gathered. The historical anchor for the entire debate that IPCA / Kelly-Pruitt-Su / Kozak-Nagel-Santosh later formalize. Essential canonical reference.

> Firm sizes and book-to-market ratios are both highly correlated with the average returns of common stocks. Fama and French (1993) argue that the association between these characteristics and returns arise because the characteristics are proxies for non-diversifiable factor risk. In contrast, the evidence in this article indicates that the return premia on small capitalization and high book-to-market stocks does not arise because of the comovements of these stocks with pervasive factors. It is the characteristics rather than the covariance structure of returns that appear to explain the cross-sectional variation in stock returns.

**Snowball:** Fama & French, 'Common risk factors...' (1993) (10.1016/0304-405X(93)90023-5); Kelly, Pruitt, Su, 'Characteristics are covariances' (2019) (10.1016/j.jfineco.2019.05.001); Davis, Fama, French, 'Characteristics, Covariances, and Average Returns: 1929 to 1997' (2000) (10.1111/0022-1082.00209)

---

#### Arbitrage Asymmetry and the Idiosyncratic Volatility Puzzle
*Robert F. Stambaugh, Jianfeng Yu, Yu Yuan* — 2015 · The Journal of Finance · cites: 997 · completeness-add

DOI: `10.1111/jofi.12286` · [link](https://onlinelibrary.wiley.com/doi/10.1111/jofi.12286)

`empirical`

**Why:** Connects the cross-section/anomalies to limits-to-arbitrage and short-sale constraints, explaining why so many anomalies live on the overpriced short leg. Provides the behavioral/mispricing mechanism behind the same authors' gathered Mispricing Factors.

> Buying is easier than shorting for many equity investors. Combining this arbitrage asymmetry with the arbitrage risk represented by idiosyncratic volatility (IVOL) explains the negative relation between IVOL and average returns. The IVOL-return relation is negative among overpriced stocks but positive among underpriced stocks, with mispricing determined by combining 11 return anomalies. The negative relation is stronger, consistent with arbitrage asymmetry making overpricing more prevalent. The arbitrage risk that deters arbitrageurs from eliminating mispricing is greater for overpriced stocks because of the impediments to shorting, so the negative IVOL-return relation is also stronger among stocks less easily shorted.

**Snowball:** Stambaugh & Yuan, 'Mispricing Factors' (2017) (10.1093/rfs/hhw107); Ang, Hodrick, Xing, Zhang, 'The Cross-Section of Volatility and Expected Returns' (2006) (10.1111/j.1540-6261.2006.00836.x); Shleifer & Vishny, 'The Limits of Arbitrage' (1997) (10.1111/j.1540-6261.1997.tb03807.x)

---

#### Thousands of Alpha Tests
*Stefano Giglio, Yuan Liao, Dacheng Xiu* — 2021 · The Review of Financial Studies · cites: 116 · completeness-add

DOI: `10.1093/rfs/hhaa111` · [link](https://academic.oup.com/rfs/article/34/7/3456/5912369)

`method`

**Why:** Brings rigorous false-discovery-rate / familywise-error multiple-testing machinery to the alpha/anomaly zoo with time-varying volatility and many test assets. Methodological complement to Harvey-Liu-Zhu and Feng-Giglio-Xiu (both gathered).

> Data snooping is a major concern in empirical asset pricing. We develop a new framework to rigorously perform multiple hypothesis testing in linear asset pricing models, while limiting the occurrence of false positive results typically associated with data snooping. By exploiting the testing structure, our method allows for time-varying volatility, multiple risk factors, and a large number of test assets and factors. We provide a thorough asymptotic theory, accommodating the false discovery proportion and the familywise error rate. Applied to a large set of trading strategies, our methodology detects a substantial number of false discoveries, and the resulting set of true positives is much smaller than commonly reported.

**Snowball:** Harvey, Liu, Zhu (2016) (10.1093/rfs/hhv059); Feng, Giglio, Xiu, 'Taming the Factor Zoo' (2020) (10.1111/jofi.12883); Barras, Scaillet, Wermers, 'False Discoveries in Mutual Fund Performance' (2010) (10.1111/j.1540-6261.2009.01527.x)

---

#### Comparing Asset Pricing Models
*Francisco Barillas, Jay Shanken* — 2018 · The Journal of Finance · cites: 473 · completeness-add

DOI: `10.1111/jofi.12607` · [link](https://onlinelibrary.wiley.com/doi/10.1111/jofi.12607)

`method`

**Why:** Reframes model comparison (FF5 vs q-factor vs others) around maximum squared Sharpe ratio and shows test assets are irrelevant for ranking nested-by-spanning factor models. Directly bears on adjudicating FF5 vs Hou-Xue-Zhang q in the scope.

> A common task in empirical finance is to compare nonnested factor models. We show that the relevant comparison concerns the extent to which each model is able to price the factors in the other model; the test assets are otherwise irrelevant. As a result, given the maximum squared Sharpe ratio for the factors in each model, the models can be ranked on the basis of these statistics, with the higher Sharpe ratio identifying the superior model. We develop the relevant test statistics, illustrate the approach by comparing several prominent models, and find that a six-factor model performs best.

**Snowball:** Fama & French, 'A five-factor asset pricing model' (2015) (10.1016/j.jfineco.2014.10.010); Hou, Xue, Zhang, 'Digesting Anomalies' (2015) (10.1093/rfs/hhu068); Gibbons, Ross, Shanken, 'A Test of the Efficiency of a Given Portfolio' (1989) (10.2307/1913625)

---

#### An Augmented q-Factor Model with Expected Growth
*Kewei Hou, Haitao Mo, Chen Xue, Lu Zhang* — 2021 · Review of Finance · cites: 466 · OA · completeness-add

DOI: `10.1093/rof/rfaa004` · [link](https://academic.oup.com/rof/article/25/1/1/5727769)

`method` · [pdf](https://www.nber.org/system/files/working_papers/w24709/w24709.pdf)

**Why:** The q5 extension of the gathered Hou-Xue-Zhang q-factor model, adding an expected-growth factor; a leading competitor to FF5/FF6 and central to the q-vs-FF model horse race in this section.

> In the investment theory, the expected investment-to-assets increases with the expected return on new investments (expected growth) and decreases with the discount rate. As such, the expected growth should be a distinct cross-sectional predictor of stock returns from the discount rate. The augmented q5 model, which includes an expected growth factor in the q-factor model, shows strong explanatory power in the cross section. The q5 model improves the original q-factor model in capturing many anomalies, including R&D-to-market, operating accruals, and various earnings surprise and momentum measures, and outperforms the Fama-French five- and six-factor models.

**Snowball:** Hou, Xue, Zhang, 'Digesting Anomalies' (2015) (10.1093/rfs/hhu068); Fama & French, 'A five-factor asset pricing model' (2015) (10.1016/j.jfineco.2014.10.010); Barillas & Shanken, 'Comparing Asset Pricing Models' (2018) (10.1111/jofi.12607)

---

#### Machine Learning vs. Economic Restrictions: Evidence from Stock Return Predictability
*Doron Avramov, Si Cheng, Lior Metzker* — 2023 · Management Science · cites: 130 · completeness-add

DOI: `10.1287/mnsc.2022.4449` · [link](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2022.4449)

`critique`

**Why:** Key critique of ML cross-sectional predictability (Gu-Kelly-Xiu and successors): the gains concentrate in hard-to-arbitrage, high-cost stocks and largely vanish net of trading frictions. Essential skeptical counterweight to the gathered ML asset-pricing papers.

> This paper shows that investments based on deep learning signals extract profitability from difficult-to-arbitrage stocks and during high limits-to-arbitrage market states. In particular, excluding microcaps, distressed stocks, or episodes of high market volatility considerably attenuates profitability. Machine learning-based performance further deteriorates in the presence of reasonable trading costs because of high turnover and extreme positions in the tangency portfolio implied by the pricing kernel. The economic restrictions imposed by limits to arbitrage and trading frictions thus considerably weaken the apparent profitability of machine learning strategies.

**Snowball:** Gu, Kelly, Xiu, 'Empirical Asset Pricing via Machine Learning' (2020) (10.1093/rfs/hhaa009); Chen & Velikov, 'Zeroing In on the Expected Returns of Anomalies' (2023) (10.1017/s0022109022000874); Novy-Marx & Velikov, 'A Taxonomy of Anomalies and Their Trading Costs' (2016) (10.1093/rfs/hhv063)

---

#### Zeroing In on the Expected Returns of Anomalies
*Andrew Y. Chen, Mihail Velikov* — 2023 · Journal of Financial and Quantitative Analysis · cites: 110 · OA · completeness-add

DOI: `10.1017/s0022109022000874` · [link](https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/zeroing-in-on-the-expected-returns-of-anomalies/)

`empirical` · [pdf](https://www.federalreserve.gov/econres/feds/files/2020039pap.pdf)

**Why:** Net-of-cost, post-publication reassessment of the anomaly zoo using effective spreads and modern trading tech; quantifies how much of documented anomaly returns survive in practice. Bridges the replication debate (Chen-Zimmermann, McLean-Pontiff) with implementability.

> We zero in on the expected returns of long-short portfolios based on 120 stock market anomalies by accounting for (i) effective bid-ask spreads, (ii) post-publication effects, and (iii) the modern era of trading technology that began in the early 2000s. Net of these effects, the average anomaly's expected return is significantly positive but stratospherically smaller than its in-sample return. Among long-short portfolios that combine many anomalies, expected returns are larger but still far below the levels documented in the literature. Standard mean-variance investors would still want to allocate to these strategies, but their optimal weights are much smaller than implied by in-sample returns.

**Snowball:** Chen & Zimmermann, 'Open Source Cross-Sectional Asset Pricing' (2022); McLean & Pontiff, 'Does Academic Research Destroy Stock Return Predictability?' (2016) (10.1111/jofi.12365); Novy-Marx & Velikov, 'A Taxonomy of Anomalies and Their Trading Costs' (2016) (10.1093/rfs/hhv063)

---

#### Financial Machine Learning
*Bryan T. Kelly, Dacheng Xiu* — 2023 · Foundations and Trends in Finance · cites: 120 · OA · completeness-add

DOI: `10.1561/0500000064` · [link](https://www.nber.org/papers/w31502)

`review` · [pdf](https://www.nber.org/system/files/working_papers/w31502/w31502.pdf)

**Why:** Authoritative recent survey of ML in asset pricing by two central authors of the gathered ML papers; ties together return prediction, factor models, SDF estimation, and the complexity/virtue-of-complexity literature. Ideal review-category anchor for the ML portion of the section.

> We survey the nascent literature on machine learning in the study of financial markets. We highlight the best examples of what this line of research has to offer and recommend promising directions for future research. This survey is designed for both financial economists interested in grasping machine learning tools, as well as for statisticians and machine learners seeking interesting financial contexts where advanced methods may be deployed. The survey covers return prediction, factor models of risk and return, stochastic discount factor models, and portfolio choice, emphasizing the economic structure that distinguishes financial ML from generic ML applications.

**Snowball:** Gu, Kelly, Xiu, 'Empirical Asset Pricing via Machine Learning' (2020) (10.1093/rfs/hhaa009); Kelly, Malamud, Zhou, 'The Virtue of Complexity in Return Prediction' (2024) (10.1111/jofi.13298); Kozak, Nagel, Santosh, 'Shrinking the Cross-Section' (2020) (10.1016/j.jfineco.2019.06.008)

---

