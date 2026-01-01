"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { type TokenInfo, type TokenPrice } from "@/types/jupiter";

interface TokenCardProps {
  tokenInfo: TokenInfo;
  price: TokenPrice | null;
  hasVrfdContent?: boolean;
}

/**
 * Token Card - Apple-inspired design
 * 
 * Design principles:
 * - Subtle elevation through shadow, not borders
 * - Typography hierarchy: price is hero
 * - Restrained use of color (only for +/- indicators)
 * - Generous internal spacing
 * - Smooth hover state
 */
export function TokenCard({ tokenInfo, price, hasVrfdContent }: TokenCardProps) {
  const [imgError, setImgError] = useState(false);
  const isPositive = price?.priceChange24h ? price.priceChange24h >= 0 : false;
  const hasLogo = tokenInfo.logoURI && !tokenInfo.logoURI.includes('ipfs') && !imgError;

  return (
    <Link href={`/token/${tokenInfo.mint}`}>
      <div className="group relative rounded-2xl p-6 transition-apple card-elevated hover:bg-white/[0.05]">
        {/* Header: Logo + Name */}
        <div className="flex items-center gap-3 mb-5">
          {hasLogo ? (
            <img 
              src={tokenInfo.logoURI} 
              alt={tokenInfo.name}
              className="size-10 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="size-10 rounded-full bg-white/[0.06] flex items-center justify-center">
              <span className="text-sm font-medium text-white/60">
                {tokenInfo.symbol.slice(0, 2)}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-base truncate">
              {tokenInfo.symbol}
            </div>
            <div className="text-[13px] text-white/40 truncate">
              {tokenInfo.name}
            </div>
          </div>
          {hasVrfdContent && (
            <div className="size-2 rounded-full bg-[#30D158]" title="Verified content available" />
          )}
        </div>

        {/* Price - Hero element */}
        {price ? (
          <div className="space-y-1">
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              ${price.usdPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: price.usdPrice < 1 ? 6 : 2,
              })}
            </div>
            {price.priceChange24h !== undefined && price.priceChange24h !== null && (
              <div className={cn(
                "text-sm tabular-nums",
                isPositive ? "text-[#30D158]" : "text-[#FF453A]"
              )}>
                {isPositive ? "+" : ""}
                {price.priceChange24h.toFixed(2)}%
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-white/20">—</div>
            <div className="text-sm text-white/20">No price data</div>
          </div>
        )}

        {/* Stats - Subtle footer */}
        {(tokenInfo.marketCap || tokenInfo.holders !== undefined) && (
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex gap-6 text-xs">
            {tokenInfo.marketCap && (
              <div>
                <span className="text-white/30">MCap </span>
                <span className="text-white/60 tabular-nums">
                  ${tokenInfo.marketCap >= 1e9 
                    ? `${(tokenInfo.marketCap / 1e9).toFixed(2)}B`
                    : `${(tokenInfo.marketCap / 1e6).toFixed(1)}M`
                  }
                </span>
              </div>
            )}
            {tokenInfo.holders !== undefined && (
              <div>
                <span className="text-white/30">Holders </span>
                <span className="text-white/60 tabular-nums">
                  {tokenInfo.holders >= 1e6
                    ? `${(tokenInfo.holders / 1e6).toFixed(1)}M`
                    : tokenInfo.holders >= 1e3
                    ? `${(tokenInfo.holders / 1e3).toFixed(1)}K`
                    : tokenInfo.holders.toLocaleString()
                  }
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
