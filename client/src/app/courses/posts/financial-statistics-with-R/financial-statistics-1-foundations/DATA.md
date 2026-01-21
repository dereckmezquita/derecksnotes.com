# Algorithmic Trading with R: Dataset Documentation

This document describes all datasets used throughout the Algorithmic Trading course. These datasets are selected for building, backtesting, and deploying systematic trading strategies.

---

## Data Acquisition

All datasets are downloaded using the R scripts in `src/data/`:

```bash
# Download everything at once
Rscript src/data/download_all.R

# Or download individually:
Rscript src/data/download_datasets.R      # Market data (stocks, ETFs, indices)
Rscript src/data/download_factor_data.R   # Fama-French factors
Rscript src/data/download_crypto_forex.R  # Crypto and forex
Rscript src/data/download_economic_data.R # FRED economic data (requires API key)
```

**Note:** For FRED economic data, get a free API key from [FRED](https://fred.stlouisfed.org/docs/api/api_key.html):
```r
Sys.setenv(FRED_API_KEY = "your_key_here")
```

**Dataset Summary:**

| Category | Files | Size | Description |
|----------|-------|------|-------------|
| `market/` | 51 | 40 MB | Stocks, ETFs, indices |
| `factors/` | 8 | 4.4 MB | Fama-French factors |
| `crypto/` | 13 | 4.6 MB | Cryptocurrency |
| `forex/` | 15 | 7.9 MB | Currency pairs |
| `volatility/` | 1 | 0.7 MB | VIX |
| **Total** | **88** | **~58 MB** | |

---

## Data Sources

| Source | URL | Data Types |
|--------|-----|------------|
| **Yahoo Finance** | https://finance.yahoo.com | Stocks, ETFs, indices, crypto, forex |
| **Ken French Data Library** | https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html | Factor returns |
| **FRED** | https://fred.stlouisfed.org | Economic indicators (requires API key) |

---

## Market Data (`src/data/market/`)

### Indices

| File | Symbol | Description | From |
|------|--------|-------------|------|
| `sp500_daily.csv` | ^GSPC | S&P 500 Index | 1990 |
| `djia_daily.csv` | ^DJI | Dow Jones Industrial Average | 1990 |
| `nasdaq_daily.csv` | ^IXIC | NASDAQ Composite | 1990 |
| `russell2000_daily.csv` | ^RUT | Russell 2000 (small cap) | 1990 |
| `ftse100_daily.csv` | ^FTSE | FTSE 100 (UK) | 1990 |
| `nikkei225_daily.csv` | ^N225 | Nikkei 225 (Japan) | 1990 |

### Individual Stocks

| File | Symbol | Sector | From |
|------|--------|--------|------|
| `aapl_daily.csv` | AAPL | Technology | 2000 |
| `msft_daily.csv` | MSFT | Technology | 2000 |
| `googl_daily.csv` | GOOGL | Technology | 2004 |
| `amzn_daily.csv` | AMZN | Consumer | 2000 |
| `meta_daily.csv` | META | Technology | 2012 |
| `nvda_daily.csv` | NVDA | Technology | 2000 |
| `tsla_daily.csv` | TSLA | Consumer | 2010 |
| `jpm_daily.csv` | JPM | Financial | 2000 |
| `v_daily.csv` | V | Financial | 2008 |
| `brkb_daily.csv` | BRK-B | Financial | 2000 |
| `gs_daily.csv` | GS | Financial | 2000 |
| `jnj_daily.csv` | JNJ | Healthcare | 2000 |
| `unh_daily.csv` | UNH | Healthcare | 2000 |
| `pfe_daily.csv` | PFE | Healthcare | 2000 |
| `wmt_daily.csv` | WMT | Consumer | 2000 |
| `pg_daily.csv` | PG | Consumer | 2000 |
| `ko_daily.csv` | KO | Consumer | 2000 |
| `mcd_daily.csv` | MCD | Consumer | 2000 |
| `xom_daily.csv` | XOM | Energy | 2000 |
| `cvx_daily.csv` | CVX | Energy | 2000 |

### ETFs

| File | Symbol | Description | From |
|------|--------|-------------|------|
| `spy_daily.csv` | SPY | S&P 500 ETF | 2005 |
| `qqq_daily.csv` | QQQ | NASDAQ-100 ETF | 2005 |
| `iwm_daily.csv` | IWM | Russell 2000 ETF | 2005 |
| `vti_daily.csv` | VTI | Total Stock Market | 2005 |
| `efa_daily.csv` | EFA | Developed Markets | 2005 |
| `eem_daily.csv` | EEM | Emerging Markets | 2005 |
| `veu_daily.csv` | VEU | All-World ex-US | 2007 |
| `tlt_daily.csv` | TLT | 20+ Year Treasury | 2005 |
| `ief_daily.csv` | IEF | 7-10 Year Treasury | 2005 |
| `lqd_daily.csv` | LQD | Investment Grade Corp | 2005 |
| `hyg_daily.csv` | HYG | High Yield Corp | 2007 |
| `agg_daily.csv` | AGG | Aggregate Bond | 2005 |
| `gld_daily.csv` | GLD | Gold | 2005 |
| `slv_daily.csv` | SLV | Silver | 2006 |
| `uso_daily.csv` | USO | Oil | 2006 |
| `xlf_daily.csv` | XLF | Financial Sector | 2005 |
| `xlk_daily.csv` | XLK | Technology Sector | 2005 |
| `xle_daily.csv` | XLE | Energy Sector | 2005 |
| `xlv_daily.csv` | XLV | Healthcare Sector | 2005 |
| `xlu_daily.csv` | XLU | Utilities Sector | 2005 |
| `vixy_daily.csv` | VIXY | VIX Short-Term Futures | 2011 |

### Combined Datasets

| File | Description | Variables |
|------|-------------|-----------|
| `multi_asset_returns.csv` | SPY, QQQ, IWM, EFA, EEM, GLD, TLT, LQD returns | 9 columns |
| `sector_etf_returns.csv` | XLF, XLK, XLE, XLV, XLU returns | 6 columns |
| `tech_stock_returns.csv` | AAPL, MSFT, GOOGL, AMZN, META, NVDA returns | 7 columns |
| `stock_universe.csv` | Metadata for all stocks | symbol, sector, industry |

### Data Format (OHLCV)

All market data files share this structure:

| Column | Type | Description |
|--------|------|-------------|
| `date` | Date | Trading date |
| `open` | Numeric | Opening price |
| `high` | Numeric | Intraday high |
| `low` | Numeric | Intraday low |
| `close` | Numeric | Closing price |
| `volume` | Numeric | Shares traded |
| `adjusted` | Numeric | Split/dividend adjusted close |
| `returns` | Numeric | Log returns: ln(P_t / P_{t-1}) |
| `returns_simple` | Numeric | Simple returns: (P_t - P_{t-1}) / P_{t-1} |

---

## Factor Data (`src/data/factors/`)

Data from Kenneth French's Data Library for factor-based trading strategies.

| File | Description | Frequency |
|------|-------------|-----------|
| `ff3_factors_daily.csv` | Fama-French 3 factors | Daily |
| `ff3_factors_monthly.csv` | Fama-French 3 factors | Monthly |
| `ff5_factors_daily.csv` | Fama-French 5 factors | Daily |
| `ff5_factors_monthly.csv` | Fama-French 5 factors | Monthly |
| `momentum_daily.csv` | Momentum factor (UMD) | Daily |
| `momentum_monthly.csv` | Momentum factor (UMD) | Monthly |
| `carhart4_daily.csv` | FF3 + Momentum combined | Daily |
| `carhart4_monthly.csv` | FF3 + Momentum combined | Monthly |
| `industry_10_portfolios_daily.csv` | 10 industry portfolios | Daily |
| `industry_10_portfolios_monthly.csv` | 10 industry portfolios | Monthly |

### Factor Variables

**Fama-French 3-Factor Model:**

| Factor | Description |
|--------|-------------|
| `Mkt-RF` | Market return minus risk-free rate |
| `SMB` | Small Minus Big (size factor) |
| `HML` | High Minus Low (value factor) |
| `RF` | Risk-free rate (T-bill) |

**Fama-French 5-Factor Model (adds):**

| Factor | Description |
|--------|-------------|
| `RMW` | Robust Minus Weak (profitability) |
| `CMA` | Conservative Minus Aggressive (investment) |

**Carhart 4-Factor Model (adds):**

| Factor | Description |
|--------|-------------|
| `Mom` / `UMD` | Up Minus Down (momentum) |

---

## Cryptocurrency Data (`src/data/crypto/`)

| File | Symbol | Description | From |
|------|--------|-------------|------|
| `btc_daily.csv` | BTC-USD | Bitcoin | 2014 |
| `eth_daily.csv` | ETH-USD | Ethereum | 2017 |
| `bnb_daily.csv` | BNB-USD | Binance Coin | 2017 |
| `xrp_daily.csv` | XRP-USD | Ripple | 2017 |
| `ada_daily.csv` | ADA-USD | Cardano | 2017 |
| `sol_daily.csv` | SOL-USD | Solana | 2020 |
| `doge_daily.csv` | DOGE-USD | Dogecoin | 2017 |
| `dot_daily.csv` | DOT-USD | Polkadot | 2020 |
| `matic_daily.csv` | MATIC-USD | Polygon | 2019 |
| `ltc_daily.csv` | LTC-USD | Litecoin | 2014 |

### Combined Crypto Datasets

| File | Description |
|------|-------------|
| `major_crypto_returns.csv` | BTC, ETH, BNB, XRP, SOL daily returns |
| `btc_vs_traditional_assets.csv` | BTC vs SPY, GLD, TLT for correlation analysis |
| `crypto_universe.csv` | Metadata for all cryptocurrencies |

---

## Forex Data (`src/data/forex/`)

### Major Pairs

| File | Pair | Description |
|------|------|-------------|
| `eurusd_daily.csv` | EUR/USD | Euro / US Dollar |
| `gbpusd_daily.csv` | GBP/USD | British Pound / US Dollar |
| `usdjpy_daily.csv` | USD/JPY | US Dollar / Japanese Yen |
| `usdchf_daily.csv` | USD/CHF | US Dollar / Swiss Franc |
| `audusd_daily.csv` | AUD/USD | Australian Dollar / US Dollar |
| `usdcad_daily.csv` | USD/CAD | US Dollar / Canadian Dollar |
| `nzdusd_daily.csv` | NZD/USD | New Zealand Dollar / US Dollar |

### Cross Pairs

| File | Pair | Description |
|------|------|-------------|
| `eurgbp_daily.csv` | EUR/GBP | Euro / British Pound |
| `eurjpy_daily.csv` | EUR/JPY | Euro / Japanese Yen |
| `gbpjpy_daily.csv` | GBP/JPY | British Pound / Japanese Yen |

### Emerging Markets

| File | Pair | Description |
|------|------|-------------|
| `usdmxn_daily.csv` | USD/MXN | US Dollar / Mexican Peso |
| `usdbrl_daily.csv` | USD/BRL | US Dollar / Brazilian Real |
| `usdinr_daily.csv` | USD/INR | US Dollar / Indian Rupee |

### Combined Forex Dataset

| File | Description |
|------|-------------|
| `major_forex_returns.csv` | EUR, GBP, JPY, CHF, AUD, CAD daily returns |
| `forex_universe.csv` | Metadata for all currency pairs |

---

## Volatility Data (`src/data/volatility/`)

| File | Description |
|------|-------------|
| `vix_daily.csv` | CBOE Volatility Index (VIX) |

**VIX Variables:**

| Column | Description |
|--------|-------------|
| `date` | Trading date |
| `open` | Opening VIX level |
| `high` | Intraday high |
| `low` | Intraday low |
| `close` | Closing VIX level |

VIX represents the market's expectation of 30-day volatility, derived from S&P 500 index options.

---

## Chapter-Dataset Mapping

| Chapter | Primary Datasets | Application |
|---------|-----------------|-------------|
| 1: Markets & Data | sp500, stock_universe | Understanding market data |
| 2: Return Statistics | sp500, multi_asset | Risk metrics, Sharpe ratios |
| 3: Signals | stocks, etfs, vix | Technical indicators, momentum |
| 4: Backtesting | sp500, multi_asset | Building backtest engine |
| 5: Position Sizing | multi_asset | Kelly criterion, volatility targeting |
| 6: Risk Management | sp500, vix | VaR, drawdown controls |
| 7: Trend Following | multi_asset, forex | Moving averages, breakouts |
| 8: Mean Reversion | stocks, etfs | Pairs trading, cointegration |
| 9: Factor Strategies | ff3_factors, ff5_factors | Long-short portfolios |
| 10: Volatility Trading | vix, sp500 | VIX strategies, GARCH |
| 11: Machine Learning | All market data | Feature engineering, validation |
| 12: Execution | stocks, etfs | Transaction cost modelling |
| 13: Live Trading | All data | Production systems |
| 14: Crypto Trading | btc, eth, crypto | Crypto strategies |
| 15: Trading Business | All datasets | Multi-strategy portfolios |

---

## Loading Data in R

```r
library(data.table)

# Set data directory
data_dir <- "src/data"

# Load a single file
sp500 <- fread(file.path(data_dir, "market/sp500_daily.csv"))

# Load factors
ff3 <- fread(file.path(data_dir, "factors/ff3_factors_daily.csv"))

# Load multi-asset returns for portfolio analysis
multi_asset <- fread(file.path(data_dir, "market/multi_asset_returns.csv"))

# Load VIX for volatility analysis
vix <- fread(file.path(data_dir, "volatility/vix_daily.csv"))

# Load crypto
btc <- fread(file.path(data_dir, "crypto/btc_daily.csv"))
```

---

## Data Quality Notes

1. **Adjusted prices:** Always use `adjusted` column for returns and analysis (accounts for splits and dividends).

2. **Missing values:** Some dates may have NA values due to holidays or data gaps. Handle appropriately.

3. **Survivorship bias:** This dataset includes only currently listed securities. For rigorous backtesting, consider survivorship-free data sources.

4. **Look-ahead bias:** Data is point-in-time as downloaded. Factor data from Ken French uses the methodology available at the time.

5. **Crypto trading hours:** Crypto trades 24/7. Yahoo Finance provides daily data based on UTC close.

6. **Forex trading hours:** Forex trades 24/5 (Sunday 5pm ET to Friday 5pm ET). Weekend data not available.

---

## Refreshing Data

To update datasets with the latest data:

```bash
# Re-run download scripts
Rscript src/data/download_all.R
```

Scripts will overwrite existing files with fresh data from the beginning of each series.

---

*Last updated: Generated by download scripts*
