/**
 * Historical price data fetcher with multiple sources
 * 
 * Strategy:
 * 1. Try CoinGecko (best for major tokens, rate limited)
 * 2. Fall back to GeckoTerminal via pool lookup (works for all DEX tokens)
 * 
 * All sources are free, no API key required.
 */

interface PricePoint {
  timestamp: number;
  price: number;
}

/**
 * Get historical USD prices for a Solana token
 * 
 * @param mint - Token mint address
 * @param days - Number of days of history (default 1)
 */
export async function getHistoricalPrices(
  mint: string,
  days: number = 1
): Promise<PricePoint[]> {
  // Try CoinGecko first
  const cgPrices = await fetchFromCoinGecko(mint, days);
  if (cgPrices.length > 0) {
    return cgPrices;
  }

  // Fall back to GeckoTerminal via pool lookup
  const gtPrices = await fetchFromGeckoTerminal(mint, days);
  if (gtPrices.length > 0) {
    return gtPrices;
  }

  console.log(`No historical price data found for ${mint}`);
  return [];
}

/**
 * CoinGecko - Best for major tokens
 */
async function fetchFromCoinGecko(mint: string, days: number): Promise<PricePoint[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/solana/contract/${mint}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    if (!data.prices || data.prices.length === 0) {
      return [];
    }

    return data.prices.map((point: [number, number]) => ({
      timestamp: point[0],
      price: point[1],
    }));
  } catch (error) {
    console.error("CoinGecko error:", error);
    return [];
  }
}

/**
 * GeckoTerminal - Works for any token traded on a DEX
 * Uses pool-based OHLCV data
 */
async function fetchFromGeckoTerminal(mint: string, days: number): Promise<PricePoint[]> {
  try {
    // Step 1: Find the main pool for this token via DexScreener
    const poolAddress = await findPoolAddress(mint);
    if (!poolAddress) {
      return [];
    }

    // Step 2: Fetch OHLCV data from GeckoTerminal
    const timeframe = days <= 1 ? "hour" : "day";
    const limit = days <= 1 ? 24 : Math.min(days * 24, 100);
    
    const response = await fetch(
      `https://api.geckoterminal.com/api/v2/networks/solana/pools/${poolAddress}/ohlcv/${timeframe}?aggregate=1&limit=${limit}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const ohlcvList = data?.data?.attributes?.ohlcv_list;

    if (!ohlcvList || ohlcvList.length === 0) {
      return [];
    }

    // OHLCV format: [timestamp, open, high, low, close, volume]
    // Use close price and reverse to chronological order
    return ohlcvList
      .map((candle: [number, number, number, number, number, number]) => ({
        timestamp: candle[0] * 1000, // Convert to ms
        price: candle[4], // Close price
      }))
      .reverse();
  } catch (error) {
    console.error("GeckoTerminal error:", error);
    return [];
  }
}

/**
 * Find the main trading pool for a token via DexScreener
 */
async function findPoolAddress(mint: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 600 }, // Cache pool lookup longer
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Get the first (most liquid) pair
    const pair = data?.pairs?.[0];
    if (!pair?.pairAddress) {
      return null;
    }

    return pair.pairAddress;
  } catch (error) {
    console.error("DexScreener pool lookup error:", error);
    return null;
  }
}

/**
 * Get current USD price for a Solana token
 */
export async function getCurrentPrice(mint: string): Promise<number | null> {
  try {
    // Try DexScreener first (more reliable, less rate limited)
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const priceUsd = data?.pairs?.[0]?.priceUsd;
    
    return priceUsd ? parseFloat(priceUsd) : null;
  } catch (error) {
    console.error("Price fetch error:", error);
    return null;
  }
}
