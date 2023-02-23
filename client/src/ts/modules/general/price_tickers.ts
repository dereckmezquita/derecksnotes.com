type NameTicker = {
    name: string,
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
        // check if data is older than 5 minutes
        const now = new Date();
        const time_stamp = new Date(data.time_stamp);
        const diff = now.getTime() - time_stamp.getTime();

        if (diff < (refreshInterval)) {
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
    const tickers: Element = document.querySelector("#tickers");

    for (const coin of coins) {
        const res: PriceDataRes = await getPrice(coin.name);

        if (!res) {
            console.error(`Error fetching data for ${coin.name}`);
            continue;
        }

        const coinSpan: Element = document.createElement('span');
        coinSpan.classList.add("info-bar-crypto");

        if (coin.name != "bitcoin") { // css will hide all these when screen width is small
            coinSpan.classList.add("info-bar-crypto-hidden");
        }

        // --------------------------------
        // coin ticker
        const coinTicker: Element = document.createElement('span');
        coinTicker.innerHTML = coin.ticker + ": ";
        coinTicker.id = `${coin.ticker.toLowerCase()}-name`;

        // --------------------------------
        // coin price
        const coinPrice: Element = document.createElement('span');
        let price: string = res.usd
            .toFixed(5)
            .toString();

        // remove trailing zeros with a regular expression; toFixed adds zeros
        price = price.replace(/0+$/, "").replace(/\.$/, "");

        // if nothing after decimals add .00
        if (+price % 1 === 0) price = price + ".00";

        // split price by . or ,
        const priceSplit: string[] = price.split(/[.,]/);
        priceSplit[0] = priceSplit[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        price = priceSplit[0] + "." + priceSplit[1];

        coinPrice.innerHTML = "$ " + price;
        coinPrice.id = `${coin.ticker.toLowerCase()}-price`;

        // --------------------------------
        // percent change
        const coinPercentChange: HTMLElement | null = document.createElement('span');

        let percentChangeValue: number = res.usd_24h_change;

        if (percentChangeValue > 0) {
            coinPercentChange.innerHTML = "+" + (percentChangeValue as number).toFixed(2) + "%";
            coinPercentChange.style.background = "#4DD964";
        } else {
            coinPercentChange.innerHTML = (percentChangeValue as number).toFixed(2) + "%";
            coinPercentChange.style.background = "#FF3B2F";
        }

        coinPercentChange.id = `${coin.ticker.toLowerCase()}-percent`;
        coinPercentChange.classList.add("coin-percent-change");

        // --------------------------------
        // --------------------------------
        // append to coin holder
        coinSpan.appendChild(coinTicker);
        coinSpan.appendChild(coinPrice);
        coinSpan.appendChild(coinPercentChange);

        // append to DOM
        tickers.appendChild(coinSpan);
    }
};

const coins: NameTicker[] = [
    { name: "bitcoin", ticker: "BTC" },
    // { name: "digibyte", ticker: "DGB" },
    { name: "monero", ticker: "XMR" }
]

setCryptoPrices(coins);

setInterval(() => {
    setCryptoPrices(coins);
}, refreshInterval);