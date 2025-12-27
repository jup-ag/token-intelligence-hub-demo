"use client"; // JUSTIFIED: uses useSearchParams hook

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenCard } from "@/components/token/token-card";
import { TypographyMuted } from "@/components/ui/typography";
import { useSearchParams } from "@/hooks/use-search-params";
import { searchTokens } from "@/lib/jupiter/tokens";
import { getPrices } from "@/lib/jupiter/price";
import { Skeleton } from "@/components/ui/skeleton";
import { type TokenInfo, type PricesResponse } from "@/types/jupiter";

export function SearchContent() {
  const [params, setParams] = useSearchParams();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [prices, setPrices] = useState<PricesResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(params.query);

  useEffect(() => {
    if (params.query) {
      fetchTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.query]);

  const fetchTokens = async () => {
    if (!params.query) return;

    setIsLoading(true);
    try {
      const tokensData = await searchTokens(params.query);
      setTokens(tokensData);

      const mints = tokensData.map((t) => t.mint);
      if (mints.length > 0) {
        const pricesData = await getPrices(mints);
        setPrices(pricesData);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setParams({ query: searchInput });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-10">
      {/* Search controls - Clean and centered */}
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-3">
          <Input
            placeholder="Search tokens..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 h-14 text-base bg-black border-white/10 focus-visible:border-white/30"
          />
          <Button 
            onClick={handleSearch} 
            disabled={!searchInput || isLoading}
            className="h-14 px-8 bg-white text-black hover:bg-white/90 font-semibold"
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center">
        <Select
          value={params.category}
          onValueChange={(value) => setParams({ category: value })}
        >
          <SelectTrigger className="w-56 bg-white/5 border-white/10">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="volume">High Volume</SelectItem>
            <SelectItem value="gainers">Top Gainers</SelectItem>
            <SelectItem value="losers">Top Losers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 bg-white/5" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-white/60">
            {params.query
              ? "No tokens found. Try a different search term."
              : "Enter a search term to find tokens"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => (
            <TokenCard
              key={token.mint}
              tokenInfo={token}
              price={prices[token.mint] || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

