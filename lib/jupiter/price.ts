import { jupiterFetch } from "@/lib/jupiter/client";
import { type PricesResponse } from "@/types/jupiter";

/**
 * Jupiter Price API v3 Client
 * 
 * Real-time token pricing powered by Jupiter's Price API.
 * Uses last swapped prices with heuristics for accuracy.
 * 
 * API Reference: https://dev.jup.ag/api-reference/price/v3
 */

/**
 * Get current prices for multiple tokens
 * 
 * Fetches USD prices with 24h change for the specified tokens.
 * Returns empty object if no mints provided.
 * 
 * @param mints - Array of token mint addresses
 * @returns Object mapping mint addresses to price data
 * 
 * @example
 * ```typescript
 * const prices = await getPrices(['So11111...', 'EPjFWdd...']);
 * console.log(prices['So11111...'].usdPrice); // Current SOL price
 * ```
 */
export async function getPrices(mints: string[]): Promise<PricesResponse> {
  // Filter out empty or invalid mints before making API call
  const validMints = mints.filter((mint) => mint && mint.trim().length > 0);
  
  if (validMints.length === 0) {
    return {};
  }
  
  const idsParam = validMints.join(",");
  const response = await jupiterFetch<PricesResponse>(
    `/price/v3?ids=${idsParam}`
  );
  
  return response;
}

export async function getPrice(mint: string) {
  const prices = await getPrices([mint]);
  return prices[mint] || null;
}

