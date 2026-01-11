export default function TokenLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-end">
            {/* Left - Token Info */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="size-14 rounded-2xl bg-white/15 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-7 w-24 bg-white/15 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-16 w-48 bg-white/15 rounded-lg animate-pulse mb-4" />
              <div className="h-8 w-32 rounded-full bg-white/10 animate-pulse" />
            </div>

            {/* Right - Chart */}
            <div className="h-[300px] rounded-2xl bg-white/[0.04] border border-white/10 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[320px_1fr] gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="h-48 rounded-2xl bg-white/[0.04] border border-white/10 p-6">
                <div className="h-4 w-20 bg-white/15 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-64 rounded-2xl bg-white/[0.04] border border-white/10 p-6">
                <div className="h-4 w-16 bg-white/15 rounded animate-pulse mb-4" />
                <div className="space-y-4">
                  <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-10 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-12 bg-white/15 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="h-6 w-24 bg-white/15 rounded animate-pulse mb-6" />
              <div className="columns-1 xl:columns-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-48 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 break-inside-avoid p-4 animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-white/15" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-24 bg-white/15 rounded" />
                        <div className="h-2 w-16 bg-white/10 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/10 rounded" />
                      <div className="h-3 bg-white/10 rounded" />
                      <div className="h-3 w-2/3 bg-white/10 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


