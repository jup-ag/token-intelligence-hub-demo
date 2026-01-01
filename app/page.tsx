import { TokenCard } from "@/components/token/token-card";
import { getTokensByCategory } from "@/lib/jupiter/tokens";
import { getPrices } from "@/lib/jupiter/price";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let tokensInfo: any[] = [];
  let prices: Record<string, any> = {};
  let error = null;

  try {
    tokensInfo = await getTokensByCategory("toptrending", "5m", 50);
    const mints = tokensInfo.map(t => t.mint);
    prices = await getPrices(mints);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div className="min-h-screen">
      {error ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <p className="text-white/40 text-sm">Unable to load data</p>
            <p className="text-white/20 text-xs font-mono">{error}</p>
          </div>
        </div>
      ) : tokensInfo.length === 0 ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-white/40">No tokens available</p>
        </div>
      ) : (
        <>
          {/* Hero - Apple-style bold typography */}
          <section className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.9]">
                Trending
              </h1>
              <p className="mt-6 text-white/40 text-lg max-w-md">
                Real-time intelligence on Solana's most active tokens. 
                Verified content. Live prices.
              </p>
            </div>
          </section>

          {/* Token Grid */}
          <section className="px-6 pb-32">
            <div className="max-w-7xl mx-auto">
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
            </div>
          </section>
        </>
      )}
    </div>
  );
}
