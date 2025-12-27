import { Suspense } from "react";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { ContentFeedClient } from "@/components/content/content-feed-client";
import { Skeleton } from "@/components/ui/skeleton";

// Force dynamic rendering for client-side nuqs usage
// Why: Content feed uses URL state management for pagination and filters
export const dynamic = "force-dynamic";

/**
 * Loading skeleton for content feed
 * Matches content card structure for smooth transitions
 */
function ContentFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 bg-white/5" />
      ))}
    </div>
  );
}

/**
 * Content Feed Page
 * 
 * Displays paginated feed of VRFD-verified content across all tokens.
 * Uses URL state for filters and pagination (shareable URLs).
 * 
 * Features:
 * - Filter by content type (summaries, news, tweets, posts)
 * - Pagination with URL state
 * - VRFD content attribution and sources
 * 
 * Design: Centered layout with max-width for readability
 */
export default function ContentFeedPage() {
  return (
    <div className="min-h-screen">
      {/* Centered header */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-6">
        <div className="text-center space-y-3 max-w-2xl">
          <TypographyH1 className="text-5xl">Content</TypographyH1>
          <TypographyMuted className="text-base [&:not(:first-child)]:mt-0">
            Verified content from Jupiter VRFD
          </TypographyMuted>
        </div>
      </div>

      {/* Content feed - max-width for optimal reading */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        {/* Suspense required for nuqs usage
            Why: nuqs uses useSearchParams internally, needs Suspense in App Router */}
        <Suspense fallback={<ContentFeedSkeleton />}>
          <ContentFeedClient />
        </Suspense>
      </div>
    </div>
  );
}

