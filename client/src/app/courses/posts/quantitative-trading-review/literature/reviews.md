# Seed reviews & the survey-of-surveys

> Context behind the executive summary in the [README](README.md).

## Narrative map

# The Quantitative Trading Research Landscape: A Survey of Surveys

Quantitative trading research, viewed through its review literature, splits into five interlocking strands, each with its own canonical syntheses, settled results, and live controversies.

## The major research strands

**1. Empirical asset pricing, the factor zoo, and the ML turn.** The dominant strand asks what drives the cross-section of expected returns and how machine learning reshapes that question. The anchor synthesis is **Giglio, Kelly & Xiu (2022)**, which organizes the field into four tasks — expected returns, factor selection, risk premia/betas, and the stochastic discount factor — within a high-dimensional inference framework. **Nagel (2021)** complements it by arguing ML must be *adapted* to asset-pricing structure (no near-arbitrage, portfolio objectives, investor learning), and **Bagnara (2022)** gives a critical taxonomy by ML family (regularization, dimension reduction, trees, neural nets).

**2. Replication and multiple testing — the credibility crisis.** This methodological reckoning motivates the ML turn. **Harvey, Liu & Zhu (2016)** is the seminal statement: with hundreds of factors mined, the conventional t > 2 hurdle is indefensible and a new factor should clear roughly **t > 3**. **Harvey & Liu (2020)** extends this to false-discovery-rate control and Type I/II trade-offs for fund and factor selection. **Bailey, Borwein, López de Prado & Zhu (2014)** formalizes "backtest overfitting," and **Arnott, Harvey & Markowitz (2019)** translates it into an ML-era backtesting protocol.

**3. Volatility, tail risk, and risk measures.** A continuous-modeling strand running from constant through rough volatility is surveyed by **Di Nunno et al. (2023)**; tail estimation via extreme value theory by **Nolde & Zhou (2021)**; and the risk-measure axiom debate (VaR vs expected shortfall, post-Basel III) by **He, Kou & Peng (2022)**. Neural volatility forecasting is reviewed by **Ge et al. (2022)**.

**4. Portfolio construction and covariance estimation.** Two estimation programs dominate: random matrix theory (**Bun, Bouchaud & Potters 2017**) and linear/nonlinear shrinkage (**Ledoit & Wolf 2022**), both attacking Markowitz instability via eigenvalue cleaning. Broader practical surveys come from **Kolm, Tütüncü & Fabozzi (2014)** and **Boyd et al. (2024)**.

**5. Market microstructure, price impact, and execution.** **Donnelly (2022)** is the cleanest stand-alone review of optimal execution; **Bouchaud, Bonart, Donier & Gould (2018)** is the definitive book-length microstructure reference; **Hambly, Xu & Yang (2023)** maps reinforcement learning across execution, market making, and portfolio choice. A separate AI wave — DL (**Ozbayoglu, Gudelek & Sezer 2020**), RL meta-analysis (**Bai et al. 2024**), and LLMs (**Nie et al. 2024**) — runs across all strands.

## Settled vs. contested

**Settled:** that naive multiple-testing thresholds are inadequate and factor discovery must clear elevated, snooping-aware hurdles (Harvey-Liu-Zhu 2016); that the sample covariance matrix fails in high dimensions and must be cleaned via shrinkage or RMT (Ledoit-Wolf 2022; Bun-Bouchaud-Potters 2017); that price impact of metaorders follows a concave, roughly square-root law — **Sato & Kanazawa (2025)** claim to settle its *strict universality* (exponent = 1/2) using complete Tokyo Stock Exchange account data, rejecting prior non-universal models.

**Contested:** the **replication verdict itself** is the field's central live dispute — **Hou, Xue & Zhang (2020)** find ~65% of 452 anomalies fail (most p-hacked), whereas **Jensen, Kelly & Pedersen (2023)** counter with a Bayesian model concluding most factors *do* replicate out-of-sample across 93 countries. Also contested: whether volatility is genuinely "rough," with **Cont & Das (2024)** arguing the apparent roughness is a discretization/microstructure-noise artefact.

## Key authors and groups

Kelly and Xiu (with Giglio/Feng/Gu) anchor ML asset pricing; Harvey (with Liu/Zhu) and López de Prado anchor multiple-testing and overfitting; Ledoit-Wolf and Bouchaud-Bouchaud-Potters anchor estimation/microstructure econophysics; Bouchaud's group also dominates price impact; Hambly-Xu-Yang anchor RL.

## Where a newcomer should start (read these 6-10 first)

1. **Giglio, Kelly & Xiu (2022)** — the master map of ML asset pricing.
2. **Harvey, Liu & Zhu (2016)** — the multiple-testing problem statement.
3. **Hou, Xue & Zhang (2020)** *and* **Jensen, Kelly & Pedersen (2023)** — both sides of the replication debate, read together.
4. **Bailey, Borwein, López de Prado & Zhu (2014)** — backtest overfitting.
5. **Ledoit & Wolf (2022)** — covariance estimation for portfolios.
6. **Donnelly (2022)** — optimal execution.
7. **Hambly, Xu & Yang (2023)** — RL in finance.
8. **Nolde & Zhou (2021)** *or* **He, Kou & Peng (2022)** — tail risk / risk measures.
9. **Bouchaud, Bonart, Donier & Gould (2018)** — microstructure reference (for depth).

## Seed reviews by cluster

### Recent reviews/surveys of financial econometrics, empirical asset pricing, and the cross-section of expected returns (factor zoo + machine learning in asset pricing)

This cluster maps the state-of-the-art reviews bridging classical empirical asset pricing and the modern machine-learning / high-dimensional-econometrics turn. The anchor survey is Giglio, Kelly & Xiu (2022, Annual Review of Financial Economics), which organizes the field around four tasks (expected returns, factor identification, risk premia, and the stochastic discount factor) and is complemented by Nagel's (2021) Princeton monograph on adapting ML to asset-pricing constraints and Bagnara's (2022) open-access critical survey grouping methods by ML family. The "factor zoo" / replication strand is covered by three adversarial-leaning pieces: Harvey, Liu & Zhu (2016) on multiple-testing and the t>3 hurdle, Feng, Giglio & Xiu (2020) on systematically testing new factors against hundreds of incumbents, and Hou, Xue & Zhang (2020) replicating ~450 anomalies. Together they define both the methodological frontier (regularization, dimension reduction, trees, neural nets, SDF estimation) and the credibility/replication crisis motivating it.

#### Factor Models, Machine Learning, and Asset Pricing
*Stefano Giglio, Bryan T. Kelly, Dacheng Xiu* — 2022 · Annual Review of Financial Economics, vol. 14, pp. 337-368 · cites: 175

