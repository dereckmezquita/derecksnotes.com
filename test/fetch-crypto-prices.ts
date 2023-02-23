async function getPrice(coin_name) {
    const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin_name}&vs_currencies=usd&include_24hr_change=true`
    );

    if (response.ok) {
        const data = await response.json();
        data[coin_name].coin_name = coin_name;
        return data[coin_name];
    } else {
        throw new Error("Bad status code");
    }
}

getPrice("bitcoin").then((data) => {
    console.log(data);
});
