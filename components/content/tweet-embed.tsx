import { Tweet } from "react-tweet";

interface TweetEmbedProps {
  url: string;
}

/**
 * Tweet Embed Component
 * 
 * Embeds a tweet using react-tweet library for reliable rendering.
 * Displays full tweet content with images, user info, and engagement.
 * 
 * @param url - Twitter/X tweet URL
 */
export function TweetEmbed({ url }: TweetEmbedProps) {
  // Extract tweet ID from URL
  const getTweetId = (tweetUrl: string) => {
    const match = tweetUrl.match(/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const tweetId = getTweetId(url);

  if (!tweetId) {
    // Fallback if can't parse tweet ID
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all text-sm text-blue-400"
      >
        View tweet ↗
      </a>
    );
  }

  return (
    <div className="w-full [&>div]:!m-0">
      <Tweet id={tweetId} />
    </div>
  );
}

