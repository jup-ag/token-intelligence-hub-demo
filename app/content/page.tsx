import { Suspense } from "react";
import { ContentFeedClient } from "@/components/content/content-feed-client";

export const dynamic = "force-dynamic";

function ContentSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse break-inside-avoid mb-4" />
      ))}
    </div>
  );
}

export default function ContentFeedPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-semibold tracking-tight">
            Content
          </h1>
          <p className="mt-4 text-white/40 text-lg">
            Verified intelligence from across the ecosystem
          </p>
        </div>
      </section>

      {/* Feed */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<ContentSkeleton />}>
            <ContentFeedClient />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
