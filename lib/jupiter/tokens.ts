import { jupiterFetch } from "@/lib/jupiter/client";
import { type TokenInfo, type TokensSearchResponse, type CategoryResponse } from "@/types/jupiter";

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
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const response = await jupiterFetch<any>(
    `/tokens/v2/search?query=${encodeURIComponent(query)}`
  );
  
  // Handle different response formats
  let tokensArray: any[] = [];
  
  if (Array.isArray(response)) {
    tokensArray = response;
  } else if (response && typeof response === "object") {
    tokensArray = Object.values(response);
  }
  
  // Map API field names to our TokenInfo interface
  // Search API uses: id → mint, icon → logoURI
  return tokensArray.map((token) => ({
    mint: token.id || token.mint,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.icon || token.logoURI,
    tags: token.tags,
    organicScore: token.organicScore,
    marketCap: token.marketCap,
    holders: token.holders || token.holderCount,
  }));
}

export async function getTokensByTag(tag: "verified" | "lst"): Promise<TokenInfo[]> {
  const response = await jupiterFetch<any>(
    `/tokens/v2/tag?query=${tag}`
  );
  
  const tokensArray = Array.isArray(response) ? response : Object.values(response);
  
  // Map API field names to our TokenInfo interface
  return tokensArray.map((token) => ({
    mint: token.id || token.mint,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.icon || token.logoURI,
    tags: token.tags,
    organicScore: token.organicScore,
    marketCap: token.marketCap,
    holders: token.holders || token.holderCount,
  }));
}

export async function getTokensByCategory(
  category: "toporganicscore" | "toptraded" | "toptrending",
  interval: "5m" | "1h" | "6h" | "24h" = "5m",
  limit: number = 50
): Promise<TokenInfo[]> {
  const response = await jupiterFetch<any>(
    `/tokens/v2/${category}/${interval}?limit=${limit}`
  );
  
  // Handle different response formats
  let tokensArray: any[] = [];
  
  if (Array.isArray(response)) {
    tokensArray = response;
  } else if (response && typeof response === "object") {
    tokensArray = Object.values(response);
  }
  
  // Map API field names to our TokenInfo interface
  // Category API uses: id → mint, icon → logoURI
  return tokensArray.map((token) => ({
    mint: token.id || token.mint,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.icon || token.logoURI,
    tags: token.tags,
    organicScore: token.organicScore,
    marketCap: token.marketCap,
    holders: token.holders || token.holderCount,
  }));
}

export async function getRecentTokens(): Promise<TokenInfo[]> {
  const response = await jupiterFetch<any>(
    `/tokens/v2/recent`
  );
  
  const tokensArray = Array.isArray(response) ? response : Object.values(response);
  
  // Map API field names to our TokenInfo interface
  return tokensArray.map((token) => ({
    mint: token.id || token.mint,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.icon || token.logoURI,
    tags: token.tags,
    organicScore: token.organicScore,
    marketCap: token.marketCap,
    holders: token.holders || token.holderCount,
  }));
}

export async function getTokenInfo(mint: string): Promise<TokenInfo | null> {
  if (!mint || mint.trim().length === 0) {
    return null;
  }
  
  const tokens = await searchTokens(mint);
  return tokens.find(t => t.mint === mint) || null;
}

