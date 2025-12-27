import { Suspense } from "react";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { SearchContent } from "@/components/search/search-content";
import { Skeleton } from "@/components/ui/skeleton";

// Force dynamic rendering for client-side nuqs usage
// Why: nuqs uses useSearchParams which requires runtime rendering
export const dynamic = "force-dynamic";

/**
 * Loading skeleton for search results
 * Shown while SearchContent component is loading
 */
function SearchSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-14 w-full bg-white/5" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 bg-white/5" />
        ))}
      </div>
    </div>
  );
}

/**
 * Search Page
 * 
 * Allows users to search for tokens by name, symbol, or mint address.
 * Uses URL state management (nuqs) for shareable search URLs.
 * 
 * Features:
 * - Client-side search with URL params
 * - Category filters (volume, gainers, losers)
 * - Real-time results from Tokens API
 */
export default function SearchPage() {
  return (
    <div className="min-h-screen">
      {/* Centered header for visual focus */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6">
        <div className="text-center space-y-3 max-w-2xl">
          <TypographyH1 className="text-5xl">Search</TypographyH1>
          <TypographyMuted className="text-base [&:not(:first-child)]:mt-0">
            Find tokens by name, symbol, or mint address
          </TypographyMuted>
        </div>
      </div>

      {/* Search content - max-width for optimal layout */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {/* Suspense required for nuqs usage
            Why: nuqs uses useSearchParams internally, which needs Suspense in App Router */}
        <Suspense fallback={<SearchSkeleton />}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}

