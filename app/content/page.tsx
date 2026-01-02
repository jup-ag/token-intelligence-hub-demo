import { Suspense } from "react";
import { ContentCard } from "@/components/content/content-card";
import { getContentFeed } from "@/lib/jupiter/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ContentPageProps {
  searchParams: Promise<{ type?: string; page?: string }>;
}

const contentTypes = [
  { value: "all", label: "All" },
  { value: "tweet", label: "Tweets" },
  { value: "news", label: "News" },
  { value: "summary", label: "Summaries" },
];

async function ContentFeed({ type, page }: { type: string; page: number }) {
  const feedData = await getContentFeed(page, type);
  const content = feedData.data || [];
  const tokensMap = feedData.tokensMap || {};

  if (content.length === 0) {
    return <p className="text-white/30 py-20">No content available</p>;
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {content.map((item) => (
          <div key={item.id} className="break-inside-avoid mb-4">
            <ContentCard content={item} tokenInfo={tokensMap[item.mint]} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-8 pt-8">
        <Link
          href={`/content?type=${type}&page=${Math.max(1, page - 1)}`}
          className={`text-sm transition-apple ${page === 1 ? "text-white/10 pointer-events-none" : "text-white/40 hover:text-white"}`}
        >
          Previous
        </Link>
        <span className="text-sm text-white/30 tabular-nums">{page}</span>
        <Link
          href={`/content?type=${type}&page=${page + 1}`}
          className={`text-sm transition-apple ${!feedData.hasMore ? "text-white/10 pointer-events-none" : "text-white/40 hover:text-white"}`}
        >
          Next
        </Link>
      </div>
    </>
  );
}

function ContentSkeleton() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-64 rounded-2xl bg-white/[0.03] animate-pulse break-inside-avoid mb-4" />
      ))}
    </div>
  );
}

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const { type = "all", page = "1" } = await searchParams;
  const pageNum = parseInt(page) || 1;

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-semibold tracking-tight">Content</h1>
          <p className="mt-4 text-white/40 text-lg">Verified intelligence from across the ecosystem</p>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Filter tabs - using Link for server-side navigation */}
          <div className="flex items-center gap-2">
            {contentTypes.map((t) => (
              <Link
                key={t.value}
                href={`/content?type=${t.value}&page=1`}
                className={`px-4 py-2 rounded-full text-sm transition-apple ${
                  type === t.value
                    ? "bg-white text-black"
                    : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <Suspense fallback={<ContentSkeleton />}>
            <ContentFeed type={type} page={pageNum} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