DOI `10.1146/annurev-financial-101521-104735` · [link](https://doi.org/10.1146/annurev-financial-101521-104735)

**Why:** The flagship recent review tying together factor models, the cross-section of expected returns, and ML; covers SDF estimation, factor selection, IPCA/conditional factor models, neural-net return prediction, and high-dimensional inference. Best single map of the state of the art by the field's leading authors.

> Faithful summary (publisher abstract paywalled): This article surveys recent methodological advances in empirical asset pricing that combine factor models with machine-learning techniques. The authors organize the literature around the principal quantitative tasks of the field: estimating expected returns, discovering and selecting factors, measuring risk exposures (betas) and risk premia, and estimating the stochastic discount factor; they also treat model comparison and tests of asset-pricing alphas. The survey reviews the asymptotic-inference frameworks appropriate for high-dimensional financial econometrics, emphasizing rigor, robustness, and statistical power, and serves as a guide for applying modern ML methods to asset pricing while identifying promising directions for future research.

---

#### Machine Learning in Asset Pricing
*Stefan Nagel* — 2021 · Princeton University Press (Princeton Lectures in Finance) · cites: 71

DOI `10.23943/princeton/9780691218700.001.0001` · [link](https://doi.org/10.23943/princeton/9780691218700.001.0001)

**Why:** Authoritative monograph-length survey on adapting supervised ML to asset pricing under economic constraints (no near-arbitrage, portfolio optimization, learning); covers prediction, the SDF, and the cross-section. Complements Giglio-Kelly-Xiu with a more theory-driven, economically disciplined view.

> Investors in financial markets face an abundance of potentially value-relevant information from diverse sources. In such data-rich, high-dimensional environments, machine-learning techniques are well-suited for solving prediction problems, and ML methods are quickly becoming part of the toolkit in asset-pricing research and quantitative investing. This book examines the promises and challenges of ML applications in asset pricing. Because asset-pricing problems differ substantially from the settings for which ML tools were originally developed, the methods must be adapted to the specific conditions of asset-pricing applications: economic considerations such as portfolio optimization, the absence of near-arbitrage, and investor learning can guide the selection and modification of ML tools. Beginning with a brief survey of basic supervised ML methods, the book discusses their application to empirical asset-pricing research and shows how they can advance the theoretical modeling of financial markets.

---

#### Asset Pricing and Machine Learning: A critical review
*Matteo Bagnara* — 2022 · Journal of Economic Surveys, vol. 38(1), pp. 27-56 · cites: 35 · OA

DOI `10.1111/joes.12532` · [link](https://doi.org/10.1111/joes.12532)

**Why:** Open-access critical survey that taxonomizes ML-in-asset-pricing by method family (regularization, dimension reduction, trees/RF, neural nets, comparative studies) and stresses economic interpretation and departures from classical econometrics. Useful, accessible map of the cross-section/factor-zoo + ML literature.

> The latest development in empirical Asset Pricing is the use of Machine Learning methods to address the problem of factor zoo. These techniques offer great flexibility and prediction accuracy but require special care as they strongly depart from traditional Econometrics. We review and critically assess the most recent and relevant contributions in literature grouping them into five categories defined by Machine Learning approach they employ: regularization, dimension reduction, regression trees/random forest (RF), neural networks (NNs), and comparative analyses. We summarize empirical findings with particular attention to their economic interpretation providing hints for future developments.

---

#### … and the Cross-Section of Expected Returns
*Campbell R. Harvey, Yan Liu, Heqing Zhu* — 2016 · The Review of Financial Studies, vol. 29(1), pp. 5-68 · cites: 2039 · OA

DOI `10.1093/rfs/hhv059` · [link](https://doi.org/10.1093/rfs/hhv059)

**Why:** The defining critique that crystallized the 'factor zoo' problem and the multiple-testing / t>3 hurdle for the cross-section of expected returns. Essential context and motivation for the ML/shrinkage literature; widely cited foundational survey-critique.

> Faithful summary: Hundreds of papers and factors attempt to explain the cross-section of expected returns. Given this extensive data mining, the authors argue it does not make sense to use the usual single-test significance criteria for newly discovered factors. They develop a multiple-testing framework and provide historical cutoffs from the first empirical tests in 1967 to the present, accounting for the many factors already tried. A new factor today should clear a much higher hurdle, with a t-statistic greater than about 3.0. Using this framework, the authors conclude that most claimed research findings in financial economics are likely false.

---

#### Taming the Factor Zoo: A Test of New Factors
*Guanhao Feng, Stefano Giglio, Dacheng Xiu* — 2020 · The Journal of Finance, vol. 75(3), pp. 1327-1370 · cites: 713

DOI `10.1111/jofi.12883` · [link](https://doi.org/10.1111/jofi.12883)

**Why:** Methodological + critical contribution that operationalizes 'taming the factor zoo': a high-dimensional inference procedure (double-selection LASSO) for testing new factors against the zoo. Bridges the cross-section, factor selection, and ML/regularization econometrics central to this review.

> Faithful summary: The authors propose a model-selection method to systematically evaluate the contribution of any newly proposed factor to asset pricing, relative to the high-dimensional set of factors already in the literature. The procedure uses regularization (a double-selection LASSO) to control for the omitted-variable bias that arises from imperfect factor selection, unlike standard two-pass approaches that assume the correct controls are known. Applying the method to a large set of recently proposed factors, they find that most are redundant relative to existing factors, but a small number provide statistically significant incremental explanatory power for the cross-section of expected returns even after accounting for hundreds of factors proposed previously.

---

#### Replicating Anomalies
*Kewei Hou, Chen Xue, Lu Zhang* — 2020 · The Review of Financial Studies, vol. 33(5), pp. 2019-2133 · cites: 999

DOI `10.1093/rfs/hhy131` · [link](https://doi.org/10.1093/rfs/hhy131)

**Why:** The most influential large-scale replication audit of the cross-section of expected returns / anomaly zoo; documents that most published anomalies do not survive a careful, uniform research design. Defines the replication-crisis backdrop that ML and multiple-testing methods respond to.

> Faithful summary: The authors compile a large set of anomaly variables (around 450 published cross-sectional predictors) and replicate them within a single, consistent empirical framework. Their central methodological choice is to use value-weighted portfolio returns with NYSE breakpoints and to control for microcaps, which dominate prior tests despite tiny aggregate weight. Under this protocol, the majority of published anomalies (roughly 65 percent, and most non-trading-frictions anomalies) fail to replicate at conventional significance, with average returns substantially smaller than originally reported. They conclude that the anomalies literature is rife with p-hacking and that capital markets are more efficient than the prior literature suggested.

---

### Reviews & surveys: ML / DL / RL / foundation models for financial markets and trading (2017-2026)

This cluster maps the survey literature for AI in quantitative finance across three waves. The canonical deep-learning wave is anchored by Ozbayoglu, Gudelek & Sezer (Applied Soft Computing 2020), which taxonomizes DL models across stock prediction, portfolio management, forex and crypto. The reinforcement-learning wave is covered by two complementary surveys: Hambly, Xu & Yang (Mathematical Finance 2023), a rigorous treatment grounded in MDPs and applications like optimal execution and market making, and Bai et al. (Annual Review of Statistics 2024), which adds meta-analysis and a challenges/robustness lens. The newest foundation-model / LLM wave is mapped by Nie et al. (2024) and Li et al. (ICAIF 2023), covering BloombergGPT/FinGPT-style models, sentiment, reasoning, and agentic trading systems. Together these give a reviewer near-complete coverage; the main gap they cite into is the empirical asset-pricing-via-ML literature (Gu-Kelly-Xiu) and the seminal primary models (BloombergGPT, FinRL, FinBERT) flagged in snowball.

#### Deep Learning for Financial Applications: A Survey
*Ahmet Murat Ozbayoglu, Mehmet Ugur Gudelek, Omer Berat Sezer* — 2020 · Applied Soft Computing (vol. 93, 106384) · OA

DOI `10.1016/j.asoc.2020.106384` · arXiv `2002.05786` · [link](https://arxiv.org/abs/2002.05786)

**Why:** The most-cited canonical DL-in-finance survey. Covers algorithmic trading, stock/index price prediction, portfolio management, cryptocurrency and forex markets, financial crisis/bankruptcy prediction, and fraud detection; organizes the literature both by finance subfield and by DL architecture (RNN/LSTM, CNN, DBN, autoencoders). Essential baseline for the pre-LLM deep-learning state of the art.

> Computational intelligence in finance has been a very popular topic for both academia and financial industry in the last few decades. Numerous studies have been published resulting in various models. Meanwhile, within the Machine Learning (ML) field, Deep Learning (DL) started getting a lot of attention recently, mostly due to its outperformance over the classical models. Lots of different implementations of DL exist today, and the broad interest is continuing. Finance is one particular area where DL models started getting traction, however, the playfield is wide open, a lot of research opportunities still exist. In this paper, we tried to provide a state-of-the-art snapshot of the developed DL models for financial applications, as of today. We not only categorized the works according to their intended subfield in finance but also analyzed them based on their DL models. In addition, we also aimed at identifying possible future implementations and highlighted the pathway for the ongoing research within the field.

---

#### Recent Advances in Reinforcement Learning in Finance
*Ben Hambly, Renyuan Xu, Huining Yang* — 2023 · Mathematical Finance (vol. 33, no. 3, pp. 437-503) · cites: 181 · OA

DOI `10.1111/mafi.12382` · arXiv `2112.04553` · [link](https://doi.org/10.1111/mafi.12382)

**Why:** The rigorous, theory-grounded RL-in-finance survey. Subfields: optimal execution, portfolio optimization, option pricing & hedging, market making, smart order routing, robo-advising. Bridges classical stochastic control with value-based, policy-based and deep RL; the reference for the mathematical-finance view of RL. Open access (Wiley CC-BY-NC-ND).

> The rapid changes in the finance industry due to the increasing amount of data have revolutionized the techniques on data processing and data analysis and brought new theoretical and computational challenges. In contrast to classical stochastic control theory and other analytical approaches for solving financial decision-making problems that heavily reliant on model assumptions, new developments from reinforcement learning (RL) are able to make full use of the large amount of financial data with fewer model assumptions and to improve decisions in complex financial environments. This survey paper aims to review the recent developments and use of RL approaches in finance. We give an introduction to Markov decision processes, which is the setting for many of the commonly used RL approaches. Various algorithms are then introduced with a focus on value- and policy-based methods that do not require any model assumptions. Connections are made with neural networks to extend the framework to encompass deep RL algorithms. Our survey concludes by discussing the application of these RL algorithms in a variety of decision-making problems in finance, including optimal execution, portfolio optimization, option pricing and hedging, market making, smart order routing, and robo-advising.

---

#### A Review of Reinforcement Learning in Financial Applications
*Yahui Bai, Yuhe Gao, Runzhe Wan, Sheng Zhang, Rui Song* — 2024 · Annual Review of Statistics and Its Application (vol. 12) · cites: 20 · OA

DOI `10.1146/annurev-statistics-112723-034423` · arXiv `2411.12746` · [link](https://doi.org/10.1146/annurev-statistics-112723-034423)

**Why:** Recent statistics-venue RL survey that complements Hambly et al. with a meta-analytic, critical lens. Subfields: portfolio management, optimal execution, market making, order routing, plus cross-cutting challenges (explainability, MDP modeling, robustness) and future directions (benchmarking, contextual/multi-agent/model-based RL). Strong for the 'what doesn't work / open problems' section of a critical review.

> In recent years, there has been a growing trend of applying Reinforcement Learning (RL) in financial applications. This approach has shown great potential to solve decision-making tasks in finance. In this survey, we present a comprehensive study of the applications of RL in finance and conduct a series of meta-analyses to investigate the common themes in the literature, such as the factors that most significantly affect RL's performance compared to traditional methods. Moreover, we identify challenges including explainability, Markov Decision Process (MDP) modeling, and robustness that hinder the broader utilization of RL in the financial industry and discuss recent advancements in overcoming these challenges. Finally, we propose future research directions, such as benchmarking, contextual RL, multi-agent RL, and model-based RL to address these challenges and to further enhance the implementation of RL in finance.

---

#### A Survey of Large Language Models for Financial Applications: Progress, Prospects and Challenges
*Yuqi Nie, Yaxuan Kong, Xiaowen Dong, John M. Mulvey, H. Vincent Poor, Qingsong Wen, Stefan Zohren* — 2024 · arXiv preprint (q-fin / cs.CL) · cites: 29 · OA

DOI `10.48550/arXiv.2406.11903` · arXiv `2406.11903` · [link](https://arxiv.org/abs/2406.11903)

**Why:** The strongest recent foundation-model survey for finance, by a reputable Princeton/Oxford/Squirrel-AI author group (incl. H. V. Poor, S. Zohren). Subfields: linguistic tasks, financial sentiment analysis, financial time-series forecasting via LLMs, financial reasoning, agent-based modeling and simulation; plus a curated datasets/model-assets/code appendix. Maps the LLM-and-foundation-model frontier for trading.

> Recent advances in large language models (LLMs) have unlocked novel opportunities for machine learning applications in the financial domain. These models have demonstrated remarkable capabilities in understanding context, processing vast amounts of data, and generating human-preferred contents. In this survey, we explore the application of LLMs on various financial tasks, focusing on their potential to transform traditional practices and drive innovation. We provide a discussion of the progress and advantages of LLMs in financial contexts, analyzing their advanced technologies as well as prospective capabilities in contextual understanding, transfer learning flexibility, complex emotion detection, etc. We then highlight this survey for categorizing the existing literature into key application areas, including linguistic tasks, sentiment analysis, financial time series, financial reasoning, agent-based modeling, and other applications. For each application area, we delve into specific methodologies, such as textual analysis, knowledge-based analysis, forecasting, data augmentation, planning, decision support, and simulations. Furthermore, a comprehensive collection of datasets, model assets, and useful codes associated with mainstream applications are presented as resources for the researchers and practitioners. Finally, we outline the challenges and opportunities for future research, particularly emphasizing a number of distinctive aspects in this field.

---

#### Large Language Models in Finance: A Survey
*Yinheng Li, Shaofei Wang, Han Ding, Hang Chen* — 2023 · Proceedings of the 4th ACM International Conference on AI in Finance (ICAIF '23) · OA

DOI `10.1145/3604237.3626869` · arXiv `2311.10723` · [link](https://arxiv.org/abs/2311.10723)

**Why:** Peer-reviewed (ICAIF) practical LLM-in-finance survey. Subfields: financial NLP tasks (sentiment, NER, QA, summarization), adoption strategies (zero/few-shot vs fine-tuning vs from-scratch training), and a decision framework trading off data/compute/performance. Useful as the applied, practitioner-facing complement to the Nie et al. survey.

> Recent advances in large language models (LLMs) have opened new possibilities for artificial intelligence applications in finance. In this paper, we provide a practical survey focused on two key aspects of utilizing LLMs for financial tasks: existing solutions and guidance for adoption. First, we review current approaches employing LLMs in finance, including leveraging pretrained models via zero-shot or few-shot learning, fine-tuning on domain-specific data, and training custom LLMs from scratch. We summarize key models and evaluate their performance improvements on financial natural language processing tasks. Second, we propose a decision framework to guide financial professionals in selecting the appropriate LLM solution based on their use case constraints around data, compute, and performance needs. The framework provides a pathway from lightweight experimentation to heavy investment in customized LLMs. Lastly, we discuss limitations and challenges around leveraging LLMs in financial applications.

---

#### The New Quant: A Survey of Large Language Models in Financial Prediction and Trading
*Weilong Fu* — 2025 · arXiv preprint (q-fin.TR / cs.CL) · OA

arXiv `2510.05533` · [link](https://arxiv.org/abs/2510.05533)

**Why:** The most recent (2025) and most trading-focused LLM survey. Subfields: equity return prediction, sentiment/event extraction, numerical/economic reasoning, multimodal understanding, retrieval-augmented generation, time-series prompting, and agentic backtesting/execution systems. Notably critical about temporal leakage, hallucination, capacity/cost and time-safe evaluation — valuable for the methodological-rigor and pitfalls sections of a critical review.

> Large language models are reshaping quantitative investing by turning unstructured financial information into evidence-grounded signals and executable decisions. This survey synthesizes research with a focus on equity return prediction and trading, consolidating insights from domain surveys and more than fifty primary studies. We propose a task-centered taxonomy that spans sentiment and event extraction, numerical and economic reasoning, multimodal understanding, retrieval-augmented generation, time series prompting, and agentic systems that coordinate tools for research, backtesting, and execution. We review empirical evidence for predictability, highlight design patterns that improve faithfulness such as retrieval first prompting and tool-verified numerics, and explain how signals feed portfolio construction under exposure, turnover, and capacity controls. We assess benchmarks and datasets for prediction and trading and outline desiderata for time safe and economically meaningful evaluation that reports costs, latency, and capacity. We analyze challenges that matter in production, including temporal leakage, hallucination, data coverage and structure, deployment economics, interpretability, governance, and safety. The survey closes with recommendations for standardizing evaluation, building auditable pipelines, and advancing multilingual and cross-market research so that language-driven systems deliver robust and risk-controlled performance in practice.

---

### Volatility modelling, tail risk, extreme value theory, and risk measures in finance — recent review/survey articles (2017–2026)

This cluster assembles the best recent surveys mapping the state of the art across four overlapping strands of financial econometrics: (1) continuous-time and discrete-time volatility modelling — from GARCH through realised-measure HAR models to the rough-volatility revolution sparked by Gatheral–Jaisson–Rosenbaum; (2) machine-learning / neural approaches to volatility forecasting; and (3) the risk-measurement layer that sits on top — extreme value theory (EVT) for tail estimation, and the theory of risk measures (VaR, expected shortfall, median shortfall) with its robustness/elicitability/backtesting debates triggered by the Basel III move from VaR to ES. Two authoritative Annual Review of Statistics pieces anchor the EVT and risk-measure strands (Nolde & Zhou 2021; He, Kou & Peng 2021), a long MDPI Mathematics survey (Di Nunno et al. 2023) covers the constant-to-rough volatility continuum, an ACM Computing Surveys systematic review (Ge et al. 2022) covers neural-network forecasting, and a recent arXiv brief review (Kamronnaher et al. 2024) ties GARCH/EVT estimation of VaR–ES together. Together they give complementary, reputable entry points; the canonical primary works they cite (Artzner et al., Corsi, McNeil–Frey, Gatheral et al., Fissler–Ziegel) are captured in the snowball fields for the next gathering round.

#### From Constant to Rough: A Survey of Continuous Volatility Modeling
*Giulia Di Nunno, Kęstutis Kubilius, Yuliya Mishura, Anton Yurchenko-Tytarenko* — 2023 · Mathematics (MDPI), 11(19):4201 · cites: 21 · OA

DOI `10.3390/math11194201` · [link](https://www.mdpi.com/2227-7390/11/19/4201)

**Why:** Single most comprehensive recent survey of continuous-time volatility modelling; covers constant/local volatility, classical stochastic volatility (Heston), fractional and rough volatility (rough Bergomi, rough Heston), long memory vs roughness, VIX modelling and joint SPX–VIX calibration. Ideal map of the rough-volatility frontier for the review.

> This survey traces the historical development of continuous stochastic volatility modeling and the empirical stylized facts that have driven the field. It places special emphasis on fractional and rough methods, laying out the motivations behind both the long-memory and the roughness paradigms, and characterizes the landmark models (from constant volatility and local volatility through classical stochastic volatility à la Heston, to fractional and rough Bergomi / rough Heston). It also addresses VIX modeling and the recent challenges of joint SPX–VIX calibration, providing a unified mathematical reference to the continuum of continuous-time volatility models.

---

#### Extreme Value Analysis for Financial Risk Management
*Natalia Nolde, Chen Zhou* — 2021 · Annual Review of Statistics and Its Application, Vol. 8, pp. 217-240 · cites: 19

DOI `10.1146/annurev-statistics-042720-015705` · [link](https://doi.org/10.1146/annurev-statistics-042720-015705)

**Why:** Authoritative, reputable (Annual Reviews) survey of extreme value theory for finance: univariate EVT (block maxima, POT, GEV/GPD), multivariate/tail-dependence methods, serial-dependence/time-series extremes, and their use for VaR, expected shortfall, dynamic and systemic risk. Core EVT/tail-risk reference.

> This article reviews methods of extreme value analysis (EVA) with applications to financial risk management, aimed at statisticians not already familiar with the field. It is organized around three data settings: (i) the classical framework for independent and identically distributed observations (block maxima / peaks-over-threshold, the generalized extreme value and generalized Pareto distributions); (ii) multivariate methods for cross-sectional dependence relevant to portfolio and systemic risk; and (iii) approaches for serially dependent, stationary data relevant to dynamic risk management. Applications to value-at-risk and expected shortfall estimation, dynamic risk measurement, and systemic risk are discussed.

---

#### Risk Measures: Robustness, Elicitability, and Backtesting
*Xue Dong He, Steven Kou, Xianhua Peng* — 2022 · Annual Review of Statistics and Its Application, Vol. 9, pp. 141-166 · cites: 27 · OA

DOI `10.1146/annurev-statistics-030718-105122` · [link](https://doi.org/10.1146/annurev-statistics-030718-105122)

**Why:** Reputable (Annual Reviews) survey of the theory of risk measures: VaR vs expected shortfall vs median shortfall, coherence/subadditivity, robustness, elicitability and backtestability — exactly the Basel III VaR-to-ES debate. Pairs with Nolde & Zhou on the measurement side. Mildly opinionated (advocates median shortfall) so partly a critique.

> Risk measures are used both for internal risk management at financial institutions and for the calculation of regulatory capital under the Basel Accords. Despite their importance, the choice of an appropriate risk measure remains contested. This review surveys the literature on risk measures, focusing on the properties of subadditivity, robustness, elicitability, and backtesting, and clarifies common misconceptions and apparent conflicts among these properties. The authors argue, on statistical and economic grounds, that median shortfall — a quantile of the tail loss distribution — has advantages over expected shortfall for setting Basel capital requirements, including better tail-risk capture together with stronger elicitability, more effective backtesting, and surplus invariance.

---

#### Neural Network–Based Financial Volatility Forecasting: A Systematic Review
*Wenbo Ge, Pooia Lalbakhsh, Leigh Isai, Artem Lenskiy, Hanna Suominen* — 2022 · ACM Computing Surveys, 55(1):14 · cites: 51 · OA

DOI `10.1145/3483596` · [link](https://doi.org/10.1145/3483596)

**Why:** Reputable (ACM Computing Surveys) systematic review of the machine-learning / deep-learning frontier in volatility forecasting (LSTM, CNN, hybrid GARCH-NN models). Complements the econometric surveys by covering the ML side and the comparability/evaluation problems that plague it. Useful methodological-critique perspective on the empirical literature.

> Volatility forecasting plays a critical role in finance, influencing decisions by a wide range of market participants. This systematic review examines 35 studies published after 2015 that apply neural-network approaches to financial volatility forecasting. The authors identify key challenges: a lack of meaningful, comparable evaluation across studies, and a substantial disconnect between contemporary machine-learning methods and those actually employed in volatility forecasting. They propose a shared evaluation framework for benchmarking state-of-the-art models and outline promising directions to close these gaps, including background material to introduce newcomers to the area.

---

#### Rough Volatility: Fact or Artefact?
*Rama Cont, Purba Das* — 2024 · Sankhya B 86:191-223 · cites: 29 · OA

DOI `10.1007/s13571-024-00322-2` · arXiv `2203.13820` · [link](https://doi.org/10.1007/s13571-024-00322-2)

**Why:** Adversarial / critique companion to the rough-volatility surveys: argues the measured roughness of realized volatility is an estimation artefact (discretization + microstructure noise) rather than a property of the spot volatility process. Essential counterpoint to include for a balanced critical review of the rough-volatility claim.

> We investigate the statistical evidence for the use of 'rough' fractional processes with Hurst exponent H < 0.5 for modeling the volatility of financial assets, using a model-free approach based on the normalized p-th variation along a sequence of partitions. Detailed numerical and Monte Carlo experiments show that, even when the instantaneous volatility process has continuous, smooth (Hölder-regular) sample paths, realized volatility computed from discrete observations behaves as if it were 'rough' (H < 0.5). We argue that the apparent roughness of realized volatility may be attributed to discretization error and microstructure noise rather than to the roughness of the underlying volatility process itself, casting doubt on the empirical basis for rough volatility models.

---

#### Estimating Value at Risk and Expected Shortfall: A Brief Review and Some New Developments
*Kanon Kamronnaher, Andrew Bellucco, Whitney K. Huang, Colin M. Gallagher* — 2024 · arXiv preprint (stat.ME / q-fin.RM) · OA

arXiv `2405.06798` · [link](https://arxiv.org/abs/2405.06798)

**Why:** Recent compact review tying together the three threads of this cluster: GARCH volatility models, EVT-based semiparametric tails, and VaR/ES estimation with backtesting. Useful as an applied/methods bridge and entry point, though a preprint (lower authority than the Annual Reviews pieces). Covers parametric, nonparametric and EVT-semiparametric innovation distributions plus quantile-regression methods.

> Value-at-risk (VaR) and expected shortfall (ES) are two commonly utilized metrics for quantifying financial risk. In this study, we review the widely employed Generalized Autoregressive Conditional Heteroskedasticity (GARCH) models. These models are explored with diverse distributional assumptions on innovation, including parametric, non-parametric, and 'semi-parametric' that incorporates a parametric tail distribution based on extreme value theory. Additionally, we introduce a non-parametric local linear quantile autoregression (LLQAR) with kernel weights depending on the distance between the current loss and past losses, and decreasing in the time lag. To evaluate the performance of different methods for VaR and ES estimation, we employ a multi-criteria approach involving mean squared error on simulated data, backtesting on simulated data and US stocks, and the ES bootstrap test. The LLQAR method, which does not necessarily require stationarity assumptions, seems to perform better for simulated non-stationary data as well as real-world data, for estimating VaR and ES.

---

### Portfolio construction, covariance/correlation estimation, random matrix theory, and risk-based asset allocation — recent review and survey articles (2014-2024)

This cluster maps the state-of-the-art reviews for building portfolios when the covariance matrix must be estimated from noisy, high-dimensional financial data. Two complementary statistical traditions dominate: the random-matrix-theory (RMT) / rotationally-invariant-estimator program of Bun-Bouchaud-Potters, and the linear/nonlinear shrinkage program of Ledoit-Wolf — both attack the same Markowitz instability problem from eigenvalue-cleaning angles and are the canonical methodological surveys. Around them sit broader practical surveys of portfolio optimization (Kolm-Tutuncu-Fabozzi; Boyd et al. at "seventy") covering estimation error, robust/convex optimization, transaction costs, and constraints, plus a finance-journal review (Sun et al.) that ties covariance estimation to portfolio risk measures (VaR/CVaR, GMV, factor models). Risk-based allocation (minimum-variance, equal-risk-contribution / risk parity, maximum diversification, hierarchical risk parity) is the practitioner payoff of better covariance estimation; the key primary works (Lopez de Prado HRP, Maillard-Roncalli-Teiletche ERC, Ledoit-Wolf nonlinear shrinkage) are captured as snowball targets for deeper gathering.

#### Cleaning large correlation matrices: tools from Random Matrix Theory
*Joël Bun, Jean-Philippe Bouchaud, Marc Potters* — 2017 · Physics Reports, vol. 666, pp. 1-109 · cites: 500 · OA

DOI `10.1016/j.physrep.2016.10.005` · arXiv `1610.08104` · [link](https://arxiv.org/abs/1610.08104)

**Why:** The definitive methodological survey of covariance/correlation cleaning via random matrix theory. Covers Marchenko-Pastur spectral theory, eigenvalue spectrum estimation, eigenvector overlaps, free probability, and the rotationally-invariant estimator (RIE/oracle) — the core RMT toolkit for portfolio covariance estimation. Directly spans the 'random matrix theory' and 'covariance/correlation estimation' subfields and connects them to financial portfolio applications.

> This review covers recent results concerning the estimation of large covariance matrices using tools from Random Matrix Theory (RMT). We introduce several RMT methods and analytical techniques, such as the Replica formalism and Free Probability, with an emphasis on the Marchenko-Pastur equation that provides information on the resolvent of multiplicatively corrupted noisy matrices. Special care is devoted to the statistics of the eigenvectors of the empirical correlation matrix, which turn out to be crucial for many applications. We show in particular how these results can be used to build consistent 'Rotationally Invariant' estimators (RIE) for large correlation matrices when there is no prior on the structure of the underlying process. The last part of this review is dedicated to some real-world applications within financial markets as a case in point.

---

#### The Power of (Non-)Linear Shrinking: A Review and Guide to Covariance Matrix Estimation
*Olivier Ledoit, Michael Wolf* — 2022 · Journal of Financial Econometrics, vol. 20(1), pp. 187-218 · cites: 135 · OA

DOI `10.1093/jjfinec/nbaa007` · [link](https://doi.org/10.1093/jjfinec/nbaa007)

**Why:** Authoritative author-written review of the Ledoit-Wolf shrinkage program — the dominant alternative/complement to RMT for high-dimensional covariance estimation. Covers linear shrinkage, analytical nonlinear shrinkage (QuEST/Hilbert transform), geometric loss functions, and overlays with factor models and DCC — directly serving covariance estimation and portfolio (minimum-variance) construction.

> Many econometric and data-science applications require a reliable estimate of the covariance matrix, such as Markowitz's portfolio selection. When the number of variables is of the same magnitude as the number of observations, this constitutes a difficult estimation problem; the sample covariance matrix certainly will not do. In this article, we review our work in this area, going back 15+ years. We have promoted various shrinkage estimators, which can be classified into linear and nonlinear. Linear shrinkage is simpler to understand, to derive, and to implement. But nonlinear shrinkage can deliver another level of performance improvement, especially if overlaid with stylized facts such as time-varying co-volatility or factor models.

---

#### 60 Years of portfolio optimization: Practical challenges and current trends
*Petter N. Kolm, Reha Tütüncü, Frank J. Fabozzi* — 2014 · European Journal of Operational Research, vol. 234(2), pp. 356-371 · cites: 569

DOI `10.1016/j.ejor.2013.10.060` · [link](https://doi.org/10.1016/j.ejor.2013.10.060)

**Why:** The most-cited practitioner-facing survey of portfolio construction. Covers the full pipeline: estimation error and instability, shrinkage/Bayesian covariance estimation, robust optimization, transaction costs, constraints, Black-Litterman, and risk measures — the connective tissue linking covariance estimation to portfolio construction. Anchors the 'portfolio construction' subfield historically.

> Commemorating the 60-year anniversary of Markowitz's seminal 'Portfolio Selection' paper, this review surveys the developments and approaches that address the practical challenges encountered when implementing mean-variance portfolio optimization. The authors discuss the inclusion of transaction costs, portfolio management constraints, and the sensitivity of optimized portfolios to estimates of expected returns and covariances. They review modern approaches to mitigating estimation error and instability, including Bayesian and shrinkage estimators, robust portfolio optimization, the Black-Litterman model, resampling, and the incorporation of higher moments and alternative risk measures, mapping the field's evolution from theory toward robust practical implementation.

---

#### Markowitz Portfolio Construction at Seventy
*Stephen Boyd, Kasper Johansson, Ronald Kahn, Philipp Schiele, Thomas Schmelzer* — 2024 · The Journal of Portfolio Management, vol. 50(8), pp. 117-160 · cites: 11 · OA

DOI `10.3905/jpm.2024.50.8.117` · arXiv `2401.05080` · [link](https://arxiv.org/abs/2401.05080)

**Why:** A recent (2024) practitioner+convex-optimization update of portfolio construction by leading authors (Boyd; Kahn of BARRA/BlackRock). Covers robust/convex formulations, covariance and return forecast uncertainty, leverage/turnover/holding constraints, and links classic Markowitz to modern numerical solvers — squarely the 'portfolio construction' subfield with a covariance-uncertainty emphasis.

> Markowitz's seminal mean-variance portfolio framework, now seventy years old, trades off expected return against risk defined as the standard deviation of portfolio returns. Practitioners have long criticized the framework for its sensitivity to errors in the forecasts of return statistics. In this paper the authors present a modern, enhanced formulation that gracefully handles the uncertainty inherent in forecasting return means and covariances while remaining a convex optimization problem that can be solved reliably and at scale. They show how holding, leverage, turnover, and risk constraints, as well as robustness to forecast uncertainty, can be incorporated, arguing that with these modern tools Markowitz's framework remains the method of choice for portfolio construction.

---

#### Improved Covariance Matrix Estimation for Portfolio Risk Measurement: A Review
*Ruili Sun, Tiefeng Ma, Shuangzhe Liu, Milind Sathye* — 2019 · Journal of Risk and Financial Management, vol. 12(1), art. 48 · cites: 28 · OA

DOI `10.3390/jrfm12010048` · [link](https://www.mdpi.com/1911-8074/12/1/48)

**Why:** An open-access finance-journal review that bridges covariance estimation and portfolio risk measurement. Covers stylized facts of financial data (fat tails, dependence), mean-variance / GMV / factor portfolio models, time-varying covariance and shrinkage estimation, and risk measures (semi-variance, VaR, CVaR) — connecting the 'covariance estimation' and 'risk-based / portfolio construction' subfields for a finance audience.

> The literature on portfolio selection and risk measurement has considerably advanced in recent years. The aim of the present paper is to trace the development of the literature and identify areas that require further research. This paper provides a literature review of the characteristics of financial data, commonly used models of portfolio selection, and portfolio risk measurement. In the summary of the characteristics of financial data, we summarize the literature on fat tail and dependence characteristic of financial data. In the portfolio selection model part, we cover three models: mean-variance model, global minimum variance (GMV) model and factor model. In the portfolio risk measurement part, we first classify risk measurement methods into two categories: moment-based risk measurement and moment-based and quantile-based risk measurement. Moment-based risk measurement includes time-varying covariance matrix and shrinkage estimation, while moment-based and quantile-based risk measurement includes semi-variance, VaR and CVaR.

---

#### Building Diversified Portfolios that Outperform Out of Sample
*Marcos López de Prado* — 2016 · The Journal of Portfolio Management, vol. 42(4), pp. 59-69 · cites: 700 · OA

DOI `10.3905/jpm.2016.42.4.059` · [link](https://doi.org/10.3905/jpm.2016.42.4.059)

**Why:** The foundational and most-cited statement of Hierarchical Risk Parity, the machine-learning-based risk-based allocation method that has reshaped practitioner asset allocation. Methodologically a review-grade reference work that critiques quadratic optimization instability and proposes a covariance-clustering alternative — central to the 'risk-based asset allocation' subfield and to the covariance-estimation-meets-allocation theme. Included as a canonical/critique anchor.

> The author introduces Hierarchical Risk Parity (HRP), a portfolio construction method that applies graph theory and machine-learning techniques to the information contained in the covariance matrix. Quadratic optimizers such as Markowitz's Critical Line Algorithm (CLA) require inversion of the covariance matrix, which is unstable, concentrated, and tends to underperform out of sample as the condition number deteriorates. HRP instead clusters assets via hierarchical tree clustering, quasi-diagonalizes the covariance matrix, and allocates capital through recursive bisection, avoiding matrix inversion entirely. Monte Carlo experiments show HRP delivers lower out-of-sample variance than CLA even though minimum variance is CLA's explicit objective, addressing the three central concerns of quadratic optimizers: instability, concentration, and underperformance.

---

### Market microstructure, price impact, limit order books, and optimal execution — recent reviews/surveys

The state of the art in this cluster is anchored by a handful of authoritative syntheses. Donnelly (2022, Applied Mathematical Finance) is the cleanest stand-alone review of two decades of optimal-execution theory, from Almgren-Chriss to stochastic/nonlinear-impact and benchmark-aware extensions; it pairs naturally with the book-length Bouchaud-Bonart-Donier-Gould "Trades, Quotes and Prices" (2018), the definitive modern reference on order-book dynamics, liquidity, and the square-root law of price impact. The frontier of price-impact research is captured by Said (2022), which unifies the empirical metaorder regularities, and by the Sato-Kanazawa (2025, PRL) complete-survey "critique" that settles the long-standing universality debate over the square-root exponent using all Tokyo Stock Exchange accounts. Machine-learning practice is covered by Hambly-Xu-Yang (2023, Mathematical Finance), the canonical RL-in-finance survey whose execution/market-making/SOR sections map this domain, and by Briola-Bartolucci-Aste (2024/2025) for deep-learning LOB forecasting. Together these give breadth (theory, empirics, ML), reputable venues, and verified DOIs/arXiv ids; the canonical Gould et al. (2013) LOB survey and Almgren-Chriss (2001) sit just outside the 2017 window and are recorded as snowball seeds.

#### Optimal Execution: A Review
*Ryan Donnelly* — 2022 · Applied Mathematical Finance, 29(3), 181-212 · cites: 16 · OA

DOI `10.1080/1350486X.2022.2161588` · [link](https://www.tandfonline.com/doi/full/10.1080/1350486X.2022.2161588)

**Why:** The single best stand-alone survey of optimal execution; covers subfields: limit-order-book mechanics and cost/risk structure, Almgren-Chriss-style baseline models, stochastic and nonlinear price impact, transient/permanent impact, benchmark-aware (TWAP/VWAP/IS) and non-liquidation objectives. The natural backbone reference for the execution half of this review.

> This review article is intended to collect and summarize many of the results in the field of optimal execution over the last twenty years. In doing so, we describe the foundations of how a limit order book operates in order to elucidate the costs and risks that one must seek to optimize. Early models of optimal execution assume relatively simple dynamics for asset prices that allow strategies to be computed which improve risk-adjusted returns. We then review more recent work that incorporates more complex dynamics such as stochastic and nonlinear price impact, as well as trading strategies in which an agent uses benchmarks in addition to (or instead of) wealth maximization, or pursues objectives other than simple liquidation. (Faithful summary of the published abstract.)

---

#### Trades, Quotes and Prices: Financial Markets Under the Microscope
*Jean-Philippe Bouchaud, Julius Bonart, Jonathan Donier, Martin Gould* — 2018 · Cambridge University Press (book)

DOI `10.1017/9781316659335` · [link](https://www.cambridge.org/core/books/trades-quotes-and-prices/029A71078EE4C41C0D5D4574211AB1B5)

**Why:** The definitive book-length review of modern market microstructure. Covers all four cluster subfields: limit-order-book statistics and dynamics, liquidity and order flow, the impact of market orders vs. metaorders, the square-root law of price impact, latent order books, and optimal trading/execution. The reference practitioners and researchers cite for the empirical-facts-plus-models view.

> The widespread availability of high-quality, high-frequency data has revolutionised the study of financial markets. By describing not only asset prices, but also the actions and interactions of market participants, this wealth of information offers a new window into the inner workings of the financial ecosystem. In this original text, the authors discuss empirical facts of financial markets and introduce a wide range of models, from the micro-scale mechanics of individual order books through to the emergent macro-scale issues of how prices evolve and behave. The book moves from classical models of market microstructure to the latest research, informed by years of practical trading experience. A unique feature is its dual focus on empirical data and the models that describe them, with the square-root law of market impact presented as the book's climax: institutions shape human behaviour, leading to a universal law for the relationship between fluctuations in supply and demand and their impact on prices. (Faithful summary of the publisher's description.)

---

#### Recent advances in reinforcement learning in finance
*Ben Hambly, Renyuan Xu, Huining Yang* — 2023 · Mathematical Finance, 33(3), 437-503 · cites: 287 · OA

DOI `10.1111/mafi.12382` · arXiv `2112.04553` · [link](https://onlinelibrary.wiley.com/doi/full/10.1111/mafi.12382)

**Why:** Authoritative, heavily cited survey of reinforcement learning in finance; its detailed sections on optimal execution, market making, and smart order routing map the ML-driven state of the art for trading in limit order books. Bridges classical stochastic-control execution models and modern deep-RL methods, complementing the analytic Donnelly review.

> The rapid changes in the finance industry due to the increasing amount of data have revolutionized the techniques on data processing and data analysis and brought new theoretical and computational challenges. In contrast to classical stochastic control theory and other analytical approaches for solving financial decision-making problems that heavily rely on model assumptions, new developments from reinforcement learning (RL) are able to make full use of the large amount of financial data with fewer model assumptions and to improve decisions in complex financial environments. This survey paper aims to review the recent developments and use of RL approaches in finance. We give an introduction to Markov decision processes, which is the setting for many of the commonly used RL approaches. Various algorithms are then introduced with a focus on value- and policy-based methods that do not require any model assumptions. Connections are made with neural networks to extend the framework to encompass deep RL algorithms. We then discuss in detail the application of these RL algorithms in a variety of decision-making problems in finance, including optimal execution, portfolio optimization, option pricing and hedging, market making, smart order routing, and robo-advising. Our survey concludes by pointing out a few possible future directions for research.

---

#### Strict universality of the square-root law in price impact across stocks: a complete survey of the Tokyo stock exchange
*Yuki Sato, Kiyoshi Kanazawa* — 2025 · Physical Review Letters, 135, 257401 (preprint arXiv:2411.13965) · cites: 2 · OA

DOI `10.1103/PhysRevLett.135.257401` · arXiv `2411.13965` · [link](https://arxiv.org/abs/2411.13965)

**Why:** An adversarial, comprehensive empirical survey/critique that settles the universality debate over the square-root price-impact exponent using a complete account-level census of the Tokyo Stock Exchange. Directly relevant to the price-impact subfield: it surveys competing impact models and rejects the Gabaix-GPS and Farmer-Gerig-Lillo-Waelbroeck nonuniversality theories, sharpening which impact models execution practitioners should use.

> Universal power laws have been scrutinised in physics and beyond, and a long-standing debate exists in econophysics regarding the strict universality of the nonlinear price impact, commonly referred to as the square-root law (SRL). The SRL posits that the average price impact I follows a power law with respect to transaction volume Q, such that I(Q) ~ Q^delta with delta about 1/2. Some researchers argue that the exponent delta should be system-specific, without universality. Conversely, others contend that delta should be exactly 1/2 for all stocks across all countries, implying universality. However, resolving this debate requires high-precision measurements of delta with errors of around 0.1 across hundreds of stocks, which has been extremely challenging due to the scarcity of large microscopic datasets -- those that enable tracking the trading behaviour of all individual accounts. Here we conclusively support the universality hypothesis of the SRL by a complete survey of all trading accounts for all liquid stocks on the Tokyo Stock Exchange (TSE) over eight years. Using this comprehensive microscopic dataset, we show that the exponent delta is equal to 1/2 within statistical errors at both the individual stock level and the individual trader level. Additionally, we rejected two prominent models supporting the nonuniversality hypothesis: the Gabaix-Gopikrishnan-Plerou-Stanley and the Farmer-Gerig-Lillo-Waelbroeck models (Nature 2003, QJE 2006, and Quant. Finance 2013). Our work provides exceptionally high-precision evidence for the universality hypothesis in social science and could prove useful in evaluating the price impact by large investors -- an important topic even among practitioners.

---

#### Market Impact: Empirical Evidence, Theory and Practice
*Emilio Said* — 2022 · arXiv preprint (q-fin.TR) · OA

arXiv `2205.07385` · [link](https://arxiv.org/abs/2205.07385)

**Why:** A theory-plus-empirical-review treatment of metaorder market impact that organizes the stylized facts (square-root temporary impact, ~2/3 permanent-impact ratio, ~3/2 trade-size tail) and links them to a single supply-demand parameter. Useful as a synthesis of the price-impact subfield and its connection to the excess-volatility puzzle and the order-driven market view, complementing the empirical Tokyo survey.

> We propose a theory of the market impact of metaorders based on a coarse-grained approach where the microscopic details of supply and demand is replaced by a single parameter rho in [0, +infinity] shaping the supply-demand equilibrium and the market impact process during the execution of the metaorder. Our model provides a unified explanation of most of the empirical observations that have been reported and establishes a strong connection between the excess volatility puzzle and the order-driven view of the markets through the square-root law. The framework reviews the empirical stylized facts of metaorder impact -- power-law trade-size distributions with tail exponent ~3/2, temporary impact growing as the square root of executed volume/duration, and permanent impact ~2/3 of peak impact -- and shows how a single supply-demand-equilibrium parameter reproduces them.

---

#### Deep limit order book forecasting: a microstructural guide
*Antonio Briola, Silvia Bartolucci, Tomaso Aste* — 2025 · Quantitative Finance, 25(7), 1101-1131 (preprint arXiv:2403.09267) · OA

DOI `10.1080/14697688.2025.2522911` · arXiv `2403.09267` · [link](https://arxiv.org/abs/2403.09267)

**Why:** A guide-style review-plus-benchmark of deep-learning forecasting on limit order books, surveying state-of-the-art architectures (CNN/LSTM/transformer, DeepLOB lineage) and exposing the gap between statistical forecasting power and actionable trading signals. Maps the ML/empirical frontier of the LOB subfield and supplies an open-source benchmarking framework (LOBFrame); useful as a critical orientation on the limits of deep LOB prediction. (Borderline review/empirical; included for its survey-of-methods scope.)

> We exploit cutting-edge deep learning methodologies to explore the predictability of high-frequency Limit Order Book mid-price changes for a heterogeneous set of stocks traded on the NASDAQ exchange. In so doing, we release 'LOBFrame', an open-source code base to efficiently process large-scale Limit Order Book data and quantitatively assess state-of-the-art deep learning models' forecasting capabilities. Our results are twofold. We demonstrate that the stocks' microstructural characteristics influence the efficacy of deep learning methods and that their high forecasting power does not necessarily correspond to actionable trading signals. We argue that traditional machine learning metrics fail to adequately assess the quality of forecasts in the Limit Order Book context. As an alternative, we propose an innovative operational framework that evaluates predictions' practicality by focusing on the probability of accurately forecasting complete transactions. This work offers academics and practitioners an avenue to make informed and robust decisions on the application of deep learning techniques, their scope and limitations, effectively exploiting emergent statistical properties of the Limit Order Book.

---

### Backtesting, multiple testing, data-snooping, and the replication crisis in quantitative finance — review/survey/critique articles (2014–2023)

This cluster maps the methodological reckoning in empirical finance over the past decade: the recognition that the "factor zoo" of hundreds of published return predictors is contaminated by multiple testing, data snooping, p-hacking, and backtest overfitting. Two complementary research programs anchor it: Harvey-Liu-Zhu and Harvey-Liu develop the formal multiple-testing machinery (raised t-stat hurdles, false-discovery-rate control, Type I vs Type II trade-offs) for evaluating factors and managers, while Bailey-Borwein-Lopez de Prado-Zhu and Arnott-Harvey-Markowitz translate these concerns into practitioner protocols against backtest overfitting in the machine-learning era. The cluster's central live debate is the replication question itself — Hou-Xue-Zhang argue most anomalies fail to replicate once microcaps are handled and proper methods applied, whereas Jensen-Kelly-Pedersen counter with a Bayesian replication model concluding most factors do replicate and survive out-of-sample across 93 countries. Together these six pieces define the problem statement, the statistical toolkit, and both sides of the empirical verdict for any critical review of quant-finance research methodology.

#### …and the Cross-Section of Expected Returns
*Campbell R. Harvey, Yan Liu, Heqing Zhu* — 2016 · The Review of Financial Studies, 29(1), 5–68 (Editor's Choice) · cites: 2300

DOI `10.1093/rfs/hhv059` · [link](https://doi.org/10.1093/rfs/hhv059)

**Why:** The canonical review that crystallized the 'factor zoo' / multiple-testing problem. Catalogues 300+ published factors and re-derives significance thresholds (t>3.0) under Bonferroni, Holm, and Benjamini-Hochberg/Yekutieli false-discovery-rate corrections. Subfields: multiple hypothesis testing, data snooping, cross-sectional asset pricing, publication bias, research methodology. The reference point every subsequent backtesting/replication paper cites.

> Hundreds of papers and factors attempt to explain the cross-section of expected returns. Given this extensive data mining, it does not make economic or statistical sense to use the usual significance criteria for a newly discovered factor, e.g., a t-ratio greater than 2.0. However, what hurdle should be used for current research? Our paper introduces a new multiple testing framework and provides historical cutoffs from the first empirical tests in 1967 to today. A new factor needs to clear a much higher hurdle, with a t-statistic greater than 3.0. We argue that most claimed research findings in financial economics are likely false.

---

#### False (and Missed) Discoveries in Financial Economics
*Campbell R. Harvey, Yan Liu* — 2020 · The Journal of Finance, 75(5), 2503–2553 · cites: 250 · OA

DOI `10.1111/jofi.12951` · arXiv `2006.04269` · [link](https://doi.org/10.1111/jofi.12951)

**Why:** Methodology-forward sequel to the 2016 review: moves beyond raising t-stat hurdles to jointly calibrating false discoveries (Type I) AND missed discoveries (Type II) via a double-bootstrap, allowing differential costs of the two errors. Subfields: multiple testing, false discovery rate, fund/manager selection, factor selection, statistical power. Essential for the 'how should we test' half of a methodology review.

> Multiple testing plagues many important questions in finance such as fund and factor selection. We propose a new way to calibrate both Type I and Type II errors. Next, using a double-bootstrap method, we establish a t-statistic hurdle that is associated with a specific false discovery rate (e.g., 5%). We also establish a hurdle that is associated with a certain acceptable ratio of misses to false discoveries (Type II error scaled by Type I error), which effectively allows for differential costs of the two types of mistakes. Evaluating current methods, we find that they lack power to detect outperforming managers.

---

#### Is There a Replication Crisis in Finance?
*Theis Ingerslev Jensen, Bryan Kelly, Lasse Heje Pedersen* — 2023 · The Journal of Finance, 78(5), 2465–2518 · cites: 450 · OA

DOI `10.1111/jofi.13249` · [link](https://doi.org/10.1111/jofi.13249)

**Why:** The optimistic, pro-replication side of the central debate, and a state-of-the-art demonstration of the right way to do multiple testing — a hierarchical Bayesian model that shares information across 153 factors rather than naively penalizing each. Subfields: replication crisis, factor zoo, Bayesian multiple testing, out-of-sample/international validation, taxonomy of factors (13 themes). Pairs adversarially with Hou-Xue-Zhang. Open dataset (Global Factor Data) is itself a community resource.

> Several papers argue that financial economics faces a replication crisis because the majority of studies cannot be replicated or are the result of multiple testing of too many factors. We develop and estimate a Bayesian model of factor replication, which leads to different conclusions. The majority of asset pricing factors: (1) can be replicated, (2) can be clustered into 13 themes, the majority of which are significant parts of the tangency portfolio, (3) work out-of-sample in a new large data set covering 93 countries, and (4) have evidence that is strengthened (not weakened) by the large number of observed factors.

---

#### Replicating Anomalies
*Kewei Hou, Chen Xue, Lu Zhang* — 2020 · The Review of Financial Studies, 33(5), 2019–2133 · cites: 1200

DOI `10.1093/rfs/hhy131` · [link](https://doi.org/10.1093/rfs/hhy131)

**Why:** The skeptical, pessimistic pole of the replication debate and the largest single replication exercise (452 anomalies). Demonstrates how methodological choices — microcap treatment, NYSE breakpoints, value- vs equal-weighting — drive replicability, a central data-handling lesson. Subfields: replication crisis, p-hacking, microcap/weighting biases, data snooping, anomaly taxonomy. Mandatory counterweight to Jensen-Kelly-Pedersen in any balanced review.

> The anomalies literature is infested with widespread p-hacking. We replicate the entire anomalies literature in finance and accounting by compiling a largest-to-date data library that contains 452 anomaly variables. With microcaps mitigated via NYSE breakpoints and value-weighted returns, 65% of the 452 anomalies cannot clear the single-test hurdle of t = 1.96. With the higher multiple-test hurdle of t = 2.78 imposed by Harvey, Liu, and Zhu (2016), 82% cannot survive. Imposing the t = 1.96 cutoff, the biggest casualties are in the categories of liquidity, intangibles, and trading frictions. The probability of finding spurious factors via p-hacking is high.

---

#### Pseudo-Mathematics and Financial Charlatanism: The Effects of Backtest Overfitting on Out-of-Sample Performance
*David H. Bailey, Jonathan M. Borwein, Marcos López de Prado, Qiji Jim Zhu* — 2014 · Notices of the American Mathematical Society, 61(5), 458–471 · cites: 280 · OA

DOI `10.1090/noti1105` · [link](https://doi.org/10.1090/noti1105)

**Why:** The foundational backtest-overfitting critique aimed squarely at quant practitioners and the strategy-search workflow. Introduces the 'minimum backtest length' and the idea that selecting the best of many backtested configurations guarantees an inflated in-sample Sharpe with no out-of-sample skill. Subfields: backtest overfitting, data snooping, out-of-sample degradation, Sharpe-ratio inflation, research integrity. Spawned the deflated/probabilistic Sharpe ratio and combinatorial cross-validation literatures.

> Recent computational advances allow investment managers to search for profitable investment strategies. In many instances that search involves a pseudo-mathematical argument which is spuriously validated through a backtest, i.e., a historical simulation of performance. We prove that high performance is easily achievable after backtesting a relatively small number of alternative strategy configurations, a practice we call 'backtest overfitting'. The higher the number of configurations tried, the greater is the probability that the backtest is overfit. Because financial analysts rarely report the number of configurations tried for a given backtest, investors cannot evaluate the degree of overfitting in most investment proposals. The implication is that investors can be easily misled into allocating capital to strategies that appear to be mathematically sound and empirically supported by an outstanding backtest. Standard statistical techniques designed to prevent regression overfitting, such as hold-out, are inadequate for the financial case. We show that overfitting reduces out-of-sample performance, and may even produce a negative performance. This is especially troublesome given the prevalence of financial time series exhibiting low signal-to-noise ratios.

---

#### A Backtesting Protocol in the Era of Machine Learning
*Robert D. Arnott, Campbell R. Harvey, Harry Markowitz* — 2019 · The Journal of Financial Data Science, 1(1), 64–74 · cites: 130 · OA

DOI `10.3905/jfds.2019.1.064` · [link](https://doi.org/10.3905/jfds.2019.1.064)

**Why:** The practitioner-facing synthesis that distills the multiple-testing and overfitting literature into a concrete seven-point research protocol (establish economic rationale, avoid HARKing, beware overfitting, document trials, cross-validate, etc.). Co-authored by Harry Markowitz, giving it canonical weight. Subfields: research methodology/protocol, machine learning in finance, backtest overfitting, data snooping, scientific integrity. The natural 'best practices' anchor for the methodology section of a critical review.

> Machine learning offers a set of powerful tools that holds considerable promise for investment management. As with most quantitative applications in finance, the danger of misapplying these techniques can lead to disappointment. One crucial limitation involves data availability. Many of machine learning's early successes originated in the physical and biological sciences, in which truly vast amounts of data are available. Machine learning applications often require far more data than are available in finance, which is of particular concern in longer-horizon investing. Hence, choosing the right applications before applying the tools is important. In addition, capital markets reflect the actions of people, who may be influenced by the actions of others and by the findings of past research. In many ways, the challenges that affect machine learning are merely a continuation of the long-standing issues researchers have always faced in quantitative finance. Although investors need to be cautious—indeed, more cautious than in past applications of quantitative methods—these new tools offer many potential applications in finance. In this article, the authors develop a research protocol that pertains both to the application of machine learning techniques and to quantitative finance in general.

---

