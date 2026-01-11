export default function PortfolioLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-40 bg-white/15 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-56 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      {/* Holdings Skeleton */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 w-24 bg-white/15 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/15 animate-pulse" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-16 bg-white/15 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="h-5 w-20 bg-white/15 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positions Skeleton */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 w-32 bg-white/15 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/15 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-48 bg-white/15 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-5 w-20 bg-white/15 rounded animate-pulse" />
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

