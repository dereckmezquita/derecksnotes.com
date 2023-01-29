
// ------------------------
// this is the main script and gets injected to all pages on website

// ------------------------
// coingecko get prices for info-bar
import { cryptoPrices, NameTicker } from "./modules/general_price_tickers";

const coins: NameTicker[] = [
    { name: "bitcoin", ticker: "BTC" },
    // { name: "digibyte", ticker: "DGB" },
    { name: "monero", ticker: "XMR" }
]

cryptoPrices(coins);

// ------------------------
// drowdown menu on responsive design
import "./modules/general_flex_nav";

// ------------------------
import "./modules/general_clock";

// ------------------------
import "./modules/pwa_prompt";

// ------------------------
import "./modules/user_login_prompt.ts"

// ------------------------
// ------------------------
window.MathJax = { // property declared in index.d.ts
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
    },
    svg: {
        fontCache: 'global'
    }
};
