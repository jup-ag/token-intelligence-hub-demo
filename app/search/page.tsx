import { Suspense } from "react";
import { SearchInput } from "@/components/search/search-input";
import { TokenCard } from "@/components/token/token-card";
import { searchTokens } from "@/lib/jupiter/tokens";
import { getPrices } from "@/lib/jupiter/price";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return <p className="text-white/30 py-12">Enter a search term to find tokens</p>;
  }

  const tokens = await searchTokens(query);
  
  if (tokens.length === 0) {
    return <p className="text-white/30 py-12">No tokens found for "{query}"</p>;
  }

  const prices = await getPrices(tokens.map(t => t.mint));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tokens.map((token) => (
        <TokenCard
          key={token.mint}
          tokenInfo={token}
          price={prices[token.mint] || null}
        />
      ))}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-semibold tracking-tight">Search</h1>
          <p className="mt-4 text-white/40 text-lg">Find any token by name, symbol, or address</p>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto space-y-12">
          <SearchInput defaultValue={q} />
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults query={q} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
