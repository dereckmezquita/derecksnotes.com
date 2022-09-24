
// ------------------------
// this is the main script and gets injected to all pages on website

// ------------------------
// coingecko get prices for info-bar
import { cryptoPrices, NameTicker } from "./modules/price_tickers";

const coins: NameTicker[] = [
    { name: "bitcoin", ticker: "BTC" },
    // { name: "digibyte", ticker: "DGB" },
    { name: "monero", ticker: "XMR" }
]

cryptoPrices(coins);

// ------------------------
// drowdown menu on responsive design
import "./modules/flex_nav";

// ------------------------
import "./modules/clock";

