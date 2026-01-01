import { Badge } from "@/components/ui/badge";
import { TokenPageContent } from "@/components/content/token-page-content";
import { SwapWidget } from "@/components/swap/swap-widget";
import { PriceChart } from "@/components/charts/price-chart";
import { TokenLogo } from "@/components/token/token-logo";
import { searchTokens } from "@/lib/jupiter/tokens";
import { getPrices } from "@/lib/jupiter/price";
import { getContent } from "@/lib/jupiter/content";
import { cn, formatPrice, formatCompact, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface TokenPageProps {
  params: Promise<{ mint: string }>;
}

export default async function TokenPage({ params }: TokenPageProps) {
  const { mint } = await params;

  if (!mint) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-white/40">Invalid token</p>
      </div>
    );
  }

  const [tokensArray, prices, contentResult] = await Promise.all([
    searchTokens(mint),
    getPrices([mint]),
    getContent([mint]).catch(() => []),
  ]);

  const tokenInfo = tokensArray.find((t) => t.mint === mint);
  const content = contentResult || [];

  if (!tokenInfo) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-2">
          <p className="text-white/60">Token not found</p>
          <p className="text-white/30 text-sm font-mono">{mint.slice(0, 16)}...</p>
        </div>
      </div>
    );
  }

  const price = prices[mint] || null;
  const isPositive = price?.priceChange24h ? price.priceChange24h >= 0 : false;
  const tokenSummary = content.find(c => c.id?.includes('token-summary'));
  const newsSummary = content.find(c => c.id?.includes('news-summary'));
  const otherContent = content.filter(c => !c.id?.includes('-summary'));

  return (
    <div className="min-h-screen">
      {/* Hero Section - Token info + Chart side by side */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-end">
            {/* Left - Token Info */}
            <div>
              {/* Logo + Name */}
              <div className="flex items-center gap-4 mb-8">
                <TokenLogo logoURI={tokenInfo.logoURI} symbol={tokenInfo.symbol} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {tokenInfo.symbol}
                    </h1>
                    <div className="size-2 rounded-full bg-[#30D158]" title="Verified" />
                  </div>
                  <p className="text-sm text-white/40">{tokenInfo.name}</p>
                </div>
              </div>
              
              {/* Large Price */}
              <div className="mb-6">
                {price ? (
                  <>
                    <div className="text-6xl font-semibold tabular-nums tracking-tight mb-2">
                      ${formatPrice(price.usdPrice)}
                    </div>
                    {price.priceChange24h != null && (
                      <span className={cn(
                        "inline-flex px-3 py-1 rounded-full text-sm font-medium",
                        isPositive 
                          ? "bg-[#30D158]/10 text-[#30D158]" 
                          : "bg-[#FF453A]/10 text-[#FF453A]"
                      )}>
                        {formatPercent(price.priceChange24h)} · 24h
                      </span>
                    )}
                  </>
                ) : (
                  <div className="text-5xl font-semibold text-white/20">—</div>
                )}
              </div>
              
              {/* Stats Row */}
              <div className="flex gap-6 text-sm">
                {tokenInfo.marketCap && (
                  <div>
                    <span className="text-white/30">MCap </span>
                    <span className="text-white/70 tabular-nums">${formatCompact(tokenInfo.marketCap)}</span>
                  </div>
                )}
                {tokenInfo.holders != null && (
                  <div>
                    <span className="text-white/30">Holders </span>
                    <span className="text-white/70 tabular-nums">{formatCompact(tokenInfo.holders)}</span>
                  </div>
                )}
                {tokenInfo.organicScore && (
                  <div>
                    <span className="text-white/30">Score </span>
                    <span className="text-white/70 tabular-nums">{tokenInfo.organicScore.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Chart */}
            <div className="rounded-2xl overflow-hidden">
              <PriceChart mint={mint} symbol={tokenInfo.symbol} />
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[320px_1fr] gap-12">
            {/* Left Column - Insights + Trade */}
            <div className="space-y-6">
              {/* Token Summary */}
              {tokenSummary && (
                <div className="card-elevated rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Insights</span>
                    <Badge className="text-[10px] px-1.5 py-0 h-4 bg-purple-500/20 text-purple-400 border-0">
                      AI
                    </Badge>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {tokenSummary.content}
                  </p>
                  {tokenSummary.citations && tokenSummary.citations.length > 0 && (
                    <p className="text-xs text-white/30">
                      {tokenSummary.citations.length} sources
                    </p>
                  )}
                </div>
              )}

              {/* News Summary */}
              {newsSummary && (
                <div className="card-elevated rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">TL;DR</span>
                    <Badge className="text-[10px] px-1.5 py-0 h-4 bg-orange-500/20 text-orange-400 border-0">
                      News
                    </Badge>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {newsSummary.content}
                  </p>
                  {newsSummary.updatedAt && (
                    <p className="text-xs text-white/30">
                      {new Date(newsSummary.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Trade Widget */}
              <div className="card-elevated rounded-2xl p-6 space-y-4">
                <span className="text-sm font-medium">Trade</span>
                <SwapWidget defaultOutputMint={mint} />
              </div>
            </div>

            {/* Right Column - Feed */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-medium">Feed</h2>
                <div className="size-2 rounded-full bg-[#30D158]" />
              </div>
              
              {otherContent.length === 0 ? (
                <p className="text-white/30 py-12">
                  No content available yet
                </p>
              ) : (
                <div className="columns-1 xl:columns-2 gap-6">
                  {otherContent.map((item, index) => (
                    <div key={item.id || `content-${index}`} className="break-inside-avoid mb-6">
                      <TokenPageContent content={item} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
