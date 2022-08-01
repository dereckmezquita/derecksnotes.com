
// ------------------------
import cryptoPrices from "./modules/price_tickers";
cryptoPrices();

// ------------------------
import { flexNav } from "./modules/flex_nav";
(window as Window).flexNav = flexNav;
