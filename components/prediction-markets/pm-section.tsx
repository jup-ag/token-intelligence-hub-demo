import Link from "next/link";
import {
  getCryptoPredictionMarkets,
  type PMEvent,
} from "@/lib/jupiter/prediction-markets";
import { PMEventCard } from "./pm-event-card";

// =============================================================================
// Constants
// =============================================================================

const MAX_EVENTS_TO_FETCH = 10;
const MAX_EVENTS_TO_DISPLAY = 6;

// =============================================================================
// Helper Components
// =============================================================================

function SectionIcon() {
  return (
    <div className="size-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
      <svg
        className="w-4 h-4 text-white"
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
  );
}

function ChevronIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Homepage section displaying crypto prediction markets.
 * Shows up to 6 active events with tradable markets.
 */
export async function PMSection() {
  let events: PMEvent[] = [];

  try {
    events = await getCryptoPredictionMarkets(MAX_EVENTS_TO_FETCH);
  } catch (error) {
    console.error("Failed to fetch prediction markets:", error);
  }

  // Filter to events with open, tradable markets
  const activeEvents = events
    .filter(
      (event) =>
        event.isActive &&
        event.markets.some((m) => m.status === "open" && m.metadata.isTradable)
    )
    .slice(0, MAX_EVENTS_TO_DISPLAY);

  // Don't render if no events available
  if (activeEvents.length === 0) {
    return null;
  }

  return (
    <section className="px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <SectionIcon />
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Prediction Markets
              </h2>
              <p className="text-sm text-white/40">Bet on crypto outcomes</p>
            </div>
          </div>
          <Link
            href="/predictions"
            className="text-sm text-white/50 hover:text-white/80 transition-colors flex items-center gap-1"
          >
            View all
            <ChevronIcon />
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeEvents.map((event) => (
            <PMEventCard key={event.eventId} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Skeleton Component
// =============================================================================

/**
 * Loading skeleton for the prediction markets section.
 * Matches the layout of the section for smooth transitions.
 */
export function PMSectionSkeleton() {
  return (
    <section className="px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <div className="size-8 rounded-lg bg-white/20 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-white/15 rounded animate-pulse" />
            <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/15 rounded animate-pulse" />
                </div>
                <div className="h-6 w-14 bg-white/10 rounded-full animate-pulse" />
              </div>

              {/* Market Rows */}
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

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
