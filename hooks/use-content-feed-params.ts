"use client"; // JUSTIFIED: wraps useQueryStates which uses useSearchParams

import { useQueryStates, type Options } from "nuqs";
import { contentFeedParams, contentFeedUrlKeys } from "@/lib/nuqs";

// Wrap nuqs with project defaults (team pattern)
export function useContentFeedParams(options?: Partial<Options>) {
  return useQueryStates(contentFeedParams, {
    urlKeys: contentFeedUrlKeys,
    ...options,
  });
}

