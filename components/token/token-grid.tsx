import { TokenCard } from "@/components/token/token-card";
import { getTokensByCategory } from "@/lib/jupiter/tokens";
import { getPrices } from "@/lib/jupiter/price";

/**
 * Server Component that fetches and renders the token grid.
 * Used with Suspense for streaming.
 */
export async function TokenGrid() {
  const tokensInfo = await getTokensByCategory("toptrending", "5m", 50);
  const mints = tokensInfo.map(t => t.mint);
  const prices = await getPrices(mints);

  if (tokensInfo.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-white/40">No tokens available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tokensInfo.map((token, index) => (
        <TokenCard
          key={token.mint || `token-${index}`}
          tokenInfo={token}
          price={prices[token.mint] || null}
          hasVrfdContent
        />
      ))}
    </div>
  );
}

export function TokenGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/[0.03] animate-pulse h-48"
        />
      ))}
    </div>
  );
}


