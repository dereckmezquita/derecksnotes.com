
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

// ------------------------
// footnotes using data-href and class="foot-note"
import "./modules/foot_notes";

// ------------------------
// figure caption numbers and lazy load
import "./modules/figures";
