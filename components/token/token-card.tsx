"use client";

import Link from "next/link";
import { cn, formatPrice, formatCompact, formatPercent } from "@/lib/utils";
import { TokenLogo } from "@/components/token/token-logo";
import { type TokenInfo, type TokenPrice } from "@/types/jupiter";

interface TokenCardProps {
  tokenInfo: TokenInfo;
  price: TokenPrice | null;
  hasVrfdContent?: boolean;
}

export function TokenCard({ tokenInfo, price, hasVrfdContent }: TokenCardProps) {
  const isPositive = price?.priceChange24h ? price.priceChange24h >= 0 : false;

  return (
    <Link href={`/token/${tokenInfo.mint}`}>
      <div className="group relative rounded-2xl p-6 transition-apple card-elevated hover:bg-white/[0.05]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <TokenLogo logoURI={tokenInfo.logoURI} symbol={tokenInfo.symbol} size="md" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-base truncate">{tokenInfo.symbol}</div>
            <div className="text-[13px] text-white/40 truncate">{tokenInfo.name}</div>
          </div>
          {hasVrfdContent && (
            <div className="size-2 rounded-full bg-[#30D158]" title="Verified content available" />
          )}
        </div>

        {/* Price */}
        {price ? (
          <div className="space-y-1">
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              ${formatPrice(price.usdPrice)}
            </div>
            {price.priceChange24h != null && (
              <div className={cn(
                "text-sm tabular-nums",
                isPositive ? "text-[#30D158]" : "text-[#FF453A]"
              )}>
                {formatPercent(price.priceChange24h)}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-white/20">—</div>
            <div className="text-sm text-white/20">No price data</div>
          </div>
        )}

        {/* Stats */}
        {(tokenInfo.marketCap || tokenInfo.holders != null) && (
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex gap-6 text-xs">
            {tokenInfo.marketCap && (
              <div>
                <span className="text-white/30">MCap </span>
                <span className="text-white/60 tabular-nums">${formatCompact(tokenInfo.marketCap)}</span>
              </div>
            )}
            {tokenInfo.holders != null && (
              <div>
                <span className="text-white/30">Holders </span>
                <span className="text-white/60 tabular-nums">{formatCompact(tokenInfo.holders)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
