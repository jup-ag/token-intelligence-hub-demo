"use client"; // JUSTIFIED: uses useContentFeedParams hook

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/content/content-card";
import { TypographyMuted } from "@/components/ui/typography";
import { useContentFeedParams } from "@/hooks/use-content-feed-params";
import { getContentFeed } from "@/lib/jupiter/content";
import { Skeleton } from "@/components/ui/skeleton";
import { type TokenContent } from "@/types/jupiter";

export function ContentFeedClient() {
  const [params, setParams] = useContentFeedParams();
  const [content, setContent] = useState<TokenContent[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.type]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const page = parseInt(params.page) || 1;
      const feedData = await getContentFeed(page, params.type);
      setContent(feedData.data);
      setHasMore(feedData.hasMore);
    } catch (error) {
      console.error("Failed to fetch content feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    const currentPage = parseInt(params.page) || 1;
    setParams({ page: String(currentPage + 1) });
  };

  const handlePrevPage = () => {
    const currentPage = parseInt(params.page) || 1;
    if (currentPage > 1) {
      setParams({ page: String(currentPage - 1) });
    }
  };

  const currentPage = parseInt(params.page) || 1;

  return (
    <div className="space-y-10">
      {/* Filters - Centered */}
      <div className="flex justify-center">
        <Select
          value={params.type}
          onValueChange={(value) => setParams({ type: value, page: "1" })}
        >
          <SelectTrigger className="w-56 bg-white/5 border-white/10">
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="summary">Summaries</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="tweet">Tweets</SelectItem>
            <SelectItem value="text">Community Posts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 bg-white/5" />
          ))}
        </div>
      ) : content.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-white/60">
            No content available for this filter
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      )}

      {/* Pagination - Clean and centered */}
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="ghost"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className="text-white/60 hover:text-white disabled:text-white/20"
        >
          ← Previous
        </Button>
        <div className="text-sm text-white/60">
          Page {currentPage}
        </div>
        <Button
          variant="ghost"
          onClick={handleNextPage}
          disabled={!hasMore || isLoading}
          className="text-white/60 hover:text-white disabled:text-white/20"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}

