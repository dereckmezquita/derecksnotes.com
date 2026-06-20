# Cross-market transfer learning & meta-learning of trading strategies

This collection maps how trading strategies and predictive models can be shared across markets and assets rather than fit one market at a time. The canonical pillar is QuantNet (Koshiyama et al.), which factorises a strategy into market-specific encoder/decoder pairs plus a shared market-agnostic global model trained over 3,103 assets in 58 markets; it is best read alongside the Oxford-MAN "deep momentum / spatio-temporal momentum" line (Lim, Tan, Zohren, Roberts) and Gu-Kelly-Xiu empirical asset pricing via ML, which establish that a single neural model can learn transferable, cross-sectional signals. A second cluster covers domain adaptation and online/inductive transfer learning (Borrageiro et al. RBF-to-RL feature-representation transfer across FX and crypto; continual learning; meta-learning strategy mixtures; RL with online-meta-learned market embeddings), while a third targets the hard case of thinly-traded / data-scarce assets (multi-source transfer for new-issue/spin-off volatility; DTRSI pretrain-then-fine-tune across the Korean and US markets) and "market phenotyping" via Wasserstein regime clustering. Recent 2024-2026 frontier work (transfer-learning systematic review, FinTSB benchmark, and a sober evaluation of time-series foundation models) cautions that off-the-shelf generic pretraining transfers poorly and that finance-native, domain-specific adaptation is what actually pays — a key open tension for the field.

**Completeness critic:** The already-gathered list anchors well on QuantNet, momentum DL (Lim/Tan/Zohren), and several transfer/meta-learning surveys, but it is missing the tightly-on-topic cluster of Oxford-Man Institute papers that directly tackle cross-market/cross-asset transfer and few-/zero-shot adaptation: Transfer Ranking (Poh et al.), X-Trend / Few-Shot Learning Patterns (Wood et al.), Building Cross-Sectional Strategies by Learning to Rank (Poh et al.), and Deep Inception Networks (Liu et al.). It also lacks the main theoretical contribution on WHEN transfer helps — Cao, Gu, Guo & Rosenbaum's "transfer risk" — and the canonical RL-transfer (Jeong & Kim) and deep-transfer-across-regions (RIC-NN / Nakagawa et al.) works. On the meta-learning side, the sub-new-stock and zero-shot/emerging-market angle (Meta-Stock, DoubleAdapt, Adapting to the Unknown, Dual-Process volume meta-learning) is uncovered. I prioritized these 12.

Accuracy notes / caveats:
- Citation counts: I could verify Wood et al. (=9 via Semantic Scholar) but Semantic Scholar rate-limited (HTTP 429) for most others, so I set citationCount=null rather than guess. arXiv-only papers generally have modest counts.
- Venue/DOI: Wood et al. published in J. of Financial Data Science (DOI 10.3905/jfds.2024.1.157 from Semantic Scholar). Poh et al. "Transfer Ranking" appeared in the Journal of Systematic Investing 2023 vol.2 iss.2 but I could not verify a journal DOI, so DOI=null and I cite arXiv. Cao et al. is arXiv/SSRN preprint (SSRN id 4624427), no confirmed journal DOI. Jeong & Kim DOI (10.1016/j.eswa.2018.09.036) is well-attested across ScienceDirect/Yonsei.
- Possible dubious/borderline: "Portfolio Optimization via Transfer Learning" (Wang, Zhang, Zhang 2025, arXiv 2511.21221) is very new (Nov 2025) and unvetted; included because it is squarely on cross-market info transfer (dual-listed CN/US stocks), but treat as frontier/unverified. "Stock Trading Volume Prediction with Dual-Process Meta-Learning" is meta-learning across stocks but the target is volume, not a trading strategy per se — included as a method exemplar, lower priority.
- All arXiv IDs and abstracts were fetched directly from the arXiv API (verbatim/faithful). A handful of abstracts returned by the fetch model were lightly paraphrased rather than fully verbatim; I have flagged none as fabricated.

---

#### QuantNet: Transferring Learning Across Systematic Trading Strategies
*Adriano Koshiyama, Sebastian Flennerhag, Stefano B. Blumberg, Nick Firoozye, Philip Treleaven* — 2020 · arXiv preprint (cs.LG); later Quantitative Finance, 2021 · OA

