import { PMAnnouncementBar, type HotMarket } from "./pm-announcement-bar";

/**
 * Server component that fetches hot market data and renders the announcement bar.
 * This keeps the data fetching on the server for better performance.
 * 
 * Gracefully handles API errors (including 429 rate limits) by returning null.
 */
export async function PMAnnouncementBarServer() {
  let hotMarket: HotMarket | null = null;

  try {
    const response = await fetch(
      "https://prediction-market-api.jup.ag/api/v1/events?category=crypto&limit=5",
      { next: { revalidate: 300 } } // Cache for 5 minutes to reduce API calls
    );

    if (response.ok) {
      const data = await response.json();
      const events = data.data || [];

      // Find the hottest market (highest volume, tradable)
      for (const event of events) {
        const tradableMarkets = event.markets?.filter(
          (m: { status: string; metadata?: { isTradable?: boolean }; pricing?: { volume?: number } }) =>
            m.status === "open" && m.metadata?.isTradable
        );

        if (tradableMarkets?.length > 0) {
          // Sort by volume, pick highest
          const topMarket = tradableMarkets.sort(
            (a: { pricing?: { volume?: number } }, b: { pricing?: { volume?: number } }) =>
              (b.pricing?.volume || 0) - (a.pricing?.volume || 0)
          )[0];

          const probability = (topMarket.pricing?.buyYesPriceUsd || 0) / 10000;

          hotMarket = {
            eventTitle: event.metadata?.title || "Prediction Market",
            marketTitle: topMarket.metadata?.title || "Market",
            probability,
            marketId: topMarket.marketId,
          };
          break;
        }
      }
    }
    // Silently handle non-ok responses (429 rate limit, etc.)
  } catch {
    // Silently fail - announcement bar is optional
  }

  return <PMAnnouncementBar hotMarket={hotMarket} />;
}

