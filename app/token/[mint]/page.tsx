import { TypographyH1, TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VrfdBadge } from "@/components/content/vrfd-badge";
import { PriceDisplay } from "@/components/token/price-display";
import { ContentTabs } from "@/components/content/content-tabs";
import { SwapWidget } from "@/components/swap/swap-widget";
import { searchTokens } from "@/lib/jupiter/tokens";
import { getPrices } from "@/lib/jupiter/price";
import { getContent } from "@/lib/jupiter/content";

// Force dynamic rendering to avoid build-time API calls
// Why: Jupiter API requires runtime requests with API keys, cannot be statically generated
export const dynamic = "force-dynamic";

interface TokenPageProps {
  params: Promise<{ mint: string }>;
}

/**
 * Token Detail Page
 * 
 * Displays comprehensive information about a single token including:
 * - Token identity (symbol, name, logo)
 * - Current price and 24h change (large, prominent display)
 * - Key stats (market cap, holders, organic score)
 * - VRFD-verified content (summaries, news, tweets, posts)
 * - Integrated swap widget for trading
 * 
 * Design: Follows solprice.now's centered, minimal aesthetic
 * - Large price display (text-6xl) as hero element
 * - Centered content with max-width constraints
 * - Clean spacing and visual hierarchy
 */
export default async function TokenPage({ params }: TokenPageProps) {
  const { mint } = await params;

  // Parallel data fetching for optimal performance
  // Why: Fetch all required data concurrently to minimize latency
  const [tokensArray, prices, content] = await Promise.all([
    searchTokens(mint),
    getPrices([mint]),
    getContent([mint]),
  ]);

  const tokenInfo = tokensArray.find((t) => t.mint === mint);

  if (!tokenInfo) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-2">
          <TypographyH1>Token Not Found</TypographyH1>
          <TypographyMuted>The token you're looking for doesn't exist.</TypographyMuted>
        </div>
      </div>
    );
  }

  const price = prices[mint] || null;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Centered for visual balance and focus */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6 border-b border-white/10">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Token Identity */}
          <div className="flex flex-col items-center gap-6">
            <Avatar className="size-20">
              <AvatarImage src={tokenInfo.logoURI} alt={tokenInfo.name} />
              <AvatarFallback className="text-2xl bg-white/10">
                {tokenInfo.symbol.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <TypographyH1 className="text-5xl tracking-tight">
                {tokenInfo.symbol}
              </TypographyH1>
              <div className="flex items-center justify-center gap-2">
                <TypographyMuted className="text-base [&:not(:first-child)]:mt-0">
                  {tokenInfo.name}
                </TypographyMuted>
                <VrfdBadge variant="verified" />
              </div>
            </div>
          </div>

          {/* Large Price Display - Primary focus like solprice.now */}
          <div className="flex flex-col items-center">
            <PriceDisplay price={price} size="large" />
          </div>

          {/* Key Stats - Inline for quick scanning */}
          <div className="flex items-center justify-center flex-wrap gap-8 text-sm">
            {tokenInfo.marketCap && (
              <div className="text-center">
                <TypographyMuted className="mb-1 text-xs [&:not(:first-child)]:mt-0">
                  Market Cap
                </TypographyMuted>
                <div className="font-semibold tabular-nums">
                  ${(tokenInfo.marketCap / 1e9).toFixed(2)}B
                </div>
              </div>
            )}
            {tokenInfo.holders !== undefined && (
              <div className="text-center">
                <TypographyMuted className="mb-1 text-xs [&:not(:first-child)]:mt-0">
                  Holders
                </TypographyMuted>
                <div className="font-semibold tabular-nums">
                  {tokenInfo.holders.toLocaleString()}
                </div>
              </div>
            )}
            {tokenInfo.organicScore && (
              <div className="text-center">
                <TypographyMuted className="mb-1 text-xs [&:not(:first-child)]:mt-0">
                  Organic Score
                </TypographyMuted>
                <div className="font-semibold tabular-nums">
                  {tokenInfo.organicScore}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Sections - Max-width for readability */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* VRFD Content */}
        <div>
          <TypographyH2 className="text-xl mb-6 text-center border-none pb-0">
            Verified Content
          </TypographyH2>
          <ContentTabs content={content} />
        </div>

        {/* Swap Widget - Centered for focus */}
        <div>
          <TypographyH2 className="text-xl mb-6 text-center border-none pb-0">
            Trade
          </TypographyH2>
          {/* Max-width prevents overly wide inputs */}
          <div className="max-w-md mx-auto">
            <SwapWidget defaultOutputMint={mint} />
          </div>
        </div>
      </div>
    </div>
  );
}

