import { textToHTML } from "../helpers";

type NameTicker = {
    coin_name: string,
    ticker: string
}

type PriceDataRes = {
    coin_name: string;
    usd: number;
    usd_24h_change: number;
    time_stamp: Date;
}

// minutes = 1000 * 60 * x minutes
const refreshInterval = 1000 * 60 * 3; // 3 minutes

export {};

const getPrice = async (coinName: string): Promise<PriceDataRes> => {
    // if returned value is falsy (i.e. null or undefined) nullish coalescing operator ?? returns fallback; right-hand side
    const data: PriceDataRes = JSON.parse(localStorage.getItem(coinName) ?? 'null');

    if (data) {
        // check if data is older than x minutes
        const now = new Date();
        const time_stamp = new Date(data.time_stamp);
        const diff = now.getTime() - time_stamp.getTime();

        if (diff < refreshInterval) {
            return data;
        }
    }

    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinName}&vs_currencies=usd&include_24hr_change=true`);

    if (res.ok) {
        let data = await res.json();
        data[coinName].coin_name = coinName;
        data = data[coinName] as PriceDataRes;

        // save data to web storage
        try {
            data.time_stamp = new Date();
            localStorage.setItem(coinName, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving data to local storage: ${error}`);
        }

        return data;
    } else {
        throw new Error("Bad status code");
    }
}

async function setCryptoPrices(coins: NameTicker[]): Promise<void> {
    // get ticker holder from DOM
    const tickers: HTMLDivElement = document.querySelector("#tickers")!;

    for (const coin of coins) {
        const res: PriceDataRes = await getPrice(coin.coin_name);

        if (!res) {
            console.error(`Error fetching data for ${coin.coin_name}`);
            continue;
        }

        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }); // 23230.2 -> $23,230.20; 3241 -> $3,241.00

        const price: string = formatter.format(res.usd);
        const pctChg: number = res.usd_24h_change;

        const coinTicker = textToHTML(`
        <span class="info-bar-crypto ${coin.ticker.toLowerCase() !== "btc" ? ' info-bar-crypto-hidden' : ''}">
            <span id="${coin.ticker.toLowerCase()}-name">${coin.ticker}: ${price}</span>
            <span id="${coin.ticker.toLowerCase()}-percent" class="coin-percent-change" style="background:${pctChg > 0 ? '#4DD964' : '#FF3B2F'};">
                ${pctChg.toFixed(2)}%
            </span>
        </span>
        `) as HTMLSpanElement;

        tickers.appendChild(coinTicker);
    }
};

const coins: NameTicker[] = [
    { coin_name: "bitcoin", ticker: "BTC" },
    // { name: "digibyte", ticker: "DGB" },
    { coin_name: "monero", ticker: "XMR" }
]

setCryptoPrices(coins);

setInterval(() => {
    document.querySelectorAll(".info-bar-crypto").forEach(e => e.remove());
    setCryptoPrices(coins);
}, refreshInterval);