export default function PredictionsLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-white/20 animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-72 bg-white/15 rounded-lg animate-pulse" />
              <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-white/15 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-14 bg-white/10 rounded-full animate-pulse" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
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
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

