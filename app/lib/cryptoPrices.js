export async function getPrices(cryptos) {
  if (!cryptos || cryptos.length === 0) return {};

  const MAPPING = {
    btc: "bitcoin", eth: "ethereum", bnb: "binancecoin",
    sol: "solana", ada: "cardano", xrp: "ripple",
    doge: "dogecoin", dot: "polkadot", matic: "matic-network",
    avax: "avalanche-2", link: "chainlink", ltc: "litecoin",
    uni: "uniswap", atom: "cosmos", xlm: "stellar",
  };

  const coingeckoIds = cryptos
    .map(c => MAPPING[c.toLowerCase()] || c.toLowerCase())
    .join(",");

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds}&vs_currencies=eur`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();

    const result = {};
    cryptos.forEach(c => {
      const id = MAPPING[c.toLowerCase()] || c.toLowerCase();
      result[c.toUpperCase()] = data[id]?.eur || null;
    });
    return result;
  } catch {
    return {};
  }
}
