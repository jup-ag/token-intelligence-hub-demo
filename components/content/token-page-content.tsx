"use client";

import { Badge } from "@/components/ui/badge";
import { TweetEmbed } from "@/components/content/tweet-embed";
import { type TokenContent } from "@/types/jupiter";

interface TokenPageContentProps {
  content: TokenContent;
}

/**
 * Simplified content display for token detail pages.
 * 
 * Unlike ContentCard (for content feed), this doesn't show:
 * - Token image/name (we're already on the token page)
 * - "View →" link (already viewing)
 * - Redundant headers
 * 
 * Just clean, focused content.
 */
export function TokenPageContent({ content }: TokenPageContentProps) {
  const isTweetUrl = content.type === "tweet" && content.content.startsWith("http");

  // Tweet: Minimal wrapper, let tweet dictate width
  if (isTweetUrl) {
    return (
      <div className="[&>div]:!m-0 [&_.react-tweet-theme]:!m-0">
        <TweetEmbed url={content.content} />
      </div>
    );
  }

  // Text content: Simple card
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <p className="text-sm text-white/80 leading-relaxed">
        {content.content}
      </p>
      
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>by {content.submittedBy}</span>
        <div className="flex items-center gap-2">
          {content.citations && content.citations.length > 0 && (
            <span>{content.citations.length} sources</span>
          )}
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-green-500/30 bg-green-500/10 text-green-400">
            VRFD
          </Badge>
        </div>
      </div>
    </div>
  );
}

