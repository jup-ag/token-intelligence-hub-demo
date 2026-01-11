import { Suspense } from "react";
import { TokenGrid, TokenGridSkeleton } from "@/components/token/token-grid";
import {
  PMSection,
  PMSectionSkeleton,
} from "@/components/prediction-markets";

export const dynamic = "force-dynamic";

/**
 * Homepage displaying trending tokens and prediction markets.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.9]">
            Trending
          </h1>
          <p className="mt-6 text-white/40 text-lg max-w-md">
            Real-time data on Solana&apos;s most active tokens. Verified content. Live prices.
          </p>
        </div>
      </section>

      {/* Trending Tokens */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<TokenGridSkeleton />}>
            <TokenGrid />
          </Suspense>
        </div>
      </section>

      {/* Prediction Markets */}
      <Suspense fallback={<PMSectionSkeleton />}>
        <PMSection />
      </Suspense>
    </div>
  );
}
