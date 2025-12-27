import { parseAsString, parseAsArrayOf, type UrlKeys } from "nuqs";

// Search page params
export const searchParams = {
  query: parseAsString.withDefault(""),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  category: parseAsString.withDefault("all"),
};

// Short URL keys for clean sharing (team standard)
export const searchUrlKeys: UrlKeys<typeof searchParams> = {
  query: "q",
  tags: "t",
  category: "c",
};

// Content feed params
export const contentFeedParams = {
  type: parseAsString.withDefault("all"),
  page: parseAsString.withDefault("1"),
};

export const contentFeedUrlKeys: UrlKeys<typeof contentFeedParams> = {
  type: "t",
  page: "p",
};

