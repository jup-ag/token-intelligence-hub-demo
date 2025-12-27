import { jupiterFetch } from "@/lib/jupiter/client";
import { type TokenContent, type ContentResponse, type CookingTokensResponse } from "@/types/jupiter";

/**
 * Jupiter Content API Client
 * 
 * Access VRFD-verified content for Solana tokens.
 * All content is curated and verified by Jupiter VRFD.
 * 
 * Content Types:
 * - Summaries: AI-generated with citations
 * - News: News summaries with sources  
 * - Tweets: Verified social media posts
 * - Text: Community-submitted content
 * 
 * API Reference: https://dev.jup.ag/docs/tokens/v2/content
 */

/**
 * Get VRFD content for specific tokens
 * 
 * Returns all verified content for the provided token mints.
 * Content includes summaries, news, tweets, and community posts.
 * 
 * @param mints - Array of token mint addresses
 * @returns Array of content items
 * 
 * @example
 * ```typescript
 * const content = await getContent(['So11111...']);
 * content.forEach(item => {
 *   console.log(`${item.type}: ${item.content}`);
 * });
 * ```
 */
export async function getContent(mints: string[]): Promise<TokenContent[]> {
  if (mints.length === 0) {
    return [];
  }
  
  const mintsParam = mints.join(",");
  const response = await jupiterFetch<ContentResponse>(
    `/tokens/v2/content?mints=${mintsParam}`
  );
  
  return response.data;
}

/**
 * Get trending "cooking" tokens
 * 
 * Returns tokens that are currently trending on Jupiter
 * with their associated VRFD content.
 * 
 * @returns Array of trending tokens with content
 * 
 * @example
 * ```typescript
 * const trending = await getCookingTokens();
 * console.log(`${trending.length} tokens are trending`);
 * ```
 */
export async function getCookingTokens() {
  const response = await jupiterFetch<CookingTokensResponse>(
    `/tokens/v2/content/cooking`
  );
  
  return response.data;
}

export async function getContentFeed(page: number = 1, type?: string) {
  const typeParam = type && type !== "all" ? `&type=${type}` : "";
  const response = await jupiterFetch<ContentResponse>(
    `/tokens/v2/content/feed?page=${page}${typeParam}`
  );
  
  return response;
}

