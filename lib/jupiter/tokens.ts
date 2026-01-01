import { jupiterFetch } from "@/lib/jupiter/client";
import { type TokenInfo } from "@/types/jupiter";

/**
 * Jupiter Tokens API v2 Client
 * 
 * Provides functions to query token information from Jupiter's Tokens API.
 * API Reference: https://dev.jup.ag/api-reference/tokens/v2
 */

/** Normalize API response to array */
function toArray(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === "object") return Object.values(response);
  return [];
}

/** Map API token to our TokenInfo interface (handles id→mint, icon→logoURI) */
function mapToken(data: unknown): TokenInfo {
  const token = data as Record<string, unknown>;
  return {
    mint: (token.id || token.mint) as string,
    name: token.name as string,
    symbol: token.symbol as string,
    decimals: token.decimals as number,
    logoURI: (token.icon || token.logoURI) as string | undefined,
    tags: token.tags as string[] | undefined,
    organicScore: token.organicScore as number | undefined,
    marketCap: token.marketCap as number | undefined,
    holders: (token.holders || token.holderCount) as number | undefined,
  };
}

/**
 * Search for tokens by name, symbol, or mint address
 */
export async function searchTokens(query: string): Promise<TokenInfo[]> {
  if (!query?.trim()) return [];
  
  const response = await jupiterFetch<unknown>(
    `/tokens/v2/search?query=${encodeURIComponent(query)}`
  );
  
  return toArray(response).map(mapToken);
}

export async function getTokensByTag(tag: "verified" | "lst"): Promise<TokenInfo[]> {
  const response = await jupiterFetch<unknown>(`/tokens/v2/tag?query=${tag}`);
  return toArray(response).map(mapToken);
}

export async function getTokensByCategory(
  category: "toporganicscore" | "toptraded" | "toptrending",
  interval: "5m" | "1h" | "6h" | "24h" = "5m",
  limit: number = 50
): Promise<TokenInfo[]> {
  const response = await jupiterFetch<unknown>(
    `/tokens/v2/${category}/${interval}?limit=${limit}`
  );
  return toArray(response).map(mapToken);
}

export async function getRecentTokens(): Promise<TokenInfo[]> {
  const response = await jupiterFetch<unknown>(`/tokens/v2/recent`);
  return toArray(response).map(mapToken);
}

export async function getTokenInfo(mint: string): Promise<TokenInfo | null> {
  if (!mint || mint.trim().length === 0) {
    return null;
  }
  
  const tokens = await searchTokens(mint);
  return tokens.find(t => t.mint === mint) || null;
}

