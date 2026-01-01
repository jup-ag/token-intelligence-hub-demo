/**
 * CoinGecko Free API for historical price data
 * 
 * Free tier, no API key required.
 * Rate limited but sufficient for basic usage.
 * 
 * API Docs: https://docs.coingecko.com/reference/introduction
 */

interface PricePoint {
  timestamp: number;
  price: number;
}

/**
 * Get historical USD prices for a Solana token via CoinGecko
 * 
 * @param mint - Token mint address
 * @param days - Number of days of history (default 1)
 */
export async function getHistoricalPrices(
  mint: string,
  days: number = 1
): Promise<PricePoint[]> {
  try {
    // CoinGecko uses the format: /coins/solana/contract/{contract_address}/market_chart
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/solana/contract/${mint}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      // If token not found on CoinGecko, try as if it's native SOL
      if (response.status === 404) {
        console.log("Token not found on CoinGecko, no chart data available");
        return [];
      }
      console.error(`CoinGecko API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.prices || data.prices.length === 0) {
      return [];
    }

    // CoinGecko returns [[timestamp, price], ...]
    return data.prices.map((point: [number, number]) => ({
      timestamp: point[0],
      price: point[1],
    }));
  } catch (error) {
    console.error("CoinGecko API error:", error);
    return [];
  }
}

/**
 * Get current USD price for a Solana token
 */
export async function getCurrentPrice(mint: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mint}&vs_currencies=usd`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data[mint]?.usd || null;
  } catch (error) {
    console.error("CoinGecko price error:", error);
    return null;
  }
}
