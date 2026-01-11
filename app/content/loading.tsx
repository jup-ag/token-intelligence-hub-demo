export default function ContentLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-48 bg-white/15 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-64 bg-white/10 rounded animate-pulse" />
        </div>
      </section>

      {/* Content Grid Skeleton */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 mb-4 break-inside-avoid"
                style={{ height: `${150 + (i % 3) * 80}px` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/15 animate-pulse" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-24 bg-white/15 rounded animate-pulse" />
                    <div className="h-2 w-16 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

