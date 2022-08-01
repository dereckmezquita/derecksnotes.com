
(async () => {
    type NameTicker = {
        name: string,
        ticker: string
    }

    const coins: NameTicker[] = [
        { name: "bitcoin", ticker: "BTC" },
        { name: "digibyte", ticker: "DGB" },
        { name: "monero", ticker: "XMR" }
    ]

    for (const coin of coins) {
        let res: any;

        try {
            res = await getPrice(coin.name);
        } catch (error) {
            console.error(error);
        }

        if (res) {
            // console.log(res[coin.name]);
        }

        // get ticker holder from DOM
        const tickers: Element = document.querySelector("#tickers");

        const coinSpan: Element = document.createElement('span');
        coinSpan.classList.add("info-bar-crypto");

        if (coin.name != "bitcoin") { // css will hide all these when screen width is small
            coinSpan.classList.add("info-bar-cypto-hidden");
        }

        // --------------------------------
        // coin ticker
        const coinTicker: Element = document.createElement('span');
        coinTicker.innerHTML = coin.ticker + ": ";
        coinTicker.id = `${coin.ticker.toLowerCase()}-name`;

        // --------------------------------
        // coin price
        const coinPrice: Element = document.createElement('span');
        let price: string = res[coin.name]["usd"].toFixed(5).toString();

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
        
        let percentChangeValue: number = res[coin.name]["usd_24h_change"];

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
})();


async function getPrice(coin: string) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`);
        xhr.responseType = 'json';

        xhr.onload = () => {
            // console.log(xhr.status);
            if (xhr.status >= 200 && xhr.status < 400) return resolve(xhr.response);

            reject("Bad status code");
        }

        xhr.onerror = () => {
            reject();
        }

        xhr.send();
    });
}
