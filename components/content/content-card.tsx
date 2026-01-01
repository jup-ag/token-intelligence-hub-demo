"use client";

import { TweetEmbed } from "@/components/content/tweet-embed";
import { type TokenContent, type TokenInfo } from "@/types/jupiter";
import Link from "next/link";
import { useState } from "react";

interface ContentCardProps {
  content: TokenContent;
  tokenInfo?: TokenInfo;
}

function TokenImage({ tokenInfo, mint }: { tokenInfo?: TokenInfo; mint: string }) {
  const [imgError, setImgError] = useState(false);
  const hasLogo = tokenInfo?.logoURI && !tokenInfo.logoURI.includes('ipfs') && !imgError;
  
  if (hasLogo) {
    return (
      <img 
        src={tokenInfo.logoURI} 
        alt={tokenInfo.symbol}
        className="size-6 rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }
  
  const symbol = tokenInfo?.symbol || mint.slice(0, 2);
  return (
    <div className="size-6 rounded-full bg-white/[0.08] flex items-center justify-center text-[10px] font-medium text-white/50">
      {symbol.slice(0, 2).toUpperCase()}
    </div>
  );
}

const typeStyles = {
  text: "text-blue-400",
  tweet: "text-sky-400",
  summary: "text-purple-400",
  news: "text-orange-400",
};

export function ContentCard({ content, tokenInfo }: ContentCardProps) {
  const isTweetUrl = content.type === "tweet" && content.content.startsWith("http");

  // Tweet card
  if (isTweetUrl) {
    return (
      <div className="card-elevated rounded-2xl overflow-hidden">
        {/* Minimal header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TokenImage tokenInfo={tokenInfo} mint={content.mint} />
            <span className="text-sm font-medium text-white/80">
              {tokenInfo?.symbol || 'Token'}
            </span>
            <div className="size-1.5 rounded-full bg-[#30D158]" />
          </div>
          <Link 
            href={`/token/${content.mint}`}
            className="text-xs text-white/30 hover:text-white/60 transition-apple"
          >
            View
          </Link>
        </div>

        {/* Tweet */}
        <div className="[&>div]:!m-0 [&_.react-tweet-theme]:!m-0 border-t border-white/[0.04]">
          <TweetEmbed url={content.content} />
        </div>
      </div>
    );
  }

  // Text/Summary card
  const truncatedContent = content.content.length > 200 
    ? content.content.slice(0, 200) + "..." 
    : content.content;

  return (
    <Link href={`/token/${content.mint}`}>
      <div className="card-elevated rounded-2xl p-5 hover:bg-white/[0.05] transition-apple cursor-pointer">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <TokenImage tokenInfo={tokenInfo} mint={content.mint} />
          <span className="text-sm font-medium text-white/80">
            {tokenInfo?.symbol || content.mint.slice(0, 8)}
          </span>
          <span className={`text-xs ${typeStyles[content.type] || typeStyles.text}`}>
            {content.type}
          </span>
          <div className="flex-1" />
          <div className="size-1.5 rounded-full bg-[#30D158]" />
        </div>

        {/* Content */}
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {truncatedContent}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-white/30">
          <span>{content.submittedBy}</span>
          {content.citations && content.citations.length > 0 && (
            <span>{content.citations.length} sources</span>
          )}
        </div>
      </div>
    </Link>
  );
}