DOI `10.48550/arXiv.2004.03445` · arXiv `2004.03445` · [link](https://arxiv.org/abs/2004.03445)

**Why:** The defining paper for the topic: explicitly factorises trading into market-specific vs market-agnostic parameters and transfers learning across 58 markets to beat per-market models.

> Systematic financial trading strategies account for over 80% of trade volume in equities and a large chunk of the foreign exchange market. In spite of the availability of data from multiple markets, current approaches in trading rely mainly on learning trading strategies per individual market. In this paper, we take a step towards developing fully end-to-end global trading strategies that leverage systematic trends to produce superior market-specific trading strategies. We introduce QuantNet: an architecture that learns market-agnostic trends and use these to learn superior market-specific trading strategies. Each market-specific model is composed of an encoder-decoder pair. The encoder transforms market-specific data into an abstract latent representation that is processed by a global model shared by all markets, while the decoder learns a market-specific trading strategy based on both local and global information from the market-specific encoder and the global model. QuantNet uses recent advances in transfer and meta-learning, where market-specific parameters are free to specialize on the problem at hand, whilst market-agnostic parameters are driven to capture signals from all markets. By integrating over idiosyncratic market data we can learn general transferable dynamics, avoiding the problem of overfitting to produce strategies with superior returns. We evaluate QuantNet on historical data across 3103 assets in 58 global equity markets. Against the top performing baseline, QuantNet yielded 51% higher Sharpe and 69% Calmar ratios. In addition we show the benefits of our approach over the non-transfer learning variant, with improvements of 15% and 41% in Sharpe and Calmar ratios.

**Snowball:** Finn, Abbeel, Levine (2017) Model-Agnostic Meta-Learning (MAML) (arXiv:1703.03400); Bailey et al. (2014) The Probability of Backtest Overfitting (10.21314/JCF.2016.322); Moody & Saffell (2001) Learning to Trade via Direct Reinforcement (10.1109/72.935097)

---

#### Enhancing Time Series Momentum Strategies Using Deep Neural Networks
*Bryan Lim, Stefan Zohren, Stephen Roberts* — 2019 · The Journal of Financial Data Science (Fall 2019); arXiv (stat.ML) · OA

DOI `10.48550/arXiv.1904.04912` · arXiv `1904.04912` · [link](https://arxiv.org/abs/1904.04912)

**Why:** Canonical 'one network, many assets' deep trading model: a single Sharpe-optimised LSTM learns a transferable strategy shared across 88 futures, the architectural precursor to cross-market transfer.

> While time series momentum is a well-studied phenomenon in finance, common strategies require the explicit definition of both a trend estimator and a position sizing rule. In this paper, we introduce Deep Momentum Networks -- a hybrid approach which injects deep learning based trading rules into the volatility scaling framework of time series momentum. The model also simultaneously learns both trend estimation and position sizing in a data-driven manner, with networks directly trained by optimising the Sharpe ratio of the signal. Backtesting on a portfolio of 88 continuous futures contracts, we demonstrate that the Sharpe-optimised LSTM improved traditional methods by more than two times in the absence of transactions costs, and continue outperforming when considering transaction costs up to 2-3 basis points. To account for more illiquid assets, we also propose a turnover regularisation term which trains the network to factor in costs at run-time.

**Snowball:** Moskowitz, Ooi, Pedersen (2012) Time Series Momentum (10.1016/j.jfineco.2011.11.003); Zhang, Zohren, Roberts (2019) Deep Reinforcement Learning for Trading (arXiv:1911.10107)

---

#### Spatio-Temporal Momentum: Jointly Learning Time-Series and Cross-Sectional Strategies
*Wee Ling Tan, Stephen Roberts, Stefan Zohren* — 2023 · The Journal of Financial Data Science (Summer 2023); arXiv (q-fin.PM) · OA

DOI `10.3905/jfds.2023.1.130` · arXiv `2302.10175` · [link](https://arxiv.org/abs/2302.10175)

**Why:** Learns a single market-agnostic mapping that simultaneously trades all assets in a portfolio by sharing cross-sectional features over time — a concrete shared-representation alternative to per-asset models.

> We introduce Spatio-Temporal Momentum strategies, a class of models that unify both time-series and cross-sectional momentum strategies by trading assets based on their cross-sectional momentum features over time. While both time-series and cross-sectional momentum strategies are designed to systematically capture momentum risk premia, these strategies are regarded as distinct implementations and do not consider the concurrent relationship and predictability between temporal and cross-sectional momentum features of different assets. We model spatio-temporal momentum with neural networks of varying complexities and demonstrate that a simple neural network with only a single fully connected layer learns to simultaneously generate trading signals for all assets in a portfolio by incorporating both their time-series and cross-sectional momentum features. Backtesting on portfolios of 46 actively-traded US equities and 12 equity index futures contracts, we demonstrate that the model is able to retain its performance over benchmarks in the presence of high transaction costs of up to 5-10 basis points. In particular, we find that the model when coupled with least absolute shrinkage and turnover regularization results in the best performance over various transaction cost scenarios.

**Snowball:** Lim, Zohren, Roberts (2019) Enhancing Time Series Momentum Using DNNs (arXiv:1904.04912); Jegadeesh & Titman (1993) Returns to Buying Winners and Selling Losers (10.1111/j.1540-6261.1993.tb04702.x)

---

#### Empirical Asset Pricing via Machine Learning
*Shihao Gu, Bryan T. Kelly, Dacheng Xiu* — 2020 · The Review of Financial Studies, 33(5), 2223-2273

DOI `10.1093/rfs/hhaa009` · [link](https://academic.oup.com/rfs/article/33/5/2223/5758276)

**Why:** The empirical foundation for market-agnostic representations: a single ML model trained pooled across thousands of stocks learns transferable risk-premium signals, the asset-pricing rationale for cross-market sharing.

> We perform a comparative analysis of machine learning methods for the canonical problem of empirical asset pricing: measuring asset risk premiums. We demonstrate large economic gains to investors using machine learning forecasts, in some cases doubling the performance of leading regression-based strategies from the literature. We identify the best-performing methods (trees and neural networks) and trace their predictive gains to allowance of nonlinear predictor interactions missed by other methods. All methods agree on a relatively small set of dominant predictive signals, including variations on momentum, liquidity, and volatility. (Faithful summary of the published abstract.)

**Snowball:** Kelly, Pruitt, Su (2019) Characteristics Are Covariances (IPCA) (10.1016/j.jfineco.2019.05.001); Chen, Pelger, Zhu (2024) Deep Learning in Asset Pricing (10.1287/mnsc.2023.4695)

---

#### Reinforcement Learning for Systematic FX Trading
*Gabriel Borrageiro, Nick Firoozye, Paolo Barucca* — 2021 · IEEE Access, vol. 10, pp. 5024-5036 (2022); arXiv (q-fin.TR) · OA

DOI `10.1109/ACCESS.2021.3139510` · arXiv `2110.04745` · [link](https://arxiv.org/abs/2110.04745)

**Why:** Concrete instance of online inductive transfer learning in trading: a learned RBF feature space is transferred into an RL agent, demonstrating feature-representation transfer across FX pairs.

> We explore online inductive transfer learning, with a feature representation transfer from a radial basis function network formed of Gaussian mixture model hidden processing units to a direct, recurrent reinforcement learning agent. This agent is put to work in an experiment, trading the major spot market currency pairs, where we accurately account for transaction and funding costs. These sources of profit and loss, including the price trends that occur in the currency markets, are made available to the agent via a quadratic utility, who learns to target a position directly. We improve upon earlier work by targeting a risk position in an online transfer learning context. Our agent achieves an annualised portfolio information ratio of 0.52 with a compound return of 9.3%, net of execution and funding cost, over a 7-year test set; this is despite forcing the model to trade at the close of the trading day at 5 pm EST when trading costs are statistically the most expensive.

**Snowball:** Moody & Saffell (2001) Learning to Trade via Direct Reinforcement (10.1109/72.935097); Pan & Yang (2010) A Survey on Transfer Learning (10.1109/TKDE.2009.191)

---

#### The Recurrent Reinforcement Learning Crypto Agent
*Gabriel Borrageiro, Nick Firoozye, Paolo Barucca* — 2022 · IEEE Access, vol. 10, pp. 38590-38599 (2022); arXiv (cs.LG) · OA

DOI `10.1109/ACCESS.2022.3166599` · arXiv `2201.04699` · [link](https://arxiv.org/abs/2201.04699)

**Why:** Extends the online-transfer-learning trading paradigm to a thinly-modelled, distinct asset class (crypto derivatives), showing the same transfer template ports across markets.

> We demonstrate a novel application of online transfer learning for a digital assets trading agent. This agent uses a powerful feature space representation in the form of an echo state network, the output of which is made available to a direct, recurrent reinforcement learning agent. The agent learns to trade the XBTUSD (Bitcoin versus US Dollars) perpetual swap derivatives contract on BitMEX on an intraday basis. By learning from the multiple sources of impact on the quadratic risk-adjusted utility that it seeks to maximise, the agent avoids excessive over-trading, captures a funding profit, and can predict the market's direction. Overall, our crypto agent realises a total return of 350%, net of transaction costs, over roughly five years, 71% of which is down to funding profit. The annualised information ratio that it achieves is 1.46.

**Snowball:** Jaeger (2001) Echo State Networks; Borrageiro, Firoozye, Barucca (2022) RL for Systematic FX Trading (10.1109/ACCESS.2021.3139510)

---

#### Online Learning with Radial Basis Function Networks
*Gabriel Borrageiro, Nick Firoozye, Paolo Barucca* — 2021 · arXiv preprint (cs.CE) · OA

DOI `10.48550/arXiv.2103.08414` · arXiv `2103.08414` · [link](https://arxiv.org/abs/2103.08414)

**Why:** Methodological backbone for the Borrageiro transfer-trading agents: shows how feature-representation transfer plus online optimisation handles the covariate shift / concept drift that breaks naive cross-market transfer.

> Financial time series are characterised by their nonstationarity and autocorrelation. Even if these time series are differenced, technically ensuring their stationarity, they experience regular covariate shifts and concept drifts. Against this backdrop, we combine feature representation transfer with sequential optimisation to provide multi-horizon returns forecasts. Our online learning rbfnet outperforms a random-walk baseline and several powerful batch learners. The rbfnets we formulate are naturally designed to measure the similarity between test samples and continuously updated prototypes that capture the characteristics of the feature space.

**Snowball:** Gama et al. (2014) A Survey on Concept Drift Adaptation (10.1145/2523813)

---

#### Continual Learning Augmented Investment Decisions
*Daniel Philps, Tillman Weyde, Artur d'Avila Garcez, Roy Batchelor* — 2018 · arXiv preprint (cs.LG); NeurIPS 2018 Workshop (Challenges & Opportunities for AI in Financial Services) · OA

DOI `10.48550/arXiv.1812.02340` · arXiv `1812.02340` · [link](https://arxiv.org/abs/1812.02340)

**Why:** Tackles transfer-over-time within a broad international universe via explicit memory and change-point recall — a continual-learning view of reusing knowledge across regimes and markets.

> Investment decisions can benefit from incorporating an accumulated knowledge of the past to drive future decision making. We introduce Continual Learning Augmentation (CLA) which is based on an explicit memory structure and a feed forward neural network (FFNN) base model and used to drive long term financial investment decisions. We demonstrate that our approach improves accuracy in investment decision making while memory is addressed in an explainable way. Our approach introduces novel remember cues, consisting of empirically learned change points in the absolute error series of the FFNN. Memory recall is also novel, with contextual similarity assessed over time by sampling distances using dynamic time warping (DTW). We demonstrate the benefits of our approach by using it in an expected return forecasting task to drive investment decisions. In an investment simulation in a broad international equity universe between 2003-2017, our approach significantly outperforms FFNN base models.

**Snowball:** Kirkpatrick et al. (2017) Overcoming Catastrophic Forgetting (EWC) (10.1073/pnas.1611835114); Sakoe & Chiba (1978) Dynamic Time Warping (10.1109/TASSP.1978.1163055)

---

#### Meta-Learning the Optimal Mixture of Strategies for Online Portfolio Selection
*Jiayu Shen, Jia Liu, Zhiping Chen* — 2025 · arXiv preprint (q-fin.PM / cs.LG) · OA

DOI `10.48550/arXiv.2505.03659` · arXiv `2505.03659` · [link](https://arxiv.org/abs/2505.03659)

**Why:** Directly operationalises meta-learning strategy selection: MAML-style initial parameters that rapidly adapt, plus regime-clustered candidate policies whose mixture is meta-learned — explicitly tested for cross-dataset transferability.

> This paper presents an innovative online portfolio selection model, situated within a meta-learning framework, that leverages a mixture policies strategy. The core idea is to simulate a fund that employs multiple fund managers, each skilled in handling different market environments, and dynamically allocate our funding to these fund managers for investment. To address the non-stationary nature of financial markets, we divide the long-term process into multiple short-term processes to adapt to changing environments. We use a clustering method to identify a set of historically high-performing policies, characterized by low similarity, as candidate policies. Additionally, we employ a meta-learning method to search for initial parameters that can quickly adapt to upcoming target investment tasks, effectively providing a set of well-suited initial strategies. Subsequently, we update the initial parameters using the target tasks and determine the optimal mixture weights for these candidate policies. Empirical tests show that our algorithm excels in terms of training time and data requirements, making it particularly suitable for high-frequency algorithmic trading. To validate the effectiveness of our method, we conduct numerical tests on cross-training datasets, demonstrating its excellent transferability and robustness.

**Snowball:** Finn, Abbeel, Levine (2017) MAML (arXiv:1703.03400); Li & Hoi (2014) Online Portfolio Selection: A Survey (10.1145/2512962)

---

#### Reinforcement-Learning Portfolio Allocation with Dynamic Embedding of Market Information
*Jinghai He, Cheng Hua, Chunyang Zhou, Zeyu Zheng* — 2025 · arXiv preprint (q-fin.PM) · OA

DOI `10.48550/arXiv.2501.17992` · arXiv `2501.17992` · [link](https://arxiv.org/abs/2501.17992)

**Why:** Couples online meta-learning with a generative-autoencoder market embedding so an RL allocator adapts across non-stationary regimes — a learned market-agnostic latent state for transfer under distribution shift.

> We develop a portfolio allocation framework that leverages deep learning techniques to address challenges arising from high-dimensional, non-stationary, and low-signal-to-noise market information. Our approach includes a dynamic embedding method that reduces the non-stationary, high-dimensional state space into a lower-dimensional representation. We design a reinforcement learning (RL) framework that integrates generative autoencoders and online meta-learning to dynamically embed market information, enabling the RL agent to focus on the most impactful parts of the state space for portfolio allocation decisions. Empirical analysis based on the top 500 U.S. stocks demonstrates that our framework outperforms common portfolio benchmarks and the predict-then-optimize (PTO) approach using machine learning, particularly during periods of market stress. Traditional factor models do not fully explain this superior performance. The framework's ability to time volatility reduces its market exposure during turbulent times. Ablation studies confirm the robustness of this performance across various reinforcement learning algorithms.

**Snowball:** Jiang, Xu, Liang (2017) A Deep RL Framework for the Portfolio Management Problem (arXiv:1706.10059); Gu, Kelly, Xiu (2020) Empirical Asset Pricing via ML (10.1093/rfs/hhaa009)

---

#### Clustering Market Regimes using the Wasserstein Distance
*Blanka Horvath, Zacharia Issa, Aitor Muguruza* — 2021 · arXiv preprint (q-fin.ST / stat.ML) · OA

DOI `10.48550/arXiv.2110.11848` · arXiv `2110.11848` · [link](https://arxiv.org/abs/2110.11848)

**Why:** Core 'market phenotyping' method: a model-free Wasserstein k-means that clusters time series into regime types, providing the phenotype labels that condition or gate which transferred strategy to deploy.

> The problem of rapid and automated detection of distinct market regimes is a topic of great interest to financial mathematicians and practitioners alike. In this paper, we outline an unsupervised learning algorithm for clustering financial time-series into a suitable number of temporal segments (market regimes). As a special case of the above, we develop a robust algorithm that automates the process of classifying market regimes. The method is robust in the sense that it does not depend on modelling assumptions of the underlying time series as our experiments with real datasets show. This method -- dubbed the Wasserstein k-means algorithm -- frames such a problem as one on the space of probability measures with finite pth moment, in terms of the p-Wasserstein distance between (empirical) distributions. We compare our WK-means approach with a more traditional clustering algorithms by studying the so-called maximum mean discrepancy scores between, and within clusters. In both cases it is shown that the WK-means algorithm vastly outperforms all considered competitor approaches. We demonstrate the performance of all approaches both in a controlled environment on synthetic data, and on real data.

**Snowball:** Hamilton (1989) A New Approach to the Economic Analysis of Nonstationary Time Series (Regime Switching) (10.2307/1912559); Gretton et al. (2012) A Kernel Two-Sample Test (MMD)

---

#### Realized Volatility Forecasting for New Issues and Spin-Offs using Multi-Source Transfer Learning
*Andreas Teller, Uta Pigorsch, Christian Pigorsch* — 2025 · arXiv preprint (q-fin.ST); submitted to International Journal of Forecasting · OA

DOI `10.48550/arXiv.2503.12648` · arXiv `2503.12648` · [link](https://arxiv.org/abs/2503.12648)

**Why:** Directly targets transfer to thinly-traded / data-scarce assets: instance-based multi-source transfer for new issues and spin-offs with almost no history — the canonical cold-start transfer use case.

> Forecasting the volatility of financial assets is essential for various financial applications. This paper addresses the challenging task of forecasting the volatility of financial assets with limited historical data, such as new issues or spin-offs, by proposing a multi-source transfer learning approach. Specifically, we exploit complementary source data of assets with a substantial historical data record by selecting source time series instances that are most similar to the limited target data of the new issue/spin-off. Based on these instances and the target data, we estimate linear and non-linear realized volatility models and compare their forecasting performance to forecasts of models trained exclusively on the target data, and models trained on the entire source and target data. The results show that our transfer learning approach outperforms the alternative models and that the integration of complementary data is also beneficial immediately after the initial trading day of the new issue/spin-off.

**Snowball:** Corsi (2009) A Simple Approximate Long-Memory Model of Realized Volatility (HAR) (10.1093/jjfinec/nbp001); Weiss, Khoshgoftaar, Wang (2016) A Survey of Transfer Learning (10.1186/s40537-016-0043-6)

---

#### A Novel Approach to Short-Term Stock Price Movement Prediction using Transfer Learning
*Thi-Thu Nguyen, Seokhoon Yoon* — 2019 · Applied Sciences, 9(22), 4745 · OA

DOI `10.3390/app9224745` · [link](https://www.mdpi.com/2076-3417/9/22/4745)

**Why:** Clean pretrain-on-many-stocks / fine-tune-on-target template evaluated across the Korean and US markets — an explicit cross-market transfer-learning baseline for data-scarce targets.

> The authors propose DTRSI (Deep Transfer with Related Stock Information), a two-phase LSTM framework for short-term stock price movement prediction. In the first phase, a base LSTM model is pre-trained on a large amount of data drawn from many different stocks to optimise initial parameters; in the second phase the base model is fine-tuned with a small amount of target-stock data. The approach is designed to mitigate overfitting caused by insufficient target training samples and to exploit relationships between stocks. Evaluated on the Korean (KOSPI) and US stock markets, DTRSI outperforms baselines such as SVM, random forest and k-NN in average prediction accuracy, demonstrating the benefit of cross-stock and cross-market pretraining followed by target fine-tuning. (Faithful summary of the published abstract.)

**Snowball:** Pan & Yang (2010) A Survey on Transfer Learning (10.1109/TKDE.2009.191); Hochreiter & Schmidhuber (1997) Long Short-Term Memory (10.1162/neco.1997.9.8.1735)

---

#### Transfer learning for financial data predictions: a systematic review
*V. Lanzetta* — 2024 · arXiv preprint (q-fin.TR) · OA

DOI `10.48550/arXiv.2409.17183` · arXiv `2409.17183` · [link](https://arxiv.org/abs/2409.17183)

**Why:** The dedicated systematic review of transfer learning for financial prediction — the natural survey backbone and entry point into the cross-market transfer literature.

> Literature highlighted that financial time series data pose significant challenges for accurate stock price prediction, because these data are characterized by noise and susceptibility to news; traditional statistical methodologies made assumptions, such as linearity and normality, which are not suitable for the non-linear nature of financial time series; on the other hand, machine learning methodologies are able to capture non linear relationship in the data. To date, neural network is considered the main machine learning tool for the financial prices prediction. Transfer Learning, as a method aimed at transferring knowledge from source tasks to target tasks, can represent a very useful methodological tool for getting better financial prediction capability. Current reviews on the above body of knowledge are mainly focused on neural network architectures, for financial prediction, with very little emphasis on the transfer learning methodology; thus, this paper is aimed at going deeper on this topic by developing a systematic review with respect to application of Transfer Learning for financial market predictions and to challenges/potential future directions of the transfer learning methodologies for stock market predictions.

**Snowball:** Zhuang et al. (2021) A Comprehensive Survey on Transfer Learning (10.1109/JPROC.2020.3004555); Sezer, Gudelek, Ozbayoglu (2020) Financial Time Series Forecasting with Deep Learning: A Review 2005-2019 (arXiv:1911.13288)

---

#### Re(Visiting) Time Series Foundation Models in Finance
*Eghbal Rahimikia, Hao Ni, Weiguan Wang* — 2025 · arXiv preprint (q-fin / cs.LG) · OA

DOI `10.48550/arXiv.2511.18578` · arXiv `2511.18578` · [link](https://arxiv.org/abs/2511.18578)

**Why:** Frontier and partly critical: directly tests cross-market zero-shot/fine-tuned transfer of foundation models on global excess returns and finds generic pretraining transfers poorly — finance-native pretraining is what works, a key caveat for the whole transfer agenda.

> Financial time series forecasting is central to trading, portfolio optimization, and risk management, yet it remains challenging due to noisy, non-stationary, and heterogeneous data. Recent advances in time series foundation models (TSFMs), inspired by large language models, offer a new paradigm for learning generalizable temporal representations from large and diverse datasets. This paper presents the first comprehensive empirical study of TSFMs in global financial markets. Using a large-scale dataset of daily excess returns across diverse markets, we evaluate zero-shot inference, fine-tuning, and pre-training from scratch against strong benchmark models. We find that off-the-shelf pre-trained TSFMs perform poorly in zero-shot and fine-tuning settings, whereas models pre-trained from scratch on financial data achieve substantial forecasting and economic improvements, underscoring the value of domain-specific adaptation. Increasing the dataset size, incorporating synthetic data augmentation, and applying hyperparameter tuning further enhance performance.

**Snowball:** Ansari et al. (2024) Chronos: Learning the Language of Time Series (arXiv:2403.07815); Das et al. (2024) TimesFM: A Decoder-Only Foundation Model for Time-Series Forecasting (arXiv:2310.10688)

---

#### FinTSB: A Comprehensive and Practical Benchmark for Financial Time Series Forecasting
*Yifan Hu, Yuante Li, Peiyuan Liu, Yuxia Zhu, Naiqi Li, Tao Dai, Shu-tao Xia, Dawei Cheng, Changjun Jiang* — 2025 · arXiv preprint (q-fin / cs.LG); Frontiers of Computer Science 2026 · OA

DOI `10.48550/arXiv.2502.18834` · arXiv `2502.18834` · [link](https://arxiv.org/abs/2502.18834)

**Why:** Key benchmark/dataset for the topic: standardised, multi-pattern evaluation that explicitly supports transfer-learning and cross-market backtests, enabling fair comparison of market-agnostic vs market-specific models.

> Financial time series (FinTS) record human-brain-augmented decision-making and capture valuable historical information that can be leveraged for profitable investment strategies. FinTSB is proposed to address three limitations of existing financial time series forecasting (FinTSF) evaluation: a diversity gap in stock movement patterns, a standardization deficit in evaluation protocols, and a real-world mismatch in practical applicability. The benchmark categorizes stock movement patterns into four types, provides standardized ranking-, portfolio-, and error-based metrics, and models real-world regulatory constraints such as transaction fees. It evaluates a broad set of forecasting methods (including statistical, ML, deep learning and foundation models) under a unified protocol and supports transfer-learning style experiments (e.g., backtesting pretrained models on the 2024 CSI 300 market), offering a reproducible platform for benchmarking cross-market and transferable FinTSF methods. (Faithful summary.)

**Snowball:** Yang et al. (2020) Qlib: An AI-oriented Quantitative Investment Platform (arXiv:2009.11189); Rahimikia, Ni, Wang (2025) Re(Visiting) Time Series Foundation Models in Finance (arXiv:2511.18578)

---

#### Empirical Asset Pricing via Machine Learning (NBER Working Paper version)
*Shihao Gu, Bryan T. Kelly, Dacheng Xiu* — 2018 · NBER Working Paper No. 25398 · OA

DOI `10.3386/w25398` · [link](https://www.nber.org/papers/w25398)

**Why:** Open-access working-paper version of the canonical pooled-ML asset-pricing study, providing the freely available PDF for the cross-sectional, market-agnostic representation argument.

> We perform a comparative analysis of machine learning methods for the canonical problem of empirical asset pricing: measuring asset risk premiums. We demonstrate large economic gains to investors using machine learning forecasts, in some cases doubling the performance of leading regression-based strategies from the literature. We identify the best-performing methods (trees and neural networks) and trace their predictive gains to allowance of nonlinear predictor interactions missed by other methods. All methods agree on a relatively small set of dominant predictive signals, including variations on momentum, liquidity, and volatility. (Faithful summary of the NBER working paper abstract.)

**Snowball:** Freyberger, Neuhierl, Weber (2020) Dissecting Characteristics Nonparametrically (10.1093/rfs/hhz007)

---

#### Transfer Ranking in Finance: Applications to Cross-Sectional Momentum with Data Scarcity
*Daniel Poh, Stephen Roberts, Stefan Zohren* — 2022 · arXiv preprint (also Journal of Systematic Investing, 2023, vol. 2 iss. 2) · OA · completeness-add

arXiv `2208.09968` · [link](https://arxiv.org/abs/2208.09968)

**Why:** Directly addresses transferring cross-sectional trading strategies from data-rich to thinly-traded/short-history assets via a parameter-sharing transfer ranking architecture — the core of cross-market strategy transfer for emerging assets.

> Cross-sectional strategies are a classical and popular trading style, with recent high-performing variants incorporating sophisticated neural architectures. While these strategies have been applied successfully to data-rich settings involving mature assets with long histories, deploying them on instruments with limited samples generally produces over-fitted models with degraded performance. To address this, the authors introduce Fused Encoder Networks, a hybrid parameter-sharing transfer ranking model. The model fuses information extracted using an encoder-attention module operating exclusively on the target (data-scarce) dataset with a similar module operating on the source (data-rich) dataset, allowing knowledge transfer from data-rich to data-scarce assets and boosting cross-sectional momentum performance on instruments with short histories.

**Snowball:** Poh, Lim, Zohren, Roberts - Building Cross-Sectional Systematic Strategies by Learning to Rank (2021) (arXiv:2012.07149); Koshiyama, Flennerhag, Blumberg, Firoozye, Treleaven - QuantNet (2020) (arXiv:2004.03445); Lim, Zohren, Roberts - Enhancing Time-Series Momentum with DNNs (2019) (10.3905/jfds.2019.1.015); Jegadeesh, Titman - Returns to Buying Winners and Selling Losers (1993) (10.1111/j.1540-6261.1993.tb04702.x)

---

#### Few-Shot Learning Patterns in Financial Time-Series for Trend-Following Strategies
*Kieran Wood, Samuel Kessler, Stephen J. Roberts, Stefan Zohren* — 2023 · The Journal of Financial Data Science · cites: 9 · OA · completeness-add

DOI `10.3905/jfds.2024.1.157` · arXiv `2310.10500` · [link](https://arxiv.org/abs/2310.10500)

**Why:** Few-shot/zero-shot transfer of trend-following strategies to unseen assets and new regimes via cross-attention over a context set — a leading method for transfer to thinly-traded/novel assets.

> Forecasting models for systematic trading strategies do not adapt quickly when financial market conditions rapidly change, as was seen at the advent of the COVID-19 pandemic in 2020, causing many forecasting models to take loss-making positions. To deal with such situations, the authors propose a novel time-series trend-following forecaster that can quickly adapt to new market conditions, referred to as regimes, leveraging few-shot learning. They propose the Cross Attentive Time-Series Trend Network (X-Trend), which takes positions by attending over a context set of financial time-series regimes. X-Trend transfers trends from similar patterns in the context set to make forecasts and take positions for a new, distinct target regime. By quickly adapting to new regimes, X-Trend increases Sharpe ratio by 18.9% over a neural forecaster and 10-fold over a conventional time-series momentum strategy during 2018-2023, recovers twice as fast from the COVID-19 drawdown, and can take zero-shot positions on novel unseen assets for a 5-fold Sharpe increase versus a neural forecaster. The cross-attention mechanism enables interpretation of the relationship between forecasts and context patterns.

**Snowball:** Wood, Giegerich, Roberts, Zohren - Trading with the Momentum Transformer (2022) (arXiv:2112.08534); Vaswani et al. - Attention Is All You Need (2017) (arXiv:1706.03762); Snell, Swersky, Zemel - Prototypical Networks for Few-Shot Learning (2017) (arXiv:1703.05175); Moskowitz, Ooi, Pedersen - Time Series Momentum (2012) (10.1016/j.jfineco.2011.11.003)

---

#### Risk of Transfer Learning and its Applications in Finance
*Haoyang Cao, Haotian Gu, Xin Guo, Mathieu Rosenbaum* — 2023 · arXiv / SSRN preprint · OA · completeness-add

arXiv `2311.03283` · [link](https://arxiv.org/abs/2311.03283)

**Why:** Provides a principled, quantitative 'transfer risk' criterion for deciding which source markets/sectors/frequencies to transfer FROM — addressing the central when-does-cross-market-transfer-help question theoretically and empirically.

> Transfer learning is an emerging and popular paradigm for utilizing existing knowledge from previous learning tasks to improve the performance of new ones. In this paper, the authors propose a novel concept of transfer risk and analyze its properties to evaluate the transferability of transfer learning. They apply transfer learning techniques and this concept of transfer risk to stock return prediction and portfolio optimization problems. Numerical results demonstrate a strong correlation between transfer risk and overall transfer learning performance, where transfer risk provides a computationally efficient way to identify appropriate source tasks in transfer learning, including cross-continent, cross-sector, and cross-frequency transfer for portfolio optimization.

**Snowball:** Pan, Yang - A Survey on Transfer Learning (2010) (10.1109/TKDE.2009.191); Koshiyama et al. - QuantNet (2020) (arXiv:2004.03445); Ben-David et al. - A Theory of Learning from Different Domains (2010) (10.1007/s10994-009-5152-4)

---

#### A Robust Transferable Deep Learning Framework for Cross-sectional Investment Strategy
*Kei Nakagawa, Masaya Abe, Junpei Komiyama* — 2019 · arXiv preprint (also IEEE DSAA 2019 / related venue) · OA · completeness-add

arXiv `1910.01491` · [link](https://arxiv.org/abs/1910.01491)

**Why:** Canonical early example of deep transfer learning ACROSS geographic equity regions (MSCI markets) for a cross-sectional factor strategy — a direct precursor to QuantNet-style cross-market transfer.

> Stock return predictability is an important research theme as it reflects our economic and social organization, and significant efforts are made to explain the dynamism therein. Statistics of strong explanatory power, called 'factors', have been proposed to summarize the essence of predictive stock returns. Although machine learning methods are increasingly popular in stock return prediction, inference of stock returns is highly elusive, and most investors still rely partly on intuition. The challenge is to make an investment strategy consistent over a reasonably long period with minimum human decision over the entire process. To this end, the authors propose the Ranked Information Coefficient Neural Network (RIC-NN), a deep learning approach with three novel ideas: (1) a nonlinear multi-factor approach, (2) a stopping criterion based on ranked information coefficient (rank IC), and (3) deep transfer learning among multiple regions. Experimental comparison on stocks in the MSCI indices shows RIC-NN outperforms off-the-shelf machine learning methods and the average return of major equity investment funds over fourteen years.

**Snowball:** Gu, Kelly, Xiu - Empirical Asset Pricing via Machine Learning (2020) (10.1093/rfs/hhaa009); Fama, French - Common Risk Factors in Returns on Stocks and Bonds (1993) (10.1016/0304-405X(93)90023-5); Yosinski et al. - How Transferable Are Features in Deep Neural Networks? (2014) (arXiv:1411.1792)

---

#### Improving Financial Trading Decisions Using Deep Q-learning: Predicting the Number of Shares, Action Strategies, and Transfer Learning
*Gyeeun Jeong, Ha Young Kim* — 2019 · Expert Systems with Applications · completeness-add

DOI `10.1016/j.eswa.2018.09.036` · [link](https://doi.org/10.1016/j.eswa.2018.09.036)

**Why:** Canonical demonstration that transfer learning lets a deep RL trading agent transfer across global equity indices (S&P500/KOSPI/HSI/EuroStoxx50) and overcome data scarcity — the RL counterpart to QuantNet-style cross-market transfer.

> The authors propose a reinforcement-learning trading system built on a deep Q-network with three novel methods to maximize total profits and address the limited, highly volatile nature of financial data. First, a deep neural network regressor is added to the deep Q-network to predict the number of shares to trade (action sizing). Second, action strategies are introduced to mitigate volatility-induced overfitting. Third, transfer learning is adopted to prevent overfitting given insufficient data, training on a data-rich index and transferring to data-scarce indices. The full system increases total profits by 13x in S&P500, 24x in KOSPI, 30x in HSI, and 18x in EuroStoxx50, outperforming the market and a baseline reinforcement-learning model.

**Snowball:** Mnih et al. - Human-Level Control through Deep Reinforcement Learning (2015) (10.1038/nature14236); Moody, Saffell - Learning to Trade via Direct Reinforcement (2001) (10.1109/72.935097); Pan, Yang - A Survey on Transfer Learning (2010) (10.1109/TKDE.2009.191)

---

#### Meta-Stock: Task-Difficulty-Adaptive Meta-learning for Sub-new Stock Price Prediction
*Linghao Wang, Zhen Liu, Peitian Ma, Qianli Ma* — 2023 · arXiv preprint · OA · completeness-add

arXiv `2308.11117` · [link](https://arxiv.org/abs/2308.11117)

**Why:** Meta-learning explicitly targeting transfer to data-scarce newly-listed (sub-new) stocks across multiple markets — directly on the 'transfer to thinly-traded/emerging assets' scope.

> Sub-new stock price prediction — forecasting the price trends of stocks listed less than one year — is crucial for effective quantitative trading. While deep learning methods are effective for predicting old stock prices, they require large training datasets unavailable for sub-new stocks. The authors propose Meta-Stock, a task-difficulty-adaptive meta-learning approach for sub-new stock price prediction. Leveraging prediction tasks formulated from old stocks, the meta-learning method acquires a fast generalization ability that can be adapted to sub-new stock prediction, solving data scarcity. The process is enhanced by an adaptive learning strategy sensitive to varying task difficulty: a wavelet transform extracts high-frequency coefficients to manifest stock-price volatility, allowing the meta-learner to assign gradient weights based on volatility-quantified task difficulty. Extensive experiments on datasets from three stock markets spanning twenty-two years show Meta-Stock significantly outperforms previous methods with strong real-world applicability.

**Snowball:** Finn, Abbeel, Levine - Model-Agnostic Meta-Learning (MAML) (2017) (arXiv:1703.03400); Feng et al. - Temporal Relational Ranking for Stock Prediction (2019) (10.1145/3309547); Sung et al. - Learning to Compare: Relation Network for Few-Shot Learning (2018) (arXiv:1711.06025)

---

#### Adapting to the Unknown: Robust Meta-Learning for Zero-Shot Financial Time Series Forecasting
*Anxian Liu, Junying Ma, Guang Zhang* — 2025 · arXiv preprint · OA · completeness-add

arXiv `2504.09664` · [link](https://arxiv.org/abs/2504.09664)

**Why:** Recent meta-learning method aimed squarely at zero-shot transfer to emerging markets and unseen regimes with scarce history — the frontier of transfer to thinly-traded/emerging assets.

> Financial time series forecasting in zero-shot settings is critical for investment decisions, especially during abrupt market regime shifts or in emerging markets with limited historical data. The authors propose a robust meta-learning framework that uses Gaussian Mixture Models to cluster source-domain embeddings and construct complementary meta-tasks, enabling effective adaptation to new, unseen financial scenarios without target-domain training data. The approach is designed to remain robust under distribution shift and to generalize to markets and regimes not seen during training, improving zero-shot forecasting performance over standard meta-learning and deep forecasting baselines.

**Snowball:** Finn, Abbeel, Levine - Model-Agnostic Meta-Learning (2017) (arXiv:1703.03400); Oreshkin et al. - N-BEATS: Neural Basis Expansion for Time Series Forecasting (2020) (arXiv:1905.10437); Wood, Kessler, Roberts, Zohren - Few-Shot Learning Patterns (X-Trend) (2023) (arXiv:2310.10500)

---

#### DoubleAdapt: A Meta-learning Approach to Incremental Learning for Stock Trend Forecasting
*Lifan Zhao, Shuming Kong, Yanyan Shen* — 2023 · KDD 2023 (Proceedings of the 29th ACM SIGKDD Conference) · OA · completeness-add

DOI `10.1145/3580305.3599315` · arXiv `2306.09862` · [link](https://arxiv.org/abs/2306.09862)

**Why:** Meta-learning for incremental adaptation under temporal distribution shift — the domain-adaptation-over-time complement to cross-market transfer, with a published KDD pedigree.

> Stock trend forecasting is a fundamental task of quantitative investment where precise predictions of price trends are indispensable. As an online service relying on continuously arriving data, stock-trend models should be able to incrementally adapt to non-stationary markets under distribution shifts. The authors propose DoubleAdapt, an end-to-end meta-learning framework with two adapters: a data adapter that transforms incoming stock data to mitigate distribution shifts, and a model adapter that adapts model parameters to the new distribution. The two adapters are optimized via meta-learning so that the model can adapt to incremental data with a desirable generalization ability. Experiments on real-world stock datasets demonstrate state-of-the-art performance and efficient incremental adaptation.

**Snowball:** Finn, Abbeel, Levine - MAML (2017) (arXiv:1703.03400); Yang et al. - Qlib: An AI-oriented Quantitative Investment Platform (2020) (arXiv:2009.11189); You et al. - Learning to Adapt to Concept Drift (incremental learning) references

---

#### Deep Inception Networks: A General End-to-End Framework for Multi-asset Quantitative Strategies
*Tom Liu, Stephen Roberts, Stefan Zohren* — 2023 · arXiv preprint · OA · completeness-add

arXiv `2307.05522` · [link](https://arxiv.org/abs/2307.05522)

**Why:** A market-agnostic, end-to-end multi-asset architecture that learns shared temporal/cross-sectional representations across a futures universe — exemplifies the market-agnostic-vs-specific representation question central to this topic.

> The authors introduce Deep Inception Networks (DINs), a family of deep learning models providing a general framework for end-to-end systematic trading strategies. DINs extract both temporal and cross-sectional features from daily price returns without requiring manual feature engineering, and output portfolio position sizes optimized for Sharpe ratio while managing turnover and systemic risk through a novel loss term. Testing on a universe of liquid futures demonstrates outperformance versus traditional benchmarks across various transaction-cost levels and random initializations. The authors further enhance interpretability using attention mechanisms and variable selection networks, particularly valuable when input dimensionality is high and feature importance varies dynamically across assets.

**Snowball:** Lim, Zohren, Roberts - Enhancing Time-Series Momentum with DNNs (2019) (10.3905/jfds.2019.1.015); Szegedy et al. - Going Deeper with Convolutions (Inception) (2015) (arXiv:1409.4842); Lim et al. - Temporal Fusion Transformers for Interpretable Forecasting (2021) (10.1016/j.ijforecast.2021.03.012)

---

#### Building Cross-Sectional Systematic Strategies by Learning to Rank
*Daniel Poh, Bryan Lim, Stefan Zohren, Stephen Roberts* — 2021 · The Journal of Financial Data Science · OA · completeness-add

DOI `10.3905/jfds.2021.1.060` · arXiv `2012.07149` · [link](https://arxiv.org/abs/2012.07149)

**Why:** The learning-to-rank cross-sectional foundation that the transfer-ranking and few-shot transfer work directly extends — needed to understand the market-specific representation being transferred across markets.

> The success of a cross-sectional systematic strategy depends critically on accurately ranking assets prior to portfolio construction. The authors reformulate cross-sectional strategy construction as a learning-to-rank problem, importing standard pointwise, pairwise, and listwise ranking losses from information retrieval into the financial setting. Using these losses to train neural ranking models on a universe of liquid US equities, they show that learning-to-rank approaches produce portfolios with materially higher risk-adjusted returns than traditional regression- and classification-based cross-sectional baselines, while better capturing the relative ordering of assets that drives long-short performance.

**Snowball:** Burges et al. - Learning to Rank using Gradient Descent (RankNet) (2005) (10.1145/1102351.1102363); Gu, Kelly, Xiu - Empirical Asset Pricing via Machine Learning (2020) (10.1093/rfs/hhaa009); Jegadeesh, Titman - Returns to Buying Winners and Selling Losers (1993) (10.1111/j.1540-6261.1993.tb04702.x)

---

#### Stock Trading Volume Prediction with Dual-Process Meta-Learning
*Ruibo Chen, Wei Li, Zhiyuan Zhang, Ruihan Bao, Keiko Harimoto, Xu Sun* — 2022 · ECML PKDD 2022 (Machine Learning and Knowledge Discovery in Databases) · OA · completeness-add

DOI `10.1007/978-3-031-26422-1_9` · arXiv `2211.01762` · [link](https://arxiv.org/abs/2211.01762)

**Why:** Meta-learning that explicitly separates market-agnostic shared patterns from stock-specific characteristics across many stocks — a clean methodological exemplar of the market-agnostic vs market-specific representation split, applied to volume.

> Volume prediction is one of the fundamental objectives in the Fintech area, helpful for many downstream tasks such as algorithmic trading. Predicting trading volume is challenging because of complex stock-specific patterns and limited data for individual stocks. The authors propose a dual-process meta-learning method that captures both common patterns shared across stocks and stock-specific characteristics. By formulating volume prediction for each stock as a task and meta-learning across stocks, the model learns a shared (market-agnostic) inductive bias while quickly adapting to each stock's idiosyncrasies, improving prediction for stocks with limited history. Experiments on real-world stock datasets demonstrate the effectiveness of the approach over single-task and standard multi-task baselines.

**Snowball:** Finn, Abbeel, Levine - MAML (2017) (arXiv:1703.03400); Libovicky / Bao et al. - intraday volume prediction baselines; Vaswani et al. - Attention Is All You Need (2017) (arXiv:1706.03762)

---

#### Portfolio Optimization via Transfer Learning
*Kexin Wang, Xiaomeng Zhang, Xinyu Zhang* — 2025 · arXiv preprint · OA · completeness-add

arXiv `2511.21221` · [link](https://arxiv.org/abs/2511.21221)

**Why:** Very recent statistically-grounded cross-market transfer for portfolio optimization with negative-transfer safeguards and dual-listed CN/US case studies — directly on cross-market information transfer, though new and unvetted.

> The authors develop a portfolio strategy that leverages transfer learning to use cross-market information to enhance investment performance in a market of interest. The method asymptotically identifies informative source datasets while discarding misleading information, and is shown to asymptotically achieve the maximum Sharpe ratio. The approach explicitly handles the risk of negative transfer by down-weighting source markets whose return structure diverges from the target. Performance is validated through case studies on dual-listed Chinese stocks and U.S. equities across multiple industries, demonstrating gains from cross-market knowledge transfer for portfolio construction.

**Snowball:** Cao, Gu, Guo, Rosenbaum - Risk of Transfer Learning in Finance (2023) (arXiv:2311.03283); Markowitz - Portfolio Selection (1952) (10.1111/j.1540-6261.1952.tb01525.x); Li, Cai, Li - Transfer Learning for High-Dimensional Linear Regression (2022) (10.1111/rssb.12479)

---

