export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-20 w-64 bg-white/15 rounded-xl animate-pulse mb-6" />
          <div className="h-6 w-80 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 h-48">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/15 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-white/15 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-8 bg-white/10 rounded animate-pulse" />
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

