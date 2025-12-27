import { TypographyH1, TypographyP, TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { TokenCard } from "@/components/token/token-card";
import { getCookingTokens } from "@/lib/jupiter/content";
import { searchTokens } from "@/lib/jupiter/tokens";
import { getPrices } from "@/lib/jupiter/price";

// Force dynamic rendering to avoid build-time API calls
// Why: Jupiter API requires runtime requests, can't be statically generated
export const dynamic = "force-dynamic";

/**
 * Home Page - Trending Tokens
 * 
 * Displays trending tokens from Jupiter's "cooking" endpoint with VRFD content.
 * Uses Server Component for optimal performance and SEO.
 * 
 * API Calls:
 * - Content API: Get trending tokens
 * - Tokens API: Get detailed info for each token
 * - Price API: Get current prices
 */
export default async function HomePage() {
  let tokensInfo = [];
  let prices = {};
  let error = null;

  try {
    // Fetch trending tokens from Content API
    const cookingData = await getCookingTokens();
    const mints = cookingData.map((item) => item.mint);

    // Parallel fetching for better performance
    // Why: Reduces total loading time by fetching concurrently
    const [tokensInfoArray, pricesData] = await Promise.all([
      Promise.all(mints.map((mint) => searchTokens(mint))),
      getPrices(mints),
    ]);

    tokensInfo = tokensInfoArray.flat().filter(Boolean);
    prices = pricesData;
  } catch (err) {
    // Graceful error handling for rate limits and API issues
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div className="min-h-screen">
      {error ? (
        // Error State - User-friendly message for rate limiting
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-6 max-w-md mx-auto px-6">
            <div className="text-6xl">⏳</div>
            <div className="space-y-2">
              <TypographyH2 className="border-none pb-0">
                {error.includes("429") || error.includes("Rate limit") 
                  ? "API Tier Upgrade in Progress" 
                  : "Error Loading Data"}
              </TypographyH2>
              <TypographyMuted className="text-sm">
                {error.includes("429") || error.includes("Rate limit") ? (
                  "Once upgraded to Pro tier, refresh to see trending tokens"
                ) : (
                  error
                )}
              </TypographyMuted>
            </div>
          </div>
        </div>
      ) : tokensInfo.length === 0 ? (
        // Empty State
        <div className="flex items-center justify-center min-h-[80vh]">
          <TypographyMuted>No trending tokens available</TypographyMuted>
        </div>
      ) : (
        <>
          {/* Hero Section - Centered for visual balance */}
          <div className="flex flex-col items-center justify-center pt-24 pb-16 px-6">
            <div className="text-center space-y-4 max-w-3xl">
              <TypographyH1 className="text-5xl sm:text-6xl">
                Trending Tokens
              </TypographyH1>
              <TypographyP className="text-white/60 text-lg [&:not(:first-child)]:mt-0">
                Verified content · Real-time prices · Jupiter-powered
              </TypographyP>
            </div>
          </div>

          {/* Token Grid - Max-width for optimal card size */}
          <div className="max-w-7xl mx-auto px-6 pb-24">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tokensInfo.map((token) => (
                <TokenCard
                  key={token.mint}
                  tokenInfo={token}
                  price={prices[token.mint] || null}
                  hasVrfdContent
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
