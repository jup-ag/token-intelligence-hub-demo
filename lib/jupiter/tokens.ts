import { jupiterFetch } from "@/lib/jupiter/client";
import { type TokenInfo, type TokensSearchResponse } from "@/types/jupiter";

/**
 * Jupiter Tokens API v2 Client
 * 
 * Provides functions to query token information from Jupiter's Tokens API.
 * API Reference: https://dev.jup.ag/api-reference/tokens/v2
 */

/**
 * Search for tokens by name, symbol, or mint address
 * 
 * @param query - Search term (name, symbol, or mint address)
 * @returns Array of matching tokens with metadata
 * 
 * @example
 * ```typescript
 * const solTokens = await searchTokens('SOL');
 * const byMint = await searchTokens('So11111...');
 * ```
 */
export async function searchTokens(query: string): Promise<TokenInfo[]> {
  const response = await jupiterFetch<TokensSearchResponse>(
    `/tokens/v2/search?query=${encodeURIComponent(query)}`
  );
  
  return Object.values(response);
}

export async function getTokensByTag(tag: "verified" | "lst"): Promise<TokenInfo[]> {
  const response = await jupiterFetch<TokensSearchResponse>(
    `/tokens/v2/tag?query=${tag}`
  );
  
  return Object.values(response);
}

export async function getTokensByCategory(
  category: string,
  interval: string = "24h"
): Promise<TokenInfo[]> {
  const response = await jupiterFetch<TokensSearchResponse>(
    `/tokens/v2/category?category=${category}&interval=${interval}`
  );
  
  return Object.values(response);
}

export async function getRecentTokens(): Promise<TokenInfo[]> {
  const response = await jupiterFetch<TokensSearchResponse>(
    `/tokens/v2/recent`
  );
  
  return Object.values(response);
}

export async function getTokenInfo(mint: string): Promise<TokenInfo | null> {
  const tokens = await searchTokens(mint);
  return tokens.find(t => t.mint === mint) || null;
}

