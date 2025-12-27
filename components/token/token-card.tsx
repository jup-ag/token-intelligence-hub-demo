import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type TokenInfo, type TokenPrice } from "@/types/jupiter";

interface TokenCardProps {
  /** Token metadata including symbol, name, logo, stats */
  tokenInfo: TokenInfo;
  /** Current price data with 24h change, null if unavailable */
  price: TokenPrice | null;
  /** Whether token has VRFD-verified content available */
  hasVrfdContent?: boolean;
}

/**
 * Token Card Component
 * 
 * Displays token information in a clean, minimal card format.
 * Inspired by solprice.now's design with prominent pricing and clean layout.
 * 
 * Features:
 * - Large, readable price display (text-3xl)
 * - Color-coded 24h change (green/red with arrows)
 * - Compact stats grid (market cap, holders)
 * - VRFD badge for verified content
 * - Hover effects (border glow + background lighten)
 * 
 * Design Decisions:
 * - bg-white/5: Subtle card background for depth
 * - backdrop-blur-sm: Modern glass effect
 * - border-white/10: Minimal borders that don't compete with content
 * - hover:border-white/30: Clear hover feedback
 * - Tabular numbers: Perfect alignment for price displays
 * 
 * @example
 * ```tsx
 * <TokenCard 
 *   tokenInfo={token} 
 *   price={priceData} 
 *   hasVrfdContent 
 * />
 * ```
 */
export function TokenCard({ tokenInfo, price, hasVrfdContent }: TokenCardProps) {
  const isPositive = price ? price.priceChange24h >= 0 : false;

  return (
    <Link href={`/token/${tokenInfo.mint}`}>
      <div className="group relative rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/30 hover:bg-white/10 backdrop-blur-sm">
        {/* Token Header - Clean alignment */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="size-12 shrink-0">
              <AvatarImage src={tokenInfo.logoURI} alt={tokenInfo.name} />
              <AvatarFallback className="text-sm bg-white/10">
                {tokenInfo.symbol.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-lg truncate">{tokenInfo.symbol}</div>
              <div className="text-sm text-white/60 truncate">
                {tokenInfo.name}
              </div>
            </div>
          </div>
          {hasVrfdContent && (
            <Badge variant="outline" className="shrink-0 text-xs border-green-500/30 bg-green-500/10 text-green-400">
              VRFD
            </Badge>
          )}
        </div>

        {/* Price Display - Prominent */}
        {price ? (
          <div className="space-y-2 mb-6">
            <div className="text-3xl font-bold tabular-nums tracking-tight">
              ${price.usdPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: price.usdPrice < 1 ? 6 : 2,
              })}
            </div>
            <div className={cn(
              "text-sm font-medium flex items-center gap-1",
              isPositive ? "text-green-400" : "text-red-400"
            )}>
              <span>{isPositive ? "↗" : "↘"}</span>
              <span>
                {isPositive ? "+" : ""}
                {price.priceChange24h.toFixed(2)}% today
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-6">
            <div className="text-2xl font-bold text-white/40">--</div>
            <div className="text-sm text-white/40">No price data</div>
          </div>
        )}

        {/* Stats - Clean grid */}
        {(tokenInfo.marketCap || tokenInfo.holders !== undefined) && (
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
            {tokenInfo.marketCap && (
              <div className="space-y-1">
                <div className="text-white/60">Market Cap</div>
                <div className="font-semibold tabular-nums">
                  ${(tokenInfo.marketCap / 1e6).toFixed(1)}M
                </div>
              </div>
            )}
            {tokenInfo.holders !== undefined && (
              <div className="space-y-1">
                <div className="text-white/60">Holders</div>
                <div className="font-semibold tabular-nums">
                  {tokenInfo.holders > 1000 
                    ? `${(tokenInfo.holders / 1000).toFixed(1)}K`
                    : tokenInfo.holders.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

