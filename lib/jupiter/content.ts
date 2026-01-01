import { jupiterFetch } from "@/lib/jupiter/client";
import { type TokenContent, type ContentResponse, type CookingTokensResponse, type TokenInfo } from "@/types/jupiter";
import { searchTokens } from "@/lib/jupiter/tokens";

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
  const response = await jupiterFetch<any>(
    `/tokens/v2/content?mints=${mintsParam}`
  );
  
  // Response structure: { data: [{ mint, contents: [...], newsSummary, tokenSummary }] }
  const allContent: TokenContent[] = [];
  
  response.data.forEach((tokenData: any) => {
    const mint = tokenData.mint;
    
    // Add regular contents
    if (tokenData.contents && Array.isArray(tokenData.contents)) {
      tokenData.contents.forEach((item: any) => {
        allContent.push({
          id: item.contentId || item.id || `content-${Math.random()}`,
          mint: mint,
          type: item.contentType || item.type || "text",
          content: item.content || item.text || "",
          submittedBy: typeof item.submittedBy === 'object' 
            ? item.submittedBy?.username || "unknown"
            : item.submittedBy || "unknown",
          source: item.content || item.url || item.source,
          citations: item.citations || [],
          status: "approved",
          createdAt: item.postedAt || item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        });
      });
    }
    
    // Add token summary as a content item
    if (tokenData.tokenSummary) {
      allContent.push({
        id: `${mint}-token-summary`,
        mint: mint,
        type: "summary",
        content: tokenData.tokenSummary.summaryFull || tokenData.tokenSummary.summaryShort,
        submittedBy: "jupiter",
        citations: tokenData.tokenSummary.citations || [],
        status: "approved",
        createdAt: tokenData.tokenSummary.updatedAt,
        updatedAt: tokenData.tokenSummary.updatedAt,
      });
    }
    
    // Add news summary as a content item
    if (tokenData.newsSummary) {
      allContent.push({
        id: `${mint}-news-summary`,
        mint: mint,
        type: "news",
        content: tokenData.newsSummary.summaryFull || tokenData.newsSummary.summaryShort,
        submittedBy: "jupiter",
        citations: tokenData.newsSummary.citations || [],
        status: "approved",
        createdAt: tokenData.newsSummary.updatedAt,
        updatedAt: tokenData.newsSummary.updatedAt,
      });
    }
  });
  
  return allContent;
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
  
  console.log("[Content] Cooking API raw response:", response);
  
  // Handle different response structures
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }
  
  return [];
}

/**
 * Get content feed from trending "cooking" tokens
 * 
 * Since the feed endpoint requires a specific mint, we use the cooking
 * endpoint to get trending tokens with their content.
 * 
 * @param page - Page number (currently not supported by cooking endpoint)
 * @param type - Content type filter (currently not supported by cooking endpoint)
 * @returns Content response with trending token content
 */
export async function getContentFeed(page: number = 1, type?: string) {
  // Use cooking endpoint for trending content since feed requires a specific mint
  const cookingData = await getCookingTokens();
  
  console.log("[Content] Cooking data parsed:", cookingData);
  console.log("[Content] First item structure:", cookingData[0]);
  
  // Extract all content items from cooking tokens
  const allContent: TokenContent[] = [];
  cookingData.forEach((item: any) => {
    const mint = item.mint;
    
    // Process contents array (note: plural "contents" not "content")
    if (item.contents && Array.isArray(item.contents)) {
      item.contents.forEach((contentItem: any) => {
        const contentType = contentItem.contentType || contentItem.type || "text";
        const contentText = contentItem.content || contentItem.text || "";
        
        // Filter by type if specified AND skip empty content
        if ((!type || type === "all" || contentType === type) && contentText.trim().length > 0) {
          allContent.push({
            id: contentItem.contentId || contentItem.id || `content-${Math.random()}`,
            mint: mint,
            type: contentType,
            content: contentText,
            submittedBy: typeof contentItem.submittedBy === 'object' 
              ? contentItem.submittedBy?.username || "unknown"
              : contentItem.submittedBy || "unknown",
            source: contentItem.url || contentItem.source,
            citations: contentItem.citations || [],
            status: "approved",
            createdAt: contentItem.postedAt || contentItem.createdAt || new Date().toISOString(),
            updatedAt: contentItem.updatedAt || new Date().toISOString(),
          });
        }
      });
    }
    
    // Also include tokenSummary as a summary content item (only if it has content)
    if (item.tokenSummary && (!type || type === "all" || type === "summary")) {
      const summaryContent = item.tokenSummary.summaryFull || item.tokenSummary.summaryShort || "";
      // Only add if there's actual content
      if (summaryContent.trim().length > 0) {
        allContent.push({
          id: `${mint}-token-summary`,
          mint: mint,
          type: "summary",
          content: summaryContent,
          submittedBy: "jupiter",
          citations: item.tokenSummary.citations || [],
          status: "approved",
          createdAt: item.tokenSummary.updatedAt || new Date().toISOString(),
          updatedAt: item.tokenSummary.updatedAt || new Date().toISOString(),
        });
      }
    }
    
    // Also include newsSummary as a news content item (only if it has content)
    if (item.newsSummary && (!type || type === "all" || type === "news")) {
      const newsContent = item.newsSummary.summaryFull || item.newsSummary.summaryShort || "";
      // Only add if there's actual content
      if (newsContent.trim().length > 0) {
        allContent.push({
          id: `${mint}-news-summary`,
          mint: mint,
          type: "news",
          content: newsContent,
          submittedBy: "jupiter",
          citations: item.newsSummary.citations || [],
          status: "approved",
          createdAt: item.newsSummary.updatedAt || new Date().toISOString(),
          updatedAt: item.newsSummary.updatedAt || new Date().toISOString(),
        });
      }
    }
  });
  
  console.log("[Content] Total content items extracted:", allContent.length);
  
  // Simple pagination (50 items per page)
  const itemsPerPage = 50;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContent = allContent.slice(startIndex, endIndex);
  
  // Fetch token metadata for unique mints in this page
  const uniqueMints = [...new Set(paginatedContent.map(c => c.mint))];
  let tokensMap: Record<string, TokenInfo> = {};
  
  if (uniqueMints.length > 0) {
    try {
      // Search for tokens - this returns token info with name, symbol, logo
      const tokenResults = await searchTokens(uniqueMints.join(","));
      tokensMap = tokenResults.reduce((acc, token) => {
        acc[token.mint] = token;
        return acc;
      }, {} as Record<string, TokenInfo>);
    } catch (error) {
      console.error("[Content] Failed to fetch token metadata:", error);
    }
  }
  
  return {
    data: paginatedContent,
    hasMore: endIndex < allContent.length,
    tokensMap,
  };
}

