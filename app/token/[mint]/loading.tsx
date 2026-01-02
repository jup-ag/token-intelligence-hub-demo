import { Skeleton } from "@/components/ui/skeleton";

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
                <Skeleton className="size-14 rounded-2xl bg-white/5" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-24 bg-white/5" />
                  <Skeleton className="h-4 w-32 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-16 w-48 bg-white/5 mb-4" />
              <Skeleton className="h-8 w-32 rounded-full bg-white/5" />
            </div>

            {/* Right - Chart */}
            <Skeleton className="h-[300px] rounded-2xl bg-white/5" />
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[320px_1fr] gap-12">
            {/* Left Column */}
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-2xl bg-white/5" />
              <Skeleton className="h-64 rounded-2xl bg-white/5" />
            </div>

            {/* Right Column */}
            <div>
              <Skeleton className="h-6 w-24 bg-white/5 mb-6" />
              <div className="columns-1 xl:columns-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-2xl bg-white/5 mb-6 break-inside-avoid" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

