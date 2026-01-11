import { Suspense } from "react";
import {
  getCryptoPredictionMarkets,
  type PMEvent,
} from "@/lib/jupiter/prediction-markets";
import { PMEventCard } from "@/components/prediction-markets";

export const dynamic = "force-dynamic";

// =============================================================================
// Constants
// =============================================================================

const MAX_EVENTS_TO_FETCH = 20;

// =============================================================================
// Server Components
// =============================================================================

/**
 * Fetches and displays all active prediction markets.
 */
async function PredictionMarketsGrid() {
  let events: PMEvent[] = [];

  try {
    events = await getCryptoPredictionMarkets(MAX_EVENTS_TO_FETCH);
  } catch (error) {
    console.error("Failed to fetch prediction markets:", error);
  }

  const activeEvents = events.filter(
    (event) =>
      event.isActive &&
      event.markets.some((m) => m.status === "open" && m.metadata.isTradable)
  );

  if (activeEvents.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-white/40">No active prediction markets available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {activeEvents.map((event) => (
        <PMEventCard key={event.eventId} event={event} />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for the markets grid.
 */
function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/15 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-white/15 rounded animate-pulse" />
            </div>
            <div className="h-6 w-14 bg-white/10 rounded-full animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
              >
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="h-4 w-10 bg-white/15 rounded animate-pulse" />
                  <div className="flex gap-1">
                    <div className="h-8 w-12 bg-[#30D158]/20 rounded-md animate-pulse" />
                    <div className="h-8 w-12 bg-[#FF453A]/20 rounded-md animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Page Component
// =============================================================================

export default function PredictionsPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Prediction Markets
              </h1>
              <p className="text-white/40 text-lg mt-1">
                Trade on crypto outcomes
              </p>
            </div>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <span className="text-white/30">Powered by </span>
              <span className="text-white/70">Jupiter PM × Kalshi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<GridSkeleton />}>
            <PredictionMarketsGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
