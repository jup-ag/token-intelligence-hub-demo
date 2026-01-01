import { Suspense } from "react";
import { SearchContent } from "@/components/search/search-content";

export const dynamic = "force-dynamic";

function SearchSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-14 w-full max-w-2xl mx-auto rounded-2xl bg-white/[0.03]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-semibold tracking-tight">
            Search
          </h1>
          <p className="mt-4 text-white/40 text-lg">
            Find any token by name, symbol, or address
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<SearchSkeleton />}>
            <SearchContent />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
