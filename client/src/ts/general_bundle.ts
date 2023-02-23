
// ------------------------
// this is the main script and gets injected to all pages on website

// ------------------------
// coingecko get prices for info-bar
import "./modules/general/price_tickers";

// ------------------------
// drowdown menu on responsive design
import "./modules/general/flex_nav";

// ------------------------
import "./modules/general/clock";

// ------------------------
import "./modules/general/pwa_prompt";

// ------------------------
import "./modules/general/user_connect";

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
