import { Badge } from "@/components/ui/badge";
import { FileText, Twitter, Newspaper, MessageSquare } from "lucide-react";
import { type TokenContent } from "@/types/jupiter";

interface ContentCardProps {
  content: TokenContent;
}

const contentTypeIcons = {
  text: FileText,
  tweet: Twitter,
  summary: Newspaper,
  news: MessageSquare,
};

const contentTypeColors = {
  text: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  tweet: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  summary: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  news: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

export function ContentCard({ content }: ContentCardProps) {
  const Icon = contentTypeIcons[content.type];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 space-y-5">
      {/* Header - Clean alignment */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-white/40" />
          <Badge variant="outline" className={contentTypeColors[content.type]}>
            {content.type}
          </Badge>
        </div>
        <Badge variant="outline" className="text-xs border-green-500/30 bg-green-500/10 text-green-400">
          VRFD
        </Badge>
      </div>

      {/* Content - Better readability */}
      <div className="leading-relaxed text-white/90 whitespace-pre-wrap">
        {content.content}
      </div>

      {/* Metadata - Clean footer */}
      <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
        <div className="text-white/60">
          By {content.submittedBy}
        </div>
        {content.source && (
          <div>
            <a
              href={content.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View source ↗
            </a>
          </div>
        )}
        {content.citations && content.citations.length > 0 && (
          <div className="text-white/40">
            {content.citations.length} citation{content.citations.length > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

