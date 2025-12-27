import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <div className="space-y-4 max-w-3xl w-full">
          <Skeleton className="h-14 w-96 mx-auto bg-white/5" />
          <Skeleton className="h-6 w-64 mx-auto bg-white/5" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

