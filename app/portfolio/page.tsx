"use client"; // JUSTIFIED: needs wallet connection state via useSolana hook

import { useEffect, useState } from "react";
import { useSolana } from "@/components/providers/solana-provider";
import { TypographyH1, TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { TokenCard } from "@/components/token/token-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPositions } from "@/lib/jupiter/portfolio";
import { getPrices } from "@/lib/jupiter/price";
import { searchTokens } from "@/lib/jupiter/tokens";
import { type Position, type TokenInfo, type PricesResponse } from "@/types/jupiter";

// Force dynamic rendering for client component
// Why: Client component with dynamic wallet data cannot be pre-rendered
export const dynamic = "force-dynamic";

/**
 * Portfolio Dashboard Page
 * 
 * Displays user's token holdings and total portfolio value.
 * Requires wallet connection to function.
 * 
 * Features:
 * - Total portfolio value (large, prominent display)
 * - Individual token holdings with current prices
 * - Refresh functionality to update data
 * - Integration with Portfolio API
 * 
 * Why Client Component: Needs wallet connection state from Solana provider
 */
export default function PortfolioPage() {
  const { isConnected, selectedAccount } = useSolana();
  const [positions, setPositions] = useState<Position[]>([]);
  const [tokens, setTokens] = useState<Record<string, TokenInfo>>({});
  const [prices, setPrices] = useState<PricesResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (isConnected && selectedAccount) {
      fetchPortfolio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, selectedAccount]);

  const fetchPortfolio = async () => {
    if (!selectedAccount) return;

    setIsLoading(true);
    try {
      const portfolioData = await getPositions(selectedAccount.address);
      setPositions(portfolioData.positions || []);
      setTotalValue(portfolioData.totalValue || 0);

      const mints = portfolioData.positions?.map((p) => p.mint) || [];
      if (mints.length > 0) {
        const [pricesData, ...tokensArrays] = await Promise.all([
          getPrices(mints),
          ...mints.map((mint) => searchTokens(mint)),
        ]);

        setPrices(pricesData);

        const tokensMap = tokensArrays.reduce((acc, tokensArray, index) => {
          const token = tokensArray.find((t) => t.mint === mints[index]);
          if (token) {
            acc[token.mint] = token;
          }
          return acc;
        }, {} as Record<string, TokenInfo>);

        setTokens(tokensMap);
      }
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Wallet not connected - show connection prompt
  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="text-6xl">👛</div>
          <div className="space-y-2">
            <TypographyH1 className="text-4xl">Portfolio</TypographyH1>
            <TypographyMuted className="[&:not(:first-child)]:mt-0">
              Connect your wallet to view your holdings
            </TypographyMuted>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Total portfolio value display */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6 border-b border-white/10">
        <div className="text-center space-y-8 max-w-2xl w-full">
          <div className="flex items-center justify-between w-full">
            <TypographyH1 className="text-5xl">Portfolio</TypographyH1>
            <Button 
              onClick={fetchPortfolio} 
              disabled={isLoading}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {/* Total Value - Large display for immediate impact */}
          <div className="space-y-2">
            <TypographyMuted className="text-sm [&:not(:first-child)]:mt-0">
              Total Value
            </TypographyMuted>
            <div className="text-6xl font-bold tabular-nums tracking-tight">
              ${totalValue.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Grid - Max-width for optimal card sizing */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <TypographyH2 className="text-xl mb-8 text-center border-none pb-0">
          Holdings
        </TypographyH2>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 bg-white/5" />
            ))}
          </div>
        ) : positions.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <TypographyMuted>
              No positions found. Start trading to build your portfolio!
            </TypographyMuted>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {positions.map((position) => {
              const token = tokens[position.mint];
              if (!token) return null;

              return (
                <TokenCard
                  key={position.mint}
                  tokenInfo={token}
                  price={prices[position.mint] || null}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

